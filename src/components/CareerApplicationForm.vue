<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

const props = defineProps<{ careerPostId: string; roleTitle: string; deadline: string | null }>()
type Policy = { enabled: boolean; noticeVersion: string; privacyNotice: string; maxFileBytes: number }
const policy = ref<Policy | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const reference = ref('')
const cv = ref<File | null>(null)
const requestId = ref(crypto.randomUUID())
const form = reactive({ name: '', email: '', phone: '', website: '', privacyAcknowledged: false })
const closed = () => Boolean(props.deadline && Date.now() > new Date(`${props.deadline}T23:59:59.999+01:00`).getTime())

onMounted(async () => {
  try {
    const response = await fetch('/careers-api/application-policy', { cache: 'no-store', credentials: 'omit' })
    if (!response.ok) throw new Error('Unavailable')
    policy.value = await response.json() as Policy
  } catch { policy.value = null } finally { loading.value = false }
})

async function submit() {
  error.value = ''
  if (!policy.value?.enabled || closed()) return
  if (!cv.value || !/\.(pdf|docx)$/i.test(cv.value.name) || !cv.value.size || cv.value.size > policy.value.maxFileBytes) {
    error.value = 'Please choose a PDF or DOCX CV, up to 10 MB.'; return
  }
  if (!form.privacyAcknowledged) { error.value = 'Please read and acknowledge the recruitment privacy notice.'; return }
  submitting.value = true
  try {
    const body = new FormData()
    body.append('careerPostId', props.careerPostId); body.append('cv', cv.value)
    body.append('name', form.name); body.append('email', form.email); body.append('phone', form.phone)
    body.append('website', form.website); body.append('privacyAcknowledged', 'true')
    body.append('privacyNoticeVersion', policy.value.noticeVersion); body.append('requestId', requestId.value)
    const response = await fetch('/careers-api/applications', { method: 'POST', body, credentials: 'omit' })
    const result = await response.json().catch(() => null) as { reference?: string; error?: string } | null
    if (response.status === 413) throw new Error('The upload is too large. Try a smaller CV or email hello@trovara.farm.')
    if (!response.ok || !result?.reference) throw new Error(result?.error || 'Your application could not be submitted. Please try again or email hello@trovara.farm.')
    reference.value = result.reference
    cv.value = null; form.name = ''; form.email = ''; form.phone = ''
  } catch (e) { error.value = e instanceof Error && !(e instanceof TypeError) ? e.message : 'Check your connection and try again, or email hello@trovara.farm.' }
  finally { submitting.value = false }
}
</script>

<template>
  <section id="apply" class="application-form" aria-labelledby="apply-title">
    <h2 id="apply-title">Apply for {{ roleTitle }}</h2>
    <p v-if="loading" role="status">Loading application form…</p>
    <div v-else-if="reference" role="status" class="success">
      <h3>Application received</h3><p>Thank you for your interest in Trovara Farm. Our hiring team will review your application.</p>
      <p>Your reference: <strong class="reference">{{ reference }}</strong></p><p>Please keep this reference. You can contact <a href="mailto:hello@trovara.farm">hello@trovara.farm</a> about your application.</p>
    </div>
    <p v-else-if="closed()">The application deadline for this role has passed. Contact <a href="mailto:hello@trovara.farm">hello@trovara.farm</a> with any questions.</p>
    <p v-else-if="!policy?.enabled">Online applications are not available yet. Please use the email option below.</p>
    <form v-else @submit.prevent="submit">
      <p>Apply without creating an account. Fields marked * are required.</p>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <fieldset :disabled="submitting" class="fields">
        <label>Full name *<input v-model="form.name" autocomplete="name" maxlength="200" minlength="2" required /></label>
        <label>Email address *<input v-model="form.email" type="email" autocomplete="email" maxlength="320" required /></label>
        <label>Phone number<input v-model="form.phone" type="tel" autocomplete="tel" maxlength="80" /></label>
        <label>CV *<input type="file" accept=".pdf,.docx" required aria-describedby="cv-help" @change="cv = ($event.target as HTMLInputElement).files?.[0] ?? null" /><span id="cv-help" class="help">PDF or DOCX, maximum 10 MB.</span></label>
        <label class="trap" aria-hidden="true">Website<input v-model="form.website" tabindex="-1" autocomplete="off" /></label>
        <div class="privacy"><h3>Recruitment privacy notice</h3><p>{{ policy.privacyNotice }}</p></div>
        <label class="acknowledgement"><input v-model="form.privacyAcknowledged" type="checkbox" required />I have read the recruitment privacy notice. *</label>
        <button type="submit" class="btn-primary" :disabled="submitting">{{ submitting ? 'Securely submitting…' : 'Submit application' }}</button>
      </fieldset>
    </form>
  </section>
</template>

<style scoped>
.application-form { margin-top: 3rem; border: 1px solid var(--tv-border); border-radius: 1rem; padding: clamp(1rem, 4vw, 2rem); background: var(--tv-surface); color: var(--tv-ink); }
h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; }h3 { font-weight: 700; }p { line-height: 1.65; margin: .6rem 0 1rem; color: var(--tv-muted-text); }.fields { display: grid; gap: 1.25rem; margin-top: 1.5rem; }
label { display: flex; flex-direction: column; gap: .5rem; font-weight: 600; }input:not([type=checkbox]) { width: 100%; min-width: 0; padding: .8rem; border: 1px solid var(--tv-border); border-radius: .5rem; background: var(--tv-canvas); color: var(--tv-ink); }input:focus-visible { outline: 2px solid #b6872e; outline-offset: 3px; }
.help { font-size: .8rem; color: var(--tv-muted-text); font-weight: 400; }.privacy { border-top: 1px solid var(--tv-border); padding-top: 1.25rem; font-size: .85rem; }.acknowledgement { flex-direction: row; align-items: flex-start; font-size: .9rem; }.acknowledgement input { margin-top: .25rem; flex-shrink: 0; }.trap { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
.error { border: 1px solid #b91c1c; padding: 1rem; border-radius: .5rem; color: #b91c1c; }.success { border-left: 3px solid #15803d; padding-left: 1rem; }.reference { overflow-wrap: anywhere; }a { text-decoration: underline; }button:disabled { opacity: .65; cursor: wait; }
</style>
