import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { lockdownPreviewRedirects } from '../scripts/lockdown-preview-redirects.mjs'

const source = () => readFile(new URL('../src/components/CareerApplicationForm.vue', import.meta.url), 'utf8')
test('careers form preserves no-account intake with versioned privacy and a stable request ID', async () => {
  const form = await source()
  assert.match(form, /credentials: 'omit'/)
  assert.match(form, /body.append\('privacyNoticeVersion', policy.value.noticeVersion\)/)
  assert.match(form, /body.append\('requestId', requestId.value\)/)
  assert.match(form, /Apply without creating an account/)
  assert.doesNotMatch(form, /localStorage|sessionStorage|v-html/)
})
test('careers form validates file types/size and has accessible error/success states', async () => {
  const form = await source()
  assert.match(form, /accept=".pdf,.docx"/)
  assert.match(form, /cv.value.size > policy.value.maxFileBytes/)
  assert.match(form, /role="alert"/)
  assert.match(form, /role="status"/)
  assert.match(form, /hello@trovara.farm/)
  assert.match(form, /:disabled="submitting"/)
})
test('preview intake is denied before the read-only careers wildcard', () => {
  const result = lockdownPreviewRedirects('/careers-api/* https://os.trovara.farm/public/careers/:splat 200!')
  assert.match(result, /^\/careers-api\/applications\s+\/404.html\s+404/)
  assert.match(result, /\/careers-api\/application-policy\s+\/404.html\s+404/)
  assert.match(result, /\/careers-api\/\* https:\/\/os.trovara.farm\/public\/careers\/:splat 200!/)
})
test('role detail integrates the form and keeps the hello email fallback', async () => {
  const page = await readFile(new URL('../src/views/CareerPostView.vue', import.meta.url), 'utf8')
  assert.match(page, /<CareerApplicationForm :key="post.id"/)
  assert.match(page, /const email = CONTACT_EMAILS.hello/)
  assert.match(page, /Prefer email\?/)
})
