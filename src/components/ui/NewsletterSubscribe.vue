<script setup lang="ts">
import { reactive } from 'vue'
import { subscribeToNewsletter } from '../../lib/newsletter'

defineProps<{
  variant?: 'footer' | 'inline'
  title?: string
  description?: string
}>()

const newsletter = reactive({
  name: '',
  email: '',
  phone: '',
  consent: false,
  phoneConsent: false,
  honey: '',
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  error: '',
})

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function subscribe() {
  newsletter.error = ''
  if (!newsletter.name.trim()) {
    newsletter.error = 'Please enter your full name.'
    return
  }
  if (!isValidEmail(newsletter.email)) {
    newsletter.error = 'Please enter a valid email address.'
    return
  }
  if (!newsletter.consent) {
    newsletter.error = 'Please consent to receiving the email newsletter.'
    return
  }
  if (newsletter.phone.trim() && !newsletter.phoneConsent) {
    newsletter.error = 'Please consent to phone/WhatsApp contact or remove your phone number.'
    return
  }

  if (newsletter.honey.trim() !== '') {
    newsletter.status = 'success'
    newsletter.name = ''
    newsletter.email = ''
    newsletter.phone = ''
    newsletter.consent = false
    newsletter.phoneConsent = false
    newsletter.honey = ''
    return
  }

  newsletter.status = 'loading'
  const result = await subscribeToNewsletter({
    name: newsletter.name.trim(),
    email: newsletter.email.trim(),
    ...(newsletter.phone.trim() ? { phone: newsletter.phone.trim() } : {}),
    consent: true,
    phoneConsent: newsletter.phone.trim() ? newsletter.phoneConsent : false,
    honey: newsletter.honey,
  })

  if (!result.ok) {
    newsletter.status = 'error'
    newsletter.error = result.error || 'Something went wrong. Please try again.'
    return
  }

  newsletter.status = 'success'
  newsletter.name = ''
  newsletter.email = ''
  newsletter.phone = ''
  newsletter.consent = false
  newsletter.phoneConsent = false
  newsletter.honey = ''
}

function reset() {
  newsletter.status = 'idle'
  newsletter.error = ''
}
</script>

<template>
  <div :class="variant === 'footer' ? 'grid md:grid-cols-2 gap-8 md:gap-12 items-center' : ''">
    <div v-if="title || description || variant === 'footer'">
      <p
        v-if="variant !== 'inline'"
        class="text-trovara-gold-300 text-xs font-bold uppercase tracking-widest mb-3"
      >
        Stay in the harvest loop
      </p>
      <p
        v-else
        class="text-trovara-green text-xs font-bold uppercase tracking-widest mb-3"
      >
        Newsletter
      </p>
      <h3
        :class="[
          'text-2xl md:text-3xl font-black mb-3',
          variant === 'inline' ? 'text-trovara-dark' : 'text-white',
        ]"
      >
        {{ title ?? 'Updates from the farm, straight to your inbox.' }}
      </h3>
      <p
        :class="[
          'text-sm leading-relaxed max-w-md',
          variant === 'inline' ? 'text-gray-500' : 'text-white/60',
        ]"
      >
        {{
          description ??
            'Be first to hear about new harvests, fresh product launches, recipes for plantain and coconut, and the occasional behind-the-scenes story. No spam, ever.'
        }}
      </p>
    </div>

    <div>
      <form
        v-if="newsletter.status !== 'success'"
        class="space-y-3"
        @submit.prevent="subscribe"
      >
        <input
          v-model="newsletter.honey"
          type="text"
          name="_honey"
          tabindex="-1"
          autocomplete="off"
          class="hidden"
          aria-hidden="true"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="block">
            <span class="sr-only">Full name</span>
            <input
              v-model="newsletter.name"
              type="text"
              required
              maxlength="120"
              autocomplete="name"
              placeholder="Full name"
              :class="[
                'w-full px-4 py-3.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-trovara-gold focus:border-transparent',
                variant === 'inline'
                  ? 'bg-white border-gray-200 text-trovara-dark placeholder-gray-400'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/40',
              ]"
              :disabled="newsletter.status === 'loading'"
              @input="newsletter.error = ''"
            />
          </label>
          <label class="block">
            <span class="sr-only">Email address</span>
            <input
              v-model="newsletter.email"
              type="email"
              required
              maxlength="254"
              autocomplete="email"
              placeholder="you@example.com"
              :class="[
                'w-full px-4 py-3.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-trovara-gold focus:border-transparent',
                variant === 'inline'
                  ? 'bg-white border-gray-200 text-trovara-dark placeholder-gray-400'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/40',
              ]"
              :disabled="newsletter.status === 'loading'"
              @input="newsletter.error = ''"
            />
          </label>
        </div>
        <label class="block">
          <span class="sr-only">Phone number (optional)</span>
          <input
            v-model="newsletter.phone"
            type="tel"
            maxlength="40"
            autocomplete="tel"
            placeholder="Phone number (optional)"
            :class="[
              'w-full px-4 py-3.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-trovara-gold focus:border-transparent',
              variant === 'inline'
                ? 'bg-white border-gray-200 text-trovara-dark placeholder-gray-400'
                : 'bg-white/10 border-white/20 text-white placeholder-white/40',
            ]"
            :disabled="newsletter.status === 'loading'"
            @input="
              newsletter.error = '';
              if (!newsletter.phone.trim()) newsletter.phoneConsent = false
            "
          />
        </label>
        <label
          :class="[
            'flex items-start gap-3 text-xs leading-relaxed cursor-pointer',
            variant === 'inline' ? 'text-gray-600' : 'text-white/70',
          ]"
        >
          <input
            v-model="newsletter.consent"
            type="checkbox"
            required
            class="mt-0.5 h-6 w-6 flex-shrink-0 rounded border-gray-300 text-trovara-green focus:ring-trovara-gold"
            :disabled="newsletter.status === 'loading'"
            @change="newsletter.error = ''"
          />
          <span>I agree to receive Trovara Farm's email newsletter. I can unsubscribe at any time.</span>
        </label>
        <label
          v-if="newsletter.phone.trim()"
          :class="[
            'flex items-start gap-3 text-xs leading-relaxed cursor-pointer',
            variant === 'inline' ? 'text-gray-600' : 'text-white/70',
          ]"
        >
          <input
            v-model="newsletter.phoneConsent"
            type="checkbox"
            required
            class="mt-0.5 h-6 w-6 flex-shrink-0 rounded border-gray-300 text-trovara-green focus:ring-trovara-gold"
            :disabled="newsletter.status === 'loading'"
            @change="newsletter.error = ''"
          />
          <span>I also agree to receive newsletter-related contact by phone or WhatsApp.</span>
        </label>
        <p
          v-if="newsletter.error"
          :class="[
            'text-xs mt-2',
            variant === 'inline' ? 'text-red-600' : 'text-trovara-gold-300',
          ]"
        >
          {{ newsletter.error }}
        </p>
        <button
          type="submit"
          :disabled="newsletter.status === 'loading'"
          class="btn-gold w-full sm:w-auto px-6 py-3.5 text-sm"
          :class="newsletter.status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''"
        >
          <span v-if="newsletter.status === 'loading'" class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Subscribing...
          </span>
          <span v-else>Subscribe</span>
        </button>
      </form>

    <div
      v-else
      :class="[
        'flex items-start gap-4 rounded-xl px-5 py-4 border',
        variant === 'inline'
          ? 'bg-trovara-green/5 border-trovara-green/20'
          : 'bg-trovara-green/20 border-trovara-green/40',
      ]"
    >
      <div class="w-9 h-9 rounded-full bg-trovara-green flex-shrink-0 flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="flex-1">
        <p
          :class="[
            'font-bold text-sm',
            variant === 'inline' ? 'text-trovara-dark' : 'text-white',
          ]"
        >
          Check your inbox to confirm.
        </p>
        <p
          :class="[
            'text-xs mt-0.5',
            variant === 'inline' ? 'text-gray-500' : 'text-white/60',
          ]"
        >
          We sent a confirmation link to your email. Your subscription is not active until you confirm it.
        </p>
        <button
          @click="reset"
          class="text-trovara-green hover:text-trovara-green-700 text-xs font-semibold mt-2 underline-offset-2 hover:underline"
        >
          Subscribe another email
        </button>
      </div>
      </div>
    </div>
  </div>
</template>
