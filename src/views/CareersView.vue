<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CONTACT_EMAILS, mailto } from '../lib/contact-emails'

type CareerPost = {
  id: string
  slug: string
  title: string
  department: string | null
  location: string | null
  employmentType: string
  engagementDetails: string | null
  projectName: string | null
  duration: string | null
  applicationDeadline: string | null
  summary: string
  applyEmail: string
  publishedAt: string | null
}

const posts = ref<CareerPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const employmentLabel: Record<string, string> = {
  full_time: 'Full time',
  part_time: 'Part time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
  consultancy: 'Consultancy',
  graduate_placement: 'Graduate placement',
}

const hasOpenRoles = computed(() => posts.value.length > 0)

async function load() {
  loading.value = true
  error.value = null
  try {
    // No trailing slash — Netlify → OS `/public/careers/` 404s an empty list.
    // Bypass caches: OS nginx historically marked all /public/* immutable for a year.
    const response = await fetch('/careers-api', { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to load careers')
    const data = (await response.json()) as { posts?: CareerPost[] }
    posts.value = Array.isArray(data.posts) ? data.posts : []
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load careers'
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">Careers</p>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">Grow with Trovara</h1>
        <p class="text-white/70 text-lg leading-relaxed">
          Open roles on the team building regenerative food in Abeokuta for buyers across Nigeria.
        </p>
      </div>
    </section>

    <section class="py-12 md:py-16">
      <div class="container-trovara max-w-4xl mx-auto">
        <div v-if="loading" class="text-trovara-muted">Loading open roles…</div>
        <div v-else-if="error" class="rounded-2xl border border-trovara-border bg-trovara-cream/40 p-6">
          <p class="text-trovara-muted mb-4">{{ error }}</p>
          <button type="button" class="btn-secondary" @click="load">Try again</button>
        </div>
        <div v-else-if="!hasOpenRoles" class="rounded-2xl border border-trovara-border bg-trovara-cream/40 px-6 py-8 md:px-8">
          <h2 class="text-2xl font-black text-trovara-dark mb-3">No job postings yet</h2>
          <p class="text-trovara-muted leading-relaxed">
            There are no open roles at the moment. If you want to work with us later,
            send a short note and CV to
            <a class="text-trovara-green font-semibold hover:underline" :href="mailto(CONTACT_EMAILS.hello, 'Careers interest')">
              {{ CONTACT_EMAILS.hello }}
            </a>.
          </p>
        </div>
        <div v-else class="space-y-4">
          <article
            v-for="post in posts"
            :key="post.id"
            class="flex flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 rounded-2xl border border-trovara-border bg-white p-5 sm:p-6"
          >
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold uppercase tracking-wide text-trovara-gold mb-2">
                {{ employmentLabel[post.employmentType] || post.employmentType }}
                <span v-if="post.engagementDetails"> · {{ post.engagementDetails }}</span>
                <span v-if="post.department"> · {{ post.department }}</span>
                <span v-if="post.location"> · {{ post.location }}</span>
              </p>
              <h2 class="text-2xl font-black text-trovara-dark mb-2">
                <RouterLink class="hover:text-trovara-green" :to="`/careers/${post.slug}`">
                  {{ post.title }}
                </RouterLink>
              </h2>
              <p class="text-trovara-muted leading-relaxed">{{ post.summary }}</p>
              <p v-if="post.applicationDeadline" class="mt-3 text-sm font-semibold text-trovara-dark">
                Apply by {{ new Date(`${post.applicationDeadline}T00:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) }}
              </p>
            </div>
            <RouterLink class="btn-primary w-full sm:w-auto" :to="`/careers/${post.slug}`">View role</RouterLink>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
