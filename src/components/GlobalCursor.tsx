import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../lib/motion';

type CursorState = 'dot' | 'card';
type CursorVariant = 'default' | 'slider';

function getCursorSize(variant: CursorVariant) {
  if (typeof window === 'undefined') {
    return variant === 'slider' ? 92 : 88;
  }

  if (variant === 'slider') {
    if (window.innerWidth < 768) return 64;
    if (window.innerWidth < 1024) return 78;
    return 92;
  }

  if (window.innerWidth < 768) return 72;
  return 88;
}

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<CursorState>('dot');
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldUseCustomCursor = hasFinePointer && !prefersReducedMotion;
  const isArrowCursor = cursorLabel === 'PREV' || cursorLabel === 'NEXT';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handleChange = () => setHasFinePointer(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('custom-cursor-enabled', shouldUseCustomCursor);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, [shouldUseCustomCursor]);

  useEffect(() => {
    if (!shouldUseCustomCursor || !cursorRef.current) return;

    const el = cursorRef.current;
    const label = labelRef.current;

    gsap.set(el, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      width: 14,
      height: 14,
      opacity: 0,
      scale: 1,
    });
    if (label) gsap.set(label, { autoAlpha: 0, scale: 0.75 });

    const moveX = gsap.quickTo(el, 'x', { duration: 0.16, ease: 'power3.out' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.16, ease: 'power3.out' });

    const expandCard = (text: string, variant: CursorVariant) => {
      const cursorSize = getCursorSize(variant);
      if (label) label.textContent = text;
      setCursorLabel(text);
      setCursorVariant(variant);
      if (stateRef.current === 'card') {
        gsap.to(el, {
          width: cursorSize,
          height: cursorSize,
          borderRadius: variant === 'slider' ? '38%' : '999px',
          duration: 0.28,
          ease: variant === 'slider' ? 'elastic.out(1, 0.55)' : 'power3.out',
          overwrite: 'auto',
        });
        return;
      }
      stateRef.current = 'card';
      gsap.to(el, {
        width: cursorSize,
        height: cursorSize,
        borderRadius: variant === 'slider' ? '38%' : '999px',
        opacity: 1,
        duration: 0.28,
        ease: variant === 'slider' ? 'elastic.out(1, 0.55)' : 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(label, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const shrink = () => {
      if (stateRef.current === 'dot') return;
      stateRef.current = 'dot';
      setCursorLabel('');
      setCursorVariant('default');
      gsap.to(el, {
        width: 14,
        height: 14,
        borderRadius: '999px',
        duration: 0.22,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(label, {
        autoAlpha: 0,
        scale: 0.75,
        duration: 0.12,
        ease: 'power2.in',
        overwrite: true,
      });
    };

    const syncTarget = (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null;
      const ignored = element?.closest<HTMLElement>('[data-cursor-ignore]');

      if (ignored) {
        shrink();
        return;
      }

      const card = element?.closest<HTMLElement>('[data-cursor-card]');

      if (card) {
        expandCard(
          card.dataset.cursorLabel ?? 'VIEW',
          card.dataset.cursorVariant === 'slider' ? 'slider' : 'default'
        );
      } else {
        shrink();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      gsap.to(el, { opacity: 1, duration: 0.12, overwrite: 'auto' });
      syncTarget(event.target);
    };

    const onPointerOver = (event: PointerEvent) => {
      syncTarget(event.target);
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>('[data-cursor-card]');

      if (!card) return;

      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (relatedTarget && card.contains(relatedTarget)) return;

      shrink();
    };

    const onLeave = () => {
      shrink();
      gsap.to(el, { opacity: 0, duration: 0.18 });
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      gsap.killTweensOf([el, label]);
    };
  }, [shouldUseCustomCursor]);

  if (!shouldUseCustomCursor) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-custom-cursor
      className={`pointer-events-none fixed left-0 top-0 z-[9999999] flex h-[14px] w-[14px] items-center justify-center bg-[#e1251b] opacity-0 ${cursorVariant === 'slider' ? 'shadow-[0_0_0_8px_rgba(225,37,27,0.08)] md:shadow-[0_0_0_10px_rgba(225,37,27,0.08)] lg:shadow-[0_0_0_12px_rgba(225,37,27,0.08)]' : 'rounded-full'}`}
      style={{ willChange: 'transform' }}
    >
      {cursorVariant === 'slider' ? (
        <>
          <span className="absolute inset-[-6px] rounded-[42%] border border-[#e1251b]/35 animate-[cursor-orbit_5.4s_linear_infinite] md:inset-[-7px] lg:inset-[-8px]" />
          <span className="absolute inset-[-12px] rounded-[46%] border border-[#e1251b]/20 animate-[cursor-orbit-reverse_7s_linear_infinite] md:inset-[-14px] lg:inset-[-16px]" />
        </>
      ) : null}
      <span
        ref={labelRef}
        className={`select-none text-[10px] font-bold uppercase tracking-[0.18em] text-white md:text-[11px] lg:text-[12px] ${isArrowCursor ? 'hidden' : ''}`}
      />
      {isArrowCursor ? (
        cursorLabel === 'PREV' ? (
          <ArrowLeft className="h-4 w-4 text-white md:h-5 md:w-5 lg:h-6 lg:w-6" strokeWidth={1.75} />
        ) : (
          <ArrowRight className="h-4 w-4 text-white md:h-5 md:w-5 lg:h-6 lg:w-6" strokeWidth={1.75} />
        )
      ) : null}
    </div>
  );
}
