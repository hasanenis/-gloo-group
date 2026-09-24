const routeLoaders = {
  home: () => import('../pages/Home'),
  about: () => import('../pages/About'),
  contact: () => import('../pages/Contact'),
  projects: () => import('../pages/ProjectsDemo'),
  project: () => import('../pages/ProjectDetail'),
  services: () => import('../pages/Services'),
  service: () => import('../pages/ServiceDetail'),
} as const;

const pending = new Map<string, Promise<unknown>>();

/** Warm the matching route chunk on pointer or keyboard intent. */
export function preloadRoute(href: string) {
  const pathname = href.split(/[?#]/u, 1)[0].replace(/^\/(?:en|fr|tr|ar)(?=\/|$)/u, '') || '/';
  const key = pathname === '/' ? 'home'
    : /^\/projects\/[^/]+\/?$/u.test(pathname) ? 'project'
      : /^\/projects\/?$/u.test(pathname) ? 'projects'
        : /^\/services\/[^/]+\/?$/u.test(pathname) ? 'service'
          : /^\/services\/?$/u.test(pathname) ? 'services'
            : /^\/about\/?$/u.test(pathname) ? 'about'
              : /^\/contact\/?$/u.test(pathname) ? 'contact' : undefined;
  if (!key || pending.has(key)) return;
  const promise = routeLoaders[key]();
  pending.set(key, promise);
  void promise.catch(() => pending.delete(key));
}
