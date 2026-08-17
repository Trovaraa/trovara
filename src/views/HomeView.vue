<script setup lang="ts">
import { useProductsStore } from '../stores/products'
import BrandIcon from '../components/brand/BrandIcon.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'

const products = useProductsStore().availableProducts

const paths = [
  {
    eyebrow: 'For your home',
    title: 'Follow the next harvest',
    body: 'See what we are growing, check forecast dates, and join the waitlist for the products you want.',
    label: 'Browse products',
    to: '/products',
    icon: 'harvest',
  },
  {
    eyebrow: 'For your business',
    title: 'Plan supply early',
    body: 'Talk to us about SKUs, pack sizes, minimum orders, delivery, and recurring supply across Nigeria.',
    label: 'Explore wholesale',
    to: '/wholesale',
    icon: 'quality',
  },
  {
    eyebrow: 'For your farm',
    title: 'Run better operations',
    body: 'Use Trovara Farm OS for daily work, or get practical help to plan and improve your farm.',
    label: 'See farm services',
    to: '/services',
    icon: 'os',
  },
]
</script>

<template>
  <div>
    <section class="relative flex min-h-[43rem] items-center overflow-hidden bg-[#0b3a25] lg:min-h-[47rem]">
      <div class="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />
      <div class="absolute inset-0 hero-grid opacity-40 pointer-events-none" />
      <div class="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-trovara-green-400/20 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-trovara-gold/15 blur-3xl pointer-events-none" />

      <div class="container-trovara relative z-10 pb-16 pt-28 lg:pb-20 lg:pt-32">
        <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] xl:gap-20">
          <div class="min-w-0">
            <div class="mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 backdrop-blur-sm">
              <span class="h-2 w-2 flex-shrink-0 rounded-full bg-trovara-gold" />
              <span class="text-xs font-bold uppercase leading-snug tracking-[0.16em] text-trovara-gold-200">
                Food you can trust · from a farm built for tomorrow
              </span>
            </div>

            <h1 class="mb-7 text-balance text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl xl:text-[4.9rem]">
              Better food starts with better <span class="text-trovara-gold">soil.</span>
            </h1>
            <p class="mb-9 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Plantain, coconut, palm oil, pasture-raised chicken, and eggs from one regenerative farm in Ogun State. Every harvest date shown here is a forecast until supply opens.
            </p>
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/products" class="btn-gold rounded-full px-7 py-4 text-base">See products &amp; forecasts</RouterLink>
              <RouterLink to="/wholesale" class="inline-flex items-center rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10">
                Wholesale enquiries
              </RouterLink>
            </div>
            <p class="mt-6 text-sm text-white/55">
              Already following a harvest?
              <RouterLink to="/shop" class="font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Open your account</RouterLink>
              <span class="text-white/35"> · </span>
              <RouterLink to="/survey" class="font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Take the 3-minute food survey</RouterLink>
            </p>
          </div>

          <div class="hidden w-full max-w-md justify-self-end lg:block">
            <div class="rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div class="relative flex min-h-[24rem] flex-col overflow-hidden rounded-[1.4rem] bg-[#f2ead8] p-6 text-trovara-dark">
                <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-trovara-gold/25" />
                <div class="relative z-10 flex items-start justify-between gap-5">
                  <div>
                    <p class="text-[11px] font-black uppercase tracking-[0.18em] text-trovara-green">Farm forecast</p>
                    <h2 class="mt-2 text-3xl font-black tracking-tight">What is growing</h2>
                  </div>
                  <span class="rounded-full bg-trovara-green px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">5 lines</span>
                </div>
                <div class="relative z-10 mt-7 grid flex-1 grid-cols-2 gap-3">
                  <RouterLink
                    v-for="product in products"
                    :key="product.id"
                    :to="`/products/${product.id}`"
                    class="group flex flex-col justify-between rounded-2xl border border-white bg-white/75 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <BrandIcon :name="product.icon" class="h-11 w-11 origin-left transition-transform group-hover:scale-105" />
                    <span class="mt-4 text-sm font-black leading-tight">{{ product.id === 'poultry' ? 'Chicken' : product.name }}</span>
                    <span class="mt-1 text-[11px] font-semibold text-trovara-green">View forecast →</span>
                  </RouterLink>
                </div>
                <p class="relative z-10 mt-4 border-t border-trovara-dark/10 pt-4 text-xs font-semibold text-trovara-dark/65">
                  Dates may move as crops and livestock develop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-gray-100 bg-trovara-light py-16 md:py-20">
      <div class="container-trovara">
        <div class="mb-9 max-w-2xl">
          <p class="section-subheading">Start here</p>
          <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-4xl">What brings you to Trovara?</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <RouterLink
            v-for="path in paths"
            :key="path.title"
            :to="path.to"
            class="group rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-trovara-green/30 hover:shadow-lg md:p-7"
          >
            <BrandIcon :name="path.icon" class="h-12 w-12" />
            <p class="mt-6 text-[11px] font-black uppercase tracking-[0.18em] text-trovara-green">{{ path.eyebrow }}</p>
            <h3 class="mt-2 text-xl font-black text-trovara-dark">{{ path.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-gray-500">{{ path.body }}</p>
            <span class="mt-6 inline-flex font-bold text-trovara-green group-hover:underline">{{ path.label }} →</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="bg-white py-20 md:py-24">
      <div class="container-trovara">
        <div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <p class="section-subheading">Harvest forecast</p>
            <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-5xl">Five product lines. One clear place to follow them.</h2>
            <p class="mt-4 leading-7 text-gray-500">Forecasts are updated as the farm develops. Join a waitlist and we will contact you when that product is ready.</p>
          </div>
          <RouterLink to="/products" class="btn-secondary shrink-0">See the full catalogue</RouterLink>
        </div>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <RouterLink
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="rounded-3xl border border-gray-200 bg-trovara-light p-5 transition hover:border-trovara-green/30 hover:bg-white hover:shadow-md"
          >
            <BrandIcon :name="product.icon" class="h-12 w-12" />
            <h3 class="mt-5 font-black text-trovara-dark">{{ product.name }}</h3>
            <p class="mt-2 text-xs leading-5 text-gray-500">{{ product.availabilityNote }}</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden bg-trovara-green py-20 md:py-24">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 grid items-center gap-12 md:grid-cols-2">
        <div>
          <p class="section-subheading text-trovara-gold-300">How the farm fits together</p>
          <h2 class="mt-3 text-3xl font-black text-white md:text-5xl">One farm. Clear records. Less waste.</h2>
          <p class="mt-5 max-w-xl leading-7 text-white/70">
            Our 24-acre plan brings crops, poultry, processing, water, and soil care into one system. We are building traceability into the work from the start.
          </p>
          <div class="mt-7 flex flex-wrap gap-3 text-sm font-bold">
            <span class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white">24-acre farm plan</span>
            <span class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white">Harvest-lot records</span>
            <span class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white">Nationwide delivery planned</span>
          </div>
          <RouterLink to="/farm" class="btn-gold mt-8 inline-flex">See the farm plan</RouterLink>
        </div>
        <InfographicFigure
          src="/images/regen/system.webp"
          alt="Trovara's integrated farm plan connecting crops, pasture-raised poultry, processing, and the reuse of farm by-products."
          caption="The planned Trovara farm system"
          summary="Crops, poultry, and processing designed to work together on one farm."
          dark
        />
      </div>
    </section>

    <section class="bg-trovara-cream py-20 md:py-24">
      <div class="container-trovara">
        <div class="mx-auto max-w-3xl text-center">
          <p class="section-subheading">Farm technology &amp; advisory</p>
          <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-5xl">Built from the work of running a farm.</h2>
          <p class="mt-4 leading-7 text-gray-500">Choose software for everyday farm operations or practical support for planning and improving your farm.</p>
        </div>
        <div class="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          <RouterLink to="/farm-os" class="group rounded-3xl bg-trovara-dark p-8 text-white transition hover:-translate-y-1 hover:shadow-xl md:p-10">
            <BrandIcon name="os" class="h-14 w-14 rounded-2xl bg-white p-2" />
            <p class="mt-7 text-xs font-black uppercase tracking-[0.18em] text-trovara-gold">Trovara Farm OS</p>
            <h3 class="mt-2 text-2xl font-black">Daily work, records, stock, and sales in one place.</h3>
            <span class="mt-7 inline-flex font-bold text-trovara-gold group-hover:underline">Explore Farm OS →</span>
          </RouterLink>
          <RouterLink to="/farm-advisory" class="group rounded-3xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl md:p-10">
            <BrandIcon name="land" class="h-14 w-14" />
            <p class="mt-7 text-xs font-black uppercase tracking-[0.18em] text-trovara-green">Farm advisory</p>
            <h3 class="mt-2 text-2xl font-black text-trovara-dark">Practical help to plan, build, and improve farm operations.</h3>
            <span class="mt-7 inline-flex font-bold text-trovara-green group-hover:underline">Explore advisory →</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
