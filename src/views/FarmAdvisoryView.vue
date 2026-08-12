<script setup lang="ts">
import BrandIcon from '../components/brand/BrandIcon.vue'

const services = [
  { icon: 'map', title: 'Plan the farm', body: 'Land assessment, farm layout, infrastructure priorities, equipment, and a practical first-season plan.' },
  { icon: 'sprout', title: 'Plan crops & soil', body: 'Crop and variety choices, soil testing, fertility plans, rotations, and seasonal calendars.' },
  { icon: 'water', title: 'Set up water & crop care', body: 'Water-source assessment, irrigation design, crop-stage scheduling, and integrated pest management.' },
  { icon: 'package', title: 'Protect the harvest', body: 'Harvest timing, grading, storage, packaging, cold-chain thinking, and transport planning.' },
  { icon: 'education', title: 'Train the team', body: 'Hands-on sessions for production, poultry welfare, field records, and farm business basics.' },
  { icon: 'world', title: 'Prepare for market', body: 'Buyer readiness, pricing, quality requirements, documentation, and market introductions where appropriate.' },
]

const process = [
  ['1', 'Listen', 'We start with your goals, constraints, and the problem you need to solve.'],
  ['2', 'Assess', 'We review the farm, land, water, infrastructure, records, and current work.'],
  ['3', 'Plan', 'You receive a scoped plan with priorities, owners, timing, and deliverables.'],
  ['4', 'Support', 'We help put the plan into practice and adjust it as conditions change.'],
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-trovara-green pb-16 pt-32 md:pb-24">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 max-w-4xl">
        <p class="section-subheading text-trovara-gold-300">Farm advisory</p>
        <h1 class="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">Practical support for the farm you actually have.</h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">We help owners and teams make better decisions about setup, crops, soil, water, post-harvest work, training, and market readiness.</p>
        <RouterLink to="/contact?subject=farm-advisory" class="btn-gold mt-8 inline-flex">Discuss your farm</RouterLink>
      </div>
    </section>

    <section class="bg-trovara-light py-16 md:py-24">
      <div class="container-trovara">
        <div class="max-w-3xl">
          <p class="section-subheading">Where we can help</p>
          <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-5xl">Start with the constraint that matters most.</h2>
          <p class="mt-4 leading-7 text-gray-500">You do not need to buy every service. We scope the work around the farm’s immediate need and what can realistically be implemented.</p>
        </div>
        <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="service in services" :key="service.title" class="rounded-3xl border border-gray-200 bg-white p-6 md:p-7">
            <BrandIcon :name="service.icon" class="h-12 w-12" />
            <h3 class="mt-5 text-xl font-black text-trovara-dark">{{ service.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-gray-500">{{ service.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="container-trovara">
        <div class="mx-auto max-w-3xl text-center"><p class="section-subheading">How the work starts</p><h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-5xl">A clear process, with no mystery package.</h2></div>
        <div class="mt-10 grid gap-4 md:grid-cols-4">
          <div v-for="step in process" :key="step[0]" class="rounded-3xl bg-trovara-cream p-6">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-trovara-green font-black text-white">{{ step[0] }}</span>
            <h3 class="mt-5 text-xl font-black text-trovara-dark">{{ step[1] }}</h3>
            <p class="mt-3 text-sm leading-6 text-gray-500">{{ step[2] }}</p>
          </div>
        </div>
        <div class="mt-10 rounded-3xl border border-trovara-gold/30 bg-trovara-gold/10 p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div><h3 class="text-xl font-black text-trovara-dark">What you will know before work begins</h3><p class="mt-2 text-sm leading-6 text-gray-600">Scope, timing, deliverables, farm responsibilities, fees, and any assumptions that could affect the plan.</p></div>
          <RouterLink to="/contact?subject=farm-advisory" class="btn-primary mt-5 shrink-0 md:mt-0">Request an initial call</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
