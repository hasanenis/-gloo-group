# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: projects @ 1440x900
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  593770 pixels (ratio 0.46 of all image pixels) are different.

  Snapshot: projects-1440x900.png

Call log:
  - Expect "toHaveScreenshot(projects-1440x900.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 593770 pixels (ratio 0.46 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 593770 pixels (ratio 0.46 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "Igloo Construction" [ref=e5]:
      - /url: /
      - img "Igloo Construction" [ref=e6]
    - generic [ref=e7]:
      - navigation [ref=e8]:
        - link "Home" [ref=e9]:
          - /url: /
        - link "Company" [ref=e10]:
          - /url: /about
        - link "Projects" [ref=e11]:
          - /url: /projects
        - link "Contact" [ref=e12]:
          - /url: /contact
      - button "EN" [ref=e13]:
        - img [ref=e14]
        - text: EN
  - button "Open Igloo assistant" [ref=e18]:
    - generic [ref=e20]: Can I help?
    - img [ref=e21]
  - main [ref=e23]:
    - heading "Igloo Construction projects" [level=1] [ref=e24]
    - generic [ref=e25]:
      - article [ref=e26]:
        - link "Douaouda housing project 300/500 Assisted Promotional Housing - Douaouda" [ref=e27]:
          - /url: /projects/douaouda-300-500-housing
          - img "Douaouda housing project" [ref=e30]
          - heading "300/500 Assisted Promotional Housing - Douaouda" [level=2] [ref=e31]
      - article [ref=e32]:
        - link "200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma" [ref=e33]:
          - /url: /projects/sidi-abdallah-200-1200-housing
          - heading "200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma" [level=2] [ref=e36]
      - article [ref=e37]:
        - link "11/41 Villas and Network Works - Staoueli" [ref=e38]:
          - /url: /projects/staoueli-11-41-villas
          - heading "11/41 Villas and Network Works - Staoueli" [level=2] [ref=e41]
      - article [ref=e42]:
        - link "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building. Rahmania Commercial Centres - Douira" [ref=e43]:
          - /url: /projects/rahmania
          - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e46]
          - heading "Rahmania Commercial Centres - Douira" [level=2] [ref=e47]
      - article [ref=e48]:
        - link "Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine" [ref=e49]:
          - /url: /projects/said-hamdine-mixed-real-estate
          - heading "Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine" [level=2] [ref=e52]
      - article [ref=e53]:
        - link "4 Promotional Villas and Network Works - Rouiba" [ref=e54]:
          - /url: /projects/rouiba-4-promotional-villas
          - heading "4 Promotional Villas and Network Works - Rouiba" [level=2] [ref=e57]
      - article [ref=e58]:
        - link "50 Free Promotional Housing Units - Sidi Benour" [ref=e59]:
          - /url: /projects/sidi-benour-50-housing
          - heading "50 Free Promotional Housing Units - Sidi Benour" [level=2] [ref=e62]
      - article [ref=e63]:
        - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. 240 Free Promotional Housing with Commercial Areas - Dely Brahim" [ref=e64]:
          - /url: /projects/dely-brahim-240-housing
          - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e67]
          - heading "240 Free Promotional Housing with Commercial Areas - Dely Brahim" [level=2] [ref=e68]
      - article [ref=e69]:
        - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. 200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran" [ref=e70]:
          - /url: /projects/bas-mazagran-200-38-housing
          - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e73]
          - heading "200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran" [level=2] [ref=e74]
      - article [ref=e75]:
        - link "250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site" [ref=e76]:
          - /url: /projects/reghaia-bouraada-250-housing
          - heading "250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site" [level=2] [ref=e79]
      - article [ref=e80]:
        - link "70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou" [ref=e81]:
          - /url: /projects/boudouaou-70-10-housing
          - heading "70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou" [level=2] [ref=e84]
    - generic [ref=e86]:
      - generic [ref=e87]:
        - generic [ref=e88]:
          - img "Igloo Construction" [ref=e89]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e90]:
            - generic [ref=e92]: Let’s discuss the next
            - generic [ref=e94]: durable programme.
          - paragraph [ref=e95]:
            - generic [ref=e97]: Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site
            - generic [ref=e99]: delivery.
        - generic [ref=e100]:
          - generic [ref=e101]: Project discussion
          - link "Email Igloo" [ref=e102]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e103]: Email Igloo
            - img [ref=e104]
          - link "Call Algeria office" [ref=e107]:
            - /url: tel:+213542819461
            - generic [ref=e108]: Call Algeria office
            - img [ref=e109]
      - generic [ref=e111]:
        - generic [ref=e112]:
          - heading "Office" [level=3] [ref=e113]
          - generic [ref=e114]:
            - img [ref=e115]
            - generic [ref=e118]:
              - generic [ref=e120]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem –
              - generic [ref=e122]: Alger
        - generic [ref=e123]:
          - heading "Contact" [level=3] [ref=e124]
          - generic [ref=e125]:
            - link "+213 542 819 461" [ref=e126]:
              - /url: tel:+213542819461
              - img [ref=e127]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e129]:
              - /url: tel:+905424795700
              - img [ref=e130]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e132]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e133]
              - text: info@igloogroupe.com
        - generic [ref=e136]:
          - heading "Navigation" [level=3] [ref=e137]
          - generic [ref=e138]:
            - link "Home" [ref=e139]:
              - /url: /
            - link "Company" [ref=e140]:
              - /url: /about
            - link "Projects" [ref=e141]:
              - /url: /projects
            - link "Proof" [ref=e142]:
              - /url: /#proof
            - link "Process" [ref=e143]:
              - /url: /#services
            - link "Contact" [ref=e144]:
              - /url: /contact
      - generic [ref=e145]:
        - paragraph [ref=e146]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e147]:
          - generic [ref=e149]: Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | 
  3   | const viewports = [
  4   |   { name: '390x844', width: 390, height: 844 },
  5   |   { name: '768x1024', width: 768, height: 1024 },
  6   |   { name: '1440x900', width: 1440, height: 900 },
  7   |   { name: '1920x1080', width: 1920, height: 1080 },
  8   | ] as const;
  9   | 
  10  | const routes = [
  11  |   { name: 'home', path: '/' },
  12  |   { name: 'projects', path: '/projects' },
  13  |   { name: 'project-detail', path: '/projects/rahmania' },
  14  |   { name: 'bat-demo', path: '/bat-demo/projects' },
  15  | ] as const;
  16  | 
  17  | async function preparePage(page: Page) {
  18  |   await page.addInitScript(() => {
  19  |     sessionStorage.setItem('igloo:intro-seen', 'true');
  20  |     localStorage.setItem('igloo:locale', 'en');
  21  |     Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  22  |       configurable: true,
  23  |       value: () => Promise.resolve(),
  24  |     });
  25  |   });
  26  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  27  | }
  28  | 
  29  | async function assertNoHorizontalOverflow(page: Page) {
  30  |   const overflowFree = await page.evaluate(() => {
  31  |     const doc = document.documentElement;
  32  |     return doc.scrollWidth <= doc.clientWidth + 1;
  33  |   });
  34  | 
  35  |   expect(overflowFree).toBeTruthy();
  36  | }
  37  | 
  38  | async function takeRouteScreenshot(page: Page, routeName: string, viewportName: string) {
> 39  |   await expect(page).toHaveScreenshot(`${routeName}-${viewportName}.png`, {
      |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  40  |     animations: 'disabled',
  41  |     caret: 'hide',
  42  |     fullPage: false,
  43  |   });
  44  | }
  45  | 
  46  | for (const viewport of viewports) {
  47  |   for (const route of routes) {
  48  |     test(`layout snapshot: ${route.name} @ ${viewport.name}`, async ({ page }) => {
  49  |       await preparePage(page);
  50  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  51  |       await page.goto(route.path, { waitUntil: 'networkidle' });
  52  |       await page.evaluate(() => document.fonts.ready);
  53  |       await page.waitForTimeout(700);
  54  | 
  55  |       await assertNoHorizontalOverflow(page);
  56  |       await takeRouteScreenshot(page, route.name, viewport.name);
  57  |     });
  58  |   }
  59  | }
  60  | 
  61  | test('assistant dock opens and closes cleanly on home', async ({ page }) => {
  62  |   await preparePage(page);
  63  |   await page.setViewportSize({ width: 1440, height: 900 });
  64  |   await page.goto('/', { waitUntil: 'networkidle' });
  65  |   await page.evaluate(() => document.fonts.ready);
  66  | 
  67  |   await page.getByRole('button', { name: /open igloo assistant/i }).first().click();
  68  |   await expect(page.getByRole('dialog', { name: /igloo assistant/i })).toBeVisible();
  69  | 
  70  |   await page.keyboard.press('Escape');
  71  |   await expect(page.getByRole('dialog', { name: /igloo assistant/i })).toBeHidden();
  72  | });
  73  | 
  74  | test('projects filters keep the grid readable', async ({ page }) => {
  75  |   await preparePage(page);
  76  |   await page.setViewportSize({ width: 1440, height: 900 });
  77  |   await page.goto('/projects', { waitUntil: 'networkidle' });
  78  |   await page.evaluate(() => document.fonts.ready);
  79  | 
  80  |   await page.getByRole('tab', { name: /commercial/i }).click();
  81  |   await expect(page.getByText(/active filter/i)).toBeVisible();
  82  |   await assertNoHorizontalOverflow(page);
  83  | });
  84  | 
  85  | test('hash navigation keeps anchored sections below the sticky header', async ({ page }) => {
  86  |   await preparePage(page);
  87  |   await page.setViewportSize({ width: 1440, height: 900 });
  88  |   await page.goto('/#about', { waitUntil: 'networkidle' });
  89  |   await page.evaluate(() => document.fonts.ready);
  90  |   await page.waitForTimeout(400);
  91  | 
  92  |   const clearOfHeader = await page.evaluate(() => {
  93  |     const header = document.querySelector('header')?.getBoundingClientRect();
  94  |     const anchor = document.querySelector('#about')?.getBoundingClientRect();
  95  |     if (!header || !anchor) return false;
  96  |     return anchor.top >= header.bottom - 8;
  97  |   });
  98  | 
  99  |   expect(clearOfHeader).toBeTruthy();
  100 | });
  101 | 
```