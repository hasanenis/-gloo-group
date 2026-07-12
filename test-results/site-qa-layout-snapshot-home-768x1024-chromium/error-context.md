# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: home @ 768x1024
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

Timeout: 15000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: home-768x1024.png

Call log:
  - Expect "toHaveScreenshot(home-768x1024.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 347572 pixels (ratio 0.45 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 305247 pixels (ratio 0.39 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 172017 pixels (ratio 0.22 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 203568 pixels (ratio 0.26 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 171272 pixels (ratio 0.22 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 184883 pixels (ratio 0.24 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 103021 pixels (ratio 0.14 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
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
              - generic [ref=e57]: Built with expertise.
              - generic [ref=e60]: Delivered with control.
            - generic [ref=e62]:
              - paragraph [ref=e63]:
                - generic [ref=e65]: Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi
                - generic [ref=e67]: Construction works from Bir Khadem, Algiers, on residential and mixed-use
                - generic [ref=e69]: programmes across Algeria.
              - paragraph [ref=e70]:
                - generic [ref=e72]: The company holds a Professional Qualification and Classification Certificate,
                - generic [ref=e74]: Category 6, and operates with a qualified building manager, engineers,
                - generic [ref=e76]: architects, construction managers and site staff.
          - generic [ref=e77]:
            - generic [ref=e78]:
              - img [ref=e79]
              - generic [ref=e82]: Professional Qualification & Classification Certificate - Category 6
            - generic [ref=e85]:
              - img [ref=e86]
              - img [ref=e87]
              - img [ref=e88]
              - img [ref=e89]
              - img [ref=e90]
        - generic [ref=e91]:
          - generic [ref=e92]:
            - generic [ref=e93]:
              - generic [ref=e94]: "2018"
              - generic [ref=e97]: Established
            - generic [ref=e98]:
              - generic [ref=e99]: "11"
              - generic [ref=e100]:
                - generic [ref=e102]: Projects
                - generic [ref=e104]: delivered and
                - generic [ref=e106]: underway
            - generic [ref=e107]:
              - generic [ref=e108]: 2,500+
              - generic [ref=e109]:
                - generic [ref=e111]: Homes
                - generic [ref=e113]: delivered or
                - generic [ref=e115]: underway
          - generic [ref=e116]:
            - generic [ref=e117]:
              - img [ref=e118]
              - heading "Category 6 Contractor" [level=3] [ref=e121]:
                - generic [ref=e123]: Category 6 Contractor
            - generic [ref=e124]:
              - img [ref=e125]
              - heading "Multidisciplinary Team" [level=3] [ref=e129]:
                - generic [ref=e131]: Multidisciplinary Team
            - generic [ref=e132]:
              - img [ref=e133]
              - heading "Residential & Mixed-use Expertise" [level=3] [ref=e137]:
                - generic [ref=e139]: Residential &
                - generic [ref=e141]: Mixed-use Expertise
    - generic [ref=e143]:
      - generic [ref=e145]:
        - generic [ref=e146]:
          - generic [ref=e147]: Selected work
          - generic [ref=e148]:
            - heading "Built evidence, not promises." [level=2] [ref=e149]:
              - generic [ref=e151]: Built evidence, not promises.
            - paragraph [ref=e152]:
              - generic [ref=e154]: A portfolio of housing, villas, commercial premises, roads and networks,
              - generic [ref=e156]: shown through real project scope and location proof.
        - link "See all projects" [ref=e158] [cursor=pointer]:
          - /url: /projects
      - group "Featured projects" [ref=e160]:
        - generic [ref=e162]:
          - group "1 / 11" [ref=e163]:
            - link "Douaouda housing project Completed Douaouda 300/500 Assisted Promotional Housing - Douaouda Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery. Open project" [ref=e164] [cursor=pointer]:
              - /url: /projects/douaouda-300-500-housing
              - img "Douaouda housing project" [ref=e165]
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
                    - generic: Assisted promotional housing in Douaouda with
                  - generic:
                    - generic: professional premises, exterior works and TCE delivery.
                - generic:
                  - generic: Open project
                  - img
          - group "2 / 11" [ref=e167]:
            - link "Completed Sidi Abdallah - Mahalma 200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises. Open project" [ref=e168] [cursor=pointer]:
              - /url: /projects/sidi-abdallah-200-1200-housing
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Sidi Abdallah - Mahalma
                - heading "200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma" [level=3]:
                  - generic:
                    - generic: 200/1200 Promotional Public
                  - generic:
                    - generic: Housing - Sidi Abdallah -
                  - generic:
                    - generic: Mahalma
                - paragraph:
                  - generic:
                    - generic: Public promotional housing in Sidi Abdallah with R+9
                  - generic:
                    - generic: buildings and commercial/professional premises.
                - generic:
                  - generic: Open project
                  - img
          - group "3 / 11" [ref=e170]:
            - link "Completed Staoueli 11/41 Villas and Network Works - Staoueli Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks. Open project" [ref=e171] [cursor=pointer]:
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
                    - generic: Standing villa delivery at Les Pastorales with secondary
                  - generic:
                    - generic: trades, roads and utility networks.
                - generic:
                  - generic: Open project
                  - img
          - group "4 / 11" [ref=e173]:
            - link "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building. Completed Douira, Algiers Rahmania Commercial Centres - Douira Two commercial centres serving a 2,500-home residential programme in Douira, Algiers. Open project" [ref=e174] [cursor=pointer]:
              - /url: /projects/rahmania
              - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e175]
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
          - group "5 / 11" [ref=e177]:
            - link "Completed Said Hamdine, Bir Mourad Rais, Algiers Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors. Open project" [ref=e178] [cursor=pointer]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Said Hamdine, Bir Mourad Rais, Algiers
                - heading "Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine" [level=3]:
                  - generic:
                    - generic: Mixed Real Estate Complex
                  - generic:
                    - generic: with 202 Free Promotional
                  - generic:
                    - generic: Housing - Said Hamdine
                - paragraph:
                  - generic:
                    - generic: Five residential blocks, 202 free promotional units,
                  - generic:
                    - generic: commercial levels and two basement parking floors.
                - generic:
                  - generic: Open project
                  - img
          - group "6 / 11" [ref=e180]:
            - link "Completed Rouiba 4 Promotional Villas and Network Works - Rouiba Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works. Open project" [ref=e181] [cursor=pointer]:
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
                    - generic: Four promotional villas in Rouiba delivered with TCE,
                  - generic:
                    - generic: VRD and exterior site works.
                - generic:
                  - generic: Open project
                  - img
          - group "7 / 11" [ref=e183]:
            - link "Completed Sidi Benour, Algiers 50 Free Promotional Housing Units - Sidi Benour High-rise R+13 residential delivery within the Sidi Benour promotional housing programme. Open project" [ref=e184] [cursor=pointer]:
              - /url: /projects/sidi-benour-50-housing
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Sidi Benour, Algiers
                - heading "50 Free Promotional Housing Units - Sidi Benour" [level=3]:
                  - generic:
                    - generic: 50 Free Promotional Housing
                  - generic:
                    - generic: Units - Sidi Benour
                - paragraph:
                  - generic:
                    - generic: High-rise R+13 residential delivery within the Sidi Benour
                  - generic:
                    - generic: promotional housing programme.
                - generic:
                  - generic: Open project
                  - img
          - group "8 / 11" [ref=e186]:
            - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. Current Dely Brahim, Algiers 240 Free Promotional Housing with Commercial Areas - Dely Brahim A 240-unit vertical residential programme with commercial areas, services and underground parking. Open project" [ref=e187] [cursor=pointer]:
              - /url: /projects/dely-brahim-240-housing
              - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e188]
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
                    - generic: commercial areas, services and underground parking.
                - generic:
                  - generic: Open project
                  - img
          - group "9 / 11" [ref=e190]:
            - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. Current Bas Mazagran, Mostaganem 200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises. Open project" [ref=e191] [cursor=pointer]:
              - /url: /projects/bas-mazagran-200-38-housing
              - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e192]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Bas Mazagran, Mostaganem
                - heading "200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran" [level=3]:
                  - generic:
                    - generic: 200 Assisted Housing and 38
                  - generic:
                    - generic: Free Promotional Housing
                  - generic:
                    - generic: Units - Bas Mazagran
                - paragraph:
                  - generic:
                    - generic: A seven-block Mostaganem programme combining
                  - generic:
                    - generic: assisted and free promotional housing with commercial
                  - generic:
                    - generic: premises.
                - generic:
                  - generic: Open project
                  - img
          - group "10 / 11" [ref=e194]:
            - link "Current Bouraada Site, Reghaia, Algiers Province 250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution. Open project" [ref=e195] [cursor=pointer]:
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
                    - generic: A 250-unit Reghaia programme with commercial
                  - generic:
                    - generic: premises, concierge spaces and multi-block execution.
                - generic:
                  - generic: Open project
                  - img
          - group "11 / 11" [ref=e197]:
            - link "Current Boudouaou, Boumerdes 70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises. Open project" [ref=e198] [cursor=pointer]:
              - /url: /projects/boudouaou-70-10-housing
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Boudouaou, Boumerdes
                - heading "70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou" [level=3]:
                  - generic:
                    - generic: 70 Assisted Housing and 10
                  - generic:
                    - generic: Free Promotional Housing
                  - generic:
                    - generic: Units - Boudouaou
                - paragraph:
                  - generic:
                    - generic: A Boumerdes programme of 70 assisted and 10 free
                  - generic:
                    - generic: promotional units with commercial/professional
                  - generic:
                    - generic: premises.
                - generic:
                  - generic: Open project
                  - img
        - generic [ref=e200]:
          - generic [ref=e201]:
            - button "Previous" [disabled]:
              - img
            - button "Next" [ref=e202]:
              - img
          - generic [ref=e205]: 01 / 11
    - region "From first coordination to handover." [ref=e207]:
      - generic [ref=e208]:
        - generic [ref=e209]:
          - generic [ref=e210]:
            - generic [ref=e211]: Delivery discipline
            - heading "From first coordination to handover." [level=2] [ref=e213]:
              - generic [ref=e215]: From first
              - generic [ref=e217]: coordination
              - generic [ref=e219]: to handover.
            - paragraph [ref=e220]:
              - generic [ref=e222]: A clear technical structure keeps each programme moving through planning,
              - generic [ref=e224]: engineering control, site execution and final delivery.
          - figure
        - generic [ref=e226]:
          - article [ref=e227]:
            - generic [ref=e228]: "01"
            - img [ref=e231]
            - heading "Pre-construction coordination" [level=3] [ref=e235]:
              - generic [ref=e237]: Pre-construction
              - generic [ref=e239]: coordination
            - paragraph [ref=e241]:
              - generic [ref=e243]: Scope, programme requirements, quantities
              - generic [ref=e245]: and site constraints are aligned before
              - generic [ref=e247]: work moves on site.
          - article [ref=e248]:
            - generic [ref=e249]: "02"
            - img [ref=e252]
            - heading "Engineering & TCE control" [level=3] [ref=e258]:
              - generic [ref=e260]: Engineering &
              - generic [ref=e262]: TCE control
            - paragraph [ref=e264]:
              - generic [ref=e266]: Engineers, architects and technical
              - generic [ref=e268]: managers coordinate secondary trades,
              - generic [ref=e270]: structures, MEP, roads and networks.
          - article [ref=e271]:
            - generic [ref=e272]: "03"
            - img [ref=e275]
            - heading "Site execution" [level=3] [ref=e280]:
              - generic [ref=e282]: Site execution
            - paragraph [ref=e284]:
              - generic [ref=e286]: Construction managers and site teams
              - generic [ref=e288]: organise daily progress, trade sequencing
              - generic [ref=e290]: and material movement.
          - article [ref=e291]:
            - generic [ref=e292]: "04"
            - img [ref=e295]
            - heading "Quality, safety & schedule monitoring" [level=3] [ref=e298]:
              - generic [ref=e300]: Quality, safety &
              - generic [ref=e302]: schedule
              - generic [ref=e304]: monitoring
            - paragraph [ref=e306]:
              - generic [ref=e308]: Delivery is tracked against technical
              - generic [ref=e310]: requirements, safety rules, finish quality
              - generic [ref=e312]: and contractual milestones.
          - article [ref=e313]:
            - generic [ref=e314]: "05"
            - img [ref=e317]
            - heading "Handover & aftercare" [level=3] [ref=e320]:
              - generic [ref=e322]: Handover &
              - generic [ref=e324]: aftercare
            - paragraph [ref=e326]:
              - generic [ref=e328]: Final works are closed with practical
              - generic [ref=e330]: readiness, documentation and attention to
              - generic [ref=e332]: the long-term use of each place.
    - generic [ref=e335]:
      - generic [ref=e336]:
        - generic [ref=e337]:
          - paragraph [ref=e338]: Project footprint
          - heading "Algeria & Beyond" [level=2] [ref=e339]:
            - generic [ref=e341]: Algeria & Beyond
        - paragraph [ref=e342]:
          - generic [ref=e344]: Eleven project locations across four highlighted wilayas, with a dense Algiers delivery belt
          - generic [ref=e346]: and active reach toward Mostaganem and Boumerdes.
      - generic [ref=e347]:
        - button "All locations11" [pressed] [ref=e348]: All locations11
        - button "West Algiers / Tipaza5" [ref=e350]
        - button "Central Algiers2" [ref=e351]
        - button "East Algiers / Boumerdes2" [ref=e352]
        - button "Mostaganem1" [ref=e353]
        - button "Boumerdes1" [ref=e354]
      - generic [ref=e355]:
        - generic [ref=e356]:
          - region "Interactive map of Igloo Construction project locations across Algeria" [ref=e358]:
            - generic [ref=e359]:
              - region "Map" [ref=e360]
              - generic:
                - generic: Use Ctrl + scroll to zoom the map
              - button "Map marker" [ref=e361] [cursor=pointer]:
                - generic [ref=e362]:
                  - img [ref=e363]
                  - generic: "1"
              - button "Map marker" [ref=e366] [cursor=pointer]:
                - generic [ref=e367]:
                  - img [ref=e368]
                  - generic: "2"
              - button "Map marker" [ref=e371] [cursor=pointer]:
                - generic [ref=e372]:
                  - img [ref=e373]
                  - generic: "3"
              - button "Map marker" [ref=e376] [cursor=pointer]:
                - generic [ref=e377]:
                  - img [ref=e378]
                  - generic: "4"
              - button "Map marker" [ref=e381] [cursor=pointer]:
                - generic [ref=e382]:
                  - img [ref=e383]
                  - generic: "5"
              - button "Map marker" [ref=e386] [cursor=pointer]:
                - generic [ref=e387]:
                  - img [ref=e388]
                  - generic: "6"
              - button "Map marker" [ref=e391] [cursor=pointer]:
                - generic [ref=e392]:
                  - img [ref=e393]
                  - generic: "7"
              - button "Map marker" [ref=e396] [cursor=pointer]:
                - generic [ref=e397]:
                  - img [ref=e398]
                  - generic: "8"
              - button "Map marker" [ref=e401] [cursor=pointer]:
                - generic [ref=e402]:
                  - img [ref=e403]
                  - generic: "9"
              - button "Map marker" [ref=e406] [cursor=pointer]:
                - generic [ref=e407]:
                  - img [ref=e408]
                  - generic: "10"
              - button "Map marker" [ref=e411] [cursor=pointer]:
                - generic [ref=e412]:
                  - img [ref=e413]
                  - generic: "11"
            - generic [ref=e416]:
              - button "Zoom in" [ref=e417] [cursor=pointer]
              - button "Zoom out" [ref=e419] [cursor=pointer]
          - generic [ref=e421]:
            - generic [ref=e422]:
              - img [ref=e423]
              - generic [ref=e426]:
                - generic [ref=e427]: "11"
                - generic [ref=e430]: project pins
            - generic [ref=e431]:
              - img [ref=e432]
              - generic [ref=e434]:
                - generic [ref=e435]: "4"
                - generic [ref=e438]: highlighted wilayas
            - generic [ref=e439]:
              - img [ref=e440]
              - generic [ref=e444]:
                - generic [ref=e445]: "1"
                - generic [ref=e448]: north-coast delivery belt
        - complementary [ref=e449]:
          - paragraph [ref=e450]: Selected project
          - heading "Douaouda Housing" [level=3] [ref=e451]:
            - generic [ref=e453]: Douaouda Housing
          - paragraph [ref=e454]: Douaouda · Tipaza
          - paragraph [ref=e455]:
            - generic [ref=e457]: Assisted promotional housing in Douaouda with professional premises, exterior works and TCE
            - generic [ref=e459]: delivery.
          - generic [ref=e460]:
            - img [ref=e461]
            - generic [ref=e464]: West Algiers / Tipaza
            - generic [ref=e465]: "|"
            - generic [ref=e466]: Completed
          - img "Douaouda housing project" [ref=e468]
          - link "Open project" [ref=e469] [cursor=pointer]:
            - /url: /projects/douaouda-300-500-housing
            - generic [ref=e470]: Open project
            - img [ref=e471]
    - generic [ref=e475]:
      - generic [ref=e476]:
        - generic [ref=e477]:
          - img "Igloo Construction" [ref=e478]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e479]:
            - generic [ref=e481]: Let’s discuss the next durable programme.
          - paragraph [ref=e482]:
            - generic [ref=e484]: Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site
            - generic [ref=e486]: delivery.
        - generic [ref=e487]:
          - generic [ref=e488]: Project discussion
          - link "Email Igloo" [ref=e489] [cursor=pointer]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e490]: Email Igloo
            - img [ref=e491]
          - link "Call Algeria office" [ref=e494] [cursor=pointer]:
            - /url: tel:+213542819461
            - generic [ref=e495]: Call Algeria office
            - img [ref=e496]
      - generic [ref=e498]:
        - generic [ref=e499]:
          - heading "Office" [level=3] [ref=e500]
          - generic [ref=e501]:
            - img [ref=e502]
            - generic [ref=e507]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem – Alger
        - generic [ref=e508]:
          - heading "Contact" [level=3] [ref=e509]
          - generic [ref=e510]:
            - link "+213 542 819 461" [ref=e511] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e512]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e514] [cursor=pointer]:
              - /url: tel:+905424795700
              - img [ref=e515]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e517] [cursor=pointer]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e518]
              - text: info@igloogroupe.com
        - generic [ref=e521]:
          - heading "Navigation" [level=3] [ref=e522]
          - generic [ref=e523]:
            - link "Home" [ref=e524] [cursor=pointer]:
              - /url: /
            - link "Company" [ref=e525] [cursor=pointer]:
              - /url: /about
            - link "Projects" [ref=e526] [cursor=pointer]:
              - /url: /projects
            - link "Proof" [ref=e527] [cursor=pointer]:
              - /url: /#proof
            - link "Process" [ref=e528] [cursor=pointer]:
              - /url: /#services
            - link "Contact" [ref=e529] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e530]:
        - paragraph [ref=e531]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e532]:
          - generic [ref=e534]: Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery
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