import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist');
const siteUrl = (process.env.VITE_SITE_URL || 'https://igloogroupe.com').replace(/\/$/u, '');
const locales = ['en', 'fr', 'tr', 'ar'];
const documentLocales = { en: 'en', fr: 'fr-DZ', tr: 'tr', ar: 'ar-DZ' };
const hreflangAlternates = [
  { hreflang: 'en', locale: 'en' },
  { hreflang: 'fr', locale: 'fr' },
  { hreflang: 'fr-DZ', locale: 'fr' },
  { hreflang: 'tr', locale: 'tr' },
  { hreflang: 'ar-DZ', locale: 'ar' },
];

async function pruneBuildOnlyAssets() {
  // These are source/editor exports kept under public/ for local curation.
  // They are not referenced by the application and should never inflate the
  // production artifact or deployment by gigabytes.
  for (const relativePath of ['Upscaled', 'projects/_selected-by-project', 'projects/_unused-by-project']) {
    await fs.rm(path.join(dist, relativePath), { recursive: true, force: true });
  }
}

async function pageRoutes() {
  const result = ['', 'about', 'contact', 'projects', 'services', '404'];
  const projectRoot = path.join(root, 'content', 'pages', 'projects');
  for (const entry of await fs.readdir(projectRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(`projects/${entry.name}`);
  }
  const serviceRoot = path.join(root, 'content', 'pages', 'services');
  for (const entry of await fs.readdir(serviceRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(`services/${entry.name}`);
  }
  return result;
}

function outputFile(locale, route) {
  return path.join(dist, locale, ...(route ? route.split('/') : []), 'index.html');
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* preview is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not start: ${url}`);
}

async function startPreview() {
  if (process.env.PRERENDER_URL) return { url: process.env.PRERENDER_URL.replace(/\/$/u, ''), child: null };
  // Spawn Vite directly instead of a Windows npm.cmd shell. Killing the npm
  // wrapper leaves a detached vite process (and keeps CI hanging after all
  // pages have been written).
  const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: root,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr.on('data', (chunk) => process.stderr.write(chunk));
  await waitForServer('http://127.0.0.1:4173/');
  return { url: 'http://127.0.0.1:4173', child };
}

async function writeSitemap(routes) {
  const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  const entries = [];
  for (const route of routes.filter((value) => value !== '404')) {
    const canonicalRoute = route ? `/${route}` : '/';
    const canonicalUrls = locales.map((locale) => `${siteUrl}/${locale}${canonicalRoute === '/' ? '/' : canonicalRoute}`);
    const alternateUrls = hreflangAlternates.map(({ locale }) => `${siteUrl}/${locale}${canonicalRoute === '/' ? '/' : canonicalRoute}`);
    locales.forEach((locale, index) => {
      entries.push(`  <url>\n    <loc>${escapeXml(canonicalUrls[index])}</loc>\n${hreflangAlternates.map(({ hreflang }, alternateIndex) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(alternateUrls[alternateIndex])}" />`).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(canonicalUrls[0])}" />\n  </url>`);
    });
  }
  await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`, 'utf8');
  await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
}

await pruneBuildOnlyAssets();
const routes = await pageRoutes();
const { url, child } = await startPreview();
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    sessionStorage.setItem('igloo:intro-seen', 'true');
  });
  for (const locale of locales) {
    for (const route of routes) {
      const target = `${url}/${locale}${route ? `/${route}` : ''}`;
      const page = await context.newPage();
      await page.addInitScript((preferredLocale) => {
        localStorage.setItem('igloo:locale', preferredLocale === 'ar' ? 'ar-DZ' : preferredLocale);
      }, locale);
      // Prerendering only needs the rendered HTML. Remote media and fonts can
      // keep a marketing page network-busy indefinitely, so skip those assets
      // while preserving scripts, styles, JSON and the actual text content.
      await page.route('**/*', (routeRequest) => {
        if (['image', 'font', 'media'].includes(routeRequest.request().resourceType())) return routeRequest.abort();
        return routeRequest.continue();
      });
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.locator('main').first().waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {});
      const expectedCanonical = `${siteUrl}/${locale}${route ? `/${route}` : '/'}`;
      await page.waitForFunction(
        ({ locale: expectedDocumentLocale, canonical: expectedCanonicalUrl }) => {
          const canonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
          return (
            document.documentElement.lang === expectedDocumentLocale &&
            canonical === expectedCanonicalUrl &&
            document.head.querySelector('script[data-seo-schema]')
          );
        },
        { locale: documentLocales[locale], canonical: expectedCanonical },
        { timeout: 30_000 },
      );
      const html = await page.content();
      const output = outputFile(locale, route);
      await fs.mkdir(path.dirname(output), { recursive: true });
      await fs.writeFile(output, html, 'utf8');
      await page.close();
      process.stdout.write(`Prerendered /${locale}${route ? `/${route}` : '/'}\n`);
    }
  }
  await writeSitemap(routes);
} finally {
  await browser.close();
  if (child) child.kill();
}
