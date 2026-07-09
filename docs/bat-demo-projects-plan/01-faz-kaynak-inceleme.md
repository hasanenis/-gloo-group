# Faz 01 - Kaynak Inceleme ve Kanit Haritasi

Bu dosya, `C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output` klasorundeki BAT referans ciktilarinin bizim Igloo Construction BAT demo yuzeyine nasil okunacagini kayda alir. Amac kopyalamak degil, BAT'in proje listeleme ve proje detay sayfalarindaki yapisal kararlarini Igloo'nun mevcut React, GSAP ve Tailwind tabanli mimarisine yedirmek.

## Kaynak Envanteri

Referans klasoru dort ana tur veri iceriyor:

- `summary.json`: 26 sayfalik ust ozet. 1 liste sayfasi ve 25 proje detay sayfasi var.
- `urls.txt`: yakalanan kaynak URL listesi.
- `data/*.json`: her sayfa icin baslik, aciklama, linkler, image listesi ve metadata.
- `html/*.html`: Nuxt tarafindan render edilmis sayfa HTML'i.
- `mhtml/*.mhtml`: sayfanin arsivlenmis paketi.
- `screenshots/*.png`: liste ve detay sayfalarinin full page gorsel kayitlari.

Referans liste sayfasi:

```text
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\screenshots\new_bat_archi_projects.png
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\data\new_bat_archi_projects.json
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\html\new_bat_archi_projects.html
```

Temsilci detay sayfalari:

```text
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\screenshots\new_bat_archi_projects_the-loop.png
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\screenshots\new_bat_archi_projects_jo-house.png
C:\Users\hasan\new-bat-archi-mirror\bat-playwright-output\screenshots\new_bat_archi_projects_hampton-by-hilton.png
```

## Sayfa Topolojisi

BAT liste sayfasi gorunurde cok sade, ama DOM tarafinda uc gorunumu ayni sayfada tasiyor:

```text
[preload]
[fixed header + menu]
[projects page]
  [projects nav]
    [mobile filter header]
    [desktop filter container]
      [mode: Grid / Gallery / List]
      [typology: All / Consultancy / Culture & Education / ...]
      [total: (25)]
  [project view]
    [view 0: asymmetric grid]
    [view 1: list with title column + selected image]
    [view 2: gallery slider]
[footer]
[transition layer]
  [25 hidden hero images keyed by project slug]
[cookie bar]
```

Detay sayfalarinda ortak omurga su:

```text
[fixed header]
[100svh-ish hero image]
  [large pretitle + title over image]
  [bottom project info tab]
  [metadata grid]
[white editorial section]
  [left title]
  [right 2 or 3 text columns]
[media and content rhythm]
  [large image]
  [text/image pairs]
  [optional quote]
  [optional gallery]
[related projects]
  [large circular cards]
[footer]
```

## Onemli Kanitlar

`summary.json` okumasindan cikan genel tablo:

- Liste sayfasi title: `Projects | BAT Architecture`.
- Liste sayfasinda `h1` bos. Sayfa basligi klasik hero olarak degil, filtre ve proje grid'i uzerinden kuruluyor.
- Liste sayfasi `imageCount: 101`. Bu sayi sadece grid kartlarini degil, duplicate kaynaklari ve transition hero preload imajlarini da kapsiyor.
- Detay sayfalari proje basina 12 ile 36 arasi image kaydi tasiyor.
- 25 proje linki var ve ayni 25 proje liste, gallery, list ve transition layer icinde tekrar kullaniliyor.

HTML sinif yogunlugu, sayfanin ana niyetini dogruluyor:

```text
project__grid__item            25
project__list__item            25
project__item                  25
hero__imgwrp                   25
project__filter--js            125
project__filter--js2           25
slide__marker                  25
slideN                         25
```

Bu, tek gorunumlu kart grid'inden daha fazlasini hedeflememiz gerektigini gosteriyor: ayni proje dataset'i uc farkli temsil biciminde yasayabilmeli.

## Proje Listesi

BAT referansinda yakalanan 25 proje sirasi:

1. The Loop
2. U16 House
3. OMA Baserria
4. Hampton by Hilton
5. IB House
6. Altos Reales I
7. Cuenca Healthcare Centre
8. Zurbaran School
9. GOe, Gastronomy Open Ecosystem
10. Jo House
11. Tennis Academy
12. Antzuola School
13. Bypillow Boutique Hotel
14. 36 housing units in Vitoria-Gasteiz
15. AH House
16. Lancor Headquarters
17. A4 House
18. 84 social housing units
19. SIWA Clinic
20. L10 House
21. Negresco Hotel
22. Ciudad Real Healthcare Centre
23. Urretxindorra School
24. E8 House
25. E22 Renovation

Igloo tarafinda bu isimler aynen alinmayacak. Bunlar grid ritmi, kolon dizisi, transition davranisi ve detay sayfasi blok sirasini anlamak icin referans.

## Bizim Mevcut Durum

Kod tarafindaki kritik dosyalar:

```text
src/App.tsx
src/pages/ProjectsDemo.tsx
src/pages/BatProjectDemo.tsx
src/data/projects.ts
src/data/batProjectModel.ts
src/data/projectContent.ts
src/styles/bat-demo.css
src/transitions/batPageTransition.ts
```

Mevcut route tablosunda su var:

```text
/projects                  -> ProjectsDemo
/projects/:slug            -> ProjectDetail
/projects1                 -> Projects
/bat-demo/projects/:slug   -> BatProjectDemo
```

Eksik olan:

```text
/bat-demo/projects/        -> BAT demo liste index sayfasi yok
```

Vite `http://localhost:3000/bat-demo/projects/` icin HTML fallback donduruyor, fakat React Router tarafinda index element olmadigi icin hedef sayfa semantik olarak tanimli degil. Bu, Faz 04'te ilk route degisikligi olarak ele alinmali.

## Mevcut Igloo Yuzeyinin BAT'a Yaklasan Noktalari

`ProjectsDemo.tsx` zaten su temelleri sagliyor:

- `projects` dataset'ini kullaniyor.
- Sector filtreleme var.
- Grid kartlari var.
- Karttan `/bat-demo/projects/:slug` detay rotasina geciste `runBatPageTransition` kullaniyor.
- `buildBatProjectPageModel` ile detay hero imajini preload ediyor.

`BatProjectDemo.tsx` su temelleri sagliyor:

- BAT benzeri fixed header, overlay menu, custom cursor ve preloader var.
- Hero image, hero title, project info meta grid'i ve editorial section var.
- Related projects circular carousel var.
- GSAP animasyonlari class selector uzerinden kurulmus.

Eksik veya yarim kalan alanlar:

- Liste sayfasi BAT demo rotasinda yok.
- Liste sayfasi henuz `Grid / Gallery / List` mode sistemine sahip degil.
- `ProjectsDemo.tsx` klasik kart grid'i kullaniyor; BAT'in asimetrik 16 kolon dizisi yok.
- `BatProjectDemo.tsx` icinde `showSupplementarySections = false`; detay sayfalarinin uzun blok ritmi su an kapali.
- `BatProjectDemo` icindeki header, menu, cursor ve footer liste sayfasi ile paylasilabilir hale getirilmemis.

## Faz 01 Ciktisi

Bu fazin ciktisi bir karar matrisi:

```text
BAT referansindan alinacaklar:
  - filter/mode ust nav mimarisi
  - asimetrik grid kolon ritmi
  - gallery ve list alternatifleri
  - slug keyed transition hero preload mantigi
  - detay sayfasi hero + meta + editorial + media + related omurgasi

Igloo kimligiyle korunacaklar:
  - Igloo proje dataset'i
  - siyah/beyaz + kirmizi vurgu dili
  - mevcut GSAP page transition sistemi
  - React Router route yapisi
  - `buildBatProjectPageModel` veri donusturme katmani

Kacinilacaklar:
  - BAT markasinin birebir kopyasi
  - Nuxt siniflarinin dogrudan tasinmasi
  - mevcut animasyon selector'larini kiracak genis refactor
  - tek seferde hem listeyi hem detaylari bastan yazmak
```

## Faz 01 Kabul Kriterleri

- Kaynak klasorundeki liste, detay, data, html ve screenshot rolleri anlasildi.
- `/bat-demo/projects/` icin index route eksigi kayda alindi.
- BAT liste sayfasinin uc gorunumlu yapisi belgelendi.
- BAT detay sayfalarinin ortak blok ritmi belgelendi.
- Sonraki fazlarda uygulanacak kararlar Igloo dosya yapisina baglandi.

