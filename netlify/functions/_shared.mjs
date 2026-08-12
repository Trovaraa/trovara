/**
 * Shared helpers for Trovara Netlify form functions.
 *
 * Local Vite (`npm run dev`) loads these via `scripts/vite-netlify-functions-dev.mjs`;
 * production / `npm run dev:netlify` use Netlify Functions.
 */
import { createHash, createHmac, randomUUID } from 'node:crypto'

const RATE_BUCKETS = new Map()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MARKETING_LEADS_TIMEOUT_MS = 10_000

/** Keep in sync with `src/lib/marketing-lead-consent.ts`. */
export const MARKETING_LEAD_CONSENT_VERSION = '1.0'

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return (
    request.headers.get('client-ip') ??
    request.headers.get('x-nf-client-connection-ip') ??
    'unknown'
  )
}

export function trustedClientHeaders(ip) {
  const secret = process.env.FORM_PROXY_SIGNING_SECRET?.trim()
  if (!secret) return { 'X-Request-ID': randomUUID() }
  const timestamp = String(Date.now())
  const clientId = createHash('sha256').update(ip).digest('base64url')
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${clientId}`)
    .digest('base64url')
  return {
    'X-Request-ID': randomUUID(),
    'X-Trovara-Client-Id': clientId,
    'X-Trovara-Client-Timestamp': timestamp,
    'X-Trovara-Client-Signature': signature,
  }
}

/**
 * @returns {Response | null} fake success when honeypot tripped, else null
 */
export function honeypotResponse(honey) {
  if (typeof honey === 'string' && honey.trim() !== '') {
    return json(200, { ok: true })
  }
  return null
}

export function rateLimit(ip, namespace, limit, windowMs) {
  const key = `${namespace}:${ip}`
  const now = Date.now()
  let bucket = RATE_BUCKETS.get(key)
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs }
    RATE_BUCKETS.set(key, bucket)
  }
  bucket.count += 1
  return bucket.count <= limit
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 254 && EMAIL_RE.test(value)
}

export function hasOnlyKeys(body, allowed) {
  return Object.keys(body).every((key) => allowed.has(key))
}

function marketingLeadsApiUrl() {
  const configured = process.env.MARKETING_LEADS_API_URL?.trim()
  if (!configured) return null

  try {
    const url = new URL(configured)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null
    }
    return url.toString().replace(/\/+$/, '')
  } catch {
    return null
  }
}

function safeClientError(result) {
  if (!result || typeof result !== 'object' || typeof result.error !== 'string') {
    return null
  }

  const message = result.error.trim()
  // Reject control chars / markup in upstream error text before echoing to clients.
  // eslint-disable-next-line no-control-regex -- intentional control-char gate
  if (!message || message.length > 300 || /[\u0000-\u001f\u007f<>]/.test(message)) {
    return null
  }
  return message
}

/**
 * POST a validated lead to Trovara OS.
 * @param {'contact' | 'waitlist'} resource
 * @param {Record<string, string>} payload
 */
export async function forwardToMarketingLeads(resource, payload, clientIp = 'unknown') {
  const baseUrl = marketingLeadsApiUrl()
  if (!baseUrl) {
    return {
      ok: false,
      status: 503,
      error: 'Form service is not configured.',
    }
  }

  try {
    const response = await fetch(`${baseUrl}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...trustedClientHeaders(clientIp),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(MARKETING_LEADS_TIMEOUT_MS),
    })

    const result = await response.json().catch(() => null)
    if (
      response.status === 202 &&
      result &&
      typeof result === 'object' &&
      result.ok === true &&
      result.accepted === true
    ) {
      return { ok: true }
    }

    if (response.status >= 400 && response.status < 500) {
      return {
        ok: false,
        status: response.status,
        error: safeClientError(result) ?? 'The submitted information was not accepted.',
      }
    }

    return {
      ok: false,
      status: 502,
      error: 'Form service is temporarily unavailable. Please try again.',
    }
  } catch {
    return {
      ok: false,
      status: 502,
      error: 'Form service is temporarily unavailable. Please try again.',
    }
  }
}

export async function parseJsonBody(request) {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return { error: json(415, { ok: false, error: 'Content-Type must be application/json' }) }
  }

  try {
    const body = await request.json()
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return { error: json(400, { ok: false, error: 'Invalid JSON body' }) }
    }
    return { body }
  } catch {
    return { error: json(400, { ok: false, error: 'Invalid JSON body' }) }
  }
}
