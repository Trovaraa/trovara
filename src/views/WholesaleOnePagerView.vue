<script setup lang="ts">
import TrovaraLogo from '../components/brand/TrovaraLogo.vue'
import { buildWhatsAppLink } from '../lib/whatsapp'

const wholesaleWhatsAppLink = buildWhatsAppLink(
  "Hi Trovara Farm, I'd like a wholesale supply plan. My product, volume, destination, and delivery frequency are:"
)

function printPage() {
  window.print()
}

const products = [
  {
    name: 'Fresh Plantain',
    format: 'Green or ripe · 15 kg / 25 kg cartons · pre-cut on request',
    window: 'First harvest · Mar 2027',
  },
  {
    name: 'Coconut',
    format: 'Mature whole fruit · milk, chips & oil planned after harvest',
    window: 'First harvest · Jun 2027',
  },
  {
    name: 'Coconut Milk',
    format: 'Retail and food-service packs',
    window: 'After coconut harvest · scheduled runs',
  },
  {
    name: 'Coconut Chips',
    format: 'Snack and topping packs',
    window: 'After coconut harvest · scheduled runs',
  },
  {
    name: 'Coconut Oil',
    format: 'Retail bottles and bulk formats',
    window: 'After coconut harvest · scheduled runs',
  },
  {
    name: 'Pasture-raised Chicken',
    format: 'Grass-fed · whole dressed or pre-cut on request',
    window: 'First supply forecast · Dec 2026',
  },
  {
    name: 'Pasture-raised Eggs',
    format: 'Graded crates · first availability to be confirmed',
    window: 'Join the waitlist',
  },
  {
    name: 'Plantain Chips',
    format: 'Food-service and retail-ready packs',
    window: 'After plantain harvest · scheduled runs',
  },
  {
    name: 'Plantain Flour',
    format: 'Bulk, sealed, and private-label formats',
    window: 'After plantain harvest · scheduled runs',
  },
  {
    name: 'Palm Oil',
    format: 'Retail and food-service pack sizes planned',
    window: 'First harvest · Dec 2026',
  },
]

const supplyTerms = [
  {
    label: 'Delivery Coverage',
    title: 'Nationwide across Nigeria',
    detail: 'We plan dispatch timing and logistics around destination, volume, how the product needs to be handled, and how often you need deliveries.',
  },
  {
    label: 'Harvest Timeline',
    title: 'Fresh and processed supply windows',
    detail: 'Palm oil and chicken target December 2026, plantain March 2027, and coconut June 2027. Egg availability will be shared with waitlist members.',
  },
  {
    label: 'Minimum Order',
    title: 'Product-specific MOQs',
    detail: 'Minimums depend on product, packaging, destination, and order frequency. Share target volumes and we will draft a workable supply plan.',
  },
  {
    label: 'Private Label',
    title: 'Planned for select lines',
    detail: 'Qualified partners can request branded shelf-ready formats for plantain flour and chips once processing opens after harvest.',
  },
  {
    label: 'Packaging',
    title: 'Formats matched to your order',
    detail: 'Plantain ships in graded 15 kg or 25 kg cartons, with pre-cut options on request. Other formats are agreed by product and volume.',
  },
  {
    label: 'Quality & Traceability',
    title: 'Graded to your specs',
    detail: 'Orders are graded to buyer requirements. Lot IDs, dispatch checks, and handling rules are agreed before fulfilment.',
  },
]

const orderSteps = [
  {
    number: '01',
    title: 'Share your requirement',
    detail: 'Product, volume, destination, packaging, frequency, and preferred start date.',
  },
  {
    number: '02',
    title: 'Receive a supply plan',
    detail: 'We confirm availability, MOQ, format, delivery schedule, logistics, and a commercial quote.',
  },
  {
    number: '03',
    title: 'Confirm and dispatch',
    detail: 'We lock terms, payment, recurring cadence, and dispatch paperwork before fulfilment.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-[#f3f5f1] pt-24 pb-8 print:bg-white print:py-0">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0">
      <div class="no-print flex items-center justify-between gap-4 mb-4">
        <RouterLink to="/wholesale" class="text-sm font-semibold text-trovara-green hover:underline">
          ← Back to wholesale
        </RouterLink>
        <button type="button" class="btn-primary px-6 py-3 text-sm" @click="printPage">
          Print / Save as PDF
        </button>
      </div>

      <article class="one-pager-sheet bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        <header class="px-7 sm:px-10 pt-7 sm:pt-9 pb-6 border-b border-gray-100 print:px-0 print:pt-0 print:pb-4">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <TrovaraLogo descriptor="Fresh" />
            <div class="text-left sm:text-right">
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-trovara-green">Wholesale supply brief</p>
              <p class="text-xs text-gray-400 mt-1">Hospitality · Retail · Distribution · Food service</p>
            </div>
          </div>
        </header>

        <section class="mx-7 sm:mx-10 mt-6 rounded-2xl bg-trovara-dark text-white px-6 py-6 print:mx-0 print:mt-4 print:px-5 print:py-4">
          <div class="grid md:grid-cols-[1.4fr_0.6fr] gap-5 items-end">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-[#B8C27A] mb-2">Trovara Fresh B2B</p>
              <h1 class="text-2xl sm:text-3xl font-black leading-tight mb-2">
                Wholesale supply planned around your volumes and delivery schedule.
              </h1>
              <p class="text-sm text-white/70 leading-relaxed max-w-2xl">
                Fresh and processed lines from Trovara Farm for buyers who need clear specs,
                known availability windows, and nationwide delivery.
              </p>
            </div>
            <div class="flex md:justify-end flex-wrap gap-2">
              <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">Nationwide</span>
              <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">Contract supply</span>
              <span class="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">Private label</span>
            </div>
          </div>
        </section>

        <div class="px-7 sm:px-10 py-7 print:px-0 print:py-5">
          <section class="mb-7 print:mb-5">
            <div class="flex items-end justify-between gap-4 mb-4 print:mb-3">
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.24em] text-trovara-green mb-1">Supply Portfolio</p>
                <h2 class="text-xl font-black text-trovara-dark">Fresh produce and processed lines</h2>
              </div>
              <p class="text-xs text-gray-400 text-right hidden sm:block">We confirm availability against your order volume.</p>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3">
              <article
                v-for="product in products"
                :key="product.name"
                class="break-inside-avoid rounded-xl bg-trovara-cream border border-trovara-green/10 p-4 print:p-3"
              >
                <h3 class="font-black text-trovara-dark text-sm mb-1">{{ product.name }}</h3>
                <p class="text-xs text-gray-600 leading-relaxed min-h-8">{{ product.format }}</p>
                <p class="text-[10px] font-bold uppercase tracking-wide text-trovara-green mt-3">{{ product.window }}</p>
              </article>
            </div>
          </section>

          <section class="mb-7 print:mb-5">
            <div class="mb-4 print:mb-3">
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-trovara-green mb-1">Fulfilment Details</p>
              <h2 class="text-xl font-black text-trovara-dark">Delivery, MOQs, packaging, and quality</h2>
            </div>
            <div class="grid sm:grid-cols-2 gap-3 print:grid-cols-2">
              <article
                v-for="term in supplyTerms"
                :key="term.label"
                class="break-inside-avoid rounded-xl border border-gray-200 p-4 print:p-3"
              >
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-trovara-green mb-1">{{ term.label }}</p>
                <h3 class="font-black text-trovara-dark text-sm mb-1.5">{{ term.title }}</h3>
                <p class="text-xs text-gray-600 leading-relaxed">{{ term.detail }}</p>
              </article>
            </div>
          </section>

          <section class="mb-7 print:mb-5 break-inside-avoid">
            <div class="mb-4 print:mb-3">
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-trovara-green mb-1">How to Order</p>
              <h2 class="text-xl font-black text-trovara-dark">Three steps to a supply plan</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-3 print:grid-cols-3">
              <div v-for="step in orderSteps" :key="step.number" class="rounded-xl bg-[#f3f5f1] p-4 print:p-3">
                <div class="text-xs font-black text-[#889058] mb-2">{{ step.number }}</div>
                <h3 class="font-black text-trovara-dark text-sm mb-1">{{ step.title }}</h3>
                <p class="text-xs text-gray-600 leading-relaxed">{{ step.detail }}</p>
              </div>
            </div>
          </section>

          <footer class="break-inside-avoid rounded-2xl border border-trovara-green/20 bg-trovara-cream px-5 py-5 print:py-4">
            <div class="grid md:grid-cols-[1fr_auto] gap-5 items-end">
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.24em] text-trovara-green mb-1">Request a Supply Plan</p>
                <h2 class="text-lg font-black text-trovara-dark mb-2">Tell us what you need, where, and how often.</h2>
                <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
                  <span>hello@trovara.farm</span>
                  <span>+234 810 369 3426</span>
                  <span>trovara.farm/wholesale</span>
                  <span>Trovara Farm · Abeokuta, Nigeria</span>
                </div>
              </div>
              <a
                :href="wholesaleWhatsAppLink"
                target="_blank"
                rel="noopener noreferrer"
                class="no-print inline-flex items-center justify-center rounded-lg bg-trovara-green px-5 py-3 text-sm font-bold text-white hover:bg-trovara-green/90"
              >
                Start bulk enquiry
              </a>
            </div>
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.one-pager-sheet {
  min-height: 70rem;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 9mm;
  }

  .no-print {
    display: none !important;
  }

  .one-pager-sheet {
    min-height: auto;
  }

  :global(body) {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
