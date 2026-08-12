<script setup lang="ts">
import BrandIcon from '../components/brand/BrandIcon.vue'

const modules = [
  { icon: 'clipboard', title: 'Today & tasks', body: 'Assign work, show each person what to do, and approve completed jobs.' },
  { icon: 'field', title: 'Field reports', body: 'Capture observations, photos, issues, and follow-up work from the field.' },
  { icon: 'package', title: 'Stock & products', body: 'Track products by SKU and unit, then reconcile inputs, outputs, and adjustments.' },
  { icon: 'quality', title: 'Harvest & traceability', body: 'Keep harvest-lot records that can follow a product through sale and delivery.' },
  { icon: 'world', title: 'Sales & support', body: 'Coordinate customers, orders, complaints, and sales without giving sales staff stock-edit access.' },
  { icon: 'chat', title: 'Farm copilot', body: 'Ask questions, upload a photo, and take role-scoped actions using the records you can access.' },
]

const roles = [
  ['Administrator', 'Controls setup, access, approvals, records, and reporting.'],
  ['Supervisor', 'Plans work, reviews field activity, approves records, and follows exceptions.'],
  ['Field worker', 'Sees assigned work and records what happened in the field.'],
  ['Sales', 'Manages customers and orders without changing inventory balances.'],
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-trovara-dark pb-16 pt-32 text-white md:pb-24">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.8fr)]">
        <div>
          <p class="section-subheading text-trovara-gold">Trovara Farm OS</p>
          <h1 class="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">Know what is happening on the farm today.</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">Daily work, field records, products, stock, sales, and customer support in one role-aware system built for farm teams.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/contact?subject=farm-os" class="btn-gold">Request a walkthrough</RouterLink>
            <a href="#modules" class="rounded-xl border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">See what it covers</a>
          </div>
        </div>

        <div class="rounded-[2rem] border border-white/10 bg-[#0c281d] p-5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-white/10 pb-4">
            <div class="flex items-center gap-3"><BrandIcon name="os" class="h-10 w-10 rounded-xl bg-white p-1.5" /><div><p class="text-xs font-black text-trovara-gold">TROVARA OS</p><p class="text-sm font-bold">Today</p></div></div>
            <span class="rounded-full bg-trovara-green/30 px-3 py-1 text-[10px] font-black text-green-200">Farm online</span>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3">
            <div v-for="item in [['12', 'Open tasks'], ['3', 'Needs review'], ['5', 'Stock alerts'], ['2', 'Customer tickets']]" :key="item[1]" class="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p class="text-2xl font-black text-white">{{ item[0] }}</p><p class="mt-1 text-xs text-white/55">{{ item[1] }}</p>
            </div>
          </div>
          <div class="mt-4 rounded-2xl bg-trovara-green/20 p-4"><p class="text-xs font-black uppercase tracking-wider text-green-200">Next action</p><p class="mt-2 text-sm font-semibold">Review the plantain field observation from Block C.</p></div>
        </div>
      </div>
    </section>

    <section id="modules" class="scroll-mt-24 bg-trovara-light py-16 md:py-24">
      <div class="container-trovara">
        <div class="max-w-3xl">
          <p class="section-subheading">One operating picture</p>
          <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-5xl">The farm record starts where the work happens.</h2>
          <p class="mt-4 leading-7 text-gray-500">Workers get simple screens. Supervisors get review queues. Managers get the records and exceptions they need to act.</p>
        </div>
        <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="module in modules" :key="module.title" class="rounded-3xl border border-gray-200 bg-white p-6 md:p-7">
            <BrandIcon :name="module.icon" class="h-11 w-11" />
            <h3 class="mt-5 text-xl font-black text-trovara-dark">{{ module.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-gray-500">{{ module.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16 md:py-24">
      <div class="container-trovara grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div>
          <p class="section-subheading">Role-aware by design</p>
          <h2 class="mt-3 text-3xl font-black text-trovara-dark md:text-4xl">Each person sees the work that belongs to them.</h2>
          <p class="mt-4 leading-7 text-gray-500">Permissions keep sensitive actions scoped. Onboarding and page help also change with the user’s role and selected language.</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div v-for="role in roles" :key="role[0]" class="rounded-2xl border border-gray-200 p-5">
            <h3 class="font-black text-trovara-dark">{{ role[0] }}</h3><p class="mt-2 text-sm leading-6 text-gray-500">{{ role[1] }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-trovara-green py-16 text-white md:py-20">
      <div class="container-trovara flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div><p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-gold">See it with your workflow</p><h2 class="mt-3 max-w-2xl text-3xl font-black md:text-4xl">Bring one farm problem. We will show how the system handles it.</h2></div>
        <RouterLink to="/contact?subject=farm-os" class="btn-gold shrink-0">Book a walkthrough</RouterLink>
      </div>
    </section>
  </div>
</template>
