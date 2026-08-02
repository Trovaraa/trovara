<script setup lang="ts">
import { useTheme } from '../lib/theme'

defineProps<{
  /** Light icons for transparent hero navbar */
  onDarkChrome?: boolean
}>()

const { isDark, setDark } = useTheme()
</script>

<template>
  <div
    class="inline-flex shrink-0 rounded-full border p-0.5"
    :class="
      onDarkChrome
        ? 'border-white/25 bg-white/10'
        : 'border-gray-200 bg-trovara-light dark:border-white/10 dark:bg-white/5'
    "
    role="group"
    aria-label="Color theme"
  >
    <button
      type="button"
      class="grid h-8 w-8 place-items-center rounded-full transition-colors"
      :class="
        isDark
          ? onDarkChrome
            ? 'bg-white text-trovara-dark'
            : 'bg-trovara-green text-white'
          : onDarkChrome
            ? 'text-white/70 hover:text-white'
            : 'text-gray-500 hover:text-trovara-dark'
      "
      :aria-pressed="isDark"
      aria-label="Dark mode"
      title="Dark mode"
      @click="setDark(true)"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
    <button
      type="button"
      class="grid h-8 w-8 place-items-center rounded-full transition-colors"
      :class="
        !isDark
          ? onDarkChrome
            ? 'bg-white text-trovara-dark'
            : 'bg-trovara-green text-white'
          : onDarkChrome
            ? 'text-white/70 hover:text-white'
            : 'text-gray-400 hover:text-trovara-dark'
      "
      :aria-pressed="!isDark"
      aria-label="Light mode"
      title="Light mode"
      @click="setDark(false)"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  </div>
</template>
