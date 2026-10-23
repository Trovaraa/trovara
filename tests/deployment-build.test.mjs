import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('Netlify deploys the already tested build without rebuilding or replacing preview protections', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy-to-netlify.yml', import.meta.url), 'utf8')
  assert.match(workflow, /- name: Build\s+run: npm run build/)
  assert.match(workflow, /JOURNAL_API_URL: https:\/\/os\.trovara\.farm\/public\/journal/)
  assert.ok(workflow.indexOf('- name: Lock mutating proxies') < workflow.indexOf('- name: Deploy production'))
  const commands = [...workflow.matchAll(/npx --yes netlify-cli@[^\n]+ deploy([\s\S]*?)\n        env:/g)]
  assert.equal(commands.length, 2)
  for (const [, command] of commands) {
    assert.match(command, /--no-build/)
    assert.match(command, /--skip-functions-cache/)
    assert.match(command, /--functions netlify\/deploy-functions/)
  }
})
