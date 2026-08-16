import { defineStore } from 'pinia'
import { getAllTags, getCategories, getPostBySlug, getPublishedPosts } from '../content/posts'

export const useJournalStore = defineStore('journal', {
  getters: {
    publishedPosts: () => getPublishedPosts(),
    categories: () => getCategories(),
    allTags: () => getAllTags(),
    getPostBySlug: () => (slug: string) => getPostBySlug(slug),
  },
})
