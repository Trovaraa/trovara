<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { bannerOpen, consent, setConsent } from '../lib/consent'

const panel = ref<HTMLElement | null>(null)

function dismiss() {
  bannerOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (bannerOpen.value && e.key === 'Escape') dismiss()
}

// Reopening from a link is deliberate, so send focus to the panel. On a first
// visit the banner is already open at mount and must not steal focus.
watch(bannerOpen, (open) => {
  if (!open) return
  void nextTick(() => panel.value?.focus())
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition name="consent">
    <div
      v-if="bannerOpen"
      class="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6 pointer-events-none"
    >
      <div
        ref="panel"
        tabindex="-1"
        role="dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-body"
        class="pointer-events-auto max-w-3xl mx-auto rounded-2xl bg-trovara-dark text-white shadow-2xl border border-white/10 p-5 sm:p-6 focus:outline-none focus:ring-2 focus:ring-trovara-gold/60"
      >
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div class="flex-1 min-w-0">
            <p id="consent-title" class="font-bold text-sm mb-1.5">Analytics on this site</p>
            <p id="consent-body" class="text-white/65 text-xs leading-relaxed">
              We would like to measure how this site is used - pages opened and links clicked - which
              stores two cookies in your browser and sends your visit to our analytics providers.
              Nothing analytics-related loads until you choose, and declining changes nothing about
              how you use the site. See our
              <RouterLink
                to="/privacy#cookies"
                class="text-trovara-gold font-semibold hover:underline"
                @click="dismiss"
              >Privacy Policy</RouterLink>.
            </p>
            <p v-if="consent" class="text-white/40 text-xs mt-2">
              Current choice: analytics {{ consent === 'granted' ? 'accepted' : 'declined' }}.
            </p>
          </div>
          <div class="flex gap-3 sm:flex-shrink-0">
            <button
              type="button"
              class="btn-gold text-sm px-5 py-2.5 flex-1 sm:flex-none"
              @click="setConsent('granted')"
            >
              Accept
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center flex-1 sm:flex-none px-5 py-2.5 rounded-lg border-2 border-white/25 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
              @click="setConsent('denied')"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.consent-enter-active,
.consent-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
