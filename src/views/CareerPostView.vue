<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CONTACT_EMAILS, mailto } from '../lib/contact-emails'
import { renderSafeMarkdown } from '../lib/markdown'
import { applyPageMeta } from '../composables/usePageMeta'

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
  expectedStartDate: string | null
  summary: string
  bodyMarkdown: string
  applyEmail: string
  applySubject: string | null
  applicationInstructions: string | null
  publishedAt: string | null
}

const route = useRoute()
const router = useRouter()
const post = ref<CareerPost | null>(null)
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

const applyHref = computed(() => {
  const email = post.value?.applyEmail || CONTACT_EMAILS.hello
  const subject = post.value?.applySubject || (post.value ? `Application: ${post.value.title}` : 'Career application')
  return mailto(email, subject)
})

async function load() {
  loading.value = true
  error.value = null
  try {
    const slug = String(route.params.slug || '')
    const response = await fetch(`/careers-api/${encodeURIComponent(slug)}`)
    if (!response.ok) throw new Error('Role not found')
    const data = (await response.json()) as { post?: CareerPost }
    post.value = data.post ?? null
    if (!post.value) throw new Error('Role not found')
    applyPageMeta(router.currentRoute.value, {
      title: `${post.value.title} - Careers - Trovara Farm`,
      description: post.value.summary,
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Role not found'
    post.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="career-page">
    <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 mx-auto max-w-4xl text-center">
        <p class="section-subheading text-trovara-gold-300 mb-4">Careers</p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 break-words">
          {{ post?.title || 'Open role' }}
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          {{ post?.summary || 'Details for this Trovara Farm opening.' }}
        </p>
      </div>
    </section>

    <section class="career-detail section-padding">
      <div class="container-trovara mx-auto max-w-3xl">
        <p class="career-back-link">
          <RouterLink to="/careers" class="text-trovara-green font-semibold hover:underline">
            ← All roles
          </RouterLink>
        </p>
        <div v-if="loading" class="text-trovara-muted">Loading role…</div>
        <div v-else-if="error || !post" class="career-state-card">
          <p class="text-trovara-muted mb-4">{{ error || 'Role not found' }}</p>
          <RouterLink to="/careers" class="btn-primary">Back to careers</RouterLink>
        </div>
        <article v-else class="career-post">
          <p class="career-role-meta">
            {{ employmentLabel[post.employmentType] || post.employmentType }}
            <span v-if="post.engagementDetails"> · {{ post.engagementDetails }}</span>
            <span v-if="post.department"> · {{ post.department }}</span>
            <span v-if="post.location"> · {{ post.location }}</span>
          </p>
          <dl v-if="post.projectName || post.duration || post.applicationDeadline || post.expectedStartDate" class="career-facts">
            <div v-if="post.projectName" class="career-fact"><dt>Project / programme</dt><dd>{{ post.projectName }}</dd></div>
            <div v-if="post.duration" class="career-fact"><dt>Duration</dt><dd>{{ post.duration }}</dd></div>
            <div v-if="post.applicationDeadline" class="career-fact"><dt>Application deadline</dt><dd>{{ new Date(`${post.applicationDeadline}T00:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) }}</dd></div>
            <div v-if="post.expectedStartDate" class="career-fact"><dt>Expected start</dt><dd>{{ new Date(`${post.expectedStartDate}T00:00:00`).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) }}</dd></div>
          </dl>
          <div class="prose prose-trovara max-w-none career-body" v-html="renderSafeMarkdown(post.bodyMarkdown)" />
          <p v-if="post.applicationInstructions" class="career-application-instructions">{{ post.applicationInstructions }}</p>
          <a class="btn-primary mt-8 flex w-full sm:inline-flex sm:w-auto" :href="applyHref">Apply via email</a>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.career-page,
.career-detail {
  background: var(--tv-canvas);
}

.career-back-link {
  margin-bottom: 2rem;
}

.career-state-card {
  padding: 1.5rem;
  border: 1px solid var(--tv-border);
  border-radius: 1rem;
  background: var(--tv-surface);
}

.career-role-meta {
  margin-bottom: 1.25rem;
  color: #b6872e;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.5;
  text-transform: uppercase;
}

.career-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 3rem;
  overflow: hidden;
  border: 1px solid var(--tv-border);
  border-radius: 1rem;
  background: var(--tv-surface);
}

.career-fact {
  min-width: 0;
  padding: 1.25rem;
  border-bottom: 1px solid var(--tv-border);
}

.career-fact:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.career-fact:nth-child(odd) {
  border-right: 1px solid var(--tv-border);
}

.career-fact dt {
  color: var(--tv-muted-text);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.career-fact dd {
  margin-top: 0.4rem;
  color: var(--tv-ink);
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.career-body :deep(h2),
.career-body :deep(h3) {
  margin: 1.5rem 0 0.6rem;
  color: var(--tv-ink);
  font-weight: 800;
  line-height: 1.25;
}
.career-body :deep(p),
.career-body :deep(li) {
  color: var(--tv-muted-text);
  line-height: 1.65;
  overflow-wrap: anywhere;
}
.career-body :deep(ul) {
  padding-left: 1.2rem;
  margin: 0.75rem 0;
}

.career-body :deep(a) {
  overflow-wrap: anywhere;
}

.career-body :deep(li::marker) {
  color: #b6872e;
}

.career-application-instructions {
  margin-top: 2rem;
  color: var(--tv-muted-text);
  line-height: 1.65;
  white-space: pre-line;
}

@media (max-width: 639px) {
  .career-facts {
    grid-template-columns: 1fr;
  }

  .career-fact,
  .career-fact:nth-last-child(-n + 2) {
    border-right: 0;
    border-bottom: 1px solid var(--tv-border);
  }

  .career-fact:last-child {
    border-bottom: 0;
  }
}
</style>
