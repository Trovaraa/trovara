<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBlogStore } from '../stores/blog'
import SectionHeader from '../components/ui/SectionHeader.vue'
import BlogCard from '../components/ui/BlogCard.vue'
import NewsletterSubscribe from '../components/ui/NewsletterSubscribe.vue'

const blogStore = useBlogStore()
const posts = computed(() => blogStore.publishedPosts)
const selectedCategory = ref('All')
const selectedTag = ref('All')
const categories = computed(() => ['All', ...blogStore.categories])
const tags = computed(() => ['All', ...blogStore.allTags])

const filteredPosts = computed(() =>
  posts.value.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'All' || post.category === selectedCategory.value
    const matchesTag = selectedTag.value === 'All' || post.tags.includes(selectedTag.value)
    return matchesCategory && matchesTag
  }),
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

    <section class="py-20 md:py-28 bg-white">
      <div class="container-trovara">
        <SectionHeader
          eyebrow="Latest Posts"
          title="The Trovara blog"
          subtitle="New posts appear here as we share from the farm. Subscribe below so you never miss one."
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

        <div v-if="filteredPosts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
        </div>

        <div
          v-else
          class="text-center py-16 px-8 bg-trovara-light rounded-2xl border border-trovara-green/10"
        >
          <p class="text-4xl mb-4">🌱</p>
          <p class="text-trovara-dark font-bold text-lg mb-2">First posts coming soon</p>
          <p class="text-gray-500 text-sm max-w-md mx-auto">
            We are preparing stories from the field. Subscribe to be notified when they go live.
          </p>
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-trovara-cream border-t border-trovara-green/10">
      <div class="container-trovara">
        <div class="max-w-2xl mx-auto">
          <NewsletterSubscribe
            variant="inline"
            title="Never miss a post"
            description="Get farm updates, new blog posts, and harvest news delivered to your inbox."
          />
        </div>
      </div>
    </section>
  </div>
</template>
