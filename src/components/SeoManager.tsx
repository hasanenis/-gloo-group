import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageContent, getProjectPage, type ContentLocale, type PageDocument } from '../content';
import { localeFromPathname, localizedPath, LOCALE_CODES, useLocale, type Locale } from '../i18n';
import { companyProfile, projects } from '../data/projects';

const SITE_NAME = 'Igloo Construction';
const DEFAULT_SITE_URL = 'https://igloogroupe.com';
const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/u, '');
const DEFAULT_IMAGE = `${SITE_URL}/homepage/company-profile-showcase.png`;

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

function documentFor(pathname: string, locale: Locale): PageDocument | undefined {
  const route = pagePath(pathname);
  const projectSlug = route.match(/^\/projects\/([^/]+)\/?$/u)?.[1];
  try {
    if (projectSlug && projects.some((project) => project.slug === projectSlug)) {
      return getProjectPage(projectSlug, locale as ContentLocale);
    }
    const pageId = route === '/about' ? 'about' : route === '/contact' ? 'contact' : route === '/projects' ? 'projects-index' : route === '/404' ? 'not-found' : 'home';
    return getPageContent(pageId, locale as ContentLocale);
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

export default function SeoManager() {
  const { pathname } = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    const urlLocale = localeFromPathname(pathname) ?? locale;
    const route = pagePath(pathname);
    const slug = route.match(/^\/projects\/([^/]+)\/?$/u)?.[1];
    const project = slug ? projects.find((item) => item.slug === slug) : undefined;
    const pageDocument = documentFor(pathname, urlLocale);
    const title = pageDocument?.seo.title || (project ? `${project.title} | ${SITE_NAME}` : `${SITE_NAME} | Building for Algeria`);
    const description = pageDocument?.seo.description || project?.summary || 'Igloo Construction delivers residential and mixed-use construction projects in Algeria.';
    const canonicalPath = project ? `/projects/${project.slug}` : route;
    const canonicalUrl = `${SITE_URL}${localizedPath(urlLocale, canonicalPath)}`;
    const image = project?.images[0] || DEFAULT_IMAGE;

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: pageDocument?.seo.socialTitle || title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: pageDocument?.seo.socialDescription || description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: project ? 'article' : 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: urlLocale.replace('-', '_') });
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

    document.head.querySelectorAll('link[data-seo-hreflang]').forEach((element) => element.remove());
    for (const alternateLocale of LOCALE_CODES) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternateLocale === 'ar-DZ' ? 'ar-DZ' : alternateLocale;
      link.href = `${SITE_URL}${localizedPath(alternateLocale, canonicalPath)}`;
      link.dataset.seoHreflang = 'true';
      document.head.appendChild(link);
    }
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${SITE_URL}${localizedPath('en', canonicalPath)}`;
    xDefault.dataset.seoHreflang = 'true';
    document.head.appendChild(xDefault);

    setStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: companyProfile.name,
          url: SITE_URL,
          email: companyProfile.email,
          telephone: companyProfile.phones[0],
          foundingDate: String(companyProfile.foundedYear),
          address: { '@type': 'PostalAddress', addressLocality: 'Algiers', addressCountry: 'DZ' },
        },
        {
          '@type': project ? 'Project' : 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description,
          inLanguage: urlLocale,
          isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
          about: { '@id': `${SITE_URL}/#organization` },
          ...(project ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
        },
      ],
    });
  }, [locale, pathname]);

  return null;
}
