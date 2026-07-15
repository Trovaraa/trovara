<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import BlogCard from '../components/ui/BlogCard.vue'
import NewsletterSubscribe from '../components/ui/NewsletterSubscribe.vue'
import StructuredData from '../components/StructuredData.vue'
import { applyPageMeta } from '../composables/usePageMeta'

const BASE_URL = 'https://trovara.farm'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const post = computed(() => blogStore.getPostBySlug(route.params.slug as string))
const relatedPosts = computed(() => {
  if (!post.value) return []
  return blogStore.publishedPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.value?.slug && candidate.category === post.value?.category,
    )
    .slice(0, 2)
})

const articleSchema = computed(() => {
  if (!post.value) return undefined
  const p = post.value
  return {
    '@type': 'Article',
    headline: p.title,
    description: p.excerpt,
    author: { '@type': 'Organization', name: p.author },
    datePublished: p.publishedAt,
    image: p.coverImage ? `${BASE_URL}${p.coverImage}` : `${BASE_URL}/images/trovara-brand.png`,
    publisher: {
      '@type': 'Organization',
      name: 'Trovara Farm',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/trovara-brand.png` },
    },
    mainEntityOfPage: `${BASE_URL}/blog/${p.slug}`,
  }
})

watch(
  post,
  (p) => {
    if (route.params.slug && !p) {
      router.replace({ name: 'blog' })
      return
    }
    if (p) {
      applyPageMeta(route, {
        title: `${p.title} - Trovara Farm`,
        description: p.excerpt,
        canonicalPath: `/blog/${p.slug}`,
        ogImage: p.coverImage ? `${BASE_URL}${p.coverImage}` : `${BASE_URL}/images/trovara-brand.png`,
      })
    }
  },
  { immediate: true },
)

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <StructuredData v-if="post" :additional-schema="articleSchema">
  <div v-if="post">
    <section class="pt-32 pb-16 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 max-w-3xl">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-trovara-gold-300 hover:text-trovara-gold text-sm font-medium mb-8 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to blog
        </RouterLink>

        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span class="px-3 py-1 bg-white/10 text-trovara-gold-300 text-xs font-semibold rounded-full">
            {{ post.category }}
          </span>
          <span class="text-white/50 text-sm">{{ formatDate(post.publishedAt) }}</span>
          <span class="text-white/50 text-sm">·</span>
          <span class="text-white/50 text-sm">{{ post.readTimeMinutes }} min read</span>
        </div>

        <h1 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          {{ post.title }}
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          {{ post.excerpt }}
        </p>
        <p class="text-white/50 text-sm mt-6">By {{ post.author }}</p>
      </div>
    </section>

    <div v-if="post.coverImage" class="bg-white pb-2 md:pb-0">
      <div class="container-trovara max-w-4xl">
        <div class="relative -mt-8 md:-mt-12 rounded-2xl overflow-hidden shadow-lg aspect-[16/9]">
          <img
            :src="post.coverImage"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <article class="py-12 md:py-16 bg-white">
      <div class="container-trovara max-w-3xl">
        <div class="blog-content" v-html="post.html" />

        <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-3 py-1 bg-trovara-light text-trovara-green text-xs font-medium rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </article>

    <section v-if="relatedPosts.length" class="py-16 md:py-20 bg-white border-t border-gray-100">
      <div class="container-trovara">
        <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-8">Related posts</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <BlogCard v-for="relatedPost in relatedPosts" :key="relatedPost.slug" :post="relatedPost" />
        </div>
      </div>
    </section>

    <section class="py-20 md:py-24 bg-trovara-cream border-t border-trovara-green/10">
      <div class="container-trovara">
        <div class="max-w-2xl mx-auto">
          <NewsletterSubscribe
            variant="inline"
            title="Enjoyed this story?"
            description="Subscribe for more field notes, recipes, and harvest updates from Trovara Farm."
          />
        </div>
      </div>
    </section>
  </div>
  </StructuredData>
</template>
