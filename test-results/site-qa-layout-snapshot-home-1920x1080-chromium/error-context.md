# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: home @ 1920x1080
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

Timeout: 15000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: home-1920x1080.png

Call log:
  - Expect "toHaveScreenshot(home-1920x1080.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 918441 pixels (ratio 0.45 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 748794 pixels (ratio 0.37 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 656255 pixels (ratio 0.32 of all image pixels) are different.
  - waiting 500ms before taking screenshot
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
    - generic [ref=e7]:
      - navigation [ref=e8]:
        - link "Home" [ref=e9] [cursor=pointer]:
          - /url: /
        - link "Company" [ref=e10] [cursor=pointer]:
          - /url: /about
        - link "Projects" [ref=e11] [cursor=pointer]:
          - /url: /projects
        - link "Contact" [ref=e12] [cursor=pointer]:
          - /url: /contact
      - button "EN" [ref=e13]:
        - img [ref=e14]
        - text: EN
  - button "Open Igloo assistant" [ref=e18] [cursor=pointer]:
    - generic [ref=e20]: Can I help?
    - img [ref=e21]
  - main [ref=e23]:
    - generic:
      - img
    - heading "Building the future" [level=1] [ref=e29]:
      - generic [ref=e31]: Crafting the future
    - region "Company profile" [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Company profile
            - heading "Built with expertise. Delivered with control." [level=2] [ref=e38]:
              - generic [ref=e41]: Built with expertise.
              - generic [ref=e42]:
                - generic [ref=e44]: Delivered with
                - generic [ref=e46]: control.
            - generic [ref=e48]:
              - paragraph [ref=e49]:
                - generic [ref=e51]: Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi
                - generic [ref=e53]: Construction works from Bir Khadem, Algiers, on residential and mixed-use
                - generic [ref=e55]: programmes across Algeria.
              - paragraph [ref=e56]:
                - generic [ref=e58]: The company holds a Professional Qualification and Classification Certificate,
                - generic [ref=e60]: Category 6, and operates with a qualified building manager, engineers,
                - generic [ref=e62]: architects, construction managers and site staff.
          - generic [ref=e63]:
            - generic [ref=e64]:
              - img [ref=e65]
              - generic [ref=e68]: Professional Qualification & Classification Certificate - Category 6
            - generic [ref=e71]:
              - img [ref=e72]
              - img [ref=e73]
              - img [ref=e74]
              - img [ref=e75]
              - img [ref=e76]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: "2018"
              - generic [ref=e83]: Established
            - generic [ref=e84]:
              - generic [ref=e85]: "11"
              - generic [ref=e86]:
                - generic [ref=e88]: Projects
                - generic [ref=e90]: delivered and
                - generic [ref=e92]: underway
            - generic [ref=e93]:
              - generic [ref=e94]: 2,500+
              - generic [ref=e95]:
                - generic [ref=e97]: Homes
                - generic [ref=e99]: delivered or
                - generic [ref=e101]: underway
          - generic [ref=e102]:
            - generic [ref=e103]:
              - img [ref=e104]
              - heading "Category 6 Contractor" [level=3] [ref=e107]:
                - generic [ref=e109]: Category 6 Contractor
            - generic [ref=e110]:
              - img [ref=e111]
              - heading "Multidisciplinary Team" [level=3] [ref=e115]:
                - generic [ref=e117]: Multidisciplinary Team
            - generic [ref=e118]:
              - img [ref=e119]
              - heading "Residential & Mixed-use Expertise" [level=3] [ref=e123]:
                - generic [ref=e125]: Residential &
                - generic [ref=e127]: Mixed-use Expertise
    - generic [ref=e129]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - generic [ref=e133]: Selected work
          - generic [ref=e134]:
            - heading "Built evidence, not promises." [level=2] [ref=e135]:
              - generic [ref=e137]: Built evidence, not
              - generic [ref=e139]: promises.
            - paragraph [ref=e140]:
              - generic [ref=e142]: A portfolio of housing, villas, commercial premises, roads and networks, shown through real project
              - generic [ref=e144]: scope and location proof.
        - link "See all projects" [ref=e146] [cursor=pointer]:
          - /url: /projects
      - group "Featured projects" [ref=e148]:
        - generic [ref=e150]:
          - group "1 / 11" [ref=e151]:
            - link "Douaouda housing project Completed Douaouda 300/500 Assisted Promotional Housing - Douaouda Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery. Open project" [ref=e152] [cursor=pointer]:
              - /url: /projects/douaouda-300-500-housing
              - img "Douaouda housing project" [ref=e153]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Douaouda
                - heading "300/500 Assisted Promotional Housing - Douaouda" [level=3]:
                  - generic:
                    - generic: 300/500 Assisted Promotional
                  - generic:
                    - generic: Housing - Douaouda
                - paragraph:
                  - generic:
                    - generic: Assisted promotional housing in Douaouda with professional premises,
                  - generic:
                    - generic: exterior works and TCE delivery.
                - generic:
                  - generic: Open project
                  - img
          - group "2 / 11" [ref=e155]:
            - link "Completed Sidi Abdallah - Mahalma 200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises. Open project" [ref=e156] [cursor=pointer]:
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
                    - generic: Housing - Sidi Abdallah - Mahalma
                - paragraph:
                  - generic:
                    - generic: Public promotional housing in Sidi Abdallah with R+9 buildings and
                  - generic:
                    - generic: commercial/professional premises.
                - generic:
                  - generic: Open project
                  - img
          - group "3 / 11" [ref=e158]:
            - link "Completed Staoueli 11/41 Villas and Network Works - Staoueli Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks. Open project" [ref=e159] [cursor=pointer]:
              - /url: /projects/staoueli-11-41-villas
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Staoueli
                - heading "11/41 Villas and Network Works - Staoueli" [level=3]:
                  - generic:
                    - generic: 11/41 Villas and Network Works -
                  - generic:
                    - generic: Staoueli
                - paragraph:
                  - generic:
                    - generic: Standing villa delivery at Les Pastorales with secondary trades, roads
                  - generic:
                    - generic: and utility networks.
                - generic:
                  - generic: Open project
                  - img
          - group "4 / 11" [ref=e161]:
            - link "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building. Completed Douira, Algiers Rahmania Commercial Centres - Douira Two commercial centres serving a 2,500-home residential programme in Douira, Algiers. Open project" [ref=e162] [cursor=pointer]:
              - /url: /projects/rahmania
              - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e163]
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Douira, Algiers
                - heading "Rahmania Commercial Centres - Douira" [level=3]:
                  - generic:
                    - generic: Rahmania Commercial Centres -
                  - generic:
                    - generic: Douira
                - paragraph:
                  - generic:
                    - generic: Two commercial centres serving a 2,500-home residential programme
                  - generic:
                    - generic: in Douira, Algiers.
                - generic:
                  - generic: Open project
                  - img
          - group "5 / 11" [ref=e165]:
            - link "Completed Said Hamdine, Bir Mourad Rais, Algiers Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors. Open project" [ref=e166] [cursor=pointer]:
              - /url: /projects/said-hamdine-mixed-real-estate
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Said Hamdine, Bir Mourad Rais, Algiers
                - heading "Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine" [level=3]:
                  - generic:
                    - generic: Mixed Real Estate Complex with 202
                  - generic:
                    - generic: Free Promotional Housing - Said
                  - generic:
                    - generic: Hamdine
                - paragraph:
                  - generic:
                    - generic: Five residential blocks, 202 free promotional units, commercial levels
                  - generic:
                    - generic: and two basement parking floors.
                - generic:
                  - generic: Open project
                  - img
          - group "6 / 11" [ref=e168]:
            - link "Completed Rouiba 4 Promotional Villas and Network Works - Rouiba Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works. Open project" [ref=e169] [cursor=pointer]:
              - /url: /projects/rouiba-4-promotional-villas
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Rouiba
                - heading "4 Promotional Villas and Network Works - Rouiba" [level=3]:
                  - generic:
                    - generic: 4 Promotional Villas and Network
                  - generic:
                    - generic: Works - Rouiba
                - paragraph:
                  - generic:
                    - generic: Four promotional villas in Rouiba delivered with TCE, VRD and exterior
                  - generic:
                    - generic: site works.
                - generic:
                  - generic: Open project
                  - img
          - group "7 / 11" [ref=e171]:
            - link "Completed Sidi Benour, Algiers 50 Free Promotional Housing Units - Sidi Benour High-rise R+13 residential delivery within the Sidi Benour promotional housing programme. Open project" [ref=e172] [cursor=pointer]:
              - /url: /projects/sidi-benour-50-housing
              - generic:
                - generic:
                  - generic: Completed
                  - generic:
                    - img
                    - generic: Sidi Benour, Algiers
                - heading "50 Free Promotional Housing Units - Sidi Benour" [level=3]:
                  - generic:
                    - generic: 50 Free Promotional Housing Units -
                  - generic:
                    - generic: Sidi Benour
                - paragraph:
                  - generic:
                    - generic: High-rise R+13 residential delivery within the Sidi Benour promotional
                  - generic:
                    - generic: housing programme.
                - generic:
                  - generic: Open project
                  - img
          - group "8 / 11" [ref=e174]:
            - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. Current Dely Brahim, Algiers 240 Free Promotional Housing with Commercial Areas - Dely Brahim A 240-unit vertical residential programme with commercial areas, services and underground parking. Open project" [ref=e175] [cursor=pointer]:
              - /url: /projects/dely-brahim-240-housing
              - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e176]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Dely Brahim, Algiers
                - heading "240 Free Promotional Housing with Commercial Areas - Dely Brahim" [level=3]:
                  - generic:
                    - generic: 240 Free Promotional Housing with
                  - generic:
                    - generic: Commercial Areas - Dely Brahim
                - paragraph:
                  - generic:
                    - generic: A 240-unit vertical residential programme with commercial areas,
                  - generic:
                    - generic: services and underground parking.
                - generic:
                  - generic: Open project
                  - img
          - group "9 / 11" [ref=e178]:
            - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. Current Bas Mazagran, Mostaganem 200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises. Open project" [ref=e179] [cursor=pointer]:
              - /url: /projects/bas-mazagran-200-38-housing
              - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e180]
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Bas Mazagran, Mostaganem
                - heading "200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran" [level=3]:
                  - generic:
                    - generic: 200 Assisted Housing and 38 Free
                  - generic:
                    - generic: Promotional Housing Units - Bas
                  - generic:
                    - generic: Mazagran
                - paragraph:
                  - generic:
                    - generic: A seven-block Mostaganem programme combining assisted and free
                  - generic:
                    - generic: promotional housing with commercial premises.
                - generic:
                  - generic: Open project
                  - img
          - group "10 / 11" [ref=e182]:
            - link "Current Bouraada Site, Reghaia, Algiers Province 250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution. Open project" [ref=e183] [cursor=pointer]:
              - /url: /projects/reghaia-bouraada-250-housing
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Bouraada Site, Reghaia, Algiers Province
                - heading "250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site" [level=3]:
                  - generic:
                    - generic: 250 Housing Units with Commercial
                  - generic:
                    - generic: Rental and Concierge Services -
                  - generic:
                    - generic: Bouraada Site
                - paragraph:
                  - generic:
                    - generic: A 250-unit Reghaia programme with commercial premises, concierge
                  - generic:
                    - generic: spaces and multi-block execution.
                - generic:
                  - generic: Open project
                  - img
          - group "11 / 11" [ref=e185]:
            - link "Current Boudouaou, Boumerdes 70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises. Open project" [ref=e186] [cursor=pointer]:
              - /url: /projects/boudouaou-70-10-housing
              - generic:
                - generic:
                  - generic: Current
                  - generic:
                    - img
                    - generic: Boudouaou, Boumerdes
                - heading "70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou" [level=3]:
                  - generic:
                    - generic: 70 Assisted Housing and 10 Free
                  - generic:
                    - generic: Promotional Housing Units -
                  - generic:
                    - generic: Boudouaou
                - paragraph:
                  - generic:
                    - generic: A Boumerdes programme of 70 assisted and 10 free promotional units
                  - generic:
                    - generic: with commercial/professional premises.
                - generic:
                  - generic: Open project
                  - img
        - generic [ref=e188]:
          - generic [ref=e189]:
            - button "Previous" [disabled]:
              - img
            - button "Next" [ref=e190]:
              - img
          - generic [ref=e193]: 01 / 11
    - region "From first coordination to handover." [ref=e195]:
      - generic [ref=e196]:
        - generic [ref=e197]:
          - generic [ref=e198]:
            - generic [ref=e199]: Delivery discipline
            - heading "From first coordination to handover." [level=2] [ref=e201]:
              - generic [ref=e203]: From first
              - generic [ref=e205]: coordination
              - generic [ref=e207]: to handover.
            - paragraph [ref=e208]:
              - generic [ref=e210]: A clear technical structure keeps each programme moving through planning,
              - generic [ref=e212]: engineering control, site execution and final delivery.
          - figure
        - generic [ref=e214]:
          - article [ref=e215]:
            - generic [ref=e216]: "01"
            - img [ref=e219]
            - heading "Pre-construction coordination" [level=3] [ref=e223]:
              - generic [ref=e225]: Pre-construction
              - generic [ref=e227]: coordination
            - paragraph [ref=e229]:
              - generic [ref=e231]: Scope, programme requirements,
              - generic [ref=e233]: quantities and site constraints are
              - generic [ref=e235]: aligned before work moves on site.
          - article [ref=e236]:
            - generic [ref=e237]: "02"
            - img [ref=e240]
            - heading "Engineering & TCE control" [level=3] [ref=e246]:
              - generic [ref=e248]: Engineering &
              - generic [ref=e250]: TCE control
            - paragraph [ref=e252]:
              - generic [ref=e254]: Engineers, architects and technical
              - generic [ref=e256]: managers coordinate secondary
              - generic [ref=e258]: trades, structures, MEP, roads and
              - generic [ref=e260]: networks.
          - article [ref=e261]:
            - generic [ref=e262]: "03"
            - img [ref=e265]
            - heading "Site execution" [level=3] [ref=e270]:
              - generic [ref=e272]: Site execution
            - paragraph [ref=e274]:
              - generic [ref=e276]: Construction managers and site
              - generic [ref=e278]: teams organise daily progress,
              - generic [ref=e280]: trade sequencing and material
              - generic [ref=e282]: movement.
          - article [ref=e283]:
            - generic [ref=e284]: "04"
            - img [ref=e287]
            - heading "Quality, safety & schedule monitoring" [level=3] [ref=e290]:
              - generic [ref=e292]: Quality, safety &
              - generic [ref=e294]: schedule
              - generic [ref=e296]: monitoring
            - paragraph [ref=e298]:
              - generic [ref=e300]: Delivery is tracked against
              - generic [ref=e302]: technical requirements, safety
              - generic [ref=e304]: rules, finish quality and contractual
              - generic [ref=e306]: milestones.
          - article [ref=e307]:
            - generic [ref=e308]: "05"
            - img [ref=e311]
            - heading "Handover & aftercare" [level=3] [ref=e314]:
              - generic [ref=e316]: Handover &
              - generic [ref=e318]: aftercare
            - paragraph [ref=e320]:
              - generic [ref=e322]: Final works are closed with
              - generic [ref=e324]: practical readiness, documentation
              - generic [ref=e326]: and attention to the long-term use
              - generic [ref=e328]: of each place.
    - generic [ref=e331]:
      - generic [ref=e332]:
        - generic [ref=e333]:
          - paragraph [ref=e334]: Project footprint
          - heading "Algeria & Beyond" [level=2] [ref=e335]:
            - generic [ref=e337]: Algeria & Beyond
        - paragraph [ref=e338]:
          - generic [ref=e340]: Eleven project locations across four highlighted wilayas, with a
          - generic [ref=e342]: dense Algiers delivery belt and active reach toward
          - generic [ref=e344]: Mostaganem and Boumerdes.
      - generic [ref=e345]:
        - button "All locations11" [pressed] [ref=e346]: All locations11
        - button "West Algiers / Tipaza5" [ref=e348]
        - button "Central Algiers2" [ref=e349]
        - button "East Algiers / Boumerdes2" [ref=e350]
        - button "Mostaganem1" [ref=e351]
        - button "Boumerdes1" [ref=e352]
      - generic [ref=e353]:
        - generic [ref=e354]:
          - region "Interactive map of Igloo Construction project locations across Algeria" [ref=e356]:
            - generic [ref=e357]:
              - region "Map" [ref=e358]
              - generic:
                - generic: Use Ctrl + scroll to zoom the map
              - button "Map marker" [ref=e359] [cursor=pointer]:
                - generic [ref=e360]:
                  - img [ref=e361]
                  - generic: "1"
              - button "Map marker" [ref=e364] [cursor=pointer]:
                - generic [ref=e365]:
                  - img [ref=e366]
                  - generic: "2"
              - button "Map marker" [ref=e369] [cursor=pointer]:
                - generic [ref=e370]:
                  - img [ref=e371]
                  - generic: "3"
              - button "Map marker" [ref=e374] [cursor=pointer]:
                - generic [ref=e375]:
                  - img [ref=e376]
                  - generic: "4"
              - button "Map marker" [ref=e379] [cursor=pointer]:
                - generic [ref=e380]:
                  - img [ref=e381]
                  - generic: "5"
              - button "Map marker" [ref=e384] [cursor=pointer]:
                - generic [ref=e385]:
                  - img [ref=e386]
                  - generic: "6"
              - button "Map marker" [ref=e389] [cursor=pointer]:
                - generic [ref=e390]:
                  - img [ref=e391]
                  - generic: "7"
              - button "Map marker" [ref=e394] [cursor=pointer]:
                - generic [ref=e395]:
                  - img [ref=e396]
                  - generic: "8"
              - button "Map marker" [ref=e399] [cursor=pointer]:
                - generic [ref=e400]:
                  - img [ref=e401]
                  - generic: "9"
              - button "Map marker" [ref=e404] [cursor=pointer]:
                - generic [ref=e405]:
                  - img [ref=e406]
                  - generic: "10"
              - button "Map marker" [ref=e409] [cursor=pointer]:
                - generic [ref=e410]:
                  - img [ref=e411]
                  - generic: "11"
            - generic [ref=e414]:
              - button "Zoom in" [ref=e415] [cursor=pointer]
              - button "Zoom out" [ref=e417] [cursor=pointer]
          - generic [ref=e419]:
            - generic [ref=e420]:
              - img [ref=e421]
              - generic [ref=e424]:
                - generic [ref=e425]: "11"
                - generic [ref=e428]: project pins
            - generic [ref=e429]:
              - img [ref=e430]
              - generic [ref=e432]:
                - generic [ref=e433]: "4"
                - generic [ref=e436]: highlighted wilayas
            - generic [ref=e437]:
              - img [ref=e438]
              - generic [ref=e442]:
                - generic [ref=e443]: "1"
                - generic [ref=e446]: north-coast delivery belt
        - complementary [ref=e447]:
          - paragraph [ref=e448]: Selected project
          - heading "Douaouda Housing" [level=3] [ref=e449]:
            - generic [ref=e451]: Douaouda Housing
          - paragraph [ref=e452]: Douaouda · Tipaza
          - paragraph [ref=e453]:
            - generic [ref=e455]: Assisted promotional housing in Douaouda with
            - generic [ref=e457]: professional premises, exterior works and TCE
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
            - generic [ref=e481]: Let’s discuss the next
            - generic [ref=e483]: durable programme.
          - paragraph [ref=e484]:
            - generic [ref=e486]: Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site
            - generic [ref=e488]: delivery.
        - generic [ref=e489]:
          - generic [ref=e490]: Project discussion
          - link "Email Igloo" [ref=e491] [cursor=pointer]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e492]: Email Igloo
            - img [ref=e493]
          - link "Call Algeria office" [ref=e496] [cursor=pointer]:
            - /url: tel:+213542819461
            - generic [ref=e497]: Call Algeria office
            - img [ref=e498]
      - generic [ref=e500]:
        - generic [ref=e501]:
          - heading "Office" [level=3] [ref=e502]
          - generic [ref=e503]:
            - img [ref=e504]
            - generic [ref=e507]:
              - generic [ref=e509]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem –
              - generic [ref=e511]: Alger
        - generic [ref=e512]:
          - heading "Contact" [level=3] [ref=e513]
          - generic [ref=e514]:
            - link "+213 542 819 461" [ref=e515] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e516]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e518] [cursor=pointer]:
              - /url: tel:+905424795700
              - img [ref=e519]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e521] [cursor=pointer]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e522]
              - text: info@igloogroupe.com
        - generic [ref=e525]:
          - heading "Navigation" [level=3] [ref=e526]
          - generic [ref=e527]:
            - link "Home" [ref=e528] [cursor=pointer]:
              - /url: /
            - link "Company" [ref=e529] [cursor=pointer]:
              - /url: /about
            - link "Projects" [ref=e530] [cursor=pointer]:
              - /url: /projects
            - link "Proof" [ref=e531] [cursor=pointer]:
              - /url: /#proof
            - link "Process" [ref=e532] [cursor=pointer]:
              - /url: /#services
            - link "Contact" [ref=e533] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e534]:
        - paragraph [ref=e535]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e536]:
          - generic [ref=e538]: Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery
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