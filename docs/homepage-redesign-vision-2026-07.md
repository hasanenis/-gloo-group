# Igloo Construction Homepage Redesign Vision

**Tarih:** 5 Temmuz 2026  
**Kapsam:** Ana sayfa icin derin arastirma, gorsel yon, Imagegen konseptleri ve uygulanabilir teknik plan  
**Proje:** SARL Igloo Yapi Construction - Vite + React + TypeScript frontend

---

## 1. Yonetici Ozeti

Igloo ana sayfasi zaten dogru bir yonde: tam ekran medya hero, siyah manifesto, proje vitrini, hakkimizda, istatistik ve guclu footer. Ancak mevcut deneyim henuz "goz alici premium insaat firmasi vitrini" seviyesine tam oturmuyor. En buyuk firsatlar:

1. **Hero daha guclu olmali.** Ilk viewport markayi, faaliyet alanini ve guveni aninda anlatmali. Gorsel iyi, fakat tipografi ve trust facts daha iddiali kurulabilir.
2. **Kaniti daha erken gostermek gerekiyor.** Konut adedi, yil, proje sayisi, lokasyon kapsami ve kalite/surec sinyalleri hero/manifesto cevresinde gorunmeli.
3. **About + Stats daginikligi toparlanmali.** Buyuk bosluklar ve scroll-trigger opacity davranislari tam sayfa snapshot'ta zayif algi yaratabiliyor. Bilgi daha kompakt ve taranabilir olmali.
4. **Ana sayfa 6 ana blokta kalmali.** Premium mimari/insaat siteleri az bolum, buyuk tipografi, guclu fotograf ve gercek proje kanitiyla ilerliyor.
5. **Teknik olarak yeni kutuphane gerekmiyor.** Repo kurallariyla uyumlu en iyi yol: React 19, Tailwind v4, GSAP/ScrollTrigger, Lenis, shared UI primitives, Radix, cva/cn, lucide-react, mevcut i18n ve `usePrefersReducedMotion`.

Onerilen ana sayfa slogani:

> **Building tomorrow. Made to last.**

Fransizca karsiligi:

> **Construire demain. Fait pour durer.**

---

## 2. Kullanilan Arastirma Kaynaklari

### Sektor ve pazar

- Deloitte 2026 Engineering and Construction Industry Outlook  
  https://www.deloitte.com/us/en/insights/industry/engineering-and-construction/engineering-and-construction-industry-outlook.html
- McKinsey - The next normal in construction PDF  
  https://www.mckinsey.com/~/media/McKinsey/Industries/Capital%20Projects%20and%20Infrastructure/Our%20Insights/The%20next%20normal%20in%20construction/The-next-normal-in-construction.pdf
- World Bank - Algeria urban population data  
  https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=DZ
- Housing Finance Africa - Algeria housing profile PDF  
  https://www.housingfinanceafrica.org/wp-content/uploads/2025/03/ALGERIA.pdf
- APS - AADL housing programme reference  
  https://www.aps.dz/en/presidency-news/mi7nr94d-president-tebboune-lays-foundation-stone-for-8050-aadl-housing-unit-project

### UX, performans ve erisilebilirlik

- Nielsen Norman Group - Homepage Design: 5 Fundamental Principles  
  https://www.nngroup.com/articles/homepage-design-principles/
- Nielsen Norman Group - Trustworthiness in Web Design  
  https://www.nngroup.com/articles/trustworthy-design/
- web.dev - Optimize Largest Contentful Paint  
  https://web.dev/articles/optimize-lcp
- W3C WCAG 2.2 - Animation from Interactions  
  https://www.w3.org/TR/WCAG22/
- W3C - Pause, Stop, Hide  
  https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
- MDN - prefers-reduced-motion  
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion

### Rakip ve referans siteler

- Skanska  
  https://www.skanska.com/us/en
- Turner Construction  
  https://www.turnerconstruction.com/
- VINCI Construction  
  https://vinci-construction.com/en/
- Webuild Group  
  https://www.webuildgroup.com/en/
- ZHA Architects  
  https://www.zha.com/
- BIG - Bjarke Ingels Group  
  https://big.dk/
- BAT Architecture  
  https://bat.archi/
- Statom Group  
  https://statom.co.uk/

---

## 3. Arastirma Bulgulari

### 3.1 Insaat sektoru mesajlasmasi

Deloitte'in 2026 gorunumu insaat firmalarinin maliyet, tedarik, is gucu, marj ve takvim baskilariyla ayni anda mucadele ettigini gosteriyor. Bu, ana sayfa tasariminda "guzel fotograf" kadar **surec disiplini, takvim kontrolu, saha koordinasyonu ve malzeme guvenilirligi** anlatilmasi gerektigi anlamina gelir.

McKinsey raporu insaat sektorunde musteri odaklilik, markalasma, teknoloji yatirimi, endustrilesme ve deger zinciri kontrolunun one ciktigini vurguluyor. Igloo icin bu bulgu su tasarim kararina donusmeli:

- "Biz muteahhitiz" demek yerine "koordineli teslimat ortagiyiz" demek.
- Sadece bitmis binalar degil, planlama, muhendislik, saha, kalite ve teslim surecini gostermek.
- Projeleri fotografla beraber veriyle sunmak: lokasyon, kapsam, durum, yil, is tipi.

Cezayir kaynaklari konut ve kentsel gelisimin hala stratejik bir alan oldugunu gosteriyor. Igloo'nun Algiers merkezli konut ve mixed-use odagi, ana sayfada yerel uzmanlik avantajina cevrilmeli:

- "Building Algeria. For Algeria."
- "Algiers-based delivery partner."
- Proje lokasyonlari ve wilaya kapsami.

### 3.2 UX ve guven sinyalleri

NN/g homepage prensipleri ana sayfanin basit, amaci net, orneklerle zengin ve eyleme yonelten bir sayfa olmasi gerektigini soyluyor. Igloo icin karsiligi:

- Ilk ekranda kim oldugu, ne yaptigi ve nereye hizmet verdigi net olmah.
- Proje ornekleri "proof" olarak erken gelmeli.
- About metni uzun anlatim degil, guven veren ozet + daha fazla bilgi linki olmali.
- CTA ikiye ayrilmali: `Explore Projects` ve `Contact Team`.

NN/g guven arastirmasi tasarim kalitesi, acik bilgi, guncel/eksiksiz icerik ve dis dunya baglantilarinin guven olusturdugunu belirtiyor. Bu nedenle footer ve contact alaninda adres, telefon, e-posta, faaliyet kapsami, resmi/company facts ve proje verisi saklanmamali.

### 3.3 Performans ve erisilebilirlik

Ana sayfada hero gorseli veya video LCP adayidir. web.dev, LCP gorselinin gec yuklenmemesi gerektigini vurgular. Bu tasarimda:

- Hero video kullanilacaksa poster ve ilk kare optimize edilmeli.
- Mobilde gerekirse video yerine statik `picture`/poster ile baslanmali.
- LCP gorseline lazy-load uygulanmamali.
- Remote media icin boyut, preload ve poster stratejisi netlestirilmeli.

WCAG ve MDN hareket hassasiyeti icin `prefers-reduced-motion` destegini one cikarir. Repo zaten `usePrefersReducedMotion` ve Lenis disable davranisina sahip. Yeni tasarim:

- GSAP timeline'larini `prefersReducedMotion` ile kapatmali veya statik final state'e almali.
- Otomatik hareket eden slider/video 5 saniyeyi asiyorsa pause/stop/hide mekanizmasi dusunmeli.
- Scroll-trigger reveal'ler icerigi opacity 0'a mahkum etmemeli; reduced-motion ve JS failure durumunda metin okunur kalmali.

---

## 4. Mevcut Ana Sayfa Denetimi

Canli Playwright kontrolu:

- Desktop screenshot: `outputs/homepage-redesign/current-home-clean-desktop-1440.png`
- Mobile screenshot: `outputs/homepage-redesign/current-home-clean-mobile-390.png`
- Reduced-motion desktop screenshot: `outputs/homepage-redesign/current-home-reduced-motion-desktop-1440.png`

Olcumler:

- `document.title`: Igloo Construction
- `main section` sayisi: 9 DOM section gorunuyor; bunun bir bolumu nested section tekrarindan geliyor.
- Desktop body height: yaklasik 5595 px
- Mobile body height: yaklasik 6109 px
- H1 metninde encoding sorunu gorunuyor: `Lâ€™empreinte...`

Gozlemler:

- Hero gorseli guclu olabilir, ama headline marka/insaat kategorisini yeterince sahiplenmiyor.
- Mevcut Fransizca headline encoding bozuk gorunuyor.
- Project carousel erken geliyor ve dogru strateji; ancak kart gorselleri kalite olarak karisik.
- About alaninda scroll-trigger snapshot davranisi nedeniyle buyuk bos alan algisi olusabiliyor.
- StatsGrid ayri ve gec bir bolum olarak kaliyor; bu sayilar daha erken guven sinyali olmali.
- Footer iyi bir CTA alanina sahip; daha planli contact action listesiyle guclendirilebilir.

---

## 5. Gorsel Strateji

### Tasarim karakteri

Igloo icin en dogru yon "premium mimari editorial + pratik insaat teslimati" karisimi:

- **Premium taraf:** buyuk tipografi, full-bleed fotograf, siyah/beyaz kontrast, az ama guclu cumle.
- **Insaat tarafi:** saha disiplini, takvim, kalite, is guvenligi, koordinasyon, proje kapsami.
- **Yerel taraf:** Algiers merkezli kimlik, Cezayir haritasi/footprint, wilaya kapsami, konut/mixed-use uzmanligi.

### Renk

- Ana zemin: `#ffffff`, `#faf9f4`, `#0a0a0a`
- Marka kirmizisi: `#c22026`, `#e82a2e`
- Yardimci tonlar: beton gri, steel gray, muted black, off-white
- Kacinilacaklar: tek renkli bej tema, kurumsal koyu mavi dominasyonu, mor/mavi gradient, dekoratif orb/blob.

### Tipografi

Oneri:

- Ana UI ve basliklar: `TWK Lausanne` / mevcut `--font-nav` veya tek guclu sans sistem.
- Serif sadece kontrollu vurgu olarak kullanilmali; hero ana sistemde sans-serif daha insaat/premium his verir.
- `Great Vibes` ana sayfa icin kaldirilabilir veya hic kullanilmamalidir.

---

## 6. Onerilen Ana Sayfa Akisi

### 1. Hero - "Building tomorrow. Made to last."

Amac: Ilk 3 saniyede kategori, guven ve estetik etki.

Icerik:

- Full-bleed kaliteli proje/insaat gorseli veya optimize video.
- Buyuk headline: `Building tomorrow. Made to last.`
- Alt metin: `Residential and mixed-use projects delivered with engineering control, site discipline, and long-term quality across Algeria.`
- CTA: `Explore Projects`, ikincil `Contact Team`.
- Trust facts: `Since 2018`, `11 projects`, `2500+ housing units`, `Algiers-based`, `Qualified & Classified Contractor`.
- Dikey scroll indicator ve video pause/mute butonu.

### 2. Manifesto + Metrics

Amac: Igloo'nun tek cumlelik pozisyonunu kurmak.

Metin:

> We build more than structures. We build trust for generations.

Metrics:

- `8+` years active
- `11` projects in portfolio
- `2500+` housing units delivered
- `4` wilayas covered

Not: Bu bolum StatsGrid'i ayri bolum olmaktan cikarip guveni daha erken verir.

### 3. Selected Projects

Amac: Soyut vaatleri gercek proje kanitina cevirmek.

Yapi:

- 3 kart desktop, 1.15 kart mobile swipe.
- Filtre chipleri: `All`, `Completed`, `Current`, `Residential`, `Mixed-use`.
- Her kart: durum, lokasyon, proje adi, kapsam, yil/durum, CTA.
- En iyi gorseller one cikarilmali; zayif santiye fotograflari liste kartlarinda kullanilmamali.

### 4. Process / Delivery Discipline

Amac: Insaat firmasi farkini anlatmak.

Adimlar:

1. Planning & Design Coordination
2. Engineering & Quantity Control
3. Site Execution
4. Quality, Safety & Schedule Monitoring
5. Handover & Aftercare

Teknik UI:

- Desktop'ta yatay process rail.
- Mobilde accordion veya compact list.
- Ikonlar lucide-react ile: `ClipboardCheck`, `DraftingCompass`, `HardHat`, `CalendarCheck`, `KeyRound`.

### 5. About / Footprint

Amac: Yerel uzmanlik ve kurumsal guven.

Yapi:

- Sol: "Building Algeria. For Algeria." kisa paragraf.
- Sag: Cezayir footprint gorseli. Bu gorsel soyut olmamali; `src/data/projects.ts` lokasyonlarindan gelen 11 proje pinini kullanmali.
- Gorsel kural: ana temsil full Algeria silhouette olmali. Projelerin cogu Algiers cevresinde toplandigi icin canli UI'da hover/popover veya opsiyonel kuzey kiyisi inset/zoom dusunulebilir; ancak dokuman ve homepage ilk bakista Cezayir seklini net vermeli.
- Highlight edilecek kapsama: Tipaza, Algiers, Mostaganem, Boumerdes.
- Cluster etiketleri: Mostaganem, West Algiers / Tipaza, Central Algiers, East Algiers / Boumerdes.
- Stil: referans gorseldeki gibi acik gri topo/contour dokusu, kirmizi bolge vurgusu, kirmizi pinler, hafif paralel/isometrik aci.
- Madde kanitlari: headquartered in Algiers, 11 project pins, 4 wilayas, residential/mixed-use expertise, coordinated engineering team.
- Credential chip: `Professional Qualification and Classification Certificate - Category 6`. Bunu buyuk slogan olarak degil, kucuk ve resmi bir guven sinyali olarak sun.
- Team proof: qualified building manager, 3 engineers, 2 architects, construction managers, HR, accountant, buyer, and site staff. Bunu tam liste olarak degil, `Qualified team structure` gibi kisa bir destek satiri olarak kullan.
- Duzeltilen asset: `outputs/homepage-redesign/project-footprint-algeria.png` ve `outputs/homepage-redesign/project-footprint-algeria.svg`.

Teknik karar:

- Runtime icin agir harita motoru kullanma. MapLibre/Leaflet/deck.gl bu editorial homepage gorseli icin fazla agir ve fazla "map app" hissi verir.
- En dogru yol: `d3-geo` + `topojson-client` + SVG + CSS/GSAP 3D illusion.
- Boundary data icin geoBoundaries ADM1 kullan; `gbOpen/DZA/ADM1` kaynagi ODbL 1.0 lisansi bildirir. GADM ticari lisans sebebiyle onerilmez.
- Proje marker kaynagi: `src/data/projectMap.ts`.

### 6. Contact / Footer CTA

Amac: Ziyaretciyi dogrudan aksiyona tasimak.

Yapi:

- Buyuk siyah CTA bandi: `Let's build what lasts together.`
- Email, Algeria phone, Turkey phone, office location.
- Small credential line: `Professional Qualification Certificate - Classification No. 6`.
- `mailto:` ve `tel:` aksiyonlari.
- `Download Brochure` butonu ileride PDF brochure varsa eklenebilir; su an yoksa gizli tutulmali.

---

## 7. Imagegen Konseptleri

### Desktop konsept

Dosya:

`outputs/homepage-redesign/igloo-homepage-imagegen-concept.png`

Notlar:

- Gorsel yon dogru: buyuk hero, trust facts, manifesto, selected projects, process, footprint, footer CTA.
- Generative mockup uzerindeki proje adlari, metrikler, e-posta ve adres gibi metinler final icerik degildir.
- Uygulamada gercek repo verileri kullanilmali: `companyProfile`, `projects`, `projectContent`.

### Mobile konsept

Dosya:

`outputs/homepage-redesign/igloo-homepage-imagegen-mobile-concept.png`

Notlar:

- Mobil ilk viewport daha net: logo, phone/language/menu ikonlari, buyuk headline, CTA.
- Proje kartlari mobile swipe olarak dogru.
- Process alani mobilde list/accordion olarak daha ergonomik.

### Kullanilan ana Imagegen prompt yonu

Kisa ozet:

> Premium construction portfolio homepage for SARL Igloo Yapi Construction, black/white/red editorial identity, full-bleed building imagery, huge headline, manifesto, selected projects, process proof, Algeria footprint, contact footer, practical React/Tailwind/GSAP-ready UI.

---

## 8. Teknik Uygulama Kurallari

Repo kurallarina gore yeni homepage tasarimi icin onerilen kutuphaneler:

- **React 19 functional components:** mevcut pattern korunacak.
- **Tailwind CSS v4:** layout ve styling icin ana yol.
- **GSAP + @gsap/react + ScrollTrigger:** hero reveal, manifesto word reveal, project card parallax, process reveal.
- **Lenis:** smooth scroll mevcut provider uzerinden.
- **`usePrefersReducedMotion`:** tum animasyonlarda zorunlu guard.
- **lucide-react:** process ikonlari, arrow, phone, mail, map, calendar.
- **Radix primitives:** mobile menu, accordion/process disclosure, tooltip/select gerekiyorsa.
- **Shared UI primitives:** `Button`, `Badge`, `Card`, `IconButton`, `SectionHeader`, `Tabs`, `Tooltip`.
- **cva + cn:** variant gereken yeni shared component varsa.
- **i18n:** shared/detail stringlerde `useLocale()` ve localized content akisi.
- **Swiper/CardCarousel:** proje carousel'i icin mevcut `CardCarousel` yeterli.

Yeni dependency onerilmiyor.

---

## 9. Uygulama Planı

### Faz 1 - Icerik ve temel hero

- Hero copy encoding sorununu duzelt.
- Hero headline'i kategoriye daha net bagla.
- Hero trust facts ekle.
- Video/poster/LCP stratejisini kontrol et.

### Faz 2 - Manifesto + metrics birlesimi

- `ManifestoSection` icine metrics rail ekle.
- `StatsGrid` ayri bolum olmaktan cikar veya daha sonra detay sayfasina tasinabilir.
- Metrics counter animasyonlari reduced-motion uyumlu olmali.

### Faz 3 - Projects vitrini

- `FeaturedProjects` kartlarinda en iyi gorselleri sec.
- Kartlarda status/location/scope okunabilirligini artir.
- Mobile carousel layout kontrolu yap.

### Faz 4 - Process bolumu

- Yeni `ProcessSection` component'i ekle.
- Desktop yatay rail, mobile accordion/list.
- Ikonlar lucide-react.
- Metinler en/fr i18n ile yazilmali.

### Faz 5 - About footprint + footer CTA

- About metnini kisalt.
- Cezayir/Algiers footprint visual modu ekle.
- Footer CTA aksiyonlarini netlestir.

### Faz 6 - QA

- `npm run lint`
- `npm run build`
- Playwright snapshot:
  - `/`
  - `/projects`
  - bir `/projects/:slug`
  - `/bat-demo/projects`
- Desktop ve mobile viewport kontrolu.
- `?edit=1` editor shell kontrolu.
- Reduced-motion kontrolu.

---

## 10. Basari Kriterleri

Tasarim basarili sayilirsa:

- Ilk viewport tek basina "Igloo kimdir, ne yapar, nerede calisir" sorularini yanitlar.
- 5-6 ana bolumden fazlasina ihtiyac kalmaz.
- Proje kartlari guven verir; zayif fotograf hissi azalir.
- About metni daha kisa ama daha etkili olur.
- Sayilar ve surec, vaatleri destekler.
- Animasyon kapansa bile sayfa okunabilir kalir.
- Mobile'da CTA, proje kartlari ve contact aksiyonlari kolay kullanilir.
- Performans tarafinda hero LCP kontrol altindadir.

---

## 11. Son Karar

Igloo icin en dogru ana sayfa, "mimari portfolyo gibi guzel" ama "insaat firmasi gibi guvenilir" bir deneyim olmali. Tasarim cilasi tek basina yeterli degil; saha disiplini, teslimat yetkinligi, proje kaniti ve yerel guven ayni anda gorunmeli.

Onerilen final akisi:

```text
Hero
Manifesto + Metrics
Selected Projects
Process / Delivery Discipline
About + Algeria Footprint
Contact Footer
```

Bu akisin mevcut repo stack'iyle uygulanmasi mumkun; yeni kutuphane eklemeden, mevcut animasyon ve UI sistemini daha stratejik kullanarak ilerlemek en dogru yoldur.
