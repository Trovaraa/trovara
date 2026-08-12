<script setup lang="ts">
import BrandIcon from '../components/brand/BrandIcon.vue'

const choices = [
  {
    icon: 'os',
    eyebrow: 'Farm software',
    title: 'Trovara Farm OS',
    body: 'For farms that need one clear place for daily work, field reports, inventory, harvest records, sales, support, and traceability.',
    points: ['Role-based access', 'Field-friendly daily workflows', 'Records from input to sale'],
    label: 'Explore Farm OS',
    to: '/farm-os',
    dark: true,
  },
  {
    icon: 'land',
    eyebrow: 'Practical support',
    title: 'Farm advisory',
    body: 'For owners and teams that need hands-on help with planning, soil, crops, water, training, post-harvest work, or market access.',
    points: ['On-site assessment', 'A plan fitted to your farm', 'Implementation and follow-up'],
    label: 'Explore advisory',
    to: '/farm-advisory',
    dark: false,
  },
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-trovara-green pb-16 pt-32 md:pb-20">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 max-w-4xl text-center">
        <p class="section-subheading text-trovara-gold-300">Farm technology &amp; advisory</p>
        <h1 class="mt-4 text-4xl font-black text-white sm:text-5xl md:text-6xl">Two different needs. Two clear ways we can help.</h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Choose the operations system if you need better daily control. Choose advisory if you need people to help plan or improve the farm itself.
        </p>
      </div>
    </section>

    <section class="bg-trovara-cream py-16 md:py-24">
      <div class="container-trovara">
        <div class="grid gap-6 lg:grid-cols-2">
          <article
            v-for="choice in choices"
            :key="choice.title"
            class="flex flex-col rounded-[2rem] p-7 md:p-10"
            :class="choice.dark ? 'bg-trovara-dark text-white' : 'border border-gray-200 bg-white text-trovara-dark'"
          >
            <BrandIcon :name="choice.icon" class="h-16 w-16 rounded-2xl" :class="choice.dark ? 'bg-white p-2' : ''" />
            <p class="mt-8 text-xs font-black uppercase tracking-[0.2em]" :class="choice.dark ? 'text-trovara-gold' : 'text-trovara-green'">{{ choice.eyebrow }}</p>
            <h2 class="mt-2 text-3xl font-black md:text-4xl">{{ choice.title }}</h2>
            <p class="mt-4 max-w-xl leading-7" :class="choice.dark ? 'text-white/70' : 'text-gray-500'">{{ choice.body }}</p>
            <ul class="mt-7 grid gap-3">
              <li v-for="point in choice.points" :key="point" class="flex items-center gap-3 text-sm font-semibold">
                <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs" :class="choice.dark ? 'bg-white/10 text-trovara-gold' : 'bg-trovara-green/10 text-trovara-green'">✓</span>
                {{ point }}
              </li>
            </ul>
            <RouterLink :to="choice.to" class="mt-9 self-start" :class="choice.dark ? 'btn-gold' : 'btn-primary'">{{ choice.label }}</RouterLink>
          </article>
        </div>

        <div class="mt-10 rounded-3xl border border-gray-200 bg-white p-7 text-center md:p-9">
          <h2 class="text-2xl font-black text-trovara-dark">Not sure which one fits?</h2>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">Tell us what is slowing the farm down. We will point you to the right starting place without making you choose a service first.</p>
          <RouterLink to="/contact?subject=farm-services" class="btn-secondary mt-6 inline-flex">Talk through the problem</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
