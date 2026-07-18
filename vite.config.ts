import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// Lightweight brand PWA: cache the app shell + static assets for faster repeat visits
// and Add to Home Screen. Not an offline operations app (that is Trovara OS).
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: false,
      workbox: {
        // Avoid Workbox terser early-exit under Node 22 (same as Trovara OS).
        mode: 'development',
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,ico,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/\.netlify/,
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
})
