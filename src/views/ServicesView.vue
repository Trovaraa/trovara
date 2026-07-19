<script setup lang="ts">
import SectionHeader from '../components/ui/SectionHeader.vue'

type Service = {
  icon: string
  title: string
  meaning?: string
  desc: string
  deliverables: string[]
  featured?: boolean
}

const services: Service[] = [
  {
    icon: '🖥️',
    title: 'Trovara Farm OS',
    meaning: 'Operations System',
    featured: true,
    desc: 'The digital command center we run our own farm on - now available to yours. Trovara Farm OS (Operations System) brings daily tasks, field teams, inventory, harvest records, and sales into one place so managers see the farm clearly and workers know exactly what to do. Built for operational excellence in the field, not desk software that never leaves the office.',
    deliverables: [
      'Installable farm operations app (web + Home Screen PWA)',
      'Task assignment, field completion, and supervisor approval',
      'Crop, livestock, inventory, and zone/block records',
      'Offline-friendly field capture with sync when connected',
      'Telegram butler for staff updates and customer ordering',
      'Setup, training, and ongoing operating support',
    ],
  },
  {
    icon: '🗺️',
    title: 'Farm Setup & Development',
    desc: 'Starting a farm from scratch? We guide you from land assessment and layout design to infrastructure setup, equipment sourcing, and first planting. We help you build a farm that is productive from day one.',
    deliverables: [
      'Land suitability assessment',
      'Farm layout and zoning plan',
      'Infrastructure design (fencing, roads, storage)',
      'Equipment and input sourcing support',
      'First-season planting plan',
    ],
  },
  {
    icon: '🌱',
    title: 'Crop Planning & Variety Selection',
    desc: 'Choosing the right crop and the right variety for your soil, climate, and market is the most important decision a farmer makes. We help you make it with data, not guesswork.',
    deliverables: [
      'Soil and climate analysis',
      'Crop suitability mapping',
      'Variety selection for yield and market fit',
      'Intercropping and rotation strategies',
      'Seasonal planting calendar',
    ],
  },
  {
    icon: '🧪',
    title: 'Soil Health & Management Advisory',
    desc: 'Healthy soil is the foundation of every great farm. We provide soil testing, interpretation, and organic soil management plans that build long-term fertility without synthetic inputs.',
    deliverables: [
      'Soil sampling and laboratory testing',
      'Nutrient deficiency diagnosis',
      'Organic amendment recommendations',
      'Composting and mulching programs',
      'Long-term soil health roadmap',
    ],
  },
  {
    icon: '💧',
    title: 'Irrigation System Design',
    desc: 'Water is life on a farm. We design efficient, low-cost irrigation systems tailored to your crop, land size, and water source - from simple gravity-fed systems to drip irrigation setups.',
    deliverables: [
      'Water source assessment',
      'Irrigation system design and layout',
      'Drip, sprinkler, and furrow options',
      'Water scheduling for crop stages',
      'Installation supervision and training',
    ],
  },
  {
    icon: '🐛',
    title: 'Pest & Disease Management',
    desc: 'Crop losses from pests and disease can devastate a season. We provide integrated pest management (IPM) plans that protect your crops using biological, cultural, and minimal-chemical approaches.',
    deliverables: [
      'Pest and disease identification',
      'Integrated pest management (IPM) plan',
      'Biological control options',
      'Safe, compliant pesticide protocols',
      'Seasonal monitoring schedules',
    ],
  },
  {
    icon: '📦',
    title: 'Post-Harvest Handling & Storage',
    desc: 'Quality starts at the harvest and ends at the market. Poor post-harvest handling destroys value. We help you set up the right storage, grading, and packaging systems to preserve quality and extend shelf life.',
    deliverables: [
      'Harvest timing and technique guidance',
      'Grading and sorting standards',
      'Storage facility design and setup',
      'Packaging specification for local and export',
      'Cold chain and transport advisory',
    ],
  },
  {
    icon: '🎓',
    title: 'Farm Management Training',
    desc: 'We train farmers, farm managers, and agribusiness staff in modern, sustainable farming practices. Training is hands-on, practical, and delivered on-site at your farm.',
    deliverables: [
      'Crop production and management training',
      'Free-range noilers & hens management and animal welfare',
      'Record-keeping and farm data management',
      'Financial literacy for farm businesses',
      'Group and individual training sessions',
    ],
  },
  {
    icon: '🌍',
    title: 'Market Linkage & Export Support',
    desc: 'Growing great produce is only half the job - getting it to the right buyer at the right price is the other half. We connect farmers and agribusinesses to local buyers, regional markets, and export channels.',
    deliverables: [
      'Buyer identification and introduction',
      'Export documentation and compliance support',
      'Pricing strategy and negotiation guidance',
      'Produce quality certification advisory',
      'Partnership facilitation with processors and retailers',
    ],
  },
]

const process = [
  { step: '01', title: 'Initial Consultation', desc: 'We begin with a free consultation to understand your farm, your goals, and your challenges.' },
  { step: '02', title: 'Site Assessment', desc: 'Our team visits your farm to assess land, soil, water, infrastructure, and current operations.' },
  { step: '03', title: 'Custom Plan', desc: 'We deliver a tailored service plan with clear timelines, deliverables, and expected outcomes.' },
  { step: '04', title: 'Implementation', desc: 'We work alongside you to implement the plan - hands-on, practical, and results-focused.' },
  { step: '05', title: 'Follow-Up Support', desc: 'Our relationship doesn\'t end at delivery. We provide ongoing check-ins and adjustments as your farm evolves.' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300 mb-4">Ancillary Services</p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            We help other farms<br/>grow as well as ours.
          </h1>
          <p class="text-white/70 text-lg leading-relaxed max-w-xl">
            From hands-on farm advisory to Trovara Farm OS - our Operations System for day-to-day
            farm command - the expertise we've built growing coconuts, plantains, and free-range
            dressed noilers & mature hens is available to you. Whether you're building a new farm
            or running a better one, we walk the land with you.
          </p>
          <div class="flex flex-wrap gap-4 mt-10">
            <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
              Request a Consultation
            </RouterLink>
            <a
              href="#services"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
            >
              View All Services
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Us Strip -->
    <section class="py-12 bg-trovara-gold">
      <div class="container-trovara">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div v-for="item in [
            { icon: '🌾', label: 'Hands-on experience, not just theory' },
            { icon: '📍', label: 'On-site, in-field advisory' },
            { icon: '🤝', label: 'Tailored to your specific farm' },
            { icon: '🌱', label: 'Sustainable, chemical-minimal approach' },
          ]" :key="item.label">
            <div class="text-3xl mb-2">{{ item.icon }}</div>
            <p class="text-trovara-dark font-semibold text-sm leading-snug">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section id="services" class="py-20 md:py-28 bg-trovara-cream scroll-mt-20">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="What We Offer"
          title="Farm development and Farm OS - built from real farming."
          subtitle="Every service we offer comes from hard-won experience on our own land. We don't advise what we haven't done ourselves - including the Operations System that runs Trovara Farm."
          center
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div
            v-for="service in services"
            :key="service.title"
            class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group"
            :class="service.featured ? 'md:col-span-2 border border-trovara-green/20 bg-gradient-to-br from-white to-trovara-green/[0.04]' : ''"
          >
            <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div class="text-4xl group-hover:scale-110 transition-transform duration-300">
                {{ service.icon }}
              </div>
              <span
                v-if="service.featured"
                class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-trovara-green text-white"
              >
                Featured
              </span>
            </div>
            <h3 class="text-xl font-black text-trovara-dark mb-1">{{ service.title }}</h3>
            <p
              v-if="service.meaning"
              class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-3"
            >
              {{ service.meaning }}
            </p>
            <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ service.desc }}</p>

            <div class="border-t border-gray-100 pt-5">
              <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-3">What's included</p>
              <ul class="space-y-2">
                <li
                  v-for="d in service.deliverables"
                  :key="d"
                  class="flex items-start gap-2.5 text-sm text-trovara-dark"
                >
                  <span class="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-trovara-green/10 text-trovara-green flex items-center justify-center text-[10px] font-black">✓</span>
                  {{ d }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Work -->
    <section class="py-20 md:py-28 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <SectionHeader
          eyebrow="How We Work"
          title="Our process is as straightforward as good farming."
          light
          center
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          <div
            v-for="step in process"
            :key="step.step"
            class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-white text-center hover:bg-white/20 transition-all duration-300"
          >
            <div class="text-3xl font-black text-trovara-gold mb-3">{{ step.step }}</div>
            <h4 class="font-bold text-base mb-2">{{ step.title }}</h4>
            <p class="text-white/65 text-xs leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Note -->
    <section class="py-20 bg-white">
      <div class="container-trovara max-w-4xl mx-auto">
        <div class="grid md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <SectionHeader
              eyebrow="Pricing"
              title="Transparent, fair, and tailored."
            />
            <p class="text-gray-500 leading-relaxed mb-4">
              We don't offer one-size-fits-all pricing because no two farms are the same.
              After your initial consultation, we provide a clear, itemised quote based on
              your farm size, service scope, and location. There are no hidden fees.
            </p>
            <p class="text-gray-500 leading-relaxed mb-8">
              We also offer package deals for farms that need multiple services - for example,
              combining Farm OS setup with soil advisory, crop planning, and irrigation design
              at a bundled rate.
            </p>
            <RouterLink to="/contact" class="btn-primary px-8 py-4 text-base">
              Get a Free Quote
            </RouterLink>
          </div>
          <div class="space-y-4">
            <div class="bg-trovara-light rounded-2xl p-6">
              <div class="text-3xl mb-3">🆓</div>
              <h4 class="font-bold text-trovara-dark mb-1">Free Initial Consultation</h4>
              <p class="text-gray-500 text-sm">Every engagement starts with a no-cost, no-obligation conversation.</p>
            </div>
            <div class="bg-trovara-green rounded-2xl p-6 text-white">
              <div class="text-3xl mb-3">📋</div>
              <h4 class="font-bold mb-1">Clear, Written Scope</h4>
              <p class="text-white/70 text-sm">You'll always know exactly what you're getting before any work begins.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-trovara-dark text-white text-center">
      <div class="container-trovara max-w-2xl mx-auto">
        <div class="text-5xl mb-6">🌾</div>
        <h2 class="text-3xl md:text-4xl font-black mb-4">
          Ready to build a better farm?
        </h2>
        <p class="text-white/60 text-lg mb-10 leading-relaxed">
          Talk to our team. The first conversation is free, and it might be the most
          valuable one you have this farming season.
        </p>
        <RouterLink to="/contact" class="btn-gold text-base px-10 py-4">
          Book a Free Consultation
        </RouterLink>
      </div>
    </section>

  </div>
</template>
