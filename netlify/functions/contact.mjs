/**
 * Contact form handler - validates, rate-limits, and forwards to Formspree server-side.
 *
 * Local dev: run `netlify dev` (not plain `vite`) to exercise this endpoint at
 * `/.netlify/functions/contact`.
 *
 * Netlify env: FORMSPREE_FORM_ID (required) - create a form at https://formspree.io
 */
import {
  forwardToFormspree,
  getClientIp,
  honeypotResponse,
  isValidEmail,
  json,
  parseJsonBody,
  rateLimit,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

const SUBJECT_LABELS = {
  general: 'General Enquiry',
  'bulk-order': 'Bulk Order / Wholesale',
  'farm-os': 'Trovara Farm OS (Operations System)',
  partnership: 'Distribution Partnership',
  export: 'Export Enquiry',
  media: 'Media & Press',
  other: 'Other',
}

const VALID_SUBJECTS = new Set(Object.keys(SUBJECT_LABELS))

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  message: 4000,
}

function trimString(value, maxLen) {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim().slice(0, maxLen)
}

function validateContact(body) {
  const name = trimString(body.name, LIMITS.name)
  const email = trimString(body.email, LIMITS.email)
  const phone = trimString(body.phone, LIMITS.phone)
  const message = trimString(body.message, LIMITS.message)
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''

  if (!name) {
    return { error: 'Please enter your name.' }
  }
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (phone.length > LIMITS.phone) {
    return { error: 'Phone number is too long.' }
  }
  if (!message) {
    return { error: 'Please enter a message.' }
  }
  if (!VALID_SUBJECTS.has(subject)) {
    return { error: 'Please choose a valid subject.' }
  }

  const subjectLabel = SUBJECT_LABELS[subject]
  return { name, email, phone, message, subjectLabel }
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

  const { name, email, phone, message, subjectLabel } = validated
  const result = await forwardToFormspree(
    {
      name,
      email,
      phone,
      subject: subjectLabel,
      message,
      formType: 'contact',
    },
    {
      subject: `[Trovara Contact] ${subjectLabel}`,
    },
  )

  if (!result.ok) {
    return json(502, { ok: false, error: result.error ?? 'Failed to submit the form.' })
  }

  return json(200, { ok: true })
}
