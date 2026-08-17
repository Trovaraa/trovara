const JOURNAL_API_BASE = (import.meta.env.VITE_JOURNAL_API_URL || '/journal-api').replace(/\/+$/, '')

export type JournalComment = {
  id: string
  authorName: string
  body: string
  createdAt: string
}

export type JournalEngagement = {
  likeCount: number
  liked: boolean
  comments: JournalComment[]
}

class JournalEngagementError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'JournalEngagementError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${JOURNAL_API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new JournalEngagementError('The conversation is temporarily unavailable.', 0)
  }
  const data = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) {
    throw new JournalEngagementError(
      typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.',
      response.status,
    )
  }
  return data
}

function slugPath(slug: string): string {
  return `/${encodeURIComponent(slug)}`
}

export const journalEngagementApi = {
  get: (slug: string) => request<JournalEngagement>(`${slugPath(slug)}/engagement`),
  toggleLike: (slug: string) =>
    request<{ liked: boolean; likeCount: number }>(`${slugPath(slug)}/like`, { method: 'POST' }),
  comment: (slug: string, body: { name: string; body: string; honey?: string }) =>
    request<{ ok: true; status: 'pending' }>(`${slugPath(slug)}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

