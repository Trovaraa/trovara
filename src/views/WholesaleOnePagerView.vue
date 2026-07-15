<script setup lang="ts">
import { buildWhatsAppLink } from '../lib/whatsapp'

const wholesaleWhatsAppLink = buildWhatsAppLink(
  "Hi Trovara Farm, I'd like to discuss a bulk order for hotels/supermarkets."
)

function printPage() {
  window.print()
}

const products = [
  'Graded prepackaged plantain (green and ripe)',
  'Plantain chips (food-service and retail packs)',
  'Plantain flour (bulk and private-label-ready)',
]
</script>

<template>
  <div class="min-h-screen bg-[#f8f9f6] py-8 print:bg-white print:py-0">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="no-print flex justify-end mb-4">
        <button type="button" class="btn-primary px-6 py-3 text-sm" @click="printPage">
          Print / Save as PDF
        </button>
      </div>

      <article class="one-pager-sheet bg-white border border-gray-200 shadow-sm rounded-2xl p-8 sm:p-10 print:shadow-none print:border-0 print:rounded-none print:p-8">
        <header class="border-b border-gray-200 pb-6 mb-6">
          <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">
            Trovara Fresh B2B
          </p>
          <h1 class="text-3xl sm:text-4xl font-black text-trovara-dark mb-3">
            Wholesale Supply One-Pager
          </h1>
          <p class="text-sm text-gray-600 leading-relaxed max-w-3xl">
            Trovara Farm supplies consistent, quality-assured plantain product lines for hospitality,
            retail, and food-service buyers.
          </p>
        </header>

        <section class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="rounded-xl bg-trovara-cream p-5 border border-gray-100">
            <h2 class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">
              Product Lines
            </h2>
            <ul class="space-y-2">
              <li
                v-for="product in products"
                :key="product"
                class="flex items-start gap-2 text-sm text-trovara-dark"
              >
                <span class="mt-0.5">-</span>
                <span>{{ product }}</span>
              </li>
            </ul>
          </div>

          <div class="rounded-xl bg-trovara-cream p-5 border border-gray-100">
            <h2 class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">
              Delivery Zones
            </h2>
            <p class="text-sm text-trovara-dark mb-2">Ogun, Lagos, and Ibadan.</p>
            <p class="text-xs text-gray-600 leading-relaxed">
              Delivery routes are scheduled with procurement cycles to support recurring drops.
            </p>
          </div>
        </section>

        <section class="rounded-xl bg-white border border-gray-200 p-5 mb-6">
          <h2 class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">MOQ Note</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Minimum order quantities depend on product format, packaging, and route frequency.
            Share target volumes and preferred cadence for a tailored quote.
          </p>
        </section>

        <footer class="grid md:grid-cols-2 gap-6 pt-2">
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">
              Contact
            </h2>
            <p class="text-sm text-trovara-dark">Trovara Farm, Abeokuta</p>
            <p class="text-sm text-trovara-dark">info@trovara.farm</p>
            <p class="text-sm text-trovara-dark">+234 810 369 3426</p>
          </div>
          <div class="text-sm text-gray-600 leading-relaxed md:text-right">
            <p class="font-semibold text-trovara-dark mb-2">Ready to order?</p>
            <p>Website: trovara.farm/wholesale</p>
            <p>
              WhatsApp:
              <a :href="wholesaleWhatsAppLink" target="_blank" rel="noopener noreferrer" class="text-trovara-green underline underline-offset-2">
                Start bulk enquiry
              </a>
            </p>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.one-pager-sheet {
  aspect-ratio: 1.414 / 1;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 12mm;
  }

  .no-print {
    display: none !important;
  }

  .one-pager-sheet {
    aspect-ratio: auto;
  }
}
</style>
