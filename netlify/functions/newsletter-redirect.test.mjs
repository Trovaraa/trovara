import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import handler from './newsletter.mjs'

const originalFetch = globalThis.fetch
const originalUrl = process.env.NEWSLETTER_API_URL
const originalSecret = process.env.FORM_PROXY_SIGNING_SECRET
afterEach(() => {
  globalThis.fetch = originalFetch
  for (const [key, value] of [['NEWSLETTER_API_URL', originalUrl], ['FORM_PROXY_SIGNING_SECRET', originalSecret]]) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

for (const action of ['subscribe', 'confirm', 'unsubscribe']) {
  test(`newsletter ${action} refuses redirects carrying personal data or tokens`, async () => {
    process.env.NEWSLETTER_API_URL = 'https://os.example/public/newsletter'
    process.env.FORM_PROXY_SIGNING_SECRET = 'synthetic-proxy-secret'
    const calls = []
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options })
      throw new TypeError('unexpected upstream redirect')
    }
    const payload = action === 'subscribe'
      ? { action, name: 'Synthetic subscriber', email: 'synthetic@example.com', consent: true, phoneConsent: false }
      : { action, token: 'synthetic-newsletter-token' }
    const response = await handler(new Request('https://example.com/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-nf-client-connection-ip': '192.0.2.1' },
      body: JSON.stringify(payload),
    }))
    assert.equal(calls.length, 1)
    assert.equal(calls[0].options.redirect, 'error')
    assert.equal(response.status, 502)
    assert.doesNotMatch(await response.text(), /unexpected upstream redirect/)
  })
}
