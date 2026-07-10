import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'en' | 'fr' | 'dz' | 'tr';

/**
 * Locales that render right-to-left. Currently Algerian Arabic (dz).
 * Used to set `document.documentElement.dir` for correct layout flow.
 */
export const RTL_LOCALES: ReadonlySet<Locale> = new Set(['dz']);

/** Human-readable display names for each locale, used by switchers/menus. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  dz: 'الدارجة', // Algerian Arabic (Darja)
  tr: 'Türkçe',
};

/** Short codes shown on compact UI chips (e.g. the header pill). */
export const LOCALE_CODES: ReadonlyArray<Locale> = ['en', 'fr', 'dz', 'tr'];

export type LocalizedString = {
  en: string;
  fr?: string;
  dz?: string;
  tr?: string;
};

type Dictionary = Record<Locale, Record<string, string>>;

const STORAGE_KEY = 'igloo:locale';

export const dictionary: Dictionary = {
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
  dz: {
    home: 'الرئيسية', projects: 'المشاريع', company: 'الشركة', services: 'الخدمات', tenders: 'المناقصات', contact: 'اتصل بنا',
    scroll: 'مرّر للتحت', projectOverview: 'نظرة عامة على المشروع', projectDetails: 'التفاصيل والموقع',
    construction: 'تسليم الأشغال', projectGallery: 'معرض صور المشروع', facilities: 'السكن والبنية التحتية',
    whatsAround: 'شنو كاين فالمحيط', faq: 'الأسئلة المتكررة', relatedProjects: 'مشاريع مميزة',
    seeAllProjects: 'شوف كل المشاريع', previous: 'السابق', next: 'التالي', allProjects: 'كل المشاريع',
    formOfContract: 'نوع العقد', client: 'الزبون', architect: 'المهندس المعماري', repeatOrNew: 'إعادة / جديد',
    projectType: 'نوع المشروع', location: 'الموقع', status: 'الحالة', completion: 'الإنجاز',
    chat: 'ناقش مشروع', readMore: 'اقرأ المزيد', openProject: 'افتح المشروع', office: 'المكتب', navigation: 'التنقل',
  },
  tr: {
    home: 'Ana sayfa', projects: 'Projeler', company: 'Kurumsal', services: 'Hizmetler', tenders: 'İhaleler', contact: 'İletişim',
    scroll: 'Kaydırın', projectOverview: 'Proje genel bakışı', projectDetails: 'Detaylar ve konum',
    construction: 'İnşaat teslimi', projectGallery: 'Proje galerisi', facilities: 'Konut ve altyapı',
    whatsAround: 'Çevrede neler var', faq: 'Sıkça sorulan sorular', relatedProjects: 'Öne çıkan projeler',
    seeAllProjects: 'Tüm projeleri görüntüle', previous: 'Önceki', next: 'Sonraki', allProjects: 'Tüm projeler',
    formOfContract: 'Sözleşme türü', client: 'İşveren', architect: 'Mimar', repeatOrNew: 'Tekrarlayan / yeni',
    projectType: 'Proje türü', location: 'Konum', status: 'Durum', completion: 'Tamamlanma',
    chat: 'Bir proje görüşelim', readMore: 'Devamını oku', openProject: 'Projeyi aç', office: 'Ofis', navigation: 'Gezinme',
  },
};

export function pickLocaleText(locale: Locale, value: LocalizedString): string {
  const authored = value[locale];
  if (authored) return authored;
  if (locale === 'fr' && value.fr) return value.fr;
  return translateFallback(value.en, locale);
}

export function translateFallback(source: string, locale: Locale): string {
  if (locale === 'en') return source;
  if (!source.trim()) return source;

  const exact = FALLBACK_TRANSLATIONS[locale]?.[source];
  if (exact) return exact;

  if (locale === 'fr') return source;
  if (locale === 'tr') return translateProjectPhrase(source, TR_TERMS, TR_PATTERNS);
  if (locale === 'dz') return translateProjectPhrase(source, DZ_TERMS, DZ_PATTERNS);
  return source;
}

type PhrasePattern = { match: RegExp; replace: string };

function translateProjectPhrase(source: string, terms: Record<string, string>, patterns: PhrasePattern[]) {
  const normalized = source.replace(/\s+/g, ' ').trim();
  const pattern = patterns.find((item) => item.match.test(normalized));
  if (pattern) return normalized.replace(pattern.match, pattern.replace);

  let translated = normalized;
  Object.entries(terms).forEach(([from, to]) => {
    translated = translated.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, 'gi'), to);
  });
  return translated;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const FALLBACK_TRANSLATIONS: Partial<Record<Locale, Record<string, string>>> = {
  fr: {
    'Project not found': 'Projet introuvable',
    'Project unavailable': 'Projet indisponible',
    'Project info': 'Informations projet',
    'Editorial text': 'Texte éditorial',
    'Related projects': 'Projets liés',
    'Back to projects': 'Retour aux projets',
    'Useful questions': 'Questions utiles',
  },
  dz: {
    Home: 'الرئيسية',
    Projects: 'المشاريع',
    Company: 'الشركة',
    Contact: 'اتصل بنا',
    Proof: 'الدليل',
    Process: 'المراحل',
    'All rights reserved.': 'كل الحقوق محفوظة.',
    'Featured projects': 'مشاريع مختارة',
    Completed: 'مكمّل',
    Current: 'في طور الإنجاز',
    'In progress': 'في طور الإنجاز',
    Status: 'الحالة',
    Location: 'الموقع',
    Scope: 'نطاق الخدمة',
    'Project info': 'معلومات المشروع',
    'Project not found': 'المشروع ما تلقاش',
    'Related projects': 'مشاريع قريبة',
    'More work': 'مشاريع أخرى',
    'View all projects': 'شوف كل المشاريع',
    'Contact the team': 'تواصل مع الفريق',
    'Call the office': 'عيّط للمكتب',
    'Open in Maps': 'افتح في الخرائط',
    Name: 'الاسم',
    'Phone or email': 'الهاتف ولا الإيميل',
    'Project summary': 'ملخّص المشروع',
    'Prepare email': 'حضّر الإيميل',
  },
  tr: {
    Home: 'Ana sayfa',
    Projects: 'Projeler',
    Company: 'Kurumsal',
    Contact: 'İletişim',
    Proof: 'Kanıt',
    Process: 'Süreç',
    'All rights reserved.': 'Tüm hakları saklıdır.',
    'Featured projects': 'Öne çıkan projeler',
    Completed: 'Tamamlandı',
    Current: 'Devam ediyor',
    'In progress': 'Devam ediyor',
    Status: 'Durum',
    Location: 'Konum',
    Scope: 'Kapsam',
    'Project info': 'Proje bilgileri',
    'Project not found': 'Proje bulunamadı',
    'Related projects': 'İlgili projeler',
    'More work': 'Diğer projeler',
    'View all projects': 'Tüm projeleri görüntüle',
    'Contact the team': 'Ekiple iletişime geç',
    'Call the office': 'Ofisi ara',
    'Open in Maps': 'Haritalarda aç',
    Name: 'Ad',
    'Phone or email': 'Telefon veya e-posta',
    'Project summary': 'Proje özeti',
    'Prepare email': 'E-posta hazırla',
  },
};

const TR_TERMS: Record<string, string> = {
  construction: 'inşaat',
  Construction: 'İnşaat',
  project: 'proje',
  Project: 'Proje',
  projects: 'projeler',
  housing: 'konut',
  Housing: 'Konut',
  units: 'birim',
  villas: 'villalar',
  Villas: 'Villalar',
  commercial: 'ticari',
  Commercial: 'Ticari',
  premises: 'alanlar',
  roads: 'yollar',
  networks: 'altyapı ağları',
  delivered: 'teslim edildi',
  delivery: 'teslim',
  programme: 'program',
  programmes: 'programlar',
  residential: 'konut',
  'mixed-use': 'karma kullanım',
  Algeria: 'Cezayir',
  Algiers: 'Cezayir',
  office: 'ofis',
  team: 'ekip',
  quality: 'kalite',
  safety: 'güvenlik',
  handover: 'teslim',
};

const DZ_TERMS: Record<string, string> = {
  construction: 'البناء',
  Construction: 'البناء',
  project: 'مشروع',
  Project: 'مشروع',
  projects: 'مشاريع',
  housing: 'سكنات',
  Housing: 'سكنات',
  units: 'وحدات',
  villas: 'فيلات',
  Villas: 'فيلات',
  commercial: 'تجاري',
  Commercial: 'تجاري',
  premises: 'محلات',
  roads: 'طرقات',
  networks: 'الشبكات',
  delivered: 'تسلّم',
  delivery: 'التسليم',
  programme: 'برنامج',
  programmes: 'برامج',
  residential: 'سكني',
  'mixed-use': 'استعمال مختلط',
  Algeria: 'الجزائر',
  Algiers: 'الجزائر العاصمة',
  office: 'مكتب',
  team: 'فريق',
  quality: 'الجودة',
  safety: 'السلامة',
  handover: 'التسليم',
};

const TR_PATTERNS: PhrasePattern[] = [
  { match: /^(.+) is a mixed-use project\. It is located in (.+)\.$/i, replace: '$1 karma kullanımlı bir projedir. Konumu: $2.' },
  { match: /^Client: (.+)\.$/i, replace: 'İşveren: $1.' },
  { match: /^Explore the gallery, technical details, and location notes for (.+)\.$/i, replace: '$1 için galeri, teknik detaylar ve konum notlarını inceleyin.' },
  { match: /^(.+) delivered by (.+)\.$/i, replace: '$1, $2 tarafından teslim edildi.' },
];

const DZ_PATTERNS: PhrasePattern[] = [
  { match: /^(.+) is a mixed-use project\. It is located in (.+)\.$/i, replace: '$1 هو مشروع باستعمال مختلط. الموقع: $2.' },
  { match: /^Client: (.+)\.$/i, replace: 'الزبون: $1.' },
  { match: /^Explore the gallery, technical details, and location notes for (.+)\.$/i, replace: 'شوف الغاليري، التفاصيل التقنية وملاحظات الموقع تاع $1.' },
  { match: /^(.+) delivered by (.+)\.$/i, replace: '$1 تسلّم من طرف $2.' },
];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof (typeof dictionary)['en']) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Type guard for validating a persisted locale string from localStorage. */
export function isLocale(value: string | null): value is Locale {
  return value !== null && LOCALE_CODES.includes(value as Locale);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : 'en';
  });

  const setLocale = (nextLocale: Locale) => setLocaleState(nextLocale);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
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
      {LOCALE_CODES.map((option) => (
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
