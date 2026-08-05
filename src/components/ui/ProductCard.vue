<script setup lang="ts">
import { computed } from 'vue'
import { buildWhatsAppLink, PRODUCT_MESSAGES } from '../../lib/whatsapp'
import { productColorClasses } from '../../lib/productColors'
import type { Product } from '../../types'
import BrandIcon from '../brand/BrandIcon.vue'

const props = defineProps<{ product: Product }>()

const colors = computed(() => productColorClasses(props.product.id))

const whatsappLink = computed(() => {
  const productMessage = PRODUCT_MESSAGES[props.product.id as keyof typeof PRODUCT_MESSAGES]
  if (!productMessage) return ''
  return buildWhatsAppLink(productMessage)
})
</script>

<template>
  <article class="card group cursor-pointer overflow-hidden">
    <!-- Card Header -->
    <div
      class="relative flex flex-col items-center text-center overflow-hidden"
      :class="product.image ? 'bg-trovara-dark' : ['px-8 pt-10 pb-6', colors.headerBg]"
    >
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.imageAlt ?? product.name"
        class="w-full aspect-[3/2] object-cover object-left"
      />
      <template v-else>
        <div class="w-20 h-20 mb-4 rounded-2xl bg-white/80 p-2 shadow-sm group-hover:scale-105 transition-transform duration-300 dark:bg-trovara-dark/70">
          <BrandIcon :name="product.icon" :title="product.name" class="w-full h-full" />
        </div>
        <h3 class="relative text-xl font-bold text-trovara-dark mb-1">{{ product.name }}</h3>
        <p class="relative text-sm font-medium italic" :class="colors.text">
          {{ product.tagline }}
        </p>
      </template>
      <span
        v-if="!product.available"
        class="absolute top-4 right-4 z-10 px-2.5 py-1 bg-white/95 text-trovara-green text-xs font-semibold rounded-full shadow-sm"
      >
        Coming Soon
      </span>
      <span
        v-else-if="product.waitlist"
        class="absolute top-4 right-4 z-10 px-2.5 py-1 bg-white/95 text-trovara-green text-xs font-semibold rounded-full shadow-sm"
      >
        Waitlist
      </span>
      <div v-if="product.image" class="w-full px-8 pt-5 pb-2 text-left">
        <h3 class="text-xl font-bold text-white mb-1">{{ product.name }}</h3>
        <p class="text-sm font-medium italic text-trovara-gold-300">
          {{ product.tagline }}
        </p>
      </div>
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
          <span
            class="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            :class="colors.bgAccent"
          >
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
        class="block w-full text-center py-2.5 px-4 rounded-lg border-2 font-semibold text-sm transition-all duration-200"
        :class="[
          colors.btnOutline,
          !product.available ? 'opacity-50 pointer-events-none' : '',
        ]"
      >
        {{ product.waitlist ? 'Join the waitlist' : product.available ? 'Learn More' : 'Stay Tuned' }}
      </RouterLink>
      <a
        v-if="product.available && !product.waitlist && whatsappLink"
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
