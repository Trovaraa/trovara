import type { BlogPost } from '../../types'
import { visionBehindTrovara } from './vision-behind-trovara'

/**
 * All blog posts — add new posts here after creating a file in this folder.
 *
 * Required fields for each post:
 *   slug            URL path segment, e.g. "my-post" → /blog/my-post (lowercase, hyphens)
 *   title           Headline shown on the listing and post page
 *   excerpt         Short summary for cards and SEO (~1–2 sentences)
 *   author          Display name, e.g. "Trovara Farm Team"
 *   publishedAt     ISO date string, e.g. "2025-06-21"
 *   category        One primary category, e.g. "Farm Stories", "Recipes", "Harvest Updates"
 *   tags            Array of lowercase keywords for filtering
 *   coverEmoji      Placeholder visual until you add real cover images
 *   readTimeMinutes Estimated reading time in minutes
 *   published       Set false to hide a draft from the site
 *   content         Array of blocks: paragraph | heading | list | quote
 *
 * Content block types:
 *   { type: 'paragraph', text: '...' }
 *   { type: 'heading', text: '...' }
 *   { type: 'list', items: ['...', '...'] }
 *   { type: 'quote', text: '...', attribution?: '...' }
 */
export const allPosts: BlogPost[] = [
  visionBehindTrovara,
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.published)
}

export function getPublishedPosts(): BlogPost[] {
  return allPosts
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}
