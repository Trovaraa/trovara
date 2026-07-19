<script setup lang="ts">
import { useRoute } from 'vue-router'
import NewsletterSubscribe from './ui/NewsletterSubscribe.vue'

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
          <p class="text-white/60 text-sm leading-relaxed max-w-xs">
            Premium tropical produce and free-range dressed noilers & mature hens, grown with integrity and delivered with pride.
          </p>
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
