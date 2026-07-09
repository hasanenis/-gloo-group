/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SiteIntro from './components/SiteIntro';
import GlobalCursor from './components/GlobalCursor';
import Header from './components/Header';
import AssistantDock from './components/AssistantDock';
import SmoothScrollProvider, { useLenis } from './components/SmoothScrollProvider';
import { heroSlides } from './data/projects';
import { LocaleProvider } from './i18n';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectsDemo = lazy(() => import('./pages/ProjectsDemo'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const BatProjectsIndex = lazy(() => import('./pages/BatProjectsIndex'));
const BatProjectDemo = lazy(() => import('./pages/BatProjectDemo'));

const INTRO_VEIL_HOLD_MS = 250;
const INTRO_VEIL_SLIDE_MS = 1150;
const INTRO_SEEN_KEY = 'igloo:intro-seen';

function ScrollManager() {
  const location = useLocation();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (location.pathname.startsWith('/bat-demo')) return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!location.hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  }, [lenis, location.pathname, location.hash, location.key]);

  return null;
}

function AppShellContent() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(
    () =>
      location.pathname === '/' &&
      sessionStorage.getItem(INTRO_SEEN_KEY) !== 'true',
  );
  const [showIntroVeil, setShowIntroVeil] = useState(false);
  const [introVeilVisible, setIntroVeilVisible] = useState(true);
  const [introVeilTone, setIntroVeilTone] = useState<'black' | 'page'>('black');
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== '/' && showIntro) {
      setShowIntro(false);
    }
  }, [location.pathname, showIntro, showIntroVeil]);

  // Warm the core route chunks up front so a same-session "→ Home" navigation
  // never has to wait on a fresh dynamic import() before it can reveal.
  useEffect(() => {
    void import('./pages/Home');
    void import('./pages/ProjectsDemo');
    void import('./pages/ProjectDetail');
    void import('./pages/Contact');
  }, []);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = location.pathname;

    if (location.pathname === '/' && previousPathname !== '/') {
      setIntroVeilTone('page');
      setIntroVeilVisible(true);
      setShowIntroVeil(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!showIntroVeil) return;

    // The first-load (black) veil already awaited the hero image before it was
    // shown, so Home is guaranteed ready — a fixed hold+slide is safe there.
    if (introVeilTone === 'black') {
      const startSlideTimer = window.setTimeout(() => {
        setIntroVeilVisible(false);
      }, INTRO_VEIL_HOLD_MS);

      const removeVeilTimer = window.setTimeout(() => {
        setShowIntroVeil(false);
        setIntroVeilVisible(true);
      }, INTRO_VEIL_HOLD_MS + INTRO_VEIL_SLIDE_MS);

      return () => {
        window.clearTimeout(startSlideTimer);
        window.clearTimeout(removeVeilTimer);
      };
    }

    // The route-to-Home (page) veil can't assume Home's lazy chunk has already
    // loaded — e.g. landing straight on /projects then clicking Home. Wait for
    // Home's own hero marker to actually be in the DOM before revealing, so the
    // curtain never lifts onto stale content from the page we're leaving.
    let cancelled = false;
    let rafId = 0;
    let revealTimer = 0;
    let removeTimer = 0;
    const startedAt = performance.now();
    const MAX_WAIT_MS = 4000;

    const checkReady = () => {
      if (cancelled) return;
      const ready = document.querySelector('[data-guide-section="hero"]');
      const waited = performance.now() - startedAt;

      if (ready || waited >= MAX_WAIT_MS) {
        const holdRemaining = Math.max(0, INTRO_VEIL_HOLD_MS - waited);
        revealTimer = window.setTimeout(() => {
          if (cancelled) return;
          setIntroVeilVisible(false);
          removeTimer = window.setTimeout(() => {
            if (cancelled) return;
            setShowIntroVeil(false);
            setIntroVeilVisible(true);
          }, INTRO_VEIL_SLIDE_MS);
        }, holdRemaining);
        return;
      }

      rafId = requestAnimationFrame(checkReady);
    };

    rafId = requestAnimationFrame(checkReady);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(revealTimer);
      window.clearTimeout(removeTimer);
    };
  }, [showIntroVeil, introVeilTone]);

  const handleIntroComplete = async () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, 'true');

    const firstHeroImage = heroSlides[0]?.image;

    if (!firstHeroImage) {
      setShowIntro(false);
      return;
    }

    await new Promise<void>((resolve) => {
      const image = new Image();

      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = firstHeroImage;

      if (image.complete) {
        resolve();
      }
    });

    setShowIntro(false);
    setIntroVeilTone('black');
    setShowIntroVeil(true);
  };

  const isBatDemoRoute = location.pathname.startsWith('/bat-demo');
  const showGlobalCursor = !isBatDemoRoute && location.pathname !== '/';

  useEffect(() => {
    if (!isBatDemoRoute) {
      document.documentElement.classList.remove(
        'bat-demo-route-transitioning',
      );
    }
  }, [isBatDemoRoute]);

  return (
    <>
      {showGlobalCursor && <GlobalCursor />}
      {!showIntro && !isBatDemoRoute && <Header />}
      {!showIntro && !isBatDemoRoute && <AssistantDock />}
      {location.pathname === '/' && showIntro && (
        <SiteIntro onComplete={handleIntroComplete} />
      )}
      {showIntroVeil && (
        <div
          className="fixed inset-0 z-[139] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full w-full transition-transform will-change-transform"
            style={{
              backgroundColor: introVeilTone === 'black' ? '#000000' : 'var(--igloo-bg)',
              transform: introVeilVisible ? 'translateY(0%)' : 'translateY(-100%)',
              transitionDuration: `${INTRO_VEIL_SLIDE_MS}ms`,
              transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.2, 1)',
            }}
          />
        </div>
      )}
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<ProjectsDemo />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/projects1" element={<Projects />} />
          <Route path="/bat-demo/projects" element={<BatProjectsIndex />} />
          <Route path="/bat-demo/projects/:slug" element={<BatProjectDemo />} />
        </Routes>
      </Suspense>
    </>
  );
}

function RouteFallback() {
  return <div className="min-h-screen w-full bg-[color:var(--igloo-bg)]" aria-hidden="true" />;
}

function AppShell() {
  return <AppShellContent />;
}

export default function App() {
  return (
    <LocaleProvider>
      <Router>
        <SmoothScrollProvider>
          <AppShell />
        </SmoothScrollProvider>
      </Router>
    </LocaleProvider>
  );
}
