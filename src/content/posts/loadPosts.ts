import type { BlogPost, BlogPostFrontmatter } from '../../types'
import { renderSafeMarkdown } from '../../lib/markdown'

const postFiles = import.meta.glob<string>('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

interface GeneratedJournalPost {
  slug?: unknown
  title?: unknown
  excerpt?: unknown
  author?: unknown
  publishedAt?: unknown
  category?: unknown
  tags?: unknown
  coverEmoji?: unknown
  coverImage?: unknown
  published?: unknown
  bodyMarkdown?: unknown
}

const generatedPostFiles = import.meta.glob<GeneratedJournalPost>('../generated-posts/*.json', {
  import: 'default',
  eager: true,
})

function slugFromPath(path: string): string {
  return path.replace('./', '').replace(/\.md$/, '')
}

function unquote(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '')
}

function parseFrontmatterYaml(yamlBlock: string): BlogPostFrontmatter {
  const data: BlogPostFrontmatter = {}
  let tags: string[] = []
  let inTags = false

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const listMatch = trimmed.match(/^- (.+)$/)
    if (listMatch && inTags) {
      tags.push(unquote(listMatch[1]))
      continue
    }

    const kvMatch = trimmed.match(/^([\w-]+):\s*(.*)$/)
    if (!kvMatch) continue

    const [, key, rawValue] = kvMatch

    if (key === 'tags') {
      inTags = true
      tags = []
      continue
    }

    if (inTags && tags.length) {
      data.tags = tags
      tags = []
      inTags = false
    }

    const value = unquote(rawValue)

    switch (key) {
      case 'title':
        data.title = value
        break
      case 'excerpt':
        data.excerpt = value
        break
      case 'author':
        data.author = value
        break
      case 'publishedAt':
        data.publishedAt = value
        break
      case 'category':
        data.category = value
        break
      case 'coverEmoji':
        data.coverEmoji = value
        break
      case 'coverImage':
        data.coverImage = value
        break
      case 'published':
        data.published = value === 'true'
        break
      case 'readTimeMinutes':
        data.readTimeMinutes = Number(value)
        break
    }
  }

  if (inTags && tags.length) {
    data.tags = tags
  }

  return data
}

function splitFrontmatter(raw: string): { data: BlogPostFrontmatter; content: string } {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const yamlBlock = raw.slice(4, end).trim()
  let content = raw.slice(end + 4)
  if (content.startsWith('\n')) content = content.slice(1)

  return {
    data: parseFrontmatterYaml(yamlBlock),
    content,
  }
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'false') return false
  if (value === 'true') return true
  return fallback
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function parsePost(path: string, raw: string): BlogPost | null {
  const slug = slugFromPath(path)
  if (slug.startsWith('_')) return null

  const { data, content } = splitFrontmatter(raw)
  const title = asString(data.title)
  if (!title) return null

  const markdown = content.trim()

  return {
    slug,
    title,
    excerpt: asString(data.excerpt),
    author: asString(data.author, 'Trovara Farm'),
    publishedAt: asString(data.publishedAt),
    category: asString(data.category, 'Farm Stories'),
    tags: asStringArray(data.tags),
    coverEmoji: asString(data.coverEmoji, 'sprout'),
    coverImage: asString(data.coverImage) || undefined,
    readTimeMinutes:
      typeof data.readTimeMinutes === 'number' && !Number.isNaN(data.readTimeMinutes)
        ? data.readTimeMinutes
        : estimateReadTime(markdown),
    published: asBoolean(data.published, true),
    html: renderSafeMarkdown(markdown),
  }
}

function parseGeneratedPost(raw: GeneratedJournalPost): BlogPost | null {
  const slug = asString(raw.slug)
  const title = asString(raw.title)
  const markdown = asString(raw.bodyMarkdown).trim()
  if (!slug || !title || !markdown) return null

  return {
    slug,
    title,
    excerpt: asString(raw.excerpt),
    author: asString(raw.author, 'Trovara Farm'),
    publishedAt: asString(raw.publishedAt),
    category: asString(raw.category, 'Farm Stories'),
    tags: asStringArray(raw.tags),
    coverEmoji: asString(raw.coverEmoji, 'sprout'),
    coverImage: asString(raw.coverImage) || undefined,
    readTimeMinutes: estimateReadTime(markdown),
    published: asBoolean(raw.published, true),
    html: renderSafeMarkdown(markdown),
  }
}

const repositoryPosts = Object.entries(postFiles)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((post): post is BlogPost => post !== null)

const osPosts = Object.values(generatedPostFiles)
  .map((raw) => parseGeneratedPost(raw))
  .filter((post): post is BlogPost => post !== null)

// OS-managed posts replace a repository post with the same slug during migration.
const postsBySlug = new Map(repositoryPosts.map((post) => [post.slug, post]))
for (const post of osPosts) postsBySlug.set(post.slug, post)

const allPosts: BlogPost[] = Array.from(postsBySlug.values())
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.published)
}

export function getPublishedPosts(): BlogPost[] {
  return allPosts.filter((p) => p.published)
}

export function getCategories(): string[] {
  return Array.from(new Set(getPublishedPosts().map((post) => post.category))).sort((a, b) =>
    a.localeCompare(b),
  )
}

export function getAllTags(): string[] {
  return Array.from(new Set(getPublishedPosts().flatMap((post) => post.tags))).sort((a, b) =>
    a.localeCompare(b),
  )
}
