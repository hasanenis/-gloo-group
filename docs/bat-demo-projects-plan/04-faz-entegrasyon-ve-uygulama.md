# Faz 04 - Entegrasyon ve Uygulama Plani

Bu faz, analizleri uygulanabilir React, route, CSS ve animasyon islerine boler. Ilk hedef `/bat-demo/projects/` icin BAT esintili ama Igloo kimligine ait bir proje index sayfasi olusturmak.

## Uygulama Sirasi

```text
1. Route ekle
2. Liste page component'i olustur veya ProjectsDemo'dan ayir
3. Ortak BAT demo shell kararini ver
4. Grid view'i asimetrik pattern ile kur
5. Filter/mode state'ini ekle
6. Detail navigation transition'i bagla
7. Detail sayfasindaki back links'i BAT demo index'e cevir
8. Gallery/List view'lari kademeli ekle
9. Responsive ve reduced-motion davranisini dogrula
```

## Route Degisikligi

Mevcut:

```tsx
<Route path="/bat-demo/projects/:slug" element={<BatProjectDemo />} />
```

Hedef:

```tsx
<Route path="/bat-demo/projects" element={<BatProjectsIndex />} />
<Route path="/bat-demo/projects/:slug" element={<BatProjectDemo />} />
```

Trailing slash icin React Router ayni route'u yakalayabilir, ama testte su URL dogrulanmali:

```text
http://localhost:3000/bat-demo/projects/
```

## Yeni Dosya Onerisi

Onerilen yeni dosya:

```text
src/pages/BatProjectsIndex.tsx
```

Ilk surumde mevcut `ProjectsDemo.tsx` uzerinden kopya almak yerine, daha kucuk bir yeni component yazmak daha guvenli:

- `/projects` mevcut klasik sayfa olarak kalir.
- `/bat-demo/projects/` yeni deneysel BAT index olur.
- Risk izolasyonu artar.
- Var olan `ProjectsDemo` davranisi kirilmaz.

## Paylasilacak Kodlar

`ProjectsDemo.tsx` icinden alinabilecek fikirler:

```text
SectorKey
sectorOrder
getSector(project)
visibleProjects useMemo
runBatPageTransition call
preload image on pointer enter
```

`BatProjectDemo.tsx` icinden alinabilecek veya daha sonra ayristirilabilecek parcalar:

```text
BatDemoCursor
DemoHeader
DemoMenu
DemoFooter
preloadImage
useFinePointer
```

Ilk implementasyonda bu parcalari hemen tasimak sart degil. Ancak uzun soluklu temizlik icin hedef:

```text
src/components/bat-demo/BatDemoCursor.tsx
src/components/bat-demo/BatDemoHeader.tsx
src/components/bat-demo/BatDemoMenu.tsx
src/components/bat-demo/BatDemoFooter.tsx
```

Bu refactor ayrica test edilmeli; ilk liste sayfasi implementasyonu ile ayni commit'te buyuk refactor onerilmez.

## CSS Stratejisi

Mevcut detay CSS'i:

```text
src/styles/bat-demo.css
```

Yeni liste siniflari ayni dosyada veya yeni bir dosyada olabilir. Kucuk baslangic icin ayni dosyada prefix'li ekler uygun:

```text
.bat-projects-index
.bat-projects-filter
.bat-projects-mode
.bat-projects-typology
.bat-projects-grid
.bat-projects-card
.bat-projects-gallery
.bat-projects-list
```

Neden yeni prefix?

- `bat-demo-hero__*` detay sayfasinin GSAP selector'lariyla siki bagli.
- Liste sayfasinda yanlislikla detay animasyonlari tetiklenmemeli.
- Gelecekte component ayristirma kolaylasir.

## Grid Pattern Uygulamasi

Hedef pattern:

```ts
const BAT_GRID_SPANS = [4, 6, 6, 10, 6, 6, 6, 4, 6, 10, 4, 6, 6, 10, 6, 6, 6, 4, 6, 10, 4, 6, 6, 10, 6] as const;
```

CSS yaklasimi:

```css
.bat-projects-grid {
  display: grid;
  grid-template-columns: repeat(16, minmax(0, 1fr));
}

.bat-projects-card[data-span="4"] {
  grid-column: span 4;
}

.bat-projects-card[data-span="6"] {
  grid-column: span 6;
}

.bat-projects-card[data-span="10"] {
  grid-column: span 10;
}
```

Responsive:

```css
@media (max-width: 1279px) {
  .bat-projects-grid {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}

@media (max-width: 679px) {
  .bat-projects-grid {
    grid-template-columns: 1fr;
  }

  .bat-projects-card {
    grid-column: 1 / -1;
  }
}
```

Tablet icin BAT siniflarinda `col-tl--2-10`, `col-tl--4-10`, `col-tl--6-10` goruluyor. Bizim pattern desktop span'i tablet icin `2, 4, 6` gibi normalize edebilir.

## Mode State

React state:

```ts
type BatProjectsMode = 'grid' | 'gallery' | 'list';
const [mode, setMode] = useState<BatProjectsMode>('grid');
```

Render:

```tsx
{mode === 'grid' && <BatProjectsGridView projects={visibleProjects} />}
{mode === 'gallery' && <BatProjectsGalleryView projects={visibleProjects} />}
{mode === 'list' && <BatProjectsListView projects={visibleProjects} />}
```

Erisilebilirlik:

- Mode butonlari `button`.
- Aktif mode `aria-pressed` veya `aria-current`.
- Typology filtreleri `aria-current`.
- Count her filtre degisiminde guncellenir.

## Navigation Transition

Kart click davranisi mevcut sistemle uyumlu olmali:

```ts
void runBatPageTransition({
  targetPath,
  imageSrc: model.hero.image.src,
  reducedMotion,
  lenis,
  navigate,
  afterNavigate: () => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  },
});
```

Hedef:

- Grid card image, gallery active image veya list selected preview ayni transition API'ye image kaynagi verir.
- Reduced motion varsa normal navigation hizli ve temiz olur.
- Detail sayfasi `consumeBatPageTransitionEntry` ile gelen entry'yi zaten okuyabilir.

## Detail Back Link Duzeltmesi

`BatProjectDemo.tsx` icinde related bolumundeki geri donus su anda klasik `/projects` rotasina gidiyor:

```text
navigateTo("/projects")
```

BAT demo index eklendikten sonra hedef:

```text
navigateTo("/bat-demo/projects")
```

Footer veya closing CTA'larinda da ayni mantik kontrol edilmeli. Kullanici BAT demo deneyimindeyken klasik projeler sayfasina dusmemeli.

## Kademeli Uygulama

### Adim 1 - Index Route ve Grid

- `BatProjectsIndex.tsx` ekle.
- `App.tsx` route ekle.
- Sadece `grid` mode render et.
- Filter bar'i kur ama mode butonlarindan sadece grid aktif olsun.
- Detail transition'i bagla.

### Adim 2 - Mode UI ve List

- `mode` state aktiflestir.
- `list` view ekle.
- Hover/focus preview image ekle.
- Keyboard navigation kontrol et.

### Adim 3 - Gallery

- Active slide state ekle.
- Previous/next buton veya hit zone ekle.
- Progress/count UI ekle.
- Transition'i active slide image ile bagla.

### Adim 4 - Shell Paylasimi

- Header/menu/cursor/footer ayristirma kararini uygula.
- Detail ve index sayfalarinda ayni shell'i kullan.
- GSAP cleanup ve dependency listelerini kontrol et.

### Adim 5 - Detay Sayfasi Icerik Ritmi

- Related back target'i duzelt.
- Feature gallery/mosaic bloklarini veri kalitesine gore ekle.
- Supplementary sections'i proje bazli flag ile ac.
- Mobile ve reduced-motion dogrulamasini tamamla.

## Faz 04 Kabul Kriterleri

- `/bat-demo/projects/` React route olarak calisir.
- Sayfa Igloo datasini listeler.
- Grid view BAT benzeri asimetrik ritim kullanir.
- Filter count dogru guncellenir.
- Her proje `/bat-demo/projects/:slug` detayina mevcut transition ile gider.
- Detay sayfasindan geri donus BAT demo index'e olur.
- `/projects` klasik sayfasi bozulmaz.

