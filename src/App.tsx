/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Header from './components/Header';
import SeoManager from './components/SeoManager';
import SmoothScrollProvider, { useLenis } from './components/SmoothScrollProvider';
import { heroSlides } from './data/projects';
import { LocaleProvider, localizedPath, useLocale } from './i18n';
import { getPageContent } from './content';
import { initAutoFitText } from './lib/autoFitText';
import './styles/site-page-transition.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectsDemo = lazy(() => import('./pages/ProjectsDemo'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const SiteIntro = lazy(() => import('./components/SiteIntro'));
const GlobalCursor = lazy(() => import('./components/GlobalCursor'));
const AssistantDock = lazy(() => import('./components/AssistantDock'));

const INTRO_VEIL_HOLD_MS = 250;
const INTRO_VEIL_SLIDE_MS = 1150;
const INTRO_SEEN_KEY = 'igloo:intro-seen';

function isHomeRoute(pathname: string) {
  return pathname === '/' || /^\/(?:en|fr|tr|ar)\/?$/u.test(pathname);
}

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
  const { locale } = useLocale();
  const [showIntro, setShowIntro] = useState(
    () =>
      isHomeRoute(location.pathname) &&
      sessionStorage.getItem(INTRO_SEEN_KEY) !== 'true',
  );
  const [showIntroVeil, setShowIntroVeil] = useState(false);
  const [introVeilVisible, setIntroVeilVisible] = useState(true);
  const [introVeilTone, setIntroVeilTone] = useState<'black' | 'page'>('black');
  const [assistantReady, setAssistantReady] = useState(false);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (!isHomeRoute(location.pathname) && showIntro) {
      setShowIntro(false);
    }
  }, [location.pathname, showIntro, showIntroVeil]);

  // Warm the core route chunks up front so a same-session "→ Home" navigation
  // never has to wait on a fresh dynamic import() before it can reveal.
  // Translated copy (FR/TR/AR) runs longer than the English the layout was
  // designed for — shrink any text element that overflows its box instead of
  // letting it clip or break the layout. Reacts to locale switches, route
  // changes and resizes on its own.
  useEffect(() => initAutoFitText(), []);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = location.pathname;

    if (
      isHomeRoute(location.pathname)
      && !isHomeRoute(previousPathname)
      && !document.documentElement.classList.contains('site-route-transitioning')
    ) {
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
    if (showIntro || isBatDemoRoute) {
      setAssistantReady(false);
      return;
    }

    // The assistant is useful after the page is usable, but it is not part of
    // the first viewport. Delay its chunk and initialization until the main
    // content has had a chance to paint.
    const timer = window.setTimeout(() => setAssistantReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, [isBatDemoRoute, showIntro]);

  useEffect(() => {
    if (!isBatDemoRoute) {
      document.documentElement.classList.remove(
        'bat-demo-route-transitioning',
      );
    }
  }, [isBatDemoRoute]);

  return (
    <Fragment key={locale}>
      <SeoManager />
      <Suspense fallback={null}>
        {showGlobalCursor && <GlobalCursor />}
        {!showIntro && !isBatDemoRoute && assistantReady && <AssistantDock />}
        {isHomeRoute(location.pathname) && showIntro && (
          <SiteIntro onComplete={handleIntroComplete} />
        )}
      </Suspense>
      {!showIntro && !isBatDemoRoute && <Header />}
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
          <Route path="/" element={<LocaleRootRedirect />} />
          <Route path="/:locale" element={<LocaleGuard><Home /></LocaleGuard>} />
          <Route path="/:locale/about" element={<LocaleGuard><About /></LocaleGuard>} />
          <Route path="/:locale/contact" element={<LocaleGuard><Contact /></LocaleGuard>} />
          <Route path="/:locale/projects" element={<LocaleGuard><ProjectsDemo /></LocaleGuard>} />
          <Route path="/:locale/projects/:slug" element={<LocaleGuard><ProjectDetail /></LocaleGuard>} />
          <Route path="/:locale/services" element={<LocaleGuard><Services /></LocaleGuard>} />
          <Route path="/:locale/services/:slug" element={<LocaleGuard><ServiceDetail /></LocaleGuard>} />
          <Route path="/:locale/404" element={<LocaleGuard><LocalizedNotFound /></LocaleGuard>} />
          <Route path="/:locale/*" element={<LocaleGuard><LocalizedNotFound /></LocaleGuard>} />

          {/* Pre-localization URLs remain resolvable while search engines and
           * users are moved to their locale-prefixed canonical equivalent. */}
          <Route path="/about" element={<LegacyRouteRedirect />} />
          <Route path="/contact" element={<LegacyRouteRedirect />} />
          <Route path="/projects" element={<LegacyRouteRedirect />} />
          <Route path="/projects/:slug" element={<LegacyRouteRedirect />} />
          <Route path="/services" element={<LegacyRouteRedirect />} />
          <Route path="/services/:slug" element={<LegacyRouteRedirect />} />
          <Route path="/projects1" element={<LegacyRouteRedirect />} />
          <Route path="/bat-demo/*" element={<LegacyRouteRedirect />} />
          <Route path="*" element={<LegacyRouteRedirect />} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

function RouteFallback() {
  return <div className="min-h-screen w-full bg-[color:var(--igloo-bg)]" aria-hidden="true" />;
}

function LocaleGuard({ children }: { children: ReactNode }) {
  const { locale: segment } = useParams();
  if (!segment || !['en', 'fr', 'tr', 'ar'].includes(segment.toLowerCase())) {
    return <Navigate replace to="/en/404" />;
  }
  return <>{children}</>;
}

function LocaleRootRedirect() {
  const { locale } = useLocale();
  return <Navigate replace to={localizedPath(locale, '/')} />;
}

function LegacyRouteRedirect() {
  const { locale } = useLocale();
  const location = useLocation();
  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  const serviceMatch = location.pathname.match(/^\/services\/([^/]+)\/?$/);
  const target = projectMatch
    ? `/projects/${projectMatch[1]}`
    : serviceMatch
      ? `/services/${serviceMatch[1]}`
      : location.pathname === '/about'
        ? '/about'
      : location.pathname === '/contact'
        ? '/contact'
        : location.pathname === '/projects'
          ? '/projects'
          : location.pathname === '/services'
            ? '/services'
          : '/404';
  return <Navigate replace to={localizedPath(locale, target)} />;
}

function LocalizedNotFound() {
  const { locale } = useLocale();
  const content = getPageContent<{ heading: string; cta: string }>('not-found', locale).content;
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#c22026]">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">{content.heading}</h1>
        <p className="mt-4 text-base text-black/60">{content.cta}</p>
      </div>
    </main>
  );
}

function AppShell() {
  return <AppShellContent />;
}

export default function App() {
  return (
    <Router>
      <LocaleProvider>
        <SmoothScrollProvider>
          <AppShell />
        </SmoothScrollProvider>
      </LocaleProvider>
    </Router>
  );
}
