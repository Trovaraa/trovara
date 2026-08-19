<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import StructuredData from './components/StructuredData.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import ConsentBanner from './components/ConsentBanner.vue'
import { bannerOpen } from './lib/consent'
import { usePageMeta } from './composables/usePageMeta'
import { useTheme } from './lib/theme'

const route = useRoute()
const router = useRouter()
usePageMeta(router)
// Keep html.dark + theme-color in sync for the session.
useTheme()

const routeKey = computed(() => route.path)
const mainContent = ref<HTMLElement | null>(null)

function jumpToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

// Scroll BEFORE the view swaps so we never show the footer alone while
// main content is mid-transition. Skip only for in-page hash jumps.
router.beforeEach((to, from) => {
  if (to.hash && to.path === from.path) return
  jumpToTop()
})

router.afterEach((to) => {
  if (to.hash) return
  void nextTick(() => {
    jumpToTop()
    mainContent.value?.focus({ preventScroll: true })
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <StructuredData />
    <!-- Ahead of the page so the banner is the first thing keyboard focus reaches. -->
    <ConsentBanner />
    <TheNavbar />
    <!-- Keep the footer below the initial viewport while an async route chunk
         resolves. Without this reserve, deep links render the footer first and
         then push it away, producing a large layout shift. -->
    <main id="main-content" ref="mainContent" class="min-h-screen flex-1" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <!-- No mode="out-in": that emptied <main> during leave and parked the
             viewport on the footer (looked like a broken navigation). -->
        <Transition name="page">
          <component :is="Component" :key="routeKey" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <WhatsAppButton v-if="!bannerOpen" />
    <InstallPrompt v-if="!bannerOpen" />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 100;
  transform: translateY(-200%);
  border-radius: 0.5rem;
  background: #fff;
  color: #18311f;
  padding: 0.75rem 1rem;
  font-weight: 700;
}

.skip-link:focus {
  transform: translateY(0);
}

#main-content:focus {
  outline: none;
}
</style>
