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
        v-if="testimonials.length > 0"
        eyebrow="Testimonials"
        title="What partners say about Trovara"
        subtitle="Feedback from buyers, kitchen teams, and distribution partners."
      />
      <SectionHeader
        v-else
        eyebrow="Supply planning"
        title="Planning with buyers before first harvest"
        subtitle="We are setting volume, formats, and delivery expectations now so the first supply agreements are workable on both sides."
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
        <p class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-3">How it starts</p>
        <h3 class="text-2xl md:text-3xl font-black text-trovara-dark mb-3">
          Share the product and volume you need
        </h3>
        <p class="text-sm text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          We will confirm the planned SKU, packaging, minimum order, forecast window, and delivery assumptions before either side commits.
        </p>
        <RouterLink
          :to="context === 'wholesale' ? '/contact?subject=bulk-order' : '/contact'"
          class="btn-primary px-8 py-4 text-base"
        >
          Start a supply conversation
        </RouterLink>
      </div>
    </div>
  </section>
</template>
