<script setup lang="ts">
defineProps<{
  value: string
  label: string
  icon: string
  dark?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl p-6 text-center',
      dark
        ? 'bg-white/10 backdrop-blur-sm'
        : 'bg-white shadow-sm border border-gray-100',
    ]"
  >
    <div class="text-3xl mb-3">{{ icon }}</div>
    <div
      :class="[
        'text-3xl md:text-4xl font-black mb-1',
        dark ? 'text-white' : 'text-trovara-green',
      ]"
    >
      {{ value }}
    </div>
    <div :class="['text-sm font-medium', dark ? 'text-white/70' : 'text-gray-500']">
      {{ label }}
    </div>
  </div>
</template>
