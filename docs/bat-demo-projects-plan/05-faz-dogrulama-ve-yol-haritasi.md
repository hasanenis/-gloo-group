# Faz 05 - Dogrulama, Riskler ve Uzun Soluklu Yol Haritasi

Bu faz, uygulama sonrasinda neyin nasil dogrulanacagini ve uzun vadede hangi iyilestirmelerin hangi sirayla alinacagini tanimlar.

## Komut Dogrulamasi

Dokuman degisikligi disinda kod yazildiginda standart kontroller:

```powershell
npm run lint
npm run build
```

Gorsel veya animasyon degisikligi varsa:

```powershell
npm run dev
```

Manuel URL'ler:

```text
http://localhost:3000/bat-demo/projects/
http://localhost:3000/bat-demo/projects/<valid-slug>
http://localhost:3000/projects
```

Kontrol edilecek temel durumlar:

- `/bat-demo/projects/` bos sayfa veya fallback-only sayfa gibi davranmiyor.
- Proje sayisi ve filtre count'i tutarli.
- Grid, Gallery, List mode gecisleri console error uretmiyor.
- Karttan detay sayfasina gecis transition ile calisiyor.
- Detaydan geri donus BAT demo index'e gidiyor.
- `/projects` eski klasik grid davranisini koruyor.

## Gorsel QA Matrisi

Desktop:

```text
1440 x 900
1280 x 720
1920 x 1080
```

Tablet:

```text
1024 x 768
834 x 1112
```

Mobile:

```text
390 x 844
430 x 932
375 x 667
```

Her viewport icin bakilacaklar:

- Header filtre barini ezmiyor.
- Filter/mode satiri title veya count ile ust uste binmiyor.
- Grid kartlari layout shift uretmiyor.
- Image aspect ratio sabit.
- Long project title container disina tasmiyor.
- Mobile'da hover'a bagli bilgi kaybolmuyor.
- Gallery hit zone veya butonlar erisilebilir.
- List preview image mobile'da gereksiz alan kaplamiyor.

## Animasyon QA

GSAP ve transition tarafinda kontrol listesi:

```text
[ ] Page enter animasyonu tek kez calisiyor.
[ ] Filter degisiminde eski card reveal state'i bozulmuyor.
[ ] Mode degisiminde scroll position beklenmedik ziplamiyor.
[ ] Detail navigation sirasinda body overflow kilidi takili kalmiyor.
[ ] Custom cursor desktop'ta calisiyor, mobile'da devre disi.
[ ] Reduced motion kullanicisinda temel navigation calisiyor.
[ ] Header z-index transition layer'in altinda kalmiyor.
[ ] Dev server hot reload sonrasi stale GSAP timeline kalmiyor.
```

## Risk Matrisi

| Risk | Etki | Onlem |
| --- | --- | --- |
| `/bat-demo/projects/` route eksigi | URL bos veya beklenmeyen sayfa gibi gorunur | Ilk is olarak index route ekle |
| GSAP selector kirilmasi | Hero/detail animasyonlari bozulur | `BatProjectDemo` hero markup'ini genis rewrite etme |
| `ProjectsDemo` ile BAT index karismasi | Klasik `/projects` bozulur | Yeni `BatProjectsIndex.tsx` ile izole basla |
| Mode switch fazla karmasiklasir | Gec teslim ve bug artisi | Once Grid, sonra List, en son Gallery |
| Image preload agirligi | Ilk yukleme yavaslar | Sadece ilk viewport ve transition hedefini eager/preload yap |
| Long titles mobile'da tasar | Profesyonel gorunum bozulur | Line-height, max-width, responsive font clamp ve wrap testleri |
| Related carousel bos placeholder | Detay sayfasi eksik gorunur | Related item image fallback zinciri kur |
| Supplementary sections veri zayifligi | Gereksiz uzun ve tekrarli sayfa | Proje bazli flag veya curated block modeli kullan |

## Uzun Soluklu 5 Asamali Yol Haritasi

### Asama 1 - Parite Temeli

Hedef: BAT referansinin yapisal olarak ne yaptigini Igloo'da calisan route ve grid ile temsil etmek.

Teslimler:

- `/bat-demo/projects/` route.
- `BatProjectsIndex.tsx`.
- Asimetrik grid.
- Typology filtre.
- Count.
- Detail transition.

Basari olcutu:

```text
Kullanici /bat-demo/projects/ acinca BAT referansina yakin, sade, image-driven bir Igloo proje listesi gorur.
```

### Asama 2 - Coklu Gorunum

Hedef: BAT'in `Grid / Gallery / List` mode mantigini Igloo data ile calistirmak.

Teslimler:

- Mode segmented control.
- List view.
- Gallery view.
- Keyboard/focus davranisi.
- Mode transition polish.

Basari olcutu:

```text
Ayni proje dataset'i uc farkli tarama ritmine gecer ve hicbiri digerini bozmaz.
```

### Asama 3 - Detay Sayfasi Geri Baglantisi

Hedef: Liste ve detay sayfalari tek BAT demo deneyimi gibi davranir.

Teslimler:

- Detail back CTA `/bat-demo/projects`.
- Related carousel image fallback.
- Detail hero + editorial + media bloklarinda visual QA.
- Page transition state cleanup.

Basari olcutu:

```text
Liste -> detay -> liste dongusu akici ve ayni tasarim dilinde hissedilir.
```

### Asama 4 - Narrative Blocks

Hedef: BAT detay sayfalarindaki uzun editorial/gorsel blok ritmini Igloo projelerine kontrollu eklemek.

Teslimler:

- Optional narrative block modeli.
- Feature gallery veya mosaic block.
- Quote veya highlight block.
- Proje bazli block visibility.

Basari olcutu:

```text
Her proje ayni sablonun kopyasi gibi degil, kendi gorsel ve teknik derinligiyle akar.
```

### Asama 5 - Sertlestirme ve Yayina Hazirlik

Hedef: Performans, responsive, accessibility ve animasyon kararliligini tamamlamak.

Teslimler:

- Full responsive screenshot QA.
- `npm run lint`.
- `npm run build`.
- Console error taramasi.
- Image loading strategy.
- Reduced motion audit.
- Route regression check.

Basari olcutu:

```text
BAT demo proje deneyimi hem gorsel olarak guclu hem de teknik olarak kirilgan olmayan bir yayina hazir seviyeye gelir.
```

## Final Kabul Listesi

```text
[ ] /bat-demo/projects/ route calisiyor.
[ ] Liste sayfasi Igloo data kullaniyor.
[ ] Grid view BAT asimetrisini tasiyor.
[ ] Gallery view calisiyor veya kontrollu olarak sonraki asamada kapali.
[ ] List view calisiyor veya kontrollu olarak sonraki asamada kapali.
[ ] Typology filter calisiyor.
[ ] Proje count dogru.
[ ] Detail transition calisiyor.
[ ] Detail back target dogru.
[ ] Desktop screenshot temiz.
[ ] Mobile screenshot temiz.
[ ] npm run lint basarili.
[ ] npm run build basarili.
```

## Notlar

Bu yol haritasi, BAT referansini birebir klonlama plani degildir. Asil hedef, BAT'in iyi calisan kararlarini Igloo'nun proje verisine ve mevcut animasyon sistemine yerlestirmek:

- Liste sayfasi: sade, image-first, mode/filter kontrollu.
- Detay sayfasi: full-bleed hero, net meta, editorial okumaya alan acan beyaz bloklar.
- Gecisler: proje kartindan hero'ya akici ve kontrollu.
- Kimlik: Igloo siyah/beyaz/kirmizi aksani, BAT degil Igloo hissi.

