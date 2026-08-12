import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSitemapXml, injectPageMetadata } from '../scripts/seo-utils.mjs'

test('sitemap includes moments, careers, and dynamic career slugs once', () => {
  const sitemap = buildSitemapXml([
    '/',
    '/moments',
    '/careers',
    '/careers/farm-manager',
    '/careers/farm-manager',
  ])
  assert.match(sitemap, /<loc>https:\/\/trovara\.farm\/moments<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/trovara\.farm\/careers<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/trovara\.farm\/careers\/farm-manager<\/loc>/)
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
    path: '/shop/reset-password',
    title: 'Reset Password - Trovara Farm',
    description: 'Set a new password.',
    robots: 'noindex, nofollow',
  })
  assert.match(html, /<title>Reset Password - Trovara Farm<\/title>/)
  assert.match(html, /content="Set a new password\."/)
  assert.match(html, /content="noindex, nofollow"/)
  assert.match(html, /href="https:\/\/trovara\.farm\/shop\/reset-password"/)
})
