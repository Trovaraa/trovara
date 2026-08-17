/**
 * Food survey handler - validates, rate-limits, and forwards to Trovara OS.
 */
import {
  forwardToSurvey,
  getClientIp,
  hasOnlyKeys,
  honeypotResponse,
  json,
  MARKETING_LEAD_CONSENT_VERSION,
  parseJsonBody,
  rateLimit,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

const ALLOWED_KEYS = new Set([
  'location',
  'locationOther',
  'household',
  'buyPlaces',
  'buyPlacesOther',
  'frequency',
  'frustrations',
  'frustrationsOther',
  'topFrustration',
  'priorities',
  'products',
  'productsOther',
  'hardToGet',
  'sourceMatters',
  'shopPreference',
  'priceExpectation',
  'oneChange',
  'heardFrom',
  'heardFromOther',
  'followUp',
  'name',
  'contact',
  'consent',
  'consentVersion',
  'honey',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'referrer',
])

function trimString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function asStringArray(value, max) {
  if (!Array.isArray(value) || value.length < 1 || value.length > max) return null
  if (!value.every((item) => typeof item === 'string' && item.trim() && item.length <= 40)) return null
  return value.map((item) => item.trim())
}

function validateSurvey(body) {
  if (!hasOnlyKeys(body, ALLOWED_KEYS)) return { error: 'Invalid survey request.' }
  if (typeof body.honey !== 'undefined' && typeof body.honey !== 'string') {
    return { error: 'Invalid survey request.' }
  }
  if (body.consent !== true) {
    return { error: 'Please consent to Trovara storing your survey answers.' }
  }
  if (
    typeof body.consentVersion !== 'undefined' &&
    (typeof body.consentVersion !== 'string' || !body.consentVersion.trim() || body.consentVersion.trim().length > 32)
  ) {
    return { error: 'Invalid survey request.' }
  }

  const buyPlaces = asStringArray(body.buyPlaces, 3)
  const frustrations = asStringArray(body.frustrations, 4)
  const priorities = asStringArray(body.priorities, 3)
  const products = asStringArray(body.products, 8)
  if (!buyPlaces || !frustrations || !priorities || !products) {
    return { error: 'Please complete the required multiple-choice questions.' }
  }
  if (priorities.length !== 3) {
    return { error: 'Choose exactly three things that matter most.' }
  }

  const followUp = trimString(body.followUp)
  const contact = trimString(body.contact)
  if (!['yes', 'maybe', 'no'].includes(followUp)) {
    return { error: 'Please say whether we may follow up.' }
  }
  if (followUp !== 'no' && (contact.length < 5 || contact.length > 320)) {
    return { error: 'Enter a WhatsApp number or email so we can follow up.' }
  }

  const hardToGet = trimString(body.hardToGet)
  const oneChange = trimString(body.oneChange)
  if (!hardToGet || hardToGet.length > 500 || !oneChange || oneChange.length > 500) {
    return { error: 'Please complete the short written answers.' }
  }

  const payload = {
    location: trimString(body.location),
    household: trimString(body.household),
    buyPlaces,
    frequency: trimString(body.frequency),
    frustrations,
    priorities,
    products,
    hardToGet,
    sourceMatters: trimString(body.sourceMatters),
    shopPreference: trimString(body.shopPreference),
    priceExpectation: trimString(body.priceExpectation),
    oneChange,
    heardFrom: trimString(body.heardFrom),
    followUp,
    consent: true,
    consentVersion: trimString(body.consentVersion) || MARKETING_LEAD_CONSENT_VERSION,
  }

  const optional = [
    'locationOther',
    'buyPlacesOther',
    'frustrationsOther',
    'topFrustration',
    'productsOther',
    'heardFromOther',
    'name',
    'contact',
    'utmSource',
    'utmMedium',
    'utmCampaign',
    'referrer',
  ]
  for (const key of optional) {
    const value = trimString(body[key])
    if (value) payload[key] = value
  }

  return { payload }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  const parsed = await parseJsonBody(request)
  if (parsed.error) return parsed.error

  const honeyHit = honeypotResponse(parsed.body.honey)
  if (honeyHit) return honeyHit

  const ip = getClientIp(request)
  if (!rateLimit(ip, 'survey', MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  const validated = validateSurvey(parsed.body)
  if ('error' in validated) {
    return json(400, { ok: false, error: validated.error })
  }

  const result = await forwardToSurvey(validated.payload, ip)
  if (!result.ok) {
    return json(result.status, { ok: false, error: result.error })
  }
  return json(200, { ok: true })
}
