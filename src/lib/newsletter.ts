/**
 * Newsletter actions use a same-origin Netlify Function proxy.
 * Local dev: use `netlify dev` - plain `vite` cannot reach `/.netlify/functions/*`.
 */
const NEWSLETTER_ENDPOINT = '/.netlify/functions/newsletter'

export interface NewsletterResult {
  ok: boolean
  message?: string
  error?: string
}

export interface NewsletterSubscription {
  name: string
  email: string
  phone?: string
  consent: true
  phoneConsent: boolean
  honey?: string
}

type NewsletterRequest =
  | ({ action: 'subscribe' } & NewsletterSubscription)
  | { action: 'confirm'; token: string }
  | { action: 'unsubscribe'; token: string }

async function requestNewsletter(
  request: NewsletterRequest,
  fallbackError: string,
): Promise<NewsletterResult> {
  try {
    const response = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request),
    })

    const result = (await response.json().catch(() => null)) as NewsletterResult | null

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        error: result?.error ?? fallbackError,
      }
    }

    return { ok: true, message: result.message }
  } catch {
    return {
      ok: false,
      error: fallbackError,
    }
  }
}

export function subscribeToNewsletter(
  subscription: NewsletterSubscription,
): Promise<NewsletterResult> {
  return requestNewsletter(
    { action: 'subscribe', ...subscription },
    'Failed to subscribe. Please try again.',
  )
}

export function confirmNewsletter(token: string): Promise<NewsletterResult> {
  return requestNewsletter(
    { action: 'confirm', token },
    'We could not confirm this subscription. Please try again.',
  )
}

export function unsubscribeFromNewsletter(token: string): Promise<NewsletterResult> {
  return requestNewsletter(
    { action: 'unsubscribe', token },
    'We could not unsubscribe this address. Please try again.',
  )
}
