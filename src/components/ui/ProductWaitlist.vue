<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { submitWaitlist } from '../../lib/waitlist'
import { MARKETING_LEAD_CONSENT_VERSION } from '../../lib/marketing-lead-consent'
import BrandIcon from '../brand/BrandIcon.vue'

const props = defineProps<{
  productId: string
  productName: string
  availabilityNote?: string
}>()

const form = reactive({ name: '', contact: '', consent: false, honey: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

function resetForm() {
  Object.assign(form, { name: '', contact: '', consent: false, honey: '' })
  submitted.value = false
  submitError.value = ''
}

async function handleSubmit() {
  submitError.value = ''

  if (form.honey.trim()) {
    submitted.value = true
    return
  }

  if (!form.name.trim()) {
    submitError.value = 'Please enter your name.'
    return
  }
  if (!form.contact.trim()) {
    submitError.value = 'Please enter an email or WhatsApp number.'
    return
  }
  if (!form.consent) {
    submitError.value = 'Please consent to Trovara processing your waitlist details.'
    return
  }

  submitting.value = true
  const result = await submitWaitlist({
    name: form.name.trim().slice(0, 120),
    contact: form.contact.trim().slice(0, 254),
    product: props.productId,
    consent: true,
    consentVersion: MARKETING_LEAD_CONSENT_VERSION,
    honey: form.honey,
  })
  submitting.value = false

  if (!result.ok) {
    submitError.value = result.error ?? 'We could not add you to the waitlist. Please try again.'
    return
  }

  submitted.value = true
}
</script>

<template>
  <div class="rounded-3xl bg-trovara-dark text-white p-7 sm:p-9 shadow-sm">
    <div v-if="submitted" class="text-center py-4" role="status">
      <BrandIcon name="sprout" class="icon-on-dark w-14 h-14 mx-auto mb-4" />
      <h3 class="text-2xl font-black mb-2">You’re on the list.</h3>
      <p class="text-white/70 max-w-md mx-auto mb-5">
        We’ll contact you when {{ productName.toLowerCase() }} becomes available.
      </p>
      <button type="button" class="text-sm font-bold text-trovara-gold-300 hover:text-white" @click="resetForm">
        Add another name
      </button>
    </div>

    <div v-else>
      <p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-gold-300 mb-2">Availability waitlist</p>
      <h3 class="text-2xl sm:text-3xl font-black mb-3">Join the {{ productName }} waitlist</h3>
      <p class="text-white/70 leading-relaxed mb-2">
        {{ availabilityNote }}
      </p>
      <p class="text-sm text-white/55 mb-7">
        This is not an order and no payment is required. Leave your name and best contact; we’ll reach out when supply opens.
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <input v-model="form.honey" type="text" name="_honey" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
        <div class="grid sm:grid-cols-[1fr_1.2fr_auto] gap-3 items-end">
          <div>
            <label for="waitlist-name" class="block text-xs font-bold mb-2">Your name</label>
            <input
              id="waitlist-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              maxlength="120"
              required
              class="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-trovara-gold-300"
              placeholder="Full name"
            />
          </div>
          <div>
            <label for="waitlist-contact" class="block text-xs font-bold mb-2">Email or WhatsApp number</label>
            <input
              id="waitlist-contact"
              v-model="form.contact"
              type="text"
              autocomplete="email"
              maxlength="254"
              required
              class="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-trovara-gold-300"
              placeholder="you@email.com or +234…"
            />
          </div>
          <button type="submit" class="btn-gold min-h-12 whitespace-nowrap disabled:opacity-60" :disabled="submitting">
            {{ submitting ? 'Joining…' : 'Join waitlist' }}
          </button>
        </div>

        <label class="flex items-start gap-3 text-xs leading-relaxed text-white/70 cursor-pointer">
          <input
            v-model="form.consent"
            type="checkbox"
            required
            class="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-trovara-gold-300 focus:ring-trovara-gold-300"
            :disabled="submitting"
          />
          <span>
            I agree that Trovara Farm may process my details to contact me about this product’s availability, as described in the
            <RouterLink to="/privacy" class="font-semibold text-trovara-gold-300 underline underline-offset-2 hover:text-white">
              Privacy Notice
            </RouterLink>.
          </span>
        </label>
      </form>

      <p v-if="submitError" class="mt-4 text-sm text-red-200" role="alert">{{ submitError }}</p>
    </div>
  </div>
</template>
