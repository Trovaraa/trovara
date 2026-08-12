<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '../stores/products'
import StructuredData from '../components/StructuredData.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'

const products = useProductsStore().availableProducts

const productSchemas = computed(() =>
  products.map((product) => ({
    '@type': 'Product',
    name: `Trovara ${product.name}`,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Trovara Farm' },
    category: product.category,
  })),
)

function primarySku(product: (typeof products)[number]) {
  return product.specs?.find((spec) => spec.label.includes('SKU'))?.value.split('·')[0]?.trim() ?? 'SKU announced before supply opens'
}

function forecastMonth(note?: string) {
  if (!note) return 'Date to be confirmed'
  return note.replace('First harvest forecast for ', '').replace('First supply forecast for ', '')
}
</script>

<template>
  <div>
    <StructuredData :additional-schema="productSchemas" />

    <section class="relative overflow-hidden bg-trovara-green pb-16 pt-32 md:pb-20">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300">Trovara products</p>
          <h1 class="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">See what is growing. Follow what you want.</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Our first product lines are still growing. The dates below are farm forecasts, not promises of stock. Join a waitlist and we will update you as supply gets closer.
          </p>
        </div>
        <div class="rounded-3xl border border-white/15 bg-white/10 p-5 text-sm text-white/75 backdrop-blur-sm">
          <p class="font-black text-white">How this page works</p>
          <p class="mt-2 leading-6">Choose a product for full specifications, planned pack sizes, and its waitlist form.</p>
        </div>
      </div>
    </section>

    <section class="bg-trovara-light py-16 md:py-20">
      <div class="container-trovara">
        <div class="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p class="section-subheading">Farm catalogue</p>
            <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-4xl">Fresh lines planned for first supply</h2>
          </div>
          <p class="max-w-md text-sm leading-6 text-gray-500">All dates can move with weather, crop development, animal welfare, and quality checks.</p>
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="product in products"
            :key="product.id"
            class="group flex min-h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-trovara-green/30 hover:shadow-lg md:p-7"
          >
            <div class="flex items-start justify-between gap-4">
              <BrandIcon :name="product.icon" :title="product.name" class="h-14 w-14" />
              <span class="rounded-full bg-trovara-green/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-trovara-green">Waitlist open</span>
            </div>
            <p class="mt-7 text-[11px] font-black uppercase tracking-[0.18em] text-trovara-green">{{ product.category === 'poultry' ? 'Pasture-raised poultry' : 'Farm-grown' }}</p>
            <h3 class="mt-2 text-2xl font-black text-trovara-dark">{{ product.name }}</h3>
            <p class="mt-2 text-sm font-semibold text-gray-500">{{ product.tagline }}</p>
            <p class="mt-5 flex-1 text-sm leading-6 text-gray-500">{{ product.description }}</p>

            <dl class="mt-6 grid gap-3 border-t border-gray-100 pt-5 text-sm">
              <div class="flex items-start justify-between gap-4">
                <dt class="font-semibold text-gray-500">Forecast</dt>
                <dd class="text-right font-black text-trovara-dark">{{ forecastMonth(product.availabilityNote) }}</dd>
              </div>
              <div class="flex items-start justify-between gap-4">
                <dt class="font-semibold text-gray-500">First SKU</dt>
                <dd class="max-w-[12rem] text-right font-mono text-xs font-bold text-trovara-dark">{{ primarySku(product) }}</dd>
              </div>
            </dl>
            <RouterLink :to="`/products/${product.id}`" class="btn-primary mt-6 w-full">
              Product details &amp; waitlist
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 md:py-20">
      <div class="container-trovara">
        <div class="grid gap-8 rounded-[2rem] border border-gray-200 bg-trovara-cream p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
          <div>
            <p class="section-subheading">Buying for a business?</p>
            <h2 class="mt-3 text-3xl font-black text-trovara-dark">Get SKUs, pack sizes, MOQs, and supply forecasts in one brief.</h2>
            <p class="mt-4 max-w-2xl leading-7 text-gray-500">We are planning nationwide delivery across Nigeria. Actual routes, lead times, and pricing will be confirmed for each order.</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
            <RouterLink to="/wholesale" class="btn-primary whitespace-nowrap">Wholesale information</RouterLink>
            <RouterLink to="/shop" class="btn-secondary whitespace-nowrap">Customer account</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
