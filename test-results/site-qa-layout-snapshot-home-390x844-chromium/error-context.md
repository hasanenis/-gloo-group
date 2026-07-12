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

Timeout: 15000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: home-390x844.png

Call log:
  - Expect "toHaveScreenshot(home-390x844.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 162520 pixels (ratio 0.50 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 92425 pixels (ratio 0.29 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 37352 pixels (ratio 0.12 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 112311 pixels (ratio 0.35 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 76613 pixels (ratio 0.24 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 50293 pixels (ratio 0.16 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 76076 pixels (ratio 0.24 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 129244 pixels (ratio 0.40 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 103619 pixels (ratio 0.32 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 93426 pixels (ratio 0.29 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - Timeout 15000ms exceeded.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "Igloo Construction" [ref=e5] [cursor=pointer]:
      - /url: /
      - img "Igloo Construction" [ref=e6]
    - button "EN" [ref=e8]:
      - img [ref=e9]
      - text: EN
  - navigation "Mobile navigation" [ref=e13]:
    - button "Home" [ref=e14] [cursor=pointer]:
      - img [ref=e15]
      - generic [ref=e18]: Home
    - button "Company" [ref=e19] [cursor=pointer]:
      - img [ref=e20]
      - generic [ref=e24]: Company
    - button "Open Igloo assistant" [ref=e25] [cursor=pointer]:
      - img [ref=e27]
    - button "Projects" [ref=e29] [cursor=pointer]:
      - img [ref=e30]
      - generic [ref=e32]: Projects
    - button "Contact" [ref=e33] [cursor=pointer]:
      - img [ref=e34]
      - generic [ref=e37]: Contact
  - main [ref=e38]:
    - generic:
      - img
    - heading "Building the future" [level=1] [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]: Building the future
        - generic [ref=e47]: Crafting the future
    - region "Company profile" [ref=e49]:
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e52]:
            - generic [ref=e53]: Company profile
            - heading "Built with expertise. Delivered with control." [level=2] [ref=e54]:
              - generic [ref=e55]:
                - generic [ref=e57]: Built with
                - generic [ref=e59]: expertise.
              - generic [ref=e60]:
                - generic [ref=e62]: Delivered with
                - generic [ref=e64]: control.
            - generic [ref=e66]:
              - paragraph [ref=e67]:
                - generic [ref=e69]: Founded in 2018 and managed by civil
                - generic [ref=e71]: engineer Adem Talay, SARL Igloo Yapi
                - generic [ref=e73]: Construction works from Bir Khadem, Algiers,
                - generic [ref=e75]: on residential and mixed-use programmes
                - generic [ref=e77]: across Algeria.
              - paragraph [ref=e78]:
                - generic [ref=e80]: The company holds a Professional
                - generic [ref=e82]: Qualification and Classification Certificate,
                - generic [ref=e84]: Category 6, and operates with a qualified
                - generic [ref=e86]: building manager, engineers, architects,
                - generic [ref=e88]: construction managers and site staff.
          - generic [ref=e89]:
            - generic [ref=e90]:
              - img [ref=e91]
              - generic [ref=e94]: Professional Qualification & Classification Certificate - Category 6
            - generic [ref=e97]:
              - img [ref=e98]
              - img [ref=e99]
              - img [ref=e100]
              - img [ref=e101]
              - img [ref=e102]
        - generic [ref=e103]:
          - generic [ref=e104]:
            - generic [ref=e105]:
              - generic [ref=e106]: "2018"
              - generic [ref=e109]: Established
            - generic [ref=e110]:
              - generic [ref=e111]: "11"
              - generic [ref=e112]:
                - generic [ref=e114]: Projects
                - generic [ref=e116]: delivered and
                - generic [ref=e118]: underway
            - generic [ref=e119]:
              - generic [ref=e120]: 2,500+
              - generic [ref=e121]:
                - generic [ref=e123]: Homes
                - generic [ref=e125]: delivered or
                - generic [ref=e127]: underway
          - generic [ref=e128]:
            - generic [ref=e129]:
              - img [ref=e130]
              - heading "Category 6 Contractor" [level=3] [ref=e133]:
                - generic [ref=e135]: Category 6 Contractor
            - generic [ref=e136]:
              - img [ref=e137]
              - heading "Multidisciplinary Team" [level=3] [ref=e141]:
                - generic [ref=e143]: Multidisciplinary Team
            - generic [ref=e144]:
              - img [ref=e145]
              - heading "Residential & Mixed-use Expertise" [level=3] [ref=e149]:
                - generic [ref=e151]: Residential &
                - generic [ref=e153]: Mixed-use Expertise
    - generic [ref=e155]:
      - generic [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]: Selected work
          - generic [ref=e160]:
            - heading "Built evidence, not promises." [level=2] [ref=e161]:
              - generic [ref=e163]: Built evidence, not
              - generic [ref=e165]: promises.
            - paragraph [ref=e166]:
              - generic [ref=e168]: A portfolio of housing, villas, commercial premises,
              - generic [ref=e170]: roads and networks, shown through real project
              - generic [ref=e172]: scope and location proof.
        - link "See all projects" [ref=e174] [cursor=pointer]:
          - /url: /projects
      - group "Featured projects" [ref=e176]:
        - generic [ref=e178]:
          - group "1 / 11" [ref=e179]:
            - link "Douaouda housing project Completed Douaouda 300/500 Assisted Promotional Housing - Douaouda Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery. Open project" [ref=e180] [cursor=pointer]:
              - /url: /projects/douaouda-300-500-housing
              - img "Douaouda housing project" [ref=e181]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Douaouda
                - heading "300/500 Assisted Promotional Housing - Douaouda" [level=3]:
                  - generic:
                    - generic: 300/500 Assisted
                  - generic:
                    - generic: Promotional Housing -
                  - generic:
                    - generic: Douaouda
                - paragraph:
                  - generic:
                    - generic: Assisted promotional housing in Douaouda
                  - generic:
                    - generic: with professional premises, exterior works and
                  - generic:
                    - generic: TCE delivery.
                - generic:
                  - generic: Open project
                  - img
          - group "2 / 11" [ref=e183]:
            - link "Completed Sidi Abdallah - Mahalma 200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises. Open project" [ref=e184] [cursor=pointer]:
              - /url: /projects/sidi-abdallah-200-1200-housing
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Sidi Abdallah - Mahalma
                - heading "200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma" [level=3]:
                  - generic:
                    - generic: 200/1200 Promotional
                  - generic:
                    - generic: Public Housing - Sidi
                  - generic:
                    - generic: Abdallah - Mahalma
                - paragraph:
                  - generic:
                    - generic: Public promotional housing in Sidi Abdallah
                  - generic:
                    - generic: with R+9 buildings and
                  - generic:
                    - generic: commercial/professional premises.
                - generic:
                  - generic: Open project
                  - img
          - group "3 / 11" [ref=e186]:
            - link "Completed Staoueli 11/41 Villas and Network Works - Staoueli Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks. Open project" [ref=e187] [cursor=pointer]:
              - /url: /projects/staoueli-11-41-villas
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Staoueli
                - heading "11/41 Villas and Network Works - Staoueli" [level=3]:
                  - generic:
                    - generic: 11/41 Villas and Network
                  - generic:
                    - generic: Works - Staoueli
                - paragraph:
                  - generic:
                    - generic: Standing villa delivery at Les Pastorales with
                  - generic:
                    - generic: secondary trades, roads and utility networks.
                - generic:
                  - generic: Open project
                  - img
          - group "4 / 11" [ref=e189]:
            - link "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building. Completed Douira, Algiers Rahmania Commercial Centres - Douira Two commercial centres serving a 2,500-home residential programme in Douira, Algiers. Open project" [ref=e190] [cursor=pointer]:
              - /url: /projects/rahmania
              - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e191]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Douira, Algiers
                - heading "Rahmania Commercial Centres - Douira" [level=3]:
                  - generic:
                    - generic: Rahmania Commercial
                  - generic:
                    - generic: Centres - Douira
                - paragraph:
                  - generic:
                    - generic: Two commercial centres serving a 2,500-home
                  - generic:
                    - generic: residential programme in Douira, Algiers.
                - generic:
                  - generic: Open project
                  - img
          - group "5 / 11" [ref=e193]:
            - link "Completed Said Hamdine, Bir Mourad Rais, Algiers Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors. Open project" [ref=e194] [cursor=pointer]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Said Hamdine, Bir Mourad Rais, Algiers
                - heading "Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine" [level=3]:
                  - generic:
                    - generic: Mixed Real Estate
                  - generic:
                    - generic: Complex with 202 Free
                  - generic:
                    - generic: Promotional Housing -
                  - generic:
                    - generic: Said Hamdine
                - paragraph:
                  - generic:
                    - generic: Five residential blocks, 202 free promotional
                  - generic:
                    - generic: units, commercial levels and two basement
                  - generic:
                    - generic: parking floors.
                - generic:
                  - generic: Open project
                  - img
          - group "6 / 11" [ref=e196]:
            - link "Completed Rouiba 4 Promotional Villas and Network Works - Rouiba Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works. Open project" [ref=e197] [cursor=pointer]:
              - /url: /projects/rouiba-4-promotional-villas
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Rouiba
                - heading "4 Promotional Villas and Network Works - Rouiba" [level=3]:
                  - generic:
                    - generic: 4 Promotional Villas and
                  - generic:
                    - generic: Network Works - Rouiba
                - paragraph:
                  - generic:
                    - generic: Four promotional villas in Rouiba delivered with
                  - generic:
                    - generic: TCE, VRD and exterior site works.
                - generic:
                  - generic: Open project
                  - img
          - group "7 / 11" [ref=e199]:
            - link "Completed Sidi Benour, Algiers 50 Free Promotional Housing Units - Sidi Benour High-rise R+13 residential delivery within the Sidi Benour promotional housing programme. Open project" [ref=e200] [cursor=pointer]:
              - /url: /projects/sidi-benour-50-housing
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Sidi Benour, Algiers
                - heading "50 Free Promotional Housing Units - Sidi Benour" [level=3]:
                  - generic:
                    - generic: 50 Free Promotional
                  - generic:
                    - generic: Housing Units - Sidi
                  - generic:
                    - generic: Benour
                - paragraph:
                  - generic:
                    - generic: High-rise R+13 residential delivery within the
                  - generic:
                    - generic: Sidi Benour promotional housing programme.
                - generic:
                  - generic: Open project
                  - img
          - group "8 / 11" [ref=e202]:
            - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. Current Dely Brahim, Algiers 240 Free Promotional Housing with Commercial Areas - Dely Brahim A 240-unit vertical residential programme with commercial areas, services and underground parking. Open project" [ref=e203] [cursor=pointer]:
              - /url: /projects/dely-brahim-240-housing
              - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e204]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Dely Brahim, Algiers
                - heading "240 Free Promotional Housing with Commercial Areas - Dely Brahim" [level=3]:
                  - generic:
                    - generic: 240 Free Promotional
                  - generic:
                    - generic: Housing with Commercial
                  - generic:
                    - generic: Areas - Dely Brahim
                - paragraph:
                  - generic:
                    - generic: A 240-unit vertical residential programme with
                  - generic:
                    - generic: commercial areas, services and underground
                  - generic:
                    - generic: parking.
                - generic:
                  - generic: Open project
                  - img
          - group "9 / 11" [ref=e206]:
            - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. Current Bas Mazagran, Mostaganem 200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises. Open project" [ref=e207] [cursor=pointer]:
              - /url: /projects/bas-mazagran-200-38-housing
              - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e208]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Bas Mazagran, Mostaganem
                - heading "200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran" [level=3]:
                  - generic:
                    - generic: 200 Assisted Housing and
                  - generic:
                    - generic: 38 Free Promotional
                  - generic:
                    - generic: Housing Units - Bas
                  - generic:
                    - generic: Mazagran
                - paragraph:
                  - generic:
                    - generic: A seven-block Mostaganem programme
                  - generic:
                    - generic: combining assisted and free promotional
                  - generic:
                    - generic: housing with commercial premises.
                - generic:
                  - generic: Open project
                  - img
          - group "10 / 11" [ref=e210]:
            - link "Current Bouraada Site, Reghaia, Algiers Province 250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution. Open project" [ref=e211] [cursor=pointer]:
              - /url: /projects/reghaia-bouraada-250-housing
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Bouraada Site, Reghaia, Algiers Province
                - heading "250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site" [level=3]:
                  - generic:
                    - generic: 250 Housing Units with
                  - generic:
                    - generic: Commercial Rental and
                  - generic:
                    - generic: Concierge Services -
                  - generic:
                    - generic: Bouraada Site
                - paragraph:
                  - generic:
                    - generic: A 250-unit Reghaia programme with
                  - generic:
                    - generic: commercial premises, concierge spaces and
                  - generic:
                    - generic: multi-block execution.
                - generic:
                  - generic: Open project
                  - img
          - group "11 / 11" [ref=e213]:
            - link "Current Boudouaou, Boumerdes 70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises. Open project" [ref=e214] [cursor=pointer]:
              - /url: /projects/boudouaou-70-10-housing
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Boudouaou, Boumerdes
                - heading "70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou" [level=3]:
                  - generic:
                    - generic: 70 Assisted Housing and
                  - generic:
                    - generic: 10 Free Promotional
                  - generic:
                    - generic: Housing Units -
                  - generic:
                    - generic: Boudouaou
                - paragraph:
                  - generic:
                    - generic: A Boumerdes programme of 70 assisted and
                  - generic:
                    - generic: 10 free promotional units with
                  - generic:
                    - generic: commercial/professional premises.
                - generic:
                  - generic: Open project
                  - img
        - generic [ref=e216]:
          - generic [ref=e217]:
            - button "Previous" [disabled]:
              - img
            - button "Next" [ref=e218]:
              - img
          - generic [ref=e221]: 01 / 11
    - region "From first coordination to handover." [ref=e223]:
      - generic [ref=e224]:
        - generic [ref=e225]:
          - generic [ref=e226]:
            - generic [ref=e227]: Delivery discipline
            - heading "From first coordination to handover." [level=2] [ref=e229]:
              - generic [ref=e231]: From first
              - generic [ref=e233]: coordination to
              - generic [ref=e235]: handover.
            - paragraph [ref=e236]:
              - generic [ref=e238]: A clear technical structure keeps each programme
              - generic [ref=e240]: moving through planning, engineering control, site
              - generic [ref=e242]: execution and final delivery.
          - figure
        - generic [ref=e244]:
          - article [ref=e245]:
            - generic [ref=e246]: "01"
            - img [ref=e249]
            - heading "Pre-construction coordination" [level=3] [ref=e253]:
              - generic [ref=e255]: Pre-construction
              - generic [ref=e257]: coordination
            - paragraph [ref=e259]:
              - generic [ref=e261]: Scope, programme requirements, quantities and site
              - generic [ref=e263]: constraints are aligned before work moves on site.
          - article [ref=e264]:
            - generic [ref=e265]: "02"
            - img [ref=e268]
            - heading "Engineering & TCE control" [level=3] [ref=e274]:
              - generic [ref=e276]: Engineering &
              - generic [ref=e278]: TCE control
            - paragraph [ref=e280]:
              - generic [ref=e282]: Engineers, architects and technical managers
              - generic [ref=e284]: coordinate secondary trades, structures, MEP, roads
              - generic [ref=e286]: and networks.
          - article [ref=e287]:
            - generic [ref=e288]: "03"
            - img [ref=e291]
            - heading "Site execution" [level=3] [ref=e296]:
              - generic [ref=e298]: Site execution
            - paragraph [ref=e300]:
              - generic [ref=e302]: Construction managers and site teams organise daily
              - generic [ref=e304]: progress, trade sequencing and material movement.
          - article [ref=e305]:
            - generic [ref=e306]: "04"
            - img [ref=e309]
            - heading "Quality, safety & schedule monitoring" [level=3] [ref=e312]:
              - generic [ref=e314]: Quality, safety &
              - generic [ref=e316]: schedule
              - generic [ref=e318]: monitoring
            - paragraph [ref=e320]:
              - generic [ref=e322]: Delivery is tracked against technical requirements,
              - generic [ref=e324]: safety rules, finish quality and contractual milestones.
          - article [ref=e325]:
            - generic [ref=e326]: "05"
            - img [ref=e329]
            - heading "Handover & aftercare" [level=3] [ref=e332]:
              - generic [ref=e334]: Handover &
              - generic [ref=e336]: aftercare
            - paragraph [ref=e338]:
              - generic [ref=e340]: Final works are closed with practical readiness,
              - generic [ref=e342]: documentation and attention to the long-term use of
              - generic [ref=e344]: each place.
    - generic [ref=e347]:
      - generic [ref=e348]:
        - generic [ref=e349]:
          - paragraph [ref=e350]: Project footprint
          - heading "Algeria & Beyond" [level=2] [ref=e351]:
            - generic [ref=e353]: Algeria & Beyond
        - paragraph [ref=e354]:
          - generic [ref=e356]: Eleven project locations across four highlighted
          - generic [ref=e358]: wilayas, with a dense Algiers delivery belt and
          - generic [ref=e360]: active reach toward Mostaganem and Boumerdes.
      - generic [ref=e361]:
        - button "All locations11" [pressed] [ref=e362]: All locations11
        - button "West Algiers / Tipaza5" [ref=e364]
        - button "Central Algiers2" [ref=e365]
        - button "East Algiers / Boumerdes2" [ref=e366]
        - button "Mostaganem1" [ref=e367]
        - button "Boumerdes1" [ref=e368]
      - generic [ref=e369]:
        - generic [ref=e370]:
          - region "Interactive map of Igloo Construction project locations across Algeria" [ref=e372]:
            - generic [ref=e373]:
              - region "Map" [ref=e374]
              - generic:
                - generic: Use Ctrl + scroll to zoom the map
              - button "Map marker" [ref=e375] [cursor=pointer]:
                - generic [ref=e376]:
                  - img [ref=e377]
                  - generic: "1"
              - button "Map marker" [ref=e380] [cursor=pointer]:
                - generic [ref=e381]:
                  - img [ref=e382]
                  - generic: "2"
              - button "Map marker" [ref=e385] [cursor=pointer]:
                - generic [ref=e386]:
                  - img [ref=e387]
                  - generic: "3"
              - button "Map marker" [ref=e390] [cursor=pointer]:
                - generic [ref=e391]:
                  - img [ref=e392]
                  - generic: "4"
              - button "Map marker" [ref=e395] [cursor=pointer]:
                - generic [ref=e396]:
                  - img [ref=e397]
                  - generic: "5"
              - button "Map marker" [ref=e400] [cursor=pointer]:
                - generic [ref=e401]:
                  - img [ref=e402]
                  - generic: "6"
              - button "Map marker" [ref=e405] [cursor=pointer]:
                - generic [ref=e406]:
                  - img [ref=e407]
                  - generic: "7"
              - button "Map marker" [ref=e410] [cursor=pointer]:
                - generic [ref=e411]:
                  - img [ref=e412]
                  - generic: "8"
              - button "Map marker" [ref=e415] [cursor=pointer]:
                - generic [ref=e416]:
                  - img [ref=e417]
                  - generic: "9"
              - button "Map marker" [ref=e420] [cursor=pointer]:
                - generic [ref=e421]:
                  - img [ref=e422]
                  - generic: "10"
              - button "Map marker" [ref=e425] [cursor=pointer]:
                - generic [ref=e426]:
                  - img [ref=e427]
                  - generic: "11"
            - generic [ref=e430]:
              - button "Zoom in" [ref=e431] [cursor=pointer]
              - button "Zoom out" [ref=e433] [cursor=pointer]
          - generic [ref=e435]:
            - generic [ref=e436]:
              - img [ref=e437]
              - generic [ref=e440]:
                - generic [ref=e441]: "11"
                - generic [ref=e444]: project pins
            - generic [ref=e445]:
              - img [ref=e446]
              - generic [ref=e448]:
                - generic [ref=e449]: "4"
                - generic [ref=e452]: highlighted wilayas
            - generic [ref=e453]:
              - img [ref=e454]
              - generic [ref=e458]:
                - generic [ref=e459]: "1"
                - generic [ref=e462]: north-coast delivery belt
        - complementary [ref=e463]:
          - paragraph [ref=e464]: Selected project
          - heading "Douaouda Housing" [level=3] [ref=e465]:
            - generic [ref=e467]: Douaouda Housing
          - paragraph [ref=e468]: Douaouda · Tipaza
          - paragraph [ref=e469]:
            - generic [ref=e471]: Assisted promotional housing in Douaouda
            - generic [ref=e473]: with professional premises, exterior works and
            - generic [ref=e475]: TCE delivery.
          - generic [ref=e476]:
            - img [ref=e477]
            - generic [ref=e480]: West Algiers / Tipaza
            - generic [ref=e481]: "|"
            - generic [ref=e482]: Completed
          - img "Douaouda housing project" [ref=e484]
          - link "Open project" [ref=e485] [cursor=pointer]:
            - /url: /projects/douaouda-300-500-housing
            - generic [ref=e486]: Open project
            - img [ref=e487]
    - generic [ref=e491]:
      - generic [ref=e492]:
        - generic [ref=e493]:
          - img "Igloo Construction" [ref=e494]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e495]:
            - generic [ref=e497]: Let’s discuss the next
            - generic [ref=e499]: durable programme.
          - paragraph [ref=e500]:
            - generic [ref=e502]: Speak with an Algiers-based team experienced in
            - generic [ref=e504]: residential, mixed-use, roads, networks and
            - generic [ref=e506]: coordinated site delivery.
        - generic [ref=e507]:
          - generic [ref=e508]: Project discussion
          - link "Email Igloo" [ref=e509] [cursor=pointer]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e510]: Email Igloo
            - img [ref=e511]
          - link "Call Algeria office" [ref=e514] [cursor=pointer]:
            - /url: tel:+213542819461
            - generic [ref=e515]: Call Algeria office
            - img [ref=e516]
      - generic [ref=e518]:
        - generic [ref=e519]:
          - heading "Office" [level=3] [ref=e520]
          - generic [ref=e521]:
            - img [ref=e522]
            - generic [ref=e525]:
              - generic [ref=e527]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC,
              - generic [ref=e529]: Bir Khadem – Alger
        - generic [ref=e530]:
          - heading "Contact" [level=3] [ref=e531]
          - generic [ref=e532]:
            - link "+213 542 819 461" [ref=e533] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e534]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e536] [cursor=pointer]:
              - /url: tel:+905424795700
              - img [ref=e537]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e539] [cursor=pointer]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e540]
              - text: info@igloogroupe.com
        - generic [ref=e543]:
          - heading "Navigation" [level=3] [ref=e544]
          - generic [ref=e545]:
            - link "Home" [ref=e546] [cursor=pointer]:
              - /url: /
            - link "Company" [ref=e547] [cursor=pointer]:
              - /url: /about
            - link "Projects" [ref=e548] [cursor=pointer]:
              - /url: /projects
            - link "Proof" [ref=e549] [cursor=pointer]:
              - /url: /#proof
            - link "Process" [ref=e550] [cursor=pointer]:
              - /url: /#services
            - link "Contact" [ref=e551] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e552]:
        - paragraph [ref=e553]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e554]:
          - generic [ref=e556]: Bir Khadem, Algiers · Category 6 certified contractor ·
          - generic [ref=e558]: Residential and mixed-use delivery
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