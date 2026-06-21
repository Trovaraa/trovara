<script setup lang="ts">
import type { BlogPost } from '../../types'

defineProps<{ post: BlogPost }>()

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <article class="card group h-full flex flex-col">
    <RouterLink :to="`/blog/${post.slug}`" class="flex flex-col h-full">
      <div class="relative px-8 pt-10 pb-6 flex flex-col items-center text-center bg-trovara-light">
        <div class="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {{ post.coverEmoji }}
        </div>
        <span class="absolute top-4 left-4 px-2.5 py-1 bg-trovara-green/10 text-trovara-green text-xs font-semibold rounded-full">
          {{ post.category }}
        </span>
        <h3 class="text-xl font-bold text-trovara-dark mb-2 group-hover:text-trovara-green transition-colors">
          {{ post.title }}
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {{ post.excerpt }}
        </p>
      </div>

      <div class="px-8 py-5 mt-auto border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>{{ formatDate(post.publishedAt) }}</span>
        <span>{{ post.readTimeMinutes }} min read</span>
      </div>
    </RouterLink>
  </article>
</template>
