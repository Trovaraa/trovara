const WAITLIST_ENDPOINT = '/.netlify/functions/waitlist'

export interface WaitlistPayload {
  name: string
  contact: string
  product: string
  consent: true
  consentVersion: string
  honey?: string
}

interface SubmitResult {
  ok: boolean
  error?: string
}

export async function submitWaitlist(payload: WaitlistPayload): Promise<SubmitResult> {
  try {
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = (await response.json().catch(() => null)) as SubmitResult | null

    if (!response.ok || !result?.ok) {
      return {
        ok: false,
        error: result?.error ?? 'We could not add you to the waitlist. Please try again.',
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'We could not add you to the waitlist.',
    }
  }
}
