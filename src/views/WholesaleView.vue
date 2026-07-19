<script setup lang="ts">
import SectionHeader from '../components/ui/SectionHeader.vue'
import HarvestCalendar from '../components/ui/HarvestCalendar.vue'
import TestimonialsSection from '../components/ui/TestimonialsSection.vue'
import { testimonials } from '../data/testimonials'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { TELEGRAM_CUSTOMER_BOT, TELEGRAM_ORDER_URL } from '../lib/telegram'

const wholesaleWhatsAppLink = buildWhatsAppLink(
  "Hi Trovara Farm, I'd like to discuss a bulk order for hotels/supermarkets."
)

const harvestWindows = [
  {
    product: 'Plantain',
    period: 'From April 2026, year-round',
    status: 'available' as const,
    note: 'First commercial harvest from April 2026; continuous supply thereafter',
  },
  {
    product: 'Coconut',
    period: 'From December 2026, year-round',
    status: 'forecast' as const,
    note: 'First commercial harvest from December 2026; continuous supply thereafter',
  },
  {
    product: 'Free-range dressed noilers & mature hens',
    period: 'Year-round',
    status: 'available' as const,
    note: 'Recurring dressed-bird supply on contract',
  },
  {
    product: 'Eggs',
    period: 'Year-round',
    status: 'available' as const,
    note: 'Pasture-raised eggs available continuously',
  },
]

const productLines = [
  {
    title: 'Graded Prepackaged Plantain',
    detail:
      'Consistent quality packs sorted by grade and maturity for kitchen operations and retail displays.',
    points: ['Green plantain for cooking', 'Ripe plantain for ready-to-cook demand'],
  },
  {
    title: 'Plantain Chips',
    detail:
      'Crunchy, shelf-stable chips processed from carefully selected plantains for modern retail and hospitality snack channels.',
    points: ['Food-service and retail packaging', 'Steady bulk supply windows'],
  },
  {
    title: 'Plantain Flour',
    detail:
      'Naturally gluten-free flour milled from mature plantains, suitable for bakeries, private kitchens, and manufacturers.',
    points: ['Additive-free production', 'Bulk and private-label-ready formats'],
  },
]
</script>

<template>
  <div>
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-4xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">B2B Wholesale</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          Reliable farm supply for hotels and supermarkets
        </h1>
        <p class="text-white/75 text-lg leading-relaxed">
          Trovara partners with procurement teams that need dependable quality, clear communication,
          and repeatable delivery schedules across plantain-based product lines.
        </p>
        <div class="mt-8">
          <RouterLink
            to="/wholesale/one-pager"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-sm"
          >
            Download one-pager
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Product Portfolio"
          title="Built for modern wholesale operations"
          subtitle="From fresh graded packs to processed plantain products, our B2B lineup is structured for kitchen, shelf, and distribution efficiency."
        />
        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <article
            v-for="line in productLines"
            :key="line.title"
            class="rounded-2xl border border-gray-100 bg-trovara-cream p-6 shadow-sm"
          >
            <h3 class="text-xl font-black text-trovara-dark mb-3">{{ line.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ line.detail }}</p>
            <ul class="space-y-2">
              <li
                v-for="point in line.points"
                :key="point"
                class="flex items-start gap-2.5 text-sm text-trovara-dark"
              >
                <span class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-trovara-green text-white text-[10px] font-bold flex items-center justify-center">
                  ✓
                </span>
                {{ point }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Fulfilment Details"
          title="Wholesale terms at a glance"
          subtitle="We coordinate capacity planning and dispatch with your procurement cycle to reduce stock-outs and simplify replenishment."
        />
        <div class="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div class="rounded-2xl bg-white p-7 shadow-sm border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">Delivery Zones</p>
            <p class="text-trovara-dark font-semibold mb-2">Ogun, Lagos, and Ibadan</p>
            <p class="text-sm text-gray-600 leading-relaxed">
              Structured route planning supports dependable recurring drops for hotel kitchens,
              supermarket depots, and multi-branch buyers.
            </p>
          </div>
          <div class="rounded-2xl bg-white p-7 shadow-sm border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">Harvest Timeline</p>
            <p class="text-trovara-dark font-semibold mb-2">Plantain live; coconut from Dec 2026</p>
            <p class="text-sm text-gray-600 leading-relaxed">
              Plantain is available year-round from April 2026. Coconut opens December 2026 and continues
              year-round. Free-range dressed noilers, mature hens, and eggs ship every month on contract.
            </p>
          </div>
          <div class="rounded-2xl bg-white p-7 shadow-sm border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">Private Label</p>
            <p class="text-trovara-dark font-semibold mb-2">Available for select lines</p>
            <p class="text-sm text-gray-600 leading-relaxed">
              We support private-label packaging options for qualified partners seeking branded shelf-ready
              plantain flour and chips formats.
            </p>
          </div>
          <div class="rounded-2xl bg-white p-7 shadow-sm border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-2">MOQ</p>
            <p class="text-trovara-dark font-semibold mb-2">Contact us for product-specific minimums</p>
            <p class="text-sm text-gray-600 leading-relaxed">
              Minimum order quantities vary by product type, packaging format, and delivery schedule.
              Share your target volumes and we will tailor a practical supply plan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-white border-t border-gray-100">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Supply Planning"
          title="Harvest forecast calendar"
          subtitle="Public supply windows for procurement planning: plantain from April 2026, coconut from December 2026, and year-round free-range dressed noilers, mature hens, and eggs."
        />
        <HarvestCalendar :windows="harvestWindows" />
        <p class="text-xs text-gray-400 mt-4 text-center">
          Forecasts updated as planting and offtake contracts are confirmed. Contact us for contracted supply windows.
        </p>
      </div>
    </section>

    <TestimonialsSection v-if="testimonials.length > 0" context="wholesale" />

    <section class="py-20 bg-trovara-dark text-white">
      <div class="container-trovara max-w-3xl mx-auto text-center">
        <p class="section-subheading text-trovara-gold-300 mb-4">Start Procurement</p>
        <h2 class="text-3xl md:text-4xl font-black mb-4">Request your bulk quote</h2>
        <p class="text-white/70 text-lg leading-relaxed mb-10">
          Send your expected volume, preferred formats, and delivery frequency.
          Our team will respond with suitable options and timelines.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/contact?subject=bulk-order" class="btn-gold text-base px-8 py-4">
            Contact Sales Team
          </RouterLink>
          <a
            :href="TELEGRAM_ORDER_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#229ED9] hover:bg-[#1b8bc0] text-white font-semibold transition-colors text-base"
          >
            Order on Telegram
            <span class="text-white/80 font-normal text-sm">@{{ TELEGRAM_CUSTOMER_BOT }}</span>
          </a>
          <a
            :href="wholesaleWhatsAppLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
          >
            WhatsApp Bulk Enquiry
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
