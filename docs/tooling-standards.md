# Frontend Tooling Standartları ve Uygulama Planı

> Kapsam: `rollup-plugin-visualizer`, `class-variance-authority (cva)`, `clsx`, `tailwind-merge`,
> Storybook (+ `@storybook/addon-mcp`), Playwright ve `React.lazy` + route bazlı code splitting.
>
> Bu doküman iki bölümden oluşur: **(A) Araç dokümantasyonu** — her aracın bu repodaki kurulumu ve
> kullanımı; **(B) Global kurallar** — tüm geliştiricilerin ve agent'ların uyması gereken kurallar.
> Son bölümde kalan uygulama adımları (yol haritası) listelenir.

---

## Mevcut Durum Özeti

| Araç | Durum | Konfigürasyon |
|---|---|---|
| rollup-plugin-visualizer | ✅ Kurulu | `vite.config.ts` (env-gated), `scripts/analyze-bundle.mjs` |
| cva + clsx + tailwind-merge | ✅ Kurulu | `src/lib/utils.ts` → `cn()` helper |
| Storybook 10 (react-vite) | ✅ Kurulu | `.storybook/main.ts`, addons: a11y, docs, vitest, mcp, chromatic |
| @storybook/addon-mcp | ✅ Kurulu | `.storybook/main.ts` addons listesinde |
| Playwright | ✅ Kurulu | `playwright.config.ts`, testler `tests/e2e/` |
| React.lazy + route splitting | ✅ Uygulanmış | `src/App.tsx` (tüm sayfalar lazy) + `vendor-motion` manualChunk |

---

# A. Araç Dokümantasyonu

## 1. rollup-plugin-visualizer — Bundle Analizi

**Ne işe yarar:** Production build'in chunk bazlı boyut haritasını (treemap) çıkarır;
hangi bağımlılığın bundle'ı şişirdiğini gösterir.

**Bu repodaki kurulum:**

- `vite.config.ts` içinde plugin, yalnızca `BUNDLE_ANALYZE=true` (veya `ANALYZE_BUNDLE=true`)
  env değişkeni set edildiğinde aktif olur — normal build'e maliyet eklemez.
- Rapor `dist/bundle-report.html` dosyasına yazılır (`treemap` şablonu, gzip + brotli boyutlarıyla).

**Kullanım:**

```bash
npm run analyze:bundle        # BUNDLE_ANALYZE=true ile vite build çalıştırır
# ardından dist/bundle-report.html dosyasını tarayıcıda aç
```

**Rapor okuma rehberi:**

- İlk bakılacak yer en büyük dikdörtgenler: `vendor-motion` (gsap, lenis, motion, swiper, lottie)
  chunk'ı beklenen en büyük vendor parçasıdır.
- Bir sayfa chunk'ının içinde beklenmedik bir kütüphane görünüyorsa, o import muhtemelen
  yanlış yerden (ör. barrel export) geliyordur.
- Gzip boyutu esas alınır; raw boyut yanıltıcıdır.

## 2. cva + clsx + tailwind-merge — Variant Bazlı Stil Sistemi

**Ne işe yarar:**

- `clsx`: koşullu className birleştirme.
- `tailwind-merge`: çakışan Tailwind sınıflarında sonuncuyu kazandırır (`p-2 p-4` → `p-4`).
- `class-variance-authority (cva)`: bir bileşenin `variant`, `size`, `tone` gibi eksenlerini
  deklaratif olarak tanımlar.

**Bu repodaki kurulum:**

- `src/lib/utils.ts` içindeki `cn()` helper'ı `clsx` + `twMerge`'i birleştirir.
- Shared primitive'ler `src/components/ui/*` altında (button, badge, card, input, select,
  dialog, tabs, tooltip, popover, dropdown-menu, navigation-menu, icon-button, section-header).

**Standart desen (yeni primitive eklerken):**

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const chipVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors', // base
  {
    variants: {
      tone: {
        neutral: 'bg-neutral-100 text-neutral-900',
        accent: 'bg-[#c22026] text-white',
      },
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

type ChipProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>;

export function Chip({ className, tone, size, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ tone, size }), className)} {...props} />;
}
```

**Kurallar:** bkz. Bölüm B.2.

## 3. Storybook 10 + @storybook/addon-mcp

**Ne işe yarar:** Bileşenleri izole geliştirme/görsel inceleme ortamı. `addon-mcp`,
Storybook'u MCP sunucusu olarak açar — AI agent'lar (Claude Code dahil) story'leri
listeleyebilir, render edip inceleyebilir.

**Bu repodaki kurulum:**

- `.storybook/main.ts`: `@storybook/react-vite` framework'ü; addons: `@chromatic-com/storybook`,
  `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-mcp`.
- Story dosyaları: `src/**/*.stories.tsx` ve `src/**/*.mdx` taranır.
- `src/stories/` altındaki Button/Header/Page dosyaları Storybook boilerplate'idir (bkz. yol haritası).

**Kullanım:**

```bash
npm run storybook          # dev server, port 6006
npm run build-storybook    # statik build (storybook-static/)
```

MCP endpoint'i Storybook dev server çalışırken `http://localhost:6006/mcp` üzerinden erişilebilir.
Agent'ların bileşen durumlarını doğrulaması için Storybook'un açık olması gerekir.

**Story standardı (CSF3):**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/src/components/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Devamını gör' } };
export const Disabled: Story = { args: { children: 'Devamını gör', disabled: true } };
```

## 4. Playwright — E2E ve Görsel Regresyon

**Bu repodaki kurulum:**

- `playwright.config.ts`: testDir `tests/e2e/`, Chromium (Desktop Chrome), baseURL
  `http://127.0.0.1:3000` (`PLAYWRIGHT_BASE_URL` ile override edilebilir).
- `webServer` bloğu `npm run dev`'i otomatik başlatır; çalışan sunucu varsa yeniden kullanır.
- Snapshot'lar: `tests/e2e/site-qa.spec.ts-snapshots/` — 4 viewport (390×844, 768×1024,
  1440×900, 1920×1080) × 4 rota (`/`, `/projects`, `/projects/:slug`, `/bat-demo/projects`).
- Trace ilk retry'da, screenshot/video yalnızca hata durumunda alınır.

**Kullanım:**

```bash
npx playwright test                        # tüm e2e testleri
npx playwright test --ui                   # etkileşimli mod
npx playwright test --update-snapshots     # kasıtlı görsel değişiklik sonrası
npx playwright show-report                 # son çalışmanın raporu
```

> Not: Snapshot'lar `-win32` sonekiyle platforma bağlıdır; CI'da farklı OS kullanılacaksa
> snapshot seti o platformda yeniden üretilmelidir.

## 5. React.lazy + Route Bazlı Code Splitting

**Bu repodaki kurulum:**

- `src/App.tsx`: tüm sayfa bileşenleri (`Home`, `Projects`, `ProjectsDemo`, `ProjectDetail`,
  `BatProjectsIndex`, `BatProjectDemo`) `React.lazy()` ile import edilir ve tek bir
  `<Suspense fallback={<RouteFallback />}>` içinde render edilir.
- `RouteFallback`, tema arka planıyla (`--igloo-bg`) boş tam ekran render eder — layout
  kayması ve beyaz flaş engellenir.
- `vite.config.ts` `manualChunks`: animasyon kütüphaneleri (`gsap`, `lenis`, `motion`,
  `swiper`, `lottie-react`) `vendor-motion` chunk'ında toplanır.

**Yeni rota ekleme deseni:**

```tsx
const NewPage = lazy(() => import('./pages/NewPage'));
// Routes içinde:
<Route path="/new" element={<NewPage />} />
```

---

# B. Global Kurallar

## B.1 Bundle ve Performans Kuralları

1. **Yeni dependency eklemeden önce** mevcut stack'le çözülüp çözülemeyeceğini kontrol et
   (gsap/motion/swiper/radix zaten var). Ekleniyorsa `npm run analyze:bundle` ile öncesi/sonrası
   karşılaştır ve gzip farkını PR/commit açıklamasına yaz.
2. **Home shell hafif kalır.** İlk ekranda gerekmeyen ağır bileşenler route split'in arkasına
   veya bileşen düzeyinde `lazy()` arkasına alınır.
3. Yeni büyük vendor grubu oluşursa `manualChunks`'a bilinçli olarak eklenir; Vite'ın
   otomatik bölmesine "kazayla" bırakılmaz.
4. `visualizer` plugin'i **her zaman env-gated kalır** — koşulsuz aktif hale getirilmez.
5. Bundle raporu (`dist/bundle-report.html`) ve `dist/` commit edilmez.

## B.2 Stil / Variant Kuralları (cva + cn)

1. Koşullu veya birleştirilmiş className **her zaman `cn()` ile** yazılır; template literal
   veya string concat ile Tailwind sınıfı birleştirilmez.
2. Bir bileşende boyut/ton/durum ekseni varsa **`cva` variant'ı** olarak modellenir;
   uzun ad hoc `className` prop zincirleri kabul edilmez.
3. Yeni size/radius/tone gerekiyorsa **primitive'e variant olarak eklenir**, sayfa içinde
   tek seferlik override yapılmaz (`src/components/ui/*` tek doğruluk kaynağıdır).
4. `defaultVariants` her cva tanımında zorunludur; variant tipleri `VariantProps<typeof x>`
   ile dışa açılır.
5. Dışarıdan gelen `className` her zaman en sona (`cn(variants(...), className)`) konur ki
   tüketici override edebilsin.

## B.3 Storybook Kuralları

1. `src/components/ui/*` altına eklenen veya görsel davranışı değişen **her paylaşılan
   primitive için story zorunludur.** İlgili durumlar: default, hover/active, disabled,
   boş içerik ve mobil genişlik (uygun olanlar).
2. Story dosyası bileşenin yanına konur (`button.stories.tsx` gibi, colocated) —
   `src/stories/` boilerplate klasörüne yeni story eklenmez.
3. CSF3 + `satisfies Meta<typeof X>` + `tags: ['autodocs']` standardı kullanılır.
4. `title` hiyerarşisi: `UI/<Bileşen>` (primitive'ler), `Sections/<Bölüm>` (sayfa bölümleri).
5. a11y addon uyarıları story eklerken kontrol edilir; bilinçli istisna varsa story
   parametresiyle belgelenir.
6. Agent'lar bileşen doğrulaması yaparken Storybook MCP'yi (`localhost:6006/mcp`)
   kullanabilir; bu nedenle story'ler prod verisine değil, kendi mock verisine dayanmalıdır.

## B.4 Playwright Kuralları

1. **Route-level veya layout değişikliklerinde** 4 rota × 4 viewport snapshot seti çalıştırılır:
   `npx playwright test`. Kasıtlı görsel değişiklikte `--update-snapshots` ile yenilenir ve
   snapshot diff'i değişiklik açıklamasında gerekçelendirilir.
2. Yeni kullanıcı akışı (form, navigasyon, dil değişimi vb.) eklendiğinde `tests/e2e/`
   altına spec eklenir; selector olarak role/text tabanlı locator tercih edilir,
   kırılgan CSS zincirleri kullanılmaz.
3. Animasyon-ağır sayfalarda flakiness'e karşı `expect` timeout'u (15 sn) yeterli değilse
   test tarafında bekleme eklenir; global timeout büyütülmez.
4. Snapshot dosyaları platforma bağlıdır (win32); farklı makinede snapshot güncellenmişse
   bu belirtilmelidir.

## B.5 Code Splitting Kuralları

1. **Her yeni sayfa/rota `React.lazy()` ile eklenir** — `App.tsx`'te eager sayfa importu yasak.
2. Global chrome (Header, GlobalCursor, ThemeProvider, SmoothScrollProvider, i18n) eager kalır;
   bunlar Suspense arkasına alınmaz.
3. Route fallback'i `RouteFallback` deseniyle uyumlu olmalı: tema arkaplanı, spinner yok,
   layout kayması yok.
4. Yalnızca tek rotada kullanılan ağır bir kütüphane, o sayfanın chunk'ında kalmalıdır —
   paylaşılan bir modülden re-export ederek ortak chunk'a sızdırılmaz (analyze raporuyla doğrula).
5. Named export'lu modülü lazy yüklerken:
   `lazy(() => import('./X').then(m => ({ default: m.X })))`.

## B.6 Doğrulama Zinciri (her değişiklikte)

```bash
npm run lint               # tsc --noEmit
npm run build              # prod build kırık mı
npx playwright test        # layout/rota değiştiyse
npm run analyze:bundle     # dependency/chunk değiştiyse
npm run storybook          # primitive değiştiyse story'leri gözden geçir
```

---

# C. Yol Haritası — Kalan Uygulama Adımları

Kurulumlar tamam; standardı tamamlamak için kalan işler:

- [ ] **Faz 1 — Boilerplate temizliği:** `src/stories/` içindeki Storybook örnek dosyalarını
      (Button/Header/Page + assets) sil veya `Sections/` hiyerarşisine uyarlayarak taşı.
- [ ] **Faz 2 — UI primitive story kapsamı:** `src/components/ui/*` altındaki 14 primitive için
      colocated `.stories.tsx` dosyaları ekle (öncelik: button, badge, card, input, dialog).
- [ ] **Faz 3 — cva denetimi:** `src/components/*` içinde uzun ad hoc `className`
      birleştirmelerini tara; variant'a dönüşebilecekleri `ui/` primitive'lerine taşı.
- [ ] **Faz 4 — Bundle bazı çizgisi:** `npm run analyze:bundle` çalıştırıp mevcut gzip boyutlarını
      bu dokümana "baseline" tablosu olarak ekle; sonraki PR'lar bu tabloyla karşılaştırır.
- [ ] **Faz 5 — Playwright kapsam genişletme:** dil değişimi (en/fr), tema toggle ve
      `?edit=1` editör kabuğu için smoke testleri ekle.
- [ ] **Faz 6 — AGENTS.md senkronizasyonu:** Bu dokümandaki kurallar değiştikçe
      `AGENTS.md` "UI System Rules" ve "Performance Rules" bölümleriyle senkron tut
      (özet AGENTS.md'de, detay burada).

---

*Son güncelleme: 2026-07-05*
