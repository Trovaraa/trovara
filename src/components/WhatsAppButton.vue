<script setup lang="ts">
import { ref, onMounted } from 'vue'

const phoneNumber = '233000000000'
const presetMessage = encodeURIComponent(
  "Hi Trovara Farm, I'd like to learn more about your products."
)
const waLink = `https://wa.me/${phoneNumber}?text=${presetMessage}`

const expanded = ref(false)
const showTooltip = ref(false)

onMounted(() => {
  setTimeout(() => {
    showTooltip.value = true
    setTimeout(() => (showTooltip.value = false), 6000)
  }, 3000)
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-if="expanded"
        class="bg-white rounded-2xl shadow-2xl p-5 w-72 border border-gray-100"
      >
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-trovara-green flex items-center justify-center flex-shrink-0">
            <span class="text-trovara-gold font-black text-base leading-none">T</span>
          </div>
          <div>
            <p class="font-bold text-trovara-dark text-sm">Trovara Farm</p>
            <p class="text-trovara-green text-xs font-medium">Online — replies within minutes</p>
          </div>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          Hi there! Ask us anything about our plantain, coconut, poultry, or farm development services.
        </p>
        <a
          :href="waLink"
          target="_blank"
          rel="noopener"
          class="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.61.96-1 3.648 3.737-.98z"/>
          </svg>
          Start a WhatsApp Chat
        </a>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-4 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-4 opacity-0"
    >
      <div
        v-if="showTooltip && !expanded"
        class="bg-white text-trovara-dark text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 mr-2 relative whitespace-nowrap"
      >
        Chat with us
        <span class="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-[-45deg]"></span>
      </div>
    </Transition>

    <button
      @click="expanded = !expanded; showTooltip = false"
      :aria-label="expanded ? 'Close WhatsApp chat' : 'Open WhatsApp chat'"
      class="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 group relative"
    >
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 rotate-90"
        enter-to-class="opacity-100 rotate-0"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <svg v-if="!expanded" key="wa" class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.61.96-1 3.648 3.737-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/>
        </svg>
        <svg v-else key="x" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </Transition>

      <span v-if="!expanded" class="absolute -top-1 -right-1 w-3 h-3 bg-trovara-gold rounded-full ring-2 ring-white">
        <span class="absolute inset-0 rounded-full bg-trovara-gold animate-ping"></span>
      </span>
    </button>
  </div>
</template>
