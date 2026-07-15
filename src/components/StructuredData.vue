<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

type SchemaValue = Record<string, unknown> | Array<Record<string, unknown>>

const props = defineProps<{
  additionalSchema?: SchemaValue
}>()

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Trovara Farm',
  url: 'https://trovara.farm',
  logo: 'https://trovara.farm/images/trovara-brand.png',
  sameAs: ['https://github.com/trovara'],
}

const schemas = computed(() => {
  const extras = Array.isArray(props.additionalSchema)
    ? props.additionalSchema
    : props.additionalSchema
      ? [props.additionalSchema]
      : []

  return [ORGANIZATION_SCHEMA, ...extras]
})

function upsertStructuredDataScript(content: string) {
  const id = 'trovara-structured-data'
  let script = document.getElementById(id) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = content
}

watch(
  schemas,
  (value) => {
    const payload =
      value.length === 1
        ? value[0]
        : {
            '@context': 'https://schema.org',
            '@graph': value,
          }
    upsertStructuredDataScript(JSON.stringify(payload))
  },
  { immediate: true, deep: true },
)

onBeforeUnmount(() => {
  document.getElementById('trovara-structured-data')?.remove()
})
</script>

<template>
  <slot />
</template>
