<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import StructuredData from './components/StructuredData.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import { usePageMeta } from './composables/usePageMeta'

const route = useRoute()
const router = useRouter()
usePageMeta(router)

const routeKey = computed(() => route.path)

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
  void nextTick(() => jumpToTop())
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <StructuredData />
    <TheNavbar />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <!-- No mode="out-in": that emptied <main> during leave and parked the
             viewport on the footer (looked like a broken navigation). -->
        <Transition name="page">
          <component :is="Component" :key="routeKey" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <WhatsAppButton />
    <InstallPrompt />
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
</style>
