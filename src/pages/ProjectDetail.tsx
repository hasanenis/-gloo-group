import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Building2,
  Hammer,
  Home,
  KeyRound,
  ParkingCircle,
  Plus,
  Route,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { useLenis } from '../components/SmoothScrollProvider';
import CardCarousel, { CarouselProgressBar } from '../components/CardCarousel';
import { projects, type ProjectRecord } from '../data/projects';
import { buildBatProjectPageModel } from '../data/batProjectModel';
import { getProjectContent, localized, type ProjectFact, type ProjectImage } from '../data/projectContent';
import { getProjectHeroImage } from '../data/projectHeroImage';
import {
  getProjectEditorialContent,
  type ProjectEditorialIcon,
  type ProjectEditorialScopeItem,
} from '../data/projectEditorialContent';
import {
  getManualProjectImage,
  getManualProjectImageSettings,
  getManualProjectHeroSettings,
  type ResolvedManualImageSettings,
} from '../data/manualProjectImages';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useLocale } from '../i18n';
import { usePrefersReducedMotion } from '../lib/motion';
import RahmaniaComparisonSection from '../components/RahmaniaComparisonSection';
import Footer from '../components/Footer';
import { getBatHeroParallaxRange } from '../transitions/batHeroGeometry';
import {
  consumeBatPageTransitionEntry,
  onBatPageTransitionComplete,
} from '../transitions/batPageTransition';
import '../styles/bat-demo.css';
import '../styles/project-detail-editorial.css';

gsap.registerPlugin(ScrollTrigger);

const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  'douira-commercial-centers-2500-housing': 'rahmania',
};

type LocalizedValue = { en: string; fr: string };

function localValue(en: string, fr = en): LocalizedValue {
  return { en, fr };
}

const editorialIconMap: Record<ProjectEditorialIcon, LucideIcon> = {
  building: Building2,
  commerce: Store,
  delivery: Hammer,
  home: Home,
  network: Route,
  parking: ParkingCircle,
  route: Route,
  villa: KeyRound,
};

function projectMetricFromRecord(project?: ProjectRecord) {
  if (!project) return '';
  const match = `${project.title} ${project.coverLines.join(' ')}`.match(/\d[\d,/+]*/);
  return match?.[0] ?? '01';
}

function uniqueFacts(items: ProjectFact[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.label.en}:${item.value.en}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueImages(images: Array<ProjectImage | undefined>) {
  const seen = new Set<string>();
  return images.filter((image): image is ProjectImage => {
    if (!image || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

function projectImageBySrc(images: ProjectImage[], part: string) {
  return images.find((image) => image.src.includes(part));
}

const RAHMANIA_DUO_LEFT_IMAGE: ProjectImage = {
  src: '/projects/douira-commercial-centers-2500-housing/12-whatsapp-image-2025-11-12-at-15-18-39.webp',
  alt: localValue(
    'Curved staircase and stainless-steel railings inside the Douira commercial centre.',
    "Escalier courbe et garde-corps inox à l'intérieur du centre commercial de Douira.",
  ),
  caption: localValue(
    'Interior circulation and staircase finishes in the Douira commercial centre.',
    "Circulation intérieure et finitions d'escalier dans le centre commercial de Douira.",
  ),
};

const RAHMANIA_DUO_RIGHT_IMAGE: ProjectImage = {
  src: '/projects/douira-commercial-centers-2500-housing/13-whatsapp-image-2025-11-12-at-15-19-49.webp',
  alt: localValue(
    'Modern interior stair hall in the Douira commercial centre.',
    "Hall d'escalier moderne dans le centre commercial de Douira.",
  ),
  caption: localValue(
    'Completed staircase hall serving the commercial centre levels.',
    "Hall d'escalier achevé desservant les niveaux du centre commercial.",
  ),
};

function buildScopeItems(project: ProjectRecord): ProjectEditorialScopeItem[] {
  return [
    { icon: 'building', text: localValue(project.scope, project.scope) },
    { icon: 'network', text: localValue(project.details, project.details) },
    { icon: 'delivery', text: localValue('Site follow-up and delivery control', 'Suivi de chantier et contrôle de livraison') },
  ];
}

function buildProjectFacts(project: ProjectRecord, contentFacts: ProjectFact[]) {
  if (project.slug === 'rahmania') {
    return [
      { label: localValue('Project type', 'Nature du projet'), value: localValue('Commercial centres', 'Centres commerciaux') },
      { label: localValue('Location', 'Localisation'), value: localValue('Douira, Algiers, Algeria', 'Douira, Alger, Algérie') },
      { label: localValue('Works', 'Travaux'), value: localValue('Secondary works packages (CES)', 'Corps d état secondaires (CES)') },
      { label: localValue('Completion', 'Achèvement'), value: localValue('2025 — on schedule', '2025 — dans les délais') },
      { label: localValue('Development', 'Programme'), value: localValue('2,500-home residential programme', 'Programme résidentiel de 2500 logements') },
      { label: localValue('Contract', 'Contrat'), value: localValue('Exécution', 'Réalisation') },
    ];
  }

  if (project.slug === 'said-hamdine-mixed-real-estate') {
    return [
      { label: localValue('Project type', 'Nature du projet'), value: localValue('Ensemble immobilier mixte', 'Ensemble immobilier mixte') },
      { label: localValue('Location', 'Localisation'), value: localValue('Said Hamdine, Bir Mourad Rais, Alger, Algeria', 'Said Hamdine, Bir Mourad Rais, Alger, Algérie') },
      { label: localValue('Housing units', 'Logements'), value: localValue('202 promotional housing units', '202 logements promotionnels libres') },
      { label: localValue('Blocks', 'Blocs'), value: localValue('5 residential blocks', '5 blocs résidentiels') },
      { label: localValue('Parking', 'Parking'), value: localValue('2 underground parking levels', '2 niveaux de parking en sous-sol') },
      { label: localValue('Status', 'Statut'), value: localValue('Completed', 'Achevé') },
    ];
  }

  return uniqueFacts([
    { label: localValue('Project type', 'Nature du projet'), value: localValue(project.scope, project.scope) },
    { label: localValue('Location', 'Localisation'), value: localValue(project.location, project.location) },
    { label: localValue('Status', 'Statut'), value: localValue(project.chapterLabel, project.chapterLabel) },
    ...contentFacts,
  ]).slice(0, 6);
}

function ParallaxImage({
  image,
  className = '',
  aspectRatio = '4 / 3',
  loading = 'lazy',
  fit = 'cover',
  from = -12,
  to = 12,
  settings,
}: {
  image: ProjectImage;
  className?: string;
  aspectRatio?: string;
  loading?: 'eager' | 'lazy';
  fit?: 'cover' | 'contain';
  from?: number;
  to?: number;
  settings?: ResolvedManualImageSettings;
}) {
  const { locale } = useLocale();
  const resolvedFit = settings?.fit ?? fit;

  return (
    <figure
      className={`igloo-simple-parallax ${className}`}
      style={{ aspectRatio }}
      data-editorial-parallax-frame
      data-editorial-parallax-from={from}
      data-editorial-parallax-to={to}
    >
      <img
        src={image.src}
        alt={localized(image.alt, locale)}
        loading={loading}
        decoding="async"
        style={settings ? {
          objectFit: settings.fit,
          objectPosition: `${settings.positionX}% ${settings.positionY}%`,
        } : undefined}
        data-editorial-parallax-image
        data-fit={resolvedFit}
        data-manual-scale={settings?.scale}
      />
    </figure>
  );
}

function getHeroImageParallaxRange() {
  if (typeof window === 'undefined') return { from: -12, to: 10 };
  return getBatHeroParallaxRange();
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const lenis = useLenis();
  const goTo = useSiteNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const canonicalSlug = slug ? (LEGACY_PROJECT_SLUGS[slug] ?? slug) : slug;

  const index = useMemo(() => projects.findIndex((project) => project.slug === canonicalSlug), [canonicalSlug]);
  const project = index >= 0 ? projects[index] : undefined;
  const content = project ? getProjectContent(project) : undefined;
  const editorial = project ? getProjectEditorialContent(project) : undefined;
  const batModel = useMemo(() => (project ? buildBatProjectPageModel(project, locale) : undefined), [project, locale]);
  const isSaidHamdine = project?.slug === 'said-hamdine-mixed-real-estate';
  const isRahmania = project?.slug === 'rahmania';
  const isDouaouda = project?.slug === 'douaouda-300-500-housing';

  const tr = (value: LocalizedValue) => localized(value, locale);
  const contentFacts = useMemo(() => (content ? uniqueFacts([...content.meta, ...content.details]) : []), [content]);
  const projectFacts = useMemo(
    () => editorial?.facts ?? (project ? buildProjectFacts(project, contentFacts) : []),
    [contentFacts, editorial, project],
  );
  const scopeItems = useMemo(
    () => editorial?.scopeItems ?? (project ? buildScopeItems(project) : []),
    [editorial, project],
  );

  const imageSet = useMemo(() => {
    if (!content) return [];
    return uniqueImages([
      ...content.images.hero,
      content.images.intro,
      ...content.images.mosaic,
      ...content.images.featureGallery,
      ...content.images.constructionGallery,
      ...content.images.featured,
    ]);
  }, [content]);

  const rahmaniaInteriorImage = projectImageBySrc(imageSet, '06-rahmania-1');
  const heroImage = project ? getProjectHeroImage(project) : undefined;
  const heroImageSettings = project ? getManualProjectHeroSettings(project.slug) : undefined;
  const introImageSettings = project ? getManualProjectImageSettings(project.slug, 'intro') : undefined;
  const squareImageSettings = project ? getManualProjectImageSettings(project.slug, 'square') : undefined;
  const wideImageSettings = project ? getManualProjectImageSettings(project.slug, 'wide') : undefined;
  const infoImageSettings = project ? getManualProjectImageSettings(project.slug, 'info') : undefined;
  const panoramaImageSettings = project ? getManualProjectImageSettings(project.slug, 'panorama') : undefined;
  const heroImageStyle = heroImageSettings
    ? ({
      objectFit: heroImageSettings.fit,
      objectPosition: `${heroImageSettings.positionX}% ${heroImageSettings.positionY}%`,
    } satisfies CSSProperties)
    : undefined;
  const firstImage = (project ? getManualProjectImage(project.slug, 'intro') : undefined)
    ?? (isRahmania
      ? rahmaniaInteriorImage ?? content?.images.hero[0] ?? imageSet[1] ?? heroImage
      : projectImageBySrc(imageSet, '02-sidi-yahia-1') ?? content?.images.hero[1] ?? imageSet[1] ?? heroImage);
  const rahmaniaDuoLeftImage = isRahmania
    ? projectImageBySrc(imageSet, '12-whatsapp-image-2025-11-12-at-15-18-39') ?? RAHMANIA_DUO_LEFT_IMAGE
    : undefined;
  const rahmaniaDuoRightImage = isRahmania
    ? projectImageBySrc(imageSet, '13-whatsapp-image-2025-11-12-at-15-19-49') ?? RAHMANIA_DUO_RIGHT_IMAGE
    : undefined;
  const squareImage = (project ? getManualProjectImage(project.slug, 'square') : undefined)
    ?? rahmaniaDuoLeftImage
    ?? projectImageBySrc(imageSet, '03-sidi-yahia-2')
    ?? imageSet[2]
    ?? firstImage;
  const wideImage = (project ? getManualProjectImage(project.slug, 'wide') : undefined)
    ?? rahmaniaDuoRightImage
    ?? projectImageBySrc(imageSet, '09-whatsapp-image')
    ?? projectImageBySrc(imageSet, '01-12')
    ?? imageSet[3]
    ?? heroImage;
  const heroFacts = projectFacts.slice(0, 4).map((fact) => ({
    label: localized(fact.label, locale),
    value: localized(fact.value, locale),
  }));
  const heroTitleLines = editorial?.heroTitleLines ?? batModel?.hero.titleLines ?? [];

  const heroDescription = editorial?.heroDescription ?? null;

  const statement = editorial?.statement ?? (isSaidHamdine
    ? localValue(
      'A mixed urban complex held together by structure, access, housing and the discipline of delivery.',
      'Un ensemble urbain mixte tenu par la structure, les accès, le logement et la discipline de livraison.',
    )
    : isRahmania
      ? localValue(
        'Delivered in 2025, on schedule — every secondary trade coordinated to the standard a modern commercial building demands.',
        'Livré en 2025, dans les délais — chaque corps d état coordonné au niveau qu exige un équipement commercial moderne.',
      )
    : localValue(project?.summary ?? '', project?.summary ?? ''));

  const introText = editorial?.intro ?? (isSaidHamdine
    ? localValue(
      'Said Hamdine combines 202 promotional housing units, five residential blocks and two underground parking levels into one compact urban opération.',
      'Said Hamdine rassemble 202 logements promotionnels, cinq blocs résidentiels et deux niveaux de parking en sous-sol dans une opération urbaine compacte.',
    )
    : isRahmania
      ? localValue(
        "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services.",
        'Deux centres commerciaux au sein du programme de 2500 logements de Douira, aménagés pour accueillir commerces et services de proximité.',
      )
    : localValue(project?.summary ?? '', project?.summary ?? ''));

  const infoMetric = editorial?.metric ?? (isSaidHamdine ? '202' : isRahmania ? '2,500' : projectMetricFromRecord(project));
  const rahmaniaInfoHeading = localValue(
    "A hub of shops and services for the residents' daily needs.",
    'Un pôle de commerces et de services répondant aux besoins quotidiens des habitants.',
  );
  const rahmaniaInfoParagraph = localValue(
    'The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces, and user comfort — and their completion adds to the urban quality and economic life of the Douira district.',
    'Les deux centres forment un pôle d activités attractif au sein du programme résidentiel. Leur conception favorise l accessibilité, la fonctionnalité des espaces et le confort des usagers — et leur achèvement contribue à la valorisation du cadre urbain et au dynamisme économique de Douira.',
  );
  const rahmaniaColumnsIntro = localValue(
    'Igloo carried out the complete secondary works package for both centres — façades, interior finishes, and technical networks — turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.',
    'Igloo a réalisé l ensemble des corps d état secondaires des deux centres — façades, finitions intérieures et réseaux techniques — transformant deux structures en béton armé en espaces modernes et fonctionnels, prêts pour les commerçants et les usagers.',
  );
  const rahmaniaColumnsDetail = localValue(
    'The façades pair large glazed surfaces with decorative screen elements that give the buildings their identity. Inside, circulation is organised around a central staircase, and a pyramidal glass skylight draws natural light down through the retail levels.',
    "Les façades associent de larges surfaces vitrées à des éléments décoratifs qui signent l'identité des bâtiments. À l'intérieur, la circulation s'articule autour d'un escalier central, et une verrière pyramidale en verre diffuse la lumière naturelle à travers les niveaux commerciaux.",
  );
  const rahmaniaInfoTopline = localValue('OUR IMPACT', 'NOTRE IMPACT');
  const rahmaniaInfoEyebrow = localValue('PROXIMITY SERVICES', 'SERVICES DE PROXIMITÉ');
  const rahmaniaInfoMetricLabel = localValue('HOMES', 'LOGEMENTS');
  const rahmaniaCtaLabel = localValue('SEE THE CENTRES', 'VOIR LES CENTRES');
  const rahmaniaMetricCaptionLines =
    locale === 'fr'
      ? ['DANS UN QUARTIER', 'RÉSIDENTIEL STRUCTURE', 'ET DYNAMIQUE']
      : ['IN A THRIVING', 'MASTERPLANNED', 'NEIGHBOURHOOD'];
  const editorialColumns = editorial?.columns ?? [rahmaniaColumnsIntro, rahmaniaColumnsDetail];
  const infoGraphicSrc = (project ? getManualProjectImage(project.slug, 'info')?.src : undefined)
    ?? (isDouaouda
      ? '/projects/douaouda-300-500-housing/Draw.png'
      : '/projects/rahmania/community-graphic-line.png');
  const infoHeading = editorial?.infoHeading ?? rahmaniaInfoHeading;
  const infoParagraph = editorial?.infoParagraph ?? rahmaniaInfoParagraph;
  const infoTopline = editorial?.infoTopline ?? rahmaniaInfoTopline;
  const infoEyebrow = editorial?.infoEyebrow ?? rahmaniaInfoEyebrow;
  const infoMetricLabel = editorial?.metricLabel ?? rahmaniaInfoMetricLabel;
  const infoCtaLabel = editorial?.ctaLabel ?? rahmaniaCtaLabel;
  const infoMetricCaptionLines = editorial?.metricCaptionLines[locale] ?? rahmaniaMetricCaptionLines;

  useEffect(() => {
    if (slug && canonicalSlug && slug !== canonicalSlug) {
      navigate(`/projects/${canonicalSlug}`, { replace: true });
    }
  }, [canonicalSlug, navigate, slug]);

  const navigateWithTransition = (targetPath: string, imageSrc?: string) => {
    goTo(targetPath, imageSrc ?? heroImage?.src);
  };

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    document.title = content ? `${tr(content.title)} | Igloo Construction` : 'Project | Igloo Construction';
    return () => { document.title = 'Igloo Construction'; };
  }, [content, lenis, locale]);

  useGSAP(() => {
    if (!content || prefersReducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    const hero = root.querySelector<HTMLElement>('.bat-demo-hero');
    const heroImageElement = root.querySelector<HTMLElement>('[data-bat-parallax-hero] [data-bat-parallax-image]');
    const heroShade = root.querySelector<HTMLElement>('.bat-demo-hero__shade');
    const heroHeadline = root.querySelector<HTMLElement>('.bat-demo-hero__headline');
    const heroTitleItems = Array.from(root.querySelectorAll<HTMLElement>('.bat-demo-hero__title-line > span'));
    let cleanupHeroEntryRelease = () => {};
    const waitForPageTransition = typeof window !== 'undefined' && consumeBatPageTransitionEntry();

    if (heroImageElement) {
      const parallaxRange = getHeroImageParallaxRange();
      gsap.set(heroImageElement, {
        clearProps: 'transform,opacity',
      });
      gsap.set(heroImageElement, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: parallaxRange.from,
        opacity: 1,
        scale: Number(heroImageElement.dataset.manualScale ?? 1),
        transformOrigin: '50% 50%',
      });
    }

    gsap.set('.bat-demo-hero__headline', { opacity: 1, y: 0, yPercent: 0, scale: 1 });
    gsap.set('.bat-demo-hero__pretitle', { y: 18, opacity: 0 });
    gsap.set('.bat-demo-hero__tab', { y: 12, opacity: 0 });
    gsap.set('.bat-demo-hero__line', { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.bat-demo-hero__fact-label', { y: 12, opacity: 0 });
    gsap.set('.bat-demo-hero__fact-value', { y: 14, opacity: 0 });
    gsap.set(heroTitleItems, { yPercent: 102, opacity: 0, transformOrigin: 'left bottom' });

    const heroTl = gsap.timeline({
      paused: waitForPageTransition,
      defaults: { ease: 'power3.out' },
    });

    heroTl
      .to('.bat-demo-hero__pretitle', { y: 0, opacity: 1, duration: 0.58 }, 0.08)
      .to(heroTitleItems, { yPercent: 0, opacity: 1, duration: 0.82, stagger: 0.07 }, 0.16)
      .to('.bat-demo-hero__tab', { y: 0, opacity: 1, duration: 0.46 }, 0.72)
      .to('.bat-demo-hero__line', { scaleX: 1, duration: 0.66 }, 0.8)
      .to('.bat-demo-hero__fact-label', { y: 0, opacity: 1, duration: 0.48, stagger: 0.035 }, 1.02)
      .to('.bat-demo-hero__fact-value', { y: 0, opacity: 1, duration: 0.52, stagger: 0.035 }, 1.1);

    if (waitForPageTransition) {
      let hasPlayedHeroEntry = false;
      const playHeroEntry = () => {
        if (hasPlayedHeroEntry) return;
        hasPlayedHeroEntry = true;
        gsap.set('.bat-demo-hero__headline', { opacity: 1 });
        heroTl.restart();
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
      };
      const removeListener = onBatPageTransitionComplete(playHeroEntry);
      const fallback = window.setTimeout(playHeroEntry, 5200);
      cleanupHeroEntryRelease = () => {
        removeListener();
        window.clearTimeout(fallback);
      };
    }

    if (hero && heroImageElement) {
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })
        .to(heroImageElement, {
          yPercent: () => getHeroImageParallaxRange().to,
          opacity: 0.72,
          duration: 1,
        }, 0)
        .to(heroShade, { opacity: 0.1, duration: 1 }, 0)
        .to(heroHeadline, {
          y: () => (window.innerWidth >= 1280 ? -42 : window.innerWidth >= 680 ? -30 : -20),
          duration: 0.56,
        }, 0);
    }

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-editorial-parallax-frame]').forEach((frame) => {
      const image = frame.querySelector<HTMLElement>('[data-editorial-parallax-image]');
      if (!image) return;
      const shouldContain = image.dataset.fit === 'contain';
      const from = shouldContain ? 0 : Number(frame.dataset.editorialParallaxFrom ?? -10);
      const to = shouldContain ? 0 : Number(frame.dataset.editorialParallaxTo ?? 10);
      const manualScale = Number(image.dataset.manualScale);
      const scale = Number.isFinite(manualScale) && manualScale > 0 ? manualScale : shouldContain ? 1 : 1.08;

      gsap.fromTo(
        image,
        { yPercent: from, scale },
        {
          yPercent: to,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    /* Recompute trigger positions once images/fonts settle — lazy images can
       shift layout after the triggers are first measured */
    const settleRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 450);

    return () => {
      window.clearTimeout(settleRefresh);
      cleanupHeroEntryRelease();
    };
  }, { scope: rootRef, dependencies: [content?.slug, prefersReducedMotion] });

  if (!project || !content || !batModel || !heroImage || !firstImage || !squareImage || !wideImage) {
    return (
      <main className="igloo-editorial-missing">
        <p>{locale === 'fr' ? 'Projet introuvable' : 'Project not found'}</p>
        <Link to="/projects">{t('allProjects')}</Link>
      </main>
    );
  }

  const panoramaImage = (project ? getManualProjectImage(project.slug, 'panorama') : undefined) ?? heroImage;

  const relatedCount = Math.min(6, projects.length - 1);
  const relatedProjects = Array.from({ length: relatedCount }, (_, offset) => projects[(index + 1 + offset) % projects.length]).filter(
    (related) => related && related.slug !== project.slug,
  );

  return (
    <main ref={rootRef} className="bat-demo-page igloo-simple-project">
      <section id="hero" className="bat-demo-hero">
        <div className="bat-demo-hero__stage" aria-hidden="true">
          <div
            className="bat-demo-hero__image-wrap"
            data-bat-parallax-frame
            data-bat-parallax-hero
          >
            <img
              src={heroImage.src}
              alt={localized(heroImage.alt, locale)}
              className="bat-demo-hero__image"
              style={heroImageStyle}
              data-manual-scale={heroImageSettings?.scale ?? 1}
              data-bat-parallax-image
              data-bat-view-transition-hero
              decoding="async"
              fetchPriority="high"
              loading="eager"
            />
            <div className="bat-demo-hero__veil" />
          </div>
          <div className="bat-demo-hero__shade" />
        </div>

        <div className="bat-demo-hero__content">
          <div className="bat-demo-hero__copy">
            <div className="bat-demo-hero__headline">
              <p className="bat-demo-hero__pretitle">{project.coverLines[0]}</p>
              <h1
                className="bat-demo-hero__title"
                aria-label={heroTitleLines.join(' ')}
                data-bat-text-drift
                data-bat-text-drift-depth="18"
              >
                {heroTitleLines.map((line) => (
                  <span key={line} className="bat-demo-hero__title-line">
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
              {heroDescription && (
                <p className="igloo-simple-hero-description">{tr(heroDescription)}</p>
              )}
            </div>

            <div className="bat-demo-hero__info">
              <div className="bat-demo-hero__meta-row">
                <div className="bat-demo-hero__tab">
                  <span>{locale === 'fr' ? 'Informations projet' : 'Project info'}</span>
                </div>
              </div>

              <div className="bat-demo-hero__line" />
              <div className="bat-demo-hero__facts">
                {heroFacts.map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="bat-demo-hero__fact">
                    <span className="bat-demo-hero__fact-label">{fact.label}</span>
                    <span className="bat-demo-hero__fact-value">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="igloo-simple-split">
        <div className="igloo-simple-split__text" data-reveal>
          <p>{project.coverLines[0]}</p>
          <h2>{tr(introText)}</h2>
        </div>
        <div className="igloo-simple-split__image" data-reveal>
          <ParallaxImage image={firstImage} aspectRatio="4 / 3" loading="eager" from={-14} to={14} settings={introImageSettings} />
        </div>
      </section>

      <section className="igloo-simple-columns" aria-label="Project description" data-reveal>
        <p>{tr(editorialColumns[0])}</p>
        <p>{tr(editorialColumns[1])}</p>
      </section>

      {isRahmania && (
        <RahmaniaComparisonSection
          locale={locale}
          backgroundImage="/projects/douira-commercial-centers-2500-housing/10-rahmania-3.webp"
          beforeImage="/projects/douira-commercial-centers-2500-housing/00-rahmania-before.webp"
          afterImage="/projects/douira-commercial-centers-2500-housing/01-1.webp"
        />
      )}

      <section className="igloo-simple-statement" data-reveal>
        <h2>{tr(statement)}</h2>
      </section>

      <section className="igloo-simple-duo" aria-label="Project photographs">
        <div data-reveal>
          <ParallaxImage image={squareImage} aspectRatio="1 / 1" loading="eager" fit="cover" from={-13} to={13} settings={squareImageSettings} />
        </div>
        <div data-reveal>
          <ParallaxImage image={wideImage} aspectRatio="2 / 1" loading="eager" fit="cover" from={-11} to={11} settings={wideImageSettings} />
        </div>
      </section>

      <section className="igloo-simple-info igloo-simple-info--rahmania" aria-label="Project information" data-reveal>
          <div className="igloo-simple-info__topline" aria-hidden="true">
            <span className="igloo-simple-info__topline-rule" />
            <span className="igloo-simple-info__topline-dot" />
            <span className="igloo-simple-info__topline-label">{tr(infoTopline)}</span>
            <span className="igloo-simple-info__topline-rule" />
          </div>

          <div className="igloo-simple-info__body">
            <div className="igloo-simple-info__metric-panel">
              <figure
                className={`igloo-simple-info__graphic${isDouaouda ? ' igloo-simple-info__graphic--douaouda' : ''}`}
                data-editorial-parallax-frame
                data-editorial-parallax-from={-8}
                data-editorial-parallax-to={8}
                aria-hidden="true"
              >
                <img
                  src={infoGraphicSrc}
                  alt=""
                  style={infoImageSettings ? {
                    objectFit: infoImageSettings.fit,
                    objectPosition: `${infoImageSettings.positionX}% ${infoImageSettings.positionY}%`,
                  } : undefined}
                  loading="lazy"
                  decoding="async"
                  data-editorial-parallax-image
                  data-fit={infoImageSettings?.fit}
                  data-manual-scale={infoImageSettings?.scale}
                />
              </figure>

              <div className="igloo-simple-info__metric-copy">
                <span className="igloo-simple-info__metric-number">{infoMetric}</span>
                <div className="igloo-simple-info__metric-caption">
                  <p className="igloo-simple-info__metric-label">{tr(infoMetricLabel)}</p>
                  <p className="igloo-simple-info__metric-kicker">
                    {infoMetricCaptionLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="igloo-simple-info__cta"
                onClick={() => {
                  document.querySelector('.igloo-simple-panorama')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="igloo-simple-info__cta-icon" aria-hidden="true">
                  <ArrowDown className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="igloo-simple-info__cta-label">{tr(infoCtaLabel)}</span>
              </button>
            </div>

            <div className="igloo-simple-info__detail">
              <p className="igloo-simple-info__eyebrow">{tr(infoEyebrow)}</p>
              <h2>{tr(infoHeading)}</h2>
              <p className="igloo-simple-info__summary">{tr(infoParagraph)}</p>

              <div className="igloo-simple-info__rows" role="list" aria-label="Project highlights">
                {scopeItems.slice(0, 4).map((item) => {
                  const RowIcon = editorialIconMap[item.icon] ?? Plus;
                  return (
                    <div key={tr(item.text)} className="igloo-simple-info__row" role="listitem">
                      <span className="igloo-simple-info__row-icon" aria-hidden="true">
                        <RowIcon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span className="igloo-simple-info__row-text">{tr(item.text)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </section>

      <section className="igloo-simple-panorama" data-reveal>
        <ParallaxImage image={panoramaImage} aspectRatio="3 / 1" loading="eager" from={-10} to={10} settings={panoramaImageSettings} />
      </section>

      {relatedProjects.length > 0 && (
        <section className="igloo-simple-related" aria-label="Related projects">
          <div className="igloo-simple-related__head">
            <p>{locale === 'fr' ? 'Voir aussi' : 'More work'}</p>
            <h2>{locale === 'fr' ? 'Projets lies' : 'Related projects'}</h2>
          </div>
          <CardCarousel
            items={relatedProjects}
            getKey={(related) => related.slug}
            ariaLabel={locale === 'fr' ? 'Projets lies' : 'Related projects'}
            spaceBetween={26}
            slideClassName="!w-[280px] sm:!w-[320px] md:!w-[360px]"
            renderItem={(related) => {
              const relatedHeroImage = getProjectHeroImage(related);
              const relatedPath = `/projects/${related.slug}`;
              return (
                <Link
                  to={relatedPath}
                  className="igloo-simple-related__card"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateWithTransition(relatedPath, relatedHeroImage.src);
                  }}
                >
                  <figure
                    className="igloo-simple-parallax igloo-simple-related__media"
                    data-editorial-parallax-frame
                    data-editorial-parallax-from={-8}
                    data-editorial-parallax-to={8}
                  >
                    <img
                      src={relatedHeroImage.src}
                      alt={related.title}
                      loading="lazy"
                      decoding="async"
                      data-editorial-parallax-image
                    />
                  </figure>
                  <h3>{related.title}</h3>
                  <p>{(related.location || '').split(',')[0]}</p>
                </Link>
              );
            }}
            controls={({ prev, next, canPrev, canNext, progress }) => (
              <div className="igloo-simple-related__controls">
                <button type="button" aria-label={t('previous')} onClick={prev} disabled={!canPrev}>
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </button>
                <CarouselProgressBar progress={progress} className="flex-1 bg-black/10" />
                <button type="button" aria-label={t('next')} onClick={next} disabled={!canNext}>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            )}
          />
        </section>
      )}

      <Footer />
    </main>
  );
}
