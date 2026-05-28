<script setup lang="ts">
import { ref, reactive } from 'vue'

const currentYear = new Date().getFullYear()

const links = {
  company: [
    { label: 'About Us',    to: '/about' },
    { label: 'The Farm',    to: '/farm' },
    { label: 'Our Story',   to: '/about#story' },
    { label: 'Services',    to: '/services' },
    { label: 'FAQ',         to: '/faq' },
    { label: 'Contact',     to: '/contact' },
  ],
  products: [
    { label: 'Coconut',        to: '/products#coconut' },
    { label: 'Plantain',       to: '/products#plantain' },
    { label: 'Plantain Flour', to: '/products#plantain' },
    { label: 'Poultry',        to: '/products#poultry' },
    { label: 'Coming Soon',    to: '/products#coming-soon' },
  ],
}

const newsletter = reactive({
  email: '',
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  error: '',
})

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function subscribe() {
  newsletter.error = ''
  if (!isValidEmail(newsletter.email)) {
    newsletter.error = 'Please enter a valid email address.'
    return
  }

  newsletter.status = 'loading'
  try {
    await new Promise((resolve) => setTimeout(resolve, 900))
    newsletter.status = 'success'
    newsletter.email = ''
  } catch {
    newsletter.status = 'error'
    newsletter.error = 'Something went wrong. Please try again.'
  }
}

function reset() {
  newsletter.status = 'idle'
  newsletter.error = ''
}
</script>

<template>
  <footer class="bg-trovara-dark text-white">

    <section class="border-b border-white/10">
      <div class="container-trovara py-14 lg:py-16">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p class="text-trovara-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
              Stay in the harvest loop
            </p>
            <h3 class="text-2xl md:text-3xl font-black text-white mb-3">
              Updates from the farm, straight to your inbox.
            </h3>
            <p class="text-white/60 text-sm leading-relaxed max-w-md">
              Be first to hear about new harvests, fresh product launches, recipes
              for plantain and coconut, and the occasional behind-the-scenes story.
              No spam, ever.
            </p>
          </div>

          <div>
            <form
              v-if="newsletter.status !== 'success'"
              @submit.prevent="subscribe"
              class="flex flex-col sm:flex-row gap-3"
            >
              <div class="flex-1">
                <input
                  v-model="newsletter.email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-trovara-gold focus:border-transparent transition text-sm"
                  :disabled="newsletter.status === 'loading'"
                  @input="newsletter.error = ''"
                />
                <p v-if="newsletter.error" class="text-trovara-gold-300 text-xs mt-2">
                  {{ newsletter.error }}
                </p>
              </div>
              <button
                type="submit"
                :disabled="newsletter.status === 'loading'"
                class="btn-gold px-6 py-3.5 text-sm sm:flex-shrink-0"
                :class="newsletter.status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''"
              >
                <span v-if="newsletter.status === 'loading'" class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Subscribing...
                </span>
                <span v-else>Subscribe</span>
              </button>
            </form>

            <div
              v-else
              class="flex items-start gap-4 bg-trovara-green/20 border border-trovara-green/40 rounded-xl px-5 py-4"
            >
              <div class="w-9 h-9 rounded-full bg-trovara-green flex-shrink-0 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-bold text-white text-sm">You're in.</p>
                <p class="text-white/60 text-xs mt-0.5">
                  Welcome to the Trovara family. Check your inbox for a confirmation.
                </p>
                <button
                  @click="reset"
                  class="text-trovara-gold-300 hover:text-trovara-gold text-xs font-semibold mt-2 underline-offset-2 hover:underline"
                >
                  Subscribe another email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container-trovara py-16 lg:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        <div class="lg:col-span-2">
          <RouterLink to="/" class="flex items-center gap-2.5 mb-6 group w-fit">
            <div class="w-10 h-10 rounded-full bg-trovara-green flex items-center justify-center group-hover:scale-105 transition-transform">
              <span class="text-trovara-gold font-black text-xl leading-none">T</span>
            </div>
            <div class="flex flex-col leading-none">
              <span class="font-black text-2xl tracking-tight text-white">TROVARA</span>
              <span class="text-[11px] font-medium tracking-widest uppercase text-trovara-gold-300">Farm</span>
            </div>
          </RouterLink>
          <p class="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
            Born natural. Raised global.<br/>
            Premium tropical produce and poultry, grown with integrity and delivered with pride.
          </p>
          <p class="text-trovara-gold font-semibold text-sm italic">
            "Born natural. Raised global."
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
        <p class="text-white/40 text-sm">
          Crafted with 🌿 for the earth and its people.
        </p>
      </div>
    </div>
  </footer>
</template>
