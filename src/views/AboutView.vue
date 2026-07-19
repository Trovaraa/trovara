<script setup lang="ts">
import SectionHeader from '../components/ui/SectionHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import InfographicFigure from '../components/ui/InfographicFigure.vue'

const milestones = [
  {
    year: 'Day 1',
    title: 'The Vision',
    desc: 'Trovara Farm was founded on a simple idea: grow the world\'s finest tropical produce with complete honesty and care.',
  },
  {
    year: 'Year 1',
    title: 'First Harvest',
    desc: 'Our first coconut and plantain harvests proved what we believed - that honest farming produces exceptional food.',
  },
  {
    year: 'Year 2',
    title: 'Noilers & Hens Expansion',
    desc: 'We launched free-range dressed noilers and mature hens, bringing the same ethics and standards that define our crop farming.',
  },
  {
    year: 'Today',
    title: 'Going Global',
    desc: 'With strong local roots, we are now positioning Trovara as a globally recognized mark of quality tropical produce.',
  },
]

const stats = [
  { value: '100+', label: 'Acres Farmed',       icon: '🌾' },
  { value: '3',    label: 'Product Lines',       icon: '📦' },
  { value: '0',    label: 'Artificial Chemicals', icon: '🌿' },
  { value: '∞',    label: 'Passion for Quality', icon: '💚' },
]

const team = [
  { initials: 'TF', name: 'The Founder', role: 'Founder & Visionary', bio: 'Built Trovara with the belief that great farming changes lives - locally and globally.' },
  { initials: 'FD', name: 'Farm Director', role: 'Head of Agricultural Operations', bio: 'Oversees all crop cultivation across our plantations with decades of tropical farming knowledge.' },
  { initials: 'PM', name: 'Poultry Manager', role: 'Head of Noilers & Hens', bio: 'Ensures every free-range noiler and mature hen is raised ethically, healthily, and dressed to the highest quality standards.' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300 mb-4">About Trovara</p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            We believe the earth<br/> deserves better farming.
          </h1>
          <p class="text-white/70 text-lg leading-relaxed max-w-xl">
            Trovara Farm exists to prove that premium quality and ethical farming are not opposites -
            they are inseparable. Every crop, every bird, every harvest is a testimony to that belief.
          </p>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section id="story" class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeader
              eyebrow="Our Story"
              title="Born from the land, built for the world."
              subtitle="Trovara Farm started with a patch of tropical land, a handful of coconut seedlings, and an unshakeable belief that great food begins with great farming."
            />
            <p class="text-gray-500 leading-relaxed mb-6">
              The name TROVARA means "to find" - and that's exactly what we set out to do. Find the
              finest varieties. Find the best farming practices. Find the most honest path from soil
              to table.
            </p>
            <p class="text-gray-500 leading-relaxed">
              Today, Trovara Farm cultivates premium coconuts and plantains across fertile tropical
              plantations, and raises free-range dressed noilers and mature hens with the same care and ethics. We are
              growing - adding new crops, expanding our reach, and building a brand that the world
              can trust.
            </p>
          </div>

          <!-- Visual Story Box -->
          <div class="space-y-6">
            <div class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <img
                src="/images/trovara-brand.png"
                alt="Trovara Farm brand mark - Food you can trust, from a farm built for tomorrow"
                class="w-full h-auto object-cover"
                width="800"
                height="600"
                loading="lazy"
              />
            </div>
            <div class="bg-trovara-light rounded-3xl p-8 lg:p-10">
              <blockquote class="text-2xl md:text-3xl font-bold text-trovara-dark leading-tight mb-6">
                "We don't just farm land. We cultivate a promise."
              </blockquote>
              <p class="text-trovara-green font-semibold">- Trovara Farm</p>
              <div class="mt-8 pt-8 border-t border-gray-200">
                <p class="text-sm text-gray-500 italic font-medium">
                  Food you can trust, from a farm built for tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-16 bg-trovara-green">
      <div class="container-trovara">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :value="stat.value"
            :label="stat.label"
            :icon="stat.icon"
            dark
          />
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Our Journey"
          title="Every harvest marks a milestone."
          center
        />
        <div class="max-w-3xl mx-auto">
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-trovara-green/20" />

            <div
              v-for="(milestone, i) in milestones"
              :key="i"
              class="relative flex gap-8 mb-10 last:mb-0"
            >
              <!-- Dot -->
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-trovara-green flex items-center justify-center z-10 shadow-md">
                <span class="text-white text-xs font-bold">{{ i + 1 }}</span>
              </div>

              <!-- Content -->
              <div class="bg-white rounded-2xl p-6 flex-1 shadow-sm">
                <span class="text-trovara-green text-xs font-bold uppercase tracking-widest">{{ milestone.year }}</span>
                <h3 class="text-trovara-dark font-bold text-lg mt-1 mb-2">{{ milestone.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">{{ milestone.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader eyebrow="What Drives Us" title="Mission & Vision" center />
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="bg-trovara-green rounded-3xl p-8 lg:p-10 text-white">
            <div class="text-4xl mb-5">🎯</div>
            <h3 class="text-2xl font-black mb-4">Our Mission</h3>
            <p class="text-white/80 leading-relaxed">
              Trovara creates trusted food products with traceability, lower waste and deeper customer connection.
            </p>
          </div>
          <div class="bg-trovara-light rounded-3xl p-8 lg:p-10">
            <div class="text-4xl mb-5">🌍</div>
            <h3 class="text-2xl font-black text-trovara-dark mb-4">Our Vision</h3>
            <p class="text-gray-500 leading-relaxed">
              Trovara is building a regenerative food company that turns African farms into trusted sources of
              premium, traceable and climate-resilient food.
            </p>
          </div>
        </div>

        <div class="max-w-4xl mx-auto mt-12">
          <SectionHeader
            eyebrow="How We Work"
            title="Core principles"
            center
          />
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              v-for="principle in ['Trust', 'Quality', 'Consistency', 'Regeneration', 'Innovation', 'Community']"
              :key="principle"
              class="bg-trovara-cream rounded-2xl px-4 py-5 text-center"
            >
              <p class="font-bold text-trovara-dark text-sm">{{ principle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader eyebrow="The People Behind the Farm" title="Our Team" center />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div
            v-for="member in team"
            :key="member.name"
            class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-16 h-16 rounded-full bg-trovara-green flex items-center justify-center mx-auto mb-4">
              <span class="text-trovara-gold font-black text-xl">{{ member.initials }}</span>
            </div>
            <h3 class="font-bold text-trovara-dark">{{ member.name }}</h3>
            <p class="text-trovara-green text-sm font-medium mb-3">{{ member.role }}</p>
            <p class="text-gray-500 text-sm leading-relaxed">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Master plan -->
    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="The Land"
          title="A 24-acre regenerative ecosystem."
          subtitle="Our farm is designed as one integrated system - agriculture, processing, and hospitality working together on a single master plan."
          center
        />
        <div class="max-w-5xl mx-auto">
          <InfographicFigure
            src="/images/regen/masterplan.webp"
            alt="Site plan of Trovara's 24-acre regenerative farm-to-hospitality ecosystem, showing colour-coded agricultural, processing, hospitality, residential, and infrastructure zones."
            caption="24-Acre Farm-to-Hospitality Ecosystem"
            summary="42% built-up, 50% green and productive land, targeting 100% energy self-sufficiency. Tap to explore each zone."
          />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-trovara-dark text-white text-center">
      <div class="container-trovara max-w-2xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-black mb-4">Ready to work with us?</h2>
        <p class="text-white/60 mb-8">From bulk orders to distribution partnerships, we're open for business.</p>
        <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
          Contact Trovara Farm
        </RouterLink>
      </div>
    </section>

  </div>
</template>
