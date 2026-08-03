import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const API_URL = process.env.JOURNAL_API_URL?.replace(/\/+$/, '')
const GENERATED_POSTS_DIR = path.resolve(process.cwd(), 'src/content/generated-posts')
const GENERATED_MEDIA_DIR = path.resolve(process.cwd(), 'public/images/journal-generated')
const MAX_COVER_BYTES = 5 * 1024 * 1024

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

function safeSlug(value) {
  const slug = asString(value).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Journal API returned an invalid slug: ${JSON.stringify(value)}`)
  }
  return slug
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) {
    throw new Error(`Journal request failed (${response.status}) for ${url}`)
  }
  return response.json()
}

function coverExtension(contentType) {
  if (contentType === 'image/jpeg') return 'jpg'
  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'
  return null
}

async function downloadCover(rawUrl, slug) {
  if (!rawUrl) return undefined

  const sourceUrl = new URL(rawUrl, API_URL).toString()
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) {
    throw new Error(`Journal cover request failed (${response.status}) for ${slug}`)
  }

  const extension = coverExtension(response.headers.get('content-type')?.split(';')[0])
  if (!extension) {
    throw new Error(`Journal cover for ${slug} is not JPEG, PNG, or WebP`)
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength > MAX_COVER_BYTES) {
    throw new Error(`Journal cover for ${slug} exceeds 5 MB`)
  }

  const fileName = `${slug}.${extension}`
  await fs.writeFile(path.join(GENERATED_MEDIA_DIR, fileName), bytes)
  return `/images/journal-generated/${fileName}`
}

function normalizePost(raw, coverImage) {
  const post = asObject(raw)
  if (!post) throw new Error('Journal API returned an invalid post')

  const slug = safeSlug(post.slug)
  const title = asString(post.title).trim()
  const bodyMarkdown = asString(post.bodyMarkdown).trim()
  if (!title || !bodyMarkdown) {
    throw new Error(`Journal post ${slug} is missing a title or body`)
  }

  return {
    slug,
    title,
    excerpt: asString(post.excerpt),
    author: asString(post.authorName, 'Trovara Farm'),
    publishedAt: asString(post.publishedAt),
    category: asString(post.category, 'Farm Stories'),
    tags: asStringArray(post.tags),
    coverEmoji: 'sprout',
    coverImage,
    published: true,
    bodyMarkdown,
  }
}

async function main() {
  if (!API_URL) {
    console.log('JOURNAL_API_URL is not set; using repository Journal posts only.')
    return
  }

  const listPayload = asObject(await fetchJson(API_URL))
  const summaries = Array.isArray(listPayload?.posts) ? listPayload.posts : []

  const detailedPosts = await Promise.all(
    summaries.map(async (summary) => {
      const slug = safeSlug(asObject(summary)?.slug)
      const detailPayload = asObject(await fetchJson(`${API_URL}/${encodeURIComponent(slug)}`))
      return asObject(detailPayload?.post) ?? detailPayload
    }),
  )

  await Promise.all([
    fs.rm(GENERATED_POSTS_DIR, { recursive: true, force: true }),
    fs.rm(GENERATED_MEDIA_DIR, { recursive: true, force: true }),
  ])
  await Promise.all([
    fs.mkdir(GENERATED_POSTS_DIR, { recursive: true }),
    fs.mkdir(GENERATED_MEDIA_DIR, { recursive: true }),
  ])

  for (const rawPost of detailedPosts) {
    const post = asObject(rawPost)
    const slug = safeSlug(post?.slug)
    const coverImage = await downloadCover(asString(post?.coverImageUrl), slug)
    const normalized = normalizePost(post, coverImage)
    await fs.writeFile(
      path.join(GENERATED_POSTS_DIR, `${slug}.json`),
      `${JSON.stringify(normalized, null, 2)}\n`,
      'utf8',
    )
  }

  console.log(`Synced ${detailedPosts.length} published Journal posts from Trovara OS.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
