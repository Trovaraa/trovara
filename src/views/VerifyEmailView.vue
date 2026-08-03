<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { shopApi } from '../lib/shop'

const route = useRoute()

const busy = ref(true)
const error = ref('')
const success = ref(false)

async function verifyEmail(token: string) {
  try {
    await shopApi.verifyEmail({ token })
    success.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to verify email. The link may be expired.'
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  const tokenParam = route.query.token
  if (!tokenParam || typeof tokenParam !== 'string') {
    error.value = 'Invalid verification link. Please request a new one.'
    busy.value = false
    return
  }
  verifyEmail(tokenParam)
})
</script>

<template>
  <div class="min-h-screen bg-trovara-cream pt-16 md:pt-[4.5rem]">
    <section class="bg-trovara-dark text-white">
      <div class="container-trovara py-12 md:py-16">
        <div class="max-w-2xl">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-trovara-gold">Email verification</p>
          <h1 class="mt-4 text-4xl font-black leading-tight md:text-5xl">Verifying your account</h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-white/70">
            Confirming your email address for your Trovara shop account.
          </p>
        </div>
      </div>
    </section>

    <div class="container-trovara py-8 md:py-12">
      <div class="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div v-if="busy" class="grid min-h-64 place-items-center text-gray-500">
          <div class="text-center">
            <div class="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-trovara-light border-t-trovara-green"></div>
            <p class="text-sm font-bold">Verifying your email…</p>
          </div>
        </div>

        <div v-else-if="success" class="text-center">
          <div class="mb-6 grid place-items-center">
            <div class="grid h-16 w-16 place-items-center rounded-full bg-trovara-green/10">
              <svg class="h-8 w-8 text-trovara-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-black text-trovara-dark">Email verified successfully</h2>
          <p class="mt-3 leading-7 text-gray-600">
            Your Trovara account is now active. You can sign in and start using the farm shop.
          </p>
          <RouterLink to="/shop" class="btn-primary mt-6 inline-flex px-6 py-3">
            Go to shop
          </RouterLink>
        </div>

        <div v-else class="text-center">
          <div class="mb-6 grid place-items-center">
            <div class="grid h-16 w-16 place-items-center rounded-full bg-red-500/10">
              <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-black text-trovara-dark">Verification failed</h2>
          <p class="mt-3 leading-7 text-gray-600">
            {{ error }}
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <RouterLink to="/shop" class="btn-primary inline-flex px-6 py-3">
              Go to shop
            </RouterLink>
            <RouterLink to="/shop" class="inline-flex items-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-trovara-dark hover:bg-trovara-light">
              Request new link
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
