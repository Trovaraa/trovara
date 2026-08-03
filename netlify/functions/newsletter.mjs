/**
 * Same-origin proxy for the public Trovara OS newsletter API.
 *
 * Local dev: run `netlify dev` (not plain `vite`) and set NEWSLETTER_API_URL
 * to a local OS endpoint when needed.
 *
 * Netlify env (required — no production hardcode; preview deploys fail closed):
 *   NEWSLETTER_API_URL - base URL ending in /public/newsletter
 */
import {
  getClientIp,
  hasOnlyKeys,
  honeypotResponse,
  isValidEmail,
  json,
  parseJsonBody,
  rateLimit,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 10
const REQUEST_TIMEOUT_MS = 10_000
const ACTIONS = new Set(['subscribe', 'confirm', 'unsubscribe'])
const TOKEN_RE = /^[A-Za-z0-9._~+/=-]+$/

function cleanApiUrl() {
  const configured = process.env.NEWSLETTER_API_URL?.trim()
  if (!configured) return null
  try {
    const url = new URL(configured)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null
    return url.toString().replace(/\/+$/, '')
  } catch {
    return null
  }
}

function validateSubscribe(body) {
  const allowed = new Set(['action', 'name', 'email', 'phone', 'consent', 'phoneConsent', 'honey'])
  if (!hasOnlyKeys(body, allowed)) {
    return { error: 'Invalid newsletter request.' }
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const honey = typeof body.honey === 'string' ? body.honey : ''

  if (!name || name.length > 120) return { error: 'Please enter your full name.' }
  if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' }
  if (phone.length > 40) return { error: 'Please enter a valid phone number.' }
  if (body.consent !== true) return { error: 'Email newsletter consent is required.' }
  if (typeof body.phoneConsent !== 'boolean') {
    return { error: 'Phone consent must be explicitly selected.' }
  }
  if (phone && body.phoneConsent !== true) {
    return { error: 'Phone/WhatsApp consent is required when a phone number is provided.' }
  }
  if (!phone && body.phoneConsent !== false) {
    return { error: 'Phone consent cannot be granted without a phone number.' }
  }
  if (typeof body.honey !== 'undefined' && typeof body.honey !== 'string') {
    return { error: 'Invalid newsletter request.' }
  }

  return {
    payload: {
      name,
      email,
      ...(phone ? { phone } : {}),
      consent: true,
      phoneConsent: body.phoneConsent,
      ...(honey ? { honey } : {}),
    },
  }
}

function validateTokenAction(body) {
  if (!hasOnlyKeys(body, new Set(['action', 'token']))) {
    return { error: 'Invalid newsletter request.' }
  }
  const token = typeof body.token === 'string' ? body.token.trim() : ''
  if (!token || token.length > 2048 || !TOKEN_RE.test(token)) {
    return { error: 'This newsletter link is invalid.' }
  }
  return { payload: { token } }
}

async function proxyToNewsletterApi(action, payload) {
  const apiUrl = cleanApiUrl()
  if (!apiUrl) {
    return json(503, {
      ok: false,
      error:
        'Newsletter service is not configured. Set NEWSLETTER_API_URL to the Trovara OS /public/newsletter base.',
    })
  }

  try {
    const response = await fetch(`${apiUrl}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const result = await response.json().catch(() => null)
    const message =
      result && typeof result === 'object' && typeof result.message === 'string'
        ? result.message
        : undefined
    const upstreamError =
      result && typeof result === 'object' && typeof result.error === 'string'
        ? result.error
        : undefined

    if (!response.ok || !result || typeof result !== 'object' || result.ok !== true) {
      const status = response.ok
        ? 400
        : response.status >= 400 && response.status < 500
          ? response.status
          : 502
      return json(status, {
        ok: false,
        error:
          status < 500 && upstreamError
            ? upstreamError
            : 'Newsletter service is temporarily unavailable. Please try again.',
      })
    }

    return json(200, { ok: true, ...(message ? { message } : {}) })
  } catch {
    return json(502, {
      ok: false,
      error: 'Newsletter service is temporarily unavailable. Please try again.',
    })
  }
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
  const action = typeof body.action === 'string' ? body.action : ''
  if (!ACTIONS.has(action)) {
    return json(400, { ok: false, error: 'Invalid newsletter action.' })
  }

  const ip = getClientIp(request)
  if (!rateLimit(ip, `newsletter:${action}`, MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  if (action === 'subscribe') {
    const honeyHit = honeypotResponse(body.honey)
    if (honeyHit) return honeyHit
  }

  const validated =
    action === 'subscribe' ? validateSubscribe(body) : validateTokenAction(body)
  if (validated.error) {
    return json(400, { ok: false, error: validated.error })
  }

  return proxyToNewsletterApi(action, validated.payload)
}
