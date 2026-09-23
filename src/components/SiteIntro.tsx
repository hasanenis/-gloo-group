import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import animatedLogo from '../assets/branding/igloo-intro-animated.svg';
import staticLogo from '../assets/branding/igloo-intro-logo.png';
import { useLiteMotion, usePrefersReducedMotion } from '../lib/motion';

type SiteIntroProps = {
  onComplete: () => void;
  onReady: () => void;
};

const LOGO_REVEAL_MS = 6300;
const HERO_GRACE_MS = 400;
const HARD_STOP_MS = 8500;

export default function SiteIntro({ onComplete, onReady }: SiteIntroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const liteMotion = useLiteMotion();
  const staticMode = prefersReducedMotion || liteMotion;
  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const startedRef = useRef(false);
  const exitingRef = useRef(false);
  const completedRef = useRef(false);
  const heroReadyRef = useRef(false);
  const waitingForHeroRef = useRef(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const fadeOut = useCallback((fast = false) => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    waitingForHeroRef.current = false;
    const element = containerRef.current;
    if (!element) {
      finish();
      return;
    }
    tweenRef.current = gsap.to(element, {
      autoAlpha: 0,
      duration: fast || staticMode ? 0.18 : 0.7,
      ease: 'power2.inOut',
      onComplete: finish,
    });
  }, [finish, staticMode]);

  const requestExit = useCallback((fast = false) => {
    if (fast || heroReadyRef.current) {
      fadeOut(fast);
      return;
    }
    if (waitingForHeroRef.current) return;
    waitingForHeroRef.current = true;
    timersRef.current.push(window.setTimeout(() => fadeOut(), HERO_GRACE_MS));
  }, [fadeOut]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const hero = new Image();
    const markHeroReady = () => {
      heroReadyRef.current = true;
      if (waitingForHeroRef.current) fadeOut();
    };
    hero.onload = markHeroReady;
    hero.onerror = markHeroReady;
    hero.src = '/media/hero-poster.webp';
    if (hero.complete) markHeroReady();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestExit(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    timersRef.current.push(window.setTimeout(() => requestExit(true), HARD_STOP_MS));

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      hero.onload = null;
      hero.onerror = null;
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      tweenRef.current?.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [fadeOut, requestExit]);

  const onLogoReady = (failed = false) => {
    if (startedRef.current) return;
    startedRef.current = true;
    onReady();
    timersRef.current.push(window.setTimeout(
      () => requestExit(),
      failed || staticMode ? 550 : LOGO_REVEAL_MS,
    ));
  };

  return (
    <div
      ref={containerRef}
      className="intro-backdrop fixed inset-0 z-[140] flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Igloo Construction"
    >
      <img
        src={logoFailed || staticMode ? staticLogo : animatedLogo}
        alt="Igloo Construction"
        width={452}
        height={137}
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-[min(84vw,740px)] max-w-full object-contain"
        onLoad={() => onLogoReady()}
        onError={() => {
          setLogoFailed(true);
          onLogoReady(true);
        }}
      />
    </div>
  );
}
