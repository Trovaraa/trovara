import MarkdownIt from 'markdown-it'
import type { BlogPost, BlogPostFrontmatter } from '../../types'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const SITE_HOSTS = new Set(['trovara.farm', 'www.trovara.farm'])

function isExternalHttpLink(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false

  try {
    const { hostname } = new URL(href)
    return !SITE_HOSTS.has(hostname.toLowerCase())
  } catch {
    return false
  }
}

const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const href = tokens[idx].attrGet('href')
  if (href && isExternalHttpLink(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, _env, self)
}

const postFiles = import.meta.glob<string>('./*.md', {
  as: 'raw',
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
    coverEmoji: asString(data.coverEmoji, '🌿'),
    coverImage: asString(data.coverImage) || undefined,
    readTimeMinutes:
      typeof data.readTimeMinutes === 'number' && !Number.isNaN(data.readTimeMinutes)
        ? data.readTimeMinutes
        : estimateReadTime(markdown),
    published: asBoolean(data.published, true),
    html: md.render(markdown),
  }
}

const allPosts: BlogPost[] = Object.entries(postFiles)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((post): post is BlogPost => post !== null)
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
