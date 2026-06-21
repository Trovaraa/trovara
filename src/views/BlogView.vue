<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '../stores/blog'
import SectionHeader from '../components/ui/SectionHeader.vue'
import BlogCard from '../components/ui/BlogCard.vue'
import NewsletterSubscribe from '../components/ui/NewsletterSubscribe.vue'

const blogStore = useBlogStore()
const posts = computed(() => blogStore.publishedPosts)
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
            Field notes, recipes, and updates from Trovara Farm — honest stories from the people
            growing your food.
          </p>
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

        <div v-if="posts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard v-for="post in posts" :key="post.slug" :post="post" />
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
