<script setup lang="ts">
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ui/ProductCard.vue'
import StatCard from '../components/ui/StatCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import TestimonialsSection from '../components/ui/TestimonialsSection.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'
import { testimonials } from '../data/testimonials'

const store = useProductsStore()
const featuredProducts = store.availableProducts

const stats = [
  { value: '100+',  label: 'Acres Cultivated',      icon: '🌾' },
  { value: '3',     label: 'Core Product Lines',     icon: '🥥' },
  { value: '0',     label: 'Artificial Chemicals',   icon: '🌿' },
  { value: '100%',  label: 'Natural, Always',        icon: '☀️' },
]

const values = [
  {
    icon: '🌱',
    title: 'Rooted in Nature',
    desc: 'Everything we grow begins with respect for the soil. We farm with nature, not against it.',
  },
  {
    icon: '🤝',
    title: 'Built on Trust',
    desc: 'From our farm to your table, every product carries our promise of quality and honesty.',
  },
  {
    icon: '🌍',
    title: 'Grown for the World',
    desc: 'We are a local farm with a global heart. Our produce is grown to the highest international standards.',
  },
  {
    icon: '🐔',
    title: 'Raised with Ethics',
    desc: 'Our poultry lives in healthy, free-range environments. Happy animals produce exceptional food.',
  },
]
</script>

<template>
  <div>

    <!-- ===== HERO ===== -->
    <section class="relative min-h-screen flex items-center bg-trovara-green overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />

      <!-- Decorative Circles -->
      <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-trovara-green-500/30 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-trovara-gold/20 blur-3xl pointer-events-none" />

      <div class="container-trovara relative z-10 pt-32 pb-20">
        <div class="max-w-4xl">

          <!-- Eyebrow -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
            <span class="w-2 h-2 rounded-full bg-trovara-gold animate-pulse" />
            <span class="text-trovara-gold-300 text-sm font-semibold tracking-wider uppercase">
              Born Natural. Raised Global.
            </span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 text-balance">
            The earth's<br/>
            <span class="text-trovara-gold">finest,</span><br/>
            for the world.
          </h1>

          <p class="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            Trovara Farm grows premium coconuts, plantains, and poultry with deep respect for the land.
            From our soil to your table - pure, natural, and world-class.
          </p>

          <div class="flex flex-wrap gap-4">
            <RouterLink to="/products" class="btn-gold text-base px-8 py-4 rounded-xl">
              Explore Our Products
            </RouterLink>
            <RouterLink
              to="/about"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
            >
              Our Story
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- Floating Product Badges -->
        <div class="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 hover:bg-white/20 transition-all duration-200 cursor-pointer group"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform">{{ product.icon }}</span>
            <div>
              <div class="text-white font-bold text-sm">{{ product.name }}</div>
              <div class="text-white/50 text-xs">{{ product.tagline }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span class="text-xs tracking-widest uppercase">Scroll</span>
        <div class="w-px h-8 bg-white/20 relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-4 bg-trovara-gold animate-bounce" />
        </div>
      </div>
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
          subtitle="From tropical fruits to free-range poultry - every product at Trovara Farm is grown with purpose, patience, and pride."
          center
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
        <div class="text-center mt-12">
          <RouterLink to="/products" class="btn-primary text-base px-8 py-4">
            View All Products
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
            alt="Trovara integrated regenerative system: plantain, coconut, and chicken inputs flow through a circular farm into Trovara Fresh and Trovara Harvest brands."
            caption="One regenerative system behind every product"
            summary="Fresh produce and shelf-stable Harvest products — all from one closed-loop farm on 24 acres. Tap to explore the full system."
            dark
          />
        </div>
      </div>
    </section>

    <!-- ===== VALUES ===== -->
    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="What We Stand For"
          title="Values that grow with every harvest"
          center
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="value in values"
            :key="value.title"
            class="bg-white rounded-2xl p-8 hover:shadow-md transition-shadow duration-300 text-center group"
          >
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {{ value.icon }}
            </div>
            <h3 class="font-bold text-trovara-dark text-lg mb-2">{{ value.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SERVICES TEASER ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              eyebrow="Ancillary Services"
              title="We help other farms grow too."
              subtitle="The expertise we've built at Trovara Farm is available to you. From farm setup and soil advisory to crop planning and market linkage - we walk the land with you."
            />
            <div class="grid grid-cols-2 gap-3 mb-8">
              <div v-for="s in ['Farm Setup & Development', 'Soil Health Advisory', 'Crop Planning', 'Irrigation Design', 'Pest Management', 'Market Linkage']" :key="s"
                class="flex items-center gap-2 text-sm text-trovara-dark font-medium"
              >
                <span class="w-4 h-4 rounded-full bg-trovara-green/10 text-trovara-green flex items-center justify-center text-[10px] font-black flex-shrink-0">✓</span>
                {{ s }}
              </div>
            </div>
            <RouterLink to="/services" class="btn-primary px-8 py-4 text-base">
              See All Services
            </RouterLink>
          </div>
          <div class="bg-trovara-light rounded-3xl p-10">
            <div class="text-6xl mb-6">🌾</div>
            <blockquote class="text-2xl font-bold text-trovara-dark leading-tight mb-4">
              "We don't advise what we haven't done ourselves."
            </blockquote>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">
              Every service we offer is rooted in real, hands-on farming experience at Trovara Farm. No theory. No guesswork. Just what works.
            </p>
            <RouterLink to="/contact" class="text-trovara-green font-semibold text-sm hover:underline inline-flex items-center gap-1">
              Book a free consultation →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <TestimonialsSection v-if="testimonials.length > 0" context="home" />

    <!-- ===== CTA ===== -->
    <section class="py-20 bg-trovara-dark text-white">
      <div class="container-trovara text-center">
        <p class="section-subheading text-trovara-gold mb-4">Ready to Partner?</p>
        <h2 class="text-4xl md:text-5xl font-black text-white mb-6 max-w-2xl mx-auto">
          Let's grow something great together
        </h2>
        <p class="text-white/60 text-lg mb-10 max-w-lg mx-auto">
          Whether you're a distributor, retailer, or consumer - we'd love to connect.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
            Get in Touch
          </RouterLink>
          <RouterLink
            to="/products"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
          >
            See Products
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>
