<script setup lang="ts">
import SectionHeader from '../components/ui/SectionHeader.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'

const operations = [
  {
    icon: '🌴',
    title: 'Coconut Plantation',
    desc: 'Our coconut trees are cultivated across fertile, well-draining tropical soil. We practice intercropping and organic soil enrichment to ensure maximum yield and quality with zero synthetic chemicals.',
    highlights: ['Organic soil management', 'No synthetic pesticides', 'Harvested at peak maturity', 'Multi-use processing'],
  },
  {
    icon: '🍌',
    title: 'Plantain Plantation',
    desc: 'Our plantain cultivation follows strict agronomic practices across fertile tropical soil. Unlike regular bananas, plantains are a cooking staple - starchier, heartier, and harvested at different stages for different uses. We grow and supply green plantains for savory cooking, ripe plantains for sweeter dishes, and also process them into dried chips and flour for wider market reach.',
    highlights: ['Harvested at green and ripe stages', 'Zero synthetic chemicals or artificial ripening', 'Processed into chips and plantain flour', 'Export-grade quality for regional and global markets'],
  },
  {
    icon: '🐔',
    title: 'Poultry Operations',
    desc: 'Our poultry farm is designed around animal welfare. Birds roam freely in clean, open spaces and are fed natural grain-based diets. Our commitment to ethical farming shows in the quality of every egg and every bird.',
    highlights: ['Free-range open environment', 'Natural grain feed only', 'No growth hormones', 'Clean, ethical operations'],
  },
]

const practices = [
  { icon: '♻️', title: 'Zero Waste Policy', desc: 'Every byproduct is repurposed. Husks become mulch. Droppings become fertilizer. Nothing is wasted on a Trovara farm.' },
  { icon: '💧', title: 'Smart Water Use', desc: 'We irrigate efficiently using rain-fed and natural water systems, minimizing our water footprint on the land.' },
  { icon: '🌱', title: 'Soil Health First', desc: 'Healthy soil grows healthy food. We invest heavily in organic soil management and never strip the land.' },
  { icon: '🤝', title: 'Community Farming', desc: 'We employ and empower local farmers, creating livelihoods and building shared prosperity from the ground up.' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300 mb-4">Behind the Brand</p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            The farm that<br/>feeds the world.
          </h1>
          <p class="text-white/70 text-lg leading-relaxed max-w-xl">
            Trovara Farm is more than a production facility - it is a living ecosystem where
            every practice is chosen for the long-term health of the land, the animals, and the people.
          </p>
        </div>
      </div>
    </section>

    <!-- Operations -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Farm Operations"
          title="How we grow what we grow"
          subtitle="Each product line at Trovara Farm has its own dedicated operation, purpose-built for quality and sustainability."
          center
        />
        <div class="space-y-16">
          <div
            v-for="(op, i) in operations"
            :key="op.title"
            :class="[
              'grid md:grid-cols-2 gap-10 lg:gap-16 items-center',
              i % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : '',
            ]"
          >
            <!-- Visual -->
            <div class="bg-trovara-light rounded-3xl p-16 flex items-center justify-center">
              <span class="text-8xl">{{ op.icon }}</span>
            </div>

            <!-- Content -->
            <div>
              <h3 class="text-3xl font-black text-trovara-dark mb-4">{{ op.title }}</h3>
              <p class="text-gray-500 leading-relaxed mb-6">{{ op.desc }}</p>
              <ul class="space-y-3">
                <li
                  v-for="h in op.highlights"
                  :key="h"
                  class="flex items-center gap-3 text-trovara-dark text-sm font-medium"
                >
                  <span class="w-5 h-5 rounded-full bg-trovara-green/10 text-trovara-green flex items-center justify-center text-xs font-black">✓</span>
                  {{ h }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sustainable Practices -->
    <section class="py-20 md:py-28 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <SectionHeader
          eyebrow="Sustainability"
          title="Farming for tomorrow, not just today."
          subtitle="We are committed to practices that protect the land for future generations while delivering exceptional quality today."
          light
          center
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="practice in practices"
            :key="practice.title"
            class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white hover:bg-white/20 transition-all duration-300"
          >
            <div class="text-4xl mb-4">{{ practice.icon }}</div>
            <h4 class="font-bold text-lg mb-2">{{ practice.title }}</h4>
            <p class="text-white/70 text-sm leading-relaxed">{{ practice.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Master plan -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="The Master Plan"
          title="A 24-acre regenerative ecosystem."
          subtitle="Our land is designed as one integrated system - agriculture, processing, hospitality, and clean infrastructure working together, with the industrial spine placed downwind of the guest and residential zones."
          center
        />
        <div class="max-w-5xl mx-auto">
          <InfographicFigure
            src="/images/regen/masterplan.webp"
            alt="Site plan of Trovara's 24-acre regenerative farm-to-hospitality ecosystem, showing colour-coded agricultural, processing, hospitality, residential, and infrastructure zones with guest and service movement routes."
            caption="24-Acre Farm-to-Hospitality Ecosystem"
            summary="42% built-up, 50% green and productive land, targeting 100% energy self-sufficiency with 4-5 MWp of solar. Tap to explore each zone."
          />
        </div>
      </div>
    </section>

    <!-- Expansion plans -->
    <section class="py-20 bg-trovara-cream">
      <div class="container-trovara">
        <div class="max-w-3xl mx-auto text-center">
          <SectionHeader
            eyebrow="What's Next"
            title="The farm keeps growing."
            subtitle="Trovara Farm has an ambitious expansion roadmap. From new crop varieties to processing facilities and export logistics - we are building something that will endure."
            center
          />
          <div class="grid grid-cols-3 gap-4 mb-10">
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div class="text-3xl mb-3">🌾</div>
              <div class="font-bold text-trovara-dark text-sm">New Crops</div>
              <div class="text-gray-400 text-xs mt-1">Expanding varieties</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div class="text-3xl mb-3">🏭</div>
              <div class="font-bold text-trovara-dark text-sm">Processing</div>
              <div class="text-gray-400 text-xs mt-1">Value-added products</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div class="text-3xl mb-3">✈️</div>
              <div class="font-bold text-trovara-dark text-sm">Export</div>
              <div class="text-gray-400 text-xs mt-1">Global distribution</div>
            </div>
          </div>
          <RouterLink to="/contact" class="btn-primary px-8 py-4 text-base">
            Partner With Us
          </RouterLink>
        </div>

        <div class="max-w-5xl mx-auto mt-16">
          <InfographicFigure
            src="/images/regen/evolution.webp"
            alt="Trovara evolution map from 2026 to 2035 and beyond: four phases growing from Trovara Fresh and Harvest into Kitchen and Living, with revenue mix, closed-loop system flow, and foundational pillars."
            caption="Evolution Map: Building a Regenerative Food Platform"
            summary="One system, four brands - Fresh, Harvest, Kitchen, and Living - scaling across four phases from production today to a farm destination by 2035. Tap to read the full roadmap."
          />
        </div>
      </div>
    </section>

  </div>
</template>
