<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  MOMENTS_CONSENT_VERSION,
  MOMENTS_MAX_UPLOAD_BYTES,
  momentsMediaUrl,
} from '../lib/moments'

type Moment = {
  id: string
  mediaKind: 'image' | 'video'
  mimeType: string
  mediaUrl: string
  posterUrl?: string | null
  durationSeconds?: number | null
  createdAt: string
  description?: string | null
}

type MomentsResponse = {
  moments: Moment[]
}

const moments = ref<Moment[]>([])
const loading = ref(true)
const loadError = ref('')

const uploading = ref(false)
const uploaded = ref(false)
const uploadError = ref('')

const form = ref({
  name: '',
  email: '',
  description: '',
  consent: false,
  file: null as File | null,
  honey: '',
})

const fileInputKey = ref(0)

async function loadMoments() {
  loading.value = true
  loadError.value = ''
  try {
    // No trailing slash — Netlify → OS `/public/moments/` 404s an empty gallery.
    const response = await fetch('/moments-api')
    if (!response.ok) {
      throw new Error('Failed to load moments')
    }
    const data: MomentsResponse = await response.json()
    moments.value = (data.moments || []).map((moment) => ({
      ...moment,
      mediaUrl: momentsMediaUrl(moment.mediaUrl) ?? moment.mediaUrl,
      posterUrl: momentsMediaUrl(moment.posterUrl),
    }))
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Failed to load moments'
    console.error('Load moments error:', error)
  } finally {
    loading.value = false
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    form.value.file = null
    return
  }

  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']
  const validVideoTypes = ['video/mp4', 'video/quicktime']
  const validTypes = [...validImageTypes, ...validVideoTypes]

  if (!validTypes.includes(file.type)) {
    uploadError.value = 'Please select a JPEG, PNG, WebP image or MP4/MOV video.'
    form.value.file = null
    target.value = ''
    return
  }

  if (file.size > MOMENTS_MAX_UPLOAD_BYTES) {
    uploadError.value = 'File is too large (max 12MB).'
    form.value.file = null
    target.value = ''
    return
  }

  form.value.file = file
  uploadError.value = ''
}

function validateForm(): string | null {
  if (!form.value.consent) {
    return 'Please consent to sharing your submission.'
  }
  if (!form.value.file) {
    return 'Please select a photo or video to share.'
  }
  if (!form.value.description.trim()) {
    return 'Please describe the photo or video for visitors using assistive technology.'
  }
  return null
}

async function handleSubmit() {
  uploadError.value = ''
  uploaded.value = false

  // Honeypot: bots that fill hidden fields get a fake success
  if (form.value.honey.trim() !== '') {
    uploaded.value = true
    resetForm()
    return
  }

  const validationError = validateForm()
  if (validationError) {
    uploadError.value = validationError
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    if (form.value.name.trim()) {
      formData.append('name', form.value.name.trim().slice(0, 120))
    }
    if (form.value.email.trim()) {
      formData.append('email', form.value.email.trim().slice(0, 320))
    }
    formData.append('description', form.value.description.trim().slice(0, 300))
    formData.append('consent', 'true')
    formData.append('consentVersion', MOMENTS_CONSENT_VERSION)
    formData.append('honey', form.value.honey)
    formData.append('file', form.value.file!)

    const response = await fetch('/moments-api', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || 'Upload failed')
    }

    uploaded.value = true
    resetForm()
    await loadMoments()
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Upload failed. Please try again.'
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    description: '',
    consent: false,
    file: null,
    honey: '',
  }
  fileInputKey.value += 1
  uploadError.value = ''
}

onMounted(() => {
  loadMoments()
})
</script>

<template>
  <div class="moments-view">
    <section class="moments-hero">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container moments-hero-inner">
        <p class="moments-eyebrow">Gallery</p>
        <h1 class="moments-title">Moments</h1>
        <p class="moments-subtitle">
          Photos and videos from our farm community: harvest days, daily work, and the people behind Trovara.
        </p>
      </div>
    </section>

    <!-- Upload Form -->
    <section class="upload-section">
      <div class="container">
        <div class="upload-card">
          <h2 class="upload-title">Share a moment</h2>
          <p class="upload-subtitle">
            Have a photo or video from a Trovara experience? Share it with us and it might appear in the gallery below.
          </p>

          <div v-if="uploaded" class="notice success" role="status">
            Thank you for sharing! We'll review your submission soon.
          </div>

          <div v-if="uploadError && !uploading" class="notice error" role="alert">
            {{ uploadError }}
          </div>

          <form @submit.prevent="handleSubmit" class="upload-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Your name <span class="optional">(optional)</span></label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  autocomplete="name"
                  maxlength="120"
                  placeholder="e.g. John Doe"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="email">Your email <span class="optional">(optional)</span></label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  maxlength="320"
                  placeholder="john@example.com"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">
                Media description <span class="required">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                maxlength="300"
                required
                class="form-control"
                placeholder="Describe the people, activity, and setting shown."
                aria-describedby="description-hint"
              />
              <p id="description-hint" class="form-hint">
                Used as accessible alternative text. Do not include private information.
              </p>
            </div>

            <div class="form-group">
              <label for="file">
                Photo or video <span class="required">*</span>
              </label>
              <input
                id="file"
                :key="fileInputKey"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                @change="handleFileChange"
                class="form-control file-input"
                required
              />
              <p class="form-hint">JPEG, PNG, WebP images or MP4/MOV videos · Max 12MB</p>
              <p v-if="form.file" class="selected-file" aria-live="polite">
                Selected: {{ form.file.name }}
              </p>
            </div>

            <!-- Honeypot field (hidden from real users) -->
            <input
              v-model="form.honey"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              style="position: absolute; left: -9999px; width: 1px; height: 1px"
            />

            <div class="form-group consent-group">
              <label class="consent-label">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  class="consent-checkbox"
                  required
                />
                <span class="consent-text">
                  I confirm I have permission from identifiable people shown and consent to
                  Trovara Farm storing, reviewing, and potentially publishing this media and
                  description in the public Moments gallery. I can request removal by contacting
                  Trovara. See the <RouterLink to="/privacy">Privacy Notice</RouterLink>.
                  <span class="required">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              class="button primary large"
              :disabled="uploading"
            >
              {{ uploading ? 'Uploading…' : 'Share moment' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="gallery-section">
      <div class="container">
        <h2 class="gallery-title">Our gallery</h2>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading moments…</p>
        </div>

        <div v-else-if="loadError" class="error-state">
          <p>{{ loadError }}</p>
          <button type="button" class="button secondary" @click="loadMoments">
            Try again
          </button>
        </div>

        <div v-else-if="moments.length === 0" class="empty-state">
          <p>No moments shared yet. Be the first!</p>
        </div>

        <div v-else class="moments-grid">
          <div v-for="moment in moments" :key="moment.id" class="moment-card">
            <div class="moment-media-wrapper">
              <img
                v-if="moment.mediaKind === 'image'"
                :src="moment.mediaUrl"
                :alt="moment.description || 'A moment shared by the Trovara Farm community'"
                class="moment-media"
                loading="lazy"
              />
              <video
                v-else
                :src="moment.mediaUrl"
                :poster="moment.posterUrl || undefined"
                controls
                :aria-label="moment.description || 'Video shared by the Trovara Farm community'"
                class="moment-media"
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.moments-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #f9faf8 0%, #ffffff 40%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.moments-hero {
  position: relative;
  overflow: hidden;
  padding: 8rem 0 4rem;
  background: #2f6b3b;
  text-align: center;
}

.moments-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 48rem;
}

.moments-eyebrow {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #e8c46a;
}

.moments-title {
  margin: 0 0 1.5rem;
  font-size: clamp(2.75rem, 6vw, 3.75rem);
  font-weight: 900;
  line-height: 1.1;
  color: #ffffff;
}

.moments-subtitle {
  margin: 0 auto;
  max-width: 40rem;
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgb(255 255 255 / 0.72);
}

/* Upload Section */
.upload-section {
  padding: 3rem 0 4rem;
}

.upload-card {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border: 1px solid #e2e9df;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.upload-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #28382f;
  margin: 0 0 0.5rem 0;
}

.upload-subtitle {
  font-size: 1rem;
  color: #617064;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.notice {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.notice.success {
  background: #e8f4e6;
  color: #276338;
}

.notice.error {
  background: #fef2f2;
  color: #991b1b;
}

.upload-form {
  margin-top: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #28382f;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.optional {
  color: #718075;
  font-weight: 400;
  font-size: 0.875rem;
}

.required {
  color: #b91c1c;
}

.form-control {
  min-width: 0;
  min-height: 3rem;
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e9df;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9375rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #2f6b3b;
}

.file-input {
  padding: 0.5rem;
  overflow: hidden;
}

.form-hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.8125rem;
  color: #718075;
}

.selected-file {
  margin: 0.5rem 0 0;
  overflow-wrap: anywhere;
  color: #2f6b3b;
  font-size: 0.8125rem;
  font-weight: 600;
}

.consent-group {
  margin: 2rem 0;
}

.consent-label {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  cursor: pointer;
}

.consent-checkbox {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.125rem;
  cursor: pointer;
}

.consent-text {
  font-size: 0.9375rem;
  color: #28382f;
  line-height: 1.6;
}

.button {
  display: inline-block;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.button.primary {
  background: #2f6b3b;
  color: white;
}

.button.primary:hover:not(:disabled) {
  background: #276338;
  transform: translateY(-1px);
}

.button.secondary {
  background: white;
  border: 2px solid #e2e9df;
  color: #28382f;
}

.button.secondary:hover:not(:disabled) {
  border-color: #2f6b3b;
  color: #2f6b3b;
}

.button.large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.0625rem;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Gallery Section */
.gallery-section {
  padding: 4rem 0 6rem 0;
}

.gallery-title {
  font-size: 2rem;
  font-weight: 800;
  color: #28382f;
  margin: 0 0 2rem 0;
  text-align: center;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #617064;
}

.spinner {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border: 3px solid #e2e9df;
  border-top-color: #2f6b3b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.moments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .moments-grid {
    grid-template-columns: 1fr;
  }
}

.moment-card {
  background: white;
  border: 1px solid #e2e9df;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.moment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.moment-media-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  background: #f4f7f2;
  overflow: hidden;
}

.moment-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:global(html.dark) .moments-view {
  background: linear-gradient(180deg, #121a16 0%, #0f1512 40%);
}

:global(html.dark) .upload-card,
:global(html.dark) .moment-card {
  background: #1a2420;
  border-color: rgb(255 255 255 / 0.1);
}

:global(html.dark) .upload-title,
:global(html.dark) .gallery-title,
:global(html.dark) .form-group label,
:global(html.dark) .consent-text,
:global(html.dark) .button.secondary {
  color: #e8eee8;
}

:global(html.dark) .upload-subtitle,
:global(html.dark) .form-hint,
:global(html.dark) .optional,
:global(html.dark) .loading-state,
:global(html.dark) .error-state,
:global(html.dark) .empty-state {
  color: #a3b0a6;
}

:global(html.dark) .selected-file {
  color: #78c8a2;
}

:global(html.dark) .form-control {
  background: #121a16;
  border-color: rgb(255 255 255 / 0.12);
  color: #e8eee8;
}

:global(html.dark) .button.secondary {
  background: transparent;
  border-color: rgb(255 255 255 / 0.16);
}

:global(html.dark) .moment-media-wrapper {
  background: #121a16;
}

@media (max-width: 639px) {
  .container {
    padding-inline: 1rem;
  }

  .moments-hero {
    padding: 6.75rem 0 3rem;
  }

  .moments-title {
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  .moments-subtitle {
    font-size: 1rem;
    line-height: 1.6;
  }

  .upload-section {
    padding: 2rem 0 3rem;
  }

  .upload-card {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .upload-title {
    font-size: 1.5rem;
  }

  .upload-subtitle {
    margin-bottom: 1.5rem;
  }

  .gallery-section {
    padding: 3rem 0 4.5rem;
  }

  .moments-grid {
    gap: 1rem;
  }
}
</style>
