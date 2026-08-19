<script setup lang="ts">
import { computed, ref } from 'vue'
import { useJournalStore } from '../stores/journal'
import SectionHeader from '../components/ui/SectionHeader.vue'
import JournalCard from '../components/ui/JournalCard.vue'
import NewsletterSubscribe from '../components/ui/NewsletterSubscribe.vue'
import BrandIcon from '../components/brand/BrandIcon.vue'
import JournalStoryRail from '../components/journal/JournalStoryRail.vue'

const journalStore = useJournalStore()
const posts = computed(() => journalStore.publishedPosts)
const selectedCategory = ref('All')
const selectedTag = ref('All')
const categories = computed(() => ['All', ...journalStore.categories])
const tags = computed(() => ['All', ...journalStore.allTags])
const featuredPosts = computed(() => posts.value.slice(0, 4))
const filtersAreClear = computed(
  () => selectedCategory.value === 'All' && selectedTag.value === 'All',
)

const filteredPosts = computed(() =>
  posts.value.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'All' || post.category === selectedCategory.value
    const matchesTag = selectedTag.value === 'All' || post.tags.includes(selectedTag.value)
    return matchesCategory && matchesTag
  }),
)
const gridPosts = computed(() =>
  filtersAreClear.value ? filteredPosts.value.slice(featuredPosts.value.length) : filteredPosts.value,
)
</script>

<template>
  <div>
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10">
        <div class="max-w-3xl">
          <p class="section-subheading text-trovara-gold-300 mb-4">From the Field</p>
          <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
            Stories, harvests,<br /> and what we are learning.
          </h1>
          <p class="text-white/70 text-lg leading-relaxed max-w-xl">
            Field notes, recipes, and updates from Trovara Farm - honest stories from the people
            growing your food.
          </p>
          <a
            href="/feed.xml"
            class="inline-flex items-center gap-2 mt-6 text-trovara-gold-300 hover:text-trovara-gold text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 10.1V10.1Z"/>
            </svg>
            Subscribe via RSS
          </a>
        </div>
      </div>
    </section>

    <section v-if="featuredPosts.length && filtersAreClear" class="py-14 md:py-20 bg-white">
      <div class="container-trovara">
        <JournalStoryRail :posts="featuredPosts" />
      </div>
    </section>

    <section class="py-16 md:py-24 bg-white" :class="featuredPosts.length && filtersAreClear ? 'border-t border-gray-100' : ''">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="The archive"
          :title="filtersAreClear ? 'More from the Trovara journal' : 'Stories that match'"
          subtitle="Browse by subject, or use a tag when you are looking for something specific."
        />

        <div class="mb-10 space-y-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="px-4 py-2 rounded-full border text-sm font-medium transition-colors"
              :class="
                selectedCategory === category
                  ? 'bg-trovara-green text-white border-trovara-green'
                  : 'bg-white text-trovara-green border-trovara-green/30 hover:border-trovara-green'
              "
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <label class="inline-flex items-center gap-2 text-sm text-gray-600">
            <span>Filter by tag</span>
            <select
              v-model="selectedTag"
              class="px-3 py-2 rounded-lg border border-trovara-green/30 text-trovara-dark bg-white focus:outline-none focus:ring-2 focus:ring-trovara-green/30"
            >
              <option v-for="tag in tags" :key="tag" :value="tag">
                {{ tag === 'All' ? 'All tags' : `#${tag}` }}
              </option>
            </select>
          </label>
        </div>

        <div v-if="gridPosts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <JournalCard v-for="post in gridPosts" :key="post.slug" :post="post" />
        </div>

        <div
          v-else-if="filteredPosts.length && filtersAreClear"
          class="rounded-2xl border border-trovara-green/10 bg-trovara-light px-6 py-8 text-center"
        >
          <p class="font-bold text-trovara-dark">You are caught up.</p>
          <p class="mt-2 text-sm text-gray-500">The latest stories are in the reel above.</p>
        </div>

        <div
          v-else-if="!filteredPosts.length"
          class="text-center py-16 px-8 bg-trovara-light rounded-2xl border border-trovara-green/10"
        >
          <BrandIcon name="sprout" class="w-12 h-12 mx-auto mb-4" />
          <p class="text-trovara-dark font-bold text-lg mb-2">
            {{ posts.length ? 'No posts match these filters' : 'First posts coming soon' }}
          </p>
          <p class="text-gray-500 text-sm max-w-md mx-auto">
            {{
              posts.length
                ? 'Try another category or tag, or clear filters to see all journal posts.'
                : 'We are preparing stories from the field. Subscribe to be notified when they go live.'
            }}
          </p>
          <button
            v-if="posts.length"
            type="button"
            class="btn-primary mt-6 px-6 py-3 text-sm"
            @click="selectedCategory = 'All'; selectedTag = 'All'"
          >
            Clear filters
          </button>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-trovara-cream border-t border-trovara-green/10">
      <div class="container-trovara">
        <div class="max-w-2xl mx-auto">
          <NewsletterSubscribe
            variant="inline"
            title="Journal and harvest updates"
            description="Get new Trovara Journal stories and harvest news in one email subscription."
          />
        </div>
      </div>
    </section>
  </div>
</template>
