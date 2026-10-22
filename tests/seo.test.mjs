import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { buildSitemapXml, injectPageMetadata } from '../scripts/seo-utils.mjs'

test('sitemap includes moments, careers, journal, and dynamic career slugs once', () => {
  const sitemap = buildSitemapXml([
    '/',
    '/moments',
    '/careers',
    '/careers/farm-manager',
    '/careers/farm-manager',
    '/journal',
    '/journal/why-trovara-exists',
  ])
  assert.match(sitemap, /<loc>https:\/\/www\.trovara\.farm\/moments<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/www\.trovara\.farm\/careers<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/www\.trovara\.farm\/careers\/farm-manager<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/www\.trovara\.farm\/journal<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/www\.trovara\.farm\/journal\/why-trovara-exists<\/loc>/)
  assert.equal(sitemap.match(/careers\/farm-manager/g)?.length, 1)
})

test('prerender metadata replaces home metadata and supports noindex', () => {
  const shell = `<html><head>
    <meta name="description" content="home" />
    <meta property="og:title" content="home" />
    <meta property="og:description" content="home" />
    <meta property="og:url" content="https://trovara.farm/" />
    <title>Home</title>
  </head><body></body></html>`
  const html = injectPageMetadata(shell, {
    path: '/privacy',
    title: 'Privacy Policy - Trovara Farm',
    description: 'How Trovara Farm collects, uses, and protects personal data.',
    robots: 'noindex, nofollow',
  })
  assert.match(html, /<title>Privacy Policy - Trovara Farm<\/title>/)
  assert.match(html, /content="How Trovara Farm collects, uses, and protects personal data\."/)
  assert.match(html, /content="noindex, nofollow"/)
  assert.match(html, /href="https:\/\/www\.trovara\.farm\/privacy"/)
})

test('SEO host agrees across browser metadata, schema, shell and robots', async () => {
  const files = ['src/composables/usePageMeta.ts', 'src/views/ProductDetailView.vue',
    'src/views/JournalPostView.vue', 'src/components/StructuredData.vue',
    'index.html', 'public/robots.txt']
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    const urls = [...source.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0])
    const hosts = urls.map((u) => new URL(u).host)
    assert.ok(hosts.includes('www.trovara.farm'), file)
    assert.ok(!hosts.includes('trovara.farm'), `${file} must not point to the redirecting host`)
  }
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8')
  assert.match(robots, /^Sitemap: https:\/\/www\.trovara\.farm\/sitemap.xml$/m)
})
