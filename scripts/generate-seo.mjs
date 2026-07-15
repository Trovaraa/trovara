import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const BASE_URL = 'https://trovara.farm'
const POSTS_DIR = path.resolve(process.cwd(), 'src/content/posts')
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const SITEMAP_PATH = path.resolve(PUBLIC_DIR, 'sitemap.xml')
const FEED_PATH = path.resolve(PUBLIC_DIR, 'feed.xml')

const STATIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/products/coconut',
  '/products/plantain',
  '/products/poultry',
  '/farm',
  '/services',
  '/faq',
  '/blog',
  '/contact',
  '/wholesale',
  '/wholesale/one-pager',
  '/privacy',
  '/terms',
]

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

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

  return posts.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}

function buildSitemapXml(posts) {
  const routeEntries = STATIC_ROUTES.map((route) => `${BASE_URL}${route === '/' ? '' : route}`)
  const postEntries = posts.map((post) => `${BASE_URL}/blog/${post.slug}`)

  const urls = [...routeEntries, ...postEntries]

  const body = urls
    .map((url) => `  <url>\n    <loc>${xmlEscape(url)}</loc>\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function buildFeedXml(posts) {
  const items = posts
    .map((post) => {
      const link = `${BASE_URL}/blog/${post.slug}`
      const pubDate = post.publishedAt
        ? new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()
        : new Date().toUTCString()

      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <pubDate>${xmlEscape(pubDate)}</pubDate>
      <description>${xmlEscape(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Trovara Farm Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Stories, harvests, and lessons from Trovara Farm.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
}

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  const posts = await readPublishedPosts()
  const sitemap = buildSitemapXml(posts)
  const feed = buildFeedXml(posts)

  await Promise.all([
    fs.writeFile(SITEMAP_PATH, sitemap, 'utf8'),
    fs.writeFile(FEED_PATH, feed, 'utf8'),
  ])

  console.log(`Generated sitemap.xml and feed.xml with ${posts.length} posts.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
