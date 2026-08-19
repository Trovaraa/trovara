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
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: false,
      workbox: {
        // Avoid Workbox terser early-exit under Node 22 (same as Trovara OS).
        mode: 'development',
        // Do not precache HTML or use navigateFallback. Netlify already SPA-fallbacks
        // to index.html; a precached shell is what made email deep links (e.g.
        // /shop/verify-email) render the branded 404 after a route shipped.
        globPatterns: [
          'assets/index-*.{js,css}',
          'icons/icon-*.png',
          'manifest.webmanifest',
          'theme-init.js',
        ],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'trovara-pages',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
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
    // Trovara OS owns 5173. Keep the marketing site on its documented local
    // origin so both products can run together and /lot-api can reach OS.
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    proxy: {
      // Public lot JSON (Trovara OS). Same-origin so CSP connect-src 'self' works.
      '/lot-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lot-api/, '/public/lots'),
      },
      '/brand-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/brand-api/, '/public/brand'),
      },
      '/moments-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moments-api/, '/public/moments'),
      },
      '/careers-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/careers-api/, '/public/careers'),
      },
      '/journal-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/journal-api/, '/public/journal'),
      },
    },
  },
})
