<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import {
  journalEngagementApi,
  type JournalComment,
} from '../../lib/journal-engagement'

const props = defineProps<{ slug: string }>()

const loading = ref(true)
const liking = ref(false)
const submitting = ref(false)
const unavailable = ref(false)
const error = ref('')
const notice = ref('')
const liked = ref(false)
const likeCount = ref(0)
const comments = ref<JournalComment[]>([])
const form = reactive({ name: '', body: '', honey: '' })

function readableDate(value: string): string {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(value))
}

async function loadEngagement() {
  loading.value = true
  error.value = ''
  unavailable.value = false
  try {
    const data = await journalEngagementApi.get(props.slug)
    liked.value = data.liked
    likeCount.value = data.likeCount
    comments.value = data.comments
  } catch (cause) {
    unavailable.value = true
    error.value = cause instanceof Error ? cause.message : 'The conversation is temporarily unavailable.'
  } finally {
    loading.value = false
  }
}

async function toggleLike() {
  if (liking.value || unavailable.value) return
  liking.value = true
  error.value = ''
  try {
    const data = await journalEngagementApi.toggleLike(props.slug)
    liked.value = data.liked
    likeCount.value = data.likeCount
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not save your like.'
  } finally {
    liking.value = false
  }
}

async function submitComment() {
  if (submitting.value || !form.name.trim() || form.body.trim().length < 2) return
  submitting.value = true
  error.value = ''
  notice.value = ''
  try {
    await journalEngagementApi.comment(props.slug, {
      name: form.name.trim(),
      body: form.body.trim(),
      honey: form.honey,
    })
    form.body = ''
    form.honey = ''
    notice.value = 'Thank you. Your comment will appear after the Trovara team reviews it.'
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not send your comment.'
  } finally {
    submitting.value = false
  }
}

watch(() => props.slug, loadEngagement)
onMounted(loadEngagement)
</script>

<template>
  <section class="journal-conversation" aria-labelledby="journal-conversation-title">
    <div class="journal-conversation__header">
      <div>
        <p class="section-subheading mb-2">Join the conversation</p>
        <h2 id="journal-conversation-title" class="text-2xl md:text-3xl font-black text-trovara-dark">
          What did this story bring to mind?
        </h2>
      </div>
      <button
        type="button"
        class="journal-like"
        :class="{ 'journal-like--active': liked }"
        :aria-pressed="liked"
        :aria-label="liked ? 'Remove your like' : 'Like this story'"
        :disabled="loading || liking || unavailable"
        @click="toggleLike"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
        <span>{{ liked ? 'Liked' : 'Like' }}</span>
        <span class="journal-like__count">{{ likeCount }}</span>
      </button>
    </div>

    <p v-if="loading" class="mt-6 text-sm text-gray-500" aria-live="polite">Loading conversation…</p>
    <p v-else-if="unavailable" class="mt-6 rounded-xl bg-trovara-light px-4 py-3 text-sm text-gray-600" role="status">
      The conversation is not available for this story yet. You can still read and share it.
    </p>

    <template v-else>
      <form class="journal-comment-form" @submit.prevent="submitComment">
        <label>
          <span>Your name</span>
          <input v-model="form.name" required maxlength="80" autocomplete="name" placeholder="How should we show your name?" />
        </label>
        <label>
          <span>Your comment</span>
          <textarea v-model="form.body" required minlength="2" maxlength="1200" rows="4" placeholder="Share a thought or question…" />
          <small>{{ form.body.length }}/1200</small>
        </label>
        <label class="sr-only" aria-hidden="true">
          Leave this blank
          <input v-model="form.honey" tabindex="-1" autocomplete="off" />
        </label>
        <div class="flex flex-wrap items-center gap-4">
          <button class="btn-primary px-6 py-3 text-sm" type="submit" :disabled="submitting">
            {{ submitting ? 'Sending…' : 'Post comment' }}
          </button>
          <p class="text-xs text-gray-500">Comments are reviewed before they appear.</p>
        </div>
      </form>

      <p v-if="notice" class="journal-message journal-message--success" role="status">{{ notice }}</p>
      <p v-if="error" class="journal-message journal-message--error" role="alert">{{ error }}</p>

      <div class="mt-10">
        <h3 class="text-lg font-black text-trovara-dark">
          {{ comments.length ? `${comments.length} comment${comments.length === 1 ? '' : 's'}` : 'Comments' }}
        </h3>
        <ol v-if="comments.length" class="mt-5 space-y-4">
          <li v-for="comment in comments" :key="comment.id" class="journal-comment">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <strong class="text-trovara-dark">{{ comment.authorName }}</strong>
              <time :datetime="comment.createdAt" class="text-xs text-gray-500">{{ readableDate(comment.createdAt) }}</time>
            </div>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">{{ comment.body }}</p>
          </li>
        </ol>
        <p v-else class="mt-4 text-sm text-gray-500">Be the first to leave a thoughtful comment.</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.journal-conversation { @apply rounded-3xl border border-trovara-green/10 bg-white p-5 shadow-sm sm:p-8; }
.journal-conversation__header { @apply flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between; }
.journal-like { @apply inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full border border-trovara-green/20 bg-white px-5 py-2.5 text-sm font-bold text-trovara-green transition hover:border-trovara-green hover:bg-trovara-light disabled:cursor-not-allowed disabled:opacity-50; }
.journal-like svg { @apply h-5 w-5; }
.journal-like--active { @apply border-trovara-gold bg-trovara-gold/10 text-trovara-dark; }
.journal-like--active svg { fill: currentColor; }
.journal-like__count { @apply min-w-6 rounded-full bg-trovara-light px-1.5 py-0.5 text-xs; }
.journal-comment-form { @apply mt-8 space-y-5; }
.journal-comment-form label:not(.sr-only) { @apply block text-sm font-bold text-trovara-dark; }
.journal-comment-form input,
.journal-comment-form textarea { @apply mt-2 w-full rounded-xl border border-trovara-green/20 bg-white px-4 py-3 font-normal text-trovara-dark outline-none transition focus:border-trovara-green focus:ring-4 focus:ring-trovara-green/10; }
.journal-comment-form textarea { @apply resize-y; }
.journal-comment-form small { @apply mt-1 block text-right text-xs font-normal text-gray-400; }
.journal-message { @apply mt-5 rounded-xl px-4 py-3 text-sm; }
.journal-message--success { @apply bg-emerald-50 text-emerald-800; }
.journal-message--error { @apply bg-red-50 text-red-700; }
.journal-comment { @apply rounded-2xl border border-gray-100 bg-trovara-cream/40 p-4 sm:p-5; }
@media (prefers-reduced-motion: reduce) {
  .journal-like { transition: none; }
}
</style>

