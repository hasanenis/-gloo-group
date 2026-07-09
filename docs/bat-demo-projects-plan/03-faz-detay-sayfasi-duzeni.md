# Faz 03 - Proje Detay Sayfasi Duzeni

Bu faz, BAT referansindaki proje detay sayfalarinin genel duzenini inceler ve mevcut `BatProjectDemo.tsx` sayfasina hangi bloklarin nasil yayilacagini tanimlar.

## Referans Detay Omurgasi

BAT detay sayfalarinda isimler ve icerik degisse de ana sayfa duzeni tekrarli:

```text
[Header]

[Hero]
  full-bleed image
  title over image
  bottom meta tab
  2 or 3 row fact grid

[Intro editorial]
  left title
  right body text columns

[Project narrative blocks]
  large image
  two-column text
  quote center
  gallery grid
  image/text pair
  full-width image

[Related projects]
  circular image cards

[Footer]
```

Bu yapi, Igloo tarafinda pazarlama sitesi icin guclu: once etki, sonra teknik bilgi, sonra gorsel kanit, en sonda ilgili projeler.

## Detay Sayfasi ASCII

```text
┌──────────────────────────────────────────────────────────────────────┐
│ LOGO                                                        MENU     │
│                                                                      │
│                 [full bleed project image]                           │
│                                                                      │
│  PRETITLE                                                            │
│  PROJECT TITLE IN LARGE STACKED LINES                                │
│                                                                      │
│  Project info                                                        │
│  ──────────────────────────────────────────────────────────────────  │
│  TYPOLOGY        STATUS          YEAR                                │
│  CLIENT          AREA            LOCATION                            │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Project title / editorial title     Paragraph 1    Paragraph 2       │
│                                     Paragraph 3                       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         [large media image]                          │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Related projects                                      Back to projects│
│   ○ Project       ○ Project        ○ Project          ○ Project       │
└──────────────────────────────────────────────────────────────────────┘
```

## BAT Blok Siniflari

`new_bat_archi_projects_the-loop.html` icinde gorulen temsilci blok siniflari:

```text
hero__base
hero__project
hero__imgwrap
hero__title
hero__bottom
hero__tabswrp
hero__info
text__3col
text__section--3col
text__2col-text
text__section--2col-text
image__section
image--scale
image--parallax
quote__section--Center
gallery__grid2
transition__hero
```

Bizim React tarafinda bunlar birebir sinif olarak tasinmamali. Onun yerine mevcut `bat-demo-*` sinif dili surdurulmeli:

```text
bat-demo-hero
bat-demo-overlap-panel
bat-demo-media__frame
bat-demo-carousel
bat-demo-footer
```

## Mevcut `BatProjectDemo.tsx` Haritasi

Mevcut detay sayfasi zaten su BAT benzeri parcalari iceriyor:

```text
BatDemoCursor
BatDemoPreloader
DemoHeader
DemoMenu
DemoFooter
BatProjectDemo
  hero
  editorial
  media
  related carousel
  supplementary sections, currently disabled
```

Kodda dikkat edilmesi gereken nokta:

```text
const showSupplementarySections = false;
```

Bu, teknik, company, FAQ, details, programme, nearby ve closing gibi uzun sayfa bloklarini kapatiyor. BAT referansina daha cok yaklasmak icin bu bloklar rastgele acilmamali. Once sayfa ritmi ve veri kalitesi kontrol edilmeli.

## Hero Davranisi

Hero icin hedef kararlar:

- Full-bleed image korunmali.
- Baslik image uzerine oturmali.
- Metadata hero alt bandinda kalmali.
- Header tonu hero image kontrastina gore degismeli.
- Text reveal selector'lari korunmali.
- Transition ile gelen image varsa hero entry gecikmesi korunmali.

Mevcut class selector'lari GSAP ile siki bagli:

```text
.bat-demo-hero__pretitle
.bat-demo-hero__headline
.bat-demo-hero__tab
.bat-demo-hero__line
.bat-demo-hero__fact-label
.bat-demo-hero__fact-value
```

Bu yuzden hero markup'i genis rewrite edilmemeli. Iyilestirmeler CSS ve veri modeli uzerinden yapilmali.

## Editorial Blok

BAT'ta hero sonrasi beyaz bolum, detay sayfasinin gercek "okuma" baslangici:

```text
left: project title or editorial headline
right: 2 or 3 paragraph columns
```

Igloo hedefi:

- `model.editorialText.title` sol baslik.
- `model.editorialText.paragraphs` sag kolonlar.
- Paragraflar `data-bat-split-lines` ile reveal olabilir.
- Mobile'da tek kolon.
- Baslik ve metin arasinda genis bosluk korunmali.

## Media Ritmi

BAT detaylari sadece bir hero + bir image degil. Sayfanin asagisinda farkli gorsel agirliklar var:

```text
large image
text/image pair
center quote
two image grid
full-width image
related circles
```

Igloo icin onerilen kademeli yaklasim:

1. Mevcut `featureMedia` blogunu guclendir.
2. `content.images.featureGallery` varsa 2 kolon veya offset gallery ekle.
3. `content.images.mosaic` varsa editorial mosaic blogu ekle.
4. `content.summary` veya `content.description` icinden quote benzeri tek cumle secme isini manuel curated data'ya birak.
5. Supplementary sections'i her proje icin otomatik acma; sadece data kalitesi yeterliyse ac.

## Related Projects

BAT'ta related projects dairesel gorsellerle gelir. Bizde bu zaten var:

```text
bat-demo-carousel
  bat-demo-carousel__viewport
  bat-demo-carousel__track
  bat-demo-carousel__item
  bat-demo-carousel__circle
  bat-demo-carousel__title
```

Iyilestirme onerileri:

- Dairelerin bos gri placeholder kalmasi engellenmeli.
- Her related item hero image ile degil, okunakli cover image ile beslenmeli.
- Back button `/bat-demo/projects/` route'una donmeli. Su an `navigateTo("/projects")` var; BAT demo index eklenince bu hedef degismeli.
- Mobile'da title hover'a bagli kalmamali, gorunur olmali.

## Detay Sayfasi Icerik Modeli

Mevcut `buildBatProjectPageModel` iyi bir katman:

```text
project
content
displayTitles
hero
editorialText
featureMedia
relatedProjects
extraSections
```

Bu model uzerine su alanlar eklenebilir:

```ts
type BatNarrativeBlock =
  | { kind: 'image'; image: ProjectImage; size: 'wide' | 'contained' }
  | { kind: 'text'; title?: string; paragraphs: string[]; columns: 2 | 3 }
  | { kind: 'quote'; text: string }
  | { kind: 'gallery'; images: ProjectImage[]; layout: 'offset-2' | 'mosaic' };
```

Ama bunu hemen eklemek zorunlu degil. Ilk hedef liste sayfasini ve mevcut detay sayfasina donus linkini dogru baglamak.

## Faz 03 Kabul Kriterleri

- Detay sayfasinin BAT referansindaki blok sirasi belgelendi.
- Mevcut `BatProjectDemo.tsx` parcalari referans bloklarla eslestirildi.
- Hero markup'inin hassas GSAP selector'lari kayda alindi.
- Related projects geri donus hedefinin `/bat-demo/projects/` olmasi gerektigi belirlendi.
- Supplementary sections'in kontrollu ve veri kalite bagimli acilmasi kararlastirildi.

