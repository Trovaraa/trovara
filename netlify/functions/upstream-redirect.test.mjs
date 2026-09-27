import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { forwardToMarketingLeads, forwardToSurvey } from './_shared.mjs'

const originalFetch = globalThis.fetch
const originalLeads = process.env.MARKETING_LEADS_API_URL
const originalSurvey = process.env.SURVEY_API_URL
afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalLeads === undefined) delete process.env.MARKETING_LEADS_API_URL
  else process.env.MARKETING_LEADS_API_URL = originalLeads
  if (originalSurvey === undefined) delete process.env.SURVEY_API_URL
  else process.env.SURVEY_API_URL = originalSurvey
})

for (const kind of ['lead', 'survey']) {
  test(`${kind} rejects upstream redirects instead of replaying personal data elsewhere`, async () => {
    process.env.MARKETING_LEADS_API_URL = 'https://os.example/public/leads'
    process.env.SURVEY_API_URL = 'https://os.example/public/surveys'
    const calls = []
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options })
      throw new TypeError('fetch failed: unexpected redirect')
    }
    const result = kind === 'lead'
      ? await forwardToMarketingLeads('contact', { name: 'Synthetic applicant' })
      : await forwardToSurvey({ name: 'Synthetic applicant' })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].options.redirect, 'error')
    assert.equal(result.status, 502)
    assert.equal(result.ok, false)
    assert.doesNotMatch(result.error, /unexpected redirect/)
  })
}
