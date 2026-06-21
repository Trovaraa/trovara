const NEWSLETTER_EMAIL = 'info@trovara.farm'

export default async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email address' }, 400)
    }

    const response = await fetch(`https://formsubmit.co/ajax/${NEWSLETTER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: 'New Trovara newsletter signup',
        _template: 'table',
        _captcha: 'false',
        email,
      }),
    })

    const result = await response.json().catch(() => ({}))

    if (result.success === 'false' || result.error) {
      return json({ error: result.message ?? 'Subscription failed' }, 502)
    }

    return json({ success: true })
  } catch {
    return json({ error: 'Server error' }, 500)
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
