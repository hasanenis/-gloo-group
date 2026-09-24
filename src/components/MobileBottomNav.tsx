import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, FolderOpen, Home, Mail, MessageCircle } from 'lucide-react';
import { localizedPath, useLocale, type Locale } from '../i18n';
import { useLenis } from './SmoothScrollProvider';
import { usePrefersReducedMotion } from '../lib/motion';
import { runSitePageTransition } from '../transitions/sitePageTransition';
import { getRouteTransitionKind } from '../transitions/routeTransitionPolicy';
import { runBatPageTransition } from '../transitions/batPageTransition';
import { cn } from '../lib/utils';

const chromeLabels: Record<Locale, { navigation: string; openAssistant: string }> = {
  en: { navigation: 'Mobile navigation', openAssistant: 'Open Igloo assistant' },
  fr: { navigation: 'Navigation mobile', openAssistant: "Ouvrir l'assistant Igloo" },
  'ar-DZ': { navigation: 'التنقل عبر الهاتف', openAssistant: 'افتح مساعد Igloo' },
  tr: { navigation: 'Mobil gezinme', openAssistant: 'Igloo asistanını aç' },
};

export default function MobileBottomNav() {
  const { locale, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const labels = chromeLabels[locale];
  const path = location.pathname.replace(/^\/(?:en|fr|tr|ar)(?=\/|$)/, '') || '/';
  const isHomeActive = path === '/' && !location.hash;
  const isCompanyActive = path === '/about';
  const isProjectsActive = path === '/projects' || path.startsWith('/projects/');
  const isContactActive = path === '/contact';

  useEffect(() => {
    const syncAssistantState = (event: Event) => {
      setAssistantOpen(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener('igloo:assistant-open-state', syncAssistantState);
    return () => window.removeEventListener('igloo:assistant-open-state', syncAssistantState);
  }, []);

  const go = (target: string) => {
    window.dispatchEvent(new CustomEvent('igloo:close-assistant'));
    const localizedTargetPath = localizedPath(locale, target);
    const targetPathname = new URL(localizedTargetPath, window.location.origin).pathname;
    if (targetPathname === location.pathname) {
      const [, targetHash] = target.split('#');
      if (targetHash) {
        const element = document.getElementById(targetHash);
        if (element) {
          if (lenis) lenis.scrollTo(element, { offset: -90 });
          else element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      } else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    const transitionKind = getRouteTransitionKind(targetPathname);
    if (transitionKind === 'projects-index') {
      void runBatPageTransition({ targetPath: localizedTargetPath, variant: 'plain', reducedMotion: prefersReducedMotion, lenis, navigate });
      return;
    }
    void runSitePageTransition({ targetPath: localizedTargetPath, reducedMotion: prefersReducedMotion, lenis, navigate });
  };

  return (
    <nav className="mobile-bottom-nav" aria-label={labels.navigation}>
      <button type="button" className={cn(isHomeActive && 'is-active')} aria-current={isHomeActive ? 'page' : undefined} onClick={() => go('/')}>
        <Home className="h-[18px] w-[18px]" strokeWidth={2.1} />
        <span>{t('home')}</span>
      </button>
      <button type="button" className={cn(isCompanyActive && 'is-active')} aria-current={isCompanyActive ? 'page' : undefined} onClick={() => go('/about')}>
        <Building2 className="h-[18px] w-[18px]" strokeWidth={2.1} />
        <span>{t('company')}</span>
      </button>
      <button type="button" className={cn('mobile-bottom-nav__assistant', assistantOpen && 'is-active')} aria-label={labels.openAssistant} aria-expanded={assistantOpen} onClick={() => window.dispatchEvent(new Event('igloo:open-assistant'))}>
        <span className="mobile-bottom-nav__assistant-orb">
          <MessageCircle className="h-6 w-6" strokeWidth={2.25} />
        </span>
      </button>
      <button type="button" className={cn(isProjectsActive && 'is-active')} aria-current={isProjectsActive ? 'page' : undefined} onClick={() => go('/projects')}>
        <FolderOpen className="h-[18px] w-[18px]" strokeWidth={2.1} />
        <span>{t('projects')}</span>
      </button>
      <button type="button" className={cn(isContactActive && 'is-active')} aria-current={isContactActive ? 'page' : undefined} onClick={() => go('/contact')}>
        <Mail className="h-[18px] w-[18px]" strokeWidth={2.1} />
        <span>{t('contact')}</span>
      </button>
    </nav>
  );
}
