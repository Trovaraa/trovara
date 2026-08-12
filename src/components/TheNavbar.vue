<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TrovaraLogo from './brand/TrovaraLogo.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import { useTheme } from '../lib/theme'
import { buildWhatsAppLink } from '../lib/whatsapp'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileMenu = ref<HTMLElement | null>(null)
let restoreFocusTo: HTMLElement | null = null
const { isDark } = useTheme()
const mobileWhatsAppLink = buildWhatsAppLink("Hi Trovara Farm, I'd like help finding the right product or service.")

const serviceLinks = [
  { label: 'Farm OS', to: '/farm-os' },
  { label: 'Farm Advisory', to: '/farm-advisory' },
]

/** Secondary destinations — kept off the primary rail so the bar stays short. */
const moreLinks = [
  { label: 'Blog', to: '/blog' },
  { label: 'Moments', to: '/moments' },
  { label: 'Careers', to: '/careers' },
  { label: 'FAQ', to: '/faq' },
]

const desktopNavItems = [
  { label: 'Products', to: '/products' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'The Farm', to: '/farm' },
  { label: 'Services', children: serviceLinks },
  { label: 'Our Story', to: '/about' },
  { label: 'More', children: moreLinks },
  { label: 'Account', to: '/shop' },
]

const mobileNavLinks = [
  { label: 'Products', to: '/products' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Account', to: '/shop' },
  { label: 'The Farm', to: '/farm' },
  ...serviceLinks,
  { label: 'Our Story', to: '/about' },
  ...moreLinks,
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

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (!mobileMenuOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMobileMenu()
    void nextTick(() => (restoreFocusTo ?? menuButton.value)?.focus())
    return
  }
  if (event.key !== 'Tab' || !mobileMenu.value) return
  const focusable = Array.from(
    mobileMenu.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onResize() {
  if (window.innerWidth >= 1280) closeMobileMenu()
}

function childPath(to: string) {
  return to.split('#')[0] || '/'
}

function childLinkActive(to: string) {
  const path = childPath(to)
  if (route.path !== path) return false
  if (!to.includes('#')) return true
  return route.hash === to.slice(to.indexOf('#'))
}

function dropdownActive(item: { label: string; children?: { to: string }[] }) {
  if (item.label === 'Services') return route.path === '/services' || route.path === '/farm-os' || route.path === '/farm-advisory'
  return item.children?.some((link) => route.path === childPath(link.to)) ?? false
}

/** Same-route clicks (e.g. Home while already on /) skip the router - still jump up. */
function onNavClick(to: string) {
  mobileMenuOpen.value = false
  const current = route.path
  const target = childPath(to)
  if (current === target && !to.includes('#')) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

watch(
  () => route.fullPath,
  () => closeMobileMenu(),
)

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    restoreFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
    void nextTick(() => mobileMenu.value?.querySelector<HTMLElement>('a[href]')?.focus())
  }
})

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
})
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
    <nav class="container-trovara" aria-label="Primary navigation">
      <div class="flex items-center justify-between h-16 md:h-[4.5rem]">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="onNavClick('/')">
          <TrovaraLogo :tone="logoTone" compact />
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden xl:flex items-center gap-0.5">
          <template v-for="item in desktopNavItems" :key="item.label">
            <div v-if="'children' in item" class="group relative">
              <button
                type="button"
                aria-haspopup="true"
                :class="[
                  'inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                  overHero
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-trovara-dark hover:!text-white hover:!bg-trovara-green',
                  dropdownActive(item)
                    ? overHero
                      ? '!text-white !bg-white/20'
                      : '!text-white !bg-trovara-green'
                    : '',
                ]"
              >
                {{ item.label }}
                <svg class="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div class="invisible absolute left-1/2 top-full z-20 w-60 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div class="rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-white/10">
                  <RouterLink
                    v-for="link in item.children"
                    :key="link.to"
                    :to="link.to"
                    class="block rounded-xl px-4 py-3 text-sm font-semibold text-trovara-dark transition-colors hover:!bg-trovara-green hover:!text-white"
                    :class="childLinkActive(link.to) ? '!bg-trovara-green/10 !text-trovara-green' : ''"
                    @click="onNavClick(link.to)"
                  >
                    {{ link.label }}
                  </RouterLink>
                </div>
              </div>
            </div>
            <RouterLink
              v-else
              :to="item.to"
              :class="[
                'px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                overHero
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-trovara-dark hover:!text-white hover:!bg-trovara-green',
                route.path === item.to
                  ? overHero
                    ? '!text-white !bg-white/20'
                    : '!text-white !bg-trovara-green'
                  : '',
              ]"
              @click="onNavClick(item.to)"
            >
              {{ item.label }}
            </RouterLink>
          </template>
          <ThemeSwitcher class="ml-2" :on-dark-chrome="overHero" />
          <RouterLink to="/contact" class="ml-2 btn-gold text-sm py-2.5 px-5 rounded-full" @click="onNavClick('/contact')">
            Talk to us
          </RouterLink>
        </div>

        <!-- Mobile controls -->
        <div class="xl:hidden flex items-center gap-1">
          <ThemeSwitcher :on-dark-chrome="overHero" />
          <button
            ref="menuButton"
            class="grid min-h-11 min-w-11 place-items-center rounded-lg transition-colors"
            :class="overHero ? 'text-white hover:bg-white/10' : 'text-trovara-dark hover:bg-trovara-light'"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-navigation"
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
          ref="mobileMenu"
          v-if="mobileMenuOpen"
          id="mobile-navigation"
          class="xl:hidden max-h-[calc(100dvh-4rem-env(safe-area-inset-bottom))] overscroll-contain overflow-y-auto bg-white border-t border-gray-100 shadow-lg rounded-b-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div class="px-2 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] space-y-1">
            <RouterLink
              v-for="link in mobileNavLinks"
              :key="link.to"
              :to="link.to"
              class="block px-4 py-3 rounded-xl text-trovara-dark font-medium hover:!text-white hover:!bg-trovara-green transition-colors"
              :class="route.path === link.to.split('#')[0] && (!link.to.includes('#') || route.hash === link.to.slice(link.to.indexOf('#'))) ? '!text-white !bg-trovara-green' : ''"
              @click="onNavClick(link.to)"
            >
              {{ link.label }}
            </RouterLink>
            <div class="pt-2 pb-1">
              <RouterLink to="/contact" class="btn-primary w-full text-sm" @click="onNavClick('/contact')">
                Get in Touch
              </RouterLink>
              <a
                :href="mobileWhatsAppLink"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white"
              >
                Ask us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
