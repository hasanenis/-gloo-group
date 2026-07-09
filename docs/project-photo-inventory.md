# Proje Fotoğraf Envanteri

Bu dosya `npm run catalog:images` ile üretilir.

Ham kaynak klasörlerindeki her proje fotoğrafını public web dosyası, sitedeki gerçek kullanım yeri ve kullanılmayan fotoğraf klasörüyle eşleştirir.

## Özet

- Kullanılan proje fotoğrafı: 89
- `public/projects/_unused-by-project/` altına kopyalanan kullanılmayan public fotoğraf: 37
- Kullanımda olup public dosyası eksik kalan referans: 0
- Kaynakta olup public'e aktarılmayan fotoğraf: 0
- Kataloglanan eski `public/Upscaled` dosyası: 215

## Kullanım Yerleri

| Slot | Route | Kod | Anlamı |
| --- | --- | --- | --- |
| Hero | `/projects/:slug, /bat-demo/projects/:slug` | `src/pages/ProjectDetail.tsx, src/data/batProjectModel.ts` | Detay sayfası hero sliderı ve BAT model hero/cover kaynağı. |
| Intro | `/projects/:slug` | `src/pages/ProjectDetail.tsx` | Detay sayfası giriş bölümü ana görseli. |
| Mosaic | `/projects/:slug` | `src/pages/ProjectDetail.tsx` | Detay sayfası mozaik galeri bölümü. |
| Feature gallery | `/projects/:slug, /bat-demo/projects/:slug` | `src/pages/ProjectDetail.tsx, src/data/batProjectModel.ts` | Detay sayfası context/feature galerisi; ilk görsel büyük lead olarak da kullanılır. |
| Construction gallery | `/projects/:slug` | `src/pages/ProjectDetail.tsx` | Detay sayfası construction/progress galerisi. |
| Featured card | `/, /projects/:slug` | `src/components/FeaturedProjects.tsx, src/pages/ProjectDetail.tsx` | Ana sayfa Featured Projects kartı ve detay sayfası related project kartları. |

## Projeler

### Bas Mazagran

- Proje slug: `bas-mazagran-200-38-housing`
- Başlık: 200 Assisted Housing and 38 Free Promotional Housing Units
- Lokasyon: Bas Mazagran, Mostaganem
- Durum: Current
- Kaynak fotoğraf klasörü: `mostaghanem`
- Kaynak form: `Mostaganem.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 1

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/01-mostaganem-1.webp` | `mostaganem .1.jpg` | Construction gallery #1 (/projects/:slug) | Excavation work in progress at the Bas Mazagran housing project. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/02-mostaganem-2.webp` | `mostaganem .2.jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Excavation and early construction at the Bas Mazagran housing project. |
| Kullanılmıyor | `/projects/bas-mazagran-200-38-housing/03-mostaganem-1.webp` | `mostaganem (1)...jpg` | - | Early construction phase with earthworks and cranes on site. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/04-mostaganem-1.webp` | `mostaganem (1).jpg` | Intro #1 (/projects/:slug) | Earthworks and cranes on a housing project construction site. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/05-mostaganem-2.webp` | `mostaganem (2).jpg` | Mosaic #2 (/projects/:slug) | Earthworks in progress with an excavator and workers on site. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/06-mostaganem-3.webp` | `mostaganem (3)...jpg` | Mosaic #3 (/projects/:slug) | Material delivery and active construction at the Bas Mazagran site. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/07-mostaganem-3.webp` | `mostaganem (3).jpg` | Construction gallery #2 (/projects/:slug) | Material delivery and ongoing construction at the Bas Mazagran housing project. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/08-mostaganem-4.webp` | `mostaganem (4)....jpg` | Mosaic #1 (/projects/:slug) | Excavation and groundwork in progress at the Bas Mazagran housing development. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/09-mostaganem-4.webp` | `mostaganem (4).jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Excavation in progress at the Bas Mazagran housing project. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/10-mostaghanem-1.webp` | `mostaghanem ..1.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Progress on the Bas Mazagran housing units. |
| Kullanılıyor | `/projects/bas-mazagran-200-38-housing/11-mostaghanem-3.webp` | `mostaghanem 3.jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Construction progress of housing units with a tower crane. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image37.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image38.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image39.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Boudouaou

- Proje slug: `boudouaou-70-10-housing`
- Başlık: 70 Assisted Housing and 10 Free Promotional Housing Units
- Lokasyon: Boudouaou, Boumerdes
- Durum: Current
- Kaynak fotoğraf klasörü: `boudouaou`
- Kaynak form: `BOUDOUAOU.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 15

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/01-boudouaou-1.webp` | `boudouaou (1).jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Residential buildings in Boudouaou showing construction progress with finished and unfinished facades. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/02-boudouaou-2.webp` | `boudouaou (2).jpg` | - | Residential buildings under construction with a crane at Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/03-boudouaou-2-0.webp` | `boudouaou (2)0.jpg` | - | Construction progress on residential buildings with a tower crane. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/04-boudouaou-3.webp` | `boudouaou (3)..jpg` | - | New housing units under construction in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/05-boudouaou-3.webp` | `boudouaou (3).jpg` | - | Residential buildings under construction at Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/06-boudouaou-4.webp` | `boudouaou (4)..jpg` | - | Cranes oversee the construction of new housing units in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/07-boudouaou-4.webp` | `boudouaou (4).jpg` | - | Active construction of residential units with tower cranes. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/08-boudouaou-6.webp` | `boudouaou (6)..jpg` | - | Progress on the Boudouaou housing units, showcasing both finished and raw concrete facades. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/09-boudouaou-6.webp` | `boudouaou (6).jpg` | - | Residential buildings under construction, Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/10-boudouaou-7.webp` | `boudouaou (7)..jpg` | Mosaic #3 (/projects/:slug) | Construction progress at Boudouaou, featuring multiple residential blocks and a towering crane. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/11-boudouaou-7.webp` | `boudouaou (7).jpg` | - | Ongoing construction of residential units in Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/12-whatsapp-image-2025-11-12-a-14-52-45-16dbaed6.webp` | `WhatsApp Image 2025-11-12 à 14.52.45_16dbaed6.jpg` | Mosaic #1 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Modern housing units nearing completion in Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/13-whatsapp-image-2025-11-12-a-14-52-45-8e4328b8.webp` | `WhatsApp Image 2025-11-12 à 14.52.45_8e4328b8.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Modern residential buildings nearing completion. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/14-whatsapp-image-2025-11-12-a-14-52-45-bdcbcd8b.webp` | `WhatsApp Image 2025-11-12 à 14.52.45_bdcbcd8b.jpg` | - | Modern residential building under construction in Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/15-whatsapp-image-2025-11-12-a-14-52-46-3206f724.webp` | `WhatsApp Image 2025-11-12 à 14.52.46_3206f724.jpg` | Construction gallery #2 (/projects/:slug) | Modern residential building nearing completion in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/16-whatsapp-image-2025-11-12-a-14-52-46-88d948d6.webp` | `WhatsApp Image 2025-11-12 à 14.52.46_88d948d6.jpg` | - | Multi-story residential buildings under construction at Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/17-whatsapp-image-2025-11-12-a-14-52-46-9674e10d.webp` | `WhatsApp Image 2025-11-12 à 14.52.46_9674e10d.jpg` | Intro #1 (/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Modern residential buildings nearing completion. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/18-whatsapp-image-2025-11-12-a-14-52-46-fe914217.webp` | `WhatsApp Image 2025-11-12 à 14.52.46_fe914217.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Modern housing units nearing completion at Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/19-whatsapp-image-2025-11-12-a-14-52-47-3c32ef3d.webp` | `WhatsApp Image 2025-11-12 à 14.52.47_3c32ef3d.jpg` | Mosaic #2 (/projects/:slug) | Construction progress of residential units in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/20-whatsapp-image-2025-11-12-a-14-52-47-4866d8ca.webp` | `WhatsApp Image 2025-11-12 à 14.52.47_4866d8ca.jpg` | - | Newly built residential units at Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/21-whatsapp-image-2025-11-12-a-14-52-47-8581eb4a.webp` | `WhatsApp Image 2025-11-12 à 14.52.47_8581eb4a.jpg` | - | Modern residential units nearing completion in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/22-whatsapp-image-2025-11-12-a-14-52-48-1f246636.webp` | `WhatsApp Image 2025-11-12 à 14.52.48_1f246636.jpg` | - | Modern housing units nearing completion in Boudouaou. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/23-whatsapp-image-2025-11-12-a-14-52-48-9f71d272.webp` | `WhatsApp Image 2025-11-12 à 14.52.48_9f71d272.jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug) | Exterior view of the newly constructed residential building in Boudouaou. |
| Kullanılmıyor | `/projects/boudouaou-70-10-housing/24-whatsapp-image-2025-11-12-a-14-52-49-1fb420cc.webp` | `WhatsApp Image 2025-11-12 à 14.52.49_1fb420cc.jpg` | - | Construction progress at Boudouaou: new housing units taking shape. |
| Kullanılıyor | `/projects/boudouaou-70-10-housing/25-whatsapp-image-2025-11-12-a-14-52-49-5ca31f0b.webp` | `WhatsApp Image 2025-11-12 à 14.52.49_5ca31f0b.jpg` | Construction gallery #1 (/projects/:slug) | Progress on the Boudouaou housing development. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image46.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image47.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image48.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image49.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Dely Brahim

- Proje slug: `dely-brahim-240-housing`
- Başlık: 240 Free Promotional Housing with Commercial Areas
- Lokasyon: Dely Brahim, Algiers
- Durum: Current
- Kaynak fotoğraf klasörü: `dely brahim`
- Kaynak form: `Dely brahim.docx`
- Kullanılan: 4
- Kullanılmayan kopya: 0

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/dely-brahim-240-housing/01-final-1.webp` | `FINAL 1.png` | Mosaic #1 (/projects/:slug)<br>Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #2 (/projects/:slug) | Modern mixed-use building at night with vibrant commercial frontage. |
| Kullanılıyor | `/projects/dely-brahim-240-housing/02-final-2.webp` | `FINAL 2.png` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Modern mixed-use building with illuminated commercial and residential units at night. |
| Kullanılıyor | `/projects/dely-brahim-240-housing/03-final-3.webp` | `FINAL 3.png` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #2 (/projects/:slug)<br>Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #1 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Modern mixed-use building with residential, commercial, and parking at night. |
| Kullanılıyor | `/projects/dely-brahim-240-housing/04-final-4.webp` | `FINAL 4.png` | Intro #1 (/projects/:slug)<br>Mosaic #3 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Modern high-rise with illuminated commercial and residential units at night. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image6.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image35.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image36.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Douaouda Housing

- Proje slug: `douaouda-300-500-housing`
- Başlık: 300/500 Assisted Promotional Housing
- Lokasyon: Douaouda
- Durum: Completed
- Kaynak fotoğraf klasörü: `douaouda`
- Kaynak form: `douaouda.docx`
- Kullanılan: 5
- Kullanılmayan kopya: 0

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/douaouda-300-500-housing/01-douaouda-1.webp` | `douaouda 1.jpg` | Intro #1 (/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Newly completed residential buildings in Douaouda. |
| Kullanılıyor | `/projects/douaouda-300-500-housing/02-douaouda-2.webp` | `douaouda 2.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #2 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #2 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Structural work in progress on residential buildings. |
| Kullanılıyor | `/projects/douaouda-300-500-housing/03-douaouda.webp` | `douaouda.jpg` | Mosaic #1 (/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Newly completed residential buildings with ongoing site work. |
| Kullanılıyor | `/projects/douaouda-300-500-housing/04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.webp` | `WhatsApp Image 2025-11-10 à 11.58.44_45910f32.jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #3 (/projects/:slug)<br>Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #1 (/projects/:slug) | Structural works underway at the Douaouda residential project. |
| Kullanılıyor | `/projects/douaouda-300-500-housing/05-whatsapp-image-2025-11-10-a-11-58-44-e480efaf.webp` | `WhatsApp Image 2025-11-10 à 11.58.44_e480efaf.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Completed residential buildings in Douaouda with ongoing site work. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image8.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image9.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image10.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Douira Centres

- Proje slug: `douira-commercial-centers-2500-housing`
- Başlık: Commercial Centres for 2,500 Housing Units
- Lokasyon: Douira, Algiers
- Durum: Completed
- Kaynak fotoğraf klasörü: `douira`
- Kaynak form: `Rahmania.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 6

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/01-1.webp` | `1.jpg` | - | Rooftop glass skylights of a commercial center. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/02-img-20251112-wa0001.webp` | `IMG-20251112-WA0001.jpg` | Mosaic #3 (/projects/:slug)<br>Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Architectural skylight detail at the commercial center. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/03-img-20251112-wa0002.webp` | `IMG-20251112-WA0002.jpg` | Construction gallery #1 (/projects/:slug) | Architectural detail: Glass skylight on a commercial center rooftop. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/04-img-20251112-wa0003.webp` | `IMG-20251112-WA0003.jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Modern glass skylight installation at the commercial center. |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/05-img-20251112-wa0004.webp` | `IMG-20251112-WA0004.jpg` | - | Modern glass pyramid skylight on a commercial center rooftop with residential buildings. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/06-rahmania-1.webp` | `rahmania (1)...jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Newly completed commercial unit interior. |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/07-rahmania-1.webp` | `rahmania (1).jpg` | - | Modern commercial interior nearing completion. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/08-rahmania-2.webp` | `rahmania (2)...jpg` | Construction gallery #2 (/projects/:slug) | Commercial center and residential buildings in Douira, Algiers. |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/09-rahmania-2.webp` | `rahmania (2).jpg` | - | Commercial center and residential towers in Douira, Algiers. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/10-rahmania-3.webp` | `rahmania (3)...jpg` | Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Twin curved staircases in a commercial center lobby during the finishing phase. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/11-rahmania-3.webp` | `rahmania (3).jpg` | Mosaic #2 (/projects/:slug) | Interior view of the commercial center featuring curved staircases during finishing. |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/12-whatsapp-image-2025-11-12-at-15-18-39.webp` | `WhatsApp Image 2025-11-12 at 15.18.39.jpeg` | - | Modern curved staircase with granite steps and stainless steel railings in a commercial center. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/13-whatsapp-image-2025-11-12-at-15-19-49.webp` | `WhatsApp Image 2025-11-12 at 15.19.49.jpeg` | Intro #1 (/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Modern interior of a commercial center with a multi-level staircase. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/14-whatsapp-image-2025-11-12-at-15-20-30.webp` | `WhatsApp Image 2025-11-12 at 15.20.30.jpeg` | Mosaic #1 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug) | Elegant curved staircase in a new commercial center. |
| Kullanılmıyor | `/projects/douira-commercial-centers-2500-housing/15-whatsapp-image-2025-11-12-at-15-22-43.webp` | `WhatsApp Image 2025-11-12 at 15.22.43.jpeg` | - | Modern commercial center integrated with residential towers. |
| Kullanılıyor | `/projects/douira-commercial-centers-2500-housing/16-whatsapp-image-2025-11-12-at-15-23-03.webp` | `WhatsApp Image 2025-11-12 at 15.23.03.jpeg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug) | Completed commercial center serving a large residential development. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image17.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image19.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image20.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image21.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Reghaia

- Proje slug: `reghaia-bouraada-250-housing`
- Başlık: 250 Housing Units with Commercial Rental and Concierge Services
- Lokasyon: Bouraada Site, Reghaia, Algiers Province
- Durum: Current
- Kaynak fotoğraf klasörü: `reghaia`
- Kaynak form: `reghaia.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 7

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/01-img-20251111-wa0023.webp` | `IMG-20251111-WA0023.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Modern residential building facade nearing completion. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/02-img-20251111-wa0024.webp` | `IMG-20251111-WA0024.jpg` | Intro #1 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Modern residential building with yellow and black accents under construction. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/03-img-20251111-wa0025.webp` | `IMG-20251111-WA0025.jpg` | - | Modern residential building facade with yellow and black accents. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/04-img-20251111-wa0026.webp` | `IMG-20251111-WA0026.jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Modern residential building under construction with distinctive facade. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/05-img-20251111-wa0027.webp` | `IMG-20251111-WA0027.jpg` | - | Modern residential facade nearing completion. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/06-img-20251111-wa0028.webp` | `IMG-20251111-WA0028.jpg` | Mosaic #3 (/projects/:slug) | Modern residential building with striking facade under construction. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/07-reghaia-1.webp` | `reghaia 1.jpg` | - | Progress on the residential units at Bouraada, with finishing touches underway. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/08-reghaia-2.webp` | `reghaia 2.jpg` | - | Progress at Bouraada: Exterior finishing underway for new housing units. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/09-reghaia-2.webp` | `reghaia 2.png` | - | Modern residential building with commercial spaces nearing completion. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/10-reghaia-3.webp` | `reghaia 3..jpg` | Construction gallery #1 (/projects/:slug) | Construction progress at Bouraada site, featuring a tower crane and multi-story buildings. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/11-reghaia-3.webp` | `reghaia 3.jpg` | - | Modern residential building nearing completion. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/12-reghaia-3d.webp` | `reghaia 3d .png` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Vision of the Bouraada housing and commercial complex. |
| Kullanılmıyor | `/projects/reghaia-bouraada-250-housing/13-reghaia-3d-1.webp` | `reghaia 3d 1.png` | - | Abstract facade design for the Bouraada project. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/14-reghaia-3d-2.webp` | `reghaia 3d 2.png` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Architectural rendering of the Bouraada housing project. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/15-reghaia-4.webp` | `reghaia 4.jpg` | Construction gallery #2 (/projects/:slug) | Modern residential building exterior under construction. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/16-reghaia.webp` | `reghaia...jpg` | Mosaic #2 (/projects/:slug) | Progress on the new housing units at Bouraada site. |
| Kullanılıyor | `/projects/reghaia-bouraada-250-housing/17-reghaia.webp` | `reghaia.jpg` | Mosaic #1 (/projects/:slug) | Construction progress at Bouraada site, showing a tower crane and building frames. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image43.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image44.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image45.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image40.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Rouiba Villas

- Proje slug: `rouiba-4-promotional-villas`
- Başlık: 4 Promotional Villas and Network Works
- Lokasyon: Rouiba
- Durum: Completed
- Kaynak fotoğraf klasörü: `rouiba`
- Kaynak form: `Rouiba.docx`
- Kullanılan: 5
- Kullanılmayan kopya: 0

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/rouiba-4-promotional-villas/01-whatsapp-image-2025-11-12-at-09-00-02.webp` | `WhatsApp Image 2025-11-12 at 09.00.02.jpeg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #2 (/projects/:slug)<br>Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #1 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Modern promotional villa exterior. |
| Kullanılıyor | `/projects/rouiba-4-promotional-villas/02-whatsapp-image-2025-11-12-at-09-00-03-1.webp` | `WhatsApp Image 2025-11-12 at 09.00.03 (1).jpeg` | Mosaic #1 (/projects/:slug) | Modern villa nearing completion amidst construction activity. |
| Kullanılıyor | `/projects/rouiba-4-promotional-villas/03-whatsapp-image-2025-11-12-at-09-00-03-2.webp` | `WhatsApp Image 2025-11-12 at 09.00.03 (2).jpeg` | Intro #1 (/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Construction progress on a promotional villa site in Rouiba. |
| Kullanılıyor | `/projects/rouiba-4-promotional-villas/04-whatsapp-image-2025-11-12-at-09-00-03.webp` | `WhatsApp Image 2025-11-12 at 09.00.03.jpeg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Modern promotional villa exterior with crane. |
| Kullanılıyor | `/projects/rouiba-4-promotional-villas/05-whatsapp-image-2025-11-12-at-09-00-04.webp` | `WhatsApp Image 2025-11-12 at 09.00.04.jpeg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #3 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #2 (/projects/:slug) | Modern villas nearing completion in Rouiba, showcasing contemporary design. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image27.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image28.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image29.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image30.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Said Hamdine

- Proje slug: `said-hamdine-mixed-real-estate`
- Başlık: Mixed Real Estate Complex with 202 Free Promotional Housing
- Lokasyon: Said Hamdine, Bir Mourad Rais, Algiers
- Durum: Completed
- Kaynak fotoğraf klasörü: `sidi yahia`
- Kaynak form: `said hamdine.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 0

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/01-12.webp` | `12.jpg` | Mosaic #1 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Foundation work in progress with rebar installation. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/02-sidi-yahia-1.webp` | `sidi yahia (1).jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug) | Contemporary urban living with sleek design. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/03-sidi-yahia-2.webp` | `sidi yahia (2).jpg` | Mosaic #2 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug) | Enjoy outdoor living on this stylish balcony. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/04-sidi-yahia-3.webp` | `sidi yahia (3).jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Spacious and modern hallway connecting various rooms. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/05-sidi-yahia-5.webp` | `sidi yahia (5).jpg` | Mosaic #3 (/projects/:slug) | Contemporary mixed-use building facade at dusk or dawn. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/06-sidi-yahia-1.webp` | `sidi yahia 1.jpg` | Construction gallery #1 (/projects/:slug) | Progress on the Sidi Yahia development, showcasing structural work. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/07-sidi-yahia-2.webp` | `sidi yahia 2.jpg` | Intro #1 (/projects/:slug) | Rebar installation on a construction site at sunset. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/08-whatsapp-image-2025-11-10-a-11-58-42-119fe026.webp` | `WhatsApp Image 2025-11-10 à 11.58.42_119fe026.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Rebar installation on a construction site at sunset. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/09-whatsapp-image-2025-11-10-a-11-58-42-7f866443.webp` | `WhatsApp Image 2025-11-10 à 11.58.42_7f866443.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Foundation work in progress with rebar installation. |
| Kullanılıyor | `/projects/said-hamdine-mixed-real-estate/10-whatsapp-image-2025-11-10-a-11-58-42-fb5a4508.webp` | `WhatsApp Image 2025-11-10 à 11.58.42_fb5a4508.jpg` | Construction gallery #2 (/projects/:slug) | Multi-story building under construction with concrete frame and brickwork. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image22.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image4.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image5.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image2.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Sidi Abdallah

- Proje slug: `sidi-abdallah-200-1200-housing`
- Başlık: 200/1200 Promotional Public Housing
- Lokasyon: Sidi Abdallah - Mahalma
- Durum: Completed
- Kaynak fotoğraf klasörü: `sidi abdellah`
- Kaynak form: `sidi abdellah.docx`
- Kullanılan: 7
- Kullanılmayan kopya: 0

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/01-1.webp` | `1.jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Modern public housing architecture with distinctive facade and balconies. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/02-13.webp` | `13.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Modern public housing buildings with ongoing site work. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/03-sidi-abdullah-lpp-1.webp` | `sidi abdullah lpp (1).jpg` | Mosaic #1 (/projects/:slug) | Elegant common areas and amenities in the public housing development. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/04-sidi-abdullah-lpp-2.webp` | `sidi abdullah lpp (2).jpg` | Intro #1 (/projects/:slug)<br>Mosaic #3 (/projects/:slug)<br>Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #2 (/projects/:slug) | Modern and inviting common area interior. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/05-sidi-abdullah-lpp-3.webp` | `sidi abdullah lpp (3).jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Modern public housing facade with distinctive architectural elements. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/06-whatsapp-image-2025-11-10-a-11-58-45-208aa771.webp` | `WhatsApp Image 2025-11-10 à 11.58.45_208aa771.jpg` | Construction gallery #1 (/projects/:slug) | Welcoming entrance to a new public housing unit. |
| Kullanılıyor | `/projects/sidi-abdallah-200-1200-housing/07-whatsapp-image-2025-11-10-a-11-58-47-08af6033.webp` | `WhatsApp Image 2025-11-10 à 11.58.47_08af6033.jpg` | Mosaic #2 (/projects/:slug) | Public housing development nearing completion with ongoing site infrastructure work. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image11.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image12.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image13.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Sidi Benour

- Proje slug: `sidi-benour-50-housing`
- Başlık: 50 Free Promotional Housing Units
- Lokasyon: Sidi Benour, Algiers
- Durum: Completed
- Kaynak fotoğraf klasörü: `sidi benour`
- Kaynak form: `Sidi Benour.docx`
- Kullanılan: 10
- Kullanılmayan kopya: 7

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/sidi-benour-50-housing/01-img-20251112-wa0006.webp` | `IMG-20251112-WA0006.jpg` | Construction gallery #2 (/projects/:slug) | Concrete structure rising against the sky. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/02-img-20251112-wa0007.webp` | `IMG-20251112-WA0007.jpg` | Construction gallery #1 (/projects/:slug) | Structural progress on the 50 housing units in Sidi Benour. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/03-img-20251112-wa0008.webp` | `IMG-20251112-WA0008.jpg` | Mosaic #1 (/projects/:slug) | Structural work underway for residential housing units. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/04-img-20251112-wa0009.webp` | `IMG-20251112-WA0009.jpg` | Mosaic #2 (/projects/:slug) | Completed residential building in Sidi Benour, Algiers. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/05-img-20251112-wa0010.webp` | `IMG-20251112-WA0010.jpg` | - | Interior floor tiling in a residential unit. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/06-img-20251112-wa0011.webp` | `IMG-20251112-WA0011.jpg` | - | Interior view of a residential unit showcasing newly installed floor tiles. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/07-img-20251112-wa0012.webp` | `IMG-20251112-WA0012.jpg` | - | Construction progress at Sidi Benour with completed units in view. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/08-img-20251112-wa0013.webp` | `IMG-20251112-WA0013.jpg` | - | Interior construction with hollow bricks. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/09-img-20251112-wa0014.webp` | `IMG-20251112-WA0014.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #4 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Residential building under construction with brick infill. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/10-img-20251112-wa0015.webp` | `IMG-20251112-WA0015.jpg` | Mosaic #3 (/projects/:slug) | Structural work and brick infill progress on residential units. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/11-img-20251112-wa0016.webp` | `IMG-20251112-WA0016.jpg` | - | Vertical construction progress of residential units. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/12-img-20251112-wa0017.webp` | `IMG-20251112-WA0017.jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Worker with bricks at Sidi Benour housing site. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/13-img-20251112-wa0018.webp` | `IMG-20251112-WA0018.jpg` | - | Residential building under construction with visible structural frame and brick infill. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/14-img-20251112-wa0019.webp` | `IMG-20251112-WA0019.jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug) | Structural progress on residential units in Sidi Benour. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/15-img-20251112-wa0020.webp` | `IMG-20251112-WA0020.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Structural work in progress for residential units, featuring rebar and formwork. |
| Kullanılıyor | `/projects/sidi-benour-50-housing/16-img-20251112-wa0021.webp` | `IMG-20251112-WA0021.jpg` | Intro #1 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Structural progress on the 50 housing units in Sidi Benour. |
| Kullanılmıyor | `/projects/sidi-benour-50-housing/17-img-20251112-wa0022.webp` | `IMG-20251112-WA0022.jpg` | - | Structural works and brick infill on a residential building in Sidi Benour. |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image31.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image32.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image33.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image34.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

### Staoueli Villas

- Proje slug: `staoueli-11-41-villas`
- Başlık: 11/41 Villas and Network Works
- Lokasyon: Staoueli
- Durum: Completed
- Kaynak fotoğraf klasörü: `staouali`
- Kaynak form: `staouali.docx`
- Kullanılan: 8
- Kullanılmayan kopya: 1

| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |
| --- | --- | --- | --- | --- |
| Kullanılıyor | `/projects/staoueli-11-41-villas/01-staouali-1.webp` | `staouali (1).jpg` | Intro #1 (/projects/:slug) | Completed residential villas with modern design and glass balconies. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/02-staouali-2.webp` | `staouali (2).jpg` | Hero #2 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #3 (/projects/:slug)<br>Feature gallery #3 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #3 (/projects/:slug) | Modern residential villas with elegant finishes and private balconies. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/03-staoualii.webp` | `staoualii.jpg` | Feature gallery #1 (/projects/:slug, /bat-demo/projects/:slug) | Modern kitchen with patterned backsplash and dark finishes. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/04-whatsapp-image-2025-11-10-a-11-58-44-c239f3f3.webp` | `WhatsApp Image 2025-11-10 à 11.58.44_c239f3f3.jpg` | Feature gallery #2 (/projects/:slug, /bat-demo/projects/:slug) | Completed villa exterior with modern finishes. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/05-whatsapp-image-2025-11-10-a-11-58-45-62e04c7e.webp` | `WhatsApp Image 2025-11-10 à 11.58.45_62e04c7e.jpg` | Mosaic #1 (/projects/:slug)<br>Construction gallery #4 (/projects/:slug) | Modern kitchen interior with patterned backsplash and dark marble-look floor. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/06-whatsapp-image-2025-11-10-a-11-58-46-3eaf6920.webp` | `WhatsApp Image 2025-11-10 à 11.58.46_3eaf6920.jpg` | Construction gallery #1 (/projects/:slug) | Modern villas completed and ready for occupancy. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/07-whatsapp-image-2025-11-10-a-11-58-47-3c8b6d80.webp` | `WhatsApp Image 2025-11-10 à 11.58.47_3c8b6d80.jpg` | Hero #1 (/projects/:slug, /bat-demo/projects/:slug)<br>Mosaic #4 (/projects/:slug)<br>Feature gallery #4 (/projects/:slug, /bat-demo/projects/:slug)<br>Construction gallery #2 (/projects/:slug)<br>Featured card #1 (/, /projects/:slug) | Completed residential villas with modern design and balconies. |
| Kullanılıyor | `/projects/staoueli-11-41-villas/08-whatsapp-image-2025-11-10-a-11-58-48-335d33dd.webp` | `WhatsApp Image 2025-11-10 à 11.58.48_335d33dd.jpg` | Mosaic #2 (/projects/:slug) | Progress on a residential villa, showcasing exterior finishing and scaffolding. |
| Public-only ve kullanılmıyor | `/projects/staoueli-11-41-villas/02-staouali-2_upscayl_4x_upscayl-standard-4x.png` | `public-only` | - | - |

`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:

- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image14.jpeg` - legacy cover / fallback / home slider source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`, `src/components/HeroBanner.tsx poster via heroSlides`, `src/components/ImageSlider.tsx via imageSliderImages`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image15.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`
- `https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media/image16.jpeg` - legacy fallback gallery source; code: `src/data/projects.ts`, `src/pages/Projects.tsx`, `src/pages/ProjectsDemo.tsx`, `src/data/projectContent.ts fallback`

## Eski Upscaled Havuzu

`public/Upscaled` mevcut uygulama tarafından doğrudan kullanılmıyor. Aşağıdaki tablo, dosya adlarını üretilmiş public proje görselleriyle eşleştirerek hangi projeye ait olduklarını tahmin eder.

| Proje | Dosya | Path |
| --- | --- | --- |
| Sidi Abdallah | `01-1.webp` | `public/Upscaled/01-1.webp` |
| Said Hamdine | `01-12.webp` | `public/Upscaled/01-12.webp` |
| Boudouaou | `01-boudouaou-1.webp` | `public/Upscaled/01-boudouaou-1.webp` |
| Douaouda Housing | `01-douaouda-1.webp` | `public/Upscaled/01-douaouda-1.webp` |
| Dely Brahim | `01-final-1.webp` | `public/Upscaled/01-final-1.webp` |
| Reghaia | `01-img-20251111-wa0023.webp` | `public/Upscaled/01-img-20251111-wa0023.webp` |
| Sidi Benour | `01-img-20251112-wa0006.webp` | `public/Upscaled/01-img-20251112-wa0006.webp` |
| Bas Mazagran | `01-mostaganem-1.webp` | `public/Upscaled/01-mostaganem-1.webp` |
| Staoueli Villas | `01-staouali-1.webp` | `public/Upscaled/01-staouali-1.webp` |
| Rouiba Villas | `01-whatsapp-image-2025-11-12-at-09-00-02.webp` | `public/Upscaled/01-whatsapp-image-2025-11-12-at-09-00-02.webp` |
| Sidi Abdallah | `02-13.webp` | `public/Upscaled/02-13.webp` |
| Boudouaou | `02-boudouaou-2.webp` | `public/Upscaled/02-boudouaou-2.webp` |
| Douaouda Housing | `02-douaouda-2.webp` | `public/Upscaled/02-douaouda-2.webp` |
| Dely Brahim | `02-final-2.webp` | `public/Upscaled/02-final-2.webp` |
| Reghaia | `02-img-20251111-wa0024.webp` | `public/Upscaled/02-img-20251111-wa0024.webp` |
| Douira Centres | `02-img-20251112-wa0001.webp` | `public/Upscaled/02-img-20251112-wa0001.webp` |
| Sidi Benour | `02-img-20251112-wa0007.webp` | `public/Upscaled/02-img-20251112-wa0007.webp` |
| Bas Mazagran | `02-mostaganem-2.webp` | `public/Upscaled/02-mostaganem-2.webp` |
| Said Hamdine | `02-sidi-yahia-1.webp` | `public/Upscaled/02-sidi-yahia-1.webp` |
| Staoueli Villas | `02-staouali-2.webp` | `public/Upscaled/02-staouali-2.webp` |
| Rouiba Villas | `02-whatsapp-image-2025-11-12-at-09-00-03-1.webp` | `public/Upscaled/02-whatsapp-image-2025-11-12-at-09-00-03-1.webp` |
| Boudouaou | `03-boudouaou-2-0.webp` | `public/Upscaled/03-boudouaou-2-0.webp` |
| Douaouda Housing | `03-douaouda.webp` | `public/Upscaled/03-douaouda.webp` |
| Dely Brahim | `03-final-3.webp` | `public/Upscaled/03-final-3.webp` |
| Reghaia | `03-img-20251111-wa0025.webp` | `public/Upscaled/03-img-20251111-wa0025.webp` |
| Douira Centres | `03-img-20251112-wa0002.webp` | `public/Upscaled/03-img-20251112-wa0002.webp` |
| Sidi Benour | `03-img-20251112-wa0008.webp` | `public/Upscaled/03-img-20251112-wa0008.webp` |
| Bas Mazagran | `03-mostaganem-1.webp` | `public/Upscaled/03-mostaganem-1.webp` |
| Sidi Abdallah | `03-sidi-abdullah-lpp-1.webp` | `public/Upscaled/03-sidi-abdullah-lpp-1.webp` |
| Said Hamdine | `03-sidi-yahia-2.webp` | `public/Upscaled/03-sidi-yahia-2.webp` |
| Staoueli Villas | `03-staoualii.webp` | `public/Upscaled/03-staoualii.webp` |
| Rouiba Villas | `03-whatsapp-image-2025-11-12-at-09-00-03-2.webp` | `public/Upscaled/03-whatsapp-image-2025-11-12-at-09-00-03-2.webp` |
| Boudouaou | `04-boudouaou-3.webp` | `public/Upscaled/04-boudouaou-3.webp` |
| Dely Brahim | `04-final-4.webp` | `public/Upscaled/04-final-4.webp` |
| Reghaia | `04-img-20251111-wa0026.webp` | `public/Upscaled/04-img-20251111-wa0026.webp` |
| Douira Centres | `04-img-20251112-wa0003.webp` | `public/Upscaled/04-img-20251112-wa0003.webp` |
| Sidi Benour | `04-img-20251112-wa0009.webp` | `public/Upscaled/04-img-20251112-wa0009.webp` |
| Bas Mazagran | `04-mostaganem-1.webp` | `public/Upscaled/04-mostaganem-1.webp` |
| Sidi Abdallah | `04-sidi-abdullah-lpp-2.webp` | `public/Upscaled/04-sidi-abdullah-lpp-2.webp` |
| Said Hamdine | `04-sidi-yahia-3.webp` | `public/Upscaled/04-sidi-yahia-3.webp` |
| Douaouda Housing | `04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.webp` | `public/Upscaled/04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.webp` |
| Staoueli Villas | `04-whatsapp-image-2025-11-10-a-11-58-44-c239f3f3.webp` | `public/Upscaled/04-whatsapp-image-2025-11-10-a-11-58-44-c239f3f3.webp` |
| Rouiba Villas | `04-whatsapp-image-2025-11-12-at-09-00-03.webp` | `public/Upscaled/04-whatsapp-image-2025-11-12-at-09-00-03.webp` |
| Boudouaou | `05-boudouaou-3.webp` | `public/Upscaled/05-boudouaou-3.webp` |
| Reghaia | `05-img-20251111-wa0027.webp` | `public/Upscaled/05-img-20251111-wa0027.webp` |
| Douira Centres | `05-img-20251112-wa0004.webp` | `public/Upscaled/05-img-20251112-wa0004.webp` |
| Sidi Benour | `05-img-20251112-wa0010.webp` | `public/Upscaled/05-img-20251112-wa0010.webp` |
| Bas Mazagran | `05-mostaganem-2.webp` | `public/Upscaled/05-mostaganem-2.webp` |
| Sidi Abdallah | `05-sidi-abdullah-lpp-3.webp` | `public/Upscaled/05-sidi-abdullah-lpp-3.webp` |
| Said Hamdine | `05-sidi-yahia-5.webp` | `public/Upscaled/05-sidi-yahia-5.webp` |
| Douaouda Housing | `05-whatsapp-image-2025-11-10-a-11-58-44-e480efaf.webp` | `public/Upscaled/05-whatsapp-image-2025-11-10-a-11-58-44-e480efaf.webp` |
| Staoueli Villas | `05-whatsapp-image-2025-11-10-a-11-58-45-62e04c7e.webp` | `public/Upscaled/05-whatsapp-image-2025-11-10-a-11-58-45-62e04c7e.webp` |
| Rouiba Villas | `05-whatsapp-image-2025-11-12-at-09-00-04.webp` | `public/Upscaled/05-whatsapp-image-2025-11-12-at-09-00-04.webp` |
| Boudouaou | `06-boudouaou-4.webp` | `public/Upscaled/06-boudouaou-4.webp` |
| Reghaia | `06-img-20251111-wa0028.webp` | `public/Upscaled/06-img-20251111-wa0028.webp` |
| Sidi Benour | `06-img-20251112-wa0011.webp` | `public/Upscaled/06-img-20251112-wa0011.webp` |
| Bas Mazagran | `06-mostaganem-3.webp` | `public/Upscaled/06-mostaganem-3.webp` |
| Douira Centres | `06-rahmania-1.webp` | `public/Upscaled/06-rahmania-1.webp` |
| Said Hamdine | `06-sidi-yahia-1.webp` | `public/Upscaled/06-sidi-yahia-1.webp` |
| Sidi Abdallah | `06-whatsapp-image-2025-11-10-a-11-58-45-208aa771.webp` | `public/Upscaled/06-whatsapp-image-2025-11-10-a-11-58-45-208aa771.webp` |
| Staoueli Villas | `06-whatsapp-image-2025-11-10-a-11-58-46-3eaf6920.webp` | `public/Upscaled/06-whatsapp-image-2025-11-10-a-11-58-46-3eaf6920.webp` |
| Boudouaou | `07-boudouaou-4.webp` | `public/Upscaled/07-boudouaou-4.webp` |
| Sidi Benour | `07-img-20251112-wa0012.webp` | `public/Upscaled/07-img-20251112-wa0012.webp` |
| Bas Mazagran | `07-mostaganem-3.webp` | `public/Upscaled/07-mostaganem-3.webp` |
| Douira Centres | `07-rahmania-1.webp` | `public/Upscaled/07-rahmania-1.webp` |
| Reghaia | `07-reghaia-1.webp` | `public/Upscaled/07-reghaia-1.webp` |
| Said Hamdine | `07-sidi-yahia-2.webp` | `public/Upscaled/07-sidi-yahia-2.webp` |
| Sidi Abdallah | `07-whatsapp-image-2025-11-10-a-11-58-47-08af6033.webp` | `public/Upscaled/07-whatsapp-image-2025-11-10-a-11-58-47-08af6033.webp` |
| Staoueli Villas | `07-whatsapp-image-2025-11-10-a-11-58-47-3c8b6d80.webp` | `public/Upscaled/07-whatsapp-image-2025-11-10-a-11-58-47-3c8b6d80.webp` |
| Boudouaou | `08-boudouaou-6.webp` | `public/Upscaled/08-boudouaou-6.webp` |
| Sidi Benour | `08-img-20251112-wa0013.webp` | `public/Upscaled/08-img-20251112-wa0013.webp` |
| Bas Mazagran | `08-mostaganem-4.webp` | `public/Upscaled/08-mostaganem-4.webp` |
| Douira Centres | `08-rahmania-2.webp` | `public/Upscaled/08-rahmania-2.webp` |
| Reghaia | `08-reghaia-2.webp` | `public/Upscaled/08-reghaia-2.webp` |
| Said Hamdine | `08-whatsapp-image-2025-11-10-a-11-58-42-119fe026.webp` | `public/Upscaled/08-whatsapp-image-2025-11-10-a-11-58-42-119fe026.webp` |
| Staoueli Villas | `08-whatsapp-image-2025-11-10-a-11-58-48-335d33dd.webp` | `public/Upscaled/08-whatsapp-image-2025-11-10-a-11-58-48-335d33dd.webp` |
| Boudouaou | `09-boudouaou-6.webp` | `public/Upscaled/09-boudouaou-6.webp` |
| Sidi Benour | `09-img-20251112-wa0014.webp` | `public/Upscaled/09-img-20251112-wa0014.webp` |
| Bas Mazagran | `09-mostaganem-4.webp` | `public/Upscaled/09-mostaganem-4.webp` |
| Douira Centres | `09-rahmania-2.webp` | `public/Upscaled/09-rahmania-2.webp` |
| Reghaia | `09-reghaia-2.webp` | `public/Upscaled/09-reghaia-2.webp` |
| Said Hamdine | `09-whatsapp-image-2025-11-10-a-11-58-42-7f866443.webp` | `public/Upscaled/09-whatsapp-image-2025-11-10-a-11-58-42-7f866443.webp` |
| Boudouaou | `10-boudouaou-7.webp` | `public/Upscaled/10-boudouaou-7.webp` |
| Sidi Benour | `10-img-20251112-wa0015.webp` | `public/Upscaled/10-img-20251112-wa0015.webp` |
| Bas Mazagran | `10-mostaghanem-1.webp` | `public/Upscaled/10-mostaghanem-1.webp` |
| Douira Centres | `10-rahmania-3.webp` | `public/Upscaled/10-rahmania-3.webp` |
| Reghaia | `10-reghaia-3.webp` | `public/Upscaled/10-reghaia-3.webp` |
| Said Hamdine | `10-whatsapp-image-2025-11-10-a-11-58-42-fb5a4508.webp` | `public/Upscaled/10-whatsapp-image-2025-11-10-a-11-58-42-fb5a4508.webp` |
| Boudouaou | `11-boudouaou-7.webp` | `public/Upscaled/11-boudouaou-7.webp` |
| Sidi Benour | `11-img-20251112-wa0016.webp` | `public/Upscaled/11-img-20251112-wa0016.webp` |
| Bas Mazagran | `11-mostaghanem-3.webp` | `public/Upscaled/11-mostaghanem-3.webp` |
| Douira Centres | `11-rahmania-3.webp` | `public/Upscaled/11-rahmania-3.webp` |
| Reghaia | `11-reghaia-3.webp` | `public/Upscaled/11-reghaia-3.webp` |
| Sidi Benour | `12-img-20251112-wa0017.webp` | `public/Upscaled/12-img-20251112-wa0017.webp` |
| Reghaia | `12-reghaia-3d.webp` | `public/Upscaled/12-reghaia-3d.webp` |
| Boudouaou | `12-whatsapp-image-2025-11-12-a-14-52-45-16dbaed6.webp` | `public/Upscaled/12-whatsapp-image-2025-11-12-a-14-52-45-16dbaed6.webp` |
| Douira Centres | `12-whatsapp-image-2025-11-12-at-15-18-39.webp` | `public/Upscaled/12-whatsapp-image-2025-11-12-at-15-18-39.webp` |
| Sidi Benour | `13-img-20251112-wa0018.webp` | `public/Upscaled/13-img-20251112-wa0018.webp` |
| Reghaia | `13-reghaia-3d-1.webp` | `public/Upscaled/13-reghaia-3d-1.webp` |
| Boudouaou | `13-whatsapp-image-2025-11-12-a-14-52-45-8e4328b8.webp` | `public/Upscaled/13-whatsapp-image-2025-11-12-a-14-52-45-8e4328b8.webp` |
| Douira Centres | `13-whatsapp-image-2025-11-12-at-15-19-49.webp` | `public/Upscaled/13-whatsapp-image-2025-11-12-at-15-19-49.webp` |
| Sidi Benour | `14-img-20251112-wa0019.webp` | `public/Upscaled/14-img-20251112-wa0019.webp` |
| Reghaia | `14-reghaia-3d-2.webp` | `public/Upscaled/14-reghaia-3d-2.webp` |
| Boudouaou | `14-whatsapp-image-2025-11-12-a-14-52-45-bdcbcd8b.webp` | `public/Upscaled/14-whatsapp-image-2025-11-12-a-14-52-45-bdcbcd8b.webp` |
| Douira Centres | `14-whatsapp-image-2025-11-12-at-15-20-30.webp` | `public/Upscaled/14-whatsapp-image-2025-11-12-at-15-20-30.webp` |
| Sidi Benour | `15-img-20251112-wa0020.webp` | `public/Upscaled/15-img-20251112-wa0020.webp` |
| Reghaia | `15-reghaia-4.webp` | `public/Upscaled/15-reghaia-4.webp` |
| Boudouaou | `15-whatsapp-image-2025-11-12-a-14-52-46-3206f724.webp` | `public/Upscaled/15-whatsapp-image-2025-11-12-a-14-52-46-3206f724.webp` |
| Douira Centres | `15-whatsapp-image-2025-11-12-at-15-22-43.webp` | `public/Upscaled/15-whatsapp-image-2025-11-12-at-15-22-43.webp` |
| Sidi Benour | `16-img-20251112-wa0021.webp` | `public/Upscaled/16-img-20251112-wa0021.webp` |
| Reghaia | `16-reghaia.webp` | `public/Upscaled/16-reghaia.webp` |
| Boudouaou | `16-whatsapp-image-2025-11-12-a-14-52-46-88d948d6.webp` | `public/Upscaled/16-whatsapp-image-2025-11-12-a-14-52-46-88d948d6.webp` |
| Douira Centres | `16-whatsapp-image-2025-11-12-at-15-23-03.webp` | `public/Upscaled/16-whatsapp-image-2025-11-12-at-15-23-03.webp` |
| Sidi Benour | `17-img-20251112-wa0022.webp` | `public/Upscaled/17-img-20251112-wa0022.webp` |
| Reghaia | `17-reghaia.webp` | `public/Upscaled/17-reghaia.webp` |
| Boudouaou | `17-whatsapp-image-2025-11-12-a-14-52-46-9674e10d.webp` | `public/Upscaled/17-whatsapp-image-2025-11-12-a-14-52-46-9674e10d.webp` |
| Boudouaou | `18-whatsapp-image-2025-11-12-a-14-52-46-fe914217.webp` | `public/Upscaled/18-whatsapp-image-2025-11-12-a-14-52-46-fe914217.webp` |
| Boudouaou | `19-whatsapp-image-2025-11-12-a-14-52-47-3c32ef3d.webp` | `public/Upscaled/19-whatsapp-image-2025-11-12-a-14-52-47-3c32ef3d.webp` |
| Boudouaou | `20-whatsapp-image-2025-11-12-a-14-52-47-4866d8ca.webp` | `public/Upscaled/20-whatsapp-image-2025-11-12-a-14-52-47-4866d8ca.webp` |
| Boudouaou | `21-whatsapp-image-2025-11-12-a-14-52-47-8581eb4a.webp` | `public/Upscaled/21-whatsapp-image-2025-11-12-a-14-52-47-8581eb4a.webp` |
| Boudouaou | `22-whatsapp-image-2025-11-12-a-14-52-48-1f246636.webp` | `public/Upscaled/22-whatsapp-image-2025-11-12-a-14-52-48-1f246636.webp` |
| Boudouaou | `23-whatsapp-image-2025-11-12-a-14-52-48-9f71d272.webp` | `public/Upscaled/23-whatsapp-image-2025-11-12-a-14-52-48-9f71d272.webp` |
| Boudouaou | `24-whatsapp-image-2025-11-12-a-14-52-49-1fb420cc.webp` | `public/Upscaled/24-whatsapp-image-2025-11-12-a-14-52-49-1fb420cc.webp` |
| Boudouaou | `25-whatsapp-image-2025-11-12-a-14-52-49-5ca31f0b.webp` | `public/Upscaled/25-whatsapp-image-2025-11-12-a-14-52-49-5ca31f0b.webp` |
| Sidi Abdallah | `01-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-1.png` |
| Said Hamdine | `01-12.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-12.png` |
| Boudouaou | `01-boudouaou-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-boudouaou-1.png` |
| Douaouda Housing | `01-douaouda-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-douaouda-1.png` |
| Dely Brahim | `01-final-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-final-1.png` |
| Reghaia | `01-img-20251111-wa0023.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-img-20251111-wa0023.png` |
| Sidi Benour | `01-img-20251112-wa0006.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-img-20251112-wa0006.png` |
| Bas Mazagran | `01-mostaganem-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-mostaganem-1.png` |
| Staoueli Villas | `01-staouali-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-staouali-1.png` |
| Rouiba Villas | `01-whatsapp-image-2025-11-12-at-09-00-02.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/01-whatsapp-image-2025-11-12-at-09-00-02.png` |
| Sidi Abdallah | `02-13.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-13.png` |
| Boudouaou | `02-boudouaou-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-boudouaou-2.png` |
| Douaouda Housing | `02-douaouda-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-douaouda-2.png` |
| Dely Brahim | `02-final-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-final-2.png` |
| Reghaia | `02-img-20251111-wa0024.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-img-20251111-wa0024.png` |
| Douira Centres | `02-img-20251112-wa0001.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-img-20251112-wa0001.png` |
| Sidi Benour | `02-img-20251112-wa0007.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-img-20251112-wa0007.png` |
| Bas Mazagran | `02-mostaganem-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-mostaganem-2.png` |
| Said Hamdine | `02-sidi-yahia-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-sidi-yahia-1.png` |
| Staoueli Villas | `02-staouali-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-staouali-2.png` |
| Rouiba Villas | `02-whatsapp-image-2025-11-12-at-09-00-03-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/02-whatsapp-image-2025-11-12-at-09-00-03-1.png` |
| Boudouaou | `03-boudouaou-2-0.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-boudouaou-2-0.png` |
| Douaouda Housing | `03-douaouda.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-douaouda.png` |
| Dely Brahim | `03-final-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-final-3.png` |
| Reghaia | `03-img-20251111-wa0025.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-img-20251111-wa0025.png` |
| Douira Centres | `03-img-20251112-wa0002.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-img-20251112-wa0002.png` |
| Sidi Benour | `03-img-20251112-wa0008.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-img-20251112-wa0008.png` |
| Bas Mazagran | `03-mostaganem-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-mostaganem-1.png` |
| Sidi Abdallah | `03-sidi-abdullah-lpp-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-sidi-abdullah-lpp-1.png` |
| Said Hamdine | `03-sidi-yahia-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-sidi-yahia-2.png` |
| Staoueli Villas | `03-staoualii.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-staoualii.png` |
| Rouiba Villas | `03-whatsapp-image-2025-11-12-at-09-00-03-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/03-whatsapp-image-2025-11-12-at-09-00-03-2.png` |
| Boudouaou | `04-boudouaou-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-boudouaou-3.png` |
| Dely Brahim | `04-final-4.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-final-4.png` |
| Reghaia | `04-img-20251111-wa0026.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-img-20251111-wa0026.png` |
| Douira Centres | `04-img-20251112-wa0003.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-img-20251112-wa0003.png` |
| Sidi Benour | `04-img-20251112-wa0009.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-img-20251112-wa0009.png` |
| Bas Mazagran | `04-mostaganem-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-mostaganem-1.png` |
| Sidi Abdallah | `04-sidi-abdullah-lpp-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-sidi-abdullah-lpp-2.png` |
| Said Hamdine | `04-sidi-yahia-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-sidi-yahia-3.png` |
| Douaouda Housing | `04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.png` |
| Staoueli Villas | `04-whatsapp-image-2025-11-10-a-11-58-44-c239f3f3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-whatsapp-image-2025-11-10-a-11-58-44-c239f3f3.png` |
| Rouiba Villas | `04-whatsapp-image-2025-11-12-at-09-00-03.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/04-whatsapp-image-2025-11-12-at-09-00-03.png` |
| Boudouaou | `05-boudouaou-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-boudouaou-3.png` |
| Reghaia | `05-img-20251111-wa0027.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-img-20251111-wa0027.png` |
| Douira Centres | `05-img-20251112-wa0004.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-img-20251112-wa0004.png` |
| Sidi Benour | `05-img-20251112-wa0010.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-img-20251112-wa0010.png` |
| Bas Mazagran | `05-mostaganem-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-mostaganem-2.png` |
| Sidi Abdallah | `05-sidi-abdullah-lpp-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-sidi-abdullah-lpp-3.png` |
| Said Hamdine | `05-sidi-yahia-5.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-sidi-yahia-5.png` |
| Douaouda Housing | `05-whatsapp-image-2025-11-10-a-11-58-44-e480efaf.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-whatsapp-image-2025-11-10-a-11-58-44-e480efaf.png` |
| Staoueli Villas | `05-whatsapp-image-2025-11-10-a-11-58-45-62e04c7e.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-whatsapp-image-2025-11-10-a-11-58-45-62e04c7e.png` |
| Rouiba Villas | `05-whatsapp-image-2025-11-12-at-09-00-04.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/05-whatsapp-image-2025-11-12-at-09-00-04.png` |
| Boudouaou | `06-boudouaou-4.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-boudouaou-4.png` |
| Reghaia | `06-img-20251111-wa0028.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-img-20251111-wa0028.png` |
| Sidi Benour | `06-img-20251112-wa0011.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-img-20251112-wa0011.png` |
| Bas Mazagran | `06-mostaganem-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-mostaganem-3.png` |
| Douira Centres | `06-rahmania-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-rahmania-1.png` |
| Said Hamdine | `06-sidi-yahia-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-sidi-yahia-1.png` |
| Sidi Abdallah | `06-whatsapp-image-2025-11-10-a-11-58-45-208aa771.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-whatsapp-image-2025-11-10-a-11-58-45-208aa771.png` |
| Staoueli Villas | `06-whatsapp-image-2025-11-10-a-11-58-46-3eaf6920.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/06-whatsapp-image-2025-11-10-a-11-58-46-3eaf6920.png` |
| Boudouaou | `07-boudouaou-4.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-boudouaou-4.png` |
| Sidi Benour | `07-img-20251112-wa0012.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-img-20251112-wa0012.png` |
| Bas Mazagran | `07-mostaganem-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-mostaganem-3.png` |
| Douira Centres | `07-rahmania-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-rahmania-1.png` |
| Reghaia | `07-reghaia-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-reghaia-1.png` |
| Said Hamdine | `07-sidi-yahia-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-sidi-yahia-2.png` |
| Sidi Abdallah | `07-whatsapp-image-2025-11-10-a-11-58-47-08af6033.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-whatsapp-image-2025-11-10-a-11-58-47-08af6033.png` |
| Staoueli Villas | `07-whatsapp-image-2025-11-10-a-11-58-47-3c8b6d80.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/07-whatsapp-image-2025-11-10-a-11-58-47-3c8b6d80.png` |
| Boudouaou | `08-boudouaou-6.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-boudouaou-6.png` |
| Sidi Benour | `08-img-20251112-wa0013.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-img-20251112-wa0013.png` |
| Bas Mazagran | `08-mostaganem-4.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-mostaganem-4.png` |
| Douira Centres | `08-rahmania-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-rahmania-2.png` |
| Reghaia | `08-reghaia-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-reghaia-2.png` |
| Said Hamdine | `08-whatsapp-image-2025-11-10-a-11-58-42-119fe026.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-whatsapp-image-2025-11-10-a-11-58-42-119fe026.png` |
| Staoueli Villas | `08-whatsapp-image-2025-11-10-a-11-58-48-335d33dd.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/08-whatsapp-image-2025-11-10-a-11-58-48-335d33dd.png` |
| Boudouaou | `09-boudouaou-6.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-boudouaou-6.png` |
| Sidi Benour | `09-img-20251112-wa0014.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-img-20251112-wa0014.png` |
| Bas Mazagran | `09-mostaganem-4.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-mostaganem-4.png` |
| Douira Centres | `09-rahmania-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-rahmania-2.png` |
| Reghaia | `09-reghaia-2.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-reghaia-2.png` |
| Said Hamdine | `09-whatsapp-image-2025-11-10-a-11-58-42-7f866443.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/09-whatsapp-image-2025-11-10-a-11-58-42-7f866443.png` |
| Boudouaou | `10-boudouaou-7.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-boudouaou-7.png` |
| Sidi Benour | `10-img-20251112-wa0015.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-img-20251112-wa0015.png` |
| Bas Mazagran | `10-mostaghanem-1.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-mostaghanem-1.png` |
| Douira Centres | `10-rahmania-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-rahmania-3.png` |
| Reghaia | `10-reghaia-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-reghaia-3.png` |
| Said Hamdine | `10-whatsapp-image-2025-11-10-a-11-58-42-fb5a4508.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/10-whatsapp-image-2025-11-10-a-11-58-42-fb5a4508.png` |
| Boudouaou | `11-boudouaou-7.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/11-boudouaou-7.png` |
| Sidi Benour | `11-img-20251112-wa0016.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/11-img-20251112-wa0016.png` |
| Bas Mazagran | `11-mostaghanem-3.png` | `public/Upscaled/upscayl_png_upscayl-standard-4x_4x/11-mostaghanem-3.png` |

