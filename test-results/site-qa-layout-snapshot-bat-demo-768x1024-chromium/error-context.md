# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: bat-demo @ 768x1024
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  3061 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: bat-demo-768x1024.png

Call log:
  - Expect "toHaveScreenshot(bat-demo-768x1024.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 3061 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 3061 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e5]:
    - link "Igloo Construction" [ref=e6] [cursor=pointer]:
      - /url: /
      - img "Igloo Construction" [ref=e7]
    - link "Projects" [ref=e8] [cursor=pointer]:
      - /url: /bat-demo/projects
    - generic [ref=e9]:
      - generic "Language selector" [ref=e10]:
        - button "EN" [pressed] [ref=e11]
        - button "FR" [ref=e12]
        - button "DZ" [ref=e13]
        - button "TR" [ref=e14]
      - button "Open menu" [ref=e15]:
        - img [ref=e16]
  - complementary:
    - button "Close menu"
    - generic:
      - generic:
        - generic:
          - paragraph: Menu
          - button "Close":
            - img
            - text: Close
        - navigation "Demo navigation":
          - link "Home":
            - /url: /
          - link "Projects":
            - /url: /bat-demo/projects
          - link "Douaouda Housing":
            - /url: /bat-demo/projects/douaouda-300-500-housing
          - link "Sidi Abdallah":
            - /url: /bat-demo/projects/sidi-abdallah-200-1200-housing
          - link "Staoueli Villas":
            - /url: /bat-demo/projects/staoueli-11-41-villas
          - link "Rahmania":
            - /url: /bat-demo/projects/rahmania
          - link "Said Hamdine":
            - /url: /bat-demo/projects/said-hamdine-mixed-real-estate
  - region "Igloo projects" [ref=e17]:
    - generic [ref=e18]:
      - heading "Igloo projects" [level=1] [ref=e19]
      - generic [ref=e20]:
        - generic [ref=e22]:
          - paragraph [ref=e23]: Mode
          - group "Project view mode" [ref=e24]:
            - button "Grid" [pressed] [ref=e25]:
              - img [ref=e26]
              - text: Grid
            - button "Gallery" [ref=e28]:
              - img [ref=e29]
              - text: Gallery
            - button "List" [ref=e34]:
              - img [ref=e35]
              - text: List
        - generic [ref=e37]:
          - paragraph [ref=e38]: Typology
          - generic "Filter projects by typology" [ref=e39]:
            - button "All" [ref=e40]
            - button "Residential" [ref=e41]
            - button "Commercial" [ref=e42]
            - button "Mixed Use" [ref=e43]
            - button "Infrastructure" [ref=e44]
            - button "Community" [ref=e45]
            - button "Hospitality" [ref=e46]
        - generic [ref=e47]:
          - generic [ref=e48]: (11)
          - generic [ref=e49]: All projects
  - region "Project collection" [ref=e50]:
    - generic [ref=e52]:
      - article [ref=e53]:
        - link "300/500 Assisted Promotional Housing Douaouda Housing Infrastructure / Douaouda" [ref=e54] [cursor=pointer]:
          - /url: /bat-demo/projects/douaouda-300-500-housing
          - img "300/500 Assisted Promotional Housing" [ref=e56]
          - generic [ref=e57]:
            - heading "Douaouda Housing" [level=2] [ref=e58]
            - paragraph [ref=e59]: Infrastructure / Douaouda
      - article [ref=e60]:
        - link "200/1200 Promotional Public Housing Sidi Abdallah Residential / Sidi Abdallah - Mahalma" [ref=e61] [cursor=pointer]:
          - /url: /bat-demo/projects/sidi-abdallah-200-1200-housing
          - img "200/1200 Promotional Public Housing" [ref=e63]
          - generic [ref=e64]:
            - heading "Sidi Abdallah" [level=2] [ref=e65]
            - paragraph [ref=e66]: Residential / Sidi Abdallah - Mahalma
      - article [ref=e67]:
        - link "11/41 Villas and Network Works Staoueli Villas Infrastructure / Staoueli" [ref=e68] [cursor=pointer]:
          - /url: /bat-demo/projects/staoueli-11-41-villas
          - img "11/41 Villas and Network Works" [ref=e70]
          - generic [ref=e71]:
            - heading "Staoueli Villas" [level=2] [ref=e72]
            - paragraph [ref=e73]: Infrastructure / Staoueli
      - article [ref=e74]:
        - link "Rahmania Commercial Centres Rahmania Commercial / Douira" [ref=e75] [cursor=pointer]:
          - /url: /bat-demo/projects/rahmania
          - img "Rahmania Commercial Centres" [ref=e77]
          - generic [ref=e78]:
            - heading "Rahmania" [level=2] [ref=e79]
            - paragraph [ref=e80]: Commercial / Douira
      - article [ref=e81]:
        - link "Mixed Real Estate Complex with 202 Free Promotional Housing Said Hamdine Mixed Use / Said Hamdine" [ref=e82] [cursor=pointer]:
          - /url: /bat-demo/projects/said-hamdine-mixed-real-estate
          - img "Mixed Real Estate Complex with 202 Free Promotional Housing" [ref=e84]
          - generic [ref=e85]:
            - heading "Said Hamdine" [level=2] [ref=e86]
            - paragraph [ref=e87]: Mixed Use / Said Hamdine
      - article [ref=e88]:
        - link "4 Promotional Villas and Network Works Rouiba Villas Infrastructure / Rouiba" [ref=e89] [cursor=pointer]:
          - /url: /bat-demo/projects/rouiba-4-promotional-villas
          - img "4 Promotional Villas and Network Works" [ref=e91]
          - generic [ref=e92]:
            - heading "Rouiba Villas" [level=2] [ref=e93]
            - paragraph [ref=e94]: Infrastructure / Rouiba
      - article [ref=e95]:
        - link "50 Free Promotional Housing Units Sidi Benour Residential / Sidi Benour" [ref=e96] [cursor=pointer]:
          - /url: /bat-demo/projects/sidi-benour-50-housing
          - img "50 Free Promotional Housing Units" [ref=e98]
          - generic [ref=e99]:
            - heading "Sidi Benour" [level=2] [ref=e100]
            - paragraph [ref=e101]: Residential / Sidi Benour
      - article [ref=e102]:
        - link "240 Free Promotional Housing with Commercial Areas Dely Brahim Commercial / Dely Brahim" [ref=e103] [cursor=pointer]:
          - /url: /bat-demo/projects/dely-brahim-240-housing
          - img "240 Free Promotional Housing with Commercial Areas" [ref=e105]
          - generic [ref=e106]:
            - heading "Dely Brahim" [level=2] [ref=e107]
            - paragraph [ref=e108]: Commercial / Dely Brahim
      - article [ref=e109]:
        - link "200 Assisted Housing and 38 Free Promotional Housing Units Bas Mazagran Mixed Use / Bas Mazagran" [ref=e110] [cursor=pointer]:
          - /url: /bat-demo/projects/bas-mazagran-200-38-housing
          - img "200 Assisted Housing and 38 Free Promotional Housing Units" [ref=e112]
          - generic [ref=e113]:
            - heading "Bas Mazagran" [level=2] [ref=e114]
            - paragraph [ref=e115]: Mixed Use / Bas Mazagran
      - article [ref=e116]:
        - link "250 Housing Units with Commercial Rental and Concierge Services Reghaia Commercial / Bouraada Site" [ref=e117] [cursor=pointer]:
          - /url: /bat-demo/projects/reghaia-bouraada-250-housing
          - img "250 Housing Units with Commercial Rental and Concierge Services" [ref=e119]
          - generic [ref=e120]:
            - heading "Reghaia" [level=2] [ref=e121]
            - paragraph [ref=e122]: Commercial / Bouraada Site
      - article [ref=e123]:
        - link "70 Assisted Housing and 10 Free Promotional Housing Units Boudouaou Commercial / Boudouaou" [ref=e124] [cursor=pointer]:
          - /url: /bat-demo/projects/boudouaou-70-10-housing
          - img "70 Assisted Housing and 10 Free Promotional Housing Units" [ref=e126]
          - generic [ref=e127]:
            - heading "Boudouaou" [level=2] [ref=e128]
            - paragraph [ref=e129]: Commercial / Boudouaou
  - generic [ref=e131]:
    - generic [ref=e132]:
      - generic [ref=e133]:
        - img "Igloo Construction" [ref=e134]
        - heading "Build with discipline, sequence, and precision." [level=2] [ref=e135]
        - paragraph [ref=e136]: SARL Igloo Yapi Construction works on residential and mixed-use programmes from Algiers, coordinating design, execution, and delivery inside one production chain.
      - generic [ref=e137]:
        - generic [ref=e138]:
          - paragraph [ref=e139]: Office
          - generic [ref=e140]:
            - img [ref=e141]
            - text: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem – Alger
        - generic [ref=e144]:
          - paragraph [ref=e145]: Navigation
          - generic [ref=e146]:
            - link "All projects" [ref=e147] [cursor=pointer]:
              - /url: /bat-demo/projects
            - link "info@igloogroupe.com" [ref=e148] [cursor=pointer]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e149]
              - text: info@igloogroupe.com
            - link "+213 542 819 461" [ref=e152] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e153]
              - text: +213 542 819 461
            - link "Home" [ref=e155] [cursor=pointer]:
              - /url: /
    - generic [ref=e156]:
      - generic [ref=e157]:
        - generic [ref=e158]: Igloo Construction
        - generic [ref=e159]: info@igloogroupe.com
        - generic [ref=e160]: +213 542 819 461
      - generic [ref=e161]: © 2026 Igloo Construction
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