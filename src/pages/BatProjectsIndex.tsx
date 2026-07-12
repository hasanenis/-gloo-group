import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Grid3X3,
  Images,
  MapPin,
  Menu,
  Phone,
  Rows3,
  X,
} from 'lucide-react';
import {
  companyProfile,
  localizedProjectScope,
  localizedProjectShortTitle,
  localizedProjectStatus,
  localizedProjectTitle,
  projects,
  type ProjectRecord,
} from '../data/projects';
import { buildBatProjectPageModel } from '../data/batProjectModel';
import { useLenis } from '../components/SmoothScrollProvider';
import { LocaleToggle, pickLocaleText, useLocale, type Locale, type LocalizedString } from '../i18n';
import { cn } from '../lib/utils';
import { usePrefersReducedMotion } from '../lib/motion';
import { runBatPageTransition } from '../transitions/batPageTransition';
import iglooLogo from '../assets/branding/igloo-intro-logo.png';
import '../styles/bat-demo.css';

type BatProjectsMode = 'grid' | 'gallery' | 'list';
type SectorKey =
  | 'All'
  | 'Residential'
  | 'Commercial'
  | 'Mixed Use'
  | 'Infrastructure'
  | 'Community'
  | 'Hospitality';

type BatProjectListItem = {
  project: ProjectRecord;
  title: string;
  shortTitle: string;
  sector: Exclude<SectorKey, 'All'>;
  location: string;
  status: string;
  scope: string;
  coverImage: string;
  heroImage: string;
  gridSpan: (typeof BAT_GRID_SPANS)[number];
};

const sectorOrder: SectorKey[] = [
  'All',
  'Residential',
  'Commercial',
  'Mixed Use',
  'Infrastructure',
  'Community',
  'Hospitality',
];

const modeOptions: Array<{
  value: BatProjectsMode;
  label: LocalizedString;
  icon: typeof Grid3X3;
}> = [
  { value: 'grid', label: { en: 'Grid', fr: 'Grille', dz: 'شبكة', tr: 'Izgara' }, icon: Grid3X3 },
  { value: 'gallery', label: { en: 'Gallery', fr: 'Galerie', dz: 'غاليري', tr: 'Galeri' }, icon: Images },
  { value: 'list', label: { en: 'List', fr: 'Liste', dz: 'قائمة', tr: 'Liste' }, icon: Rows3 },
];

const sectorLabels: Record<SectorKey, LocalizedString> = {
  All: { en: 'All', fr: 'Tous', dz: 'الكل', tr: 'Tümü' },
  Residential: { en: 'Residential', fr: 'Résidentiel', dz: 'سكني', tr: 'Konut' },
  Commercial: { en: 'Commercial', fr: 'Commercial', dz: 'تجاري', tr: 'Ticari' },
  'Mixed Use': { en: 'Mixed Use', fr: 'Usage mixte', dz: 'استعمال مختلط', tr: 'Karma kullanım' },
  Infrastructure: { en: 'Infrastructure', fr: 'Infrastructure', dz: 'بنية تحتية', tr: 'Altyapı' },
  Community: { en: 'Community', fr: 'Communautaire', dz: 'مجتمعي', tr: 'Topluluk' },
  Hospitality: { en: 'Hospitality', fr: 'Hôtellerie', dz: 'فندقة', tr: 'Konaklama' },
};

const BAT_GRID_SPANS = [
  4,
  6,
  6,
  10,
  6,
  6,
  6,
  4,
  6,
  10,
  4,
  6,
  6,
  10,
  6,
  6,
  6,
  4,
  6,
  10,
  4,
  6,
  6,
  10,
  6,
] as const;

function getSector(project: ProjectRecord): Exclude<SectorKey, 'All'> {
  const text = `${project.title} ${project.menuTitle} ${project.summary} ${project.scope}`.toLowerCase();

  if (text.includes('mixed')) return 'Mixed Use';
  if (text.includes('commercial')) return 'Commercial';
  if (
    text.includes('road') ||
    text.includes('network') ||
    text.includes('infrastructure')
  ) {
    return 'Infrastructure';
  }
  if (text.includes('community')) return 'Community';
  if (text.includes('hospitality') || text.includes('hotel')) return 'Hospitality';
  return 'Residential';
}

function projectLocation(project: ProjectRecord) {
  return (project.location || '').split(',')[0]?.trim() || project.location;
}

function buildProjectItems(locale: Locale): BatProjectListItem[] {
  return projects.map((project, index) => {
    const model = buildBatProjectPageModel(project, locale);
    const coverImage = model.hero.image.src;

    return {
      project,
      title: localizedProjectTitle(project, locale),
      shortTitle: localizedProjectShortTitle(project, locale) || model.displayTitles.relatedTitle || project.menuTitle,
      sector: getSector(project),
      location: projectLocation(project),
      status: localizedProjectStatus(project, locale),
      scope: localizedProjectScope(project, locale),
      coverImage,
      heroImage: coverImage,
      gridSpan: BAT_GRID_SPANS[index % BAT_GRID_SPANS.length],
    };
  });
}

function preloadImage(src?: string) {
  if (!src || typeof window === 'undefined') return;

  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  void image.decode?.().catch(() => undefined);
}

function BatProjectsFooter() {
  const { locale, t } = useLocale();

  return (
    <footer id="contact" className="bat-demo-footer">
      <div className="bat-demo-container py-20 md:py-24 lg:py-28">
        <div className="grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <img
              src={iglooLogo}
              alt="Igloo Construction"
              className="h-11 w-auto object-contain brightness-0 invert"
            />
            <h2
              className="bat-demo-footer__title mt-8 max-w-3xl"
              data-bat-text-drift
              data-bat-text-drift-depth="16"
            >
              {pickLocaleText(locale, { en: 'Build with discipline, sequence, and precision.', fr: 'Construire avec discipline, séquence et précision.', dz: 'نبنيو بانضباط، ترتيب ودقة.', tr: 'Disiplin, sıralama ve hassasiyetle inşa ederiz.' })}
            </h2>
            <p className="bat-demo-footer__small mt-5 max-w-3xl">
              {pickLocaleText(locale, {
                en: `${companyProfile.name} works on residential and mixed-use programmes from Algiers, coordinating design, execution, and delivery inside one production chain.`,
                fr: `${companyProfile.name} intervient sur des programmes résidentiels et mixtes depuis Alger, en coordonnant conception, exécution et livraison dans une même chaîne de production.`,
                dz: `${companyProfile.name} تخدم من الجزائر على برامج سكنية ومختلطة، وتنسق التصميم، التنفيذ والتسليم في سلسلة إنتاج وحدة.`,
                tr: `${companyProfile.name}, Cezayir’den konut ve karma kullanım programlarında tasarım, uygulama ve teslimi tek üretim zincirinde koordine eder.`,
              })}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="grid gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/52">
                {pickLocaleText(locale, { en: 'Office', fr: 'Bureau', dz: 'المكتب', tr: 'Ofis' })}
              </p>
              <address className="not-italic text-[14px] leading-7 text-white/72">
                <MapPin className="mb-3 h-4 w-4 text-white" />
                {companyProfile.address}
              </address>
            </div>

            <div className="grid gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/52">
                {pickLocaleText(locale, { en: 'Navigation', fr: 'Navigation', dz: 'التنقل', tr: 'Gezinme' })}
              </p>
              <div className="grid gap-2 text-[14px] leading-7 text-white/72">
                <Link
                  to="/bat-demo/projects"
                  className="hover:text-white"
                >
                  {t('allProjects')}
                </Link>
                <a href={`mailto:${companyProfile.email}`} className="hover:text-white">
                  <Mail className="mr-2 inline h-4 w-4 text-white" />
                  {companyProfile.email}
                </a>
                <a
                  href={`tel:${companyProfile.phones[0].replace(/\s/g, '')}`}
                  className="hover:text-white"
                >
                  <Phone className="mr-2 inline h-4 w-4 text-white" />
                  {companyProfile.phones[0]}
                </a>
                <Link to="/" className="hover:text-white">
                  {t('home')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 text-[12px] leading-7 text-white/38 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Igloo Construction</span>
            <span>{companyProfile.email}</span>
            <span>{companyProfile.phones[0]}</span>
          </div>
          <div className="text-left md:text-right">
            <span>© 2026 Igloo Construction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function BatProjectsIndex() {
  const navigate = useNavigate();
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { locale, t } = useLocale();
  const rootRef = useRef<HTMLElement | null>(null);
  const [mode, setMode] = useState<BatProjectsMode>('grid');
  const [activeSector, setActiveSector] = useState<SectorKey>('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');

  const items = useMemo(() => buildProjectItems(locale), [locale]);

  const visibleItems = useMemo(() => {
    if (activeSector === 'All') return items;
    return items.filter((item) => item.sector === activeSector);
  }, [activeSector, items]);

  useEffect(() => {
    if (!visibleItems.length) return;
    if (!visibleItems.some((item) => item.project.slug === selectedSlug)) {
      setSelectedSlug(visibleItems[0].project.slug);
    }
  }, [selectedSlug, visibleItems]);

  useEffect(() => {
    if (menuOpen) {
      document.documentElement.classList.add('bat-projects-menu-open');
    } else {
      document.documentElement.classList.remove('bat-projects-menu-open');
    }

    return () => {
      document.documentElement.classList.remove('bat-projects-menu-open');
    };
  }, [menuOpen]);

  const selectedItem =
    visibleItems.find((item) => item.project.slug === selectedSlug) ??
    visibleItems[0];

  const navigateToProject = (item: BatProjectListItem) => {
    const targetPath = `/bat-demo/projects/${item.project.slug}`;

    void runBatPageTransition({
      targetPath,
      imageSrc: item.heroImage,
      reducedMotion: prefersReducedMotion,
      lenis,
      navigate,
      afterNavigate: () => {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      },
    });
  };

  const setRelativeGalleryItem = (direction: -1 | 1) => {
    if (!visibleItems.length) return;

    const currentIndex = Math.max(
      0,
      visibleItems.findIndex((item) => item.project.slug === selectedSlug),
    );
    const nextIndex =
      (currentIndex + direction + visibleItems.length) % visibleItems.length;
    setSelectedSlug(visibleItems[nextIndex].project.slug);
  };

  return (
    <main ref={rootRef} className="bat-demo-page bat-projects-index">
      <header className="bat-projects-header">
        <div className="bat-demo-container bat-projects-header__inner">
          <Link
            to="/"
            aria-label="Igloo Construction"
            className="bat-projects-header__logo"
          >
            <img src={iglooLogo} alt="Igloo Construction" />
          </Link>

          <Link to="/bat-demo/projects" className="bat-projects-header__section">
            {t('projects')}
          </Link>

          <div className="bat-projects-header__actions">
            <LocaleToggle className="border-current/20 text-[10px]" />
            <button
              type="button"
              className="bat-projects-icon-button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" strokeWidth={1.7} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>
      </header>

      <aside className={`bat-projects-menu ${menuOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="bat-projects-menu__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div className="bat-projects-menu__panel">
          <div className="bat-demo-container">
            <div className="bat-projects-menu__top">
              <p>{pickLocaleText(locale, { en: 'Menu', fr: 'Menu', dz: 'القائمة', tr: 'Menü' })}</p>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
                {pickLocaleText(locale, { en: 'Close', fr: 'Fermer', dz: 'غلق', tr: 'Kapat' })}
              </button>
            </div>
            <nav className="bat-projects-menu__nav" aria-label="Demo navigation">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link to="/bat-demo/projects" onClick={() => setMenuOpen(false)}>
                {t('projects')}
              </Link>
              {items.slice(0, 5).map((item) => (
                <Link
                  key={item.project.slug}
                  to={`/bat-demo/projects/${item.project.slug}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.shortTitle}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <section className="bat-projects-nav" aria-labelledby="bat-projects-title">
        <div className="bat-demo-container">
          <h1 id="bat-projects-title" className="sr-only">
            {pickLocaleText(locale, { en: 'Igloo projects', fr: 'Projets Igloo', dz: 'مشاريع Igloo', tr: 'Igloo projeleri' })}
          </h1>

          <div className="bat-projects-nav__grid">
            <div className="bat-projects-nav__spacer" aria-hidden="true" />

            <div className="bat-projects-filter-group">
              <p className="bat-projects-filter-title">
                {pickLocaleText(locale, { en: 'Mode', fr: 'Mode', dz: 'النمط', tr: 'Mod' })}
              </p>
              <div className="bat-projects-mode-list" role="group" aria-label="Project view mode">
                {modeOptions.map((option) => {
                  const Icon = option.icon;
                  const active = mode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      className={cn('bat-projects-mode-button', active && 'is-active')}
                      onClick={() => startTransition(() => setMode(option.value))}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                      {pickLocaleText(locale, option.label)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bat-projects-filter-group">
              <p className="bat-projects-filter-title">
                {pickLocaleText(locale, { en: 'Typology', fr: 'Typologie', dz: 'النوع', tr: 'Tipoloji' })}
              </p>
              <div className="bat-projects-tag-list" aria-label="Filter projects by typology">
                {sectorOrder.map((sector) => {
                  const active = sector === activeSector;

                  return (
                    <button
                      key={sector}
                      type="button"
                      aria-current={active ? 'true' : undefined}
                      className={cn('bat-projects-tag', active && 'is-active')}
                      onClick={() =>
                        startTransition(() => setActiveSector(sector))
                      }
                    >
                      {pickLocaleText(locale, sectorLabels[sector])}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bat-projects-count" aria-live="polite">
              <span>({visibleItems.length})</span>
              <span>{activeSector === 'All' ? t('allProjects') : pickLocaleText(locale, sectorLabels[activeSector])}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bat-projects-body" aria-label="Project collection">
        <div className="bat-demo-container">
          {visibleItems.length > 0 ? (
            <>
              {mode === 'grid' ? (
                <div className="bat-projects-grid-view">
                  {visibleItems.map((item, index) => (
                    <article
                      key={item.project.slug}
                      className="bat-projects-card"
                      data-span={item.gridSpan}
                    >
                      <Link
                        to={`/bat-demo/projects/${item.project.slug}`}
                        className="bat-projects-card__link"
                        onPointerEnter={() => preloadImage(item.heroImage)}
                        onClick={(event) => {
                          event.preventDefault();
                          navigateToProject(item);
                        }}
                      >
                        <div className="bat-projects-card__image">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            decoding="async"
                          />
                        </div>
                        <div className="bat-projects-card__info">
                          <h2>{item.shortTitle}</h2>
                          <p>
                            {pickLocaleText(locale, sectorLabels[item.sector])}
                            {item.location ? ` / ${item.location}` : ''}
                          </p>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : null}

              {mode === 'gallery' && selectedItem ? (
                <div className="bat-projects-gallery-view">
                  <div className="bat-projects-gallery-view__stage">
                    <img
                      src={selectedItem.heroImage}
                      alt={selectedItem.title}
                      decoding="async"
                    />
                    <div className="bat-projects-gallery-view__shade" />
                    <div className="bat-projects-gallery-view__content">
                      <p>
                        {String(
                          visibleItems.findIndex(
                            (item) =>
                              item.project.slug === selectedItem.project.slug,
                          ) + 1,
                        ).padStart(2, '0')}{' '}
                        / {String(visibleItems.length).padStart(2, '0')}
                      </p>
                      <h2>{selectedItem.shortTitle}</h2>
                      <div className="bat-projects-gallery-view__meta">
                        <span>{pickLocaleText(locale, sectorLabels[selectedItem.sector])}</span>
                        <span>{selectedItem.location}</span>
                        <span>{selectedItem.status}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="bat-projects-gallery-view__open"
                      onClick={() => navigateToProject(selectedItem)}
                    >
                      {t('openProject')}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="bat-projects-gallery-view__controls">
                    <button
                      type="button"
                      aria-label={pickLocaleText(locale, { en: 'Previous project', fr: 'Projet précédent', dz: 'المشروع السابق', tr: 'Önceki proje' })}
                      onClick={() => setRelativeGalleryItem(-1)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="bat-projects-gallery-view__rail">
                      {visibleItems.map((item) => (
                        <button
                          key={item.project.slug}
                          type="button"
                          className={cn(
                            item.project.slug === selectedItem.project.slug &&
                              'is-active',
                          )}
                          onClick={() => setSelectedSlug(item.project.slug)}
                        >
                          {item.shortTitle}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label={pickLocaleText(locale, { en: 'Next project', fr: 'Projet suivant', dz: 'المشروع التالي', tr: 'Sonraki proje' })}
                      onClick={() => setRelativeGalleryItem(1)}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : null}

              {mode === 'list' && selectedItem ? (
                <div className="bat-projects-list-view">
                  <div className="bat-projects-list-view__rows">
                    {visibleItems.map((item, index) => (
                      <Link
                        key={item.project.slug}
                        to={`/bat-demo/projects/${item.project.slug}`}
                        className={cn(
                          'bat-projects-list-row',
                          item.project.slug === selectedItem.project.slug &&
                            'is-active',
                        )}
                        onPointerEnter={() => {
                          setSelectedSlug(item.project.slug);
                          preloadImage(item.heroImage);
                        }}
                        onFocus={() => setSelectedSlug(item.project.slug)}
                        onClick={(event) => {
                          event.preventDefault();
                          navigateToProject(item);
                        }}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{item.shortTitle}</strong>
                        <em>{pickLocaleText(locale, sectorLabels[item.sector])}</em>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                  <aside className="bat-projects-list-view__preview">
                    <img src={selectedItem.heroImage} alt={selectedItem.title} />
                    <div>
                      <p>{selectedItem.location}</p>
                      <h2>{selectedItem.shortTitle}</h2>
                      <span>{selectedItem.scope}</span>
                    </div>
                  </aside>
                </div>
              ) : null}
            </>
          ) : (
            <div className="bat-projects-empty">
              <p>{pickLocaleText(locale, { en: 'No match', fr: 'Aucun resultat', dz: 'ما كاين حتى نتيجة', tr: 'Eşleşme yok' })}</p>
              <h2>
                {pickLocaleText(locale, { en: 'No projects in this typology.', fr: 'Aucun projet dans cette typologie.', dz: 'ما كاين حتى مشروع في هذا النوع.', tr: 'Bu tipolojide proje yok.' })}
              </h2>
              <button
                type="button"
                onClick={() => setActiveSector('All')}
              >
                {t('allProjects')}
              </button>
            </div>
          )}
        </div>
      </section>

      <BatProjectsFooter />
    </main>
  );
}

