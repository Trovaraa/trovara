<script setup lang="ts">
import type { OrderTier } from '../../types'
import { buildWhatsAppLink } from '../../lib/whatsapp'

const props = defineProps<{
  tiers: OrderTier[]
  productName: string
  accentColor?: string
}>()

const accent = props.accentColor ?? '#1A6B3C'

function tierLink(tier: OrderTier): string {
  return buildWhatsAppLink(tier.whatsappMessage)
}
</script>

<template>
  <div>
    <div class="grid gap-6 sm:grid-cols-2 max-w-3xl">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        class="relative flex flex-col rounded-3xl bg-white p-7 shadow-sm border transition-all duration-200 hover:shadow-md"
        :class="tier.popular ? 'border-transparent ring-2' : 'border-gray-100'"
        :style="tier.popular ? { '--tw-ring-color': accent } : {}"
      >
        <span
          v-if="tier.popular"
          class="absolute -top-3 left-7 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white shadow-sm"
          :style="{ backgroundColor: accent }"
        >
          Popular
        </span>

        <h3 class="text-lg font-black text-trovara-dark">{{ tier.name }}</h3>

        <div class="mt-2 mb-1 flex items-baseline gap-1.5">
          <span
            v-if="tier.price"
            class="text-3xl font-black"
            :style="{ color: accent }"
          >
            {{ tier.price }}
          </span>
          <span v-else class="text-2xl font-black text-trovara-dark">Custom quote</span>
          <span v-if="tier.period" class="text-sm text-gray-400 font-medium">{{ tier.period }}</span>
        </div>

        <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ tier.description }}</p>

        <ul class="space-y-2.5 mb-7 flex-1">
          <li
            v-for="feature in tier.features"
            :key="feature"
            class="flex items-start gap-2.5 text-sm text-trovara-dark"
          >
            <span
              class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black"
              :style="{ backgroundColor: accent }"
            >
              ✓
            </span>
            {{ feature }}
          </li>
        </ul>

        <a
          :href="tierLink(tier)"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-colors"
          :style="{ backgroundColor: tier.popular ? accent : '#25D366' }"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Z"/>
          </svg>
          {{ tier.ctaLabel }}
        </a>
      </div>
    </div>

    <p class="mt-4 text-xs text-gray-400 max-w-3xl">
      Orders are confirmed over WhatsApp - we'll arrange delivery on our scheduled routes.
    </p>
  </div>
</template>
