import { useEffect, useState, type RefObject } from 'react';

/** Keep mounted state/geometry, but stop background work outside the viewport. */
export function useSectionActivity(ref: RefObject<HTMLElement | null>, rootMargin = '0px') {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = !('IntersectionObserver' in window);
    const sync = () => setActive(visible && document.visibilityState !== 'hidden');
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin }) : undefined;
    observer?.observe(element);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref, rootMargin]);
  return active;
}
