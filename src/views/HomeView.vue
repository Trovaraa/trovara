<script setup lang="ts">
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ui/ProductCard.vue'
import StatCard from '../components/ui/StatCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import TestimonialsSection from '../components/ui/TestimonialsSection.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'

const store = useProductsStore()
const featuredProducts = store.availableProducts

/** Compact labels for hero chips so long product names do not crowd the layout. */
const heroProducts = featuredProducts.map((product) => ({
  ...product,
  shortName: product.id === 'poultry' ? 'Chicken' : product.name,
}))

const stats = [
  { value: '24',    label: 'Acres in our farm plan', icon: 'land' },
  { value: '5',     label: 'Planned product lines',  icon: 'harvest' },
  { value: '0',     label: 'Artificial chemicals',   icon: 'natural' },
  { value: '1',     label: 'Regenerative system',    icon: 'system' },
]

const principles = [
  { icon: 'trust', title: 'Trust' },
  { icon: 'quality', title: 'Quality' },
  { icon: 'cycle', title: 'Consistency' },
  { icon: 'regeneration', title: 'Regeneration' },
  { icon: 'innovation', title: 'Innovation' },
  { icon: 'community', title: 'Community' },
]</script>

<template>
  <div>

    <!-- ===== HERO ===== -->
    <section class="relative min-h-[46rem] lg:min-h-screen flex items-center bg-[#0b3a25] overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />
      <div class="absolute inset-0 hero-grid opacity-40 pointer-events-none" />

      <!-- Decorative Circles -->
      <div class="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-trovara-green-400/20 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-trovara-gold/15 blur-3xl pointer-events-none" />

      <div class="container-trovara relative z-10 pt-28 pb-20 lg:pt-32">
        <div class="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] gap-12 xl:gap-20 items-center">
          <div class="min-w-0">
            <!-- Eyebrow -->
            <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/10 backdrop-blur-sm mb-7 max-w-full">
              <span class="w-2 h-2 rounded-full bg-trovara-gold flex-shrink-0" />
              <span class="text-trovara-gold-200 text-xs font-bold tracking-[0.16em] uppercase leading-snug">
                Food you can trust · from a farm built for tomorrow
              </span>
            </div>

            <!-- Main Headline -->
            <h1 class="text-5xl sm:text-6xl md:text-7xl xl:text-[4.9rem] font-black text-white leading-[0.98] mb-7 text-balance tracking-[-0.045em]">
              Better food starts with better
              <span class="text-trovara-gold">Soil.</span>
            </h1>

            <p class="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-9">
              Traceable plantain, coconut, palm oil, pasture-raised chicken, and eggs from one regenerative farm - planned for homes, chefs, and food businesses across Nigeria.
            </p>

            <div class="flex flex-wrap gap-4">
              <RouterLink to="/products" class="btn-gold text-base px-7 py-4 rounded-full">
                Explore products & waitlists
              </RouterLink>
              <RouterLink
                to="/shop"
                class="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/25 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
              >
                Create a shop account
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </RouterLink>
            </div>

            <div class="mt-10 flex gap-2 overflow-x-auto pb-2 lg:hidden mobile-product-rail" aria-label="Featured products">
              <RouterLink
                v-for="product in heroProducts"
                :key="`mobile-${product.id}`"
                :to="`/products/${product.id}`"
                class="flex min-w-[8.5rem] items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 backdrop-blur-sm"
              >
                <BrandIcon :name="product.icon" class="h-9 w-9 shrink-0 rounded-lg bg-[#f2ead8] p-1" />
                <span class="text-xs font-bold leading-tight text-white">{{ product.shortName }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- A product-led farm card gives the hero a tactile, shoppable second half. -->
          <div class="hidden lg:block w-full max-w-md justify-self-end">
            <div class="relative rounded-[2rem] border border-white/15 bg-white/[0.07] backdrop-blur-md p-5 shadow-2xl shadow-black/20">
              <div class="rounded-[1.4rem] bg-[#f2ead8] p-6 text-trovara-dark overflow-hidden relative min-h-[25rem] flex flex-col">
                <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-trovara-gold/25" />
                <div class="relative z-10 flex items-start justify-between gap-6">
                  <div>
                    <p class="text-[11px] font-black uppercase tracking-[0.18em] text-trovara-green">Product roadmap</p>
                    <h2 class="mt-2 text-3xl font-black tracking-tight">Growing at Trovara</h2>
                  </div>
                  <span class="rounded-full bg-trovara-green px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">Farm forecast</span>
                </div>

                <div class="relative z-10 grid grid-cols-2 gap-3 mt-8 flex-1">
                  <RouterLink
                    v-for="product in heroProducts"
                    :key="product.id"
                    :to="`/products/${product.id}`"
                    class="group rounded-2xl bg-white/75 border border-white p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    <BrandIcon :name="product.icon" class="w-12 h-12 group-hover:scale-105 transition-transform origin-left" />
                    <span class="mt-5 text-sm font-black leading-tight">{{ product.shortName }}</span>
                    <span class="mt-1 text-[11px] font-semibold text-trovara-green">View product ↗</span>
                  </RouterLink>
                </div>

                <div class="hero-farm-card__footer relative z-10 mt-5 flex items-center justify-between border-t border-trovara-dark/10 pt-4 text-xs font-semibold text-trovara-dark/70">
                  <span>Farm-direct</span><span>Traceable</span><span>Naturally grown</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>

    <!-- ===== STATS ===== -->
    <section class="py-16 bg-trovara-light border-b border-gray-100">
      <div class="container-trovara">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :value="stat.value"
            :label="stat.label"
            :icon="stat.icon"
          />
        </div>
      </div>
    </section>

    <!-- ===== PRODUCTS PREVIEW ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="What We Grow"
          title="Nature's finest, carefully cultivated"
          subtitle="From tropical crops and palm oil to pasture-raised chicken and eggs, every Trovara product has a clear forecast window. Join waitlists now; checkout opens as each harvest arrives."
          center
        />
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <RouterLink to="/products" class="btn-primary text-base px-8 py-4">
            View products & waitlists
          </RouterLink>
          <RouterLink to="/shop" class="btn-secondary text-base px-8 py-4">
            Create a shop account
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== BRAND STORY STRIP ===== -->
    <section class="bg-trovara-green py-20 md:py-28 overflow-hidden relative">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              eyebrow="Our Promise"
              title="From our roots, to your world."
              subtitle="Trovara Farm was built on a single belief: that the best food comes from honest farming. No shortcuts. No chemicals. Just the earth, the sun, and the care of human hands."
              light
            />
            <RouterLink to="/about" class="btn-gold text-base px-8 py-4 inline-flex">
              Read Our Story
            </RouterLink>
          </div>

          <!-- Regenerative system visual -->
          <InfographicFigure
            src="/images/regen/system.webp"
            alt="Trovara integrated regenerative system: plantain, coconut, oil palm, and pasture-raised poultry flow through a circular farm into Trovara Fresh and Trovara Harvest."
            caption="One regenerative system behind every product"
            summary="Fresh produce and shelf-stable Harvest products - all from one closed-loop farm on 24 acres. Tap to explore the full system."
            dark
          />
        </div>
      </div>
    </section>

    <!-- ===== CORE PRINCIPLES ===== -->
    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="What We Stand For"
          title="Core principles"
          center
        />
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          <div
            v-for="principle in principles"
            :key="principle.title"
            class="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 text-center group"
          >
            <BrandIcon :name="principle.icon" class="w-10 h-10 mx-auto mb-3 group-hover:scale-105 transition-transform duration-300" />
            <h3 class="font-bold text-trovara-dark text-sm sm:text-base">{{ principle.title }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SERVICES TEASER ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Farm Technology & Advisory"
          title="Two ways we help other farms grow."
          subtitle="Choose the Operations System built to run daily farm work, or hands-on advisory from people applying the same lessons on our own land."
          center
        />
        <div class="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <div class="rounded-3xl border border-trovara-green/20 bg-gradient-to-br from-white to-trovara-green/[0.04] p-8 lg:p-10 dark:border-trovara-green/35 dark:to-trovara-green/20">
            <BrandIcon name="os" class="w-14 h-14 mb-6" />
            <p class="text-xs font-black uppercase tracking-[0.18em] text-trovara-green mb-2">Farm Technology</p>
            <h3 class="text-2xl font-black text-trovara-dark mb-4">Trovara Farm OS</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">
              One place for tasks, field teams, inventory, harvest records, sales, and customer coordination.
            </p>
            <RouterLink to="/services#farm-os" class="btn-primary inline-flex px-6 py-3">
              Explore Farm OS
            </RouterLink>
          </div>

          <div class="bg-trovara-light rounded-3xl p-8 lg:p-10">
            <BrandIcon name="land" class="w-14 h-14 mb-6" />
            <p class="text-xs font-black uppercase tracking-[0.18em] text-trovara-green mb-2">Hands-on Expertise</p>
            <h3 class="text-2xl font-black text-trovara-dark mb-4">Farm Advisory Services</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">
              Practical support for setup, soil health, crop planning, irrigation, training, post-harvest systems, and market access.
            </p>
            <RouterLink to="/services#farm-advisory" class="btn-primary inline-flex px-6 py-3">
              View Farm Advisory
            </RouterLink>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            “We don't advise what we haven't done ourselves.”
            <RouterLink to="/contact?subject=farm-advisory" class="ml-1 font-semibold text-trovara-green hover:underline">
              Book a free consultation →
            </RouterLink>
          </p>
        </div>
      </div>
    </section>

    <TestimonialsSection context="home" />

    <!-- ===== CTA ===== -->
    <section class="py-20 bg-trovara-dark text-white">
      <div class="container-trovara text-center">
        <p class="section-subheading text-trovara-gold mb-4">Ready to Partner?</p>
        <h2 class="text-4xl md:text-5xl font-black text-white mb-6 max-w-2xl mx-auto">
          Let's grow something great together
        </h2>
        <p class="text-white/60 text-lg mb-10 max-w-lg mx-auto">
          Join waitlists for upcoming harvests, create a shop account for when checkout opens, or talk with us about wholesale supply.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
            Get in Touch
          </RouterLink>
          <RouterLink
            to="/products"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
          >
            Join waitlists
          </RouterLink>
          <RouterLink
            to="/shop"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
          >
            Shop account
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>
