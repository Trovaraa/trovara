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
  <article class="card group h-full flex flex-col overflow-hidden">
    <RouterLink :to="`/blog/${post.slug}`" class="flex flex-col h-full">
      <div class="relative aspect-[16/10] overflow-hidden bg-trovara-light">
        <img
          v-if="post.coverImage"
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-trovara-light to-trovara-green/10"
          aria-hidden="true"
        >
          {{ post.coverEmoji }}
        </div>
        <span class="absolute top-4 left-4 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-trovara-green text-xs font-semibold rounded-full shadow-sm">
          {{ post.category }}
        </span>
      </div>

      <div class="px-6 py-5 flex flex-col flex-1">
        <h3 class="text-lg font-bold text-trovara-dark mb-2 group-hover:text-trovara-green transition-colors line-clamp-2">
          {{ post.title }}
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {{ post.excerpt }}
        </p>
        <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{{ formatDate(post.publishedAt) }}</span>
          <span>{{ post.readTimeMinutes }} min read</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
