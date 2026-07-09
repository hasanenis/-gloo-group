import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
] as const;

const routes = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/projects' },
  { name: 'project-detail', path: '/projects/rahmania' },
  { name: 'bat-demo', path: '/bat-demo/projects' },
] as const;

async function preparePage(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('igloo:intro-seen', 'true');
    localStorage.setItem('igloo:locale', 'en');
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflowFree = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= doc.clientWidth + 1;
  });

  expect(overflowFree).toBeTruthy();
}

async function takeRouteScreenshot(page: Page, routeName: string, viewportName: string) {
  await expect(page).toHaveScreenshot(`${routeName}-${viewportName}.png`, {
    animations: 'disabled',
    caret: 'hide',
    fullPage: false,
  });
}

for (const viewport of viewports) {
  for (const route of routes) {
    test(`layout snapshot: ${route.name} @ ${viewport.name}`, async ({ page }) => {
      await preparePage(page);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700);

      await assertNoHorizontalOverflow(page);
      await takeRouteScreenshot(page, route.name, viewport.name);
    });
  }
}

test('assistant dock opens and closes cleanly on home', async ({ page }) => {
  await preparePage(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await page.getByRole('button', { name: /open igloo assistant/i }).first().click();
  await expect(page.getByRole('dialog', { name: /igloo assistant/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /igloo assistant/i })).toBeHidden();
});

test('projects filters keep the grid readable', async ({ page }) => {
  await preparePage(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/projects', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await page.getByRole('tab', { name: /commercial/i }).click();
  await expect(page.getByText(/active filter/i)).toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test('hash navigation keeps anchored sections below the sticky header', async ({ page }) => {
  await preparePage(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#about', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const clearOfHeader = await page.evaluate(() => {
    const header = document.querySelector('header')?.getBoundingClientRect();
    const anchor = document.querySelector('#about')?.getBoundingClientRect();
    if (!header || !anchor) return false;
    return anchor.top >= header.bottom - 8;
  });

  expect(clearOfHeader).toBeTruthy();
});
