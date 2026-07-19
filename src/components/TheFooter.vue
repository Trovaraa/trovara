<script setup lang="ts">
import { useRoute } from 'vue-router'
import NewsletterSubscribe from './ui/NewsletterSubscribe.vue'
import { SOCIAL_LINKS } from '../lib/social'

const route = useRoute()
const currentYear = new Date().getFullYear()

function onHomeClick() {
  if (route.path === '/') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}

const links = {
  company: [
    { label: 'About Us',    to: '/about' },
    { label: 'The Farm',    to: '/farm' },
    { label: 'Blog',        to: '/blog' },
    { label: 'Our Story',   to: '/about#story' },
    { label: 'Services',    to: '/services' },
    { label: 'Wholesale',   to: '/wholesale' },
    { label: 'FAQ',         to: '/faq' },
    { label: 'Contact',     to: '/contact' },
  ],
  products: [
    { label: 'Coconut',        to: '/products#coconut' },
    { label: 'Plantain',       to: '/products#plantain' },
    { label: 'Plantain Flour', to: '/products#plantain' },
    { label: 'Noilers & Hens', to: '/products#poultry' },
    { label: 'Eggs',           to: '/products#eggs' },
    { label: 'Coming Soon',    to: '/products#coming-soon' },
  ],
}
</script>

<template>
  <footer class="bg-trovara-dark text-white">

    <section class="border-b border-white/10">
      <div class="container-trovara py-14 lg:py-16">
        <NewsletterSubscribe variant="footer" />
      </div>
    </section>

    <div class="container-trovara py-16 lg:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        <div class="lg:col-span-2">
          <RouterLink to="/" class="flex items-center gap-2.5 mb-6 group w-fit" @click="onHomeClick">
            <div class="w-10 h-10 rounded-full bg-trovara-green flex items-center justify-center group-hover:scale-105 transition-transform">
              <span class="text-trovara-gold font-black text-xl leading-none">T</span>
            </div>
            <div class="flex flex-col leading-none">
              <span class="font-black text-2xl tracking-tight text-white">TROVARA</span>
              <span class="text-[11px] font-medium tracking-widest uppercase text-trovara-gold-300">Farm</span>
            </div>
          </RouterLink>
          <p class="text-trovara-gold font-semibold text-sm italic mb-3">
            Food you can trust, from a farm built for tomorrow.
          </p>
          <p class="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
            Premium tropical produce and free-range dressed noilers & mature hens, grown with integrity and delivered with pride.
          </p>
          <div class="flex items-center gap-3" aria-label="Trovara on social media">
            <a
              v-for="link in SOCIAL_LINKS"
              :key="link.id"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-trovara-gold hover:border-trovara-gold/50 hover:bg-white/5 transition-colors"
            >
              <svg
                v-if="link.id === 'facebook'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.68 3.55-3.68 1.03 0 2.1.18 2.1.18v2.32h-1.18c-1.17 0-1.53.73-1.53 1.48v1.78h2.61l-.42 2.91h-2.19V22c4.78-.75 8.44-4.91 8.44-9.93z"
                />
              </svg>
              <svg
                v-else-if="link.id === 'instagram'"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                />
              </svg>
              <svg
                v-else
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-5">Company</h4>
          <ul class="space-y-3">
            <li v-for="link in links.company" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-white/60 hover:text-trovara-gold text-sm transition-colors"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-5">Products</h4>
          <ul class="space-y-3">
            <li v-for="link in links.products" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-white/60 hover:text-trovara-gold text-sm transition-colors"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-trovara py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white/40 text-sm">
          &copy; {{ currentYear }} Trovara Farm. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <RouterLink
            to="/privacy"
            class="text-white/40 hover:text-trovara-gold text-sm transition-colors"
          >
            Privacy Policy
          </RouterLink>
          <RouterLink
            to="/terms"
            class="text-white/40 hover:text-trovara-gold text-sm transition-colors"
          >
            Terms of Service
          </RouterLink>
          <p class="text-white/40 text-sm">
            Crafted with 🌿 for the earth and its people.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
