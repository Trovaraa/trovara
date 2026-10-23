import test from 'node:test'
import assert from 'node:assert/strict'
import { hasBrotliSecurityFix } from './_runtime-security.mjs'
import { json } from './_shared.mjs'

test('managed runtime version check rejects vulnerable and unverified release lines', () => {
  for (const version of ['20.20.0', '22.23.3', '24.22.0', '26.12.0', '22.23.4-rc.1', '25.0.0', 'bad']) {
    assert.equal(hasBrotliSecurityFix(version), false, version)
  }
  for (const version of ['22.23.4', '22.24.0', '24.22.1', '26.12.1']) {
    assert.equal(hasBrotliSecurityFix(version), true, version)
  }
})

test('every JSON response exposes only a boolean runtime verification signal', () => {
  assert.equal(json(405, { ok: false }).headers.get('X-Trovara-Runtime-Secure'), 'true')
})
