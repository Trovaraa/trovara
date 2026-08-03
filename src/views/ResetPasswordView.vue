<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { shopApi } from '../lib/shop'

const route = useRoute()

const busy = ref(false)
const error = ref('')
const success = ref(false)
const token = ref('')
const form = reactive({ password: '', confirmPassword: '' })

function clearMessages() {
  error.value = ''
}

async function submitReset() {
  clearMessages()
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  busy.value = true
  try {
    await shopApi.resetPassword({ token: token.value, newPassword: form.password })
    success.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to reset password. The link may be expired.'
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  const tokenParam = route.query.token
  if (!tokenParam || typeof tokenParam !== 'string') {
    error.value = 'Invalid reset link. Please request a new one.'
    return
  }
  token.value = tokenParam
})
</script>

<template>
  <div class="min-h-screen bg-trovara-cream pt-16 md:pt-[4.5rem]">
    <section class="bg-trovara-dark text-white">
      <div class="container-trovara py-12 md:py-16">
        <div class="max-w-2xl">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-trovara-gold">Password reset</p>
          <h1 class="mt-4 text-4xl font-black leading-tight md:text-5xl">Set your new password</h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-white/70">
            Choose a strong password for your Trovara shop account.
          </p>
        </div>
      </div>
    </section>

    <div class="container-trovara py-8 md:py-12">
      <div class="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div v-if="success" class="text-center">
          <div class="mb-6 grid place-items-center">
            <div class="grid h-16 w-16 place-items-center rounded-full bg-trovara-green/10">
              <svg class="h-8 w-8 text-trovara-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-black text-trovara-dark">Password reset successfully</h2>
          <p class="mt-3 leading-7 text-gray-600">
            You can now sign in to your Trovara account with your new password.
          </p>
          <RouterLink to="/shop" class="btn-primary mt-6 inline-flex px-6 py-3">
            Go to shop
          </RouterLink>
        </div>

        <div v-else>
          <div v-if="error && !token" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-700 dark:text-red-300">
            {{ error }}
          </div>

          <form v-else class="grid gap-4" @submit.prevent="submitReset">
            <div v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-700 dark:text-red-300">
              {{ error }}
            </div>

            <label class="text-sm font-bold text-trovara-dark">
              New password
              <input
                v-model="form.password"
                required
                type="password"
                minlength="8"
                autocomplete="new-password"
                class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green"
              />
            </label>

            <label class="text-sm font-bold text-trovara-dark">
              Confirm new password
              <input
                v-model="form.confirmPassword"
                required
                type="password"
                minlength="8"
                autocomplete="new-password"
                class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green"
              />
            </label>

            <button type="submit" class="btn-primary" :disabled="busy || !token">
              {{ busy ? 'Resetting password…' : 'Reset password' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            <RouterLink to="/shop" class="font-bold text-trovara-green hover:underline">
              Back to shop
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
