/**
 * Shared helpers for Trovara Netlify form functions.
 *
 * Local dev: these functions only run with `netlify dev` (netlify-cli), not plain `vite dev`.
 *
 * Netlify env (Site settings → Environment variables):
 *   FORMSPREE_FORM_ID            - Formspree form id from https://formspree.io (required for contact)
 *   FORMSPREE_NEWSLETTER_FORM_ID - optional separate Formspree form for newsletter; falls back to FORMSPREE_FORM_ID
 *   BUTTONDOWN_USERNAME          - optional; tried before Formspree for newsletter
 */

const RATE_BUCKETS = new Map()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function formspreeEndpoint(formId) {
  const id = formId?.trim()
  if (!id) return null
  // Allow full URL or bare form id (e.g. xpzgkqyw)
  if (id.startsWith('https://')) return id
  return `https://formspree.io/f/${encodeURIComponent(id)}`
}

function formspreeErrorMessage(result, status) {
  if (!result || typeof result !== 'object') {
    return `Formspree request failed (${status}).`
  }
  if (typeof result.error === 'string' && result.error.trim()) {
    return result.error
  }
  if (Array.isArray(result.errors) && result.errors.length) {
    const parts = result.errors.map((e) => e.message || e.field || String(e)).filter(Boolean)
    if (parts.length) return parts.join(' ')
  }
  return `Formspree request failed (${status}).`
}

/**
 * POST JSON to Formspree. Works from Netlify Functions (unlike FormSubmit's browser-only checks).
 *
 * @param {Record<string, string>} fields
 * @param {{ subject?: string, formId?: string }} [options]
 */
export async function forwardToFormspree(fields, options = {}) {
  const formId = options.formId?.trim() || process.env.FORMSPREE_FORM_ID?.trim()
  const endpoint = formspreeEndpoint(formId)
  if (!endpoint) {
    return {
      ok: false,
      error: 'Form delivery is not configured. Set FORMSPREE_FORM_ID in Netlify.',
    }
  }

  const body = { ...fields }
  if (options.subject) {
    body._subject = options.subject
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    })

    const result = await response.json().catch(() => null)
    if (!response.ok) {
      return {
        ok: false,
        error: formspreeErrorMessage(result, response.status),
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Formspree request failed.',
    }
  }
}

export async function subscribeViaButtondown(email, username) {
  try {
    const response = await fetch(
      `https://buttondown.email/api/emails/embed-subscribe/${encodeURIComponent(username)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, tag: 'website' }),
        signal: AbortSignal.timeout(12_000),
      },
    )

    const result = await response.json().catch(() => null)
    if (!response.ok) {
      return {
        ok: false,
        error: result?.error ?? result?.message ?? 'Buttondown signup failed.',
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Buttondown signup failed.',
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
