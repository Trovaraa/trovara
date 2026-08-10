<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  brandPackZipUrl,
  fetchBrandPackItems,
  fetchBrandPackMeta,
  formatBrandDuration,
  unlockBrandPack,
  type BrandPackItem,
  type BrandPackMeta,
} from '../lib/brand-pack'

const route = useRoute()
const token = computed(() => String(route.params.token || '').trim())

const loading = ref(true)
const unlocking = ref(false)
const error = ref<string | null>(null)
const meta = ref<BrandPackMeta | null>(null)
const items = ref<BrandPackItem[]>([])
const password = ref('')
const needsPassword = ref(false)

const hasVideo = computed(() => items.value.some((item) => item.mediaKind === 'video'))

async function loadGallery() {
  const data = await fetchBrandPackItems(token.value)
  items.value = data.items
  if (meta.value) {
    meta.value = { ...meta.value, title: data.title, notes: data.notes, unlocked: true }
  }
}

async function bootstrap() {
  loading.value = true
  error.value = null
  items.value = []
  try {
    if (!token.value) throw new Error('This brand pack link is invalid.')
    meta.value = await fetchBrandPackMeta(token.value)
    needsPassword.value = meta.value.passwordRequired && !meta.value.unlocked
    if (!needsPassword.value) await loadGallery()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not open this brand pack.'
    meta.value = null
  } finally {
    loading.value = false
  }
}

async function onUnlock() {
  unlocking.value = true
  error.value = null
  try {
    await unlockBrandPack(token.value, password.value)
    needsPassword.value = false
    await loadGallery()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not unlock this pack.'
  } finally {
    unlocking.value = false
  }
}

onMounted(bootstrap)
</script>

<template>
  <section class="min-h-[70vh] bg-trovara-cream pt-28 pb-20">
    <div class="container-trovara">
      <p v-if="loading" class="text-center text-trovara-dark/70">Loading pack…</p>
      <p v-else-if="error" class="text-center text-red-700" role="alert">{{ error }}</p>

      <template v-else-if="meta">
        <header class="max-w-3xl mb-10">
          <p class="section-subheading text-trovara-green mb-3">Brand pack</p>
          <h1 class="text-4xl sm:text-5xl font-black text-trovara-dark leading-tight">
            {{ meta.title }}
          </h1>
          <p v-if="meta.notes" class="mt-4 text-trovara-dark/75 leading-relaxed max-w-2xl">
            {{ meta.notes }}
          </p>
        </header>

        <form
          v-if="needsPassword"
          class="max-w-md rounded-3xl bg-white shadow-sm border border-trovara-dark/10 p-6 sm:p-8 grid gap-4"
          @submit.prevent="onUnlock"
        >
          <label class="grid gap-2 text-sm font-semibold text-trovara-dark">
            Password
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="rounded-xl border border-trovara-dark/15 px-3 py-3 font-normal"
            />
          </label>
          <button
            type="submit"
            class="rounded-full bg-trovara-green text-white font-bold px-5 py-3 disabled:opacity-60"
            :disabled="unlocking"
          >
            {{ unlocking ? 'Unlocking…' : 'View pack' }}
          </button>
        </form>

        <section v-else>
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p class="text-trovara-dark/70">
              {{ items.length }} file{{ items.length === 1 ? '' : 's' }}
              <span v-if="hasVideo" class="block sm:inline sm:ml-2 text-sm">
                Large packs with video may take longer to zip.
              </span>
            </p>
            <a
              class="inline-flex rounded-full bg-trovara-green text-white font-bold px-5 py-3"
              :href="brandPackZipUrl(token)"
              download
            >
              Download all (zip)
            </a>
          </div>
          <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 list-none p-0 m-0">
            <li v-for="item in items" :key="item.id">
              <div class="block text-trovara-dark">
                <video
                  v-if="item.mediaKind === 'video'"
                  class="w-full aspect-video object-cover rounded-2xl bg-black border border-trovara-dark/10"
                  controls
                  playsinline
                  preload="metadata"
                  :poster="item.posterUrl ?? undefined"
                  :src="item.mediaUrl"
                />
                <a
                  v-else
                  class="block no-underline text-trovara-dark"
                  :href="item.mediaUrl"
                  target="_blank"
                  rel="noopener"
                  :download="item.originalName"
                >
                  <img
                    class="w-full aspect-square object-cover rounded-2xl bg-white border border-trovara-dark/10"
                    :src="item.mediaUrl"
                    :alt="item.originalName"
                    loading="lazy"
                  />
                </a>
                <div class="mt-2 flex items-center justify-between gap-2">
                  <span class="text-sm truncate">{{ item.originalName }}</span>
                  <span
                    v-if="item.mediaKind === 'video' && formatBrandDuration(item.durationSeconds)"
                    class="text-xs text-trovara-dark/60 shrink-0"
                  >
                    {{ formatBrandDuration(item.durationSeconds) }}
                  </span>
                </div>
                <a
                  v-if="item.mediaKind === 'video'"
                  class="mt-1 inline-block text-sm font-semibold text-trovara-green"
                  :href="item.mediaUrl"
                  download
                >
                  Download
                </a>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </section>
</template>
