import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { buildSitemapXml } from './seo-utils.mjs'

const BASE_URL = 'https://trovara.farm'
const POSTS_DIR = path.resolve(process.cwd(), 'src/content/posts')
const GENERATED_POSTS_DIR = path.resolve(process.cwd(), 'src/content/generated-posts')
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const SITEMAP_PATH = path.resolve(PUBLIC_DIR, 'sitemap.xml')
const FEED_PATH = path.resolve(PUBLIC_DIR, 'feed.xml')
const SEO_PAGES_PATH = path.resolve(PUBLIC_DIR, 'seo-pages.json')
const CAREERS_API_URL =
  process.env.CAREERS_API_URL || 'https://os.trovara.farm/public/careers'

const STATIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/shop',
  '/products/coconut',
  '/products/plantain',
  '/products/poultry',
  '/products/eggs',
  '/products/palm-oil',
  '/farm',
  '/services',
  '/faq',
  '/journal',
  '/moments',
  '/careers',
  '/contact',
  '/survey',
  '/wholesale',
  '/wholesale/one-pager',
  '/privacy',
  '/terms',
]

function unquote(value) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function parseFrontmatterYaml(yamlBlock) {
  const data = {}
  let tags = []
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
      case 'excerpt':
      case 'publishedAt':
        data[key] = value
        break
      case 'published':
        data.published = value === 'true'
        break
    }
  }

  if (inTags && tags.length) {
    data.tags = tags
  }

  return data
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, content: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }

  const yamlBlock = raw.slice(4, end).trim()
  let content = raw.slice(end + 4)
  if (content.startsWith('\n')) content = content.slice(1)

  return {
    data: parseFrontmatterYaml(yamlBlock),
    content,
  }
}

async function readPublishedPosts() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true })
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== '_template.md')
    .map((entry) => entry.name)

  const posts = []

  for (const fileName of markdownFiles) {
    const slug = fileName.replace(/\.md$/, '')
    if (slug.startsWith('_')) continue

    const filePath = path.resolve(POSTS_DIR, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const { data } = splitFrontmatter(raw)

    if (data.published === false) continue

    posts.push({
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      publishedAt: data.publishedAt || '',
    })
  }

  let generatedEntries = []
  try {
    generatedEntries = await fs.readdir(GENERATED_POSTS_DIR, { withFileTypes: true })
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  for (const entry of generatedEntries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue
    const raw = await fs.readFile(path.join(GENERATED_POSTS_DIR, entry.name), 'utf8')
    const post = JSON.parse(raw)
    if (!post.published || !post.slug || !post.title) continue
    posts.push({
      slug: String(post.slug),
      title: String(post.title),
      excerpt: typeof post.excerpt === 'string' ? post.excerpt : '',
      publishedAt: typeof post.publishedAt === 'string' ? post.publishedAt : '',
    })
  }

  // OS-managed entries replace repository posts with the same slug.
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]))
  return Array.from(postsBySlug.values()).sort((a, b) =>
    (b.publishedAt || '').localeCompare(a.publishedAt || ''),
  )
}

function buildFeedXml(posts) {
  const items = posts
    .map((post) => {
      const link = `${BASE_URL}/journal/${post.slug}`
      const pubDate = post.publishedAt
        ? new Date(
            post.publishedAt.includes('T') ? post.publishedAt : `${post.publishedAt}T00:00:00Z`,
          ).toUTCString()
        : new Date().toUTCString()

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Trovara Farm Journal</title>
    <link>${BASE_URL}/journal</link>
    <description>Stories, harvests, and lessons from Trovara Farm.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function readPublishedCareers() {
  try {
    const response = await fetch(CAREERS_API_URL, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return Array.isArray(data.posts)
      ? data.posts.filter((post) => post && typeof post.slug === 'string' && typeof post.title === 'string')
      : []
  } catch (error) {
    console.warn(`Career SEO sync skipped: ${error instanceof Error ? error.message : error}`)
    return []
  }
}

const STATIC_PAGE_META = {
  '/': ['Trovara Farm - Food you can trust, from a farm built for tomorrow', 'Premium regenerative food from Ogun State, Nigeria for homes, chefs, and hospitality partners.'],
  '/about': ['About Us - Trovara Farm', 'Learn about Trovara Farm, our mission, and the people building a regenerative food company in Nigeria.'],
  '/products': ['Our Products - Trovara Farm', 'Explore Trovara Farm product lines, including coconut, plantain, palm oil, pasture-raised chicken, and eggs.'],
  '/products/coconut': ['Coconut - Trovara Farm', 'Explore traceable coconuts grown at Trovara Farm in Ogun State.'],
  '/products/plantain': ['Plantain - Trovara Farm', 'Explore plantain grown with regenerative practices at Trovara Farm.'],
  '/products/poultry': ['Pasture-raised Chicken - Trovara Farm', 'Explore pasture-raised chicken from Trovara Farm.'],
  '/products/eggs': ['Pasture-raised Eggs - Trovara Farm', 'Explore pasture-raised eggs from Trovara Farm.'],
  '/products/palm-oil': ['Palm Oil - Trovara Farm', 'Explore traceable palm oil from Trovara Farm.'],
  '/shop': ['Shop Account - Trovara Farm', 'Access your Trovara Farm shop account.', 'noindex, nofollow'],
  '/farm': ['The Farm - Trovara Farm', 'Discover how Trovara Farm grows healthy food and restores land in Ogun State.'],
  '/services': ['Farm OS & Farm Advisory Services - Trovara Farm', 'Explore Trovara Farm OS and hands-on Farm Advisory Services.'],
  '/faq': ['FAQ - Trovara Farm', 'Common questions about Trovara Farm products, delivery, partnerships, and operations.'],
  '/journal': ['Journal - Trovara Farm', 'Stories, field notes, and practical farming insights from Trovara Farm.'],
  '/moments': ['Moments - Trovara Farm', 'Photos and videos from the Trovara Farm community.'],
  '/careers': ['Careers - Trovara Farm', 'Open roles at Trovara Farm. Join the team growing regenerative food from Abeokuta.'],
  '/contact': ['Contact - Trovara Farm', 'Contact Trovara Farm for products, partnerships, wholesale opportunities, and farm visits.'],
  '/survey': ['Customer Food Survey - Trovara Farm', 'Tell Trovara Farm how you buy fresh food in Nigeria. A 3-minute survey to help us design a better farm-to-table service.'],
  '/wholesale': ['B2B Wholesale - Trovara Farm', 'Wholesale offerings for restaurants, retailers, and food service partners.'],
  '/wholesale/one-pager': ['Wholesale One-Pager - Trovara Farm', 'Trovara Farm wholesale supply and contact details.'],
  '/privacy': ['Privacy Policy - Trovara Farm', 'How Trovara Farm collects, uses, and protects personal data.'],
  '/terms': ['Terms of Service - Trovara Farm', 'Terms governing use of the Trovara Farm website and services.'],
}

const PRIVATE_PAGES = [
  ['/shop/reset-password', 'Reset Password - Trovara Farm', 'Set a new shop account password.'],
  ['/shop/verify-email', 'Verify Email - Trovara Farm', 'Verify a Trovara Farm shop account email address.'],
  ['/newsletter/confirm', 'Confirm Newsletter Subscription - Trovara Farm', 'Confirm a newsletter subscription.'],
  ['/newsletter/unsubscribe', 'Unsubscribe from Newsletter - Trovara Farm', 'Manage a newsletter subscription.'],
].map(([path, title, description]) => ({
  path,
  title,
  description,
  robots: 'noindex, nofollow',
}))

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  const [posts, careers] = await Promise.all([readPublishedPosts(), readPublishedCareers()])
  const sitemapPaths = [
    ...STATIC_ROUTES,
    ...posts.map((post) => `/journal/${post.slug}`),
    ...careers.map((post) => `/careers/${post.slug}`),
  ]
  const sitemap = buildSitemapXml(sitemapPaths)
  const feed = buildFeedXml(posts)
  const seoPages = [
    ...STATIC_ROUTES.map((route) => {
      const meta = STATIC_PAGE_META[route] || [
        'Trovara Farm',
        'Food you can trust, from a farm built for tomorrow.',
      ]
      return { path: route, title: meta[0], description: meta[1], robots: meta[2] }
    }),
    ...posts.map((post) => ({
      path: `/journal/${post.slug}`,
      title: `${post.title} - Trovara Farm`,
      description: post.excerpt || 'Read this story from Trovara Farm.',
    })),
    ...careers.map((post) => ({
      path: `/careers/${post.slug}`,
      title: `${post.title} - Careers - Trovara Farm`,
      description: post.summary || 'Career opening at Trovara Farm.',
    })),
    ...PRIVATE_PAGES,
  ]

  await Promise.all([
    fs.writeFile(SITEMAP_PATH, sitemap, 'utf8'),
    fs.writeFile(FEED_PATH, feed, 'utf8'),
    fs.writeFile(SEO_PAGES_PATH, `${JSON.stringify(seoPages, null, 2)}\n`, 'utf8'),
  ])

  console.log(`Generated SEO files with ${posts.length} posts and ${careers.length} careers.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
