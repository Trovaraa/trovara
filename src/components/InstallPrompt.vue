<script setup lang="ts">
import { useInstallPrompt } from '../composables/useInstallPrompt'

const { visible, canPrompt, iosHint, install, dismiss } = useInstallPrompt()
</script>

<template>
  <Transition name="a2hs">
    <div
      v-if="visible"
      class="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[60] rounded-2xl bg-trovara-dark text-white shadow-2xl border border-white/10 p-4"
      role="dialog"
      aria-label="Add Trovara to your home screen"
    >
      <div class="flex gap-3 items-start">
        <div class="w-11 h-11 rounded-xl bg-trovara-green flex items-center justify-center flex-shrink-0">
          <span class="text-trovara-gold font-black text-lg">T</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm mb-1">Add Trovara to your Home Screen</p>
          <p v-if="canPrompt" class="text-white/65 text-xs leading-relaxed mb-3">
            Install for one-tap access to products, the farm story, and wholesale info - works like an app icon.
          </p>
          <p v-else-if="iosHint" class="text-white/65 text-xs leading-relaxed mb-3">
            Tap <span class="text-trovara-gold font-semibold">Share</span>, then
            <span class="text-trovara-gold font-semibold">Add to Home Screen</span>
            for a Trovara icon on your phone.
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-if="canPrompt"
              type="button"
              class="btn-gold text-xs px-4 py-2"
              @click="install"
            >
              Install
            </button>
            <button
              type="button"
              class="text-xs px-3 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition"
              @click="dismiss"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.a2hs-enter-active,
.a2hs-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.a2hs-enter-from,
.a2hs-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
