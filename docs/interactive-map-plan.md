# İnteraktif Proje Haritası — Kütüphane Taraması & Final Plan

> Hedef: Ana sayfadaki "Algeria & Beyond" (Project Footprint) bölümünde, referans görseldeki
> gibi **stilize + izometrik/3B-extrude edilmiş, wilaya sınırlı, gerçek ve interaktif** bir harita.
>
> Mevcut durum: `ProjectFootprintSection` içinde Leaflet + CARTO açık karolar (sokak haritası).
> Bu, referanstaki editoryal izometrik "extrude polygon" görünümüne **uymuyor** — sokak karosu
> değil, düz zemin üzerinde kabartılmış il poligonları isteniyor.

---

## 1. Referans Görselin Analizi (neye bakıyoruz?)

Referans bir **flat-design izometrik extrude harita**:

- Bej/krem düz zemin, sokak/karayolu detayı yok.
- Wilaya (il) sınırları açık gri poligonlar; bazı iller (4 adet) hafif koyu vurgulu.
- Poligonların alt kenarında **kalınlık/duvar** görünür → gerçek 3B extrusion (Blender ya da
  `fill-extrusion` + pitch ile üretilir; PNG üzerine çizim değil).
- Kırmızı, numaralı damla pin'ler; sağda sayısal özet (11 pin / 4 wilaya / 1 kıyı şeridi).

Sonuç: İstenen şey bir **choropleth/extrude vektör haritası**, tile tabanlı slippy map değil.
Bu, kütüphane seçimini doğrudan belirliyor.

---

## 2. Kütüphane Taraması (2026 durumu)

| Kütüphane | Yaklaşım | 3B extrude | İnteraktivite | Bundle (gzip)* | Referansa uyum |
|---|---|---|---|---|---|
| **MapLibre GL JS** | WebGL vektör + Style Spec | ✅ `fill-extrusion` gerçek 3B | ✅ pan/zoom/rotate/pitch | ~180–230 KB | ★★★★★ |
| **MapTiler SDK** (MapLibre üstü) | WebGL + hazır stiller | ✅ `fill-extrusion` | ✅ tam | ~200 KB + API key | ★★★★☆ |
| **react-simple-maps** (d3-geo) | SVG projeksiyon | ⚠️ sahte (offset kopya + CSS skew) | ⚠️ temel zoom/pan | ~30–50 KB | ★★★★☆ (görsel), ★★☆ (3B) |
| **deck.gl** (`PolygonLayer`) | WebGL data-viz | ✅ extrude | ✅ | ~250 KB+ | ★★★★☆ (fazla ağır) |
| **Leaflet** (mevcut) | Raster tile | ❌ | ✅ pan/zoom | ~46 KB | ★★☆ (sokak karosu) |
| **Three.js / R3F** | Ham 3B sahne | ✅ tam kontrol | ✅ | ~150 KB+ çok emek | ★★★★★ ama en pahalı |

*Bundle değerleri lazy-load edilen ayrı chunk içinde; ana sayfa kabuğunu (home shell) etkilemez.

### Topluluk / güncel metod özeti (2025–2026)

- **MapLibre GL JS**, Mapbox GL'in açık kaynak fork'u olarak "production-ready" kabul ediliyor;
  markalı, özel-tasarım vektör haritalar için varsayılan öneri. Tile maliyeti sıfır (kendi
  GeoJSON kaynağını kullanınca dış servise hiç gerek yok).
- **react-simple-maps**, "çok interaktif olmayan, bilgi gösteren, ülke/bölge vurgulayan"
  haritalar için ideal ve en hafif seçenek; ancak gerçek 3B extrude vermez.
- **Leaflet**, hızlı gömme/prototip için; vektör-stil ve 3B ihtiyacında yetersiz.
- Not: reddit.com bu ortamdaki web-crawler'a kapalı olduğundan (Anthropic UA engeli), topluluk
  görüşü doğrudan thread yerine bu görüşleri derleyen 2026 karşılaştırma yazılarından alındı
  (js-maps.com, Retool, ThemeSelection). Sonuç tutarlı: **özel-stil + 3B = MapLibre**.

---

## 3. Karar: MapLibre GL JS (birincil)

Gerekçe — kullanıcının üç şartını da tek teknolojiyle karşılıyor:

1. **Gerçekçi:** Gerçek harita motoru; pan/zoom/döndürme/pitch, projeksiyon doğru.
2. **İnteraktif:** İl hover'da vurgulanır, pin tıklanınca proje seçilir, kümeye uçar.
3. **Referans estetiği:** `fill-extrusion` + `pitch` ile poligonların alt duvarı görünür —
   birebir izometrik extrude görünüm. Karo/basemap kapatılıp düz bej zemin verilir → editoryal look.

react-simple-maps ikinci sırada tutuluyor (bundle/sadelik kazanırsa) — bkz. Bölüm 7.

---

## 4. Veri Kaynağı (wilaya sınırları)

Projeler yalnızca **Tipaza, Alger, Mostaganem, Boumerdes** wilayalarına dokunuyor; hepsi tüm
setlerde mevcut. Seçenekler:

| Kaynak | Kapsam | Lisans | Not |
|---|---|---|---|
| **geoBoundaries** (ADM1) | 58 wilaya | CC BY 4.0 (net) | **Önerilen** — lisansı temiz, atıf yeterli |
| Natural Earth admin-1 | il düzeyi | Public Domain | En güvenli lisans, sadeleştirilmiş sınırlar |
| HDX / OCHA COD-AB (DZA) | 48/58 | resmi, açık | Otoriter ama dosya ağır |
| fr33dz/Algeria-geojson | 48 wilaya | **lisans belirtilmemiş** ⚠️ | Kolay ama lisans riski — kullanma |

**Aksiyon:** geoBoundaries ADM1 GeoJSON'u indir → yalnızca 4 hedef wilayayı (veya tüm kuzey
şeridini) tut → `mapshaper` ile sadeleştir (`-simplify 8%`) → `public/geo/algeria-wilayas.json`.
Koordinatlar zaten `src/data/projectMap.ts` içinde (lat/lng), veri modeli hazır.

---

## 5. Uygulama Planı (fazlar)

### Faz 0 — Bağımlılık
- `npm i maplibre-gl` (+ opsiyonel `react-map-gl` v7 MapLibre modu için ergonomik React sarmalayıcı).
- Mevcut `leaflet` / `react-leaflet` bu bölümden kaldırılır (başka yerde kullanılmıyorsa).

### Faz 1 — Veri
- geoBoundaries ADM1'den `public/geo/algeria-wilayas.json` üret (sadeleştirilmiş).
- `projectMap.ts`'e wilaya bazlı `highlighted: boolean` türet (4 hedef wilaya).

### Faz 2 — Harita bileşeni (`ProjectFootprintMap.tsx` yeniden yazımı)
- Basemap YOK: `style` olarak sadece `{ version: 8, sources: {}, layers: [{ background: bej }] }`.
- `sources.wilayas` = GeoJSON; iki katman:
  - `fill-extrusion` (yükseklik ~6–10k "metre" ölçekli sabit; vurgulu iller data-driven koyu ton).
  - `line` (ince beyaz/gri sınır çizgisi, üst kenar).
- Kamera: `pitch: 38`, `bearing: -18`, `interactive: true`, `dragRotate` açık, scroll-zoom kapalı
  (sayfa kaydırmasını bozmamak için — mevcut davranışla aynı).
- Pin'ler: kırmızı numaralı **HTML `Marker`** (mevcut CSS `.igloo-map-pin` yeniden kullanılır);
  aktif pin büyür + `#e82a2e`, filtre dışı soluk.
- Etkileşim: il `mousemove` → hover vurgu (`feature-state`); pin `click`/`mouseover` → `onSelect`.
- Küme filtresi → `map.flyTo`/`fitBounds` ilgili wilaya sınırına.

### Faz 3 — Erişilebilirlik & reduced-motion
- `prefersReducedMotion` → `flyTo` yerine `jumpTo`, animasyon süresi 0.
- Harita `role="region"` + `aria-label`; pin'ler için görünmez metin listesi (klavye/okuyucu).
- WebGL yoksa fallback: mevcut `FOOTPRINT_IMAGE` PNG (statik).

### Faz 4 — Performans (mevcut kurallara uygun — bkz. `docs/tooling-standards.md`)
- Bileşen `ProjectFootprintSection` içinde **nested-lazy** kalır → MapLibre kendi chunk'ında,
  home shell'e girmez.
- `npm run analyze:bundle` ile öncesi/sonrası gzip farkı ölçülüp bu dosyaya baseline yazılır.
- GeoJSON sadeleştirilmiş (<150 KB) ve `public/`'ten servis edilir (JS bundle'a gömülmez).

### Faz 5 — Doğrulama
- `npm run lint && npm run build`.
- Preview: hover vurgu, pin seç, küme uçuşu, reduced-motion, mobil (390px) — konsol temiz.
- Playwright snapshot'ları (footprint 4 viewport) güncellenir (`--update-snapshots`), diff gerekçelenir.
- `AGENTS.md` ve `docs/tooling-standards.md` MapLibre notuyla senkronlanır (Leaflet notu güncellenir).

---

## 6. Örnek Style Spec (çekirdek)

```ts
const style = {
  version: 8,
  sources: {
    wilayas: { type: 'geojson', data: '/geo/algeria-wilayas.json' },
  },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#f3f1ea' } },
    {
      id: 'wilaya-fill', type: 'fill-extrusion', source: 'wilayas',
      paint: {
        'fill-extrusion-color': [
          'case', ['boolean', ['get', 'highlighted'], false], '#dcd7cb', '#e7e5df',
        ],
        'fill-extrusion-height': 9000,
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 1,
      },
    },
    { id: 'wilaya-line', type: 'line', source: 'wilayas',
      paint: { 'line-color': '#ffffff', 'line-width': 1.2 } },
  ],
};
// map: { pitch: 38, bearing: -18, scrollZoom: false }
```

---

## 7. Riskler & Alternatif

- **Bundle:** MapLibre ~+180 KB gzip (lazy chunk). Kabul edilebilir; home shell etkilenmez.
  Bütçe kritikse → **react-simple-maps** (d3-geo, ~40 KB): aynı GeoJSON, SVG choropleth,
  izometrik görünüm `transform: rotateX(...) skew(...)` + gölge kopya ile taklit edilir; pan/zoom
  `ZoomableGroup` ile. Gerçek 3B duvar olmaz ama editoryal görünüm %90 yakalanır.
- **WebGL bağımlılığı:** eski cihaz/GPU yoksa fallback PNG şart (Faz 3).
- **Lisans:** fr33dz verisi lisanssız — kullanma; geoBoundaries (CC BY) veya Natural Earth (PD).
- **Kuzey yoğunluğu:** 11 pin dar kıyı şeridinde kümelenir; başlangıç `fitBounds` + hafif
  zoom ile ayrışma sağlanır (mevcut kümeleme mantığı korunur).

---

## 8. Karar Özeti

| Öncelik | Seçim |
|---|---|
| Birincil (öneri) | **MapLibre GL JS** + `fill-extrusion` + pitch, basemap'siz özel stil |
| Veri | **geoBoundaries ADM1** (CC BY), mapshaper ile sadeleştir |
| Pin | HTML Marker (mevcut `.igloo-map-pin` CSS'i) |
| Hafif alternatif | react-simple-maps (d3-geo) — bundle kritikse |
| Fallback | Mevcut PNG (`project-footprint-algeria.png`) — WebGL yoksa |

---

## Kaynaklar

- [MapLibre GL JS — proje](https://maplibre.org/projects/gl-js/)
- [MapLibre — Extrude polygons for 3D](https://maplibre.org/maplibre-gl-js/docs/examples/extrude-polygons-for-3d-indoor-mapping/)
- [MapTiler — 3D fill-extrusion choropleth](https://docs.maptiler.com/sdk-js/examples/fill-extrusion/)
- [React Simple Maps](https://www.react-simple-maps.io/)
- [Best JavaScript Map Libraries 2026 — JS Maps](https://js-maps.com/best-javascript-map-libraries/)
- [Retool — Best React map libraries](https://retool.com/blog/react-map-library)
- [geoBoundaries](https://www.geoboundaries.org/)
- [Algeria GeoJSON (fr33dz) — lisans belirsiz, referans amaçlı](https://github.com/fr33dz/Algeria-geojson)
- [HDX — Algeria COD-AB](https://data.humdata.org/dataset/cod-ab-dza)

*Son güncelleme: 2026-07-05*
