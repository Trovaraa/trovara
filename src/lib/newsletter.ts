/**
 * Newsletter signups post to a Netlify Function (server-side Buttondown / Formspree).
 * Local dev: use `netlify dev` — plain `vite` cannot reach `/.netlify/functions/*`.
 */
const NEWSLETTER_ENDPOINT = '/.netlify/functions/newsletter'

interface SubscribeResult {
  ok: boolean
  error?: string
}

export async function subscribeToNewsletter(
  email: string,
  honey = '',
): Promise<SubscribeResult> {
  try {
    const response = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, honey }),
    })

    const result = (await response.json().catch(() => null)) as SubscribeResult | null

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        error: result?.error ?? 'Failed to subscribe.',
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to subscribe.',
    }
  }
}
