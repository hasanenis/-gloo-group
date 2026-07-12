# Çeviri Ultra Planı — Arapça · Türkçe · Fransızca

> Hazırlanma tarihi: 2026-07-10 · Kaynak denetim: repo taraması (dosya/satır referanslarıyla)
> Hedef: Sitenin 4 dilde (EN temel + **FR tamamlama**, **TR**, **AR**) eksiksiz, doğal ve
> görsel olarak kusursuz yayınlanması. Arapça için tam **RTL** desteği dahil.

---

## 0. Mevcut Durumun Fotoğrafı (denetim bulguları)

### Zaten var olanlar ✅
| Bileşen | Durum | Kaynak |
|---|---|---|
| Locale altyapısı | 4 dil tanımlı: `en / fr / dz / tr` | `src/i18n.tsx:3` |
| RTL anahtarı | `dz` için `document.dir = "rtl"` otomatik | `src/i18n.tsx:279-283` |
| Dil kalıcılığı | `localStorage("igloo:locale")` | `src/i18n.tsx:272-280` |
| Dil değiştirici | `LocaleToggle` (EN/FR/DZ/TR pill) — header'da aktif | `src/i18n.tsx:294` |
| UI sözlüğü (chrome) | ~30 anahtar × 4 dil hazır (nav, buton, etiketler) | `src/i18n.tsx:33-75` |
| Veri şeması | `HomepageText = { en, fr, dz?, tr? }` — 4 dile hazır | `src/data/homepageContent.ts:8` |
| YML dışa aktarım | `scripts/export-locallingo-locales.ts` → `config/locales/site.*.yml` (~150 KB/dil) | script mevcut |
| Çeviri ajanı becerisi | `.agents/skills/localizer/` — çift çevirmen + hakem (adjudicator) iş akışı | SKILL.md mevcut |

### Eksikler / kırıklar ❌
| Sorun | Etki | Kaynak |
|---|---|---|
| **İçerik çevirisi yok**: proje editoryal metinlerinde 0 adet `dz:`/`tr:` alanı | TR/AR seçilince makine kırması metin görünüyor | `src/data/projectContent.generated.ts` (3.913 satır) |
| `translateFallback` kelime-değiştirme hack'i | "konut and karma kullanım programlar teslim edildi with engineering control" gibi **bozuk karışık dil** üretiyor | `src/i18n.tsx:83-256` |
| YML dosyalarını **geri okuyan kod yok** | `config/locales/*.yml` üzerinde yapılan çeviri siteye ulaşamaz | grep: 0 tüketici |
| 16 bileşen `useLocale` hiç kullanmıyor | Bu bileşenlerdeki metinler her dilde İngilizce kalıyor | liste §2.2'de |
| `lang="dz"` yanlış ISO kodu | `dz` = Dzongkha (Butan dili). SEO + ekran okuyucular için `ar-DZ` olmalı | `src/i18n.tsx:281` |
| Arapça glif içeren font yok | TWK Lausanne / Roboto Arapça kapsamıyor → tofu/fallback karmaşası | `public/fonts/`, `src/index.css:7-10` |
| Yoğun `letter-spacing` (tracking) kullanımı | Arapça bitişik yazıda harf aralığı **yazıyı kırar** — sıfırlanmalı | `tracking-[0.28em]` vb. onlarca yerde |
| Fiziksel yön sınıfları (`text-left`, `ml-`, `left-`) | RTL'de yerleşim aynalanmaz, taşma/bozulma olur | tüm bileşenler |
| FR bile eksiksiz değil | `fr` alanı olmayan metin EN'e düşüyor; proje başlığı `menuTitle` hack'i ile FR sayılıyor | `export-locallingo-locales.ts:47-49` |

---

## 1. Önce Karara Bağlanacaklar (kullanıcı onayı gerekli) ⚠️

| # | Karar | Seçenekler | Öneri |
|---|---|---|---|
| K1 | **Arapça hangi varyant?** | (a) Standart Arapça (Fusha/MSA) · (b) Cezayir Darjası (mevcut `dz` stringleri Darja: "شنو كاين", "عيّط للمكتب") | **(a) MSA** — kurumsal inşaat firması, resmi ihale/iş müşterisi hedefliyor; Darja samimi ama gayriresmî durur. Mevcut Darja UI stringleri de MSA'ya çevrilir. |
| K2 | **URL stratejisi** | (a) Mevcut: toggle + localStorage (URL değişmez) · (b) `/ar/`, `/tr/`, `/fr/` path öneki (SEO index'lenebilir) | **(a) ile başla** — hızlı; (b) ayrı bir SEO fazı olarak sonra eklenebilir (router + nginx + hreflang işi). |
| K3 | **Hero döngü kelimeleri** ("Building / Crafting / Dreaming Futures") | (a) Marka öğesi olarak İngilizce kalsın · (b) Her dilde çevrilsin | **(a)** — animasyon genişlikleri (`min-w-[4.22em]`) kelime uzunluğuna ayarlı; çeviri animasyonu bozar. Logo-altı slogan gibi davranır. |
| K4 | **Arapça font** | Noto Sans Arabic · IBM Plex Sans Arabic · Cairo | **IBM Plex Sans Arabic** (300/400/600) — Lausanne'un modern grotesk havasına en yakın; woff2 self-host (~90 KB/kesim). |
| K5 | **Çeviri kaynak-of-truth** | (a) Doğrudan veri dosyalarına `tr:`/`dz:` alanı yaz · (b) YML import pipeline kur | **(a)** — şema zaten hazır, runtime loader gerekmez, tree-shaking korunur. YML yalnızca çeviri gözden geçirme/paylaşım çıktısı olarak kalır. |

---

## 2. Faz Planı

### FAZ 0 — Altyapı onarımı (yarım gün)
Çeviri üretimine başlamadan **önce** yapılmalı; yoksa çeviriler yanlış temele oturur.

1. **`lang` düzeltmesi**: `document.documentElement.lang` için eşleme tablosu:
   `en→"en"`, `fr→"fr"`, `tr→"tr"`, `dz→"ar-DZ"`. İç anahtar `dz` kalabilir (kod kırılmasın), dışa dönük BCP-47 doğru olur. — `src/i18n.tsx:281`
2. **`translateFallback`'i pasifleştirme stratejisi**: hemen silme — gerçek çeviriler
   dalga dalga geldikçe zaten devreden çıkar; **Faz 5 sonunda tamamen sil** (ölü kod + yanlış çıktı riski).
   Geçici iyileştirme: kelime-değiştirme yerine **EN'e düş** (karışık dil cümleden iyidir):
   `translateProjectPhrase` çağrılarını kaldır, `return source`.
3. **YML round-trip aracı**: `scripts/import-locales.ts` yaz —
   `config/locales/site.<locale>.yml` içindeki düzeltilmiş değerleri okuyup ilgili
   `src/data/*.ts` dosyalarına `tr:`/`dz:`/`fr:` alanı olarak geri yazar (codemod, ts-morph).
   Böylece çeviriler YML'de gözden geçirilir, koda tek komutla döner:
   ```bash
   npx tsx scripts/export-locallingo-locales.ts   # dışa aktar
   npx tsx scripts/import-locales.ts --locale tr  # içe al
   ```
4. **`LocalizedString`/`HomepageText` birleşik yardımcı**: `localize()` + `pickLocaleText()`
   ikilisini tek modülde topla; eksik dil telemetrisi ekle (dev modda konsola
   "missing tr: homepage.hero.lead" uyarısı) — kapsama takibini bu sağlar.

### FAZ 1 — Metin envanteri & hardcoded temizliği (1 gün)
`useLocale` kullanmayan 16 dosyadaki görünür metinleri şemaya taşı:

**Öncelik A (kullanıcı her ziyarette görüyor):**
- `src/components/HeroBanner.tsx` — K3 kararına göre; `aria-label` her durumda çevrilecek
- `src/components/SiteIntro.tsx` — intro metinleri
- `src/pages/Home.tsx` — bölüm başlıkları/CTA'lar (alt bileşenlere prop geçen kısımlar)
- `src/components/WhyChooseUs.tsx`, `Testimonials.tsx`, `VideoSection.tsx`, `TeamImages.tsx`, `StaffSlider.tsx`, `CardCarousel.tsx`, `ImageSlider.tsx`
- `src/components/OfficeLocationMap.tsx` (yeni eklendi — harita etiketleri)
- `src/components/RahmaniaComparisonSection.tsx`, `ClientGuideOverlay.tsx`

**Öncelik B (görünmez ama önemli):**
- Tüm `aria-label`, `alt`, `placeholder`, `title` öznitelikleri (grep: `aria-label="[A-Z]`)
- `document.title` çağrıları — `ProjectDetail.tsx:382`, diğer sayfalar
- Form doğrulama/`mailto` gövde metinleri (`Contact.tsx`)
- `index.html` içindeki `<title>` ve meta description (statik — JS ile locale'e göre güncelle)

**Çıktı**: her string `LocalizedString` şemasında; `en` dolu, diğerleri boş. Dev-modda
eksik dil uyarıları tam listeyi verir → çeviri iş listesi otomatik çıkar.

### FAZ 2 — Çeviri üretimi (dalga dalga, 2-3 gün)
Mevcut **localizer becerisi** (`.agents/skills/localizer/`) kullanılacak:
iki bağımsız çevirmen ajan + hakem ajan → en iyi çeviri seçilir. Dil başına dalga sırası:

| Dalga | Kapsam | Hacim (yaklaşık) |
|---|---|---|
| 2a | UI chrome sözlüğü gözden geçirme (mevcut 30 anahtar; Darja→MSA revizyonu K1'e göre) | küçük |
| 2b | `homepageContent.ts` (hero, manifesto, süreç, kanıt blokları) | ~80 string |
| 2c | `About` + `Contact` + `Footer` + `AssistantDock` sabitleri | ~60 string |
| 2d | `projects.ts` proje kayıtları (başlık, konum, kapsam, coverLines) | ~11 proje × 8 alan |
| 2e | `projectContent.generated.ts` editoryal içerik — **en büyük parça** (3.913 satır: paragraflar, galeri altyazıları, SSS) | ~large; proje başına ayrı PR/dalga |
| 2f | `batProjectModel.ts` + `projectEditorial.ts` + `manualProjectImages.ts` alt metinleri | orta |

**Kalite kuralları (localizer TRANSLATOR_INSTRUCTIONS'a ek):**
- İnşaat terminolojisi tutarlılık sözlüğü önce çıkarılır: *logement social → sosyal konut →
  سكن اجتماعي*, *wilaya*, *VRD/altyapı ağları*, *promotional housing → promosyonel konut* vb.
  Tek bir `GLOSSARY.md` dosyası üç dile referans olur (localizer'a girdi verilir).
- Rakamlar/ölçüler: Arapça'da Batı rakamları (0-9) kullanılacak (Cezayir standardı), ölçü
  birimleri değişmez. Tarihler `Intl.DateTimeFormat(locale)` üzerinden.
- Marka adları ("Igloo Construction", "SARL Igloo Yapi") hiçbir dilde çevrilmez.
- FR mevcut metinleri de gözden geçirilir (aksan/diyakritik hataları için
  `scripts/fix-fr-diacritics.py` zaten var — çalıştırılıp sonuç doğrulanır).

**İş akışı** (dil başına):
```bash
npx tsx scripts/export-locallingo-locales.ts        # güncel EN kaynağı yml'e
# localizer skill → site.tr.yml / site.dz.yml / site.fr.yml doldurur (dalga kapsamı kadar)
npx tsx scripts/import-locales.ts --locale tr       # koda geri yaz
npx tsc --noEmit && npm run build                    # doğrula
```

### FAZ 3 — RTL + Arapça tipografi (1-1,5 gün) — **en riskli faz**
1. **Font**: IBM Plex Sans Arabic woff2 (300/400/600) → `public/fonts/`; CSS:
   ```css
   :root[lang="ar-DZ"] {
     --font-sans: "IBM Plex Sans Arabic", "Roboto", sans-serif;
     --font-nav:  "IBM Plex Sans Arabic", "Roboto", sans-serif;
   }
   :root[lang="ar-DZ"] * { letter-spacing: 0 !important; } /* bitişik yazıyı koru */
   ```
   (`!important` yerine tracking utility'lerini `[dir="ltr"]` scope'una almak daha temiz —
   uygulamada hangisi az dokunuşsa o.)
2. **Yerleşim denetimi** — bileşen bileşen RTL turu (mobil + masaüstü):
   - Header / mobil alt nav — pill sırası, logo konumu
   - Hero (media crop `object-[66%_50%]` **istisna**: fotoğraf kadrajı yön değiştirmemeli —
     `[dir="rtl"]`'de de aynı kalacak şekilde sabitle)
   - Footer kolonları, Contact formu (input `text-align`), proje kartları grid'i,
     ProjectDetail hero + editoryal bloklar, BAT demo sayfaları
   - Ok ikonları (`ArrowRight`, prev/next): RTL'de `rotate-180` veya mantıksal değişim
   - `text-left/right`, `ml-/mr-`, `pl-/pr-`, `left-/right-` → kritik olanları `rtl:` variant
     veya logical property (`ms-/me-/ps-/pe-/start-/end-`) ile düzelt. **Tümünü değil**,
     yalnızca RTL turunda bozuk görüneni düzelt (Tailwind v3 `rtl:` variant destekler).
   - GSAP x-ekseni animasyonları (`x:`, `xPercent:`): reveal yönleri RTL'de ters his verirse
     `dir`'e göre işaret çevir — sadece şikâyet çıkan yerde.
3. **Sayfa geçişleri & Lenis**: RTL'de test (clip-path `inset()` yön bağımsız — sorun beklenmez).

### FAZ 4 — Dil UX'i (yarım gün)
1. **İlk ziyaret dili**: `navigator.languages` → `ar*→dz`, `tr*→tr`, `fr*→fr`, diğer→`en`
   (yalnızca localStorage boşken).
2. Toggle erişilebilirliği: mevcut `aria-pressed` iyi; mobilde 4 pill sığıyor mu kontrol.
3. Dil değişince `document.title` + meta description güncelle.

### FAZ 5 — SEO & temizlik (yarım gün)
1. `index.html` meta'ları JS ile locale'e senkronla (`og:locale`, `description`).
2. K2=(b) seçilirse: path tabanlı locale + nginx + `hreflang` ayrı mini-proje olarak planlanır.
3. **`translateFallback` + TR_TERMS/DZ_TERMS/PATTERNS silinir** (`src/i18n.tsx:83-256`) —
   artık gerçek çeviri var; `pickLocaleText` eksikte EN'e düşer.
4. `FALLBACK_TRANSLATIONS` sözlüğü ana sözlüğe eritilir.

### FAZ 6 — QA matrisi + deploy (yarım gün)
**Test matrisi** (preview araçlarıyla ekran görüntülü):

| | EN | FR | TR | AR (RTL) |
|---|---|---|---|---|
| Home (mobil 375px + masaüstü) | ☐ | ☐ | ☐ | ☐ |
| Projects listesi | ☐ | ☐ | ☐ | ☐ |
| ProjectDetail (2 farklı proje) | ☐ | ☐ | ☐ | ☐ |
| About / Contact / Footer | ☐ | ☐ | ☐ | ☐ |
| Sayfa geçişleri + hero animasyonları | ☐ | ☐ | ☐ | ☐ |

**Özel kontroller:**
- **Taşma**: TR ve FR metinleri EN'den %20-35 uzun — `clamp()` başlıklar, `whitespace-nowrap`
  noktaları, buton genişlikleri (özellikle mobil 320px).
- **Arapça**: glif render (tofu yok), harf bitişmesi bozulmamış (letter-spacing sıfır),
  satır yüksekliği (Arapça gliflerde `leading-none` kırpma yapabilir → spot kontrol).
- `npx tsc --noEmit` + `npm run build` temiz.

**Deploy** (mevcut akış):
```bash
npm run build                                        # lokal doğrulama
tar -czf /tmp/igloo-i18n.tar.gz src/ config/
scp /tmp/igloo-i18n.tar.gz root@65.21.176.223:/tmp/
ssh root@65.21.176.223 "cd /var/www/igloogroupe/current && tar -xzf /tmp/igloo-i18n.tar.gz && npm run build && docker compose -f /opt/igloogroupe-compose.yml restart"
```

---

## 3. Sıralama & Efor Özeti

| Faz | Süre | Bağımlılık |
|---|---|---|
| 0 — Altyapı | 0,5 g | K1-K5 kararları |
| 1 — Envanter | 1 g | Faz 0 |
| 2 — Çeviri (dalgalar) | 2-3 g | Faz 1 (dalga başına bağımsız ilerler) |
| 3 — RTL/tipografi | 1-1,5 g | Faz 2a-2c (Arapça metin görünür olmalı) |
| 4 — Dil UX | 0,5 g | Faz 2 |
| 5 — SEO/temizlik | 0,5 g | Faz 2 tamam |
| 6 — QA + deploy | 0,5 g | hepsi |
| **Toplam** | **~6-7,5 gün** | dalgalar paralelleştirilebilir |

## 4. Riskler
1. **RTL yerleşim regresyonu** (en yüksek): LTR'yi bozmadan RTL düzeltmek — tüm `rtl:`
   dokunuşları LTR ekran görüntüsü karşılaştırmasıyla doğrulanır.
2. **3.913 satırlık üretilmiş içerik**: `projectContent.generated.ts` elle düzenlenirse
   yeniden üretimde (`scripts/build-project-content.ts`) çeviriler ezilebilir →
   çeviriler generator'ın **girdisine** eklenmeli, çıktısına değil (Faz 0'da doğrulanacak).
3. **Metin uzaması** ile animasyonlu başlıkların (`useHomeTextReveal` satır bölme) yeniden
   ölçümü — TR/FR uzun satırlarda split doğruluğu test edilecek.
4. **Bundle boyutu**: 4 dilin tüm metni JS bundle'a gömülü (şu an da öyle) — içerik
   çevirisi bundle'ı ~%50-80 büyütür. Kabul edilebilir; sorun olursa locale-bazlı
   dynamic import sonraki iterasyona.

## 5. Kabul Kriterleri (bitti sayılma şartları)
- [ ] 4 dilde de hiçbir sayfada karışık-dil cümle yok (translateFallback silinmiş)
- [ ] AR'de tüm sayfalar RTL, font doğru, harfler bitişik, taşma yok
- [ ] TR/FR'de taşma/kırpılma yok (mobil 320-430px dahil)
- [ ] `lang` özniteliği `ar-DZ`/`tr`/`fr`/`en` olarak doğru
- [ ] Dil seçimi kalıcı + ilk ziyarette tarayıcı diline göre açılıyor
- [ ] `tsc` + `build` temiz; canlıda 4 dil doğrulandı (QA matrisi ekran görüntüleri)
