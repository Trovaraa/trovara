<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StructuredData from '../components/StructuredData.vue'
import SpecSheet from '../components/ui/SpecSheet.vue'
import OrderTiers from '../components/ui/OrderTiers.vue'
import { applyPageMeta } from '../composables/usePageMeta'
import { productColorClasses } from '../lib/productColors'
import { buildWhatsAppLink, PRODUCT_MESSAGES } from '../lib/whatsapp'
import { TELEGRAM_CTA_CLASS, TELEGRAM_CUSTOMER_BOT, TELEGRAM_ORDER_URL } from '../lib/telegram'
import { useProductsStore } from '../stores/products'

const BASE_URL = 'https://trovara.farm'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

const slug = computed(() => String(route.params.slug ?? ''))
const product = computed(() => store.getProductById(slug.value))

const productMessage = computed(() => {
  if (!product.value) return ''
  return PRODUCT_MESSAGES[product.value.id as keyof typeof PRODUCT_MESSAGES] ?? ''
})

const whatsappLink = computed(() => {
  if (!productMessage.value) return ''
  return buildWhatsAppLink(productMessage.value)
})

const productSchema = computed(() => {
  if (!product.value || !product.value.available || product.value.id === 'coming-soon') return undefined
  return {
    '@type': 'Product',
    name: `Trovara ${product.value.name}`,
    description: product.value.description,
    category: product.value.category,
    url: `${BASE_URL}/products/${product.value.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Trovara Farm',
    },
  }
})

watch(
  product,
  (p) => {
    if (!p || !p.available || p.id === 'coming-soon') {
      router.replace({ name: 'products' })
      return
    }

    applyPageMeta(route, {
      title: `${p.name} - Trovara Farm`,
      description: p.description,
      canonicalPath: `/products/${p.id}`,
    })
  },
  { immediate: true },
)
</script>

<template>
  <StructuredData v-if="product && product.available && product.id !== 'coming-soon'" :additional-schema="productSchema">
    <div v-if="product && product.available && product.id !== 'coming-soon'">
      <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
        <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
        <div class="container-trovara relative z-10 max-w-3xl">
          <RouterLink
            to="/products"
            class="inline-flex items-center gap-2 text-trovara-gold-300 hover:text-trovara-gold text-sm font-medium mb-8 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to products
          </RouterLink>
          <p class="section-subheading text-trovara-gold-300 mb-4">
            Trovara {{ product.name }}
          </p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            {{ product.name }}
          </h1>
          <p class="text-white/70 text-lg italic leading-relaxed">
            "{{ product.tagline }}"
          </p>
        </div>
      </section>

      <section class="py-20 md:py-24 bg-white">
        <div class="container-trovara grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div>
            <div
              class="rounded-3xl p-10 md:p-12 flex items-center justify-center min-h-72 relative overflow-hidden mb-8"
              :class="productColorClasses(product.id).headerBg"
            >
              <div class="absolute inset-0 opacity-5" :class="productColorClasses(product.id).overlayBg" />
              <div class="text-[120px] relative z-10 drop-shadow-lg">{{ product.icon }}</div>
            </div>

            <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-5">About this product</h2>
            <p class="text-gray-600 text-lg leading-relaxed mb-8">
              {{ product.description }}
            </p>

            <div class="space-y-3 mb-10">
              <div v-for="benefit in product.benefits" :key="benefit" class="flex items-center gap-3">
                <div
                  class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm"
                  :class="productColorClasses(product.id).bgAccent"
                >
                  ✓
                </div>
                <span class="text-trovara-dark text-sm md:text-base font-medium">{{ benefit }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <RouterLink to="/contact" class="btn-primary">
                Enquire About {{ product.name }}
              </RouterLink>
              <a
                :href="TELEGRAM_ORDER_URL"
                target="_blank"
                rel="noopener noreferrer"
                :class="TELEGRAM_CTA_CLASS"
              >
                Order on Telegram
              </a>
              <a
                v-if="whatsappLink"
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-sm transition-colors"
              >
                WhatsApp Enquiry
              </a>
              <RouterLink
                v-if="product.id === 'plantain' || product.id === 'coconut'"
                to="/wholesale"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-trovara-green/25 text-trovara-green font-semibold text-sm hover:bg-trovara-green/5 transition-all duration-200"
              >
                Wholesale & Bulk Orders
              </RouterLink>
            </div>
          </div>

          <div class="space-y-6">
            <SpecSheet
              v-if="product.specs?.length"
              :specs="product.specs"
              title="Procurement specs"
            />
          </div>
        </div>
      </section>

      <!-- Eggs: How we farm -->
      <section v-if="product.id === 'eggs'" class="py-20 md:py-24 bg-trovara-cream border-t border-amber-100">
        <div class="container-trovara max-w-5xl">
          <p class="section-subheading text-amber-700 mb-3 text-center">How we farm</p>
          <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-4 text-center">
            Slow farming, done properly.
          </h2>
          <p class="text-gray-500 leading-relaxed text-center max-w-2xl mx-auto mb-12">
            Most eggs come from hens that never see the sun. We do the opposite - we let hens be hens.
          </p>
          <div class="grid md:grid-cols-3 gap-6">
            <div
              v-for="step in [
                { icon: '🌾', title: 'Open pasture, every day', body: 'Our hens live outdoors on rotating paddocks of fresh grass. Moving them daily keeps the pasture healthy and the hens curious.' },
                { icon: '🌱', title: 'Nothing they wouldn\'t choose', body: 'Natural feed, foraged greens and clean water. No antibiotics, no hormones, no shortcuts - nothing we wouldn\'t put on our own table.' },
                { icon: '🌅', title: 'Collected at dawn', body: 'Eggs are hand-collected every morning and graded before they leave the farm. Freshness isn\'t a promise - it\'s the schedule.' },
              ]"
              :key="step.title"
              class="bg-white rounded-3xl p-7 shadow-sm"
            >
              <div class="text-4xl mb-4">{{ step.icon }}</div>
              <h3 class="font-black text-trovara-dark text-lg mb-2">{{ step.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ step.body }}</p>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="stat in [
                { value: '0', label: 'cages - ever' },
                { value: 'All day', label: 'pasture access' },
                { value: '0%', label: 'antibiotics & hormones' },
                { value: '100%', label: 'collected at dawn' },
              ]"
              :key="stat.label"
              class="bg-white rounded-2xl p-5 text-center shadow-sm"
            >
              <div class="text-2xl md:text-3xl font-black" :class="productColorClasses(product.id).text">{{ stat.value }}</div>
              <div class="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wide">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Order & Subscribe (all products with tiers) -->
      <section v-if="product.orderTiers?.length" class="py-20 md:py-24 bg-white border-t border-gray-100">
        <div class="container-trovara">
          <p class="section-subheading mb-3" :class="productColorClasses(product.id).text">Order &amp; Subscribe</p>
          <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
            Get your {{ product.name.toLowerCase() }}, your way.
          </h2>
          <p class="text-gray-500 leading-relaxed max-w-2xl mb-10">
            Order a one-time delivery, or set up a recurring supply and never run out. Place orders
            on Telegram (@{{ TELEGRAM_CUSTOMER_BOT }}), or message us on WhatsApp for a personal quote.
          </p>
          <OrderTiers
            :tiers="product.orderTiers"
            :product-name="product.name"
            :product-id="product.id"
          />
        </div>
      </section>

      <!-- Eggs: FAQ -->
      <section v-if="product.id === 'eggs'" class="py-20 md:py-24 bg-trovara-cream border-t border-amber-100">
        <div class="container-trovara max-w-3xl">
          <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-8 text-center">Before you ask</h2>
          <div class="space-y-4">
            <div
              v-for="item in [
                { q: 'What does “pasture-raised” actually mean?', a: 'Our hens live outdoors on open grass paddocks all day, every day - not in cages, and not packed into a barn with a tiny “free-range” door. We move them to fresh pasture regularly.' },
                { q: 'How fresh are the eggs when they arrive?', a: 'Eggs are collected each dawn and graded before dispatch. Each crate is date-stamped so you always know exactly how fresh your eggs are.' },
                { q: 'Where do you deliver?', a: 'We deliver on scheduled routes across Ogun, Lagos and Ibadan. Outside those areas? Message us anyway - we are adding routes as we grow.' },
                { q: 'Can I pause or cancel my subscription?', a: 'Yes. Your weekly subscription is flexible - you can pause, skip, or cancel any time by messaging us on WhatsApp.' },
              ]"
              :key="item.q"
              class="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 class="font-bold text-trovara-dark mb-2">{{ item.q }}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="product.id === 'plantain'"
        class="py-20 md:py-24 bg-trovara-cream border-t border-amber-100"
      >
        <div class="container-trovara">
          <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div class="rounded-3xl p-12 flex flex-col items-center justify-center min-h-64 bg-amber-50 relative overflow-hidden">
              <div class="text-[100px] drop-shadow-lg">🌾</div>
              <span class="mt-4 px-4 py-1.5 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold uppercase tracking-widest">
                Processed Product
              </span>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
                Trovara Plantain - Processed
              </p>
              <h3 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
                Plantain Flour
              </h3>
              <p class="text-lg font-medium italic text-gray-400 mb-6">
                "The ancient staple, reimagined."
              </p>
              <p class="text-gray-500 leading-relaxed mb-6">
                Our plantain flour is milled from sun-dried, matured plantains grown on our own plantation - with zero additives, no bleaching agents, and no preservatives. It is naturally gluten-free, high in resistant starch, and rich in potassium and fiber. Trovara Plantain Flour is ideal for baking, thickening soups and stews, making porridges, and as a nutritious wheat flour substitute for health-conscious consumers and food manufacturers alike.
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div
                  v-for="point in [
                    '100% natural - no additives or preservatives',
                    'Naturally gluten-free',
                    'High in resistant starch and potassium',
                    'Milled from our own plantation plantains',
                    'Ideal for baking, soups, and porridge',
                    'Available in bulk for food manufacturers',
                  ]"
                  :key="point"
                  class="flex items-start gap-2.5 text-sm text-trovara-dark"
                >
                  <span class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-black">✓</span>
                  {{ point }}
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <RouterLink to="/contact" class="btn-gold">
                  Enquire About Plantain Flour
                </RouterLink>
                <RouterLink to="/wholesale" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-amber-300 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-all duration-200">
                  Request Wholesale Details
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </StructuredData>
</template>
