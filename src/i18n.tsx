import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'en' | 'fr';

type Dictionary = Record<Locale, Record<string, string>>;

const STORAGE_KEY = 'igloo:locale';

const dictionary: Dictionary = {
  en: {
    home: 'Home', projects: 'Projects', company: 'Company', services: 'Services', tenders: 'Tenders', contact: 'Contact',
    scroll: 'Scroll', projectOverview: 'Project overview', projectDetails: 'Details & location',
    construction: 'Construction delivery', projectGallery: 'Project gallery', facilities: 'Housing & infrastructure',
    whatsAround: "What's around", faq: 'Frequently asked questions', relatedProjects: 'Featured projects',
    seeAllProjects: 'See all projects', previous: 'Previous', next: 'Next', allProjects: 'All projects',
    formOfContract: 'Form of contract', client: 'Client', architect: 'Architect', repeatOrNew: 'Repeat / new',
    projectType: 'Project type', location: 'Location', status: 'Status', completion: 'Completion',
    chat: 'Discuss a project', readMore: 'Read more', openProject: 'Open project', office: 'Office', navigation: 'Navigation',
  },
  fr: {
    home: 'Accueil', projects: 'Projets', company: 'Entreprise', services: 'Services', tenders: 'Appels d\'offres', contact: 'Contact',
    scroll: 'Défiler', projectOverview: 'Présentation du projet', projectDetails: 'Détails et localisation',
    construction: 'Réalisation des travaux', projectGallery: 'Galerie du projet', facilities: 'Logements et infrastructures',
    whatsAround: 'À proximité', faq: 'Questions fréquentes', relatedProjects: 'Projets à la une',
    seeAllProjects: 'Voir tous les projets', previous: 'Précédent', next: 'Suivant', allProjects: 'Tous les projets',
    formOfContract: 'Type de contrat', client: 'Client', architect: 'Architecte', repeatOrNew: 'Récurrent / nouveau',
    projectType: 'Nature du projet', location: 'Localisation', status: 'Statut', completion: 'Achèvement',
    chat: 'Parler d\'un projet', readMore: 'Lire la suite', openProject: 'Voir le projet', office: 'Bureau', navigation: 'Navigation',
  },
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof (typeof dictionary)['en']) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'fr' ? 'fr' : 'en';
  });

  const setLocale = (nextLocale: Locale) => setLocaleState(nextLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale, t: (key) => dictionary[locale][key] }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider.');
  return context;
}

export function LocaleToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={`inline-flex items-center border border-current/30 text-[10px] font-semibold tracking-[0.14em] ${className}`} aria-label="Language selector">
      {(['en', 'fr'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`px-2.5 py-1.5 transition-colors ${locale === option ? 'bg-[#e1251b] text-white' : 'hover:text-[#e1251b]'}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
