import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
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
import {
  localizedProjectScope,
  localizedProjectStatus,
  localizedProjectSummary,
  projects,
  type ProjectRecord,
} from '../data/projects';
import { buildBatProjectPageModel } from '../data/batProjectModel';
import { getProjectContent, localized, type LocalizedText, type ProjectContent, type ProjectFact, type ProjectImage } from '../data/projectContent';
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
import { localizedPath, pickLocaleText, useLocale, type LocalizedString } from '../i18n';
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

type LocalizedValue = LocalizedText;

function localValue(en: string, fr = en, arDz?: string, tr?: string): LocalizedValue {
  return { en, fr, 'ar-DZ': arDz, tr };
}

function copyFor(locale: Parameters<typeof pickLocaleText>[0], value: LocalizedString) {
  return pickLocaleText(locale, value);
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
    "Escalier courbe et garde-corps inox à l'intérieur du centre commercial de Douira.", 'سلم منحنٍ ودرابزين من الفولاذ المقاوم للصدأ داخل مركز "دويرة" التجاري.', "Douira Ticaret Merkezi'nde kavisli merdiven ve paslanmaz çelik korkuluklar.",
  ),
  caption: localValue(
    'Interior circulation and staircase finishes in the Douira commercial centre.',
    "Circulation intérieure et finitions d'escalier dans le centre commercial de Douira.", 'مسارات الحركة الداخلية وتشطيبات السلالم في مركز دويرة التجاري.', "Douira Ticaret Merkezi'nde iç dolaşım alanları ve merdiven bitiş detayları.",
  ),
};

const RAHMANIA_DUO_RIGHT_IMAGE: ProjectImage = {
  src: '/projects/douira-commercial-centers-2500-housing/13-whatsapp-image-2025-11-12-at-15-19-49.webp',
  alt: localValue(
    'Modern interior stair hall in the Douira commercial centre.',
    "Hall d'escalier moderne dans le centre commercial de Douira.", 'ردهة سلالم داخلية عصرية في مركز "دويرة" التجاري.', "Douira Ticaret Merkezi'nin modern tasarımlı merdiven holü.",
  ),
  caption: localValue(
    'Completed staircase hall serving the commercial centre levels.',
    "Hall d'escalier achevé desservant les niveaux du centre commercial.", 'قاعة السلالم المنجزة التي تخدم طوابق المركز التجاري.', 'Ticaret merkezi katlarına ulaşım sağlayan merdiven holünün tamamlanmış hali.',
  ),
};

function projectValue(project: ProjectRecord, getter: typeof localizedProjectScope): LocalizedText {
  return localValue(
    getter(project, 'en'),
    getter(project, 'fr'),
    getter(project, 'ar-DZ'),
    getter(project, 'tr'),
  );
}

function buildScopeItems(project: ProjectRecord, content?: ProjectContent): ProjectEditorialScopeItem[] {
  const authored = content
    ? [content.description[0], ...(content.facilityGroups[0]?.items ?? []), content.summary[0]].filter(Boolean)
    : [];
  const fallback = [
    projectValue(project, localizedProjectScope),
    projectValue(project, localizedProjectSummary),
  ];
  const icons: ProjectEditorialIcon[] = ['building', 'network', 'delivery', 'commerce'];
  return (authored.length ? authored : fallback).slice(0, 4).map((text, index) => ({
    icon: icons[index] ?? 'building',
    text,
  }));
}

function buildProjectFacts(project: ProjectRecord, contentFacts: ProjectFact[]) {
  const find = (pattern: RegExp) => contentFacts.find((fact) => pattern.test(fact.label.en));
  const projectType = find(/project type|nature/i) ?? {
    label: localValue('Project type', 'Nature du projet', 'نوع المشروع', 'Proje türü'),
    value: projectValue(project, localizedProjectScope),
  };
  const location = find(/location|localisation/i) ?? {
    label: localValue('Location', 'Localisation', 'الموقع', 'Konum'),
    value: localValue(project.location, project.location, project.location, project.location),
  };
  const status: ProjectFact = {
    label: localValue('Status', 'Statut', 'الحالة', 'Durum'),
    value: projectValue(project, localizedProjectStatus),
  };
  const client = find(/client|owner|employer/i);
  const selected = [projectType, location, status, client].filter((fact): fact is ProjectFact => Boolean(fact));
  const selectedKeys = new Set(selected.map((fact) => `${fact.label.en}:${fact.value.en}`));
  const remainder = contentFacts.filter((fact) => !selectedKeys.has(`${fact.label.en}:${fact.value.en}`));
  return uniqueFacts([...selected, ...remainder]).slice(0, 6);
}

function getIntrinsicImageSize(aspectRatio: string) {
  const [widthPart, heightPart] = aspectRatio.split('/').map((part) => Number(part.trim()));
  const width = 1600;
  const height = Number.isFinite(widthPart) && Number.isFinite(heightPart) && widthPart > 0 && heightPart > 0
    ? Math.round(width * (heightPart / widthPart))
    : 1200;
  return { width, height };
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
  const { width, height } = getIntrinsicImageSize(aspectRatio);

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
        width={width}
        height={height}
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
  const useEditorialCopy = Boolean(editorial);
  const batModel = useMemo(() => (project ? buildBatProjectPageModel(project, locale) : undefined), [project, locale]);
  const isSaidHamdine = project?.slug === 'said-hamdine-mixed-real-estate';
  const isRahmania = project?.slug === 'rahmania';
  const isDouaouda = project?.slug === 'douaouda-300-500-housing';

  const tr = (value: LocalizedValue) => localized(value, locale);
  const contentFacts = useMemo(() => (content ? uniqueFacts([...content.meta, ...content.details]) : []), [content]);
  const projectFacts = useMemo(
    () => (useEditorialCopy ? editorial?.facts : undefined) ?? (project ? buildProjectFacts(project, contentFacts) : []),
    [contentFacts, editorial, project, useEditorialCopy],
  );
  const scopeItems = useMemo(
    () => (useEditorialCopy ? editorial?.scopeItems : undefined) ?? (project ? buildScopeItems(project) : []),
    [content, editorial, project, useEditorialCopy],
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
  const heroTitleLines = (useEditorialCopy ? editorial?.heroTitleLines : undefined) ?? batModel?.hero.titleLines ?? [];

  const heroDescription = (useEditorialCopy ? editorial?.heroDescription : undefined) ?? content?.seo ?? null;

  const statement = (useEditorialCopy ? editorial?.statement : undefined) ?? content?.description[0] ?? (isSaidHamdine
    ? localValue(
      'A mixed urban complex held together by structure, access, housing and the discipline of delivery.',
      "Un complexe urbain mixte structuré autour de l'ossature, des accès, des logements et d'une exécution rigoureuse.", 'مجمع حضري متعدد الاستخدامات تتماسك عناصره بفضل البنية الهيكلية، وشبكة الوصول، والإسكان، وانضباط التنفيذ.', 'Yapısı, ulaşım olanakları, konutları ve planlı uygulama disipliniyle bütünleşen karma bir kent kompleksi.',
    )
    : isRahmania
      ? localValue(
        'Delivered in 2025, on schedule — every secondary trade coordinated to the standard a modern commercial building demands.',
        "Livré en 2025, dans les délais. Chaque corps d'état secondaire a été coordonné pour répondre aux standards d'un bâtiment commercial moderne.", 'يتم التسليم في عام 2025 وفقاً للجدول الزمني، مع تنسيق كافة الأعمال التخصصية لتلبي المعايير التي تتطلبها المباني التجارية العصرية.', 'Proje, 2025 yılında takvime uygun olarak tamamlandı. Tüm ince işler, modern bir ticari yapının gerektirdiği standartlara göre koordine edildi.',
      )
    : localValue(project?.summary ?? '', project?.summary ?? ''));

  const introText = (useEditorialCopy ? editorial?.intro : undefined) ?? content?.summary[0] ?? (isSaidHamdine
    ? localValue(
      'Said Hamdine combines 202 promotional housing units, five residential blocks, one basement parking level and three commercial entre-sols with a mezzanine on a steeply sloping site.',
      "Said Hamdine rassemble 202 logements promotionnels, cinq blocs résidentiels, un sous-sol de parking et trois entre-sols commerciaux avec mezzanine sur un terrain à forte pente.", 'يجمع مشروع "سعيد حمدين" بين 202 وحدة سكنية ترويجية وخمس كتل سكنية وطابق سفلي واحد للمواقف وثلاثة طوابق تجارية نصفية مع ميزانين، على أرضية شديدة الانحدار.', 'Said Hamdine projesi; eğimli bir arazide yer alan 202 serbest satışlı konut, beş konut bloğu, bir bodrum otoparkı ve mezzaninli üç ticari ara kattan oluşan karma bir kent projesidir.',
    )
    : isRahmania
      ? localValue(
        "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services.",
        'Deux centres commerciaux au sein du programme de 2 500 logements de Douira, aménagés pour accueillir les commerces et services de proximité du quartier.', 'مركزان تجاريان ضمن مشروع "دويرة" السكني (الذي يضم 2500 وحدة سكنية)، مجهّزان لاستيعاب متاجر الحي والخدمات اليومية.', "Douira'daki 2.500 konutluk projenin içinde, bölgedeki dükkanlara ve günlük hizmetlere ev sahipliği yapacak iki ticaret merkezi.",
      )
    : localValue(project?.summary ?? '', project?.summary ?? ''));

  const infoMetric = editorial?.metric ?? (isSaidHamdine ? '202' : isRahmania ? '2,500' : projectMetricFromRecord(project));
  const rahmaniaInfoHeading = localValue(
    "A hub of shops and services for the residents' daily needs.",
    'Un pôle de commerces et de services répondant aux besoins quotidiens des habitants.', 'مركز يضم متاجر وخدمات لتلبية الاحتياجات اليومية للسكان.', 'Bölge sakinlerinin günlük ihtiyaçlarına yönelik bir dükkan ve hizmet merkezi.',
  );
  const rahmaniaInfoParagraph = localValue(
    'The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces, and user comfort — and their completion adds to the urban quality and economic life of the Douira district.',
    "Les deux centres forment un pôle d'activités attractif au sein du programme résidentiel. Leur conception favorise l'accessibilité, la fonctionnalité des espaces et le confort des usagers — leur achèvement contribue ainsi à la valorisation du cadre urbain et au dynamisme économique du quartier de Douira.", 'يشكّل المركزان محوراً حيوياً وجذاباً ضمن المشروع السكني؛ إذ يراعي تصميمهما سهولة الوصول وتوفير مساحات عملية وراحة المستخدمين، كما يُسهم إنجازهما في تعزيز الجودة العمرانية والحياة الاقتصادية في منطقة "دويرة".', 'Bu iki merkez, konut projesi içinde çekici birer aktivite odağı oluşturuyor. Yerleşim planında ulaşım kolaylığı, işlevsel mekanlar ve kullanıcı konforu ön planda tutuldu. Projenin tamamlanması Douira bölgesinin kent kalitesini ve ekonomik canlılığını artırıyor.',
  );
  const rahmaniaColumnsIntro = localValue(
    'Igloo carried out the complete secondary works package for both centres — façades, interior finishes, and technical networks — turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.',
    "Igloo a réalisé l'ensemble des corps d'état secondaires pour les deux centres — façades, finitions intérieures et réseaux techniques — transformant ainsi deux structures en béton armé en espaces modernes et fonctionnels, prêts à accueillir commerçants et usagers.", 'نفذت شركة "إيغلو" (Igloo) حزمة الأعمال الثانوية الكاملة لكلا المركزين — بما في ذلك الواجهات والتشطيبات الداخلية والشبكات الفنية — محولةً بذلك مبنيين من الخرسانة المسلحة إلى مساحات عصرية وعملية، جاهزة لخدمة التجار والمستخدمين اليوميين.', 'Igloo, her iki merkezin de cephelerini, iç mekanlarını ve teknik ağlarını kapsayan tüm ince işlerini yürüttü. Böylece iki betonarme karkası, esnaf ve ziyaretçiler için modern ve işlevsel mekanlar haline getirdi.',
  );
  const rahmaniaColumnsDetail = localValue(
    'The façades pair large glazed surfaces with decorative screen elements that give the buildings their identity. Inside, circulation is organised around a central staircase, and a pyramidal glass skylight draws natural light down through the retail levels.',
    "Les façades associent de larges surfaces vitrées à des éléments décoratifs qui signent l'identité des bâtiments. À l'intérieur, la circulation s'articule autour d'un escalier central, et une verrière pyramidale en verre diffuse la lumière naturelle à travers les niveaux commerciaux.", 'تجمع الواجهات بين مساحات زجاجية كبيرة وعناصر حجب زخرفية تمنح المباني هويتها المميزة. أما في الداخل، فتنتظم حركة التنقل حول درج مركزي، وتعمل نافذة سقفية زجاجية هرمية الشكل على توجيه الضوء الطبيعي ليتخلل طوابق المحلات التجارية.', 'Cephelerde, binaya kimliğini kazandıran dekoratif paravanlar ve geniş cam yüzeyler bir arada kullanıldı. İçeride dolaşım, merkezi bir merdiven etrafında çözüldü. Piramit formundaki cam çatı ışıklığı ise doğal ışığı mağaza katlarına taşıyor.',
  );
  const rahmaniaInfoTopline = localValue('OUR IMPACT', 'NOTRE IMPACT', 'الأثر تاعنا', 'KATKIMIZ');
  const rahmaniaInfoEyebrow = localValue('PROXIMITY SERVICES', 'SERVICES DE PROXIMITÉ', 'خدمات القرب', 'Çevre Hizmetleri');
  const rahmaniaInfoMetricLabel = localValue('HOMES', 'LOGEMENTS', 'سكن', 'Konut');
  const rahmaniaMetricCaptionLines = {
    en: ['IN A THRIVING', 'MASTERPLANNED', 'NEIGHBOURHOOD'],
    fr: ['DANS UN QUARTIER', 'RÉSIDENTIEL STRUCTURÉ', 'ET DYNAMIQUE'],
    'ar-DZ': ['في حي', 'سكني منظم', 'ونشيط'],
    tr: ['PLANLI KONUT', 'TİCARİ BİRİMLER', 'GÜNLÜK HİZMETLER'],
  }[locale];
  const editorialColumns = (useEditorialCopy ? editorial?.columns : undefined) ?? (content
    ? [content.summary[0] ?? content.seo, content.description[0] ?? content.summary[0] ?? content.seo]
    : [rahmaniaColumnsIntro, rahmaniaColumnsDetail]);
  const infoGraphicSrc = (project ? getManualProjectImage(project.slug, 'info')?.src : undefined)
    ?? (isDouaouda
      ? '/projects/douaouda-300-500-housing/Draw.png'
      : '/projects/rahmania/community-graphic-line.png');
  const infoHeading = (useEditorialCopy ? editorial?.infoHeading : undefined) ?? content?.title ?? rahmaniaInfoHeading;
  const infoParagraph = (useEditorialCopy ? editorial?.infoParagraph : undefined) ?? content?.description[0] ?? rahmaniaInfoParagraph;
  const infoTopline = (useEditorialCopy ? editorial?.infoTopline : undefined) ?? content?.eyebrow ?? rahmaniaInfoTopline;
  const infoEyebrow = (useEditorialCopy ? editorial?.infoEyebrow : undefined) ?? content?.eyebrow ?? rahmaniaInfoEyebrow;
  const infoMetricLabel = (useEditorialCopy ? editorial?.metricLabel : undefined) ?? rahmaniaInfoMetricLabel;
  const projectEyebrow = content ? localized(content.eyebrow, locale) : project?.coverLines[0] ?? '';
  const metricKey = locale === 'fr' ? 'fr' : 'en';
  const infoMetricCaptionLines = editorial?.metricCaptionLines[locale]
    ?? editorial?.metricCaptionLines[metricKey]
    ?? rahmaniaMetricCaptionLines;

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
        <p>{copyFor(locale, { en: 'Project not found', fr: 'Projet introuvable', dz: 'المشروع ما تلقاش', tr: 'Proje bulunamadı' })}</p>
        <Link to={localizedPath(locale, '/projects')}>{t('allProjects')}</Link>
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
              width={1920}
              height={1200}
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
              <p className="bat-demo-hero__pretitle">{projectEyebrow}</p>
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
                  <span>{copyFor(locale, { en: 'Project info', fr: 'Informations projet', dz: 'معلومات المشروع', tr: 'Proje Bilgileri' })}</span>
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
          <p>{projectEyebrow}</p>
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
                    width={1200}
                    height={900}
                    style={infoImageSettings ? {
                    objectFit: infoImageSettings.fit,
                    objectPosition: `${infoImageSettings.positionX}% ${infoImageSettings.positionY}%`,
                  } : undefined}
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
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
        <ParallaxImage image={panoramaImage} aspectRatio="3 / 1" loading="lazy" from={-10} to={10} settings={panoramaImageSettings} />
      </section>

      {relatedProjects.length > 0 && (
        <section className="igloo-simple-related" aria-label="Related projects">
          <div className="igloo-simple-related__head">
            <p>{copyFor(locale, { en: 'More work', fr: 'Autres projets', dz: 'مشاريع أخرى', tr: 'Diğer Projelerimiz' })}</p>
            <h2>{copyFor(locale, { en: 'Related projects', fr: 'Projets liés', dz: 'مشاريع قريبة', tr: 'Benzer Projeler' })}</h2>
          </div>
          <CardCarousel
            items={relatedProjects}
            getKey={(related) => related.slug}
            ariaLabel={copyFor(locale, { en: 'Related projects', fr: 'Projets liés', dz: 'مشاريع قريبة', tr: 'Benzer Projeler' })}
            spaceBetween={26}
            slideClassName="!w-[280px] sm:!w-[320px] md:!w-[360px]"
            renderItem={(related) => {
              const relatedHeroImage = getProjectHeroImage(related);
              const relatedPath = `/projects/${related.slug}`;
              return (
                <Link
                  to={localizedPath(locale, relatedPath)}
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
                      width={1200}
                      height={900}
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
