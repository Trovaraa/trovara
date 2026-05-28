<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'About',    to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'The Farm', to: '/farm' },
  { label: 'FAQ',      to: '/faq' },
  { label: 'Contact',  to: '/contact' },
]

const isHome = computed(() => route.name === 'home')

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-sm shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <nav class="container-trovara">
      <div class="flex items-center justify-between h-16 md:h-20">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="mobileMenuOpen = false">
          <div class="w-9 h-9 rounded-full bg-trovara-green flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span class="text-trovara-gold font-black text-lg leading-none">T</span>
          </div>
          <div class="flex flex-col leading-none">
            <span
              :class="[
                'font-black text-xl tracking-tight transition-colors',
                scrolled || !isHome ? 'text-trovara-dark' : 'text-white',
              ]"
            >TROVARA</span>
            <span
              :class="[
                'text-[10px] font-medium tracking-widest uppercase transition-colors',
                scrolled || !isHome ? 'text-trovara-green' : 'text-trovara-gold-300',
              ]"
            >Farm</span>
          </div>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              scrolled || !isHome
                ? 'text-trovara-dark hover:text-trovara-green hover:bg-trovara-light'
                : 'text-white/90 hover:text-white hover:bg-white/10',
              route.path === link.to
                ? scrolled || !isHome
                  ? '!text-trovara-green !bg-trovara-green/10'
                  : '!text-white !bg-white/20'
                : '',
            ]"
          >
            {{ link.label }}
          </RouterLink>
          <RouterLink to="/contact" class="ml-4 btn-gold text-sm py-2 px-5">
            Get in Touch
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg transition-colors"
          :class="scrolled || !isHome ? 'text-trovara-dark hover:bg-trovara-light' : 'text-white hover:bg-white/10'"
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
              @click="mobileMenuOpen = false"
            >
              {{ link.label }}
            </RouterLink>
            <div class="pt-2 pb-1">
              <RouterLink to="/contact" class="btn-primary w-full text-sm" @click="mobileMenuOpen = false">
                Get in Touch
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
