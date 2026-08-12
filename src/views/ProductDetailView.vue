<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StructuredData from '../components/StructuredData.vue'
import SpecSheet from '../components/ui/SpecSheet.vue'
import OrderTiers from '../components/ui/OrderTiers.vue'
import ProductWaitlist from '../components/ui/ProductWaitlist.vue'
import { applyPageMeta } from '../composables/usePageMeta'
import { productColorClasses } from '../lib/productColors'
import { buildWhatsAppLink, PRODUCT_MESSAGES } from '../lib/whatsapp'
import { TELEGRAM_CTA_CLASS, TELEGRAM_CUSTOMER_BOT, TELEGRAM_ORDER_URL } from '../lib/telegram'
import { useProductsStore } from '../stores/products'
import BrandIcon from '../components/brand/BrandIcon.vue'

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
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.value.id}`,
      availability: product.value.waitlist
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      priceCurrency: 'NGN',
      description: product.value.waitlist
        ? product.value.availabilityNote ?? 'Join the waitlist for first supply updates.'
        : undefined,
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
  <div v-if="product && product.available && product.id !== 'coming-soon'">
    <StructuredData :additional-schema="productSchema" />
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
              class="rounded-3xl relative overflow-hidden mb-8"
              :class="product.image ? 'bg-trovara-dark' : ['flex items-center justify-center min-h-72', productColorClasses(product.id).headerBg]"
            >
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.imageAlt ?? product.name"
                class="w-full aspect-[3/2] object-cover object-right"
              />
              <template v-else>
                <div class="absolute inset-0 opacity-5" :class="productColorClasses(product.id).overlayBg" />
                <BrandIcon :name="product.icon" :title="product.name" class="relative z-10 w-40 h-40" />
              </template>
              <span
                v-if="product.availabilityNote"
                class="absolute bottom-4 left-4 right-4 sm:right-auto rounded-full bg-white/95 px-4 py-2 text-center text-xs font-black text-trovara-dark shadow-sm"
              >
                {{ product.availabilityNote }}
              </span>
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
              <a v-if="product.waitlist" href="#waitlist" class="btn-primary">
                Join the waitlist
              </a>
              <RouterLink v-else to="/contact" class="btn-primary">
                Enquire About {{ product.name }}
              </RouterLink>
              <a
                v-if="!product.waitlist && TELEGRAM_ORDER_URL"
                :href="TELEGRAM_ORDER_URL"
                target="_blank"
                rel="noopener noreferrer"
                :class="TELEGRAM_CTA_CLASS"
              >
                Order on Telegram
              </a>
              <a
                v-if="!product.waitlist && whatsappLink"
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

      <section v-if="product.waitlist" id="waitlist" class="scroll-mt-24 py-16 md:py-20 bg-white border-t border-gray-100">
        <div class="container-trovara max-w-5xl">
          <ProductWaitlist
            :product-id="product.id"
            :product-name="product.name"
            :availability-note="product.availabilityNote"
          />
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
                { icon: 'land', title: 'Open pasture, every day', body: 'Our hens live outdoors on rotating paddocks of fresh grass. Moving them daily keeps the pasture healthy and the hens curious.' },
                { icon: 'natural', title: 'A clear production standard', body: 'The planned standard uses natural feed, foraged greens, clean water, and no routine antibiotics or hormones.' },
                { icon: 'sun', title: 'Collected at dawn', body: 'Eggs are hand-collected every morning and graded before they leave the farm. Freshness isn\'t a promise - it\'s the schedule.' },
              ]"
              :key="step.title"
              class="bg-white rounded-3xl p-7 shadow-sm"
            >
              <BrandIcon :name="step.icon" class="w-12 h-12 mb-4" />
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
      <section v-if="product.orderTiers?.length && !product.waitlist" class="py-20 md:py-24 bg-white border-t border-gray-100">
        <div class="container-trovara">
          <p class="section-subheading mb-3" :class="productColorClasses(product.id).text">Order &amp; Subscribe</p>
          <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
            Get your {{ product.name.toLowerCase() }}, your way.
          </h2>
          <p class="text-gray-500 leading-relaxed max-w-2xl mb-10">
            Order a one-time delivery, or set up a recurring supply and never run out.
            <template v-if="TELEGRAM_CUSTOMER_BOT">
              Place orders on Telegram (@{{ TELEGRAM_CUSTOMER_BOT }}), or message us on WhatsApp for a personal quote.
            </template>
            <template v-else>
              Message us on WhatsApp for a personal quote.
            </template>
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
                { q: 'Can I order eggs now?', a: 'Not yet. Join the waitlist and we will contact you when the first crates are available. No order or payment is taken today.' },
                { q: 'Where will you deliver?', a: 'We plan nationwide delivery across Nigeria once egg supply opens. Timing and logistics will be confirmed by destination, order size, and product handling needs.' },
                { q: 'What happens after I join?', a: 'We will use the contact you provide to share the first availability date and buying details when supply opens.' },
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
        v-if="product.id === 'coconut'"
        class="py-20 md:py-24 bg-[#FDF5EE] border-t border-orange-100"
      >
        <div class="container-trovara">
          <div class="mb-10 max-w-2xl">
            <p class="text-xs font-bold uppercase tracking-widest text-[#7B4F2E] mb-3">
              Trovara Coconut - Processed
            </p>
            <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
              Milk, chips &amp; oil
            </h2>
            <p class="text-gray-500 leading-relaxed">
              After our first coconut harvest, we plan three farm-direct formats from the same mature fruit - coconut milk, toasted coconut chips, and cold-pressed coconut oil - for homes, chefs, and food manufacturers.
            </p>
          </div>
          <div class="grid sm:grid-cols-3 gap-5">
            <div
              v-for="format in [
                {
                  icon: 'coconut-milk',
                  name: 'Coconut Milk',
                  sku: 'TRV-COC-MILK',
                  tagline: 'Creamy, pour-ready.',
                  body: 'Pressed from mature Trovara coconut flesh for cooking, baking, and beverages - no synthetic thickeners planned.',
                  image: '/images/products/trovara-harvest-coconut-milk.jpg',
                },
                {
                  icon: 'coconut-chips',
                  name: 'Coconut Chips',
                  sku: 'TRV-COC-CHIPS',
                  tagline: 'Crunch from the farm.',
                  body: 'Lightly dried coconut slices for snacking, toppings, and trail mixes - traceable back to harvest lots.',
                  image: '/images/products/trovara-harvest-coconut-chips.jpg',
                },
                {
                  icon: 'coconut-oil',
                  name: 'Coconut Oil',
                  sku: 'TRV-COC-OIL',
                  tagline: 'Clear, kitchen-ready oil.',
                  body: 'Oil pressed from our own mature coconuts for cooking and food service, with retail and bulk packs planned.',
                  image: '/images/products/trovara-harvest-coconut-oil.jpg',
                },
              ]"
              :key="format.sku"
              class="rounded-3xl border border-[#7B4F2E]/10 bg-white overflow-hidden flex flex-col shadow-sm"
            >
              <img
                :src="format.image"
                :alt="format.name"
                class="w-full aspect-[3/2] object-cover object-right"
                loading="lazy"
              />
              <div class="p-6 flex flex-col flex-1">
                <span class="mb-3 self-center rounded-full bg-[#7B4F2E]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7B4F2E]">
                  Planned after harvest
                </span>
                <h3 class="text-xl font-black text-trovara-dark text-center">{{ format.name }}</h3>
                <p class="mt-1 text-center text-sm font-medium italic text-[#7B4F2E]/80">{{ format.tagline }}</p>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600 text-center">{{ format.body }}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/contact?subject=waitlist" class="btn-gold">
              Ask about milk, chips &amp; oil
            </RouterLink>
            <RouterLink to="/wholesale" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#7B4F2E]/25 text-[#7B4F2E] font-semibold text-sm hover:bg-white transition-all duration-200">
              Request wholesale forecast
            </RouterLink>
          </div>
        </div>
      </section>

      <section
        v-if="product.id === 'plantain'"
        class="py-20 md:py-24 bg-trovara-cream border-t border-amber-100"
      >
        <div class="container-trovara">
          <div class="mb-10 max-w-2xl">
            <p class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
              Trovara Plantain - Processed
            </p>
            <h2 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
              Chips &amp; flour
            </h2>
            <p class="text-gray-500 leading-relaxed">
              After our first plantain harvest, we plan dried plantain chips and milled plantain flour from the same plantation fruit - for homes, bakeries, and food manufacturers.
            </p>
          </div>
          <div class="grid sm:grid-cols-2 gap-5">
            <div
              v-for="format in [
                {
                  icon: 'plantain',
                  name: 'Plantain Chips',
                  sku: 'chips',
                  tagline: 'Crunch from the farm.',
                  body: 'Lightly dried plantain slices for snacking and food service - traceable back to harvest lots, with retail and bulk packs planned.',
                  image: '/images/products/trovara-harvest-plantain-chips.jpg',
                },
                {
                  icon: 'package',
                  name: 'Plantain Flour',
                  sku: 'flour',
                  tagline: 'Milled for kitchens and bakeries.',
                  body: 'Milled from sun-dried plantation plantains with no additives, bleaching agents, or preservatives. Suited to baking, soups, porridges, and wholesale.',
                  image: '/images/products/trovara-harvest-plantain-flour.jpg',
                },
              ]"
              :key="format.sku"
              class="rounded-3xl border border-amber-100 bg-white overflow-hidden flex flex-col shadow-sm"
            >
              <img
                :src="format.image"
                :alt="format.name"
                class="w-full aspect-[3/2] object-cover object-right"
                loading="lazy"
              />
              <div class="p-6 flex flex-col flex-1">
                <span class="mb-3 self-center rounded-full bg-amber-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                  Planned after harvest
                </span>
                <h3 class="text-xl font-black text-trovara-dark text-center">{{ format.name }}</h3>
                <p class="mt-1 text-center text-sm font-medium italic text-amber-800/80">{{ format.tagline }}</p>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600 text-center">{{ format.body }}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/contact?subject=waitlist" class="btn-gold">
              Ask about chips &amp; flour
            </RouterLink>
            <RouterLink to="/wholesale" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-amber-300 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-all duration-200">
              Request wholesale forecast
            </RouterLink>
          </div>
        </div>
      </section>
  </div>
</template>
