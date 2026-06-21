<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{
  variant?: 'footer' | 'inline'
  title?: string
  description?: string
}>()

const newsletter = reactive({
  email: '',
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  error: '',
})

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function subscribe() {
  newsletter.error = ''
  if (!isValidEmail(newsletter.email)) {
    newsletter.error = 'Please enter a valid email address.'
    return
  }

  newsletter.status = 'loading'
  try {
    if (import.meta.env.DEV) {
      throw new Error('Newsletter signup only works on the deployed Netlify site.')
    }

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        'form-name': 'newsletter',
        email: newsletter.email,
      }).toString(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(result?.message ?? 'Subscription failed')
    }

    newsletter.status = 'success'
    newsletter.email = ''
  } catch (error) {
    newsletter.status = 'error'
    if (import.meta.env.DEV) {
      newsletter.error = 'Signup works on the live site only (not localhost). Deploy to test.'
    } else {
      newsletter.error = 'Something went wrong. Please try again.'
    }
  }
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
      @submit.prevent="subscribe"
      class="flex flex-col sm:flex-row gap-3"
    >
      <div class="flex-1">
        <input
          v-model="newsletter.email"
          type="email"
          required
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
        <p
          v-if="newsletter.error"
          :class="[
            'text-xs mt-2',
            variant === 'inline' ? 'text-red-600' : 'text-trovara-gold-300',
          ]"
        >
          {{ newsletter.error }}
        </p>
      </div>
      <button
        type="submit"
        :disabled="newsletter.status === 'loading'"
        class="btn-gold px-6 py-3.5 text-sm sm:flex-shrink-0"
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
          You're in.
        </p>
        <p
          :class="[
            'text-xs mt-0.5',
            variant === 'inline' ? 'text-gray-500' : 'text-white/60',
          ]"
        >
          Welcome to the Trovara family. Check your inbox for a confirmation.
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
