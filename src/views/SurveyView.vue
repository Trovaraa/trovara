<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BrandIcon from '../components/brand/BrandIcon.vue'
import { submitSurvey } from '../lib/survey'
import { SOCIAL_LINKS } from '../lib/social'
import {
  SURVEY_BUY_PLACES,
  SURVEY_FOLLOW_UP,
  SURVEY_FREQUENCIES,
  SURVEY_FRUSTRATIONS,
  SURVEY_HEARD_FROM,
  SURVEY_HOUSEHOLDS,
  SURVEY_LOCATIONS,
  SURVEY_PRICE_EXPECTATIONS,
  SURVEY_PRIORITIES,
  SURVEY_PRODUCTS,
  SURVEY_SHOP_PREFS,
  SURVEY_SOURCE_MATTERS,
  SURVEY_STEPS,
  emptySurveyForm,
  toggleChoice,
  validateSurveyStep,
} from '../lib/survey-questions'

const DRAFT_KEY = 'trovara-food-survey-v1'
const fieldClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm'
const choiceClass = (active: boolean) =>
  [
    'w-full rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-45',
    active
      ? 'border-trovara-green bg-trovara-green/10 font-semibold text-trovara-dark'
      : 'border-gray-200 bg-trovara-cream text-trovara-dark hover:border-trovara-green/40',
  ].join(' ')

const form = reactive(emptySurveyForm())
const step = ref(0)
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const stepError = ref('')
const formCard = ref<HTMLElement | null>(null)
const stepHeading = ref<HTMLElement | null>(null)
const errorMessage = ref<HTMLElement | null>(null)

const progress = computed(() => ((step.value + 1) / SURVEY_STEPS.length) * 100)
const currentStep = computed(() => SURVEY_STEPS[step.value]!)
const needsTopFrustration = computed(() => form.frustrations.length > 1)
const wantsFollowUp = computed(() => form.followUp === 'yes' || form.followUp === 'maybe')

watch(
  () => form.frustrations.slice(),
  (values) => {
    if (values.length === 1) form.topFrustration = values[0] ?? ''
    if (form.topFrustration && !values.includes(form.topFrustration)) form.topFrustration = ''
  },
)

function persistDraft() {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step: step.value, form }))
  } catch {
    /* ignore quota / private mode */
  }
}

function restoreDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return
    const draft = JSON.parse(raw) as { step?: number; form?: Record<string, unknown> }
    if (draft.form && typeof draft.form === 'object') Object.assign(form, emptySurveyForm(), draft.form)
    if (typeof draft.step === 'number' && draft.step >= 0 && draft.step < SURVEY_STEPS.length) {
      step.value = draft.step
    }
  } catch {
    sessionStorage.removeItem(DRAFT_KEY)
  }
}

function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}

onMounted(restoreDraft)
watch([step, form], persistDraft, { deep: true })

function selectOne(field: 'location' | 'household' | 'frequency' | 'sourceMatters' | 'shopPreference' | 'priceExpectation' | 'heardFrom' | 'followUp' | 'topFrustration', value: string) {
  form[field] = value
  stepError.value = ''
}

function toggle(field: 'buyPlaces' | 'frustrations' | 'priorities' | 'products', value: string, max: number) {
  form[field] = toggleChoice(form[field], value, max)
  stepError.value = ''
}

function choiceLimitReached(current: string[], value: string, max: number): boolean {
  return current.length >= max && !current.includes(value)
}

async function focusStepStart() {
  await nextTick()
  formCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  stepHeading.value?.focus({ preventScroll: true })
}

async function focusValidationError() {
  await nextTick()
  errorMessage.value?.focus({ preventScroll: false })
}

function goNext() {
  const error = validateSurveyStep(step.value, form)
  if (error) {
    stepError.value = error
    void focusValidationError()
    return
  }
  stepError.value = ''
  if (step.value < SURVEY_STEPS.length - 1) {
    step.value += 1
    void focusStepStart()
  }
}

function goBack() {
  stepError.value = ''
  if (step.value > 0) {
    step.value -= 1
    void focusStepStart()
  }
}

async function handleSubmit() {
  submitError.value = ''
  if (form.honey.trim()) {
    submitted.value = true
    clearDraft()
    return
  }
  const error = validateSurveyStep(step.value, form)
  if (error) {
    stepError.value = error
    void focusValidationError()
    return
  }
  submitting.value = true
  const result = await submitSurvey(form)
  submitting.value = false
  if (!result.ok) {
    submitError.value = result.error ?? 'Something went wrong. Please try again.'
    return
  }
  submitted.value = true
  clearDraft()
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-trovara-green pb-10 pt-24 sm:pb-16 sm:pt-28">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 mx-auto max-w-3xl text-center">
        <p class="section-subheading text-trovara-gold-300 mb-4">Customer food survey</p>
        <h1 class="mb-6 text-4xl font-black text-white sm:text-5xl md:text-6xl">
          How could buying fresh food be better?
        </h1>
        <p class="text-lg leading-relaxed text-white/70">
          We are learning how Nigerian households buy fresh food — what works, and what should change.
          This takes about 5 minutes. You can skip contact details unless you want a follow-up.
        </p>
      </div>
    </section>

    <section class="bg-trovara-cream py-14 sm:py-20">
      <div class="container-trovara max-w-3xl">
        <div ref="formCard" class="scroll-mt-24 rounded-3xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div v-if="submitted" class="py-12 text-center">
            <BrandIcon name="sprout" class="mx-auto mb-4 h-16 w-16" />
            <h2 class="mb-3 text-2xl font-black text-trovara-dark">Thank you.</h2>
            <p class="mb-6 text-gray-500">
              Your answers help us design a farm-to-table service that fits how people actually shop.
            </p>
            <p v-if="wantsFollowUp && form.contact.includes('@')" class="mx-auto mb-6 max-w-xl rounded-2xl bg-trovara-cream p-4 text-sm leading-6 text-gray-600">
              Because you asked us to stay in touch and provided an email, you are eligible for a Trovara Credits invitation. Watch your inbox for the account claim link.
            </p>
            <RouterLink to="/products" class="btn-primary">See what we are growing</RouterLink>
            <div class="mt-9 border-t border-gray-100 pt-7">
              <p class="text-sm font-bold text-trovara-dark">Follow what grows next</p>
              <p class="mt-1 text-xs text-gray-500">Following is optional and does not affect your survey or Trovara Credits eligibility.</p>
              <div class="mt-4 flex flex-wrap justify-center gap-2">
                <a v-for="social in SOCIAL_LINKS" :key="social.id" :href="social.href" target="_blank" rel="noopener noreferrer" class="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-trovara-green hover:border-trovara-green hover:bg-trovara-green/5">
                  {{ social.label }}
                </a>
              </div>
            </div>
          </div>

          <form v-else class="space-y-8" @submit.prevent="handleSubmit">
            <input
              v-model="form.honey"
              type="text"
              name="_honey"
              tabindex="-1"
              autocomplete="off"
              class="hidden"
              aria-hidden="true"
            />

            <div>
              <div class="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-trovara-green">
                <span>Step {{ step + 1 }} of {{ SURVEY_STEPS.length }}</span>
                <span>{{ currentStep.title }}</span>
              </div>
              <div
                class="h-2 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label="Survey progress"
                :aria-valuemin="1"
                :aria-valuemax="SURVEY_STEPS.length"
                :aria-valuenow="step + 1"
                :aria-valuetext="`Step ${step + 1} of ${SURVEY_STEPS.length}`"
              >
                <div class="h-full rounded-full bg-trovara-green transition-all" :style="{ width: `${progress}%` }" />
              </div>
              <h2 ref="stepHeading" tabindex="-1" class="mt-3 text-lg font-black text-trovara-dark outline-none">
                {{ currentStep.title }}
              </h2>
              <p class="mt-1 text-sm text-gray-500">{{ currentStep.blurb }}</p>
            </div>

            <div v-if="step === 0" class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">Where do you currently live?</legend>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_LOCATIONS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.location === option.value)"
                    :aria-pressed="form.location === option.value"
                    @click="selectOne('location', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <input
                  v-if="form.location === 'other'"
                  v-model="form.locationOther"
                  type="text"
                  maxlength="80"
                  placeholder="Please specify"
                  :class="['mt-3', fieldClass]"
                />
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">How many people are in your household?</legend>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <button
                    v-for="option in SURVEY_HOUSEHOLDS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.household === option.value)"
                    :aria-pressed="form.household === option.value"
                    @click="selectOne('household', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">How did you hear about Trovara Farm?</legend>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_HEARD_FROM"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.heardFrom === option.value)"
                    :aria-pressed="form.heardFrom === option.value"
                    @click="selectOne('heardFrom', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <input
                  v-if="form.heardFrom === 'other'"
                  v-model="form.heardFromOther"
                  type="text"
                  maxlength="80"
                  placeholder="Please specify"
                  :class="['mt-3', fieldClass]"
                />
              </fieldset>
            </div>

            <div v-else-if="step === 1" class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  Where do you buy most of your fresh food?
                  <span class="font-normal text-gray-500">Select up to 3.</span>
                </legend>
                <p class="mb-2 text-xs font-semibold text-trovara-green" aria-live="polite">
                  {{ form.buyPlaces.length }} of 3 selected
                </p>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_BUY_PLACES"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.buyPlaces.includes(option.value))"
                    :aria-pressed="form.buyPlaces.includes(option.value)"
                    :disabled="choiceLimitReached(form.buyPlaces, option.value, 3)"
                    @click="toggle('buyPlaces', option.value, 3)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <input
                  v-if="form.buyPlaces.includes('other')"
                  v-model="form.buyPlacesOther"
                  type="text"
                  maxlength="80"
                  placeholder="Please specify"
                  :class="['mt-3', fieldClass]"
                />
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">How often do you normally buy fresh food?</legend>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_FREQUENCIES"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.frequency === option.value)"
                    :aria-pressed="form.frequency === option.value"
                    @click="selectOne('frequency', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  Which products do you buy most regularly?
                  <span class="font-normal text-gray-500">Choose up to 8.</span>
                </legend>
                <p class="mb-2 text-xs font-semibold text-trovara-green" aria-live="polite">
                  {{ form.products.length }} of 8 selected
                </p>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_PRODUCTS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.products.includes(option.value))"
                    :aria-pressed="form.products.includes(option.value)"
                    :disabled="choiceLimitReached(form.products, option.value, 8)"
                    @click="toggle('products', option.value, 8)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <input
                  v-if="form.products.includes('other')"
                  v-model="form.productsOther"
                  type="text"
                  maxlength="80"
                  placeholder="Please specify"
                  :class="['mt-3', fieldClass]"
                />
              </fieldset>
            </div>

            <div v-else-if="step === 2" class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  What frustrates you most about buying fresh food?
                  <span class="font-normal text-gray-500">Select up to 4.</span>
                </legend>
                <p class="mb-2 text-xs font-semibold text-trovara-green" aria-live="polite">
                  {{ form.frustrations.length }} of 4 selected
                </p>
                <div class="grid gap-2">
                  <button
                    v-for="option in SURVEY_FRUSTRATIONS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.frustrations.includes(option.value))"
                    :aria-pressed="form.frustrations.includes(option.value)"
                    :disabled="choiceLimitReached(form.frustrations, option.value, 4)"
                    @click="toggle('frustrations', option.value, 4)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <input
                  v-if="form.frustrations.includes('other')"
                  v-model="form.frustrationsOther"
                  type="text"
                  maxlength="80"
                  placeholder="Please specify"
                  :class="['mt-3', fieldClass]"
                />
              </fieldset>
              <fieldset v-if="needsTopFrustration">
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">Of these problems, which ONE bothers you most?</legend>
                <div class="grid gap-2">
                  <button
                    v-for="value in form.frustrations"
                    :key="value"
                    type="button"
                    :class="choiceClass(form.topFrustration === value)"
                    :aria-pressed="form.topFrustration === value"
                    @click="selectOne('topFrustration', value)"
                  >
                    {{ SURVEY_FRUSTRATIONS.find((option) => option.value === value)?.label ?? value }}
                  </button>
                </div>
              </fieldset>
            </div>

            <div v-else-if="step === 3" class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  When buying fresh food, which THREE things matter most to you?
                </legend>
                <p class="mb-2 text-xs font-semibold text-trovara-green" aria-live="polite">
                  {{ form.priorities.length }} of 3 selected
                </p>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_PRIORITIES"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.priorities.includes(option.value))"
                    :aria-pressed="form.priorities.includes(option.value)"
                    :disabled="choiceLimitReached(form.priorities, option.value, 3)"
                    @click="toggle('priorities', option.value, 3)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  Would knowing the farm or source of your food change your purchasing decision?
                </legend>
                <div class="grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="option in SURVEY_SOURCE_MATTERS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.sourceMatters === option.value)"
                    :aria-pressed="form.sourceMatters === option.value"
                    @click="selectOne('sourceMatters', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <label class="block">
                <span class="mb-2 block text-sm font-semibold text-trovara-dark">
                  Which fresh foods do you find hardest to get at the quality you want?
                </span>
                <textarea
                  v-model="form.hardToGet"
                  rows="3"
                  maxlength="500"
                  placeholder="e.g. chicken that stays fresh, ripe plantain, clean palm oil"
                  :class="[fieldClass, 'resize-none']"
                />
              </label>
            </div>

            <div v-else-if="step === 4" class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  If a supplier could reliably provide fresh, quality food, how would you prefer to shop?
                </legend>
                <div class="grid gap-2">
                  <button
                    v-for="option in SURVEY_SHOP_PREFS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.shopPreference === option.value)"
                    :aria-pressed="form.shopPreference === option.value"
                    @click="selectOne('shopPreference', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  If fresh food were consistently high quality and easy to get, what would you expect to pay compared with what you pay now?
                </legend>
                <div class="grid gap-2">
                  <button
                    v-for="option in SURVEY_PRICE_EXPECTATIONS"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.priceExpectation === option.value)"
                    :aria-pressed="form.priceExpectation === option.value"
                    @click="selectOne('priceExpectation', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <label class="block">
                <span class="mb-2 block text-sm font-semibold text-trovara-dark">
                  If you could change ONE thing about the way you currently buy fresh food, what would it be?
                </span>
                <textarea
                  v-model="form.oneChange"
                  rows="3"
                  maxlength="500"
                  placeholder="The one change that would help you most"
                  :class="[fieldClass, 'resize-none']"
                />
              </label>
            </div>

            <div v-else class="space-y-6">
              <fieldset>
                <legend class="mb-3 text-sm font-semibold text-trovara-dark">
                  Would you be interested in testing a new farm-to-table food service or a short follow-up conversation?
                </legend>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="option in SURVEY_FOLLOW_UP"
                    :key="option.value"
                    type="button"
                    :class="choiceClass(form.followUp === option.value)"
                    :aria-pressed="form.followUp === option.value"
                    @click="selectOne('followUp', option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </fieldset>
              <div v-if="wantsFollowUp" class="grid gap-6 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-trovara-dark">Name <span class="font-normal text-gray-500">(optional)</span></span>
                  <input v-model="form.name" type="text" maxlength="120" autocomplete="name" placeholder="Ada Okonkwo" :class="fieldClass" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-trovara-dark">WhatsApp number or email</span>
                  <input
                    v-model="form.contact"
                    type="text"
                    maxlength="320"
                    autocomplete="tel"
                    placeholder="0801 234 5678 or you@email.com"
                    :class="fieldClass"
                  />
                </label>
              </div>
              <label class="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-gray-600">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  required
                  class="mt-0.5 h-6 w-6 flex-shrink-0 rounded border-gray-300 text-trovara-green focus:ring-trovara-gold"
                  :disabled="submitting"
                />
                <span>
                  I agree that Trovara Farm may store my survey answers to understand how households buy fresh food.
                  If I share a WhatsApp number or email, Trovara may use it only to follow up about this survey or a
                  farm-to-table test, as described in the
                  <RouterLink to="/privacy" class="font-semibold text-trovara-green underline underline-offset-2 hover:text-trovara-dark">
                    Privacy Notice
                  </RouterLink>.
                </span>
              </label>
            </div>

            <p
              v-if="stepError || submitError"
              ref="errorMessage"
              tabindex="-1"
              class="text-sm text-red-600 outline-none"
              role="alert"
            >
              {{ stepError || submitError }}
            </p>

            <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                v-if="step > 0"
                type="button"
                class="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-trovara-dark hover:bg-trovara-cream"
                @click="goBack"
              >
                Back
              </button>
              <span v-else />
              <button
                v-if="step < SURVEY_STEPS.length - 1"
                type="button"
                class="btn-primary px-8 py-3"
                @click="goNext"
              >
                Continue
              </button>
              <button
                v-else
                type="submit"
                class="btn-primary px-8 py-3"
                :disabled="submitting"
                :class="submitting ? 'cursor-not-allowed opacity-75' : ''"
              >
                {{ submitting ? 'Sending…' : 'Submit answers' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
