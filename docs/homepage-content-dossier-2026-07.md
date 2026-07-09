# Igloo Construction Ana Sayfa İçerik Dossier

**Tarih:** 7 Temmuz 2026  
**Kapsam:** Önce ana sayfa. Proje detay sayfaları bu dosyanın ardından proje proje ayrıca ele alınacak.  
**Amaç:** Kod yazmadan önce ana sayfada kullanılabilecek tüm gerçek bilgileri tek havuzda toplamak; ardından premium, kanıta dayalı ve yapay zeka kokmayan EN/FR metinler üretmek.

---

## 1. Kaynak Envanteri

### Yerel şirket ve proje kaynakları

- `İgloo project data/presentation sarl igloo yapi final 18.03.2026 eng.pptx`
  - Şirket profili, iletişim bilgileri, tamamlanan projeler, devam eden projeler ve proje fotoğrafları.
- `İgloo project data/extracted_data/slides_data.json`
  - PPTX'ten çıkarılmış ham slayt metinleri ve slayt görsel listeleri.
- `İgloo project data/Nouveau dossier/*.docx`
  - 11 proje için daha detaylı proje formları: lokasyon, sayı, kapsam, yapı tipi, durum, katkı ve teknik özellikler.
- `İgloo project data/analysis/*/analysis.md` ve `analysis.json`
  - Her proje fotoğrafının kalite, kompozisyon, kullanım yeri, risk ve caption analizi.
- `docs/project-photo-selection.md`
  - Proje fotoğrafları için seçilen/elenen görseller, hero/featured/gallery uygunluğu ve görsel kullanım notları.
- `src/data/projects.ts`
  - Aktif frontend proje listesi, temel summary/scope, görseller, şirket profili ve classification bilgisi.
- `src/data/projectMap.ts`
  - 11 proje pini, koordinat hassasiyeti, cluster, wilaya ve full Algeria/north inset pozisyonları.
- `public/geo/algeria-wilayas.json`
  - 48 wilaya polygon datası. Homepage footprint için tam Cezayir silüeti ve wilaya vurgusu üretilecek.

### Resmi ve benchmark kaynakları

- MTPIB / Journal Officiel PDF: `https://portail.mtpib.dz/pdf/jo/arr14-139.pdf`
  - Cezayir'de kamu işleri kapsamındaki şirketler için professional qualification and classification certificate sisteminin resmi bağlamı.
- Skanska: `https://www.skanska.com/group/en`
  - Kısa amaç cümlesi + sayısal business snapshot + world-class projects dili.
- Turner Construction: `https://www.turnerconstruction.com/who-we-are`
  - Construction services, technical expertise, integrity, safety, complex project delivery ve culture/commitments dili.
- VINCI: `https://www.vinci.com/en/actions-and-missions/our-missions/building-sustainable-living-environments/innovating-sustainable-construction`
  - Sustainable construction, technical systems, material performance ve long-term impact dili.
- Webuild: `https://www.webuildgroup.com/en/`
  - Global footprint, demanding markets, infrastructure growth, construction sites ve proof-led corporate language.
- Infinity Constructions: `https://infinityconstructions.com.au/`
  - Tier/category, accreditation, repeat trust, complex project proof, sector list ve “why rely on us” yapısı.
- `İgloo project data/extracted_data/reference_text.txt`
  - Infinity Opera Bar project page scrape: project page language, project facts, contract/client/architect fields, delivery challenge language.

---

## 2. Şirket Gerçekleri

- Resmi/marka adı: **SARL Igloo Yapi Construction**
- Faaliyet alanı: residential, mixed-use, commercial support spaces, villas, TCE/CES, VRD, secondary trades, roads and networks.
- Merkez/adres: **9 National Route 142, Section 01, GP 235, Ground Floor, Ouled Fayet, Algiers**
- Telefonlar: **+213 542 819 461**, **+90 542 479 5700**
- E-posta: **medatalay@gmail.com**
- Kuruluş: **2018**
- Yönetim: **Mr. Adem Talay**, civil engineering background.
- Portföy: **11 projects**
- Coğrafi kapsama: **4 wilayas**: Tipaza, Algiers, Mostaganem, Boumerdès.
- Konut kapsamı: Ana sayfa için güvenli ifade **2,500+ housing units connected to completed/current programmes**.
- Harita kapsamı: 11 proje pini, north-coast delivery belt, Algiers çevresinde yoğun cluster + Mostaganem outpost + Boumerdès east extension.

Kullanılacak ana konumlandırma:

- EN: **Algiers-based construction partner for residential and mixed-use programmes across Algeria.**
- FR: **Entreprise de construction basée à Alger pour des programmes résidentiels et mixtes en Algérie.**

---

## 3. Sertifika Notu

Kaynak metin: “It has a qualification certificate and classification n° 6.”

Ana sayfada kullanılacak anlam:

- EN: **Professional Qualification and Classification Certificate, Category 6**
- FR: **Certificat de qualification et de classification professionnelles, catégorie 6**

Ne anlatır:

- Bu bir “kalite puanı” gibi sunulmayacak.
- Devlet/ihale bağlamında mesleki yeterlilik ve sınıflandırma göstergesi olarak anlatılacak.
- Firma kapasitesi, teknik yapı, personel, ekipman/organizasyon ve kamu/özel proje yürütme güveniyle ilişkilendirilecek.

Ana sayfa kullanım yeri:

- Hero trust chip: **Category 6 certified contractor**
- About proof satırı: **Certified under Algeria’s professional qualification and classification framework.**
- Footer küçük güven satırı: **Professional Qualification and Classification Certificate, Category 6**

Kaçınılacak iddialar:

- “Highest quality level”
- “Government guaranteed”
- “Unlimited public works eligibility”
- “Best contractor in Algeria”
- “Officially superior to competitors”

---

## 4. Ekip ve Organizasyon Kanıtı

Kaynak PPTX şirket profili:

- qualified building manager
- three engineers
- two architects
- construction managers
- HR manager
- accountant
- buyer
- site staff
- supervised by engineers, architects and senior technicians

Ana sayfada uzun liste olarak değil, net güven satırlarıyla kullanılacak:

- EN: **A qualified technical structure led by a building manager, engineers, architects, construction managers and site teams.**
- FR: **Une structure technique qualifiée réunissant responsable bâtiment, ingénieurs, architectes, conducteurs de travaux et équipes de chantier.**

Process bölümünde kullanılacak ekip dili:

- Pre-construction coordination
- Engineering and TCE control
- Site execution
- Quality, safety and schedule monitoring
- Handover and aftercare

---

## 5. Ana Sayfa İçin Proje Kanıtları

### 1. Douaouda / Tipaza

- 300/500 assisted promotional housing programme.
- Professional premises integrated into residential blocks.
- R+8 residential buildings.
- F3/F4 housing typologies.
- TCE delivery including structure-to-finishes scope.
- Exterior works, roads and parking.
- Completed: 10.12.2019.
- Homepage angle: early proof of residential programme delivery near Tipaza with professional premises and sea-side urban context.

### 2. Sidi Abdallah / Algiers

- 200 units within a 1,200 public promotional housing programme.
- R+9 buildings.
- F3/F4 housing.
- Commercial and professional premises.
- TCES / secondary trades.
- Completed: 31.03.2022.
- Homepage angle: public housing delivery in a developing urban pole.

### 3. Staoueli / Algiers

- 11 villas within a 41-villa programme at Les Pastorales.
- R+2 individual villas.
- TCES + VRD.
- Completed: 31.05.2022.
- Homepage angle: standing residential villas with roads, networks and exterior works.

### 4. Rahmania / Douira, Algiers

- Two commercial centres inside a 2,500-housing-unit programme.
- Secondary trades / CES.
- Commercial, service, circulation and associated fit-out spaces.
- Distinctive central circulation and glass pyramid roof.
- Completed: 2025.
- Homepage angle: mixed residential ecosystem support, not only housing blocks.

### 5. Said Hamdine / Bir Mourad Rais, Algiers

- Mixed real estate complex.
- 5 residential blocks.
- 202 free promotional housing units.
- 3 levels of commercial space.
- 2 basement parking levels.
- Completed: 07.08.2023.
- Homepage angle: dense mixed-use urban delivery with parking, commerce and residential blocks.

### 6. Rouiba / Algiers

- 4 free promotional villas.
- TCE + VRD.
- Completed: 02.05.2023.
- Homepage angle: compact villa delivery with site access, exterior works and utility networks.

### 7. Sidi Benour / Mehelma, Algiers

- 50 units within a 362 free promotional housing programme.
- R+13 residential building.
- TCE + VRD.
- Completed/planned: 10.12.2025.
- Homepage angle: high-rise residential capability and phased delivery.

### 8. Dely Brahim / Algiers

- 240 free promotional housing units.
- Bois des Cars, Dely Brahim.
- 33-storey residential tower.
- Commercial areas, services and underground parking.
- TCE/CES + VRD.
- Current project in frontend status.
- Homepage angle: high-density vertical residential and mixed-use delivery.

### 9. Bas Mazagran / Mostaganem

- 200 assisted promotional housing + 38 free promotional housing units.
- 7 blocks.
- R+5 and R+9 buildings.
- Commercial premises.
- TCE + VRD.
- Planned completion: 16.10.2026.
- Homepage angle: western Algeria footprint beyond Algiers.

### 10. Reghaia / Algiers

- Remaining works for 250 location-sale housing units.
- Bouraâda, Réghaïa.
- 7 R+9 residential blocks.
- F3/F4 housing.
- Commercial premises and concierge spaces.
- TCE/CES.
- Frontend status currently current.
- Homepage angle: completion discipline on a multi-block residential programme.

### 11. Boudouaou / Boumerdès

- 70 assisted promotional housing + 10 free promotional housing units.
- 10 commercial/professional premises.
- 3 residential blocks: A/B R+8, C R+5.
- 4 units per floor; F3 70.33 m², F4 86.94 m².
- TCE/CES + site servicing + tertiary networks.
- Client: AADL.
- Planned completion: 25.12.2025.
- Homepage angle: eastward extension into Boumerdès with housing, professional premises and networks.

---

## 6. Benchmark Dil Prensipleri

Benchmarklerden alınacak yapı:

- Büyük iddia kısa olmalı; açıklama kanıtla gelmeli.
- “We build…” kalıbı kullanılabilir ama her cümlede tekrar edilmeyecek.
- Şirketi soyut anlatmak yerine sayı, lokasyon, kapsam ve süreçle desteklemek gerekiyor.
- Güven dili: integrity, safety, technical expertise, disciplined execution, long-term value, resilient places, project delivery.
- Proje kartı dili: title + location + status + scope + one proof sentence.
- Sertifika ve metrikler slogan değil, güven chip/proof satırı olmalı.

Kaçınılacak dil:

- “Transforming dreams into reality”
- “Where possibilities are infinite”
- “Best-in-class”
- “World-class” gibi kanıtlanması zor iddialar.
- Aynı paragrafta “precision / discipline / quality / excellence” kelimelerini yığmak.
- Fazla şiirsel, kategori anlatmayan hero metinleri.

---

## 7. Mevcut Ana Sayfa Copy Sorunları

- Hero H1 mevcutta mojibake içeriyor: `Lâ€™empreinte...`.
- İlk viewport şirketin kategori, ölçek ve güven kanıtını hemen anlatmıyor.
- CTA görünür değil.
- Category 6 sertifikası erken ve net bir güven sinyali olarak yer almıyor.
- Manifesto ve stats ayrı; kanıt geç geliyor.
- `StatsGrid` ayrı bölüm olarak homepage akışını uzatıyor.
- `projectContent.generated.ts` içinde bazı cümleler İngilizce/Fransızca karışık ve tekrar eden kalıplar içeriyor.
- Footprint Map interaktif ama MapLibre kontrol UI’ları ve kuzey kıyı crop’u nedeniyle premium Algeria silhouette hissi zayıf.
- Footer iyi bir temas alanı ama hero ile aynı stratejik cümleyi tamamlamıyor.

---

## 8. Ana Sayfa Bölüm Matrisi

### Hero

- Görev: ilk 3 saniyede kategori + lokasyon + güven.
- EN H1: **Building for Algeria. Built to last.**
- FR H1: **Construire pour l’Algérie. Bâtir pour durer.**
- EN lead: **Residential and mixed-use programmes delivered with engineering control, site discipline and long-term construction quality across Algeria.**
- FR lead: **Des programmes résidentiels et mixtes réalisés avec maîtrise technique, discipline de chantier et qualité durable en Algérie.**
- CTA: Explore projects / Contact team.
- Trust facts: Est. 2018, 11 projects, 2,500+ housing units, 4 wilayas, Category 6 certified contractor.

### Manifesto + Metrics

- Görev: markanın tek cümlelik duruşunu ve kanıtlarını birleştirmek.
- EN statement: **We build the framework for durable everyday life.**
- FR statement: **Nous bâtissons le cadre d’une vie quotidienne durable.**
- Metin yönü: housing, commerce, services, roads, networks, site coordination.
- Metrikler: 2018, 11, 2,500+, 4.

### Featured Projects

- Görev: vaatleri gerçek proje kanıtına çevirmek.
- EN title: **Built evidence, not promises.**
- FR title: **Des références construites, pas des promesses.**
- Her kart: status, location, project type, proof-led summary.

### Delivery Process

- Görev: Igloo’nun farkını sadece bina görseliyle değil süreç disipliniyle anlatmak.
- 5 adım: Pre-construction coordination, Engineering & TCE control, Site execution, Quality/safety/schedule monitoring, Handover & aftercare.

### About

- Görev: şirket kimliği, sertifika, ekip yapısı ve Algiers merkezli güven.
- EN headline: **A qualified construction structure based in Algiers.**
- FR headline: **Une structure de construction qualifiée basée à Alger.**
- Proof: founded 2018, Category 6, technical team, residential/mixed-use.

### Footprint

- Görev: Cezayir silüetiyle gerçek lokasyon kanıtı.
- Gereken görsel dil: full Algeria silhouette, pale concrete/off-white, red wilaya highlights, project pins, subtle 3D/parallel depth.
- Interactivity: cluster tabs, pin hover/focus/click, selected project card.
- MapLibre controls kullanılmayacak.

### Footer

- Görev: son kurumsal güven + net temas.
- EN headline: **Let’s discuss the next durable programme.**
- FR headline: **Parlons du prochain programme durable.**
- Proof strip: Ouled Fayet / Algiers, Category 6, residential & mixed-use delivery.

---

## 9. Kullanılacak İddialar ve Sınırlar

Kullanılacak:

- Founded in 2018.
- Algiers-based.
- 11 project portfolio.
- 4 wilayas covered.
- 2,500+ housing units connected to portfolio/programmes.
- Professional Qualification and Classification Certificate, Category 6.
- Qualified technical structure with engineers, architects, construction managers and site staff.
- Residential, mixed-use, villas, commercial premises, roads and networks.

Kullanılmayacak:

- “Algeria’s leading construction company.”
- “Largest contractor.”
- “Guaranteed public tenders.”
- “Highest classification.”
- “All projects delivered with zero delay.”
- “International contractor” unless supported by a specific source.

---

## 10. EN/FR Copy Taslakları

### Hero

EN:

- Eyebrow: `SARL Igloo Yapi Construction`
- Title: `Building for Algeria. Built to last.`
- Lead: `Residential and mixed-use programmes delivered with engineering control, site discipline and long-term construction quality across Algeria.`
- Primary CTA: `Explore projects`
- Secondary CTA: `Contact team`

FR:

- Eyebrow: `SARL Igloo Yapi Construction`
- Title: `Construire pour l’Algérie. Bâtir pour durer.`
- Lead: `Des programmes résidentiels et mixtes réalisés avec maîtrise technique, discipline de chantier et qualité durable en Algérie.`
- Primary CTA: `Voir les projets`
- Secondary CTA: `Contacter l’équipe`

### Manifesto

EN:

- Title: `We build the framework for durable everyday life.`
- Body: `From housing blocks and villas to commercial premises, roads and networks, Igloo coordinates the trades that turn a programme into a place that works.`

FR:

- Title: `Nous bâtissons le cadre d’une vie quotidienne durable.`
- Body: `Des immeubles résidentiels aux villas, des locaux commerciaux aux voiries et réseaux, Igloo coordonne les corps de métier qui transforment un programme en lieu fonctionnel.`

### Process

EN:

- Title: `Delivery discipline from first coordination to handover.`
- Body: `A clear technical structure keeps each programme moving through planning, engineering control, site execution and final delivery.`

FR:

- Title: `Une discipline de livraison, de la coordination initiale à la réception.`
- Body: `Une structure technique claire accompagne chaque programme de la planification au contrôle d’exécution, jusqu’à la livraison.`

### About

EN:

- Title: `A qualified construction structure based in Algiers.`
- Body: `Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi Construction works from Ouled Fayet, Algiers, on residential and mixed-use programmes across Algeria.`

FR:

- Title: `Une structure de construction qualifiée basée à Alger.`
- Body: `Fondée en 2018 et dirigée par l’ingénieur en génie civil Adem Talay, SARL Igloo Yapi Construction intervient depuis Ouled Fayet, Alger, sur des programmes résidentiels et mixtes en Algérie.`

### Footprint

EN:

- Title: `Algeria & Beyond`
- Lead: `Eleven project locations across four highlighted wilayas, with a dense Algiers delivery belt and active reach toward Mostaganem and Boumerdès.`

FR:

- Title: `Algérie & au-delà`
- Lead: `Onze implantations de projets dans quatre wilayas mises en évidence, avec une forte concentration autour d’Alger et une présence vers Mostaganem et Boumerdès.`

### Footer

EN:

- Title: `Let’s discuss the next durable programme.`
- Lead: `Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site delivery.`

FR:

- Title: `Parlons du prochain programme durable.`
- Lead: `Échangez avec une équipe basée à Alger, expérimentée dans les programmes résidentiels et mixtes, les voiries, les réseaux et la coordination de chantier.`
