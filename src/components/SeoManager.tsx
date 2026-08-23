import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageContent, getProjectPage, type ContentLocale, type PageDocument } from '../content';
import { localeFromPathname, localizedPath, useLocale, type Locale } from '../i18n';
import { brandEntity, DEFAULT_SOCIAL_IMAGE, documentLanguageTag, HREFLANG_ALTERNATES, isServiceSlug, SERVICE_SLUGS, SITE_URL } from '../data/siteSeo';
import { localizedProjectTitle, projects } from '../data/projects';

type SeoContent = {
  heading?: string;
  lead?: string;
};

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

function pagePath(pathname: string) {
  return pathname.replace(/^\/(?:en|fr|tr|ar)(?=\/|$)/u, '') || '/';
}

function localizedSeoPath(locale: Locale, route: string) {
  const value = localizedPath(locale, route);
  return route === '/' ? `${value}/` : value;
}

function pageDocumentFor(pathname: string, locale: Locale): PageDocument<SeoContent> | undefined {
  const route = pagePath(pathname);
  const projectSlug = route.match(/^\/projects\/([^/]+)\/?$/u)?.[1];
  const serviceSlug = route.match(/^\/services\/([^/]+)\/?$/u)?.[1];

  try {
    if (projectSlug && projects.some((project) => project.slug === projectSlug)) {
      return getProjectPage<SeoContent>(projectSlug, locale as ContentLocale);
    }
    if (serviceSlug && isServiceSlug(serviceSlug)) {
      return getPageContent<SeoContent>(`services/${serviceSlug}`, locale as ContentLocale);
    }
    const pageId = route === '/about'
      ? 'about'
      : route === '/contact'
        ? 'contact'
        : route === '/projects'
          ? 'projects-index'
          : route === '/services'
            ? 'services'
            : route === '/404'
              ? 'not-found'
              : 'home';
    return getPageContent<SeoContent>(pageId, locale as ContentLocale);
  } catch {
    return undefined;
  }
}

function setStructuredData(value: unknown) {
  let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoSchema = 'true';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(value);
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: brandEntity.address.streetAddress,
    addressLocality: brandEntity.address.addressLocality,
    addressRegion: brandEntity.address.addressRegion,
    addressCountry: brandEntity.address.addressCountry,
  };
}

const breadcrumbLabels: Record<Locale, { projects: string; services: string }> = {
  en: { projects: 'Projects', services: 'Services' },
  fr: { projects: 'Projets', services: 'Services' },
  tr: { projects: 'Projeler', services: 'Hizmetler' },
  'ar-DZ': { projects: '\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639', services: '\u0627\u0644\u062e\u062f\u0645\u0627\u062a' },
};

function breadcrumbItems(route: string, locale: Locale, pageName: string) {
  const items: Array<Record<string, unknown>> = [
    { '@type': 'ListItem', position: 1, name: brandEntity.brandName, item: `${SITE_URL}${localizedSeoPath(locale, '/')}` },
  ];
  const segments = route.split('/').filter(Boolean);
  if (segments[0] === 'projects') {
    items.push({ '@type': 'ListItem', position: 2, name: breadcrumbLabels[locale].projects, item: `${SITE_URL}${localizedSeoPath(locale, '/projects')}` });
  } else if (segments[0] === 'services') {
    items.push({ '@type': 'ListItem', position: 2, name: breadcrumbLabels[locale].services, item: `${SITE_URL}${localizedSeoPath(locale, '/services')}` });
  }
  if (segments.length > 1) {
    items.push({ '@type': 'ListItem', position: items.length + 1, name: pageName });
  } else if (segments.length === 1 && segments[0] !== 'projects' && segments[0] !== 'services') {
    items.push({ '@type': 'ListItem', position: 2, name: pageName });
  }
  return items;
}

export function buildSeoGraph({
  canonicalUrl,
  description,
  locale,
  pageName,
  project,
  route,
  serviceSlug,
  title,
}: {
  canonicalUrl: string;
  description: string;
  locale: Locale;
  pageName: string;
  project?: (typeof projects)[number];
  route: string;
  serviceSlug?: string;
  title: string;
}) {
  const pageLanguage = documentLanguageTag(locale);
  const organization = {
    '@type': ['Organization', 'LocalBusiness', 'GeneralContractor'],
    '@id': `${SITE_URL}/#organization`,
    name: brandEntity.legalName,
    alternateName: [brandEntity.brandName, ...brandEntity.alternateNames],
    url: brandEntity.url,
    logo: { '@type': 'ImageObject', url: brandEntity.logo },
    ...(brandEntity.sameAs.length > 0 ? { sameAs: brandEntity.sameAs } : {}),
    email: brandEntity.email,
    foundingDate: '2018',
    areaServed: brandEntity.areaServed,
    address: postalAddress(),
    ...(brandEntity.telephone.length > 0
      ? {
          telephone: brandEntity.telephone,
          contactPoint: brandEntity.telephone.map((telephone) => ({
            '@type': 'ContactPoint',
            telephone,
            contactType: 'customer service',
            areaServed: telephone.startsWith('+213') ? 'DZ' : 'International',
          })),
        }
      : {}),
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: brandEntity.brandName,
    alternateName: brandEntity.alternateNames,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: pageLanguage,
  };
  const page: Record<string, unknown> = {
    '@type': route === '/contact' ? 'ContactPage' : route === '/projects' || route === '/services' ? 'CollectionPage' : 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: pageLanguage,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    ...(route !== '/' ? { breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` } } : {}),
  };

  if (route === '/contact') page.mainEntity = { '@id': `${SITE_URL}/#organization` };
  if (project) {
    page.mainEntity = {
      '@type': 'CreativeWork',
      '@id': `${canonicalUrl}#project`,
      name: pageName,
      description: project.summary,
      url: canonicalUrl,
      creator: { '@id': `${SITE_URL}/#organization` },
      inLanguage: pageLanguage,
      locationCreated: { '@type': 'Place', name: project.location },
      image: project.images,
    };
  }

  const graph: Array<Record<string, unknown>> = [organization, website, page];

  if (route !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems(route, locale, pageName),
    });
  }

  if (route === '/projects') {
    const itemListId = `${canonicalUrl}#itemlist`;
    page.mainEntity = { '@id': itemListId };
    graph.push({
      '@type': 'ItemList',
      '@id': itemListId,
      name: pageName,
      numberOfItems: projects.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: projects.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: localizedProjectTitle(item, locale),
        url: `${SITE_URL}${localizedSeoPath(locale, `/projects/${item.slug}`)}`,
      })),
    });
  }

  if (serviceSlug && SERVICE_SLUGS.includes(serviceSlug as (typeof SERVICE_SLUGS)[number])) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: pageName,
      description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: brandEntity.areaServed,
      serviceType: pageName,
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    const urlLocale = localeFromPathname(pathname) ?? locale;
    const route = pagePath(pathname);
    const projectSlug = route.match(/^\/projects\/([^/]+)\/?$/u)?.[1];
    const serviceSlug = route.match(/^\/services\/([^/]+)\/?$/u)?.[1];
    const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : undefined;
    const pageDocument = pageDocumentFor(pathname, urlLocale);
    const pageName = pageDocument?.content.heading || project?.title || (route === '/services' ? 'Construction services' : route === '/projects' ? 'Projects' : brandEntity.brandName);
    const title = pageDocument?.seo.title || `${pageName} | ${brandEntity.brandName}`;
    const description = pageDocument?.seo.description || pageDocument?.content.lead || project?.summary || 'Igloo Construction, SARL Igloo Yapi Construction, delivers residential, commercial and infrastructure construction projects in Algeria.';
    const canonicalPath = project ? `/projects/${project.slug}` : route;
    const canonicalUrl = `${SITE_URL}${localizedSeoPath(urlLocale, canonicalPath)}`;
    const image = project?.images[0] || DEFAULT_SOCIAL_IMAGE;
    const isNoIndex = route === '/404';

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[name="robots"]', { name: 'robots', content: isNoIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: pageDocument?.seo.socialTitle || title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: pageDocument?.seo.socialDescription || description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: project ? 'article' : 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${brandEntity.brandName} - ${pageName}` });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: brandEntity.brandName });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: documentLanguageTag(urlLocale).replace('-', '_') });
    document.head.querySelectorAll('meta[data-seo-og-locale]').forEach((element) => element.remove());
    HREFLANG_ALTERNATES
      .map((alternate) => alternate.hreflang)
      .filter((alternate) => alternate !== documentLanguageTag(urlLocale))
      .forEach((alternate) => {
        setMeta(`meta[data-seo-og-locale="${alternate}"]`, {
          property: 'og:locale:alternate',
          content: alternate.replace('-', '_'),
          'data-seo-og-locale': alternate,
        });
      });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove());
    for (const alternate of HREFLANG_ALTERNATES) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternate.hreflang;
      link.href = `${SITE_URL}${localizedSeoPath(alternate.locale, canonicalPath)}`;
      link.dataset.seoHreflang = 'true';
      document.head.appendChild(link);
    }
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${SITE_URL}${localizedSeoPath('en', canonicalPath)}`;
    xDefault.dataset.seoHreflang = 'true';
    document.head.appendChild(xDefault);

    setStructuredData(buildSeoGraph({ canonicalUrl, description, locale: urlLocale, pageName, project, route, serviceSlug, title }));
  }, [locale, pathname]);

  return null;
}
