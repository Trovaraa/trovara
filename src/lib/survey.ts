import { SURVEY_CONSENT_VERSION, type SurveyForm } from './survey-questions'

const SURVEY_ENDPOINT = '/.netlify/functions/survey'

interface SubmitResult {
  ok: boolean
  error?: string
}

export function surveyAttribution() {
  const params = new URLSearchParams(window.location.search)
  const referrer = document.referrer && !document.referrer.includes(window.location.host)
    ? document.referrer.slice(0, 500)
    : ''
  return {
    utmSource: params.get('utm_source')?.slice(0, 200) ?? '',
    utmMedium: params.get('utm_medium')?.slice(0, 200) ?? '',
    utmCampaign: params.get('utm_campaign')?.slice(0, 200) ?? '',
    referrer,
  }
}

export async function submitSurvey(form: SurveyForm): Promise<SubmitResult> {
  const attribution = surveyAttribution()
  const wantsFollowUp = form.followUp !== 'no'
  const payload = {
    location: form.location,
    locationOther: form.locationOther.trim(),
    household: form.household,
    buyPlaces: form.buyPlaces,
    buyPlacesOther: form.buyPlacesOther.trim(),
    frequency: form.frequency,
    frustrations: form.frustrations,
    frustrationsOther: form.frustrationsOther.trim(),
    topFrustration: form.frustrations.length === 1 ? form.frustrations[0] : form.topFrustration,
    priorities: form.priorities,
    products: form.products,
    productsOther: form.productsOther.trim(),
    hardToGet: form.hardToGet.trim(),
    sourceMatters: form.sourceMatters,
    shopPreference: form.shopPreference,
    priceExpectation: form.priceExpectation,
    oneChange: form.oneChange.trim(),
    heardFrom: form.heardFrom,
    heardFromOther: form.heardFromOther.trim(),
    followUp: form.followUp,
    name: wantsFollowUp ? form.name.trim() : '',
    contact: wantsFollowUp ? form.contact.trim() : '',
    consent: true as const,
    consentVersion: SURVEY_CONSENT_VERSION,
    honey: form.honey,
    ...attribution,
  }

  try {
    const response = await fetch(SURVEY_ENDPOINT, {
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
        error: result?.error ?? 'We could not save your answers. Please try again.',
      }
    }
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'We could not save your answers.',
    }
  }
}
