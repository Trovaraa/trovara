<script setup lang="ts">
import { computed } from 'vue'
import { buildWhatsAppLink, PRODUCT_MESSAGES } from '../../lib/whatsapp'
import type { Product } from '../../types'

const props = defineProps<{ product: Product }>()

const whatsappLink = computed(() => {
  const productMessage = PRODUCT_MESSAGES[props.product.id as keyof typeof PRODUCT_MESSAGES]
  if (!productMessage) return ''
  return buildWhatsAppLink(productMessage)
})
</script>

<template>
  <article
    class="card group cursor-pointer"
    :style="{ '--card-color': product.color }"
  >
    <!-- Card Header -->
    <div
      class="relative px-8 pt-10 pb-6 flex flex-col items-center text-center"
      :style="{ backgroundColor: product.bgColor }"
    >
      <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {{ product.icon }}
      </div>
      <span
        v-if="!product.available"
        class="absolute top-4 right-4 px-2.5 py-1 bg-trovara-green/10 text-trovara-green text-xs font-semibold rounded-full"
      >
        Coming Soon
      </span>
      <h3 class="text-xl font-bold text-trovara-dark mb-1">{{ product.name }}</h3>
      <p class="text-sm font-medium italic" :style="{ color: product.color }">
        {{ product.tagline }}
      </p>
    </div>

    <!-- Card Body -->
    <div class="px-8 py-6">
      <p class="text-sm text-gray-600 leading-relaxed mb-5">
        {{ product.description }}
      </p>
      <ul class="space-y-2">
        <li
          v-for="benefit in product.benefits"
          :key="benefit"
          class="flex items-start gap-2.5 text-sm text-trovara-dark"
        >
          <span class="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                :style="{ backgroundColor: product.color }">
            ✓
          </span>
          {{ benefit }}
        </li>
      </ul>
    </div>

    <!-- Card Footer -->
    <div class="px-8 pb-8 space-y-3">
      <RouterLink
        :to="`/products/${product.id}`"
        class="block w-full text-center py-2.5 px-4 rounded-lg border-2 font-semibold text-sm transition-all duration-200 hover:text-white"
        :style="{
          borderColor: product.color,
          color: product.color,
        }"
        :class="!product.available ? 'opacity-50 pointer-events-none' : ''"
        @mouseenter="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.backgroundColor = product.color }"
        @mouseleave="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }"
      >
        {{ product.available ? 'Learn More' : 'Stay Tuned' }}
      </RouterLink>
      <a
        v-if="product.available && whatsappLink"
        :href="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full text-center py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-sm transition-colors duration-200"
      >
        WhatsApp Enquiry
      </a>
    </div>
  </article>
</template>
