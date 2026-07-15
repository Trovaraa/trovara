<script setup lang="ts">
import { useRouter } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import StructuredData from './components/StructuredData.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import { usePageMeta } from './composables/usePageMeta'

const router = useRouter()
usePageMeta(router)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <StructuredData />
    <TheNavbar />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <WhatsAppButton />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
