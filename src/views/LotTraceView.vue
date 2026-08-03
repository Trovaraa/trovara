<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { applyPageMeta } from '../composables/usePageMeta'
import {
  celebrationSymbolsForProduct,
  fetchPublicLot,
  publicLotCertificateUrl,
  type PublicLot,
} from '../lib/lot'

const route = useRoute()
const farmSlug = computed(() => String(route.params.farmSlug ?? ''))
const publicToken = computed(() => String(route.params.lotCode ?? ''))

const lot = ref<PublicLot | null>(null)
const verified = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)
const pendingVerification = ref(false)

const celebrationSymbols = computed(() =>
  celebrationSymbolsForProduct(lot.value?.productName ?? ''),
)

const certificateHref = computed(() =>
  publicLotCertificateUrl(farmSlug.value, publicToken.value),
)

const quantityLabel = computed(() => {
  if (!lot.value) return ''
  return `${lot.value.quantityKg} ${lot.value.unit === 'crates' ? 'crates' : 'kg'}`
})

watch(
  [farmSlug, publicToken, lot, loading, error, pendingVerification],
  () => {
    if (!farmSlug.value || !publicToken.value) return
    if (loading.value) {
      applyPageMeta(route, {
        title: 'Verifying lot - Trovara Farm',
        description: 'Verifying your Trovara Farm harvest lot.',
        canonicalPath: `/lot/${farmSlug.value}/${publicToken.value}`,
      })
      return
    }
    if (lot.value) {
      applyPageMeta(route, {
        title: `${lot.value.lotCode} · Traceability - Trovara Farm`,
        description: `Verified harvest record for ${lot.value.productName} from ${lot.value.farm.name}.`,
        canonicalPath: `/lot/${farmSlug.value}/${publicToken.value}`,
      })
      return
    }
    applyPageMeta(route, {
      title: pendingVerification.value
        ? 'Lot being prepared - Trovara Farm'
        : 'Lot not found - Trovara Farm',
      description: pendingVerification.value
        ? 'This Trovara Farm lot is waiting for farm confirmation.'
        : 'This Trovara Farm lot could not be verified.',
      canonicalPath: `/lot/${farmSlug.value}/${publicToken.value}`,
    })
  },
  { immediate: true },
)

onMounted(async () => {
  loading.value = true
  error.value = null
  pendingVerification.value = false
  lot.value = null
  verified.value = false

  const result = await fetchPublicLot(farmSlug.value, publicToken.value)
  if (result.ok) {
    lot.value = result.data.lot
    verified.value = result.data.verified
  } else if (result.error.pendingVerification) {
    pendingVerification.value = true
  } else {
    error.value = result.error.message
  }
  loading.value = false
})
</script>

<template>
  <div>
    <section class="pt-32 pb-16 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 max-w-2xl text-center">
        <p class="section-subheading text-trovara-gold-300 mb-4">Traceability</p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          Harvest verification
        </h1>
        <p class="text-white/70 text-base sm:text-lg mt-4 leading-relaxed max-w-xl mx-auto">
          Scan a Trovara QR code to confirm what you received came from our farm.
        </p>
      </div>
    </section>

    <section class="py-12 md:py-16 bg-trovara-cream">
      <div class="container-trovara max-w-lg public-lot-stage">
        <div v-if="loading" class="text-center text-trovara-green-600 py-16">
          Verifying this lot…
        </div>

        <div
          v-else-if="pendingVerification"
          class="bg-white border border-trovara-gold/40 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-sm"
        >
          <p class="text-trovara-gold font-bold">Being prepared</p>
          <p class="text-sm text-gray-600 leading-relaxed">
            Your traceability certificate is being prepared. It will be available here once the farm
            confirms your order.
          </p>
          <p class="text-xs text-gray-400 font-mono break-all">{{ publicToken }}</p>
        </div>

        <div
          v-else-if="error"
          class="bg-white border border-red-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm"
        >
          <p class="text-red-700">{{ error }}</p>
          <p class="text-xs text-gray-400 mt-3 font-mono break-all">{{ publicToken }}</p>
        </div>

        <div v-else-if="lot" class="public-lot-reveal-wrap">
          <div class="party-burst party-burst--left" aria-hidden="true">
            <span
              v-for="(symbol, index) in celebrationSymbols"
              :key="`left-${index}`"
              class="party-particle"
            >{{ symbol }}</span>
          </div>
          <div class="party-burst party-burst--right" aria-hidden="true">
            <span
              v-for="(symbol, index) in celebrationSymbols"
              :key="`right-${index}`"
              class="party-particle"
            >{{ symbol }}</span>
          </div>

          <article
            class="public-lot-card bg-white border border-trovara-green/15 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm"
          >
            <div class="text-center">
              <p class="text-xs text-gray-500 uppercase tracking-wide">Lot code</p>
              <p class="lot-code text-2xl sm:text-3xl font-black font-mono text-trovara-gold mt-1">
                {{ lot.lotCode }}
              </p>
              <p v-if="verified" class="verified-badge text-xs text-trovara-green mt-2 font-bold">
                ✓ Farm verified
              </p>
            </div>

            <p class="text-sm text-gray-600 leading-relaxed text-center">
              This record is published by Trovara Farm so you can trust the product in your hands.
            </p>

            <div class="space-y-3 text-sm">
              <div v-if="lot.preparedFor" class="flex justify-between gap-4">
                <span class="text-gray-500">Prepared for</span>
                <span class="text-trovara-dark font-medium text-right">{{ lot.preparedFor }}</span>
              </div>
              <div v-if="lot.orderReference" class="flex justify-between gap-4">
                <span class="text-gray-500">Order</span>
                <span class="text-gray-700 font-mono text-right">{{ lot.orderReference }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-gray-500">Product</span>
                <span class="text-trovara-dark font-medium text-right">{{ lot.productName }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-gray-500">Quantity</span>
                <span class="text-trovara-dark font-mono">{{ quantityLabel }}</span>
              </div>
              <div v-if="lot.plotName" class="flex justify-between gap-4">
                <span class="text-gray-500">Plot</span>
                <span class="text-gray-700">{{ lot.plotName }}</span>
              </div>
              <div v-if="lot.cropType" class="flex justify-between gap-4">
                <span class="text-gray-500">Crop</span>
                <span class="text-gray-700 capitalize">{{ lot.cropType }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-gray-500">Harvested</span>
                <span class="text-gray-700">{{ new Date(lot.harvestedAt).toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-gray-500">Farm</span>
                <span class="text-gray-700 text-right">{{ lot.farm.name }}</span>
              </div>
              <div v-if="lot.farm.location" class="flex justify-between gap-4">
                <span class="text-gray-500">Location</span>
                <span class="text-gray-700 text-right">{{ lot.farm.location }}</span>
              </div>
              <div v-if="lot.publicNotes" class="pt-1">
                <p class="text-gray-500 mb-1">Notes</p>
                <p class="text-gray-700 leading-relaxed">{{ lot.publicNotes }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-100 text-center space-y-3">
              <a
                :href="certificateHref"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary inline-flex min-h-11"
              >
                Download certificate
              </a>
              <p class="text-xs text-gray-500">Share this page link with anyone who needs to verify the lot.</p>
            </div>
          </article>
        </div>

        <div class="mt-10 text-center">
          <RouterLink to="/shop" class="text-trovara-green font-semibold hover:underline">
            Visit the shop
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.public-lot-stage {
  perspective: 1200px;
}

.public-lot-reveal-wrap {
  position: relative;
  isolation: isolate;
}

.public-lot-card {
  position: relative;
  z-index: 2;
  transform-origin: center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform, opacity, box-shadow;
  animation: public-lot-reveal 1.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.lot-code {
  overflow-wrap: anywhere;
}

.verified-badge {
  animation: verified-badge-celebrate 680ms 1.18s ease-out both;
}

@keyframes public-lot-reveal {
  0% {
    opacity: 0;
    transform: rotateY(-360deg) scale(0.72);
    box-shadow: 0 0 0 rgb(45 106 79 / 0);
  }

  12% {
    opacity: 1;
  }

  68% {
    transform: rotateY(0deg) scale(1);
    box-shadow: 0 0 0 rgb(45 106 79 / 0);
  }

  78% {
    transform: rotateY(0deg) rotate(-1.5deg) scale(1.075);
    box-shadow:
      0 0 0 3px rgb(45 106 79 / 0.22),
      0 0 42px rgb(201 162 39 / 0.28);
  }

  86% {
    transform: rotateY(0deg) rotate(1.25deg) scale(0.985);
  }

  93% {
    transform: rotateY(0deg) rotate(-0.5deg) scale(1.025);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg) rotate(0) scale(1);
    box-shadow:
      0 0 0 1px rgb(45 106 79 / 0.08),
      0 18px 48px rgb(0 0 0 / 0.1);
  }
}

@keyframes verified-badge-celebrate {
  0% {
    opacity: 0.35;
    text-shadow: 0 0 0 rgb(45 106 79 / 0);
  }

  45% {
    opacity: 1;
    text-shadow: 0 0 18px rgb(45 106 79 / 0.55);
  }

  100% {
    opacity: 1;
    text-shadow: 0 0 5px rgb(45 106 79 / 0.2);
  }
}

.party-burst {
  position: absolute;
  z-index: 3;
  bottom: 12%;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.party-burst--left {
  left: 4%;
}

.party-burst--right {
  right: 4%;
  transform: scaleX(-1);
}

.party-burst::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -8px;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 18px solid rgb(201 162 39);
  opacity: 0;
  transform: rotate(-45deg) scale(0.5);
  transform-origin: left center;
  animation: party-popper 620ms 1.14s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.party-particle {
  --party-x: 0px;
  --party-y: -80px;
  --party-r: 180deg;
  --party-delay: 0ms;
  position: absolute;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1.45rem;
  line-height: 1;
  text-align: center;
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.2));
  opacity: 0;
  animation: party-particle-flight 920ms calc(1.16s + var(--party-delay))
    cubic-bezier(0.18, 0.72, 0.28, 1) both;
}

.party-particle:nth-child(3n) {
  font-size: 1.15rem;
}

.party-particle:nth-child(4n) {
  font-size: 1.7rem;
}

.party-particle:nth-child(1) {
  --party-x: 36px;
  --party-y: -118px;
  --party-r: 240deg;
}

.party-particle:nth-child(2) {
  --party-x: 62px;
  --party-y: -92px;
  --party-r: -180deg;
  --party-delay: 35ms;
}

.party-particle:nth-child(3) {
  --party-x: 88px;
  --party-y: -142px;
  --party-r: 320deg;
  --party-delay: 60ms;
}

.party-particle:nth-child(4) {
  --party-x: 118px;
  --party-y: -106px;
  --party-r: -260deg;
  --party-delay: 15ms;
}

.party-particle:nth-child(5) {
  --party-x: 144px;
  --party-y: -162px;
  --party-r: 390deg;
  --party-delay: 75ms;
}

.party-particle:nth-child(6) {
  --party-x: 172px;
  --party-y: -122px;
  --party-r: -340deg;
  --party-delay: 45ms;
}

.party-particle:nth-child(7) {
  --party-x: 78px;
  --party-y: -190px;
  --party-r: 280deg;
  --party-delay: 90ms;
}

.party-particle:nth-child(8) {
  --party-x: 206px;
  --party-y: -176px;
  --party-r: -420deg;
  --party-delay: 110ms;
}

.party-particle:nth-child(9) {
  --party-x: 132px;
  --party-y: -218px;
  --party-r: 360deg;
  --party-delay: 70ms;
}

.party-particle:nth-child(10) {
  --party-x: 226px;
  --party-y: -232px;
  --party-r: -300deg;
  --party-delay: 125ms;
}

@keyframes party-popper {
  0% {
    opacity: 0;
    transform: rotate(-45deg) scale(0.5);
  }

  35% {
    opacity: 1;
    transform: rotate(-45deg) scale(1.18);
  }

  100% {
    opacity: 0;
    transform: rotate(-45deg) scale(0.85);
  }
}

@keyframes party-particle-flight {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(0) scale(0.4);
  }

  15% {
    opacity: 1;
  }

  76% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(var(--party-x), var(--party-y)) rotate(var(--party-r)) scale(0.85);
  }
}

@media (max-width: 480px) {
  .public-lot-card {
    animation-duration: 1.55s;
  }

  .party-burst--left {
    left: 7%;
    transform: scale(0.82);
    transform-origin: bottom left;
  }

  .party-burst--right {
    right: 7%;
    transform: scaleX(-1) scale(0.82);
    transform-origin: bottom right;
  }

  .party-particle {
    animation-duration: 760ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  .public-lot-card {
    animation: public-lot-reveal-reduced 720ms ease-out both;
  }

  .verified-badge {
    animation: verified-badge-reduced 780ms 180ms ease-out both;
  }

  .party-burst {
    display: none;
  }

  @keyframes public-lot-reveal-reduced {
    from {
      opacity: 0;
      box-shadow:
        0 0 0 1px rgb(201 162 39 / 0),
        0 0 0 rgb(45 106 79 / 0);
    }

    55% {
      opacity: 1;
      box-shadow:
        0 0 0 3px rgb(201 162 39 / 0.3),
        0 0 34px rgb(45 106 79 / 0.2);
    }

    to {
      opacity: 1;
      box-shadow:
        0 0 0 1px rgb(45 106 79 / 0.08),
        0 12px 36px rgb(0 0 0 / 0.08);
    }
  }

  @keyframes verified-badge-reduced {
    from {
      opacity: 0.45;
      color: rgb(107 114 128);
      text-shadow: 0 0 0 rgb(45 106 79 / 0);
    }

    55% {
      opacity: 1;
      color: rgb(45 106 79);
      text-shadow: 0 0 16px rgb(45 106 79 / 0.5);
    }

    to {
      opacity: 1;
      color: rgb(45 106 79);
      text-shadow: 0 0 4px rgb(45 106 79 / 0.15);
    }
  }
}
</style>
