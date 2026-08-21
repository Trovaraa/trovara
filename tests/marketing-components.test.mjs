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

test('Account links point at shop.trovara.farm', async () => {
  const [navbar, footer, home, origin] = await Promise.all([
    read('src/components/TheNavbar.vue'),
    read('src/components/TheFooter.vue'),
    read('src/views/HomeView.vue'),
    read('src/lib/shop-account.ts'),
  ])
  assert.match(origin, /export const SHOP_ACCOUNT_URL = 'https:\/\/shop\.trovara\.farm'/)
  assert.match(navbar, /SHOP_ACCOUNT_URL/)
  assert.match(footer, /SHOP_ACCOUNT_URL/)
  assert.match(home, /SHOP_ACCOUNT_URL/)
  assert.doesNotMatch(navbar, /to: '\/shop'/)
  assert.doesNotMatch(footer, /to: '\/shop'/)
})

test('local marketing and OS servers use separate fixed ports', async () => {
  const config = await read('vite.config.ts')
  assert.match(config, /port:\s*4173/)
  assert.match(config, /strictPort:\s*true/)
  assert.match(config, /'\/lot-api'[\s\S]*target:\s*'http:\/\/127\.0\.0\.1:3000'/)
  assert.doesNotMatch(config, /'\/shop-api'/)
})

test('farm /shop aliases 301 to shop.trovara.farm and does not proxy the shop API', async () => {
  const [redirects, netlify] = await Promise.all([
    read('public/_redirects'),
    read('netlify.toml'),
  ])
  assert.match(redirects, /\/shop\s+https:\/\/shop\.trovara\.farm\/\s+301/)
  assert.doesNotMatch(redirects, /\/shop-api/)
  assert.match(redirects, /\/shop\/verify-email\s+https:\/\/shop\.trovara\.farm\/verify-email\s+301/)
  assert.match(redirects, /\/shop\/reset-password\s+https:\/\/shop\.trovara\.farm\/reset-password\s+301/)
  assert.match(redirects, /\/verify-email\s+https:\/\/shop\.trovara\.farm\/verify-email\s+301/)
  assert.match(redirects, /\/reset-password\s+https:\/\/shop\.trovara\.farm\/reset-password\s+301/)
  assert.match(netlify, /from\s*=\s*"\/shop"/)
  assert.match(netlify, /to\s*=\s*"https:\/\/shop\.trovara\.farm\/"/)
})

test('survey network failures show a useful retry message instead of browser error text', async () => {
  const survey = await read('src/lib/survey.ts')
  assert.match(survey, /We could not send your answers\. Check your connection and try again\./)
  assert.doesNotMatch(survey, /error instanceof Error/)
})

test('Netlify form functions use the official packager and a live startup check', async () => {
  const [workflow, smokeScript] = await Promise.all([
    read('.github/workflows/deploy-to-netlify.yml'),
    read('scripts/smoke-netlify-functions.mjs'),
  ])
  assert.match(workflow, /netlify-cli@27\.1\.1 deploy/)
  assert.match(workflow, /--functions netlify\/deploy-functions/)
  assert.match(workflow, /Smoke test deployed form functions/)
  assert.match(workflow, /lockdown-preview-redirects/)
  assert.match(smokeScript, /contact.*newsletter.*survey.*waitlist/)
  assert.match(smokeScript, /response\.status === 405/)
})

test('floating WhatsApp shortcut prepares one draft and leaves sending to the visitor', async () => {
  const [button, helper] = await Promise.all([
    read('src/components/WhatsAppButton.vue'),
    read('src/lib/whatsapp.ts'),
  ])
  assert.match(button, /const waLink = buildWhatsAppLink\("Hi Trovara Farm, I'd like to learn more about your products\."\)/)
  assert.match(button, /Open WhatsApp/)
  assert.match(helper, /\?text=\$\{encodeURIComponent\(trimmedMessage\)\}/)
})

test('journal routes show one contextual newsletter form instead of repeating the footer form', async () => {
  const [footer, journal, post] = await Promise.all([
    read('src/components/TheFooter.vue'),
    read('src/views/JournalView.vue'),
    read('src/views/JournalPostView.vue'),
  ])
  assert.match(footer, /!route\.path\.startsWith\('\/journal'\)/)
  assert.match(footer, /v-if="showNewsletterSignup"/)
  assert.match(journal, /title="Journal and harvest updates"/)
  assert.match(post, /title="Journal and harvest updates"/)
})

test('footer balances the long company navigation across two columns', async () => {
  const footer = await read('src/components/TheFooter.vue')
  assert.match(footer, /const companyLinkColumns = \[links\.company\.slice\(0, 6\), links\.company\.slice\(6\)\]/)
  assert.match(footer, /v-for="\(column, index\) in companyLinkColumns"/)
  assert.match(footer, /grid grid-cols-2 gap-x-8/)
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
  assert.match(contact, /tel:\+2348031350724/)
  assert.match(contact, /`mailto:\$\{CONTACT_EMAILS\.hello\}`/)
  assert.match(contact, /:href="info\.href"/)
})

test('careers use the shared HTML-disabled markdown renderer', async () => {
  const [renderer, career, journal] = await Promise.all([
    read('src/lib/markdown.ts'),
    read('src/views/CareerPostView.vue'),
    read('src/content/posts/loadPosts.ts'),
  ])
  assert.match(renderer, /html: false/)
  assert.match(renderer, /noopener noreferrer/)
  assert.match(career, /renderSafeMarkdown\(post\.bodyMarkdown\)/)
  assert.match(journal, /renderSafeMarkdown\(markdown\)/)
})

test('preview deploys 404 mutating public API proxies', async () => {
  const { lockdownPreviewRedirects } = await import('../scripts/lockdown-preview-redirects.mjs')
  const locked = lockdownPreviewRedirects(`
/shop-api/*    https://os.trovara.farm/shop/:splat  200!
/lot-api/*     https://os.trovara.farm/public/lots/:splat  200!
/moments-api/* https://os.trovara.farm/public/moments/:splat  200!
/journal-api   https://os.trovara.farm/public/journal  200!
`)
  assert.match(locked, /\/shop-api\/\*\s+\/404\.html\s+404/)
  assert.match(locked, /\/moments-api\/\*\s+\/404\.html\s+404/)
  assert.match(locked, /\/journal-api\s+\/404\.html\s+404/)
  assert.match(locked, /\/lot-api\/\*\s+https:\/\/os\.trovara\.farm\/public\/lots\/:splat\s+200!/)
})

test('Netlify fallback returns a real 404', async () => {
  const [redirects, config] = await Promise.all([
    read('public/_redirects'),
    read('netlify.toml'),
  ])
  assert.match(redirects, /\/blog\s+\/journal\s+301/)
  assert.match(redirects, /\/blog\/\*\s+\/journal\/:splat\s+301/)
  assert.match(redirects, /\/\*\s+\/404\.html\s+404/)
  assert.doesNotMatch(redirects, /\/\*\s+\/index\.html\s+200/)
  assert.match(config, /to\s*=\s*"\/404\.html"[\s\S]*status\s*=\s*404/)
})
