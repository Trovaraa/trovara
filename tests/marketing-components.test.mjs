import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const read = (relativePath) => readFile(new URL(relativePath, root), 'utf8')

test('application provides skip navigation and route focus target', async () => {
  const app = await read('src/App.vue')
  assert.match(app, /href="#main-content"/)
  assert.match(app, /id="main-content"/)
  assert.match(app, /mainContent\.value\?\.focus/)
})

test('mobile navigation traps focus and supports Escape', async () => {
  const navbar = await read('src/components/TheNavbar.vue')
  assert.match(navbar, /event\.key === 'Escape'/)
  assert.match(navbar, /event\.key !== 'Tab'/)
  assert.match(navbar, /restoreFocusTo/)
  assert.match(navbar, /aria-modal="true"/)
})

test('Moments upload contract includes accessible description and versioned consent', async () => {
  const moments = await read('src/views/MomentsView.vue')
  assert.match(moments, /MOMENTS_MAX_UPLOAD_BYTES/)
  assert.match(moments, /formData\.append\('consentVersion', MOMENTS_CONSENT_VERSION\)/)
  assert.match(moments, /Media description/)
  assert.match(moments, /:alt="moment\.description/)
  assert.match(moments, /Privacy Notice/)
})

test('contact details expose phone and email actions', async () => {
  const contact = await read('src/views/ContactView.vue')
  assert.match(contact, /tel:\+2348103693426/)
  assert.match(contact, /`mailto:\$\{CONTACT_EMAILS\.hello\}`/)
  assert.match(contact, /:href="info\.href"/)
})

test('careers use the shared HTML-disabled markdown renderer', async () => {
  const [renderer, career, blog] = await Promise.all([
    read('src/lib/markdown.ts'),
    read('src/views/CareerPostView.vue'),
    read('src/content/posts/loadPosts.ts'),
  ])
  assert.match(renderer, /html: false/)
  assert.match(renderer, /noopener noreferrer/)
  assert.match(career, /renderSafeMarkdown\(post\.bodyMarkdown\)/)
  assert.match(blog, /renderSafeMarkdown\(markdown\)/)
})

test('Netlify fallback returns a real 404', async () => {
  const [redirects, config] = await Promise.all([
    read('public/_redirects'),
    read('netlify.toml'),
  ])
  assert.match(redirects, /\/\*\s+\/404\.html\s+404/)
  assert.doesNotMatch(redirects, /\/\*\s+\/index\.html\s+200/)
  assert.match(config, /to\s*=\s*"\/404\.html"[\s\S]*status\s*=\s*404/)
})
