/**
 * Newsletter signup handler - validates, rate-limits, forwards to Buttondown or Formspree.
 *
 * Local dev: run `netlify dev` (not plain `vite`) to exercise this endpoint at
 * `/.netlify/functions/newsletter`.
 *
 * Netlify env:
 *   BUTTONDOWN_USERNAME            - optional; tried first when set
 *   FORMSPREE_NEWSLETTER_FORM_ID   - optional dedicated Formspree form
 *   FORMSPREE_FORM_ID              - fallback Formspree form
 */
import {
  forwardToFormspree,
  getClientIp,
  honeypotResponse,
  isValidEmail,
  json,
  parseJsonBody,
  rateLimit,
  subscribeViaButtondown,
} from './_shared.mjs'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 10

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
  if (!rateLimit(ip, 'newsletter', MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : ''
  if (!isValidEmail(email)) {
    return json(400, { ok: false, error: 'Please enter a valid email address.' })
  }

  const username = process.env.BUTTONDOWN_USERNAME?.trim()
  if (username) {
    const buttondownResult = await subscribeViaButtondown(email, username)
    if (buttondownResult.ok) {
      return json(200, { ok: true })
    }
  }

  const newsletterFormId =
    process.env.FORMSPREE_NEWSLETTER_FORM_ID?.trim() || process.env.FORMSPREE_FORM_ID?.trim()

  const result = await forwardToFormspree(
    {
      email,
      formType: 'newsletter',
    },
    {
      subject: 'New Trovara newsletter signup',
      formId: newsletterFormId,
    },
  )

  if (!result.ok) {
    return json(502, { ok: false, error: result.error ?? 'Failed to subscribe.' })
  }

  return json(200, { ok: true })
}
