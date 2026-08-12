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
  summary: string
  bodyMarkdown: string
  applyEmail: string
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
}

const applyHref = computed(() => {
  const email = post.value?.applyEmail || CONTACT_EMAILS.hello
  const subject = post.value ? `Application: ${post.value.title}` : 'Career application'
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
  <div>
    <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">Careers</p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 break-words">
          {{ post?.title || 'Open role' }}
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          {{ post?.summary || 'Details for this Trovara Farm opening.' }}
        </p>
      </div>
    </section>

    <section class="section-padding">
      <div class="container-trovara max-w-3xl mx-auto">
        <p class="mb-6">
          <RouterLink to="/careers" class="text-trovara-green font-semibold hover:underline">
            ← All roles
          </RouterLink>
        </p>
        <div v-if="loading" class="text-trovara-muted">Loading role…</div>
        <div v-else-if="error || !post" class="rounded-2xl border border-trovara-border bg-trovara-cream/40 p-6">
          <p class="text-trovara-muted mb-4">{{ error || 'Role not found' }}</p>
          <RouterLink to="/careers" class="btn-primary">Back to careers</RouterLink>
        </div>
        <article v-else>
          <p class="text-xs font-bold uppercase tracking-wide text-trovara-gold mb-6">
            {{ employmentLabel[post.employmentType] || post.employmentType }}
            <span v-if="post.department"> · {{ post.department }}</span>
            <span v-if="post.location"> · {{ post.location }}</span>
          </p>
          <div class="prose prose-trovara max-w-none career-body" v-html="renderSafeMarkdown(post.bodyMarkdown)" />
          <a class="btn-primary mt-8 flex w-full sm:inline-flex sm:w-auto" :href="applyHref">Apply via email</a>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.career-body :deep(h2),
.career-body :deep(h3) {
  margin: 1.5rem 0 0.6rem;
  color: #18311f;
  font-weight: 800;
}
.career-body :deep(p),
.career-body :deep(li) {
  color: #617064;
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
</style>
