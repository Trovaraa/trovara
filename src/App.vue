<script setup lang="ts">
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
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
