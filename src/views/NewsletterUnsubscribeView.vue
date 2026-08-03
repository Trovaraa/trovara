<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { unsubscribeFromNewsletter } from '../lib/newsletter'

const route = useRoute()
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref('')
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token.trim() : ''))
const linkUnavailable = computed(
  () => !token.value || /expired|invalid|already|used/i.test(error.value),
)

async function unsubscribe() {
  if (!token.value || status.value === 'loading') return
  status.value = 'loading'
  error.value = ''
  const result = await unsubscribeFromNewsletter(token.value)
  if (result.ok) {
    status.value = 'success'
    return
  }
  status.value = 'error'
  error.value = result.error || 'We could not unsubscribe this address.'
}
</script>

<template>
  <section class="min-h-[70vh] bg-trovara-cream pt-32 pb-20 flex items-center">
    <div class="container-trovara">
      <div class="max-w-xl mx-auto bg-white rounded-3xl shadow-sm p-7 sm:p-10 text-center">
        <p class="section-subheading text-trovara-green mb-3">Newsletter</p>

        <template v-if="status === 'success'">
          <h1 class="text-3xl sm:text-4xl font-black text-trovara-dark mb-4">
            You are unsubscribed
          </h1>
          <p class="text-gray-600 leading-relaxed mb-8">
            You will no longer receive the Trovara Farm newsletter at this address.
          </p>
        </template>

        <template v-else-if="!token || status === 'error'">
          <h1 class="text-3xl sm:text-4xl font-black text-trovara-dark mb-4">
            {{ linkUnavailable ? 'Unsubscribe link unavailable' : 'Could not unsubscribe' }}
          </h1>
          <p class="text-gray-600 leading-relaxed mb-8">
            {{
              !token
                ? 'This unsubscribe link is missing its token. Please use the complete link from your email.'
                : error
            }}
          </p>
        </template>

        <template v-else>
          <h1 class="text-3xl sm:text-4xl font-black text-trovara-dark mb-4">
            Unsubscribe from updates?
          </h1>
          <p class="text-gray-600 leading-relaxed mb-8">
            Select the button below to stop receiving the Trovara Farm newsletter. Opening this page
            alone does not change your subscription.
          </p>
          <button
            type="button"
            class="btn-secondary w-full sm:w-auto px-8 py-3.5"
            :disabled="status === 'loading'"
            :class="status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''"
            @click="unsubscribe"
          >
            {{ status === 'loading' ? 'Unsubscribing…' : 'Unsubscribe' }}
          </button>
        </template>

        <div class="mt-8">
          <RouterLink to="/" class="text-trovara-green font-semibold hover:underline">
            Back to Trovara Farm
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
