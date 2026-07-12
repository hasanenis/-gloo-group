# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: project-detail @ 1440x900
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  581224 pixels (ratio 0.45 of all image pixels) are different.

  Snapshot: project-detail-1440x900.png

Call log:
  - Expect "toHaveScreenshot(project-detail-1440x900.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 581224 pixels (ratio 0.45 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 581224 pixels (ratio 0.45 of all image pixels) are different.

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
    - generic [ref=e24]:
      - img [ref=e27]
      - generic:
        - generic:
          - generic [ref=e30]:
            - paragraph [ref=e31]: MIXED-USE PROJECT
            - heading "Douira" [level=1] [ref=e32]:
              - generic [ref=e34]: Douira
            - paragraph [ref=e35]: Secondary works for two commercial centres, completed in 2025 within Douira's 2,500-home residential programme.
          - generic [ref=e36]:
            - generic [ref=e39]: Project info
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]: Project type
                - generic [ref=e44]: Commercial centres
              - generic [ref=e45]:
                - generic [ref=e46]: Location
                - generic [ref=e47]: Douira, Algiers, Algeria
              - generic [ref=e48]:
                - generic [ref=e49]: Works
                - generic [ref=e50]: Secondary works packages (CES)
              - generic [ref=e51]:
                - generic [ref=e52]: Completion
                - generic [ref=e53]: 2025, on schedule
    - generic [ref=e54]:
      - generic [ref=e55]:
        - paragraph [ref=e56]: MIXED-USE PROJECT
        - heading "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services." [level=2] [ref=e57]
      - figure [ref=e59]:
        - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e60]
    - region "Project description" [ref=e61]:
      - paragraph [ref=e62]: Igloo carried out the complete secondary works package for both centres, turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.
      - paragraph [ref=e63]: The facades pair large glazed surfaces with decorative screen elements. Inside, circulation is organised around a central staircase, while a pyramidal glass skylight brings natural light into the retail levels.
    - generic [ref=e64]:
      - generic [ref=e65]:
        - img "Rahmania commercial centres" [ref=e67]
        - generic [ref=e71]:
          - paragraph [ref=e72]: Rahmania / Douira
          - heading "Commerce, services and everyday life brought together at the heart of a growing neighbourhood." [level=2] [ref=e74]:
            - generic [ref=e76]: Commerce, services and
            - generic [ref=e78]: everyday life brought together
            - generic [ref=e80]: at the heart of a growing
            - generic [ref=e82]: neighbourhood.
          - paragraph [ref=e83]: Inside, circulation runs around a central staircase while the pyramidal glass skylight lights the retail levels below. Both interiors were finished by Igloo as part of the secondary works — finishes, technical networks, and the details in between.
      - generic [ref=e86]:
        - generic [ref=e87]:
          - paragraph [ref=e88]: Before / After
          - heading "The glass pyramid" [level=3] [ref=e89]
          - paragraph [ref=e90]: "The distinctive element of the project: a pyramidal glass skylight crowning the central atrium. Sketched first as a simple massing study, it was executed as a glazed structure that pours natural light onto the retail levels and the central staircase below."
          - list [ref=e91]:
            - listitem [ref=e92]:
              - generic [ref=e94]: Drawn as a massing study over the central atrium
            - listitem [ref=e95]:
              - generic [ref=e97]: Executed by Igloo within the secondary works package
            - listitem [ref=e98]:
              - generic [ref=e100]: Natural light for the retail levels beneath
        - generic [ref=e101]:
          - img "Final Rahmania image" [ref=e102]
          - img "Rahmania concept image" [ref=e103]
          - generic [ref=e105]:
            - generic [ref=e106]: Before
            - generic [ref=e107]: After
    - heading "Delivered in 2025, on schedule, every secondary trade coordinated to the standard a modern commercial building demands." [level=2] [ref=e109]
    - region "Project photographs" [ref=e110]:
      - figure [ref=e112]:
        - img "Curved staircase and stainless-steel railings inside the Douira commercial centre." [ref=e113]
      - figure [ref=e115]:
        - img "Modern interior stair hall in the Douira commercial centre." [ref=e116]
    - region "Project information" [ref=e117]:
      - generic [ref=e121]: OUR IMPACT
      - generic [ref=e123]:
        - generic [ref=e124]:
          - figure
          - generic [ref=e125]:
            - generic [ref=e126]: 2,500
            - generic [ref=e127]:
              - paragraph [ref=e128]: HOMES
              - paragraph [ref=e129]:
                - generic [ref=e130]: IN A THRIVING
                - generic [ref=e131]: MASTERPLANNED
                - generic [ref=e132]: NEIGHBOURHOOD
        - generic [ref=e133]:
          - paragraph [ref=e134]: PROXIMITY SERVICES
          - heading "A hub of shops and services for the residents' daily needs." [level=2] [ref=e135]
          - paragraph [ref=e136]: The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces and user comfort, adding to the urban quality and economic life of the Douira district.
          - list "Project highlights" [ref=e137]:
            - listitem [ref=e138]:
              - img [ref=e140]
              - generic [ref=e144]: Complete secondary works package (CES)
            - listitem [ref=e145]:
              - img [ref=e147]
              - generic [ref=e151]: Reinforced concrete structure and glazed facades
            - listitem [ref=e152]:
              - img [ref=e154]
              - generic [ref=e158]: Central staircase and pyramidal glass skylight
            - listitem [ref=e159]:
              - img [ref=e161]
              - generic [ref=e165]: Delivered in 2025, on schedule and to standard
    - figure [ref=e167]:
      - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e168]
    - region "Related projects" [ref=e169]:
      - generic [ref=e170]:
        - paragraph [ref=e171]: More work
        - heading "Related projects" [level=2] [ref=e172]
      - group "Related projects" [ref=e173]:
        - generic [ref=e175]:
          - group "1 / 6" [ref=e176]:
            - link "Mixed Real Estate Complex with 202 Free Promotional Housing Said Hamdine" [ref=e177]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - figure [ref=e178]:
                - img "Mixed Real Estate Complex with 202 Free Promotional Housing" [ref=e179]
              - heading "Mixed Real Estate Complex with 202 Free Promotional Housing" [level=3] [ref=e180]
              - paragraph [ref=e181]: Said Hamdine
          - group "2 / 6" [ref=e182]:
            - link "4 Promotional Villas and Network Works Rouiba" [ref=e183]:
              - /url: /projects/rouiba-4-promotional-villas
              - figure [ref=e184]:
                - img "4 Promotional Villas and Network Works" [ref=e185]
              - heading "4 Promotional Villas and Network Works" [level=3] [ref=e186]
              - paragraph [ref=e187]: Rouiba
          - group "3 / 6" [ref=e188]:
            - link "50 Free Promotional Housing Units Sidi Benour" [ref=e189]:
              - /url: /projects/sidi-benour-50-housing
              - figure [ref=e190]:
                - img "50 Free Promotional Housing Units" [ref=e191]
              - heading "50 Free Promotional Housing Units" [level=3] [ref=e192]
              - paragraph [ref=e193]: Sidi Benour
          - group "4 / 6" [ref=e194]:
            - link "240 Free Promotional Housing with Commercial Areas Dely Brahim" [ref=e195]:
              - /url: /projects/dely-brahim-240-housing
              - figure [ref=e196]:
                - img "240 Free Promotional Housing with Commercial Areas" [ref=e197]
              - heading "240 Free Promotional Housing with Commercial Areas" [level=3] [ref=e198]
              - paragraph [ref=e199]: Dely Brahim
          - group "5 / 6" [ref=e200]:
            - link "200 Assisted Housing and 38 Free Promotional Housing Units Bas Mazagran" [ref=e201]:
              - /url: /projects/bas-mazagran-200-38-housing
              - figure [ref=e202]:
                - img "200 Assisted Housing and 38 Free Promotional Housing Units" [ref=e203]
              - heading "200 Assisted Housing and 38 Free Promotional Housing Units" [level=3] [ref=e204]
              - paragraph [ref=e205]: Bas Mazagran
          - group "6 / 6" [ref=e206]:
            - link "250 Housing Units with Commercial Rental and Concierge Services Bouraada Site" [ref=e207]:
              - /url: /projects/reghaia-bouraada-250-housing
              - figure [ref=e208]:
                - img "250 Housing Units with Commercial Rental and Concierge Services" [ref=e209]
              - heading "250 Housing Units with Commercial Rental and Concierge Services" [level=3] [ref=e210]
              - paragraph [ref=e211]: Bouraada Site
        - generic [ref=e212]:
          - button "Previous" [disabled]:
            - img
          - button "Next" [ref=e215]:
            - img [ref=e216]
    - generic [ref=e219]:
      - generic [ref=e220]:
        - generic [ref=e221]:
          - img "Igloo Construction" [ref=e222]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e223]:
            - generic [ref=e225]: Let’s discuss the next
            - generic [ref=e227]: durable programme.
          - paragraph [ref=e228]:
            - generic [ref=e230]: Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site
            - generic [ref=e232]: delivery.
        - generic [ref=e233]:
          - generic [ref=e234]: Project discussion
          - link "Email Igloo" [ref=e235]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e236]: Email Igloo
            - img [ref=e237]
          - link "Call Algeria office" [ref=e240]:
            - /url: tel:+213542819461
            - generic [ref=e241]: Call Algeria office
            - img [ref=e242]
      - generic [ref=e244]:
        - generic [ref=e245]:
          - heading "Office" [level=3] [ref=e246]
          - generic [ref=e247]:
            - img [ref=e248]
            - generic [ref=e251]:
              - generic [ref=e253]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem –
              - generic [ref=e255]: Alger
        - generic [ref=e256]:
          - heading "Contact" [level=3] [ref=e257]
          - generic [ref=e258]:
            - link "+213 542 819 461" [ref=e259]:
              - /url: tel:+213542819461
              - img [ref=e260]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e262]:
              - /url: tel:+905424795700
              - img [ref=e263]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e265]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e266]
              - text: info@igloogroupe.com
        - generic [ref=e269]:
          - heading "Navigation" [level=3] [ref=e270]
          - generic [ref=e271]:
            - link "Home" [ref=e272]:
              - /url: /
            - link "Company" [ref=e273]:
              - /url: /about
            - link "Projects" [ref=e274]:
              - /url: /projects
            - link "Proof" [ref=e275]:
              - /url: /#proof
            - link "Process" [ref=e276]:
              - /url: /#services
            - link "Contact" [ref=e277]:
              - /url: /contact
      - generic [ref=e278]:
        - paragraph [ref=e279]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e280]:
          - generic [ref=e282]: Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery
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