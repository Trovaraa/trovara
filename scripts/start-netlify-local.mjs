#!/usr/bin/env node
/**
 * Build marketing against local OS journal, rewrite shop/lot proxies to local API,
 * then start netlify dev on :8888.
 */
import { spawnSync, spawn } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = {
  ...process.env,
  JOURNAL_API_URL: process.env.JOURNAL_API_URL || 'http://127.0.0.1:3000/public/journal',
  NEWSLETTER_API_URL:
    process.env.NEWSLETTER_API_URL || 'http://127.0.0.1:3000/public/newsletter',
  MARKETING_LEADS_API_URL:
    process.env.MARKETING_LEADS_API_URL || 'http://127.0.0.1:3000/public/leads',
  LOCAL_OS_URL: process.env.LOCAL_OS_URL || 'http://127.0.0.1:3000',
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...opts,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('npm', ['run', 'build'])
run('node', ['scripts/point-shop-proxy-local.mjs'])

const child = spawn(
  'npx',
  ['netlify', 'dev', '--dir', 'dist', '--port', process.env.NETLIFY_DEV_PORT || '8888'],
  { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' },
)
child.on('exit', (code) => process.exit(code ?? 0))
