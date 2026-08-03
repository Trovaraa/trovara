<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '../stores/products'
import StructuredData from '../components/StructuredData.vue'
import SpecSheet from '../components/ui/SpecSheet.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'
import { productColorClasses } from '../lib/productColors'
import { buildWhatsAppLink, PRODUCT_MESSAGES } from '../lib/whatsapp'
import { TELEGRAM_CTA_CLASS, TELEGRAM_ORDER_URL } from '../lib/telegram'

const store = useProductsStore()
const products = store.allProducts

const productSchemas = computed(() =>
  store.availableProducts.map((product) => ({
    '@type': 'Product',
    name: `Trovara ${product.name}`,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Trovara Farm' },
    category: product.category,
  })),
)
</script>

<template>
  <div>
    <StructuredData :additional-schema="productSchemas" />

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">From Our Farm</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          Products grown with purpose
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          Every product at Trovara Farm carries a story - of rich soil, honest care,
          and a commitment to delivering the earth's finest to you.
        </p>
      </div>
    </section>

    <!-- How our system works -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="How It Works"
          title="One regenerative system behind every product."
          subtitle="Plantain, coconut, oil palm, pasture-raised chicken, and eggs are part of one circular farm where waste becomes value across Trovara Fresh and Trovara Harvest."
          center
        />
        <div class="max-w-5xl mx-auto">
          <InfographicFigure
            src="/images/regen/system.webp"
            alt="Trovara integrated regenerative system: crops and pasture-raised poultry flow through a circular farm into Trovara Fresh and Trovara Harvest, with by-products reused as compost, fertilizer, biogas, and animal feed."
            caption="From nature's inputs to trusted food solutions"
            summary="Fresh plantain, coconut, palm oil, pasture-raised chicken and eggs, plus value-added products, all come from one closed-loop farm."
          />
        </div>
      </div>
    </section>

    <!-- Products Detail Sections -->
    <div>
      <section
        v-for="(product, i) in products"
        :key="product.id"
        :id="product.id"
        :class="[
          'py-20 md:py-28 scroll-mt-20',
          i % 2 === 0 ? 'bg-white' : 'bg-trovara-cream',
        ]"
      >
        <div class="container-trovara">
          <div
            :class="[
              'grid md:grid-cols-2 gap-12 lg:gap-20 items-center',
              i % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : '',
            ]"
          >
            <!-- Visual -->
            <div
              class="rounded-3xl flex items-center justify-center min-h-72 relative overflow-hidden"
              :class="[productColorClasses(product.id).headerBg, product.image ? 'p-0' : 'p-12']"
            >
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.imageAlt ?? product.name"
                class="absolute inset-0 h-full w-full object-cover"
              />
              <template v-else>
                <div
                  class="absolute inset-0 opacity-5"
                  :class="productColorClasses(product.id).overlayBg"
                />
                <BrandIcon :name="product.icon" :title="product.name" class="relative z-10 w-40 h-40" />
              </template>
              <div
                v-if="product.availabilityNote"
                class="absolute bottom-5 left-5 right-5 sm:right-auto rounded-full bg-white/95 px-4 py-2 text-center text-xs font-black text-trovara-dark shadow-sm"
              >
                {{ product.availabilityNote }}
              </div>
              <div
                v-if="!product.available"
                class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                :class="productColorClasses(product.id).bgAccent"
              >
                Coming Soon
              </div>
            </div>

            <!-- Content -->
            <div>
              <p
                class="text-xs font-bold uppercase tracking-widest mb-3"
                :class="productColorClasses(product.id).text"
              >
                {{ product.category !== 'coming-soon' ? `Trovara ${product.name}` : 'Trovara Expansion' }}
              </p>
              <h2 class="text-4xl md:text-5xl font-black text-trovara-dark mb-3">
                {{ product.name }}
              </h2>
              <p class="text-lg font-medium italic text-gray-400 mb-6">
                "{{ product.tagline }}"
              </p>
              <p class="text-gray-500 leading-relaxed mb-8">
                {{ product.description }}
              </p>

              <!-- Benefits -->
              <div class="space-y-3 mb-8">
                <div
                  v-for="benefit in product.benefits"
                  :key="benefit"
                  class="flex items-center gap-3"
                >
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm"
                    :class="productColorClasses(product.id).bgAccent"
                  >
                    ✓
                  </div>
                  <span class="text-trovara-dark text-sm font-medium">{{ benefit }}</span>
                </div>
              </div>

              <SpecSheet
                v-if="product.specs?.length"
                :specs="product.specs"
                title="Procurement specs"
                class="mb-8"
              />

              <div v-if="product.available" class="flex flex-wrap gap-3">
              <RouterLink
                :to="`/products/${product.id}`"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold text-sm transition-all duration-200"
                :class="productColorClasses(product.id).btnOutline"
              >
                {{ product.waitlist ? 'Join the waitlist' : 'View Product Page' }}
              </RouterLink>
              <RouterLink
                v-if="!product.waitlist"
                to="/contact"
                class="btn-primary"
              >
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
                v-if="!product.waitlist && PRODUCT_MESSAGES[product.id as keyof typeof PRODUCT_MESSAGES]"
                :href="buildWhatsAppLink(PRODUCT_MESSAGES[product.id as keyof typeof PRODUCT_MESSAGES])"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-sm transition-colors"
              >
                WhatsApp Enquiry
              </a>
              </div>
              <div
                v-else
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold text-sm"
                :class="productColorClasses(product.id).btnOutline"
              >
                Stay Tuned - Coming Soon
              </div>
            </div>
          </div>

          <!-- Coconut processed formats -->
          <div
            v-if="product.id === 'coconut'"
            class="mt-16 pt-16 border-t border-orange-100"
          >
            <div class="mb-10 max-w-2xl">
              <p class="text-xs font-bold uppercase tracking-widest text-[#7B4F2E] mb-3">
                Trovara Coconut - Processed
              </p>
              <h3 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
                Milk, chips &amp; oil
              </h3>
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
                  },
                  {
                    icon: 'coconut-chips',
                    name: 'Coconut Chips',
                    sku: 'TRV-COC-CHIPS',
                    tagline: 'Crunch from the farm.',
                    body: 'Lightly dried coconut slices for snacking, toppings, and trail mixes - traceable back to harvest lots.',
                  },
                  {
                    icon: 'coconut-oil',
                    name: 'Coconut Oil',
                    sku: 'TRV-COC-OIL',
                    tagline: 'Clear, kitchen-ready oil.',
                    body: 'Oil pressed from our own mature coconuts for cooking and food service, with retail and bulk packs planned.',
                  },
                ]"
                :key="format.sku"
                class="rounded-3xl border border-[#7B4F2E]/10 bg-[#FDF5EE] p-6 flex flex-col"
              >
                <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-sm">
                  <BrandIcon :name="format.icon" :title="format.name" class="h-full w-full" />
                </div>
                <span class="mb-3 self-center rounded-full bg-[#7B4F2E]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7B4F2E]">
                  Planned after harvest
                </span>
                <h4 class="text-xl font-black text-trovara-dark text-center">{{ format.name }}</h4>
                <p class="mt-1 text-center text-sm font-medium italic text-[#7B4F2E]/80">{{ format.tagline }}</p>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600 text-center">{{ format.body }}</p>
              </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink to="/contact?subject=waitlist" class="btn-gold">
                Ask about milk, chips &amp; oil
              </RouterLink>
              <RouterLink to="/wholesale" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#7B4F2E]/25 text-[#7B4F2E] font-semibold text-sm hover:bg-[#FDF5EE] transition-all duration-200">
                Request wholesale forecast
              </RouterLink>
            </div>
          </div>

          <!-- Plantain chips & flour -->
          <div
            v-if="product.id === 'plantain'"
            class="mt-16 pt-16 border-t border-amber-100"
          >
            <div class="mb-10 max-w-2xl">
              <p class="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
                Trovara Plantain - Processed
              </p>
              <h3 class="text-3xl md:text-4xl font-black text-trovara-dark mb-3">
                Chips &amp; flour
              </h3>
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
                  },
                  {
                    icon: 'package',
                    name: 'Plantain Flour',
                    sku: 'flour',
                    tagline: 'The ancient staple, reimagined.',
                    body: 'Milled from sun-dried plantation plantains with no additives, bleaching agents, or preservatives - suited to baking, soups, porridges, and wholesale.',
                  },
                ]"
                :key="format.sku"
                class="rounded-3xl border border-amber-100 bg-amber-50 p-6 flex flex-col"
              >
                <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/90 p-2 shadow-sm">
                  <BrandIcon :name="format.icon" :title="format.name" class="h-full w-full" />
                </div>
                <span class="mb-3 self-center rounded-full bg-amber-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800">
                  Planned after harvest
                </span>
                <h4 class="text-xl font-black text-trovara-dark text-center">{{ format.name }}</h4>
                <p class="mt-1 text-center text-sm font-medium italic text-amber-800/80">{{ format.tagline }}</p>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600 text-center">{{ format.body }}</p>
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

        </div>
      </section>
    </div>

    <!-- Bulk / Export CTA -->
    <section class="py-20 bg-trovara-dark text-white">
      <div class="container-trovara">
        <div class="max-w-3xl mx-auto text-center">
          <BrandIcon name="package" class="w-16 h-16 mx-auto mb-6 icon-on-dark" />
          <h2 class="text-3xl md:text-4xl font-black mb-4">Wholesale &amp; Bulk Planning</h2>
          <p class="text-white/60 text-lg mb-10 leading-relaxed">
            Are you a distributor, retailer, or wholesaler? Share your forecast so we can plan
            future supply across coconut, plantain, palm oil, pasture-raised chicken, and eggs.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink to="/wholesale" class="btn-gold text-base px-8 py-4">
              Wholesale & Bulk Orders
            </RouterLink>
            <RouterLink to="/contact" class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base">
              Discuss a Partnership
            </RouterLink>
            <RouterLink
              to="/farm"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
            >
              See Our Farm Operations
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
