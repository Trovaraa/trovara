<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import type { BlogBlock } from '../types'
import NewsletterSubscribe from '../components/ui/NewsletterSubscribe.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const post = computed(() => blogStore.getPostBySlug(route.params.slug as string))

watch(
  post,
  (p) => {
    if (route.params.slug && !p) {
      router.replace({ name: 'blog' })
      return
    }
    if (p) {
      document.title = `${p.title} — Trovara Farm`
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

function blockKey(block: BlogBlock, index: number) {
  return `${block.type}-${index}`
}
</script>

<template>
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

    <article class="py-16 md:py-20 bg-white">
      <div class="container-trovara max-w-3xl">
        <div class="text-7xl text-center mb-12">{{ post.coverEmoji }}</div>

        <div class="prose-trovara space-y-6">
          <template v-for="(block, index) in post.content" :key="blockKey(block, index)">
            <p
              v-if="block.type === 'paragraph'"
              class="text-gray-600 leading-relaxed text-lg"
            >
              {{ block.text }}
            </p>

            <h2
              v-else-if="block.type === 'heading'"
              class="text-2xl md:text-3xl font-bold text-trovara-dark pt-4"
            >
              {{ block.text }}
            </h2>

            <ul
              v-else-if="block.type === 'list'"
              class="space-y-3 pl-1"
            >
              <li
                v-for="item in block.items"
                :key="item"
                class="flex items-start gap-3 text-gray-600 leading-relaxed"
              >
                <span class="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-trovara-green" />
                {{ item }}
              </li>
            </ul>

            <blockquote
              v-else-if="block.type === 'quote'"
              class="border-l-4 border-trovara-gold pl-6 py-2 my-8"
            >
              <p class="text-xl font-medium text-trovara-dark italic leading-relaxed">
                "{{ block.text }}"
              </p>
              <footer v-if="block.attribution" class="text-sm text-gray-400 mt-3">
                — {{ block.attribution }}
              </footer>
            </blockquote>
          </template>
        </div>

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
</template>
