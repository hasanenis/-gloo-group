# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-qa.spec.ts >> layout snapshot: home @ 1440x900
- Location: tests\e2e\site-qa.spec.ts:48:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

Timeout: 15000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: home-1440x900.png

Call log:
  - Expect "toHaveScreenshot(home-1440x900.png)" with timeout 15000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 444452 pixels (ratio 0.35 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 472046 pixels (ratio 0.37 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 493054 pixels (ratio 0.39 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 344465 pixels (ratio 0.27 of all image pixels) are different.
  - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 403144 pixels (ratio 0.32 of all image pixels) are different.
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
      - generic [ref=e30]:
        - generic [ref=e31]: Crafting the future
        - generic [ref=e32]: Dreaming of the future
    - region "Company profile" [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]:
            - generic [ref=e38]: Company profile
            - heading "Built with expertise. Delivered with control." [level=2] [ref=e39]:
              - generic [ref=e42]: Built with expertise.
              - generic [ref=e45]: Delivered with control.
            - generic [ref=e47]:
              - paragraph [ref=e48]:
                - generic [ref=e50]: Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi
                - generic [ref=e52]: Construction works from Bir Khadem, Algiers, on residential and mixed-use
                - generic [ref=e54]: programmes across Algeria.
              - paragraph [ref=e55]:
                - generic [ref=e57]: The company holds a Professional Qualification and Classification Certificate,
                - generic [ref=e59]: Category 6, and operates with a qualified building manager, engineers,
                - generic [ref=e61]: architects, construction managers and site staff.
          - generic [ref=e62]:
            - generic [ref=e63]:
              - img [ref=e64]
              - generic [ref=e67]: Professional Qualification & Classification Certificate - Category 6
            - generic [ref=e70]:
              - img [ref=e71]
              - img [ref=e72]
              - img [ref=e73]
              - img [ref=e74]
              - img [ref=e75]
        - generic [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]:
              - generic [ref=e79]: "2018"
              - generic [ref=e82]: Established
            - generic [ref=e83]:
              - generic [ref=e84]: "11"
              - generic [ref=e85]:
                - generic [ref=e87]: Projects
                - generic [ref=e89]: delivered and
                - generic [ref=e91]: underway
            - generic [ref=e92]:
              - generic [ref=e93]: 2,500+
              - generic [ref=e94]:
                - generic [ref=e96]: Homes
                - generic [ref=e98]: delivered or
                - generic [ref=e100]: underway
          - generic [ref=e101]:
            - generic [ref=e102]:
              - img [ref=e103]
              - heading "Category 6 Contractor" [level=3] [ref=e106]:
                - generic [ref=e108]: Category 6 Contractor
            - generic [ref=e109]:
              - img [ref=e110]
              - heading "Multidisciplinary Team" [level=3] [ref=e114]:
                - generic [ref=e116]: Multidisciplinary
                - generic [ref=e118]: Team
            - generic [ref=e119]:
              - img [ref=e120]
              - heading "Residential & Mixed-use Expertise" [level=3] [ref=e124]:
                - generic [ref=e126]: Residential &
                - generic [ref=e128]: Mixed-use Expertise
    - generic [ref=e130]:
      - generic [ref=e132]:
        - generic [ref=e133]:
          - generic [ref=e134]: Selected work
          - generic [ref=e135]:
            - heading "Built evidence, not promises." [level=2] [ref=e136]:
              - generic [ref=e138]: Built evidence, not promises.
            - paragraph [ref=e139]:
              - generic [ref=e141]: A portfolio of housing, villas, commercial premises, roads and networks, shown through real project
              - generic [ref=e143]: scope and location proof.
        - link "See all projects" [ref=e145] [cursor=pointer]:
          - /url: /projects
      - group "Featured projects" [ref=e147]:
        - generic [ref=e149]:
          - group "1 / 11" [ref=e150]:
            - link "Douaouda housing project Completed Douaouda 300/500 Assisted Promotional Housing - Douaouda Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery. Open project" [ref=e151] [cursor=pointer]:
              - /url: /projects/douaouda-300-500-housing
              - img "Douaouda housing project" [ref=e152]
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
          - group "2 / 11" [ref=e154]:
            - link "Completed Sidi Abdallah - Mahalma 200/1200 Promotional Public Housing - Sidi Abdallah - Mahalma Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises. Open project" [ref=e155] [cursor=pointer]:
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
          - group "3 / 11" [ref=e157]:
            - link "Completed Staoueli 11/41 Villas and Network Works - Staoueli Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks. Open project" [ref=e158] [cursor=pointer]:
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
          - group "4 / 11" [ref=e160]:
            - link "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building. Completed Douira, Algiers Rahmania Commercial Centres - Douira Two commercial centres serving a 2,500-home residential programme in Douira, Algiers. Open project" [ref=e161] [cursor=pointer]:
              - /url: /projects/rahmania
              - img "Interior of a modern commercial unit with white walls, tiled floor, and recessed lighting, viewed through a black-framed glass partition. A worker is visible near a large window in the background, which shows another building." [ref=e162]
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
          - group "5 / 11" [ref=e164]:
            - link "Completed Said Hamdine, Bir Mourad Rais, Algiers Mixed Real Estate Complex with 202 Free Promotional Housing - Said Hamdine Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors. Open project" [ref=e165] [cursor=pointer]:
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
          - group "6 / 11" [ref=e167]:
            - link "Completed Rouiba 4 Promotional Villas and Network Works - Rouiba Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works. Open project" [ref=e168] [cursor=pointer]:
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
          - group "7 / 11" [ref=e170]:
            - link "Completed Sidi Benour, Algiers 50 Free Promotional Housing Units - Sidi Benour High-rise R+13 residential delivery within the Sidi Benour promotional housing programme. Open project" [ref=e171] [cursor=pointer]:
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
          - group "8 / 11" [ref=e173]:
            - link "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees. Current Dely Brahim, Algiers 240 Free Promotional Housing with Commercial Areas - Dely Brahim A 240-unit vertical residential programme with commercial areas, services and underground parking. Open project" [ref=e174] [cursor=pointer]:
              - /url: /projects/dely-brahim-240-housing
              - img "Night view of a contemporary mixed-use building with illuminated residential balconies, vibrant commercial storefronts, and a multi-level underground parking garage, alongside a street with moving cars and trees." [ref=e175]
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
          - group "9 / 11" [ref=e177]:
            - link "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground. Current Bas Mazagran, Mostaganem 200 Assisted Housing and 38 Free Promotional Housing Units - Bas Mazagran A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises. Open project" [ref=e178] [cursor=pointer]:
              - /url: /projects/bas-mazagran-200-38-housing
              - img "View of several multi-story residential buildings under construction, featuring concrete structural frames and red brick infill walls, with a clear blue sky overhead and a person walking in the foreground." [ref=e179]
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
          - group "10 / 11" [ref=e181]:
            - link "Current Bouraada Site, Reghaia, Algiers Province 250 Housing Units with Commercial Rental and Concierge Services - Bouraada Site A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution. Open project" [ref=e182] [cursor=pointer]:
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
          - group "11 / 11" [ref=e184]:
            - link "Current Boudouaou, Boumerdes 70 Assisted Housing and 10 Free Promotional Housing Units - Boudouaou A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises. Open project" [ref=e185] [cursor=pointer]:
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
        - generic [ref=e187]:
          - generic [ref=e188]:
            - button "Previous" [disabled]:
              - img
            - button "Next" [ref=e189]:
              - img
          - generic [ref=e192]: 01 / 11
    - region "From first coordination to handover." [ref=e194]:
      - generic [ref=e195]:
        - generic [ref=e196]:
          - generic [ref=e197]:
            - generic [ref=e198]: Delivery discipline
            - heading "From first coordination to handover." [level=2] [ref=e200]:
              - generic [ref=e202]: From first
              - generic [ref=e204]: coordination
              - generic [ref=e206]: to handover.
            - paragraph [ref=e207]:
              - generic [ref=e209]: A clear technical structure keeps each programme moving through planning,
              - generic [ref=e211]: engineering control, site execution and final delivery.
          - figure
        - generic [ref=e213]:
          - article [ref=e214]:
            - generic [ref=e215]: "01"
            - img [ref=e218]
            - heading "Pre-construction coordination" [level=3] [ref=e222]:
              - generic [ref=e224]: Pre-construction
              - generic [ref=e226]: coordination
            - paragraph [ref=e228]:
              - generic [ref=e230]: Scope, programme
              - generic [ref=e232]: requirements, quantities and
              - generic [ref=e234]: site constraints are aligned
              - generic [ref=e236]: before work moves on site.
          - article [ref=e237]:
            - generic [ref=e238]: "02"
            - img [ref=e241]
            - heading "Engineering & TCE control" [level=3] [ref=e247]:
              - generic [ref=e249]: Engineering &
              - generic [ref=e251]: TCE control
            - paragraph [ref=e253]:
              - generic [ref=e255]: Engineers, architects and
              - generic [ref=e257]: technical managers coordinate
              - generic [ref=e259]: secondary trades, structures,
              - generic [ref=e261]: MEP, roads and networks.
          - article [ref=e262]:
            - generic [ref=e263]: "03"
            - img [ref=e266]
            - heading "Site execution" [level=3] [ref=e271]:
              - generic [ref=e273]: Site execution
            - paragraph [ref=e275]:
              - generic [ref=e277]: Construction managers and site
              - generic [ref=e279]: teams organise daily progress,
              - generic [ref=e281]: trade sequencing and material
              - generic [ref=e283]: movement.
          - article [ref=e284]:
            - generic [ref=e285]: "04"
            - img [ref=e288]
            - heading "Quality, safety & schedule monitoring" [level=3] [ref=e291]:
              - generic [ref=e293]: Quality, safety &
              - generic [ref=e295]: schedule
              - generic [ref=e297]: monitoring
            - paragraph [ref=e299]:
              - generic [ref=e301]: Delivery is tracked against
              - generic [ref=e303]: technical requirements, safety
              - generic [ref=e305]: rules, finish quality and
              - generic [ref=e307]: contractual milestones.
          - article [ref=e308]:
            - generic [ref=e309]: "05"
            - img [ref=e312]
            - heading "Handover & aftercare" [level=3] [ref=e315]:
              - generic [ref=e317]: Handover &
              - generic [ref=e319]: aftercare
            - paragraph [ref=e321]:
              - generic [ref=e323]: Final works are closed with
              - generic [ref=e325]: practical readiness,
              - generic [ref=e327]: documentation and attention to
              - generic [ref=e329]: the long-term use of each place.
    - generic [ref=e332]:
      - generic [ref=e333]:
        - generic [ref=e334]:
          - paragraph [ref=e335]: Project footprint
          - heading "Algeria & Beyond" [level=2] [ref=e336]:
            - generic [ref=e338]: Algeria & Beyond
        - paragraph [ref=e339]:
          - generic [ref=e341]: Eleven project locations across four highlighted wilayas,
          - generic [ref=e343]: with a dense Algiers delivery belt and active reach toward
          - generic [ref=e345]: Mostaganem and Boumerdes.
      - generic [ref=e346]:
        - button "All locations11" [pressed] [ref=e347]: All locations11
        - button "West Algiers / Tipaza5" [ref=e349]
        - button "Central Algiers2" [ref=e350]
        - button "East Algiers / Boumerdes2" [ref=e351]
        - button "Mostaganem1" [ref=e352]
        - button "Boumerdes1" [ref=e353]
      - generic [ref=e354]:
        - generic [ref=e355]:
          - region "Interactive map of Igloo Construction project locations across Algeria" [ref=e357]:
            - generic [ref=e358]:
              - region "Map" [ref=e359]
              - generic:
                - generic: Use Ctrl + scroll to zoom the map
              - button "Map marker" [ref=e360] [cursor=pointer]:
                - generic [ref=e361]:
                  - img [ref=e362]
                  - generic: "1"
              - button "Map marker" [ref=e365] [cursor=pointer]:
                - generic [ref=e366]:
                  - img [ref=e367]
                  - generic: "2"
              - button "Map marker" [ref=e370] [cursor=pointer]:
                - generic [ref=e371]:
                  - img [ref=e372]
                  - generic: "3"
              - button "Map marker" [ref=e375] [cursor=pointer]:
                - generic [ref=e376]:
                  - img [ref=e377]
                  - generic: "4"
              - button "Map marker" [ref=e380] [cursor=pointer]:
                - generic [ref=e381]:
                  - img [ref=e382]
                  - generic: "5"
              - button "Map marker" [ref=e385] [cursor=pointer]:
                - generic [ref=e386]:
                  - img [ref=e387]
                  - generic: "6"
              - button "Map marker" [ref=e390] [cursor=pointer]:
                - generic [ref=e391]:
                  - img [ref=e392]
                  - generic: "7"
              - button "Map marker" [ref=e395] [cursor=pointer]:
                - generic [ref=e396]:
                  - img [ref=e397]
                  - generic: "8"
              - button "Map marker" [ref=e400] [cursor=pointer]:
                - generic [ref=e401]:
                  - img [ref=e402]
                  - generic: "9"
              - button "Map marker" [ref=e405] [cursor=pointer]:
                - generic [ref=e406]:
                  - img [ref=e407]
                  - generic: "10"
              - button "Map marker" [ref=e410] [cursor=pointer]:
                - generic [ref=e411]:
                  - img [ref=e412]
                  - generic: "11"
            - generic [ref=e415]:
              - button "Zoom in" [ref=e416] [cursor=pointer]
              - button "Zoom out" [ref=e418] [cursor=pointer]
          - generic [ref=e420]:
            - generic [ref=e421]:
              - img [ref=e422]
              - generic [ref=e425]:
                - generic [ref=e426]: "11"
                - generic [ref=e429]: project pins
            - generic [ref=e430]:
              - img [ref=e431]
              - generic [ref=e433]:
                - generic [ref=e434]: "4"
                - generic [ref=e437]: highlighted wilayas
            - generic [ref=e438]:
              - img [ref=e439]
              - generic [ref=e443]:
                - generic [ref=e444]: "1"
                - generic [ref=e447]: north-coast delivery belt
        - complementary [ref=e448]:
          - paragraph [ref=e449]: Selected project
          - heading "Douaouda Housing" [level=3] [ref=e450]:
            - generic [ref=e452]: Douaouda Housing
          - paragraph [ref=e453]: Douaouda · Tipaza
          - paragraph [ref=e454]:
            - generic [ref=e456]: Assisted promotional housing in Douaouda with
            - generic [ref=e458]: professional premises, exterior works and TCE
            - generic [ref=e460]: delivery.
          - generic [ref=e461]:
            - img [ref=e462]
            - generic [ref=e465]: West Algiers / Tipaza
            - generic [ref=e466]: "|"
            - generic [ref=e467]: Completed
          - img "Douaouda housing project" [ref=e469]
          - link "Open project" [ref=e470] [cursor=pointer]:
            - /url: /projects/douaouda-300-500-housing
            - generic [ref=e471]: Open project
            - img [ref=e472]
    - generic [ref=e476]:
      - generic [ref=e477]:
        - generic [ref=e478]:
          - img "Igloo Construction" [ref=e479]
          - heading "Let’s discuss the next durable programme." [level=2] [ref=e480]:
            - generic [ref=e482]: Let’s discuss the next
            - generic [ref=e484]: durable programme.
          - paragraph [ref=e485]:
            - generic [ref=e487]: Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site
            - generic [ref=e489]: delivery.
        - generic [ref=e490]:
          - generic [ref=e491]: Project discussion
          - link "Email Igloo" [ref=e492] [cursor=pointer]:
            - /url: mailto:info@igloogroupe.com
            - generic [ref=e493]: Email Igloo
            - img [ref=e494]
          - link "Call Algeria office" [ref=e497] [cursor=pointer]:
            - /url: tel:+213542819461
            - generic [ref=e498]: Call Algeria office
            - img [ref=e499]
      - generic [ref=e501]:
        - generic [ref=e502]:
          - heading "Office" [level=3] [ref=e503]
          - generic [ref=e504]:
            - img [ref=e505]
            - generic [ref=e508]:
              - generic [ref=e510]: N° 8, Rue Krouch Slimane, Closan JeanLot n° 1-31, RDC, Bir Khadem –
              - generic [ref=e512]: Alger
        - generic [ref=e513]:
          - heading "Contact" [level=3] [ref=e514]
          - generic [ref=e515]:
            - link "+213 542 819 461" [ref=e516] [cursor=pointer]:
              - /url: tel:+213542819461
              - img [ref=e517]
              - text: +213 542 819 461
            - link "+90 542 479 5700" [ref=e519] [cursor=pointer]:
              - /url: tel:+905424795700
              - img [ref=e520]
              - text: +90 542 479 5700
            - link "info@igloogroupe.com" [ref=e522] [cursor=pointer]:
              - /url: mailto:info@igloogroupe.com
              - img [ref=e523]
              - text: info@igloogroupe.com
        - generic [ref=e526]:
          - heading "Navigation" [level=3] [ref=e527]
          - generic [ref=e528]:
            - link "Home" [ref=e529] [cursor=pointer]:
              - /url: /
            - link "Company" [ref=e530] [cursor=pointer]:
              - /url: /about
            - link "Projects" [ref=e531] [cursor=pointer]:
              - /url: /projects
            - link "Proof" [ref=e532] [cursor=pointer]:
              - /url: /#proof
            - link "Process" [ref=e533] [cursor=pointer]:
              - /url: /#services
            - link "Contact" [ref=e534] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e535]:
        - paragraph [ref=e536]: © 2026 Igloo Construction. All rights reserved.
        - paragraph [ref=e537]:
          - generic [ref=e539]: Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery
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