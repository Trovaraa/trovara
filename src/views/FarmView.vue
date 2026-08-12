<script setup lang="ts">
import SectionHeader from '../components/ui/SectionHeader.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'

const operations = [
  {
    icon: 'coconut',
    title: 'Coconut Plantation',
    desc: 'Our coconut trees grow in well-draining tropical soil. We intercrop and enrich soil organically to build yield and quality with no synthetic chemicals. First harvest is forecast for June 2027.',
    highlights: ['Organic soil management', 'No synthetic pesticides', 'Grown for peak-maturity harvest', 'Multi-use processing planned'],
  },
  {
    icon: 'plantain',
    title: 'Plantain Plantation',
    desc: 'Our plantain cultivation follows strict agronomic practices across fertile tropical soil. Unlike regular bananas, plantains are a cooking staple - starchier, heartier, and harvested at different stages for different uses. We are establishing green and ripe fruit supply, with dried chips and flour planned after first harvest (forecast March 2027).',
    highlights: ['Green and ripe harvest stages planned', 'Zero synthetic chemicals or artificial ripening', 'Chips and plantain flour planned post-harvest', 'Export-grade standards for regional and global markets'],
  },
  {
    icon: 'palm',
    title: 'Oil Palm',
    desc: 'Oil palm is part of the same regenerative system as our tropical crops. Fruit will be processed into traceable palm oil for retail and food-service formats, with first harvest forecast for December 2026.',
    highlights: ['Grown within the regenerative farm plan', 'First harvest forecast December 2026', 'Retail and bulk formats planned', 'Traceable harvest and processing'],
  },
  {
    icon: 'poultry',
    title: 'Pasture-raised Poultry',
    desc: 'Our poultry plan puts animal welfare first: open pasture, grass-and-grain feeding, clean water, and no growth hormones. Chicken and eggs will open for sale only after production readiness is confirmed.',
    highlights: ['Grass-fed and pasture-raised', 'Rotational open pasture', 'No growth hormones', 'Waitlist before first supply'],
  },
]

const practices = [
  { icon: 'cycle', title: 'Zero Waste Policy', desc: 'Every byproduct is reused. Husks become mulch. Droppings become fertilizer. Nothing is wasted on a Trovara farm.' },
  { icon: 'water', title: 'Smart Water Use', desc: 'We irrigate with rain-fed and natural water systems where we can, and we keep water use as low as the crops allow.' },
  { icon: 'sprout', title: 'Soil Health First', desc: 'Healthy soil grows healthy food. We put time into organic soil management and do not strip the land.' },
  { icon: 'community', title: 'Community Farming', desc: 'We hire local farm workers and share skills so nearby households earn from the same land we farm.' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300 mb-4">Behind the brand</p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            How we farm<br /> in Ogun State.
          </h1>
          <p class="text-white/70 text-lg leading-relaxed max-w-xl">
            Trovara Farm is a regenerative production site where crop, poultry, and soil practices
            are chosen for lasting land health, animal welfare, and reliable food for people.
          </p>
        </div>
      </div>
    </section>

    <!-- Operations -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Farm operations"
          title="How we grow what we grow"
          subtitle="Each product line has its own plot and process, set up for quality and soil care."
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
              <BrandIcon :name="op.icon" :title="op.title" class="w-32 h-32" />
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
          title="Farming that keeps the land usable."
          subtitle="We choose practices that protect soil and water while still producing food people want to buy."
          light
          center
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="practice in practices"
            :key="practice.title"
            class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white hover:bg-white/20 transition-all duration-300"
          >
            <BrandIcon :name="practice.icon" class="w-12 h-12 mb-4 icon-on-dark" />
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
            eyebrow="What's next"
            title="The farm keeps growing."
            subtitle="Next steps on our roadmap include more crop varieties, on-farm processing, and export logistics once local supply is steady."
            center
          />
          <div class="grid grid-cols-3 gap-4 mb-10">
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <BrandIcon name="land" class="w-10 h-10 mx-auto mb-3" />
              <div class="font-bold text-trovara-dark text-sm">New crops</div>
              <div class="text-gray-400 text-xs mt-1">More varieties</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <BrandIcon name="factory" class="w-10 h-10 mx-auto mb-3" />
              <div class="font-bold text-trovara-dark text-sm">Processing</div>
              <div class="text-gray-400 text-xs mt-1">Value-added products</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
              <BrandIcon name="plane" class="w-10 h-10 mx-auto mb-3" />
              <div class="font-bold text-trovara-dark text-sm">Export</div>
              <div class="text-gray-400 text-xs mt-1">Regional and overseas buyers</div>
            </div>
          </div>
          <RouterLink to="/contact" class="btn-primary px-8 py-4 text-base">
            Partner with us
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
