import test from 'node:test'
import assert from 'node:assert/strict'
import { hasBrotliSecurityFix } from './_runtime-security.mjs'
import { json } from './_shared.mjs'

test('managed runtime version check rejects vulnerable and unverified release lines', () => {
  for (const version of ['20.20.0', '22.23.4', '24.21.99', '24.22.0', '26.12.1', '24.22.1-rc.1', '25.0.0', 'bad']) {
    assert.equal(hasBrotliSecurityFix(version), false, version)
  }
  for (const version of ['24.22.1', '24.22.2', '24.23.0']) {
    assert.equal(hasBrotliSecurityFix(version), true, version)
  }
})

test('every JSON response exposes only a boolean runtime verification signal', () => {
  assert.equal(json(405, { ok: false }).headers.get('X-Trovara-Runtime-Secure'), 'true')
})
