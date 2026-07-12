import { expect, test, type Page } from '@playwright/test';
import { projects } from '../../src/data/projects';

const routes = [
  '/',
  '/about',
  '/contact',
  '/projects',
  '/projects1',
  ...projects.map((project) => `/projects/${project.slug}`),
  '/bat-demo/projects',
  '/bat-demo/projects/rahmania',
];

async function prepareTurkish(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('igloo:intro-seen', 'true');
    localStorage.setItem('igloo:locale', 'tr');
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

for (const route of routes) {
  test(`Turkish desktop screenshot: ${route}`, async ({ page }, testInfo) => {
    await prepareTurkish(page);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const routeName = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '-');
    await page.screenshot({
      path: testInfo.outputPath(`tr-${routeName}-1440x1000.png`),
      animations: 'disabled',
      caret: 'hide',
      fullPage: false,
    });
  });
}
