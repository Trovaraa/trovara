<script setup lang="ts">
import type { ProductSpecRow } from '../../types'

defineProps<{
  specs: ProductSpecRow[]
  title?: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
    <div v-if="title" class="px-5 py-4 bg-trovara-cream/60 border-b border-gray-100">
      <h4 class="text-sm font-bold uppercase tracking-widest text-trovara-green">{{ title }}</h4>
    </div>
    <dl class="divide-y divide-gray-50">
      <div
        v-for="row in specs"
        :key="row.label"
        class="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 px-5 py-3.5"
      >
        <dt class="text-xs font-bold uppercase tracking-wide text-gray-400">{{ row.label }}</dt>
        <dd class="text-sm text-trovara-dark font-medium">{{ row.value }}</dd>
      </div>
    </dl>
  </div>
</template>
