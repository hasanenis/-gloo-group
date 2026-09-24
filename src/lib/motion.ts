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

export const prefersReducedMotion = () => (
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
);

export const motionDurationFor = (duration: number) => (
  prefersReducedMotion() ? 0.01 : duration
);

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

type NetworkInformation = EventTarget & {
  effectiveType?: string;
  saveData?: boolean;
};

function isLiteMotionEnvironment() {
  if (typeof navigator === 'undefined') return false;

  const device = navigator as Navigator & {
    connection?: NetworkInformation;
    deviceMemory?: number;
  };
  const connection = device.connection;

  return Boolean(
    connection?.saveData ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4),
  );
}

function isSaveDataEnabled() {
  if (typeof navigator === 'undefined') return false;
  const device = navigator as Navigator & { connection?: NetworkInformation };
  return device.connection?.saveData === true;
}

export function useSaveDataEnabled() {
  const [enabled, setEnabled] = useState(isSaveDataEnabled);

  useEffect(() => {
    const device = navigator as Navigator & { connection?: NetworkInformation };
    const connection = device.connection;
    if (!connection) return;

    const update = () => setEnabled(isSaveDataEnabled());
    connection.addEventListener('change', update);
    return () => connection.removeEventListener('change', update);
  }, []);

  return enabled;
}

export function useLiteMotion() {
  const [lite, setLite] = useState(isLiteMotionEnvironment);

  useEffect(() => {
    const device = navigator as Navigator & { connection?: NetworkInformation };
    const connection = device.connection;
    if (!connection) return;

    const update = () => setLite(isLiteMotionEnvironment());
    connection.addEventListener('change', update);
    return () => connection.removeEventListener('change', update);
  }, []);

  return lite;
}
