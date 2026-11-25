<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TrovaraLogo from './brand/TrovaraLogo.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import { useTheme } from '../lib/theme'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { SHOP_ACCOUNT_URL } from '../lib/shop-account'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileMenu = ref<HTMLElement | null>(null)
const moreMenu = ref<HTMLDetailsElement | null>(null)
let restoreFocusTo: HTMLElement | null = null
const { isDark } = useTheme()
const chatUrl = buildWhatsAppLink("Hi Trovara, I'd like help finding the right product or service.")

const primaryLinks = [
  { label: 'Shop', href: SHOP_ACCOUNT_URL },
  { label: 'Wholesale', to: '/wholesale/' },
  { label: 'Services', to: '/services/' },
  { label: 'Journals', to: '/journal/' },
  { label: 'Chat', href: chatUrl, ariaLabel: 'Chat on WhatsApp' },
]

const moreLinks = [
  { label: 'Products', to: '/products/' },
  { label: 'The Farm', to: '/farm/' },
  { label: 'Our Story', to: '/about/' },
  { label: 'Moments', to: '/moments/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'FAQ', to: '/faq/' },
  { label: 'Food survey', to: '/survey/' },
  { label: 'Contact', to: '/contact/' },
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

function closeMoreMenu() {
  if (moreMenu.value) moreMenu.value.open = false
}

function onMoreFocusOut(event: FocusEvent) {
  if (!(event.relatedTarget instanceof Node) || !moreMenu.value?.contains(event.relatedTarget)) {
    closeMoreMenu()
  }
}

function onMoreEscape() {
  closeMoreMenu()
  moreMenu.value?.querySelector('summary')?.focus()
}

function onMobileExternalClick() {
  closeMobileMenu()
  void nextTick(() => menuButton.value?.focus())
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
  return to.split('#')[0].replace(/\/+$/, '') || '/'
}

function navLinkActive(to: string) {
  const current = childPath(route.path)
  const target = childPath(to)
  if (target === '/services' && ['/farm-os', '/farm-advisory'].includes(current)) return true
  return current === target || current.startsWith(`${target}/`)
}

/** Same-route clicks (e.g. Home while already on /) skip the router - still jump up. */
function onNavClick(to: string) {
  closeMobileMenu()
  closeMoreMenu()
  if (childPath(route.path) === childPath(to) && !to.includes('#')) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
    closeMoreMenu()
  },
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
        : 'bg-white/95 backdrop-blur-xs shadow-xs dark:border-b dark:border-white/5',
    ]"
  >
    <nav class="container-trovara" aria-label="Primary navigation">
      <div class="flex items-center justify-between h-16 md:h-18">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="onNavClick('/')">
          <TrovaraLogo :tone="logoTone" compact />
        </RouterLink>

        <!-- Desktop navigation -->
        <div class="hidden xl:flex items-center gap-0.5">
          <template v-for="link in primaryLinks" :key="link.label">
            <a
              v-if="link.href"
              :href="link.href"
              :aria-label="link.ariaLabel"
              class="px-3 py-2 rounded-full text-sm font-semibold transition-colors"
              :class="link.href === SHOP_ACCOUNT_URL
                ? 'bg-trovara-gold text-[#101914] hover:bg-trovara-gold-300'
                : overHero
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-trovara-dark hover:text-white! hover:bg-trovara-green!'"
            >
              {{ link.label }}
            </a>
            <RouterLink
              v-else-if="link.to"
              :to="link.to"
              class="px-3 py-2 rounded-full text-sm font-semibold transition-colors"
              :class="[
                overHero
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-trovara-dark hover:text-white! hover:bg-trovara-green!',
                navLinkActive(link.to) && (overHero ? 'text-white! bg-white/20!' : 'text-white! bg-trovara-green!'),
              ]"
              @click="onNavClick(link.to)"
            >
              {{ link.label }}
            </RouterLink>
          </template>
          <details ref="moreMenu" class="group relative" @focusout="onMoreFocusOut" @keydown.esc.stop.prevent="onMoreEscape">
            <summary
              class="inline-flex list-none cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors [&::-webkit-details-marker]:hidden"
              :class="overHero ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-trovara-dark hover:text-white! hover:bg-trovara-green!'"
            >
              More
              <svg class="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <ul class="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-white/10">
              <li v-for="link in moreLinks" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="block rounded-xl px-4 py-3 text-sm font-semibold text-trovara-dark transition-colors hover:bg-trovara-green! hover:text-white!"
                  :class="navLinkActive(link.to) ? 'bg-trovara-green/10! text-trovara-green!' : ''"
                  @click="onNavClick(link.to)"
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
          </details>
          <ThemeSwitcher class="ml-2" :on-dark-chrome="overHero" />
        </div>

        <!-- Mobile controls -->
        <div class="xl:hidden flex items-center gap-1">
          <a :href="SHOP_ACCOUNT_URL" class="inline-flex min-h-11 items-center rounded-full bg-trovara-gold px-4 text-sm font-bold text-[#101914] hover:bg-trovara-gold-300">
            Shop
          </a>
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
          <div class="px-2 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <ul class="space-y-1">
              <li v-for="link in primaryLinks" :key="link.label">
                <a
                  v-if="link.href"
                  :href="link.href"
                  :aria-label="link.ariaLabel"
                  class="block rounded-xl px-4 py-3 font-semibold text-trovara-dark transition-colors hover:bg-trovara-green! hover:text-white!"
                  @click="onMobileExternalClick"
                >
                  {{ link.label }}
                </a>
                <RouterLink
                  v-else-if="link.to"
                  :to="link.to"
                  class="block rounded-xl px-4 py-3 font-semibold text-trovara-dark transition-colors hover:bg-trovara-green! hover:text-white!"
                  :class="navLinkActive(link.to) ? 'bg-trovara-green! text-white!' : ''"
                  @click="onNavClick(link.to)"
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
            <ul aria-label="More destinations" class="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-white/10">
              <li v-for="link in moreLinks" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="block rounded-xl px-4 py-3 font-medium text-trovara-dark transition-colors hover:bg-trovara-green! hover:text-white!"
                  :class="navLinkActive(link.to) ? 'bg-trovara-green! text-white!' : ''"
                  @click="onNavClick(link.to)"
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
            <div class="mt-2 border-t border-gray-100 px-4 pt-3 dark:border-white/10">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>
