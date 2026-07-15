import { defineStore } from 'pinia'
import { getAllTags, getCategories, getPostBySlug, getPublishedPosts } from '../content/posts'

export const useBlogStore = defineStore('blog', {
  getters: {
    publishedPosts: () => getPublishedPosts(),
    categories: () => getCategories(),
    allTags: () => getAllTags(),
    getPostBySlug: () => (slug: string) => getPostBySlug(slug),
  },
})
