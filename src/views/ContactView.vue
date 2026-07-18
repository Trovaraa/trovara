<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeader from '../components/ui/SectionHeader.vue'
import { submitContactForm } from '../lib/formsubmit'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { TELEGRAM_CUSTOMER_BOT, TELEGRAM_ORDER_URL } from '../lib/telegram'

const contactWhatsAppLink = buildWhatsAppLink(
  "Hi Trovara Farm, I'd like to get in touch about your products.",
)

const route = useRoute()
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

const FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  message: 4000,
} as const

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
  honey: '',
})

const validSubjects = new Set(['general', 'bulk-order', 'partnership', 'export', 'media', 'other'])

watch(
  () => route.query.subject,
  (value) => {
    if (typeof value === 'string' && validSubjects.has(value)) {
      form.subject = value
    }
  },
  { immediate: true },
)

const subjects = [
  { value: 'general',      label: 'General Enquiry' },
  { value: 'bulk-order',   label: 'Bulk Order / Wholesale' },
  { value: 'partnership',  label: 'Distribution Partnership' },
  { value: 'export',       label: 'Export Enquiry' },
  { value: 'media',        label: 'Media & Press' },
  { value: 'other',        label: 'Other' },
]

function resetForm() {
  submitted.value = false
  submitError.value = ''
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    honey: '',
  })
}

function validateContactForm(): string | null {
  const name = form.name.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()
  const message = form.message.trim()

  if (!name || name.length > FIELD_LIMITS.name) {
    return `Please enter your name (max ${FIELD_LIMITS.name} characters).`
  }
  if (!email || email.length > FIELD_LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.'
  }
  if (phone.length > FIELD_LIMITS.phone) {
    return `Phone number is too long (max ${FIELD_LIMITS.phone} characters).`
  }
  if (!message || message.length > FIELD_LIMITS.message) {
    return `Please enter a message (max ${FIELD_LIMITS.message} characters).`
  }
  if (!validSubjects.has(form.subject)) {
    return 'Please choose a valid subject.'
  }
  return null
}

async function handleSubmit() {
  submitError.value = ''

  // Honeypot: bots that fill hidden fields get a fake success.
  if (form.honey.trim() !== '') {
    submitted.value = true
    return
  }

  const validationError = validateContactForm()
  if (validationError) {
    submitError.value = validationError
    return
  }

  submitting.value = true

  const result = await submitContactForm({
    name: form.name.trim().slice(0, FIELD_LIMITS.name),
    email: form.email.trim().slice(0, FIELD_LIMITS.email),
    phone: form.phone.trim().slice(0, FIELD_LIMITS.phone),
    subject: form.subject,
    message: form.message.trim().slice(0, FIELD_LIMITS.message),
    honey: form.honey,
  })

  submitting.value = false

  if (!result.ok) {
    submitError.value = result.error ?? 'Something went wrong. Please try again.'
    return
  }

  submitted.value = true
}

const contactInfo = [
  { icon: '📍', label: 'Location',  value: 'Trovara Farm, Abeokuta.' },
  { icon: '📞', label: 'Phone',     value: '+234 810 369 3426' },
  { icon: '📧', label: 'Email',     value: 'info@trovara.farm' },
  { icon: '🕐', label: 'Response',  value: 'Within 24 business hours' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">Let's Connect</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          We'd love to hear from you.
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          Whether you're a buyer, distributor, investor, or simply curious -
          Trovara Farm is always open.
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara">
        <div class="grid md:grid-cols-5 gap-12 lg:gap-16">

          <!-- Contact Info -->
          <div class="md:col-span-2">
            <SectionHeader
              eyebrow="Reach Us"
              title="Contact Information"
            />
            <div class="space-y-6">
              <div
                v-for="info in contactInfo"
                :key="info.label"
                class="flex items-start gap-4"
              >
                <div class="w-10 h-10 rounded-xl bg-trovara-green/10 flex items-center justify-center flex-shrink-0 text-lg">
                  {{ info.icon }}
                </div>
                <div>
                  <div class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-0.5">
                    {{ info.label }}
                  </div>
                  <div class="text-trovara-dark font-medium">{{ info.value }}</div>
                </div>
              </div>
            </div>

            <div class="mt-10 p-6 bg-trovara-green rounded-2xl text-white">
              <div class="text-2xl mb-3">🌿</div>
              <h4 class="font-bold text-lg mb-2">Looking to order in bulk?</h4>
              <p class="text-white/70 text-sm leading-relaxed mb-5">
                We supply coconuts, plantains, and poultry products at wholesale scale.
                Select "Bulk Order / Wholesale" in the form for priority handling - or
                message the team / place an order on your preferred channel.
              </p>
              <div class="flex flex-col gap-2">
                <a
                  :href="TELEGRAM_ORDER_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#229ED9] hover:bg-[#1b8bc0] text-white font-semibold text-sm transition-colors"
                >
                  Order on Telegram
                  <span class="text-white/70 font-normal">@{{ TELEGRAM_CUSTOMER_BOT }}</span>
                </a>
                <a
                  :href="contactWhatsAppLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-sm transition-colors"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="md:col-span-3">
            <div class="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">

              <!-- Success State -->
              <div v-if="submitted" class="text-center py-12">
                <div class="text-6xl mb-4">🌱</div>
                <h3 class="text-2xl font-black text-trovara-dark mb-3">Message Received!</h3>
                <p class="text-gray-500 mb-6">
                  Thank you for reaching out to Trovara Farm. We'll get back to you within 24 business hours.
                </p>
                <button
                  class="btn-primary"
                  @click="resetForm"
                >
                  Send Another Message
                </button>
              </div>

              <!-- Form State -->
              <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                <input
                  v-model="form.honey"
                  type="text"
                  name="_honey"
                  tabindex="-1"
                  autocomplete="off"
                  class="hidden"
                  aria-hidden="true"
                />
                <div class="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-trovara-dark mb-2">
                      Full Name <span class="text-trovara-green">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      :maxlength="FIELD_LIMITS.name"
                      placeholder="John Mensah"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-trovara-dark mb-2">
                      Email Address <span class="text-trovara-green">*</span>
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      :maxlength="FIELD_LIMITS.email"
                      placeholder="you@example.com"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-trovara-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      :maxlength="FIELD_LIMITS.phone"
                      placeholder="+233 000 000 000"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-trovara-dark mb-2">
                      Subject <span class="text-trovara-green">*</span>
                    </label>
                    <select
                      v-model="form.subject"
                      required
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark text-sm"
                    >
                      <option v-for="s in subjects" :key="s.value" :value="s.value">
                        {{ s.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-trovara-dark mb-2">
                    Message <span class="text-trovara-green">*</span>
                  </label>
                  <textarea
                    v-model="form.message"
                    required
                    rows="5"
                    :maxlength="FIELD_LIMITS.message"
                    placeholder="Tell us how we can help you..."
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm resize-none"
                  />
                  <p class="mt-1.5 text-xs text-gray-400 text-right">
                    {{ form.message.length }} / {{ FIELD_LIMITS.message }}
                  </p>
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="btn-primary w-full py-4 text-base"
                  :class="submitting ? 'opacity-75 cursor-not-allowed' : ''"
                >
                  <span v-if="submitting" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending...
                  </span>
                  <span v-else>Send Message →</span>
                </button>
                <p v-if="submitError" class="text-sm text-red-600">
                  {{ submitError }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
