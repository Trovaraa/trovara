/**
 * Product waitlist handler. Captures interest only; it does not create an order or take payment.
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
const MAX_REQUESTS = 10

const PRODUCT_LABELS = {
  poultry: 'Pasture-raised Chicken',
  eggs: 'Pasture-raised Eggs',
  'palm-oil': 'Palm Oil',
}

const PHONE_RE = /^[+()\d][+()\d\s-]{6,39}$/

function trimString(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validateWaitlist(body) {
  const name = trimString(body.name, 120)
  const contact = trimString(body.contact, 254)
  const product = trimString(body.product, 40)

  if (!name) return { error: 'Please enter your name.' }
  if (!contact) return { error: 'Please enter an email or WhatsApp number.' }
  if (!isValidEmail(contact) && !PHONE_RE.test(contact)) {
    return { error: 'Please enter a valid email or WhatsApp number.' }
  }
  if (!Object.prototype.hasOwnProperty.call(PRODUCT_LABELS, product)) {
    return { error: 'Please choose a valid product.' }
  }

  return {
    name,
    contact,
    email: isValidEmail(contact) ? contact : '',
    phone: isValidEmail(contact) ? '' : contact,
    productLabel: PRODUCT_LABELS[product],
  }
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
  if (!rateLimit(ip, 'waitlist', MAX_REQUESTS, WINDOW_MS)) {
    return json(429, { ok: false, error: 'Too many requests. Please try again later.' })
  }

  const validated = validateWaitlist(parsed.body)
  if ('error' in validated) {
    return json(400, { ok: false, error: validated.error })
  }

  const { name, contact, email, phone, productLabel } = validated
  const result = await forwardToFormspree(
    {
      name,
      contact,
      email,
      phone,
      product: productLabel,
      subject: `${productLabel} waitlist`,
      message: `${name} joined the ${productLabel} availability waitlist.`,
      formType: 'product-waitlist',
    },
    { subject: `[Trovara Waitlist] ${productLabel}` },
  )

  if (!result.ok) {
    return json(502, { ok: false, error: result.error ?? 'Failed to join the waitlist.' })
  }

  return json(200, { ok: true })
}
