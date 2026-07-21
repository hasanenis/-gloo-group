export type RouteTransitionKind = 'project-detail' | 'projects-index' | 'site';

const LOCALE_PREFIX = /^\/(?:en|fr|tr|ar)(?=\/|$)/u;

export function withoutLocalePrefix(pathname: string) {
  const normalized = pathname.replace(LOCALE_PREFIX, '') || '/';
  return normalized.length > 1 ? normalized.replace(/\/+$/u, '') : normalized;
}

export function getRouteTransitionKind(pathname: string): RouteTransitionKind {
  const route = withoutLocalePrefix(pathname);

  if (/^\/(?:bat-demo\/)?projects\/[^/]+$/u.test(route)) {
    return 'project-detail';
  }

  if (route === '/projects' || route === '/bat-demo/projects') {
    return 'projects-index';
  }

  return 'site';
}

export function getSiteTransitionMeta(pathname: string) {
  const route = withoutLocalePrefix(pathname);
  const segments = route.split('/').filter(Boolean);
  const root = segments[0] ?? '';

  if (!root) return { index: '01', label: 'HOME' };
  if (root === 'about') return { index: '02', label: 'COMPANY' };
  if (root === 'services') {
    return {
      index: segments.length > 1 ? '04.1' : '04',
      label: segments.length > 1
        ? segments[1].replace(/-/gu, ' ').toUpperCase()
        : 'SERVICES',
    };
  }
  if (root === 'contact') return { index: '05', label: 'CONTACT' };
  if (root === '404') return { index: '00', label: 'NOT FOUND' };

  return { index: '00', label: root.replace(/-/gu, ' ').toUpperCase() };
}
