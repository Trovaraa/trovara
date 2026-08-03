import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

import contactHandler from './contact.mjs'
import waitlistHandler from './waitlist.mjs'

const originalFetch = globalThis.fetch
const originalApiUrl = process.env.MARKETING_LEADS_API_URL
let requestNumber = 0

beforeEach(() => {
  process.env.MARKETING_LEADS_API_URL = 'https://os.example/public/leads/'
})

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalApiUrl === undefined) {
    delete process.env.MARKETING_LEADS_API_URL
  } else {
    process.env.MARKETING_LEADS_API_URL = originalApiUrl
  }
})

function request(body) {
  requestNumber += 1
  return new Request('https://trovara.farm/.netlify/functions/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `192.0.2.${requestNumber}`,
    },
    body: JSON.stringify(body),
  })
}

async function responseBody(response) {
  return response.json()
}

test('contact proxies the validated OS contract and preserves browser success', async () => {
  let outbound
  globalThis.fetch = async (url, options) => {
    outbound = { url, options }
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }

  const response = await contactHandler(
    request({
      name: '  Ada Example  ',
      email: 'ada@example.com',
      phone: '',
      message: '  Please send wholesale details.  ',
      subject: 'bulk-order',
      honey: '',
    }),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await responseBody(response), { ok: true })
  assert.equal(outbound.url, 'https://os.example/public/leads/contact')
  assert.deepEqual(JSON.parse(outbound.options.body), {
    name: 'Ada Example',
    email: 'ada@example.com',
    message: 'Please send wholesale details.',
    subject: 'bulk-order',
  })
  assert.ok(outbound.options.signal instanceof AbortSignal)
})

test('all five product IDs retain their stable OS keys', async () => {
  const products = ['coconut', 'plantain', 'poultry', 'eggs', 'palm-oil']

  for (const product of products) {
    let outbound
    globalThis.fetch = async (url, options) => {
      outbound = { url, options }
      return Response.json({ ok: true, accepted: true }, { status: 202 })
    }

    const response = await waitlistHandler(
      request({ name: 'Ada Example', contact: '+234 801 234 5678', product, honey: '' }),
    )

    assert.equal(response.status, 200)
    assert.equal(outbound.url, 'https://os.example/public/leads/waitlist')
    assert.deepEqual(JSON.parse(outbound.options.body), {
      name: 'Ada Example',
      contact: '+234 801 234 5678',
      product,
    })
  }
})

test('strict validation rejects unknown and oversized fields before proxying', async () => {
  let fetchCalls = 0
  globalThis.fetch = async () => {
    fetchCalls += 1
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }

  const unknownField = await waitlistHandler(
    request({
      name: 'Ada Example',
      contact: 'ada@example.com',
      product: 'coconut',
      campaign: 'unexpected',
    }),
  )
  const oversized = await contactHandler(
    request({
      name: 'Ada Example',
      email: 'ada@example.com',
      phone: '',
      message: 'x'.repeat(4001),
      subject: 'general',
    }),
  )

  assert.equal(unknownField.status, 400)
  assert.equal(oversized.status, 400)
  assert.equal(fetchCalls, 0)
})

test('honeypot submissions return fake success without proxying', async () => {
  let fetchCalls = 0
  globalThis.fetch = async () => {
    fetchCalls += 1
    throw new Error('should not be called')
  }

  const response = await contactHandler(
    request({
      name: 'Bot',
      email: 'bot@example.com',
      message: 'spam',
      subject: 'general',
      honey: 'filled',
    }),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(await responseBody(response), { ok: true })
  assert.equal(fetchCalls, 0)
})

test('safe upstream 4xx errors are preserved', async () => {
  globalThis.fetch = async () =>
    Response.json({ error: 'This email is already on this waitlist.' }, { status: 409 })

  const response = await waitlistHandler(
    request({ name: 'Ada Example', contact: 'ada@example.com', product: 'plantain' }),
  )

  assert.equal(response.status, 409)
  assert.deepEqual(await responseBody(response), {
    ok: false,
    error: 'This email is already on this waitlist.',
  })
})

test('upstream failures and malformed success responses stay generic', async () => {
  globalThis.fetch = async () => Response.json({ error: 'database internals' }, { status: 500 })
  const upstreamFailure = await contactHandler(
    request({
      name: 'Ada Example',
      email: 'ada@example.com',
      message: 'Hello',
      subject: 'general',
    }),
  )

  globalThis.fetch = async () => Response.json({ ok: true }, { status: 202 })
  const malformedSuccess = await waitlistHandler(
    request({ name: 'Ada Example', contact: 'ada@example.com', product: 'coconut' }),
  )

  const generic = {
    ok: false,
    error: 'Form service is temporarily unavailable. Please try again.',
  }
  assert.equal(upstreamFailure.status, 502)
  assert.deepEqual(await responseBody(upstreamFailure), generic)
  assert.equal(malformedSuccess.status, 502)
  assert.deepEqual(await responseBody(malformedSuccess), generic)
})
