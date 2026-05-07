/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import SiteIntro from './components/SiteIntro';
import { heroSlides } from './data/projects';

const INTRO_VEIL_HOLD_MS = 900;
const INTRO_VEIL_FADE_MS = 2200;
const INTRO_SEEN_KEY = 'igloo:intro-seen';

function ScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash, location.key]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(() => location.pathname === '/' && sessionStorage.getItem(INTRO_SEEN_KEY) !== 'true');
  const [showIntroVeil, setShowIntroVeil] = useState(false);
  const [introVeilVisible, setIntroVeilVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== '/' && showIntro) {
      setShowIntro(false);
    }
  }, [location.pathname, showIntro]);

  useEffect(() => {
    if (!showIntroVeil) return;

    const startFadeTimer = window.setTimeout(() => {
      setIntroVeilVisible(false);
    }, INTRO_VEIL_HOLD_MS);

    const removeVeilTimer = window.setTimeout(() => {
      setShowIntroVeil(false);
      setIntroVeilVisible(true);
    }, INTRO_VEIL_HOLD_MS + INTRO_VEIL_FADE_MS);

    return () => {
      window.clearTimeout(startFadeTimer);
      window.clearTimeout(removeVeilTimer);
    };
  }, [showIntroVeil]);

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
    setShowIntroVeil(true);
  };

  return (
    <>
      {location.pathname === '/' && showIntro && <SiteIntro onComplete={handleIntroComplete} />}
      {showIntroVeil && (
        <div
          className="fixed inset-0 z-[139] pointer-events-none bg-black transition-opacity ease-out"
          aria-hidden="true"
          style={{
            opacity: introVeilVisible ? 1 : 0,
            transitionDuration: `${INTRO_VEIL_FADE_MS}ms`,
          }}
        />
      )}
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
