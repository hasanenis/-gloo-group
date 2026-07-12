import { expect, test, type Page } from '@playwright/test';
import { projects } from '../../src/data/projects';
import { getProjectContent, localized } from '../../src/data/projectContent';
import { getProjectEditorialContent } from '../../src/data/projectEditorialContent';

const locales = ['en', 'fr', 'tr', 'ar-DZ'] as const;
const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
const routes = [
  '/',
  '/about',
  '/contact',
  '/projects',
  '/projects1',
  ...projectRoutes,
  '/bat-demo/projects',
  '/bat-demo/projects/rahmania',
];

// Do not flag legitimate French characters such as “Â” in “BÂTIMENT”; only
// match byte-decoding artifacts that have appeared in this codebase.
const visibleMojibake = /(?:Ã.|Â(?:©|°|·|\s)|â(?:€™|€“|€”|€¦)|Ø.|Ù.)/u;

async function prepareLocale(page: Page, locale: (typeof locales)[number]) {
  await page.addInitScript((initialLocale) => {
    sessionStorage.setItem('igloo:intro-seen', 'true');
    localStorage.setItem('igloo:locale', initialLocale);
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  }, locale);
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

for (const locale of locales) {
  for (const route of routes) {
    test(`locale QA: ${locale} ${route}`, async ({ page }, testInfo) => {
      if (process.env.DEBUG_PAGE_ERRORS === '1') {
        page.on('pageerror', (error) => process.stderr.write(`PAGE ERROR: ${error.stack ?? error.message}\n`));
      }
      await prepareLocale(page, locale);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      // Home may perform its initial image/intro hand-off immediately after
      // DOMContentLoaded. Waiting for the page landmark is stable across that
      // navigation, unlike evaluating document.fonts during the hand-off.
      await expect(page.locator('main')).toBeVisible();
      await page.waitForTimeout(250);

      const audit = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        overflowElements: [...document.querySelectorAll<HTMLElement>('body *')]
          .map((element) => ({
            tag: element.tagName.toLowerCase(),
            className: element.className?.toString().slice(0, 120) ?? '',
            text: element.innerText?.trim().replace(/\s+/g, ' ').slice(0, 100) ?? '',
            left: element.getBoundingClientRect().left,
            right: element.getBoundingClientRect().right,
          }))
          .filter((element) => element.left < -1 || element.right > window.innerWidth + 1)
          .slice(0, 12),
        text: document.body.innerText,
      }));

      expect(audit.lang).toBe(locale);
      expect(audit.dir).toBe(locale === 'ar-DZ' ? 'rtl' : 'ltr');
      expect(audit.overflow, JSON.stringify(audit.overflowElements, null, 2)).toBeLessThanOrEqual(1);
      expect(audit.text).not.toMatch(visibleMojibake);

      if (locale === 'tr') {
        expect(audit.text).not.toMatch(/(?:Can I help\?|Established in Algiers|Professional classification|Projects in the portfolio|Wilayas represented|Current chapter|DOUAOUDA HOUSING|\bCONTACT\b|\bCompleted\b|\bPublic housing\b)/u);
      }

      // ProjectDetail now prefers reviewed editorial copy whenever a project
      // has it, across every locale.
      if ((locale === 'tr' || locale === 'ar-DZ') && route.startsWith('/projects/')) {
        const slug = route.slice('/projects/'.length);
        const project = projects.find((candidate) => candidate.slug === slug);
        const content = project ? getProjectContent(project) : undefined;
        const editorial = project ? getProjectEditorialContent(project) : undefined;
        const expectedHero = editorial?.heroDescription ?? content?.seo;
        if (expectedHero) {
          await expect(page.locator('.igloo-simple-hero-description')).toContainText(localized(expectedHero, locale));
        }
        expect(audit.text).not.toMatch(/\b(?:Residential delivery|Completed|Project type|Project info|Location|Client|Status|More work|Related projects)\b/u);
      }

      // A deliberate review mode for the full locale matrix. Screenshots are
      // test artifacts, not golden baselines, so content review does not make
      // regular CI sensitive to remote imagery or animation timing.
      if (process.env.CAPTURE_LOCALE_QA === '1') {
        const routeName = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '-');
        await page.screenshot({
          path: testInfo.outputPath(`${locale}-${routeName}-390x844.png`),
          animations: 'disabled',
          caret: 'hide',
          fullPage: false,
        });
      }
    });
  }
}

test('locale switching replaces the rendered surface without a browser reload', async ({ page }) => {
  await prepareLocale(page, 'en');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible();

  const initialUrl = page.url();
  let navigationCount = 0;
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) navigationCount += 1;
  });

  const selectLocale = async (menuIndex: number, locale: (typeof locales)[number]) => {
    await page.locator('header .locale-menu:visible').first().click();
    await page.getByRole('menuitem').nth(menuIndex).click();
    await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe(locale);
  };

  await selectLocale(2, 'ar-DZ');
  await expect(page.locator('main')).not.toContainText('Primary project line');
  await expect(page.locator('main')).toContainText('الخط الرئيسي للمشاريع');

  await selectLocale(3, 'tr');
  await expect(page.locator('main')).toContainText('Ana proje hattı');

  await selectLocale(1, 'fr');
  await expect(page.locator('main')).toContainText('Ligne principale projets');

  await selectLocale(0, 'en');
  expect(page.url()).toBe(initialUrl);
  expect(navigationCount).toBe(0);
});

test('Turkish assistant opens with native Turkish content', async ({ page }) => {
  await prepareLocale(page, 'tr');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible();
  await page.getByRole('button', { name: 'Igloo asistanını aç' }).click();

  const panel = page.getByRole('dialog', { name: 'Igloo assistant' });
  await expect(panel).toContainText('Igloo Asistan');
  await expect(panel).toContainText('Yeni proje ve teklif');
  await expect(panel).toContainText('Konut, villa ve apartman');
  await expect(panel).not.toContainText('Start a project');
  await expect(panel).not.toContainText('How the process works');
});
