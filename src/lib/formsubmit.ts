export const FORMSUBMIT_EMAIL = 'info@trovara.farm'

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`

interface SubmitOptions {
  subject?: string
  template?: string
  captcha?: boolean
}

interface SubmitResult {
  ok: boolean
  error?: string
}

export async function submitToFormSubmit(
  payload: Record<string, string>,
  options?: SubmitOptions,
): Promise<SubmitResult> {
  try {
    const body: Record<string, string> = {
      ...payload,
      _captcha: String(options?.captcha ?? true),
    }

    if (options?.subject) {
      body._subject = options.subject
    }
    if (options?.template) {
      body._template = options.template
    }

    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await response.json().catch(() => null)
    const requestFailed =
      !response.ok || result?.success === false || result?.success === 'false'

    if (requestFailed) {
      return {
        ok: false,
        error: result?.message ?? 'Failed to submit the form.',
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
