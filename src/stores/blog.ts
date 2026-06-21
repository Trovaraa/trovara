import { defineStore } from 'pinia'
import { getPostBySlug, getPublishedPosts } from '../content/posts'

export const useBlogStore = defineStore('blog', {
  getters: {
    publishedPosts: () => getPublishedPosts(),
    getPostBySlug: () => (slug: string) => getPostBySlug(slug),
  },
})
