import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'

import surveyHandler from './survey.mjs'

const originalFetch = globalThis.fetch
const originalApiUrl = process.env.SURVEY_API_URL
const originalLeadsUrl = process.env.MARKETING_LEADS_API_URL
const originalProxySecret = process.env.FORM_PROXY_SIGNING_SECRET
let requestNumber = 0

beforeEach(() => {
  process.env.SURVEY_API_URL = 'https://os.example/public/surveys'
  process.env.FORM_PROXY_SIGNING_SECRET = 'test-form-proxy-secret'
})

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalApiUrl === undefined) delete process.env.SURVEY_API_URL
  else process.env.SURVEY_API_URL = originalApiUrl
  if (originalLeadsUrl === undefined) delete process.env.MARKETING_LEADS_API_URL
  else process.env.MARKETING_LEADS_API_URL = originalLeadsUrl
  if (originalProxySecret === undefined) delete process.env.FORM_PROXY_SIGNING_SECRET
  else process.env.FORM_PROXY_SIGNING_SECRET = originalProxySecret
})

function validBody(overrides = {}) {
  return {
    location: 'abeokuta',
    household: '3_4',
    buyPlaces: ['open_market'],
    frequency: 'weekly',
    frustrations: ['unknown_source'],
    priorities: ['freshness', 'origin', 'food_safety'],
    products: ['eggs', 'plantain'],
    hardToGet: 'Consistent chicken.',
    sourceMatters: 'definitely',
    shopPreference: 'customise_basket',
    priceExpectation: 'same',
    oneChange: 'Tell me where the food came from.',
    heardFrom: 'website',
    followUp: 'no',
    consent: true,
    consentVersion: '1.0',
    honey: '',
    ...overrides,
  }
}

function request(body) {
  requestNumber += 1
  return new Request('https://trovara.farm/.netlify/functions/survey', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `192.0.2.${requestNumber}`,
    },
    body: JSON.stringify(body),
  })
}

test('survey proxies the validated OS contract', async () => {
  let outbound
  globalThis.fetch = async (url, options) => {
    outbound = { url, options }
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }

  const response = await surveyHandler(request(validBody({
    followUp: 'yes',
    name: '  Ada  ',
    contact: ' ada@example.com ',
    referralCode: ' trvabcdef123456 ',
  })))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(outbound.url, 'https://os.example/public/surveys')
  assert.deepEqual(JSON.parse(outbound.options.body), {
    location: 'abeokuta',
    household: '3_4',
    buyPlaces: ['open_market'],
    frequency: 'weekly',
    frustrations: ['unknown_source'],
    priorities: ['freshness', 'origin', 'food_safety'],
    products: ['eggs', 'plantain'],
    hardToGet: 'Consistent chicken.',
    sourceMatters: 'definitely',
    shopPreference: 'customise_basket',
    priceExpectation: 'same',
    oneChange: 'Tell me where the food came from.',
    heardFrom: 'website',
    followUp: 'yes',
    consent: true,
    consentVersion: '1.0',
    name: 'Ada',
    contact: 'ada@example.com',
    referralCode: 'TRVABCDEF123456',
  })
})

test('rejects a malformed Trovara referral code before proxying', async () => {
  let fetchCalls = 0
  globalThis.fetch = async () => {
    fetchCalls += 1
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }
  const response = await surveyHandler(request(validBody({ referralCode: 'not-a-credit-code' })))
  assert.equal(response.status, 400)
  assert.equal(fetchCalls, 0)
})

test('rejects survey submissions without consent before proxying', async () => {
  let fetchCalls = 0
  globalThis.fetch = async () => {
    fetchCalls += 1
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }

  const response = await surveyHandler(request(validBody({ consent: false })))
  assert.equal(response.status, 400)
  assert.equal(fetchCalls, 0)
})

test('derives the survey URL from the leads API when SURVEY_API_URL is unset', async () => {
  delete process.env.SURVEY_API_URL
  process.env.MARKETING_LEADS_API_URL = 'https://os.example/public/leads'
  let outbound
  globalThis.fetch = async (url, options) => {
    outbound = { url, options }
    return Response.json({ ok: true, accepted: true }, { status: 202 })
  }

  const response = await surveyHandler(request(validBody()))
  assert.equal(response.status, 200)
  assert.equal(outbound.url, 'https://os.example/public/surveys')
})
