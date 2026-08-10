#!/usr/bin/env node
/**
 * Point dist/_redirects shop/lot proxies at local Trovara OS for `netlify dev`.
 * Production builds keep public/_redirects → os.trovara.farm.
 *
 * Usage (from trovera/):
 *   JOURNAL_API_URL=http://127.0.0.1:3000/public/journal npm run build
 *   node scripts/point-shop-proxy-local.mjs
 *   NEWSLETTER_API_URL=http://127.0.0.1:3000/public/newsletter \
 *   MARKETING_LEADS_API_URL=http://127.0.0.1:3000/public/leads \
 *   npx netlify dev --dir dist --port 8888
 *
 * Or: npm run dev:netlify
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const redirectsPath = resolve(root, 'dist/_redirects')
const osOrigin = (process.env.LOCAL_OS_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '')

if (!existsSync(redirectsPath)) {
  console.error('dist/_redirects not found. Run `npm run build` first.')
  process.exit(1)
}

// Exact list endpoints must not keep a trailing slash (OS returns 404 for `/public/.../`).
const next = `/shop-api/*     ${osOrigin}/shop/:splat  200!
/lot-api/*      ${osOrigin}/public/lots/:splat  200!
/brand-api      ${osOrigin}/public/brand  200!
/brand-api/     ${osOrigin}/public/brand  200!
/brand-api/*    ${osOrigin}/public/brand/:splat  200!
/moments-api    ${osOrigin}/public/moments  200!
/moments-api/   ${osOrigin}/public/moments  200!
/moments-api/*  ${osOrigin}/public/moments/:splat  200!
/careers-api    ${osOrigin}/public/careers  200!
/careers-api/   ${osOrigin}/public/careers  200!
/careers-api/*  ${osOrigin}/public/careers/:splat  200!
/*              /index.html   200
`

writeFileSync(redirectsPath, next)
console.log(`Wrote local proxies in dist/_redirects → ${osOrigin}`)
console.log(readFileSync(redirectsPath, 'utf8'))
