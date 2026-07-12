import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { lingui } from '@lingui/vite-plugin';

const shouldAnalyzeBundle =
  process.env.BUNDLE_ANALYZE === 'true' || process.env.ANALYZE_BUNDLE === 'true';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    tailwindcss(),
    shouldAnalyzeBundle &&
      visualizer({
        filename: 'dist/bundle-report.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('maplibre-gl') || id.includes('@maplibre')) {
            return 'vendor-maps';
          }
          if (
            id.includes('gsap') ||
            id.includes('lenis') ||
            id.includes('motion') ||
            id.includes('swiper') ||
            id.includes('lottie-react')
          ) {
            return 'vendor-motion';
          }
          return undefined;
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify - file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    proxy: {
      '/api/design-studio': {
        target: `http://127.0.0.1:${process.env.DESIGN_STUDIO_API_PORT || 3010}`,
        changeOrigin: true,
      },
    },
  },
});
