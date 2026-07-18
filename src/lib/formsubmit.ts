const CONTACT_ENDPOINT = '/.netlify/functions/contact'

export interface ContactPayload {
  name: string
  email: string
  phone: string
  message: string
  /** Subject key, e.g. `general`, `bulk-order` */
  subject: string
  honey?: string
}

interface SubmitResult {
  ok: boolean
  error?: string
}

export async function submitContactForm(payload: ContactPayload): Promise<SubmitResult> {
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
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
        error: result?.error ?? 'Failed to submit the form.',
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to submit the form.',
    }
  }
}

/** @deprecated Use submitContactForm */
export const submitToFormSubmit = submitContactForm

// Client posts only to our Netlify function; Formspree credentials stay server-side.
