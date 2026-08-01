<script setup lang="ts">
withDefaults(defineProps<{
  tone?: 'dark' | 'light'
  descriptor?: string
  compact?: boolean
}>(), {
  tone: 'dark',
  descriptor: 'Farm',
  compact: false,
})
</script>

<template>
  <span class="inline-flex items-center gap-2.5" aria-label="Trovara">
    <img
      src="/brand/trovara-monogram-tile-v1.svg"
      alt=""
      :class="compact ? 'h-9 w-9' : 'h-11 w-11'"
      width="44"
      height="44"
    />
    <span class="flex flex-col leading-none">
      <span
        :class="[
          compact ? 'text-lg' : 'text-xl',
          tone === 'light' ? 'text-white' : 'text-[#101914]',
        ]"
        class="font-black tracking-[0.035em]"
      >TROVARA</span>
      <span
        :class="tone === 'light' ? 'text-trovara-gold-300' : 'text-trovara-green'"
        class="mt-1 text-[9px] font-black uppercase tracking-[0.3em]"
      >{{ descriptor }}</span>
    </span>
  </span>
</template>
