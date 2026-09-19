#!/usr/bin/env node
/**
 * Preview Netlify deploys must not 200-proxy mutating public APIs at production OS.
 * npm postbuild covers both Netlify-native previews and GitHub PR builds.
 * Direct invocation still supports explicit preview deployments.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const MUTATING_PREFIXES = ['/shop-api', '/moments-api', '/brand-api', '/journal-api']
const TALENT_DENIALS = '/careers-api/applications  /404.html  404\n/careers-api/applications/*  /404.html  404\n/careers-api/application-policy  /404.html  404\n'

export function isPreviewBuild(env = process.env) {
  return ['deploy-preview', 'branch-deploy'].includes(env.CONTEXT) || env.GITHUB_EVENT_NAME === 'pull_request'
}

export function lockdownPreviewRedirects(source) {
  // Careers intake is live on OS even when a preview does not show its form.
  // Denials must precede the otherwise read-only careers wildcard proxy.
  return (source.startsWith(TALENT_DENIALS) ? source : TALENT_DENIALS + source)
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
  if (process.argv.includes('--if-preview') && !isPreviewBuild()) {
    console.log('Not a preview build; production/local proxies unchanged.')
    process.exit(0)
  }
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const redirectsPath = resolve(root, process.argv.slice(2).find((arg) => !arg.startsWith('--')) || 'dist/_redirects')
  if (!existsSync(redirectsPath)) {
    console.error(`${redirectsPath} not found. Run \`npm run build\` first.`)
    process.exit(1)
  }
  writeFileSync(redirectsPath, lockdownPreviewRedirects(readFileSync(redirectsPath, 'utf8')))
  console.log(`Locked mutating preview proxies in ${redirectsPath}`)
}
