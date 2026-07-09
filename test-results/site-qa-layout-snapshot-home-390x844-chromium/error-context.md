# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: home @ 390x844
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  8658 pixels (ratio 0.03 of all image pixels) are different.

  Snapshot: home-390x844.png

Call log:
  - Expect "toHaveScreenshot(home-390x844.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 8658 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 8658 pixels (ratio 0.03 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "Igloo Construction" [ref=e5] [cursor=pointer]:
      - /url: /
      - img "Igloo Construction" [ref=e6]
  - navigation "Mobile navigation" [ref=e7]:
    - button "Home" [ref=e8] [cursor=pointer]:
      - img [ref=e9]
      - generic [ref=e12]: Home
    - button "Projects" [ref=e13] [cursor=pointer]:
      - img [ref=e14]
      - generic [ref=e16]: Projects
    - button "Open Igloo assistant" [ref=e17] [cursor=pointer]:
      - img [ref=e19]
    - button "Services" [ref=e21] [cursor=pointer]:
      - img [ref=e22]
      - generic [ref=e26]: Services
    - button "More" [ref=e27] [cursor=pointer]:
      - img [ref=e28]
      - generic [ref=e32]: More
  - main [ref=e33]:
    - generic [ref=e39]:
      - heading "L’empreinte de demain, pensée pour durer" [level=1] [ref=e40]:
        - generic [ref=e42]: L’empreinte
        - generic [ref=e44]: de
        - generic [ref=e46]: demain,
        - generic [ref=e48]: pensée
        - generic [ref=e50]: pour
        - generic [ref=e52]: durer
      - paragraph [ref=e53]: Igloo shapes residential and mixed-use places with measured execution, architectural clarity, and a lasting sense of presence.
    - region "Company manifesto" [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]: Est. 2018
          - generic [ref=e58]: Qualification n°6
        - heading "We build homes, not just buildings." [level=2] [ref=e59]:
          - generic [ref=e61]: We
          - generic [ref=e63]: build
          - generic [ref=e65]: homes,
          - generic [ref=e67]: not
          - generic [ref=e69]: just
          - generic [ref=e71]: buildings.
        - paragraph [ref=e72]: Since 2018, Igloo has delivered residential and mixed-use developments across Algeria — with precision engineering, honest materials, and structures built to last.
    - generic [ref=e74]:
      - generic [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e78]: Featured work
          - generic [ref=e79]:
            - heading "PROVEN WORKS" [level=2] [ref=e80]
            - paragraph [ref=e81]: Real residential and mixed-use programmes, shown with scope, location, and construction context.
        - link "See all projects" [ref=e83] [cursor=pointer]:
          - /url: /projects
      - group "Featured projects" [ref=e85]:
        - generic [ref=e87]:
          - group "1 / 11" [ref=e88]:
            - link "A wide shot of a large construction site with several multi-story concrete residential buildings in various stages of structural completion. A tall tower crane is visible in the background, extending over the buildings. The ground is reddish-brown dirt, and the sky is overcast. Completed Douaouda 300/500 Assisted Promotional Housing 300/500 Assisted Promotional Housing is a mixed-use project. It is located in Douaouda-Tipaza -Algerie. Open project" [ref=e89] [cursor=pointer]:
              - /url: /projects/douaouda-300-500-housing
              - img "A wide shot of a large construction site with several multi-story concrete residential buildings in various stages of structural completion. A tall tower crane is visible in the background, extending over the buildings. The ground is reddish-brown dirt, and the sky is overcast." [ref=e90]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Douaouda
                - heading "300/500 Assisted Promotional Housing" [level=3]
                - paragraph: 300/500 Assisted Promotional Housing is a mixed-use project. It is located in Douaouda-Tipaza -Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "2 / 11" [ref=e92]:
            - link "A tall, contemporary apartment building viewed from below, showcasing its beige and peach exterior with black accents, multiple balconies, and illuminated windows. Completed Sidi Abdallah - Mahalma 200/1200 Promotional Public Housing 200/1200 Promotional Public Housing is a mixed-use project. It is located in Sidi Abdellah -Alger -Algerie. Open project" [ref=e93] [cursor=pointer]:
              - /url: /projects/sidi-abdallah-200-1200-housing
              - img "A tall, contemporary apartment building viewed from below, showcasing its beige and peach exterior with black accents, multiple balconies, and illuminated windows." [ref=e94]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Sidi Abdallah - Mahalma
                - heading "200/1200 Promotional Public Housing" [level=3]
                - paragraph: 200/1200 Promotional Public Housing is a mixed-use project. It is located in Sidi Abdellah -Alger -Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "3 / 11" [ref=e96]:
            - link "Exterior view of newly completed residential villas featuring light facades, dark accents, glass-railed balconies, and red-tiled roofs under a bright blue sky. Completed Staoueli 11/41 Villas and Network Works 11/41 Villas and Network Works is a residential project. It is located in Staouali -Alger -Algerie. Open project" [ref=e97] [cursor=pointer]:
              - /url: /projects/staoueli-11-41-villas
              - img "Exterior view of newly completed residential villas featuring light facades, dark accents, glass-railed balconies, and red-tiled roofs under a bright blue sky." [ref=e98]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Staoueli
                - heading "11/41 Villas and Network Works" [level=3]
                - paragraph: 11/41 Villas and Network Works is a residential project. It is located in Staouali -Alger -Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "4 / 11" [ref=e100]:
            - link "Exterior view of a modern three-story commercial building with dark grey panels and copper trim, situated between two light-colored residential high-rises, with a street and a parked car in the foreground. Completed Douira, Algiers Rahmania Commercial Centres Two commercial centres completed as part of Douira's 2,500-home residential development. Open project" [ref=e101] [cursor=pointer]:
              - /url: /projects/rahmania
              - img "Exterior view of a modern three-story commercial building with dark grey panels and copper trim, situated between two light-colored residential high-rises, with a street and a parked car in the foreground." [ref=e102]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Douira, Algiers
                - heading "Rahmania Commercial Centres" [level=3]
                - paragraph: Two commercial centres completed as part of Douira's 2,500-home residential development.
                - generic:
                  - text: Open project
                  - img
          - group "5 / 11" [ref=e104]:
            - link "View from above a concrete slab reinforced with rebar, showing construction workers, a concrete pump, and residential buildings in the background during a sunset. Completed Said Hamdine, Bir Mourad Rais, Algiers Mixed Real Estate Complex with 202 Free Promotional Housing Mixed Real Estate Complex with 202 Free Promotional Housing is a mixed-use project. It is located in Said Hamdine ,Bir Mourad Rais ,Alger ,Algerie. Open project" [ref=e105] [cursor=pointer]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - img "View from above a concrete slab reinforced with rebar, showing construction workers, a concrete pump, and residential buildings in the background during a sunset." [ref=e106]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Said Hamdine, Bir Mourad Rais, Algiers
                - heading "Mixed Real Estate Complex with 202 Free Promotional Housing" [level=3]
                - paragraph: Mixed Real Estate Complex with 202 Free Promotional Housing is a mixed-use project. It is located in Said Hamdine ,Bir Mourad Rais ,Alger ,Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "6 / 11" [ref=e108]:
            - link "Exterior of a modern, light-colored promotional villa with multiple stories, recessed windows, and decorative pergolas, set against a cloudy sky. Completed Rouiba 4 Promotional Villas and Network Works 4 Promotional Villas and Network Works is a residential project. It is located in Rouiba -Alger -Algerie. Open project" [ref=e109] [cursor=pointer]:
              - /url: /projects/rouiba-4-promotional-villas
              - img "Exterior of a modern, light-colored promotional villa with multiple stories, recessed windows, and decorative pergolas, set against a cloudy sky." [ref=e110]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Rouiba
                - heading "4 Promotional Villas and Network Works" [level=3]
                - paragraph: 4 Promotional Villas and Network Works is a residential project. It is located in Rouiba -Alger -Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "7 / 11" [ref=e112]:
            - link "Exterior view of a multi-story residential building under construction, featuring exposed concrete structure and red brick infill walls, under a cloudy sky. Completed Sidi Benour, Algiers 50 Free Promotional Housing Units 50 Free Promotional Housing Units is a residential project. It is located in Sidi Benour ,Alger ,Algerie. Open project" [ref=e113] [cursor=pointer]:
              - /url: /projects/sidi-benour-50-housing
              - img "Exterior view of a multi-story residential building under construction, featuring exposed concrete structure and red brick infill walls, under a cloudy sky." [ref=e114]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - text: Sidi Benour, Algiers
                - heading "50 Free Promotional Housing Units" [level=3]
                - paragraph: 50 Free Promotional Housing Units is a residential project. It is located in Sidi Benour ,Alger ,Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "8 / 11" [ref=e116]:
            - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. Current Dely Brahim, Algiers 240 Free Promotional Housing with Commercial Areas 240 Free Promotional Housing with Commercial Areas is a mixed-use project. It is located in Dely Brahim ,Alger ,Algerie. Open project" [ref=e117] [cursor=pointer]:
              - /url: /projects/dely-brahim-240-housing
              - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e118]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - text: Dely Brahim, Algiers
                - heading "240 Free Promotional Housing with Commercial Areas" [level=3]
                - paragraph: 240 Free Promotional Housing with Commercial Areas is a mixed-use project. It is located in Dely Brahim ,Alger ,Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "9 / 11" [ref=e120]:
            - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. Current Bas Mazagran, Mostaganem 200 Assisted Housing and 38 Free Promotional Housing Units 200 Assisted Housing and 38 Free Promotional Housing Units is a mixed-use project. It is located in Bas Mazagran – Mostaganem -Algerie. Open project" [ref=e121] [cursor=pointer]:
              - /url: /projects/bas-mazagran-200-38-housing
              - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e122]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - text: Bas Mazagran, Mostaganem
                - heading "200 Assisted Housing and 38 Free Promotional Housing Units" [level=3]
                - paragraph: 200 Assisted Housing and 38 Free Promotional Housing Units is a mixed-use project. It is located in Bas Mazagran – Mostaganem -Algerie.
                - generic:
                  - text: Open project
                  - img
          - group "10 / 11" [ref=e124]:
            - link "A 3D render showing the exterior of a multi-story residential and commercial building with a modern design, featuring yellow, white, and dark grey panels, balconies, and ground-level commercial spaces, set against a dark, cloudy sky. Current Bouraada Site, Reghaia, Algiers Province 250 Housing Units with Commercial Rental and Concierge Services 250 Housing Units with Commercial Rental and Concierge Services is a mixed-use project. It is located in Bourrade ,Reghaia ,Alger. Open project" [ref=e125] [cursor=pointer]:
              - /url: /projects/reghaia-bouraada-250-housing
              - img "A 3D render showing the exterior of a multi-story residential and commercial building with a modern design, featuring yellow, white, and dark grey panels, balconies, and ground-level commercial spaces, set against a dark, cloudy sky." [ref=e126]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - text: Bouraada Site, Reghaia, Algiers Province
                - heading "250 Housing Units with Commercial Rental and Concierge Services" [level=3]
                - paragraph: 250 Housing Units with Commercial Rental and Concierge Services is a mixed-use project. It is located in Bourrade ,Reghaia ,Alger.
                - generic:
                  - text: Open project
                  - img
          - group "11 / 11" [ref=e128]:
            - link "Exterior view of a newly constructed, multi-story residential building with light-colored facades and numerous windows, under a bright blue sky. Construction equipment and a car are on the dirt ground in front of the building, indicating ongoing work at the Boudouaou project site. Current Boudouaou, Boumerdes 70 Assisted Housing and 10 Free Promotional Housing Units 70 Assisted Housing and 10 Free Promotional Housing Units is a mixed-use project. It is located in Boudouaou -Boumerdes-Algerie. Open project" [ref=e129] [cursor=pointer]:
              - /url: /projects/boudouaou-70-10-housing
              - img "Exterior view of a newly constructed, multi-story residential building with light-colored facades and numerous windows, under a bright blue sky. Construction equipment and a car are on the dirt ground in front of the building, indicating ongoing work at the Boudouaou project site." [ref=e130]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - text: Boudouaou, Boumerdes
                - heading "70 Assisted Housing and 10 Free Promotional Housing Units" [level=3]
                - paragraph: 70 Assisted Housing and 10 Free Promotional Housing Units is a mixed-use project. It is located in Boudouaou -Boumerdes-Algerie.
                - generic:
                  - text: Open project
                  - img
        - generic [ref=e132]:
          - generic [ref=e133]:
            - button "Previous" [disabled]:
              - img
            - button "Next" [ref=e134]:
              - img
          - generic [ref=e136]: 01 / 11
    - generic [ref=e139]:
      - generic [ref=e140]:
        - heading "About Us" [level=2] [ref=e142]
        - generic [ref=e144]:
          - paragraph [ref=e145]: Founded in 2018 in Ouled Fayet, Algiers, SARL Igloo Yapi Construction specializes in residential and mixed-use developments led by civil engineer Adem Talay.
          - paragraph [ref=e146]: Our engineers, architects, site managers, and field teams work as one coordinated structure to deliver projects with precision, efficiency, and lasting quality.
          - paragraph [ref=e147]: We create modern, durable, and functional spaces designed for people, businesses, and communities.
      - generic [ref=e148]:
        - generic [ref=e151]:
          - button [disabled] [ref=e152]:
            - img [ref=e153]
          - button [disabled] [ref=e155]:
            - img [ref=e156]
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]:
              - generic [ref=e161]: "8"
              - generic [ref=e162]: +
            - generic [ref=e163]: Years Active
          - generic [ref=e164]:
            - generic [ref=e165]:
              - generic [ref=e166]: "11"
              - generic [ref=e167]: +
            - generic [ref=e168]: Projects Featured
    - generic [ref=e171]:
      - generic [ref=e173]:
        - generic [ref=e174]: Performance
        - generic [ref=e175]:
          - heading "Key figures" [level=2] [ref=e176]
          - paragraph [ref=e177]: A quick read on delivery scope and the pace of the business.
      - generic [ref=e178]:
        - generic [ref=e179]:
          - img [ref=e181]
          - generic [ref=e184]:
            - generic [ref=e186]: 8+
            - generic [ref=e187]: Years of experience
        - generic [ref=e188]:
          - img [ref=e190]
          - generic [ref=e194]:
            - generic [ref=e196]: "11"
            - generic [ref=e197]: Projects in portfolio
        - generic [ref=e198]:
          - img [ref=e200]
          - generic [ref=e205]:
            - generic [ref=e207]: 2500+
            - generic [ref=e208]: Housing units delivered
        - generic [ref=e209]:
          - img [ref=e211]
          - generic [ref=e215]:
            - generic [ref=e217]: "4"
            - generic [ref=e218]: Wilayas covered
    - generic [ref=e221]:
      - generic [ref=e222]:
        - generic [ref=e223]:
          - img "Igloo Construction" [ref=e224]
          - heading "Build durable residential work with a coordinated construction partner." [level=2] [ref=e225]
          - paragraph [ref=e226]: SARL Igloo Yapi Construction works from Algiers on residential and mixed-use programmes, combining engineering control, site coordination, and long-term delivery discipline.
        - generic [ref=e227]:
          - generic [ref=e228]: Discuss a project
          - link "Email Igloo" [ref=e229] [cursor=pointer]:
            - /url: mailto:medatalay@gmail.com
            - text: Email Igloo
            - img [ref=e230]
          - link "Call Algeria office" [ref=e233] [cursor=pointer]:
            - /url: tel:+213542819461
            - text: Call Algeria office
            - img [ref=e234]
      - generic [ref=e236]:
        - generic [ref=e237]:
          - heading "Office" [level=3] [ref=e238]
          - generic [ref=e239]:
            - img [ref=e240]
            - text: 9 National Route 142, Section 01, GP 235, Ground Floor, Ouled Fayet, Algiers
        - generic [ref=e243]:
          - heading "Contact" [level=3] [ref=e244]
          - generic [ref=e245]:
            - link "+213 542 819 461" [ref=e246] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e247]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e249] [cursor=pointer]:
              - /url: tel:+905424795700
              - img [ref=e250]
              - text: +90 542 479 5700
            - link "medatalay@gmail.com" [ref=e252] [cursor=pointer]:
              - /url: mailto:medatalay@gmail.com
              - img [ref=e253]
              - text: medatalay@gmail.com
        - generic [ref=e256]:
          - heading "Navigation" [level=3] [ref=e257]
          - generic [ref=e258]:
            - link "Home" [ref=e259] [cursor=pointer]:
              - /url: /
            - link "Company" [ref=e260] [cursor=pointer]:
              - /url: /#about
            - link "Projects" [ref=e261] [cursor=pointer]:
              - /url: /projects
            - link "Proof" [ref=e262] [cursor=pointer]:
              - /url: /#proof
            - link "Process" [ref=e263] [cursor=pointer]:
              - /url: /#services
            - link "Contact" [ref=e264] [cursor=pointer]:
              - /url: /#contact
      - generic [ref=e265]:
        - paragraph [ref=e266]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e267]: Founded 2018 · Ouled Fayet, Algiers · RC 16B1098634
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