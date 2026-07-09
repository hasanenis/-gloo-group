# Igloo Construction — Site Audit & Rekabet Analizi
**Tarih:** 4 Temmuz 2026  
**Yöntem:** Canlı ekran görüntüsü + DOM analizi (sahte kaynak yok)

---

## 1. İncelenen Referans Siteler

| Site | URL | Tip | Screenshot |
|------|-----|-----|-----------|
| BAT Architecture | new.bat.archi | Mimari stüdyo (referansımız) | ✅ Çekildi |
| BIG — Bjarke Ingels | big.dk | Premium mimari | ✅ Çekildi |
| ZHA Architects | zha.com | Küresel mimari stüdyo | ✅ Çekildi |
| Skanska | skanska.com | Küresel inşaat firması | ✅ Çekildi |
| Soroubat (DZ) | groupesoroubat.com | MENA inşaat | ❌ Cloudflare bloğu |

---

## 2. Rakip Görsel Analiz

### 2.1 BAT Architecture — Homepage
**Kaynak:** `new.bat.archi` (canlı screenshot, ss_305418gc0)

**Gözlem:**
- **Hero:** Tam siyah arka plan. Merkeze hizalı, dev "Crafting Futures" başlığı. Hiç görsel yok. Sadece tipografi.
- **Nav:** Sol logo, sağ hamburger. 2 eleman. Dropdown yok.
- **2. bölüm:** Beyaz arka plan. Sol: büyük serif-olmayan paragraf metni (`~40px`). Sağ: tam bleed mimari render (%60-40 split).
- **3. bölüm:** Siyah arka plan. Merkeze hizalı büyük manifesto cümlesi: *"BAT is more than just an architecture firm; we are a community of creative thinkers"*
- **Toplam bölüm sayısı:** ~5-6

**Öne çıkan tasarım kararları:**
```
Hero → About Split → Manifesto (dark) → Projects → Contact
```

### 2.2 BAT Architecture — Project Detail (u16-house)
**Kaynak:** `new.bat.archi/projects/u16-house` (ss_3732sycjn, ss_8207fgczl)

**Gözlem:**
- **Hero başlık boyutu:** `IMPERCEPTIBLE TECTONICS` — tam viewport genişliğinde, büyük harf, ~120px+
- **Eyebrow:** `U16 HOUSE` sol üstte küçük caps
- **Alt bar:** CLIENT / AREA / LOCATION — yatay 3 sütun, küçük caps font
- **2. bölüm:** Sol: `U16 House` ~80px light font. Sağ: 2 sütun gövde metni (editöryal layout)
- **Tipografi sistemi:** Tek bir sans font ailesi, weight ve size ile hiyerarşi

### 2.3 BAT Architecture — Projects Grid
**Kaynak:** `new.bat.archi/projects` (ss_7825pdndp)

**Gözlem:**
- 3 sütun, tam bleed fotoğraflar
- Filtreler: sadece `MODE` + `TYPOLOGY` (2 eleman)
- Proje sayısı header'da gösteriliyor: `(25)`
- Kart üzerinde hiç overlay yok — hover'da görünür
- Tüm fotoğraflar profesyonel render veya yüksek kalite site fotoğrafı

### 2.4 BIG — Bjarke Ingels Group
**Kaynak:** `big.dk` (ss_3480j15ey)

**Gözlem:**
- **Layout tipi:** Sol: proje logosu (özel ikon) + proje adı + lokasyon. Sağ: büyük fotoğraf
- **Nav:** `ARCHITECTURE | INTERIORS | LANDSCAPE | PLANNING | PRODUCTS` — yatay liste, hiç dropdown
- Proje kartları dikey scroll ile sıralanmış — carousel yok
- Her proje kendi logosu/simgesiyle tanımlanmış (güçlü marka kaydı)

### 2.5 ZHA — Zaha Hadid Architects
**Kaynak:** `zha.com` (ss_1729bej4g)

**Gözlem:**
- **Hero:** Çakışan proje görselleri mosaic efekti — full bleed, animasyonlu slider
- **Başlık:** `Forever Advancing Architecture` sol alt, ~90px
- **Nav:** Şeffaf, çok sayıda link (8 item) — ama premium hissettirir çünkü font ve spacing mükemmel
- Navigasyon karmaşıklığı burada işe yarıyor çünkü firma büyüklüğü bunu hak ediyor

### 2.6 Skanska — Global İnşaat Firması
**Kaynak:** `skanska.com` (ss_223323fv4)

**Gözlem:**
- **Yaklaşım:** Kurumsal B2B — "Welcome to Skanska"
- **Hero:** Sol: başlık + subtext + 2 CTA butonu. Sağ: büyük "S" harf markası
- **Renk:** Koyu mavi + yeşil CTA — çok kurumsal
- **Mesaj:** "135+ years in the making" — güven geçmişe dayalı
- **Fark:** Render/mimari foto yok, soyut marka grafikleri var

---

## 3. Pattern Karşılaştırma Tablosu

| Özellik | BAT | BIG | ZHA | Skanska | **Igloo (şu an)** |
|---------|-----|-----|-----|---------|------------------|
| Hero tipi | Saf tipografi (siyah) | Yok (doğrudan içerik) | Full bleed foto mozaiği | Split (metin + marka grafik) | Video + küçük metin |
| Başlık boyutu | ~150px, merkez | N/A | ~90px, sol alt | ~70px, sol | ~55px, sol alt |
| Nav öğe sayısı | 2 (logo + hamburger) | 5 kategori | 8 link | 2 (logo + globe) | 7 link + dropdown'lar |
| Ana sayfa bölüm sayısı | 5-6 | ~3 | ~4 | ~3 | **16** |
| Staff homepage'de? | Hayır (ayrı sayfa) | Hayır | Hayır | Hayır | **Evet** |
| Testimonials? | Hayır | Hayır | Hayır | Hayır | **Evet (carousel)** |
| Video embed (YouTube)? | Hayır | Hayır | Hayır | Hayır | ~~Evet~~ (kaldırıldı) |
| Manifesto bölümü? | **Evet** (dark, centered) | Hayır | Hayır | Hayır | Hayır |
| Proje fotoğraf kalitesi | Render / pro | Pro | Render / pro | Marka grafik | **Karışık** |
| GSAP text animasyonu | **Evet** (line reveal) | Hayır | Hayır | Hayır | Hayır |
| Font sayısı | 1 | 1 | 1 | 1 | **4** |

---

## 4. Igloo'nun Kritik Eksikleri

### 4.1 🔴 Hero Zayıflığı
**Durum (gözlemlendi):** Hero başlığı ~55px ve video arka planı muğlak/düşük kontrastlı.  
**Benchmark:** BAT 150px+ merkezi tipografi — hiç görsel yok, sadece güç.  
**Ne yapılmalı:** Hero başlığı minimum 2x büyütülmeli. Metin tam ekrana hakim olmalı.

### 4.2 🔴 Sayfa 16 Bölüm — 2.5x Fazla
**Durum (DOM ölçüldü):** `document.querySelectorAll('section').length = 16`, toplam uzunluk `10,476px`  
**Benchmark:** BAT ~5 bölüm, BIG ~3, ZHA ~4, Skanska ~3  
**Ne yapılmalı:** Hedef yapı:
```
1. Hero          → Güçlü başlık + video/foto
2. Manifesto     → Siyah arka plan, büyük statement cümle
3. Projects      → BAT-grid (zaten var, iyileştirilecek)
4. Why Us        → Sayılar + kısa süreç (About + Stats birleştir)
5. Contact       → Mevcut footer yeterli
```

### 4.3 🟠 Font Sistemi Tutarsız
**Durum (index.css gözlemlendi):**
```css
--font-serif: "Playfair Display"   /* hero başlığında */
--font-script: "Great Vibes"       /* nerede kullanıldığı belirsiz */
--font-sans: "Roboto"              /* gövde */
--font-nav: "TWK Lausanne"         /* nav + editorial */
```
**Benchmark:** BAT tek font, BIG tek font, ZHA tek font.  
**Ne yapılmalı:** `TWK Lausanne` veya tek bir sans-serif üzerine konsolide et. Playfair Display ve Great Vibes kaldırılabilir veya en fazla 1 başlık font ailesi olarak tutulabilir.

### 4.4 🟠 Proje Fotoğraf Kalitesi Tutarsız
**Durum (gözlemlendi):** Bazı projeler şantiye ham fotoğrafı (düşük ışık, kötü açı), bazıları iyi.  
**Benchmark:** BAT, BIG, ZHA — her görsel yayın kalitesinde.  
**Ne yapılmalı:** En zayıf 3-4 fotoğrafı projelerden kaldır veya en iyisiyle değiştir. Listings'e zayıf fotoğraf hiç koyma.

### 4.5 🟠 Manifesto Bölümü Yok
**Durum:** Ana sayfada Igloo'nun kim olduğuna dair güçlü bir tek cümle yok.  
**Benchmark:** BAT — `"BAT is more than just an architecture firm; we are a community of creative thinkers"` — tam siyah ekran, devasa tip.  
**Ne yapılmalı:** `WhyChooseUs` bölümünü kaldır, yerine tek güçlü dark section koy:  
> *"Igloo ne inşaatçıdır ne de müteahhit — her iki dünyada da mükemmelleşmiş bir teslimat ortağı."*

### 4.6 🟡 Nav Karmaşıklığı Ölçekle Uyumsuz
**Durum:** 7 nav link + dropdown okları. Igloo henüz BIG, ZHA ölçeğinde değil.  
**Benchmark:** BAT sadece hamburger kullanıyor.  
**Ne yapılmalı:** Şu anki nav'ı koru ama dropdown oklarını kaldır (sayfa yok zaten), yalnızca `Projects` ve `Contact` aktif tutulabilir.

### 4.7 🟡 Staff Slider Homepage'de
**Durum:** 4 kişilik staff slider ana sayfada.  
**Benchmark:** BAT, BIG, ZHA — ekip üyeleri sadece ayrı `/team` sayfasında.  
**Ne yapılmalı:** Ana sayfadan çıkar. İleride `/team` sayfası açılırsa oraya taşı.

### 4.8 🟡 Testimonials Carousel
**Durum:** Accordion testimonial listesi + müşteri isimleri.  
**Benchmark:** Hiçbir premium mimari/inşaat sitesinde scrolling testimonial yok.  
**Ne yapılmalı:** Kaldır. Güven, projeler üzerinden kurulur.

### 4.9 🟡 GSAP Text Animasyonları Yok
**Durum:** Mevcut animasyonlar yalnızca opacity+y. Başlıklarda motion yok.  
**Benchmark:** BAT'ta hero başlığı clip-path line reveal ile geliyor, section heading'ler scroll ile açılıyor.  
**Ne yapılmalı:** Hero başlığına word-by-word clip-path reveal, statement bölümüne scrub opacity animasyonu, sayısal verilere counter animasyonu.

---

## 5. Teknik Frontier Kütüphane Analizi

### Mevcut Stack (çalışan)
| Kütüphane | Versiyon | Kullanım |
|-----------|----------|---------|
| GSAP | ^3.15.0 | ScrollTrigger parallax, page transition |
| @gsap/react | ^2.1.2 | useGSAP hook |
| Lenis | (SmoothScrollProvider) | Smooth scroll |
| Swiper | (CardCarousel) | Carousel |
| React 19 | — | SPA |
| Vite | — | Bundler |

### GSAP — Mevcut Kullanım vs Potansiyel

**Şu an kullanılan:**
- `ScrollTrigger` scrub parallax (hero image, editorial images)
- `gsap.fromTo` opacity+y reveal (`data-reveal`)
- `gsap.timeline` hero entry animation

**Kullanılmayan ama projeye uygun:**
| Effect | Teknik | Kullanım Yeri |
|--------|--------|--------------|
| **Line clip-reveal** | `yPercent: 110 → 0` + overflow:hidden wrapper (SplitText gerektirmez) | Hero başlıkları, section H2'ler |
| **Word stagger reveal** | JS ile split + stagger | Ana sayfa manifesto |
| **Scrub word opacity** | ScrollTrigger scrub + per-word opacity | Statement section |
| **Counter animation** | `gsap.to(obj, {value: N})` | İstatistik sayıları |
| **Horizontal text scroll** | GSAP marquee loop | Proje kategorileri ticker |

**Not:** `SplitText` plugin Club GSAP lisansı gerektirir (ücretli). Bizde yok, gerekmiyor — JS ile split yeterli.

### İlave Edilebilecek (küçük boyutlu)
| Kütüphane | Boyut | Amaç | Öncelik |
|-----------|-------|------|---------|
| `@studio-freight/tempus` | ~1kb | rAF loop manager (Lenis ile koordineli GSAP) | Düşük |
| `motion` (Framer Motion lite) | — | Zaten GSAP var, gerekmez | — |

---

## 6. Önerilen Ana Sayfa Yapısı

```
┌─────────────────────────────────────────────────────┐
│  SECTION 1: HERO                                    │
│  - Tam ekran video                                  │
│  - Başlık: 120px+, word-by-word reveal              │
│  - 1 satır subtitle                                 │
│  - Scroll indicator                                 │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  SECTION 2: MANIFESTO (siyah arka plan)             │
│  - 1 güçlü cümle, merkezi, ~80px                   │
│  - Stats: 8+ yıl | 11+ proje | [X] konut           │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  SECTION 3: SEÇILMIŞ PROJELER                       │
│  - BAT-grid (zaten var)                             │
│  - 6 proje, "All Projects →" linki                 │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  SECTION 4: HAKKIMIZDA + SÜREÇ                     │
│  - Sol: kısa paragraf (About şu an)                 │
│  - Sağ: 3 adım (brief → execution → delivery)       │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  SECTION 5: FOOTER / CONTACT                        │
│  - Mevcut footer yeterli                            │
└─────────────────────────────────────────────────────┘
```

**Kaldırılacaklar:** `StaffSlider`, `Testimonials`, `WhyChooseUs` (mevcut haliyle), `StatsGrid` (Section 2'ye taşınır)

---

## 7. Project Detail — Fark Analizi

### BAT u16-house vs Igloo Rahmania

| Element | BAT u16-house | Igloo Rahmania |
|---------|--------------|---------------|
| Hero başlık boyutu | ~120px, full width | ~60px, sol alt |
| Hero metin casing | ALL CAPS | Mixed |
| Eyebrow | `U16 HOUSE` (sol üst, küçük caps) | `COMMERCIAL CENTRES` (var, iyi) |
| Hero facts bar | CLIENT / AREA / LOCATION — tam genişlik | 4 fact, küçük, sağ alt |
| Editorial section başlık | `U16 House` ~80px light, sol | `DOUIRA` — var ama daha küçük |
| 2-col body text | Var ve iyi hizalanmış | Var ama column genişlikleri zayıf |
| GSAP text reveal | Clip-path line reveal | Yok |

---

## 8. Önceliklendirilmiş Eylem Planı

### Faz 1 — Tamamlandı ✅
- [x] UTF-8 encoding bug (hero text)
- [x] VideoSection kaldırma
- [x] AssistantDock minimal

### Faz 2 — Ana Sayfa Yeniden Yapılandırma 🔴 KRİTİK
- [ ] `StaffSlider` homepage'den kaldır
- [ ] `Testimonials` kaldır
- [ ] `WhyChooseUs` kaldır (veya radikal olarak küçült)
- [ ] `StatsGrid` bağımsız bölüm olmaktan çıkar — manifesto bölümüne entegre et
- [ ] **Yeni Manifesto bölümü ekle** (siyah, merkezi, güçlü tek cümle)
- [ ] Hero başlık boyutunu büyüt (min 100px desktop)
- [ ] `Home.tsx`: 16 bölüm → 5 bölüm

### Faz 3 — GSAP Text Animasyonları 🟠
- [ ] Hero başlığı: word-by-word clip-path reveal
- [ ] Section H2'ler: stagger word reveal on scroll
- [ ] Manifesto metni: scrub opacity per-word
- [ ] İstatistik sayıları: counter animation

### Faz 4 — Project Detail İyileştirme 🟡
- [ ] Hero başlık boyutunu büyüt (BAT seviyesine yaklaştır)
- [ ] Facts bar layout'u iyileştir

### Faz 5 — Font Konsolidasyonu 🟡
- [ ] `Great Vibes` kullanımını kaldır veya minimalize et
- [ ] `Playfair Display` → sadece 1 yerde, tutarlı
- [ ] TWK Lausanne'ı tüm başlıklara genişlet

---

*Bu rapor 4 Temmuz 2026 tarihinde, yukarıdaki sitelerin canlı ekran görüntüleri ve DOM ölçümleri temel alınarak hazırlanmıştır. Tüm kıyaslamalar gerçek ekran görüntüsüne dayalıdır.*
