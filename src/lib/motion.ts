import { useEffect, useState } from 'react';

export const motionDuration = {
  fast: 0.28,
  hover: 0.42,
  reveal: 0.78,
  section: 0.9,
  hero: 1,
  slow: 1.2,
  cinematic: 2.2,
};

export const motionEase = {
  soft: 'power2.out',
  smooth: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
};

export const motionStagger = {
  tight: 0.06,
  standard: 0.1,
  loose: 0.16,
};

// Android Chrome reports `prefers-reduced-motion: reduce` whenever the OS
// battery saver is on, which silently stripped the hero video, Lenis and every
// GSAP animation for those visitors — the site looked broken in Chrome while
// other browsers on the same phone were fine. The reference experience
// (bat.archi) never gates on this query, so we deliberately ignore it.
const HONOR_REDUCED_MOTION = false;

export const prefersReducedMotion = () => (
  HONOR_REDUCED_MOTION &&
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
);

export const motionDurationFor = (duration: number) => (
  prefersReducedMotion() ? 0.01 : duration
);

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!HONOR_REDUCED_MOTION || typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
