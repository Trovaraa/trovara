#!/usr/bin/env node
/**
 * Preview Netlify deploys must not 200-proxy mutating public APIs at production OS.
 * Call after `npm run build` and before `netlify deploy --context deploy-preview`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const MUTATING_PREFIXES = ['/shop-api', '/moments-api', '/brand-api', '/journal-api']

export function lockdownPreviewRedirects(source) {
  return source
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return line
      const path = trimmed.split(/\s+/)[0] ?? ''
      if (!MUTATING_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
        return line
      }
      const wildcard = path.includes('*') || path.endsWith('/') ? '/*' : ''
      const prefix = MUTATING_PREFIXES.find((candidate) => path === candidate || path.startsWith(`${candidate}/`))
      return `${prefix}${wildcard}  /404.html  404`
    })
    .join('\n')
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const redirectsPath = resolve(root, process.argv[2] || 'dist/_redirects')
  if (!existsSync(redirectsPath)) {
    console.error(`${redirectsPath} not found. Run \`npm run build\` first.`)
    process.exit(1)
  }
  writeFileSync(redirectsPath, lockdownPreviewRedirects(readFileSync(redirectsPath, 'utf8')))
  console.log(`Locked mutating preview proxies in ${redirectsPath}`)
}
