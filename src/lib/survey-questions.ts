export const SURVEY_CONSENT_VERSION = '1.0'

export type SurveyOption = { value: string; label: string }

export const SURVEY_LOCATIONS: SurveyOption[] = [
  { value: 'lagos_island', label: 'Lagos Island' },
  { value: 'lagos_mainland', label: 'Lagos Mainland' },
  { value: 'abeokuta', label: 'Abeokuta' },
  { value: 'other_ogun', label: 'Other Ogun State' },
  { value: 'abuja', label: 'Abuja' },
  { value: 'other', label: 'Other' },
]

export const SURVEY_HOUSEHOLDS: SurveyOption[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3_4', label: '3–4' },
  { value: '5_6', label: '5–6' },
  { value: '7_plus', label: '7+' },
]

export const SURVEY_BUY_PLACES: SurveyOption[] = [
  { value: 'open_market', label: 'Open market' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'neighbourhood_shop', label: 'Neighbourhood shops' },
  { value: 'farm_direct', label: 'Directly from farms/farmers' },
  { value: 'online_grocery', label: 'Online grocery service' },
  { value: 'social_vendors', label: 'WhatsApp/Instagram vendors' },
  { value: 'roadside', label: 'Roadside/mobile vendors' },
  { value: 'other', label: 'Other' },
]

export const SURVEY_FREQUENCIES: SurveyOption[] = [
  { value: 'more_than_weekly', label: 'More than once a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'irregularly', label: 'Irregularly' },
]

export const SURVEY_FRUSTRATIONS: SurveyOption[] = [
  { value: 'prices_change', label: 'Prices change too frequently' },
  { value: 'inconsistent_quality', label: 'Inconsistent quality' },
  { value: 'not_fresh', label: "Food isn't fresh enough" },
  { value: 'spoils_quickly', label: 'Food spoils too quickly' },
  { value: 'takes_too_long', label: 'Shopping takes too much time' },
  { value: 'several_places', label: 'Having to shop in several places' },
  { value: 'markets_stressful', label: 'Markets are stressful/inconvenient' },
  { value: 'unknown_source', label: 'Difficult to know where food comes from/how it was handled' },
  { value: 'unreliable_sellers', label: 'Unreliable sellers' },
  { value: 'poor_delivery', label: 'Poor or unreliable delivery' },
  { value: 'unavailable', label: 'Products I want are frequently unavailable' },
  { value: 'poor_packaging', label: 'Poor packaging' },
  { value: 'other', label: 'Other' },
]

export const SURVEY_PRIORITIES: SurveyOption[] = [
  { value: 'price', label: 'Price' },
  { value: 'freshness', label: 'Freshness' },
  { value: 'taste', label: 'Taste' },
  { value: 'consistent_quality', label: 'Consistent quality' },
  { value: 'convenience', label: 'Convenience' },
  { value: 'food_safety', label: 'Food safety' },
  { value: 'origin', label: 'Knowing where the food came from' },
  { value: 'availability', label: 'Reliable availability' },
  { value: 'home_delivery', label: 'Home delivery' },
  { value: 'one_place', label: 'Ability to buy most things in one place' },
]

export const SURVEY_PRODUCTS: SurveyOption[] = [
  { value: 'eggs', label: 'Eggs' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'plantain', label: 'Plantain' },
  { value: 'yam', label: 'Yam' },
  { value: 'sweet_potato', label: 'Sweet potato' },
  { value: 'tomatoes', label: 'Tomatoes' },
  { value: 'pepper', label: 'Pepper' },
  { value: 'onions', label: 'Onions' },
  { value: 'leafy_veg', label: 'Leafy vegetables' },
  { value: 'other_veg', label: 'Other vegetables such as Okro' },
  { value: 'palm_oil', label: 'Palm oil' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'other', label: 'Other' },
]

export const SURVEY_SOURCE_MATTERS: SurveyOption[] = [
  { value: 'definitely', label: 'Definitely' },
  { value: 'probably', label: 'Probably' },
  { value: 'not_sure', label: 'Not sure' },
  { value: 'probably_not', label: 'Probably not' },
  { value: 'definitely_not', label: 'Definitely not' },
]

export const SURVEY_SHOP_PREFS: SurveyOption[] = [
  { value: 'individual', label: 'Select everything individually' },
  { value: 'prepared_basket', label: 'Choose a prepared food basket' },
  { value: 'customise_basket', label: 'Start with a recommended basket and customise it' },
  { value: 'repeat_order', label: 'Quickly repeat my previous order' },
  { value: 'no_preference', label: 'No particular preference' },
]

export const SURVEY_PRICE_EXPECTATIONS: SurveyOption[] = [
  { value: 'cheaper', label: 'It should be cheaper' },
  { value: 'same', label: 'About the same as I pay now' },
  { value: 'up_to_5', label: 'I would pay up to 5% more' },
  { value: '5_to_10', label: 'I would pay 5–10% more' },
  { value: 'more_than_10', label: 'I would pay more than 10% if the difference is worthwhile' },
]

export const SURVEY_HEARD_FROM: SurveyOption[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'friend', label: 'Friend or family' },
  { value: 'website', label: 'trovara.farm' },
  { value: 'other', label: 'Other' },
]

export const SURVEY_FOLLOW_UP: SurveyOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
]

export const SURVEY_STEPS = [
  { id: 'about', title: 'About you', blurb: 'A few details so we can read the answers in context.' },
  { id: 'buying', title: 'How you buy food', blurb: 'Where shopping happens today.' },
  { id: 'pain', title: 'What gets in the way', blurb: 'The problems that show up most often.' },
  { id: 'trust', title: 'What matters', blurb: 'Quality, origin, and the foods that are hardest to get right.' },
  { id: 'offer', title: 'A better way to shop', blurb: 'How you would like buying fresh food to work.' },
  { id: 'followup', title: 'Optional follow-up', blurb: 'Only if you want us to get in touch.' },
] as const

export type SurveyForm = {
  location: string
  locationOther: string
  household: string
  buyPlaces: string[]
  buyPlacesOther: string
  frequency: string
  frustrations: string[]
  frustrationsOther: string
  topFrustration: string
  priorities: string[]
  products: string[]
  productsOther: string
  hardToGet: string
  sourceMatters: string
  shopPreference: string
  priceExpectation: string
  oneChange: string
  heardFrom: string
  heardFromOther: string
  followUp: string
  name: string
  contact: string
  consent: boolean
  honey: string
}

export function emptySurveyForm(): SurveyForm {
  return {
    location: '',
    locationOther: '',
    household: '',
    buyPlaces: [],
    buyPlacesOther: '',
    frequency: '',
    frustrations: [],
    frustrationsOther: '',
    topFrustration: '',
    priorities: [],
    products: [],
    productsOther: '',
    hardToGet: '',
    sourceMatters: '',
    shopPreference: '',
    priceExpectation: '',
    oneChange: '',
    heardFrom: '',
    heardFromOther: '',
    followUp: '',
    name: '',
    contact: '',
    consent: false,
    honey: '',
  }
}

function hasValue(options: SurveyOption[], value: string): boolean {
  return options.some((option) => option.value === value)
}

function looksLikeContact(value: string): boolean {
  const trimmed = value.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254) return true
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

export function validateSurveyStep(step: number, form: SurveyForm): string | null {
  if (step === 0) {
    if (!hasValue(SURVEY_LOCATIONS, form.location)) return 'Please choose where you live.'
    if (form.location === 'other' && !form.locationOther.trim()) return 'Please specify where you live.'
    if (!hasValue(SURVEY_HOUSEHOLDS, form.household)) return 'Please choose your household size.'
    if (!hasValue(SURVEY_HEARD_FROM, form.heardFrom)) return 'Please tell us how you heard about Trovara Farm.'
    if (form.heardFrom === 'other' && !form.heardFromOther.trim()) return 'Please specify how you heard about us.'
  }
  if (step === 1) {
    if (form.buyPlaces.length < 1 || form.buyPlaces.length > 3) return 'Choose up to 3 places where you buy most of your fresh food.'
    if (form.buyPlaces.includes('other') && !form.buyPlacesOther.trim()) return 'Please specify the other place you shop.'
    if (!hasValue(SURVEY_FREQUENCIES, form.frequency)) return 'Please choose how often you buy fresh food.'
    if (form.products.length < 1 || form.products.length > 8) return 'Choose up to 8 products you buy regularly.'
    if (form.products.includes('other') && !form.productsOther.trim()) return 'Please specify the other product.'
  }
  if (step === 2) {
    if (form.frustrations.length < 1 || form.frustrations.length > 4) return 'Choose up to 4 frustrations.'
    if (form.frustrations.includes('other') && !form.frustrationsOther.trim()) {
      return 'Please specify the other frustration.'
    }
    if (form.frustrations.length > 1 && !form.frustrations.includes(form.topFrustration)) {
      return 'Choose the one problem that bothers you most.'
    }
  }
  if (step === 3) {
    if (form.priorities.length !== 3) return 'Choose exactly three things that matter most.'
    if (!hasValue(SURVEY_SOURCE_MATTERS, form.sourceMatters)) {
      return 'Please say whether knowing the farm or source would change a purchase.'
    }
    if (!form.hardToGet.trim()) return 'Please tell us which foods are hardest to get at the quality you want.'
  }
  if (step === 4) {
    if (!hasValue(SURVEY_SHOP_PREFS, form.shopPreference)) return 'Please choose how you would prefer to shop.'
    if (!hasValue(SURVEY_PRICE_EXPECTATIONS, form.priceExpectation)) return 'Please choose a price expectation.'
    if (!form.oneChange.trim()) return 'Please tell us the one thing you would change.'
  }
  if (step === 5) {
    if (!hasValue(SURVEY_FOLLOW_UP, form.followUp)) return 'Please say whether we may follow up.'
    if (form.followUp !== 'no' && !looksLikeContact(form.contact)) {
      return 'Enter a WhatsApp number or email so we can follow up.'
    }
    if (!form.consent) return 'Please consent to Trovara storing your survey answers.'
  }
  return null
}

export function toggleChoice(current: string[], value: string, max: number): string[] {
  if (current.includes(value)) return current.filter((item) => item !== value)
  if (current.length >= max) return current
  return [...current, value]
}
