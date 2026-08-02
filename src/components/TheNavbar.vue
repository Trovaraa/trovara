<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TrovaraLogo from './brand/TrovaraLogo.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import { useTheme } from '../lib/theme'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const { isDark } = useTheme()

const navLinks = [
  { label: 'Products', to: '/products' },
  { label: 'The Farm', to: '/farm' },
  { label: 'Our Story', to: '/about' },
  { label: 'Farm OS', to: '/services' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Journal', to: '/blog' },
]

const isHome = computed(() => route.name === 'home')
/** Transparent hero chrome (white type / light logo). */
const overHero = computed(() => isHome.value && !scrolled.value)
/** Solid bar: light logo on dark theme, dark logo on light theme. */
const logoTone = computed(() => {
  if (overHero.value) return 'light'
  return isDark.value ? 'light' : 'dark'
})

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

/** Same-route clicks (e.g. Home while already on /) skip the router - still jump up. */
function onNavClick(to: string) {
  mobileMenuOpen.value = false
  const current = route.path
  const target = to.split('#')[0] || '/'
  if (current === target) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      overHero
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-sm shadow-sm dark:border-b dark:border-white/5',
    ]"
  >
    <nav class="container-trovara">
      <div class="flex items-center justify-between h-16 md:h-[4.5rem]">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="onNavClick('/')">
          <TrovaraLogo :tone="logoTone" compact />
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-0.5">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200',
              overHero
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-trovara-dark hover:text-trovara-green hover:bg-trovara-light',
              route.path === link.to
                ? overHero
                  ? '!text-white !bg-white/20'
                  : '!text-trovara-green !bg-trovara-green/10'
                : '',
            ]"
            @click="onNavClick(link.to)"
          >
            {{ link.label }}
          </RouterLink>
          <ThemeSwitcher class="ml-2" :on-dark-chrome="overHero" />
          <RouterLink to="/contact" class="ml-2 btn-gold text-sm py-2.5 px-5 rounded-full" @click="onNavClick('/contact')">
            Talk to us
          </RouterLink>
        </div>

        <!-- Mobile controls -->
        <div class="md:hidden flex items-center gap-1.5">
          <ThemeSwitcher :on-dark-chrome="overHero" />
          <button
            class="p-2 rounded-lg transition-colors"
            :class="overHero ? 'text-white hover:bg-white/10' : 'text-trovara-dark hover:bg-trovara-light'"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden bg-white border-t border-gray-100 shadow-lg rounded-b-2xl overflow-hidden"
        >
          <div class="px-4 py-3 space-y-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block px-4 py-3 rounded-xl text-trovara-dark font-medium hover:text-trovara-green hover:bg-trovara-light transition-colors"
              :class="route.path === link.to ? '!text-trovara-green !bg-trovara-green/10' : ''"
              @click="onNavClick(link.to)"
            >
              {{ link.label }}
            </RouterLink>
            <div class="pt-2 pb-1">
              <RouterLink to="/contact" class="btn-primary w-full text-sm" @click="onNavClick('/contact')">
                Get in Touch
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
