const baseUrl = process.env.FUNCTION_BASE_URL?.replace(/\/+$/, '')
const functionNames = ['contact', 'newsletter', 'survey', 'waitlist']
const maxAttempts = 6

if (!baseUrl) {
  throw new Error('FUNCTION_BASE_URL is required')
}

for (const functionName of functionNames) {
  let lastStatus = 0
  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/.netlify/functions/${functionName}`, {
        signal: AbortSignal.timeout(10_000),
      })
      lastStatus = response.status
      lastError = null
      if (response.status === 405) break
    } catch (error) {
      lastError = error
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }
  }

  if (lastStatus !== 405) {
    const detail = lastError instanceof Error ? `: ${lastError.message}` : ''
    throw new Error(`${functionName} failed its startup check (HTTP ${lastStatus || 'unreachable'})${detail}`)
  }

  console.log(`${functionName}: HTTP 405 (handler ready)`)
}
