import { ref } from 'vue'

/** Analytics consent choice, shared by the banner, the footer, and analytics.ts. */
const STORAGE_KEY = 'trovara-analytics-consent'

export type ConsentChoice = 'granted' | 'denied'

function readStored(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'granted' || raw === 'denied' ? raw : null
  } catch {
    return null
  }
}

export const consent = ref<ConsentChoice | null>(readStored())

// Null means the visitor has not chosen yet, so the banner shows itself on a
// first visit; the footer and privacy page reopen it to change an earlier choice.
export const bannerOpen = ref(consent.value === null)

export function setConsent(choice: ConsentChoice) {
  consent.value = choice
  bannerOpen.value = false
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    /* ignore */
  }
}

export function openConsentBanner() {
  bannerOpen.value = true
}
