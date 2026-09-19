import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { isPreviewBuild, lockdownPreviewRedirects } from '../scripts/lockdown-preview-redirects.mjs'

test('all supported preview build paths trigger lockdown, production and local do not', () => {
  for (const env of [{ CONTEXT: 'deploy-preview' }, { CONTEXT: 'branch-deploy' }, { GITHUB_EVENT_NAME: 'pull_request' }]) {
    assert.equal(isPreviewBuild(env), true)
  }
  for (const env of [{}, { CONTEXT: 'production' }, { CONTEXT: 'dev' }, { GITHUB_EVENT_NAME: 'workflow_dispatch' }]) {
    assert.equal(isPreviewBuild(env), false)
  }
})

test('preview denies careers intake before wildcard while retaining public job reads', () => {
  const proxy = '/careers-api/* https://os.trovara.farm/public/careers/:splat 200!'
  const result = lockdownPreviewRedirects(proxy)
  assert.match(result, /^\/careers-api\/applications\s+\/404.html\s+404\n/)
  assert.match(result, /\/careers-api\/applications\/\*\s+\/404.html\s+404/)
  assert.match(result, /\/careers-api\/application-policy\s+\/404.html\s+404/)
  assert.ok(result.endsWith(proxy))
  assert.equal(lockdownPreviewRedirects(result), result)
})

test('npm build invokes lockdown automatically, including Netlify-native previews', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.scripts.postbuild, 'node scripts/lockdown-preview-redirects.mjs --if-preview')
})
