/**
 * Newsletter provider strategy:
 * - Default provider is FormSubmit for reliability.
 * - If VITE_BUTTONDOWN_USERNAME is set, the app first tries Buttondown's embed endpoint.
 * - On Buttondown network/CORS/API failure, it gracefully falls back to FormSubmit.
 */
import { submitToFormSubmit } from './formsubmit'

export type NewsletterProvider = 'formsubmit' | 'buttondown'

interface SubscribeResult {
  ok: boolean
  provider: NewsletterProvider
  error?: string
}

async function subscribeViaButtondown(email: string, username: string): Promise<SubscribeResult> {
  try {
    const response = await fetch(`https://buttondown.email/api/emails/embed-subscribe/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        tag: 'website',
      }),
    })

    const result = await response.json().catch(() => null)
    if (!response.ok) {
      return {
        ok: false,
        provider: 'buttondown',
        error: result?.error ?? result?.message ?? 'Buttondown signup failed.',
      }
    }

    return {
      ok: true,
      provider: 'buttondown',
    }
  } catch (error) {
    return {
      ok: false,
      provider: 'buttondown',
      error: error instanceof Error ? error.message : 'Buttondown signup failed.',
    }
  }
}

async function subscribeViaFormSubmit(email: string): Promise<SubscribeResult> {
  const result = await submitToFormSubmit(
    {
      email,
    },
    {
      subject: 'New Trovara newsletter signup',
      template: 'table',
      captcha: true,
    },
  )

  return {
    ok: result.ok,
    provider: 'formsubmit',
    error: result.error,
  }
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const username = import.meta.env.VITE_BUTTONDOWN_USERNAME?.trim()
  if (username) {
    const buttondownResult = await subscribeViaButtondown(email, username)
    if (buttondownResult.ok) {
      return buttondownResult
    }
  }

  return subscribeViaFormSubmit(email)
}
