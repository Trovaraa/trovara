<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '../stores/products'
import StructuredData from '../components/StructuredData.vue'
import SpecSheet from '../components/ui/SpecSheet.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'
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
  <StructuredData :additional-schema="productSchemas">
  <div>

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
          subtitle="Plantain, coconut, and chicken feed a circular system where waste becomes value - flowing into two brands, Trovara Fresh and Trovara Harvest, and the products you see below."
          center
        />
        <div class="max-w-5xl mx-auto">
          <InfographicFigure
            src="/images/regen/system.webp"
            alt="Trovara integrated regenerative system: plantain, coconut, and chicken inputs flow through a circular farm into Trovara Fresh and Trovara Harvest brands, producing fresh produce and processed goods, with by-products like compost, fertilizer, biogas, and animal feed."
            caption="From nature's inputs to trusted food solutions"
            summary="Fresh produce (plantain, eggs, chicken, mushrooms, coconut) and shelf-stable Harvest products (flours, chips, oils, powders) - all from one closed-loop farm. Tap to explore the full system."
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
              class="rounded-3xl p-12 flex items-center justify-center min-h-72 relative overflow-hidden"
              :class="productColorClasses(product.id).headerBg"
            >
              <div
                class="absolute inset-0 opacity-5"
                :class="productColorClasses(product.id).overlayBg"
              />
              <div class="text-[120px] relative z-10 drop-shadow-lg">
                {{ product.icon }}
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
                Trovara {{ product.category !== 'coming-soon' ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Expansion' }}
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
                View Product Page
              </RouterLink>
              <RouterLink
                to="/contact"
                class="btn-primary"
              >
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
                v-if="PRODUCT_MESSAGES[product.id as keyof typeof PRODUCT_MESSAGES]"
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
                🌱 Stay Tuned - Coming Soon
              </div>
            </div>
          </div>

          <!-- Plantain Flour Sub-section -->
          <div
            v-if="product.id === 'plantain'"
            class="mt-16 pt-16 border-t border-amber-100"
          >
            <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <!-- Visual -->
              <div class="rounded-3xl p-12 flex flex-col items-center justify-center min-h-64 bg-amber-50 relative overflow-hidden">
                <div class="text-[100px] drop-shadow-lg">🌾</div>
                <span class="mt-4 px-4 py-1.5 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold uppercase tracking-widest">
                  Processed Product
                </span>
              </div>
              <!-- Content -->
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
                <div class="grid grid-cols-2 gap-3 mb-8">
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
                <RouterLink to="/contact" class="btn-gold">
                  Enquire About Plantain Flour
                </RouterLink>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>

    <!-- Bulk / Export CTA -->
    <section class="py-20 bg-trovara-dark text-white">
      <div class="container-trovara">
        <div class="max-w-3xl mx-auto text-center">
          <div class="text-5xl mb-6">📦</div>
          <h2 class="text-3xl md:text-4xl font-black mb-4">Bulk Orders & Export</h2>
          <p class="text-white/60 text-lg mb-10 leading-relaxed">
            Are you a distributor, retailer, or wholesaler? Trovara Farm is ready to supply
            premium tropical produce and poultry at scale. Let's talk.
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
  </StructuredData>
</template>
