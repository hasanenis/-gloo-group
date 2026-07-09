import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Lenis, { type LenisOptions } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../lib/motion';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollContextValue = {
  lenis: Lenis | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenis() {
  return useContext(SmoothScrollContext).lenis;
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('loaded');

    return () => {
      document.documentElement.classList.remove('loaded');
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setLenis(null);
      return;
    }

    const options: LenisOptions = {
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -90 },
      prevent: (node) => Boolean(node.closest('[data-lenis-prevent]')),
    };

    const instance = new Lenis(options);
    document.documentElement.classList.add('lenis', 'lenis-smooth');
    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time: number) => instance.raf(time * 1000);

    instance.on('scroll', updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    const refreshTimer = window.setTimeout(() => {
      instance.resize();
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      window.clearTimeout(refreshTimer);
      instance.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(raf);
      instance.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
