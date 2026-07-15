<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  caption?: string
  summary?: string
  dark?: boolean
}>()

const open = ref(false)

// Derive a JPEG fallback for browsers without WebP support.
const fallbackSrc = computed(() => props.src.replace(/\.webp$/i, '.jpeg'))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

void props
</script>

<template>
  <figure class="w-full">
    <button
      type="button"
      class="group relative block w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-trovara-green/40"
      :aria-label="`Expand: ${alt}`"
      @click="open = true"
    >
      <picture>
        <source :srcset="src" type="image/webp" />
        <img
          :src="fallbackSrc"
          :alt="alt"
          loading="lazy"
          decoding="async"
          class="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </picture>
      <span
        class="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-trovara-dark/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
          <path d="M13.28 7.78 15.56 5.5H12.5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V6.56l-2.28 2.28a.75.75 0 1 1-1.06-1.06ZM6.72 12.22 4.44 14.5H7.5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75v-5a.75.75 0 0 1 1.5 0v3.19l2.28-2.28a.75.75 0 1 1 1.06 1.06Z" />
        </svg>
        Click to zoom
      </span>
    </button>

    <figcaption
      v-if="caption || summary"
      :class="['mt-4', dark ? 'text-white/70' : 'text-gray-500']"
    >
      <span
        v-if="caption"
        :class="['block text-sm font-semibold', dark ? 'text-white' : 'text-trovara-dark']"
      >{{ caption }}</span>
      <span v-if="summary" class="mt-1 block text-sm leading-relaxed">{{ summary }}</span>
    </figcaption>

    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="open"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          :aria-label="alt"
          @click.self="open = false"
        >
          <button
            type="button"
            class="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            aria-label="Close"
            @click="open = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-6 w-6">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <div class="max-h-full max-w-6xl overflow-auto rounded-2xl">
            <picture>
              <source :srcset="src" type="image/webp" />
              <img
                :src="fallbackSrc"
                :alt="alt"
                class="h-auto w-full max-w-none"
              />
            </picture>
          </div>
        </div>
      </Transition>
    </Teleport>
  </figure>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
