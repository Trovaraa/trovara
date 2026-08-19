/**
 * Product waitlist handler. Captures interest only; it does not create an order or take payment.
 */
import {
  forwardToMarketingLeads,
  getClientIp,
  hasOnlyKeys,
  honeypotResponse,
  isValidEmail,
  json,
  MARKETING_LEAD_CONSENT_VERSION,
  missingFormProxySecretResponse,
  parseJsonBody,
  rateLimit,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 10

const VALID_PRODUCTS = new Set(['coconut', 'plantain', 'poultry', 'eggs', 'palm-oil'])

const PHONE_RE = /^[+()0-9][+()0-9 -]{6,39}$/
const ALLOWED_KEYS = new Set(['name', 'contact', 'product', 'consent', 'consentVersion', 'honey'])

function trimString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateWaitlist(body) {
  if (!hasOnlyKeys(body, ALLOWED_KEYS)) {
    return { error: 'Invalid waitlist request.' }
  }
  if (typeof body.honey !== 'undefined' && typeof body.honey !== 'string') {
    return { error: 'Invalid waitlist request.' }
  }
  if (body.consent !== true) {
    return { error: 'Please consent to Trovara processing your waitlist details.' }
  }
  if (
    typeof body.consentVersion !== 'undefined' &&
    (typeof body.consentVersion !== 'string' || !body.consentVersion.trim() || body.consentVersion.trim().length > 32)
  ) {
    return { error: 'Invalid waitlist request.' }
  }

  const name = trimString(body.name)
  const contact = trimString(body.contact)
  const product = trimString(body.product)
  const consentVersion = trimString(body.consentVersion) || MARKETING_LEAD_CONSENT_VERSION

  if (!name || name.length > 120) return { error: 'Please enter your name.' }
  if (!contact || contact.length > 254) {
    return { error: 'Please enter an email or WhatsApp number.' }
  }
  if (!isValidEmail(contact) && !PHONE_RE.test(contact)) {
    return { error: 'Please enter a valid email or WhatsApp number.' }
  }
  if (!VALID_PRODUCTS.has(product)) {
    return { error: 'Please choose a valid product.' }
  }

  return {
    name,
    contact,
    product,
    consentVersion,
  }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  const missingSecret = missingFormProxySecretResponse()
  if (missingSecret) return missingSecret

  const parsed = await parseJsonBody(request)
  if (parsed.error) return parsed.error

  const honeyHit = honeypotResponse(parsed.body.honey)
  if (honeyHit) return honeyHit

  const ip = getClientIp(request)
  if (!rateLimit(ip, 'waitlist', MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  const validated = validateWaitlist(parsed.body)
  if ('error' in validated) {
    return json(400, { ok: false, error: validated.error })
  }

  const { name, contact, product, consentVersion } = validated
  const result = await forwardToMarketingLeads('waitlist', {
    name,
    contact,
    product,
    consent: true,
    consentVersion,
  }, ip)

  if (!result.ok) {
    return json(result.status, { ok: false, error: result.error })
  }

  return json(200, { ok: true })
}
