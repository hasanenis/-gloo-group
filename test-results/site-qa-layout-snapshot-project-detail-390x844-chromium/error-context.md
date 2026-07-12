# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: project-detail @ 390x844
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  145045 pixels (ratio 0.45 of all image pixels) are different.

  Snapshot: project-detail-390x844.png

Call log:
  - Expect "toHaveScreenshot(project-detail-390x844.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 145045 pixels (ratio 0.45 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 145045 pixels (ratio 0.45 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "Igloo Construction" [ref=e5]:
      - /url: /
      - img "Igloo Construction" [ref=e6]
    - button "EN" [ref=e8]:
      - img [ref=e9]
      - text: EN
  - navigation "Mobile navigation" [ref=e13]:
    - button "Home" [ref=e14]:
      - img [ref=e15]
      - generic [ref=e18]: Home
    - button "Company" [ref=e19]:
      - img [ref=e20]
      - generic [ref=e24]: Company
    - button "Open Igloo assistant" [ref=e25]:
      - img [ref=e27]
    - button "Projects" [ref=e29]:
      - img [ref=e30]
      - generic [ref=e32]: Projects
    - button "Contact" [ref=e33]:
      - img [ref=e34]
      - generic [ref=e37]: Contact
  - main [ref=e38]:
    - generic [ref=e39]:
      - img [ref=e42]
      - generic:
        - generic:
          - generic [ref=e45]:
            - paragraph [ref=e46]: MIXED-USE PROJECT
            - heading "Douira" [level=1] [ref=e47]:
              - generic [ref=e49]: Douira
            - paragraph [ref=e50]: Secondary works for two commercial centres, completed in 2025 within Douira's 2,500-home residential programme.
          - generic [ref=e51]:
            - generic [ref=e54]: Project info
            - generic [ref=e56]:
              - generic [ref=e57]:
                - generic [ref=e58]: Project type
                - generic [ref=e59]: Commercial centres
              - generic [ref=e60]:
                - generic [ref=e61]: Location
                - generic [ref=e62]: Douira, Algiers, Algeria
              - generic [ref=e63]:
                - generic [ref=e64]: Works
                - generic [ref=e65]: Secondary works packages (CES)
              - generic [ref=e66]:
                - generic [ref=e67]: Completion
                - generic [ref=e68]: 2025, on schedule
    - generic [ref=e69]:
      - generic [ref=e70]:
        - paragraph [ref=e71]: MIXED-USE PROJECT
        - heading "Two commercial centres in Douira's 2,500-home programme, fitted out to host the district's shops and everyday services." [level=2] [ref=e72]
      - figure [ref=e74]:
        - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e75]
    - region "Project description" [ref=e76]:
      - paragraph [ref=e77]: Igloo carried out the complete secondary works package for both centres, turning two reinforced-concrete structures into modern, functional spaces ready for traders and everyday users.
      - paragraph [ref=e78]: The facades pair large glazed surfaces with decorative screen elements. Inside, circulation is organised around a central staircase, while a pyramidal glass skylight brings natural light into the retail levels.
    - generic [ref=e79]:
      - generic [ref=e80]:
        - img "Rahmania commercial centres" [ref=e82]
        - generic [ref=e86]:
          - paragraph [ref=e87]: Rahmania / Douira
          - heading "Commerce, services and everyday life brought together at the heart of a growing neighbourhood." [level=2] [ref=e89]:
            - generic [ref=e91]: Commerce, services and
            - generic [ref=e93]: everyday life brought together
            - generic [ref=e95]: at the heart of a growing
            - generic [ref=e97]: neighbourhood.
          - paragraph [ref=e98]: Inside, circulation runs around a central staircase while the pyramidal glass skylight lights the retail levels below. Both interiors were finished by Igloo as part of the secondary works — finishes, technical networks, and the details in between.
      - generic [ref=e101]:
        - generic [ref=e102]:
          - paragraph [ref=e103]: Before / After
          - heading "The glass pyramid" [level=3] [ref=e104]
          - paragraph [ref=e105]: "The distinctive element of the project: a pyramidal glass skylight crowning the central atrium. Sketched first as a simple massing study, it was executed as a glazed structure that pours natural light onto the retail levels and the central staircase below."
          - list [ref=e106]:
            - listitem [ref=e107]:
              - generic [ref=e109]: Drawn as a massing study over the central atrium
            - listitem [ref=e110]:
              - generic [ref=e112]: Executed by Igloo within the secondary works package
            - listitem [ref=e113]:
              - generic [ref=e115]: Natural light for the retail levels beneath
        - generic [ref=e116]:
          - img "Final Rahmania image" [ref=e117]
          - img "Rahmania concept image" [ref=e118]
          - generic [ref=e120]:
            - generic [ref=e121]: Before
            - generic [ref=e122]: After
    - heading "Delivered in 2025, on schedule, every secondary trade coordinated to the standard a modern commercial building demands." [level=2] [ref=e124]
    - region "Project photographs" [ref=e125]:
      - figure [ref=e127]:
        - img "Curved staircase and stainless-steel railings inside the Douira commercial centre." [ref=e128]
      - figure [ref=e130]:
        - img "Modern interior stair hall in the Douira commercial centre." [ref=e131]
    - region "Project information" [ref=e132]:
      - generic [ref=e136]: OUR IMPACT
      - generic [ref=e138]:
        - generic [ref=e139]:
          - figure
          - generic [ref=e140]:
            - generic [ref=e141]: 2,500
            - generic [ref=e142]:
              - paragraph [ref=e143]: HOMES
              - paragraph [ref=e144]:
                - generic [ref=e145]: IN A THRIVING
                - generic [ref=e146]: MASTERPLANNED
                - generic [ref=e147]: NEIGHBOURHOOD
        - generic [ref=e148]:
          - paragraph [ref=e149]: PROXIMITY SERVICES
          - heading "A hub of shops and services for the residents' daily needs." [level=2] [ref=e150]
          - paragraph [ref=e151]: The two centres form an attractive hub of activity inside the residential programme. Their layout favours accessibility, functional spaces and user comfort, adding to the urban quality and economic life of the Douira district.
          - list "Project highlights" [ref=e152]:
            - listitem [ref=e153]:
              - img [ref=e155]
              - generic [ref=e159]: Complete secondary works package (CES)
            - listitem [ref=e160]:
              - img [ref=e162]
              - generic [ref=e166]: Reinforced concrete structure and glazed facades
            - listitem [ref=e167]:
              - img [ref=e169]
              - generic [ref=e173]: Central staircase and pyramidal glass skylight
            - listitem [ref=e174]:
              - img [ref=e176]
              - generic [ref=e180]: Delivered in 2025, on schedule and to standard
    - figure [ref=e182]:
      - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e183]
    - region "Related projects" [ref=e184]:
      - generic [ref=e185]:
        - paragraph [ref=e186]: More work
        - heading "Related projects" [level=2] [ref=e187]
      - group "Related projects" [ref=e188]:
        - generic [ref=e190]:
          - group "1 / 6" [ref=e191]:
            - link "Mixed Real Estate Complex with 202 Free Promotional Housing Said Hamdine" [ref=e192]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - figure [ref=e193]:
                - img "Mixed Real Estate Complex with 202 Free Promotional Housing" [ref=e194]
              - heading "Mixed Real Estate Complex with 202 Free Promotional Housing" [level=3] [ref=e195]
              - paragraph [ref=e196]: Said Hamdine
          - group "2 / 6" [ref=e197]:
            - link "4 Promotional Villas and Network Works Rouiba" [ref=e198]:
              - /url: /projects/rouiba-4-promotional-villas
              - figure [ref=e199]:
                - img "4 Promotional Villas and Network Works" [ref=e200]
              - heading "4 Promotional Villas and Network Works" [level=3] [ref=e201]
              - paragraph [ref=e202]: Rouiba
          - group "3 / 6" [ref=e203]:
            - link "50 Free Promotional Housing Units Sidi Benour" [ref=e204]:
              - /url: /projects/sidi-benour-50-housing
              - figure [ref=e205]:
                - img "50 Free Promotional Housing Units" [ref=e206]
              - heading "50 Free Promotional Housing Units" [level=3] [ref=e207]
              - paragraph [ref=e208]: Sidi Benour
          - group "4 / 6" [ref=e209]:
            - link "240 Free Promotional Housing with Commercial Areas Dely Brahim" [ref=e210]:
              - /url: /projects/dely-brahim-240-housing
              - figure [ref=e211]:
                - img "240 Free Promotional Housing with Commercial Areas" [ref=e212]
              - heading "240 Free Promotional Housing with Commercial Areas" [level=3] [ref=e213]
              - paragraph [ref=e214]: Dely Brahim
          - group "5 / 6" [ref=e215]:
            - link "200 Assisted Housing and 38 Free Promotional Housing Units Bas Mazagran" [ref=e216]:
              - /url: /projects/bas-mazagran-200-38-housing
              - figure [ref=e217]:
                - img "200 Assisted Housing and 38 Free Promotional Housing Units" [ref=e218]
              - heading "200 Assisted Housing and 38 Free Promotional Housing Units" [level=3] [ref=e219]
              - paragraph [ref=e220]: Bas Mazagran
          - group "6 / 6" [ref=e221]:
            - link "250 Housing Units with Commercial Rental and Concierge Services Bouraada Site" [ref=e222]:
              - /url: /projects/reghaia-bouraada-250-housing
              - figure [ref=e223]:
                - img "250 Housing Units with Commercial Rental and Concierge Services" [ref=e224]
              - heading "250 Housing Units with Commercial Rental and Concierge Services" [level=3] [ref=e225]
              - paragraph [ref=e226]: Bouraada Site
        - generic [ref=e227]:
          - button "Previous" [disabled]:
            - img
          - button "Next" [ref=e230]:
            - img [ref=e231]
    - generic [ref=e234]:
      - generic [ref=e235]:
        - generic [ref=e236]:
          - img "Igloo Construction" [ref=e237]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e238]:
            - generic [ref=e240]: Let’s discuss the next
            - generic [ref=e242]: durable programme.
          - paragraph [ref=e243]:
            - generic [ref=e245]: Speak with an Algiers-based team experienced in
            - generic [ref=e247]: residential, mixed-use, roads, networks and
            - generic [ref=e249]: coordinated site delivery.
        - generic [ref=e250]:
          - generic [ref=e251]: Project discussion
          - link "Email Igloo" [ref=e252]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e253]: Email Igloo
            - img [ref=e254]
          - link "Call Algeria office" [ref=e257]:
            - /url: tel:+213542819461
            - generic [ref=e258]: Call Algeria office
            - img [ref=e259]
      - generic [ref=e261]:
        - generic [ref=e262]:
          - heading "Office" [level=3] [ref=e263]
          - generic [ref=e264]:
            - img [ref=e265]
            - generic [ref=e268]:
              - generic [ref=e270]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC,
              - generic [ref=e272]: Bir Khadem – Alger
        - generic [ref=e273]:
          - heading "Contact" [level=3] [ref=e274]
          - generic [ref=e275]:
            - link "+213 542 819 461" [ref=e276]:
              - /url: tel:+213542819461
              - img [ref=e277]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e279]:
              - /url: tel:+905424795700
              - img [ref=e280]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e282]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e283]
              - text: info@igloogroupe.com
        - generic [ref=e286]:
          - heading "Navigation" [level=3] [ref=e287]
          - generic [ref=e288]:
            - link "Home" [ref=e289]:
              - /url: /
            - link "Company" [ref=e290]:
              - /url: /about
            - link "Projects" [ref=e291]:
              - /url: /projects
            - link "Proof" [ref=e292]:
              - /url: /#proof
            - link "Process" [ref=e293]:
              - /url: /#services
            - link "Contact" [ref=e294]:
              - /url: /contact
      - generic [ref=e295]:
        - paragraph [ref=e296]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e297]:
          - generic [ref=e299]: Bir Khadem, Algiers · Category 6 certified contractor ·
          - generic [ref=e301]: Residential and mixed-use delivery
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