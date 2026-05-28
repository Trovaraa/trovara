<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
}>()
</script>

<template>
  <div :class="['max-w-2xl mb-12 md:mb-16', center ? 'mx-auto text-center' : '']">
    <p
      v-if="eyebrow"
      :class="[
        'section-subheading mb-3',
        light ? 'text-trovara-gold-300' : 'text-trovara-green',
      ]"
    >
      {{ eyebrow }}
    </p>
    <h2
      :class="[
        'section-heading mb-4',
        light ? 'text-white' : 'text-trovara-dark',
      ]"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      :class="[
        'text-lg leading-relaxed',
        light ? 'text-white/70' : 'text-gray-500',
      ]"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
