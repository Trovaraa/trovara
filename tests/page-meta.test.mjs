import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryHistory, createRouter } from 'vue-router'
import { canonicalUrl } from '../src/lib/canonical.ts'
import { applyPageMeta, usePageMeta } from '../src/composables/usePageMeta.ts'
import { buildSitemapXml, injectPageMetadata } from '../scripts/seo-utils.mjs'

test('canonical URLs agree for slash, query and hash variants in browser, HTML and sitemap', () => {
  for (const path of ['/careers', '/careers/', '/careers/?source=google#roles']) {
    const canonical = 'https://www.trovara.farm/careers/'
    assert.equal(canonicalUrl(path), canonical)
    assert.ok(injectPageMetadata('<head><title>Home</title></head>', {
      path, title: 'Careers', description: 'Jobs',
    }).includes(`href="${canonical}"`))
  }
  assert.equal(canonicalUrl('/?NA'), 'https://www.trovara.farm/')
  assert.equal(canonicalUrl('/products/plantain/'), 'https://www.trovara.farm/products/plantain/')
  const sitemap = buildSitemapXml(['/careers', '/careers/', '/careers/?ref=mail'])
  assert.equal(sitemap.match(/<loc>/g).length, 1)
})

test('initial async routing preserves deep-link metadata; failed navigation cannot overwrite it', async (t) => {
  const elements = []
  const document = {
    title: 'Careers',
    createElement(tag) {
      const attrs = new Map()
      return { tag, attrs, setAttribute: (key, value) => attrs.set(key, value) }
    },
    head: {
      appendChild: (element) => elements.push(element),
      querySelector(selector) {
        const [, tag, key, value] = selector.match(/^(\w+)\[(\w+)="([^"]+)"\]$/)
        return elements.find((element) => element.tag === tag && element.attrs.get(key) === value)
      },
    },
  }
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', { value: document, configurable: true })
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'document', previous)
    else delete globalThis.document
  })
  const canonical = document.createElement('link')
  canonical.setAttribute('rel', 'canonical')
  canonical.setAttribute('href', canonicalUrl('/careers'))
  document.head.appendChild(canonical)
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', component: {}, meta: { title: 'Home' } },
    { path: '/careers', component: {}, meta: { title: 'Careers' } },
    { path: '/products/plantain', component: {}, meta: { title: 'Plantain' } },
    { path: '/private', component: {}, meta: { robots: 'noindex, nofollow' } },
    { path: '/blocked', component: {}, beforeEnter: () => false, meta: { title: 'Wrong' } },
  ] })
  usePageMeta(router)
  assert.equal(document.title, 'Careers')
  assert.equal(canonical.attrs.get('href'), canonicalUrl('/careers'))
  await router.push('/careers/?ref=email#roles')
  assert.equal(canonical.attrs.get('href'), canonicalUrl('/careers'))
  await router.push('/products/plantain/')
  assert.equal(document.title, 'Plantain')
  assert.equal(canonical.attrs.get('href'), canonicalUrl('/products/plantain'))
  await router.push('/blocked')
  assert.equal(document.title, 'Plantain')
  assert.equal(canonical.attrs.get('href'), canonicalUrl('/products/plantain'))
  await router.push('/private')
  assert.equal(document.head.querySelector('meta[name="robots"]').attrs.get('content'), 'noindex, nofollow')
  applyPageMeta(router.currentRoute.value, { canonicalPath: '/careers/role/' })
  assert.equal(canonical.attrs.get('href'), canonicalUrl('/careers/role'))
})
