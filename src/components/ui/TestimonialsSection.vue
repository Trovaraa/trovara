<script setup lang="ts">
import SectionHeader from './SectionHeader.vue'
import { testimonials } from '../../data/testimonials'

defineProps<{
  context?: 'home' | 'wholesale'
}>()
</script>

<template>
  <section class="py-20 md:py-24 bg-white border-t border-gray-100">
    <div class="container-trovara">
      <SectionHeader
        eyebrow="Testimonials"
        title="What partners say about Trovara"
        subtitle="Feedback from buyers, kitchen teams, and distribution partners."
      />

      <div v-if="testimonials.length > 0" class="grid md:grid-cols-2 gap-6 lg:gap-8">
        <article
          v-for="item in testimonials"
          :key="`${item.author}-${item.role}`"
          class="rounded-2xl border border-gray-100 bg-trovara-cream p-7 shadow-sm"
        >
          <p class="text-trovara-dark text-base leading-relaxed mb-4">"{{ item.quote }}"</p>
          <div>
            <p class="text-sm font-bold text-trovara-dark">{{ item.author }}</p>
            <p class="text-xs text-gray-500">
              {{ item.role }}<span v-if="item.company">, {{ item.company }}</span>
            </p>
          </div>
        </article>
      </div>

      <div
        v-else
        class="rounded-3xl bg-trovara-light border border-gray-100 px-8 py-10 md:px-12 md:py-12 text-center"
      >
        <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-3">
          Partner with us
        </p>
        <h3 class="text-2xl md:text-3xl font-black text-trovara-dark mb-3">
          Be among our first featured wholesale success stories
        </h3>
        <p class="text-sm text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          We are onboarding procurement teams and retail buyers who value consistent quality and
          clear supply coordination.
        </p>
        <RouterLink
          :to="context === 'wholesale' ? '/contact?subject=bulk-order' : '/contact'"
          class="btn-primary px-8 py-4 text-base"
        >
          Partner with us
        </RouterLink>
      </div>
    </div>
  </section>
</template>
