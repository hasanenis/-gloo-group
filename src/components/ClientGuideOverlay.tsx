import React, { useEffect, useState } from 'react';
import { Info, Minus, Plus } from 'lucide-react';

type GuideItem = {
  id: string;
  label: string;
  purpose: string;
  behavior: string;
};

type ClientGuideOverlayProps = {
  items: readonly GuideItem[];
};

export default function ClientGuideOverlay({ items }: ClientGuideOverlayProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (!items.length) return undefined;

    const sections = items
      .map((item) => ({
        id: item.id,
        element: document.querySelector<HTMLElement>(`[data-guide-section="${item.id}"]`),
      }))
      .filter((entry): entry is { id: string; element: HTMLElement } => entry.element !== null);

    if (!sections.length) return undefined;

    let rafId = 0;

    const updateActiveSection = () => {
      const viewportCenter = window.innerHeight * 0.45;
      let closestId = sections[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach(({ id, element }) => {
        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      });

      setActiveId((current) => (current === closestId ? current : closestId));
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [items]);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  if (!activeItem) return null;

  return (
    <aside className="fixed right-4 bottom-4 z-[60] w-[min(14rem,calc(100vw-3rem))] pointer-events-none">
      <div className="pointer-events-auto rounded-[1rem] border border-white/6 bg-black/28 text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-[7px] opacity-55 transition-all duration-300 hover:bg-black/56 hover:opacity-85">
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/6 text-[#e82a2e]">
              <Info className="h-3 w-3" strokeWidth={2.1} />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/38">
                Musteri Sunumu
              </p>
              <p className="truncate text-[11.5px] font-semibold tracking-[0.01em] text-white/80">
                {activeItem.label}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/7 bg-white/4 text-white/55 transition-colors hover:bg-white/8 hover:text-white/82"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Bilgi kutusunu genislet' : 'Bilgi kutusunu daralt'}
          >
            {collapsed ? <Plus className="h-3 w-3" strokeWidth={2.1} /> : <Minus className="h-3 w-3" strokeWidth={2.1} />}
          </button>
        </div>

        {!collapsed && (
          <div className="border-t border-white/7 px-2.5 pb-2.5 pt-2">
            <div className="mb-2 inline-flex rounded-full bg-white/5 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#ff4d4f]">
              Bu bolum ne anlatiyor?
            </div>

            <div className="space-y-2 text-[10.5px] leading-[1.5] text-white/64">
              <p>
                <span className="font-semibold text-white/86">Amac:</span> {activeItem.purpose}
              </p>
              <p>
                <span className="font-semibold text-white/86">Nasil calisir:</span> {activeItem.behavior}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
