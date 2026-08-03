<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'
import type { TeamMember } from '../types'

const selectedMember = ref<TeamMember | null>(null)

function openBio(member: TeamMember) {
  selectedMember.value = member
  document.body.style.overflow = 'hidden'
}

function closeBio() {
  selectedMember.value = null
  document.body.style.overflow = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedMember.value) closeBio()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})


const milestones = [
  {
    year: 'Our Beginning',
    title: 'One Regenerative Farm Plan',
    desc: 'Trovara began with 24 acres and a clear purpose: build a trusted food company around healthy soil, transparent production, and products people use every day.',
  },
  {
    year: 'Crop Establishment',
    title: 'Coconut & Plantain',
    desc: 'We established tropical crop lines for mature coconut (TRV-COC-PIECE) and green or ripe plantain (TRV-PLT-BUNCH), with first harvests forecast for plantain in March 2027 and coconut in June 2027.',
  },
  {
    year: 'Farm Diversification',
    title: 'Palm Oil, Chicken & Eggs',
    desc: 'We added traceable palm oil and designed pasture-raised chicken and egg production around open grass, animal welfare, and transparent handling. Palm oil and chicken target first supply in December 2026; eggs remain on waitlist until their first date is confirmed.',
  },
  {
    year: 'December 2026',
    title: 'First Supply Window',
    desc: 'Our roadmap targets first supplies of pasture-raised chicken and palm oil in December 2026, followed by plantain (March 2027) and coconut (June 2027). Eggs stay on the waitlist until availability is confirmed.',
  },
  {
    year: 'Today',
    title: 'Five Product Lines, One Standard',
    desc: 'Coconut, plantain, palm oil, pasture-raised chicken, and eggs are being built for traceable supply across Nigeria - with milk, chips, oil, flour, and other formats planned after first harvest.',
  },
]

const stats = [
  { value: '24', label: 'Acres in our farm plan', icon: 'land' },
  { value: '5',  label: 'Planned Product Lines', icon: 'harvest' },
  { value: '0',  label: 'Artificial Chemicals', icon: 'natural' },
  { value: '∞',  label: 'Passion for Quality', icon: 'quality' },
]

const team: TeamMember[] = [
  {
    initials: 'BA',
    name: 'Bamidele',
    roleShort: 'MD',
    role: 'Managing Director',
    bio: 'Provides strategic leadership across Trovara as it builds a trusted regenerative food company.',
    fullBio: [
      'Bamidele is the Managing Director of Trovara, providing strategic leadership across the business as it works to build a trusted, regenerative food company for Africa. He leads the development of the company\'s long-term vision, commercial strategy and operational growth while ensuring that every investment supports sustainable value creation.',
      'With a background in accounting, audit and corporate finance across Nigeria and the United Kingdom, Bamidele combines financial discipline with entrepreneurial thinking to build a resilient business rooted in transparency, innovation and responsible farming. He believes that trust is earned through consistently delivering food of exceptional quality while caring for the land, the people who produce it and the communities Trovara serves.',
    ],
    image: '/images/team/bamidele-afolabi.png',
    imagePosition: 'center 18%',
  },
  {
    initials: 'AA',
    name: 'Adefemi',
    roleShort: 'CTO',
    role: 'Chief Technology Officer',
    bio: 'Leads the technology behind Trovara, connecting farm operations, traceability, and customer experience.',
    fullBio: [
      'Adefemi is the Chief Technology Officer of Trovara, leading the technology strategy and systems that connect farm operations, traceability, customer ordering and day-to-day field work. A platform and cloud engineer with experience across software engineering, infrastructure automation and DevOps, he has built and operated systems using technologies including Kubernetes, Terraform, AWS, Azure and modern CI/CD platforms. His technology career spans Nigeria, Europe (including the Netherlands) and the United States.',
      'At Trovara, Adefemi works across the technology stack - from resilient cloud foundations, offline-friendly field tools and secure customer accounts to machine learning and AI capabilities that turn farm data into practical forecasts, advisory and automation. Drawing on formal training in data science, machine learning and artificial intelligence, as well as hands-on work building AI-powered software, he focuses on technology that solves real farming problems and strengthens trust from soil records to the plate.',
    ],
    image: '/images/team/adefemi-afuwape.png',
  },
  {
    initials: 'AY',
    name: 'Ayodeji',
    roleShort: 'COO',
    role: 'Chief Operating Officer',
    bio: 'Leads operational execution across the farm, supply chain, and wider business.',
    fullBio: [
      'Ayodeji is the Chief Operating Officer of Trovara, responsible for turning farm plans into reliable daily execution. He coordinates fieldwork, supply-chain readiness and the operating rhythms that keep crops, livestock and processing moving together.',
      'His work sits between strategy and the land: clear standards, accountable teams and practical systems that protect quality as Trovara grows. He is focused on building operations that can scale without losing the care, consistency and regenerative intent at the heart of the farm.',
    ],
  },
  {
    initials: 'SA',
    name: 'Samuel',
    roleShort: 'CGO',
    role: 'Chief Growth Officer',
    bio: 'Leads partnerships, market development, and the growth of Trovara’s customer reach.',
    fullBio: [
      'Samuel is the Chief Growth Officer of Trovara, leading partnerships, market development and the relationships that connect farm production to homes, kitchens and trade buyers. He helps shape how Trovara reaches customers across Nigeria as each harvest window opens.',
      'His focus is disciplined growth: clear offtake conversations, trusted wholesale relationships and customer experiences that match the promise of regenerative farming. He believes Trovara grows best when quality, transparency and long-term partnerships move together.',
    ],
    image: '/images/team/samuel-afolabi.png',
    imagePosition: 'center 18%',
  },
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
              Today, Trovara Farm is developing coconut, plantain, palm oil, chicken, and egg production
              within one regenerative plan. We are growing - adding new crops, expanding our reach, and building a brand that the world
              can trust.
            </p>
          </div>

          <!-- Visual Story Box -->
          <div class="space-y-6">
            <div class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <img
                src="/brand/trovara-social-card-v2.svg"
                alt="Trovara - Food you can trust from a farm built for tomorrow"
                class="w-full h-auto object-cover"
                width="1200"
                height="630"
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
            <BrandIcon name="target" class="w-12 h-12 mb-5 icon-on-dark" />
            <h3 class="text-2xl font-black mb-4">Our Mission</h3>
            <p class="text-white/80 leading-relaxed">
              Trovara creates trusted food products with traceability, lower waste and deeper customer connection.
            </p>
          </div>
          <div class="bg-trovara-light rounded-3xl p-8 lg:p-10">
            <BrandIcon name="world" class="w-12 h-12 mb-5" />
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <article
            v-for="member in team"
            :key="member.name"
            class="team-card bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              type="button"
              class="team-card__button w-full text-center outline-none focus-visible:ring-2 focus-visible:ring-trovara-green focus-visible:ring-offset-2 rounded-xl"
              :aria-label="`Read more about ${member.name}, ${member.role}`"
              @click="openBio(member)"
            >
              <div class="team-avatar mx-auto mb-4" aria-hidden="true">
                <div class="team-avatar__inner">
                  <div class="team-avatar__face team-avatar__front">
                    <img
                      v-if="member.image"
                      :src="member.image"
                      :alt="`${member.name}, ${member.role} at Trovara Farm`"
                      class="team-avatar__photo"
                      :style="{ objectPosition: member.imagePosition || 'center top' }"
                      width="112"
                      height="112"
                      loading="lazy"
                    />
                    <div v-else class="team-avatar__initials">
                      <span>{{ member.initials }}</span>
                    </div>
                  </div>
                  <div class="team-avatar__face team-avatar__back">
                    <img
                      src="/brand/trovara-monogram-tile-v1.svg"
                      alt=""
                      class="team-avatar__logo"
                      width="56"
                      height="56"
                    />
                  </div>
                </div>
              </div>
              <h3 class="team-card__name font-bold text-trovara-dark underline-offset-4">{{ member.name }}</h3>
              <p class="text-trovara-green text-sm font-medium mb-3" :title="member.role">{{ member.roleShort }}</p>
              <p class="text-gray-500 text-sm leading-relaxed">{{ member.bio }}</p>
              <span class="mt-4 inline-flex text-sm font-bold text-trovara-green">
                Read more →
              </span>
            </button>
          </article>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="selectedMember"
        class="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`team-bio-${selectedMember.name}`"
        @click.self="closeBio"
      >
        <div class="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-4">
              <img
                v-if="selectedMember.image"
                :src="selectedMember.image"
                :alt="selectedMember.name"
                class="h-16 w-16 rounded-full object-cover ring-4 ring-trovara-green/10"
                :style="{ objectPosition: selectedMember.imagePosition || 'center top' }"
                width="64"
                height="64"
              />
              <div v-else class="h-16 w-16 rounded-full bg-trovara-green flex items-center justify-center">
                <span class="text-trovara-gold font-black text-lg">{{ selectedMember.initials }}</span>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-green">Bio</p>
                <h3 :id="`team-bio-${selectedMember.name}`" class="mt-1 text-2xl font-black text-trovara-dark">
                  {{ selectedMember.name }}
                </h3>
                <p class="mt-1 text-sm font-semibold text-trovara-green">{{ selectedMember.role }}</p>
              </div>
            </div>
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 text-xl text-trovara-dark"
              aria-label="Close biography"
              @click="closeBio"
            >
              ×
            </button>
          </div>
          <div class="mt-6 space-y-4 border-t border-gray-100 pt-6">
            <p
              v-for="(paragraph, index) in selectedMember.fullBio"
              :key="index"
              class="text-sm leading-7 text-gray-600"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- CTA -->
    <section class="py-16 bg-trovara-dark text-white text-center">
      <div class="container-trovara max-w-2xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-black mb-4">Ready to work with us?</h2>
        <p class="text-white/60 mb-8">From waitlists and wholesale forecasts to distribution partnerships, we are building supply with buyers who plan ahead.</p>
        <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
          Contact Trovara Farm
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
.team-avatar {
  width: 7rem;
  height: 7rem;
  perspective: 1200px;
}

.team-avatar__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform-origin: center;
  will-change: transform;
}

.team-avatar__face {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 0 0 4px rgb(26 107 60 / 0.1);
  transition: box-shadow 0.45s ease;
}

.team-avatar__front {
  background: #edf7f1;
}

.team-avatar__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) brightness(0.75) contrast(1.25);
  transition: filter 0.45s ease;
}

.team-avatar__initials {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: #1a6b3c;
  color: #e8a427;
  font-size: 1.25rem;
  font-weight: 900;
}

.team-avatar__back {
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 30% 25%, rgb(232 164 39 / 0.28), transparent 55%),
    #1a6b3c;
  transform: rotateY(180deg);
}

.team-avatar__logo {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.9rem;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.22);
}

@keyframes team-avatar-spin {
  0% {
    transform: rotateY(0deg) scale(1);
  }

  42% {
    transform: rotateY(180deg) scale(1.06);
  }

  /* Hold the logo face briefly so the mid-spin read isn’t a blink. */
  58% {
    transform: rotateY(180deg) scale(1.06);
  }

  100% {
    transform: rotateY(360deg) scale(1);
  }
}

.team-card:hover .team-avatar__inner,
.team-card:focus-within .team-avatar__inner {
  animation: team-avatar-spin 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.team-card:hover .team-avatar__photo,
.team-card:focus-within .team-avatar__photo {
  filter: grayscale(0) brightness(1) contrast(1);
}

.team-card:hover .team-avatar__face,
.team-card:focus-within .team-avatar__face {
  box-shadow:
    0 0 0 4px rgb(26 107 60 / 0.18),
    0 12px 28px rgb(26 107 60 / 0.18);
}

.team-card:hover .team-card__name,
.team-card:focus-within .team-card__name {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .team-card:hover .team-avatar__inner,
  .team-card:focus-within .team-avatar__inner {
    animation: none;
  }

  .team-card:hover .team-avatar__photo,
  .team-card:focus-within .team-avatar__photo {
    filter: grayscale(0) brightness(1) contrast(1);
  }
}
</style>
