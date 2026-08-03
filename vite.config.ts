import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { netlifyFunctionsDevPlugin } from './scripts/vite-netlify-functions-dev.mjs'

// Lightweight brand PWA: cache the app shell + static assets for faster repeat visits
// and Add to Home Screen. Not an offline operations app (that is Trovara OS).
export default defineConfig({
  // Pre-bundle common deps so local Playwright/QA is less likely to hit
  // "504 Outdated Optimize Dep" after lockfile or dependency changes.
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'markdown-it'],
  },
  plugins: [
    vue(),
    netlifyFunctionsDevPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['brand/trovara-monogram-tile-v1.svg', 'icons/trovara-monogram-icon-v1.svg'],
      manifest: false,
      workbox: {
        // Avoid Workbox terser early-exit under Node 22 (same as Trovara OS).
        mode: 'development',
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,ico,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/\.netlify/,
          /^\/shop-api/,
          /^\/lot-api/,
          /^\/feed\.xml/,
          /^\/sitemap\.xml/,
          /^\/robots\.txt/,
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'image' || request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'trovara-static-media',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    proxy: {
      // Customer shop API (Trovara OS). Keeps cookies same-origin so
      // SameSite=Strict sessions work from http://localhost:5173.
      '/shop-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shop-api/, '/shop'),
      },
      // Public lot JSON (Trovara OS). Same-origin so CSP connect-src 'self' works.
      '/lot-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lot-api/, '/public/lots'),
      },
    },
  },
})
