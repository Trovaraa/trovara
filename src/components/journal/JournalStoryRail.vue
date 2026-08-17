<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { JournalPost } from '../../types'
import { formatPublishedDate } from '../../lib/date'

const props = defineProps<{ posts: JournalPost[] }>()
const rail = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
let frame = 0

function updateActive() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const root = rail.value
    if (!root) return
    const cards = [...root.querySelectorAll<HTMLElement>('[data-story-card]')]
    if (!cards.length) return
    activeIndex.value = cards.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft - root.scrollLeft) < best.distance
          ? { index, distance: Math.abs(card.offsetLeft - root.scrollLeft) }
          : best,
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index
  })
}

async function goTo(index: number) {
  await nextTick()
  const root = rail.value
  const card = root?.querySelectorAll<HTMLElement>('[data-story-card]')[index]
  if (!root || !card) return
  root.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
  activeIndex.value = index
}

function previous() {
  goTo(Math.max(0, activeIndex.value - 1))
}

function next() {
  goTo(Math.min(props.posts.length - 1, activeIndex.value + 1))
}

onMounted(() => rail.value?.addEventListener('scroll', updateActive, { passive: true }))
onBeforeUnmount(() => {
  rail.value?.removeEventListener('scroll', updateActive)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section class="story-reel" aria-labelledby="story-reel-title">
    <div class="story-reel__heading">
      <div>
        <p class="section-subheading mb-2">Field stories</p>
        <h2 id="story-reel-title" class="text-3xl md:text-4xl font-black text-trovara-dark">Move through the latest chapter</h2>
        <p class="mt-3 max-w-2xl text-gray-600">Swipe, scroll, or use the arrows. The reel never moves without you.</p>
      </div>
      <div class="story-reel__buttons" aria-label="Story controls">
        <button type="button" aria-label="Previous story" :disabled="activeIndex === 0" @click="previous">←</button>
        <button type="button" aria-label="Next story" :disabled="activeIndex === posts.length - 1" @click="next">→</button>
      </div>
    </div>

    <div ref="rail" class="story-reel__track" tabindex="0" aria-label="Featured Journal stories">
      <article v-for="(post, index) in posts" :key="post.slug" data-story-card class="story-reel__card">
        <div class="story-reel__visual">
          <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" loading="lazy" />
          <div v-else class="story-reel__fallback" aria-hidden="true">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
          </div>
        </div>
        <div class="story-reel__copy">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-trovara-gold-dark">{{ post.category }}</p>
          <h3 class="mt-4 text-2xl font-black leading-tight text-trovara-dark md:text-4xl">{{ post.title }}</h3>
          <p class="mt-4 line-clamp-3 text-base leading-7 text-gray-600">{{ post.excerpt }}</p>
          <div class="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>{{ formatPublishedDate(post.publishedAt) }}</span><span aria-hidden="true">·</span><span>{{ post.readTimeMinutes }} min read</span>
          </div>
          <RouterLink :to="`/journal/${post.slug}`" class="btn-primary mt-7 inline-flex px-6 py-3 text-sm">Read this story <span aria-hidden="true">→</span></RouterLink>
        </div>
      </article>
    </div>

    <div class="story-reel__progress" role="group" aria-label="Choose a story">
      <button
        v-for="(post, index) in posts"
        :key="post.slug"
        type="button"
        :class="{ 'is-active': index === activeIndex }"
        :aria-label="`Show story ${index + 1}: ${post.title}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.story-reel { @apply overflow-hidden rounded-[2rem] bg-trovara-cream p-4 sm:p-7 md:p-10; }
.story-reel__heading { @apply mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between; }
.story-reel__buttons { @apply flex gap-2; }
.story-reel__buttons button { @apply grid h-12 w-12 place-items-center rounded-full border border-trovara-green/20 bg-white text-xl font-bold text-trovara-green transition hover:border-trovara-green hover:bg-trovara-light disabled:cursor-not-allowed disabled:opacity-30; }
.story-reel__track { @apply flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-trovara-green/20; scrollbar-width: none; }
.story-reel__track::-webkit-scrollbar { display: none; }
.story-reel__card { @apply grid min-w-full snap-start overflow-hidden rounded-3xl border border-trovara-green/10 bg-white shadow-sm md:grid-cols-[1.05fr_0.95fr]; }
.story-reel__visual { @apply min-h-64 bg-trovara-green md:min-h-[28rem]; }
.story-reel__visual img { @apply h-full w-full object-cover; }
.story-reel__fallback { @apply flex h-full min-h-64 items-end bg-gradient-to-br from-trovara-green to-trovara-dark p-8 text-white/20 md:min-h-[28rem]; }
.story-reel__fallback span { @apply text-8xl font-black; }
.story-reel__copy { @apply flex flex-col items-start justify-center p-6 sm:p-9 md:p-12; }
.story-reel__progress { @apply mt-5 flex items-center justify-center gap-2; }
.story-reel__progress button { @apply h-2.5 w-2.5 rounded-full bg-trovara-green/20 transition-all; }
.story-reel__progress button.is-active { @apply w-9 bg-trovara-green; }
@media (prefers-reduced-motion: reduce) {
  .story-reel__track { scroll-behavior: auto; }
  .story-reel__buttons button,
  .story-reel__progress button { transition: none; }
}
</style>
