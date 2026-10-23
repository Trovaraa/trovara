import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('Netlify builds once in the explicit deployment context and preserves preview protections', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy-to-netlify.yml', import.meta.url), 'utf8')
  const buildStep = workflow.slice(workflow.indexOf('- name: Build'), workflow.indexOf('- name: Deploy production'))
  assert.match(buildStep, /github.event.pull_request.user.login == 'dependabot\[bot\]'/)
  assert.match(buildStep, /github.event.pull_request.head.repo.full_name != github.repository/)
  assert.match(buildStep, /run: npm run build/)
  assert.match(workflow, /JOURNAL_API_URL: https:\/\/os\.trovara\.farm\/public\/journal/)
  const commands = [...workflow.matchAll(/npx --yes netlify-cli@[^\n]+ deploy([\s\S]*?)\n        env:/g)]
  assert.equal(commands.length, 2)
  assert.match(commands[0][1], /--context production/)
  assert.match(commands[1][1], /--context deploy-preview/)
  for (const [, command] of commands) {
    assert.doesNotMatch(command, /--no-build/)
    assert.match(command, /--skip-functions-cache/)
    assert.match(command, /--functions netlify\/deploy-functions/)
  }
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.scripts.postbuild, 'node scripts/lockdown-preview-redirects.mjs --if-preview')
})
