<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeader from '../components/ui/SectionHeader.vue'
import { submitToFormSubmit } from '../lib/formsubmit'

const route = useRoute()
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
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

const subjectLabels = Object.fromEntries(subjects.map((item) => [item.value, item.label]))

function resetForm() {
  submitted.value = false
  submitError.value = ''
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
}

async function handleSubmit() {
  submitError.value = ''
  submitting.value = true

  const subjectLabel = subjectLabels[form.subject] ?? 'General Enquiry'
  const result = await submitToFormSubmit(
    {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: subjectLabel,
      message: form.message,
    },
    {
      subject: `[Trovara Contact] ${subjectLabel}`,
      template: 'table',
    },
  )

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
              <p class="text-white/70 text-sm leading-relaxed">
                We supply coconuts, plantains, and poultry products at wholesale scale.
                Select "Bulk Order / Wholesale" in the form for priority handling.
              </p>
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
                <div class="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-trovara-dark mb-2">
                      Full Name <span class="text-trovara-green">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
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
                    placeholder="Tell us how we can help you..."
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-trovara-cream focus:outline-none focus:ring-2 focus:ring-trovara-green/30 focus:border-trovara-green transition text-trovara-dark placeholder-gray-400 text-sm resize-none"
                  />
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
