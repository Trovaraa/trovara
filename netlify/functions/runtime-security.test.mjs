import test from 'node:test'
import assert from 'node:assert/strict'
import { createPreviewRuntimeReporter, hasBrotliSecurityFix } from './_runtime-security.mjs'
import { json } from './_shared.mjs'

test('managed runtime version check rejects vulnerable and unverified release lines', () => {
  for (const version of ['20.20.0', '22.22.99', '22.23.3', '22.23.4-rc.1', '23.0.0', '24.21.99', '24.22.0', '26.12.1', '24.22.1-rc.1', '25.0.0', 'bad']) {
    assert.equal(hasBrotliSecurityFix(version), false, version)
  }
  for (const version of ['22.23.4', '22.23.5', '22.24.0', '24.22.1', '24.22.2', '24.23.0']) {
    assert.equal(hasBrotliSecurityFix(version), true, version)
  }
})

test('every JSON response exposes only a boolean runtime verification signal', () => {
  assert.equal(json(405, { ok: false }).headers.get('X-Trovara-Runtime-Secure'), 'true')
})

test('runtime diagnostic logs only allowlisted runtime fields once for the specific preview GET', () => {
  const logs = []
  const report = createPreviewRuntimeReporter({ version: '24.22.0', write: (line) => logs.push(JSON.parse(line)) })
  for (const url of ['https://www.trovara.farm/', 'https://deploy-preview-67--trovara.netlify.app/', 'https://deploy-preview-66--trovara.netlify.app.evil.test/', 'http://deploy-preview-66--trovara.netlify.app/']) {
    report(new Request(url))
  }
  report(new Request('https://deploy-preview-66--trovara.netlify.app/', { method: 'POST', body: 'private' }))
  assert.deepEqual(logs, [])
  const request = new Request('https://deploy-preview-66--trovara.netlify.app/.netlify/functions/contact?private=excluded', { headers: { authorization: 'never-log-this' } })
  report(request)
  report(request)
  assert.deepEqual(logs, [{ event: 'trovara_runtime_diagnostic', node: '24.22.0', secure: false }])
})
