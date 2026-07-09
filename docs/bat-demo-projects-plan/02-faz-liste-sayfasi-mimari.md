# Faz 02 - Liste Sayfasi Mimarisi

Bu faz, BAT'in `Projects` liste sayfasindaki proje listelenme bicimini Igloo'nun `/bat-demo/projects/` sayfasina uyarlamak icin hedef bilgi mimarisini ve layout ritmini tanimlar.

## Referans Liste Davranisi

BAT liste sayfasi ilk bakista sadece bir grid gibi gorunuyor, fakat asagidaki parcalardan olusuyor:

```text
[fixed top header]
  left: logo
  center-ish: small "Menu"
  right: filter/count/menu affordances

[filter navigation]
  Mode:
    Grid
    Gallery
    List

  Typology:
    All
    Consultancy
    Culture & Education
    Healthcare
    Home Design
    Hospitality
    Residential
    Work Spaces

  Count:
    (25)

[view switcher body]
  Grid    -> asymmetric editorial masonry
  Gallery -> full viewport-ish slider/hero sequence
  List    -> textual list with selected preview image
```

Bizim hedefimiz bu davranisi Igloo projelerine cevirmek:

```text
Mode:
  Grid
  Gallery
  List

Typology:
  All
  Residential
  Commercial
  Mixed Use
  Infrastructure
  Community
  Hospitality

Count:
  dynamic filtered project count
```

## Desktop Layout ASCII

BAT referansindaki liste sayfasi geleneksel hero kullanmiyor. Ilk ekranin islevi filtre ve grid'e giris.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ LOGO                                                   MENU ICON        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                  Mode             Typology                 (25)        │
│                  Grid             All                                  │
│                  Gallery          Residential                          │
│                  List             Commercial                           │
│                                   ...                                  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ 4/16 card      6/16 card                   6/16 card                   │
│ ┌──────────┐   ┌─────────────────────┐     ┌─────────────────────┐     │
│ │ portrait │   │ landscape           │     │ landscape           │     │
│ └──────────┘   └─────────────────────┘     └─────────────────────┘     │
│ title          title                       title                       │
│                                                                        │
│                10/16 wide card                         6/16 card       │
│                ┌──────────────────────────────┐        ┌──────────┐    │
│                │ wide landscape               │        │ square-ish│    │
│                └──────────────────────────────┘        └──────────┘    │
│                title                                  title            │
│                                                                        │
│ 6/16 card                 6/16 card             4/16 card              │
│ ┌──────────────────┐      ┌──────────────────┐  ┌──────────┐          │
│ │ image            │      │ image            │  │ image    │          │
│ └──────────────────┘      └──────────────────┘  └──────────┘          │
└────────────────────────────────────────────────────────────────────────┘
```

## Grid Kolon Ritmi

BAT HTML'indeki ilk 25 grid karti su kolon dizisini kullaniyor:

```text
1  The Loop                         4/16
2  U16 House                        6/16
3  OMA Baserria                     6/16
4  Hampton by Hilton                10/16
5  IB House                         6/16
6  Altos Reales I                   6/16
7  Cuenca Healthcare Centre         6/16
8  Zurbaran School                  4/16
9  GOe                              6/16
10 Jo House                         10/16
11 Tennis Academy                   4/16
12 Antzuola School                  6/16
13 Bypillow Boutique Hotel          6/16
14 36 housing units                 10/16
15 AH House                         6/16
16 Lancor Headquarters              6/16
17 A4 House                         6/16
18 84 social housing units          4/16
19 SIWA Clinic                      6/16
20 L10 House                        10/16
21 Negresco Hotel                   4/16
22 Ciudad Real Healthcare Centre    6/16
23 Urretxindorra School             6/16
24 E8 House                         10/16
25 E22 Renovation                   6/16
```

Igloo icin bunu pattern olarak saklamak yeterli:

```ts
const BAT_GRID_SPANS = [4, 6, 6, 10, 6, 6, 6, 4, 6, 10, 4, 6, 6, 10, 6, 6, 6, 4, 6, 10, 4, 6, 6, 10, 6];
```

Bu pattern proje sayisi degisse bile modulo ile devam ettirilebilir.

## Hedef Component Agaci

Yeni sayfa, mevcut `ProjectsDemo` ile `BatProjectDemo` arasinda bir kopru olmali:

```text
BatProjectsIndexPage
  BatDemoPageShell
    BatDemoHeader
    BatDemoMenu
    BatProjectsFilterBar
      BatModeSwitch
      BatTypologyFilter
      BatProjectCount
    BatProjectsView
      BatProjectsGridView
        BatProjectGridCard
      BatProjectsGalleryView
        BatProjectGallerySlide
      BatProjectsListView
        BatProjectListRow
        BatProjectPreviewImage
    BatDemoFooter
    BatDemoCursor
```

Ilk implementasyonda `BatDemoPageShell` ayri component olarak cikarilmayabilir, fakat planin ilerleyen fazlarinda header/menu/cursor/footer tekrarini azaltmak icin iyi bir hedef.

## Grid View Hedefi

Grid view, bizim mevcut `ProjectsDemo.tsx` kart mantigini koruyup BAT ritmine tasimali:

```text
article.card
  Link -> /bat-demo/projects/:slug
    media frame
      img project.images[0] veya model.hero.image
    title
    optional meta
```

Gorsel kararlar:

- Kartlar nested card gibi durmamali.
- Sayfa beyaz zeminde editorial boslukla akmali.
- Sadece image + title yeterli; summary metinleri grid'i agirlastiriyor.
- Kirmizi vurgu sadece aktif filtre, focus/hover veya count tarafinda kullanilmali.
- BAT gibi bazi kartlar dar, bazilari genis olmali.

## Gallery View Hedefi

Gallery view, BAT'in slider davranisini Igloo icin basit ama etkili bir sekilde kurabilir:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│               [active project hero image]            │
│                                                      │
│     01 / NN                         Project Title    │
│     progress bar                    Location/Scope   │
│                                                      │
│  left hit zone                               right hit │
└──────────────────────────────────────────────────────┘
```

Teknik notlar:

- Ilk surumda GSAP timeline yerine React state + CSS transition yeterli.
- Sonraki surumde `Draggable` veya wheel/keyboard navigation eklenebilir.
- Detail transition icin active slide image source'u `runBatPageTransition`'a verilmeli.

## List View Hedefi

List view, hizli tarama icin olusturulmali:

```text
┌──────────────────────────────────────────────────────┐
│ 01  Project Title                    Typology        │
│ 02  Project Title                    Typology        │
│ 03  Project Title                    Typology        │
│ 04  Project Title                    Typology        │
│                                                      │
│                [hover/selected preview image]        │
└──────────────────────────────────────────────────────┘
```

Davranis:

- Desktop hover/focus ile preview image degisir.
- Keyboard focus ayni preview'i tetikler.
- Mobile'da hover yoksa her row kendi ufak image'ini gosterebilir veya grid view varsayilan kalabilir.

## Mobile Layout ASCII

Mobile'da BAT'in kolon sistemi daha tek akisa inmeli:

```text
┌────────────────────┐
│ LOGO          MENU │
├────────────────────┤
│ Filter        (11) │
│ [Mode tabs]        │
│ [Typology chips]   │
├────────────────────┤
│ ┌────────────────┐ │
│ │ image          │ │
│ └────────────────┘ │
│ Project title      │
│                    │
│ ┌────────────────┐ │
│ │ image          │ │
│ └────────────────┘ │
│ Project title      │
└────────────────────┘
```

Mobile gereksinimleri:

- Filter bar collapse edilebilir olabilir, ama ilk surumde yatay scroll chip yeterli.
- Kart image aspect ratio sabit kalmali.
- Title ve count ust uste binmemeli.
- Custom cursor devre disi kalmali.

## Veri Modeli

Mevcut `ProjectRecord` uzerine su turev alanlar hesaplanabilir:

```ts
type BatProjectListItem = {
  slug: string;
  title: string;
  shortTitle: string;
  typology: SectorKey;
  location: string;
  scope: string;
  coverImage: string;
  heroImage: string;
  gridSpan: 4 | 6 | 10;
};
```

Kaynaklar:

- `projects` dataset'i ana veri.
- `buildBatProjectPageModel(project, locale)` hero, related ve display title icin kullanilir.
- `getSector(project)` mevcut `ProjectsDemo.tsx` icindeki mantiktan cikarilip paylasilabilir hale getirilebilir.

## Animasyon Ilkeleri

Liste sayfasinda animasyon hedefleri:

- Page enter: filter nav ve ilk kartlar mask/opacity ile girer.
- Kart reveal: scroll geldikce hafif y ve opacity.
- Kart hover: image scale veya clip inset.
- Mode switch: full remount yerine view container crossfade.
- Detail navigation: `runBatPageTransition` ile mevcut hero image transition korunur.

Selector stabilitesi:

```text
data-bat-projects-root
data-bat-projects-filter
data-bat-project-card
data-bat-project-image
data-bat-project-mode
```

GSAP class selector'lari gerekiyorsa `bat-projects-*` prefix'i kullanilmali. Mevcut `bat-demo-hero__*` selector'lari detay sayfasina ait kalmali.

## Faz 02 Kabul Kriterleri

- `/bat-demo/projects/` icin hedef liste IA tanimli.
- Grid, Gallery ve List modlarinin sorumluluklari ayrildi.
- BAT'in 16 kolon asimetrik ritmi Igloo pattern'ine cevrildi.
- Mobile davranis icin tek akis ve chip filtre yaklasimi belirlendi.
- Component agaci ve veri modeli sonraki implementasyon fazina hazir.

