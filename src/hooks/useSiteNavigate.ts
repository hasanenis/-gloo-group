import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from '../components/SmoothScrollProvider';
import { projects } from '../data/projects';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { getManualProjectHeroSettings } from '../data/manualProjectImages';
import { usePrefersReducedMotion } from '../lib/motion';
import { runBatPageTransition } from '../transitions/batPageTransition';
import { getRouteTransitionKind } from '../transitions/routeTransitionPolicy';
import { runSitePageTransition } from '../transitions/sitePageTransition';
import { localizedPath, useLocale } from '../i18n';

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

function resolveTransitionProject(pathname: string) {
  const projectMatch = pathname.match(/^\/(?:en|fr|tr|ar)\/(?:bat-demo\/)?projects\/([^/]+)\/?$/)
    ?? pathname.match(/^\/(?:bat-demo\/)?projects\/([^/]+)\/?$/);
  if (!projectMatch) return undefined;

  const slug = decodeSlug(projectMatch[1]);
  const canonicalSlug = slug === 'douira-commercial-centers-2500-housing' ? 'rahmania' : slug;
  return projects.find((item) => item.slug === canonicalSlug);
}

function getProjectTransitionImage(pathname: string) {
  const project = resolveTransitionProject(pathname);
  return project ? getProjectHeroImage(project).src : undefined;
}

// The transition overlay needs the same crop the real hero lands on, or the
// handoff visibly jumps the moment the overlay fades away.
function getProjectTransitionImageSettings(pathname: string) {
  const project = resolveTransitionProject(pathname);
  return project ? getManualProjectHeroSettings(project.slug) : undefined;
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
  const { locale } = useLocale();

  return useCallback(
    (path: string, imageSrc?: string) => {
      const localizedTargetPath = localizedPath(locale, path);
      const [, hash] = path.split('#');
      const targetPathname = getPathname(localizedTargetPath);

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

      const transitionKind = getRouteTransitionKind(targetPathname);

      // Project destinations stay on the established BAT transition runner.
      // Its geometry, crop handoff and ProjectDetail entry event are intentionally
      // isolated from the general site transition below.
      if (transitionKind !== 'site') {
        const isProjectDetail = transitionKind === 'project-detail';
        void runBatPageTransition({
          targetPath: localizedTargetPath,
          variant: isProjectDetail ? 'hero' : 'plain',
          imageSrc: isProjectDetail
            ? imageSrc ?? getProjectTransitionImage(targetPathname)
            : undefined,
          imageSettings: isProjectDetail
            ? getProjectTransitionImageSettings(targetPathname)
            : undefined,
          reducedMotion: prefersReducedMotion,
          lenis,
          navigate,
        });
        return;
      }

      void runSitePageTransition({
        targetPath: localizedTargetPath,
        reducedMotion: prefersReducedMotion,
        lenis,
        navigate,
      });
    },
    [locale, location.pathname, lenis, navigate, prefersReducedMotion],
  );
}
