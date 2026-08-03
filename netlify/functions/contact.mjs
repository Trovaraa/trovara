/**
 * Contact form handler - validates, rate-limits, and forwards to Trovara OS server-side.
 *
 * Local dev: run `netlify dev` (not plain `vite`) to exercise this endpoint at
 * `/.netlify/functions/contact`.
 */
import {
  forwardToMarketingLeads,
  getClientIp,
  hasOnlyKeys,
  honeypotResponse,
  isValidEmail,
  json,
  MARKETING_LEAD_CONSENT_VERSION,
  parseJsonBody,
  rateLimit,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

const VALID_SUBJECTS = new Set([
  'general',
  'bulk-order',
  'waitlist',
  'shop',
  'farm-visit',
  'farm-os',
  'farm-advisory',
  'partnership',
  'export',
  'media',
  'other',
])

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  message: 4000,
}
const ALLOWED_KEYS = new Set(['name', 'email', 'phone', 'message', 'subject', 'consent', 'consentVersion', 'honey'])

function trimString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateContact(body) {
  if (!hasOnlyKeys(body, ALLOWED_KEYS)) {
    return { error: 'Invalid contact request.' }
  }
  if (typeof body.honey !== 'undefined' && typeof body.honey !== 'string') {
    return { error: 'Invalid contact request.' }
  }
  if (body.consent !== true) {
    return { error: 'Please consent to Trovara processing your enquiry details.' }
  }
  if (
    typeof body.consentVersion !== 'undefined' &&
    (typeof body.consentVersion !== 'string' || !body.consentVersion.trim() || body.consentVersion.trim().length > 32)
  ) {
    return { error: 'Invalid contact request.' }
  }

  const name = trimString(body.name)
  const email = trimString(body.email)
  const phone = trimString(body.phone)
  const message = trimString(body.message)
  const subject = trimString(body.subject)
  const consentVersion = trimString(body.consentVersion) || MARKETING_LEAD_CONSENT_VERSION

  if (!name || name.length > LIMITS.name) {
    return { error: 'Please enter your name.' }
  }
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (typeof body.phone !== 'undefined' && typeof body.phone !== 'string') {
    return { error: 'Please enter a valid phone number.' }
  }
  if (phone.length > LIMITS.phone) {
    return { error: 'Phone number is too long.' }
  }
  if (!message || message.length > LIMITS.message) {
    return { error: 'Please enter a message.' }
  }
  if (!VALID_SUBJECTS.has(subject)) {
    return { error: 'Please choose a valid subject.' }
  }

  return { name, email, phone, message, subject, consentVersion }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  const parsed = await parseJsonBody(request)
  if (parsed.error) {
    return parsed.error
  }

  const { body } = parsed

  const honeyHit = honeypotResponse(body.honey)
  if (honeyHit) {
    return honeyHit
  }

  const ip = getClientIp(request)
  if (!rateLimit(ip, 'contact', MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  const validated = validateContact(body)
  if ('error' in validated) {
    return json(400, { ok: false, error: validated.error })
  }

  const { name, email, phone, message, subject, consentVersion } = validated
  const result = await forwardToMarketingLeads('contact', {
    name,
    email,
    ...(phone ? { phone } : {}),
    message,
    subject,
    consent: true,
    consentVersion,
  })

  if (!result.ok) {
    return json(result.status, { ok: false, error: result.error })
  }

  return json(200, { ok: true })
}
