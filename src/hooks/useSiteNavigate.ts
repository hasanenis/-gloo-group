import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from '../components/SmoothScrollProvider';
import { projects } from '../data/projects';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { usePrefersReducedMotion } from '../lib/motion';
import { runBatPageTransition } from '../transitions/batPageTransition';

function getPathname(path: string) {
  const pathWithoutHash = path.split('#')[0] || '/';

  try {
    const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
    return new URL(pathWithoutHash, base).pathname;
  } catch {
    return pathWithoutHash.split(/[?#]/)[0] || '/';
  }
}

function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Only individual project pages get the cinematic hero transition;
// every other route uses the plain white wipe.
function isProjectDetailPath(pathname: string) {
  return /^\/(?:bat-demo\/)?projects\/[^/]+\/?$/.test(pathname);
}

function getProjectTransitionImage(pathname: string) {
  const projectMatch = pathname.match(/^\/(?:bat-demo\/)?projects\/([^/]+)\/?$/);
  if (!projectMatch) return undefined;

  const slug = decodeSlug(projectMatch[1]);
  const canonicalSlug = slug === 'douira-commercial-centers-2500-housing' ? 'rahmania' : slug;
  const project = projects.find((item) => item.slug === canonicalSlug);
  return project ? getProjectHeroImage(project).src : undefined;
}

/**
 * Central navigation helper so the cinematic page-transition (and the
 * matching scroll behaviour) is consistent everywhere a nav link exists —
 * header, footer, project cards, prev/next — instead of every page wiring
 * runBatPageTransition by hand.
 */
export function useSiteNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();

  return useCallback(
    (path: string, imageSrc?: string) => {
      const [, hash] = path.split('#');
      const targetPathname = getPathname(path);

      // Same route already active: no page to transition to — just scroll.
      if (targetPathname === location.pathname) {
        if (hash) {
          const target = document.getElementById(hash);
          if (target) {
            if (lenis) {
              lenis.scrollTo(target, { offset: -90 });
            } else {
              target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
          }
        } else if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        return;
      }

      const isProjectDetail = isProjectDetailPath(targetPathname);

      void runBatPageTransition({
        targetPath: path,
        variant: isProjectDetail ? 'hero' : 'plain',
        imageSrc: isProjectDetail
          ? imageSrc ?? getProjectTransitionImage(targetPathname)
          : undefined,
        reducedMotion: prefersReducedMotion,
        lenis,
        navigate,
      });
    },
    [location.pathname, lenis, navigate, prefersReducedMotion],
  );
}
