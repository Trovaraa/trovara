<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  shopApi,
  ShopApiError,
  formatShopPrice,
  resolveTraceabilityUrl,
  type ShopAccount,
  type ShopOrder,
  type ShopProduct,
} from '../lib/shop'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { TELEGRAM_ORDER_URL } from '../lib/telegram'

type Tab = 'shop' | 'orders' | 'connect'
type AuthMode = 'login' | 'register' | 'forgot'

const loading = ref(true)
const busy = ref(false)
/** Page-level messages (catalog/checkout/orders) — shown near the active tab. */
const error = ref('')
const notice = ref('')
/** Auth form messages — always shown next to #shop-account. */
const authError = ref('')
const authNotice = ref('')
const activeTab = ref<Tab>('shop')
const authMode = ref<AuthMode>('register')
const account = ref<ShopAccount | null>(null)
const products = ref<ShopProduct[]>([])
const orders = ref<ShopOrder[]>([])
const channels = ref<{ channel: string; name: string | null }[]>([])
const linkCode = ref('')
const linkExpiry = ref('')
const showLinkForm = ref(false)
const cart = reactive<Record<string, number>>({})
const showCheckout = ref(false)
const needsVerification = ref(false)

const authForm = reactive({ name: '', email: '', phone: '', password: '' })
const checkoutForm = reactive({ address: '', phone: '' })

const telegramLinked = computed(() =>
  channels.value.some((channel) => channel.channel.toLowerCase() === 'telegram'),
)
const whatsappLinked = computed(() =>
  channels.value.some((channel) => channel.channel.toLowerCase() === 'whatsapp'),
)
const hasLinkedChannels = computed(() => channels.value.length > 0)

let linkPollTimer: ReturnType<typeof setInterval> | null = null

function stopLinkPoll() {
  if (linkPollTimer) {
    clearInterval(linkPollTimer)
    linkPollTimer = null
  }
}

async function refreshChannels() {
  if (!account.value) return
  const me = await shopApi.me()
  channels.value = me.channels
}

const cartLines = computed(() =>
  products.value
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({ product, quantity: cart[product.id] ?? 0 })),
)
const cartCount = computed(() => cartLines.value.reduce((sum, line) => sum + line.quantity, 0))
const cartTotalKobo = computed(() =>
  cartLines.value.reduce((sum, line) => sum + line.product.priceKobo * line.quantity, 0),
)

function productImage(name: string): string | null {
  const lower = name.toLowerCase()
  if (lower.includes('plantain')) return '/images/products/fresh-plantain.jpg'
  if (lower.includes('chicken') || lower.includes('poultry')) return '/images/products/pasture-raised-chicken.jpg'
  return null
}

function setQuantity(productId: string, quantity: number) {
  cart[productId] = Math.max(0, Math.min(100, quantity))
}

function clearMessages() {
  error.value = ''
  notice.value = ''
  authError.value = ''
  authNotice.value = ''
}

function clearAuthMessages() {
  authError.value = ''
  authNotice.value = ''
}

function setAuthMode(mode: AuthMode) {
  authMode.value = mode
  clearAuthMessages()
}

function scrollToAccount() {
  document.getElementById('shop-account')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function goCreateAccount() {
  setAuthMode('register')
  scrollToAccount()
}

function orderTraceUrl(order: ShopOrder): string | null {
  return resolveTraceabilityUrl(order.traceabilityUrl)
}

async function loadAccountData() {
  if (!account.value) return
  const [orderData, me] = await Promise.all([shopApi.orders(), shopApi.me()])
  orders.value = orderData.orders
  channels.value = me.channels
}

async function submitAuth() {
  clearAuthMessages()
  busy.value = true
  try {
    if (authMode.value === 'register') {
      const result = await shopApi.register({
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone || undefined,
        password: authForm.password,
      })
      authForm.password = ''
      authNotice.value = result.message || 'Check your email to verify your account.'
      needsVerification.value = true
    } else {
      const result = await shopApi.login({ email: authForm.email, password: authForm.password })
      account.value = result.account
      checkoutForm.phone = result.account.phone ?? ''
      authForm.password = ''
      needsVerification.value = false
      authNotice.value = 'Welcome back.'
      await loadAccountData()
    }
  } catch (err) {
    if (err instanceof ShopApiError && err.needsVerification) {
      needsVerification.value = true
      authNotice.value = err.message || 'Please verify your email address before signing in.'
      authError.value = ''
    } else {
      authError.value = err instanceof Error ? err.message : 'Unable to sign in.'
    }
    scrollToAccount()
  } finally {
    busy.value = false
  }
}

async function submitForgotPassword() {
  clearAuthMessages()
  busy.value = true
  try {
    const result = await shopApi.forgotPassword({ email: authForm.email })
    authNotice.value = result.message || 'Check your email for a password reset link.'
    authForm.email = ''
  } catch (err) {
    authError.value = err instanceof Error ? err.message : 'Unable to send reset link.'
    scrollToAccount()
  } finally {
    busy.value = false
  }
}

async function resendVerification() {
  clearAuthMessages()
  busy.value = true
  try {
    const result = await shopApi.resendVerification({ email: authForm.email })
    authNotice.value = result.message || 'Verification email sent. Check your inbox.'
  } catch (err) {
    authError.value = err instanceof Error ? err.message : 'Unable to resend verification.'
    scrollToAccount()
  } finally {
    busy.value = false
  }
}

async function logout() {
  clearMessages()
  busy.value = true
  try {
    await shopApi.logout()
    account.value = null
    orders.value = []
    channels.value = []
    linkCode.value = ''
    showLinkForm.value = false
    stopLinkPoll()
    activeTab.value = 'shop'
  } finally {
    busy.value = false
  }
}

function beginCheckout() {
  clearMessages()
  if (!cartCount.value) return
  if (!account.value) {
    authMode.value = 'login'
    authError.value = 'Create an account or sign in before checkout so your order can be tracked.'
    authNotice.value = ''
    scrollToAccount()
    return
  }
  checkoutForm.phone = checkoutForm.phone || account.value.phone || ''
  showCheckout.value = true
}

async function placeOrder() {
  clearMessages()
  busy.value = true
  try {
    const result = await shopApi.placeOrder({
      items: cartLines.value.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
      })),
      address: checkoutForm.address,
      phone: checkoutForm.phone || undefined,
    })
    for (const key of Object.keys(cart)) delete cart[key]
    showCheckout.value = false
    notice.value = `Order ${result.reference} has been received.`
    await loadAccountData()
    activeTab.value = 'orders'
    if (result.payment?.authorizationUrl) window.location.assign(result.payment.authorizationUrl)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to place the order.'
  } finally {
    busy.value = false
  }
}

async function createLinkCode() {
  clearMessages()
  busy.value = true
  try {
    const result = await shopApi.linkCode()
    linkCode.value = result.code
    linkExpiry.value = result.expiresAt
    showLinkForm.value = true
    startLinkPoll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to create a link code.'
  } finally {
    busy.value = false
  }
}

function startLinkPoll() {
  stopLinkPoll()
  const linkedBefore = new Set(channels.value.map((c) => c.channel.toLowerCase()))
  linkPollTimer = setInterval(async () => {
    try {
      if (linkExpiry.value && Date.now() > new Date(linkExpiry.value).getTime()) {
        stopLinkPoll()
        return
      }
      await refreshChannels()
      const newlyLinked = channels.value.find(
        (c) => !linkedBefore.has(c.channel.toLowerCase()),
      )
      if (newlyLinked) {
        linkCode.value = ''
        showLinkForm.value = false
        notice.value = `${newlyLinked.channel.charAt(0).toUpperCase()}${newlyLinked.channel.slice(1)} is linked to your shop account.`
        stopLinkPoll()
      }
    } catch {
      // Keep polling through transient network blips while the code is live.
    }
  }, 3000)
}

async function checkLinkStatus() {
  clearMessages()
  busy.value = true
  try {
    const before = channels.value.length
    await refreshChannels()
    if (channels.value.length > before || hasLinkedChannels.value) {
      if (hasLinkedChannels.value) {
        linkCode.value = ''
        showLinkForm.value = false
        notice.value = telegramLinked.value
          ? 'Telegram is linked to your shop account.'
          : 'Your chat channel is linked.'
        stopLinkPoll()
      } else {
        notice.value = 'Not linked yet. Send the link message in Telegram, then check again.'
      }
    } else {
      notice.value = 'Not linked yet. Send the link message in Telegram, then check again.'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to check link status.'
  } finally {
    busy.value = false
  }
}

async function copyLinkCommand() {
  if (!linkCode.value) return
  await navigator.clipboard.writeText(`link ${linkCode.value}`)
  notice.value = 'Link command copied.'
}

watch(activeTab, (tab) => {
  if (tab === 'connect' && account.value) {
    void refreshChannels().catch(() => {
      /* ignore — page still usable */
    })
  }
})

onUnmounted(stopLinkPoll)

onMounted(async () => {
  // Load independently so a session glitch cannot wipe an otherwise-good catalog.
  const [sessionResult, catalogResult] = await Promise.allSettled([
    shopApi.session(),
    shopApi.catalog(),
  ])
  if (catalogResult.status === 'fulfilled') {
    products.value = catalogResult.value.products ?? []
  } else {
    error.value =
      catalogResult.reason instanceof Error
        ? catalogResult.reason.message
        : 'The shop catalogue is temporarily unavailable.'
  }
  if (sessionResult.status === 'fulfilled') {
    account.value = sessionResult.value.account
    checkoutForm.phone = account.value?.phone ?? ''
    if (account.value) {
      try {
        await loadAccountData()
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unable to load your account.'
      }
    }
  } else if (!error.value) {
    error.value =
      sessionResult.reason instanceof Error
        ? sessionResult.reason.message
        : 'Unable to start a shop session.'
  }
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-trovara-cream pt-16 md:pt-[4.5rem]">
    <section class="bg-trovara-dark text-white">
      <div class="container-trovara py-12 md:py-16">
        <div class="max-w-3xl">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-trovara-gold">Trovara shop</p>
          <h1 class="mt-4 text-4xl font-black leading-tight md:text-6xl">Your farm account. Ready when harvest opens.</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Create an account now to prepare for harvest checkout, connect WhatsApp or Telegram, and stay linked to waitlist updates. Products appear in the shop by SKU as each supply window opens - nothing is sold here until then.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#shop-account" class="btn-gold px-6 py-3 text-sm" @click.prevent="goCreateAccount">Create account</a>
            <RouterLink to="/products" class="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Join product waitlists
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <div class="container-trovara flex flex-col py-8 md:py-12">
      <div v-if="error || notice" class="order-1 mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold" :class="error ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300' : 'border-trovara-green/30 bg-trovara-green/10 text-trovara-green-700 dark:text-trovara-green-300'">
        {{ error || notice }}
      </div>

      <div class="order-2 mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2" aria-label="Shop sections">
        <button v-for="tab in (['shop', 'orders', 'connect'] as Tab[])" :key="tab" type="button" class="min-h-11 shrink-0 rounded-xl px-5 text-sm font-bold capitalize transition" :class="activeTab === tab ? 'bg-trovara-green text-white' : 'text-gray-600 hover:bg-trovara-light'" @click="activeTab = tab">
          {{
            tab === 'orders'
              ? `My orders${orders.length ? ` (${orders.length})` : ''}`
              : tab === 'connect'
                ? hasLinkedChannels
                  ? 'Connect chat · Linked'
                  : 'Connect chat'
                : `Shop${cartCount ? ` (${cartCount})` : ''}`
          }}
        </button>
      </div>

      <div v-if="loading" class="order-3 grid min-h-64 place-items-center text-gray-500">Loading the farm shop…</div>

      <div
        v-else-if="activeTab === 'shop'"
        class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]"
        :class="account ? 'order-3' : 'order-4 mt-8'"
      >
        <section>
          <div class="mb-6 flex items-end justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-green">{{ products.length ? 'Open SKUs' : 'Harvest catalogue' }}</p>
              <h2 class="mt-2 text-3xl font-black text-trovara-dark">Farm shop</h2>
            </div>
            <p class="text-sm text-gray-500">Opens by harvest window</p>
          </div>
          <div v-if="products.length" class="grid gap-5 sm:grid-cols-2">
            <article v-for="product in products" :key="product.id" class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div class="relative h-44 bg-trovara-light">
                <img v-if="productImage(product.name)" :src="productImage(product.name)!" :alt="product.name" class="h-full w-full object-cover" />
                <div v-else class="grid h-full place-items-center text-trovara-green">
                  <svg class="h-16 w-16" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M32 54V27M32 32C22 32 14 24 14 14c10 0 18 8 18 18Zm0 8c10 0 18-8 18-18-10 0-18 8-18 18Z"/><path d="M22 54h20"/></svg>
                </div>
                <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-trovara-green">{{ product.sku }}</span>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <div><h3 class="text-xl font-black text-trovara-dark">{{ product.name }}</h3><p class="mt-1 text-xs text-gray-500">Sold per {{ product.unit }}</p></div>
                  <p class="shrink-0 font-black text-trovara-green">{{ formatShopPrice(product.priceKobo, product.currency) }}</p>
                </div>
                <div class="mt-5 flex items-center justify-between gap-3">
                  <div class="inline-flex items-center rounded-xl border border-gray-200">
                    <button type="button" class="h-11 w-11 text-xl" :aria-label="`Remove one ${product.name}`" @click="setQuantity(product.id, (cart[product.id] ?? 0) - 1)">−</button>
                    <span class="min-w-9 text-center font-black">{{ cart[product.id] ?? 0 }}</span>
                    <button type="button" class="h-11 w-11 text-xl" :aria-label="`Add one ${product.name}`" @click="setQuantity(product.id, (cart[product.id] ?? 0) + 1)">+</button>
                  </div>
                  <button type="button" class="rounded-xl bg-trovara-green px-4 py-3 text-sm font-bold text-white" @click="setQuantity(product.id, Math.max(1, cart[product.id] ?? 0))">Add to basket</button>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-3xl border border-gray-200 bg-white p-8 text-center">
            <p class="text-lg font-black text-trovara-dark">Checkout opens with each harvest</p>
            <p class="mt-3 text-sm leading-6 text-gray-500">
              Nothing is on sale yet. Join product waitlists for coconut, plantain, palm oil, chicken, and eggs, then create your shop account so orders and chat updates stay linked when supply starts.
            </p>
            <RouterLink to="/products" class="btn-primary mt-6 inline-flex px-6 py-3">View products & waitlists</RouterLink>
          </div>
        </section>

        <aside class="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div class="flex items-center justify-between"><h2 class="text-xl font-black text-trovara-dark">Your basket</h2><span class="rounded-full bg-trovara-light px-3 py-1 text-xs font-black text-trovara-green">{{ cartCount }} items</span></div>
          <div v-if="cartLines.length" class="mt-5 divide-y divide-gray-100">
            <div v-for="line in cartLines" :key="line.product.id" class="flex justify-between gap-4 py-4 text-sm"><div><p class="font-bold text-trovara-dark">{{ line.product.name }}</p><p class="text-gray-500">{{ line.quantity }} × {{ line.product.unit }}</p></div><p class="font-bold">{{ formatShopPrice(line.product.priceKobo * line.quantity, line.product.currency) }}</p></div>
          </div>
          <p v-else class="mt-5 rounded-2xl bg-trovara-light p-5 text-sm leading-6 text-gray-500">
            {{ products.length ? 'Add a product when SKUs are live. Your basket stays on this device until checkout.' : 'Checkout is closed until harvest SKUs open. Create an account and join product waitlists in the meantime.' }}
          </p>
          <div class="mt-5 flex justify-between border-t border-gray-200 pt-5"><span class="font-bold">Estimated total</span><strong class="text-xl text-trovara-green">{{ formatShopPrice(cartTotalKobo) }}</strong></div>
          <button type="button" class="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50" :disabled="!cartCount" @click="beginCheckout">Continue to checkout</button>
          <div class="mt-5 border-t border-gray-200 pt-5"><p class="text-xs font-bold uppercase tracking-wider text-gray-500">Or continue with a chat assistant</p><div class="mt-3 grid gap-2" :class="TELEGRAM_ORDER_URL ? 'grid-cols-2' : 'grid-cols-1'"><a :href="buildWhatsAppLink(products.length ? 'Hi Trovara Farm, I would like help with products currently in the farm shop.' : 'Hi Trovara Farm, I would like waitlist updates and to prepare a shop account before harvest checkout opens.')" target="_blank" rel="noopener" class="rounded-xl bg-[#25D366] px-3 py-3 text-center text-xs font-bold text-white">WhatsApp</a><a v-if="TELEGRAM_ORDER_URL" :href="TELEGRAM_ORDER_URL" target="_blank" rel="noopener" class="rounded-xl bg-[#229ED9] px-3 py-3 text-center text-xs font-bold text-white">Telegram</a></div></div>
        </aside>
      </div>

      <section v-else-if="activeTab === 'orders'" class="order-3 mx-auto max-w-4xl">
        <div class="mb-6"><p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-green">Order centre</p><h2 class="mt-2 text-3xl font-black text-trovara-dark">Your orders</h2></div>
        <div v-if="!account" class="rounded-3xl border border-gray-200 bg-white p-7 text-gray-600">Sign in below to see orders placed on the website, WhatsApp, or Telegram.</div>
        <div v-else-if="orders.length" class="space-y-4">
          <article v-for="order in orders" :key="order.id" class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs font-black uppercase tracking-wider text-trovara-green">{{ order.reference }}</p><h3 class="mt-1 text-xl font-black capitalize text-trovara-dark">{{ order.status.replace('_', ' ') }}</h3><p class="mt-1 text-xs text-gray-500">Ordered {{ new Date(order.createdAt).toLocaleDateString('en-NG') }} via {{ order.source }}</p></div><span class="rounded-full bg-trovara-light px-3 py-1 text-xs font-bold capitalize">{{ order.paymentStatus.replace('_', ' ') }}</span></div>
            <ul class="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm"><li v-for="item in order.items" :key="`${order.id}-${item.productName}`" class="flex justify-between gap-4"><span>{{ item.productName }}</span><span class="text-gray-500">{{ item.quantity }} {{ item.unit }}</span></li></ul>
            <a
              v-if="orderTraceUrl(order)"
              :href="orderTraceUrl(order) ?? undefined"
              target="_blank"
              rel="noopener"
              class="mt-5 inline-flex items-center gap-2 rounded-xl border border-trovara-green px-4 py-3 text-sm font-bold text-trovara-green"
            >
              Open traceability record <span aria-hidden="true">→</span>
            </a>
            <p v-else class="mt-5 text-xs text-gray-500">Your traceability link will appear here when the lot is verified.</p>
          </article>
        </div>
        <div v-else-if="account" class="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500">No orders yet. Your first order will appear here.</div>
      </section>

      <section v-else class="order-3 mx-auto max-w-3xl">
        <div class="mb-6">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-trovara-green">One account everywhere</p>
          <h2 class="mt-2 text-3xl font-black text-trovara-dark">
            {{ telegramLinked ? 'Telegram linked' : 'Connect Telegram (or WhatsApp later)' }}
          </h2>
          <p v-if="telegramLinked" class="mt-3 leading-7 text-gray-600">
            Your shop account is connected to Telegram. Website orders and updates can appear in that chat.
          </p>
          <template v-else>
            <p class="mt-3 leading-7 text-gray-600">
              Website orders only appear in chat after you link.
              <template v-if="TELEGRAM_ORDER_URL">
                Create a code below, open the <strong>Telegram customer bot</strong>, and send the exact message
                <code class="rounded bg-trovara-light px-1.5 py-0.5 text-sm font-semibold text-trovara-dark">link YOURCODE</code>.
                Opening the chat alone is not enough.
              </template>
              <template v-else>
                Telegram customer bot username is not configured on this site build yet — ask the farm for the bot link, then send
                <code class="rounded bg-trovara-light px-1.5 py-0.5 text-sm font-semibold text-trovara-dark">link YOURCODE</code>.
              </template>
            </p>
            <p class="mt-3 text-sm leading-6 text-gray-500">
              The WhatsApp button opens the farm’s personal WhatsApp number for human help. It is
              <strong>not</strong> the Meta customer bot yet, so <code class="rounded bg-trovara-light px-1 py-0.5 text-xs font-semibold">link CODE</code>
              will not attach your shop account on WhatsApp until that bot goes live. Prefer Telegram for account linking.
            </p>
          </template>
        </div>

        <div v-if="account" class="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
          <div
            v-if="hasLinkedChannels"
            class="rounded-2xl border border-trovara-green/30 bg-trovara-green/10 p-5"
            role="status"
          >
            <p class="text-xs font-black uppercase tracking-wider text-trovara-green">Connected now</p>
            <p class="mt-2 text-lg font-black text-trovara-dark">
              <template v-if="telegramLinked && whatsappLinked">Telegram and WhatsApp are linked to this shop account.</template>
              <template v-else-if="telegramLinked">Telegram is linked to this shop account.</template>
              <template v-else-if="whatsappLinked">WhatsApp is linked to this shop account.</template>
              <template v-else>A chat channel is linked to this shop account.</template>
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="channel in channels"
                :key="channel.channel"
                class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold capitalize text-trovara-green ring-1 ring-trovara-green/20"
              >
                <span aria-hidden="true">✓</span>
                {{ channel.channel }}
                <span v-if="channel.name" class="font-medium text-gray-500 normal-case">({{ channel.name }})</span>
              </span>
            </div>
            <div class="mt-5 flex flex-wrap gap-3">
              <a
                v-if="TELEGRAM_ORDER_URL && telegramLinked"
                :href="TELEGRAM_ORDER_URL"
                target="_blank"
                rel="noopener"
                class="rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-bold text-white"
              >Open Telegram</a>
              <button
                v-if="!showLinkForm && !linkCode"
                type="button"
                class="rounded-xl border border-trovara-green px-4 py-3 text-sm font-bold text-trovara-green"
                @click="showLinkForm = true"
              >
                Link another chat
              </button>
            </div>
          </div>

          <div v-if="!hasLinkedChannels || showLinkForm || linkCode" class="mt-6" :class="hasLinkedChannels ? 'border-t border-gray-100 pt-6' : ''">
            <p v-if="hasLinkedChannels" class="mb-4 text-sm text-gray-500">
              Generate a new code only if you need to link a different Telegram account.
            </p>
            <button
              v-if="!linkCode"
              type="button"
              class="btn-primary"
              :disabled="busy"
              @click="createLinkCode"
            >
              {{ busy ? 'Creating…' : 'Create a secure link code' }}
            </button>
            <div v-else class="rounded-2xl bg-trovara-dark p-6 text-white">
              <p class="text-xs font-bold uppercase tracking-wider text-white/60">
                {{ TELEGRAM_ORDER_URL ? 'Send this exact message to the Telegram customer bot' : 'Send this exact message to the Telegram customer bot (ask the farm for the username)' }}
              </p>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-4">
                <code class="text-xl font-black text-trovara-gold">link {{ linkCode }}</code>
                <button type="button" class="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20" @click="copyLinkCommand">Copy</button>
              </div>
              <p class="mt-3 text-xs text-white/60">Expires {{ new Date(linkExpiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} and works once. This page checks automatically after you send it.</p>
              <div class="mt-5 flex flex-wrap gap-3">
                <a v-if="TELEGRAM_ORDER_URL" :href="TELEGRAM_ORDER_URL" target="_blank" rel="noopener" class="rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-bold text-white">Open Telegram</a>
                <button type="button" class="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/20" :disabled="busy" @click="checkLinkStatus">
                  {{ busy ? 'Checking…' : "I've sent it — check status" }}
                </button>
                <a :href="buildWhatsAppLink(products.length ? 'Hi Trovara Farm, I need help with my shop account.' : 'Hi Trovara Farm, I would like waitlist updates and help with my shop account.')" target="_blank" rel="noopener" class="rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white">Message WhatsApp (human)</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="rounded-3xl border border-gray-200 bg-white p-7 text-gray-600">Create an account or sign in below before linking a chat.</div>
      </section>

      <section
        id="shop-account"
        class="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        :class="!account && activeTab === 'shop' ? 'order-3 mt-0 w-full' : 'order-4 mt-12 w-full'"
      >
        <div
          v-if="authError || authNotice"
          class="mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold"
          :class="authError ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300' : 'border-trovara-green/30 bg-trovara-green/10 text-trovara-green-700 dark:text-trovara-green-300'"
          role="alert"
        >
          {{ authError || authNotice }}
        </div>
        <template v-if="account">
          <div class="flex flex-wrap items-center justify-between gap-4"><div><p class="text-xs font-black uppercase tracking-wider text-trovara-green">Signed in</p><h2 class="mt-1 text-2xl font-black text-trovara-dark">{{ account.name }}</h2><p class="mt-1 text-sm text-gray-500">{{ account.email }}</p></div><button type="button" class="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold" :disabled="busy" @click="logout">Sign out</button></div>
        </template>
        <template v-else-if="authMode === 'forgot'">
          <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-black uppercase tracking-wider text-trovara-green">Reset password</p><h2 class="mt-1 text-2xl font-black text-trovara-dark">Forgot your password?</h2><p class="mt-2 text-sm text-gray-600">Enter your email and we'll send you a reset link.</p></div><button type="button" class="text-sm font-bold text-trovara-green" @click="setAuthMode('login')">Back to sign in</button></div>
          <form class="mt-6 grid gap-4" @submit.prevent="submitForgotPassword">
            <label class="text-sm font-bold text-trovara-dark">Email<input v-model="authForm.email" required type="email" autocomplete="email" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
            <button type="submit" class="btn-primary" :disabled="busy">{{ busy ? 'Sending…' : 'Send reset link' }}</button>
          </form>
        </template>
        <template v-else>
          <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-black uppercase tracking-wider text-trovara-green">Customer account</p><h2 class="mt-1 text-2xl font-black text-trovara-dark">{{ authMode === 'login' ? 'Welcome back' : 'Create your account' }}</h2></div><button type="button" class="text-sm font-bold text-trovara-green" @click="setAuthMode(authMode === 'login' ? 'register' : 'login')">{{ authMode === 'login' ? 'Create account' : 'I have an account' }}</button></div>
          <div v-if="needsVerification" class="mt-5 rounded-2xl border border-trovara-green/30 bg-trovara-green/10 p-5">
            <p class="text-sm font-bold text-trovara-green-700">Email verification required</p>
            <p class="mt-2 text-sm leading-6 text-gray-600">Check your inbox for a verification link. If you didn't receive it, enter your email and we'll send it again.</p>
            <button type="button" class="mt-4 rounded-xl bg-trovara-green px-4 py-2 text-sm font-bold text-white" :disabled="busy || !authForm.email" @click="resendVerification">{{ busy ? 'Sending…' : 'Resend verification' }}</button>
            <div class="mt-5 border-t border-trovara-green/20 pt-5">
              <p class="text-sm font-bold text-trovara-green-700">Already have an account?</p>
              <p class="mt-1 text-sm leading-6 text-gray-600">If you verified already, sign in. Forgot your password? Reset it below.</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" class="rounded-xl bg-trovara-green px-4 py-2 text-sm font-bold text-white" @click="setAuthMode('login')">Sign in</button>
                <button type="button" class="rounded-xl border border-trovara-green px-4 py-2 text-sm font-bold text-trovara-green" @click="setAuthMode('forgot')">Forgot password</button>
              </div>
            </div>
          </div>
          <form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="submitAuth">
            <label v-if="authMode === 'register'" class="text-sm font-bold text-trovara-dark">Name<input v-model="authForm.name" required minlength="2" autocomplete="name" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
            <label class="text-sm font-bold text-trovara-dark">Email<input v-model="authForm.email" required type="email" autocomplete="email" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
            <label v-if="authMode === 'register'" class="text-sm font-bold text-trovara-dark">Phone <span class="font-normal text-gray-500">(optional)</span><input v-model="authForm.phone" type="tel" autocomplete="tel" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
            <label class="text-sm font-bold text-trovara-dark">Password<input v-model="authForm.password" required type="password" minlength="8" :autocomplete="authMode === 'register' ? 'new-password' : 'current-password'" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
            <button type="submit" class="btn-primary sm:col-span-2" :disabled="busy">{{ busy ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account' }}</button>
          </form>
          <div v-if="authMode === 'login'" class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <button type="button" class="font-bold text-trovara-green hover:underline" @click="setAuthMode('forgot')">
              Forgot password?
            </button>
            <p class="text-gray-500">
              New to Trovara?
              <button type="button" class="font-bold text-trovara-green hover:underline" @click="setAuthMode('register')">
                Create an account
              </button>
            </p>
          </div>
          <div v-else class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p class="text-gray-500">
              Already have an account?
              <button type="button" class="font-bold text-trovara-green hover:underline" @click="setAuthMode('login')">
                Sign in
              </button>
            </p>
            <button type="button" class="font-bold text-trovara-green hover:underline" @click="setAuthMode('forgot')">
              Forgot password?
            </button>
          </div>
        </template>
      </section>
    </div>

    <div v-if="showCheckout" class="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4" @click.self="showCheckout = false">
      <form class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8" @submit.prevent="placeOrder">
        <div class="flex items-start justify-between gap-4"><div><p class="text-xs font-black uppercase tracking-wider text-trovara-green">Delivery details</p><h2 class="mt-1 text-2xl font-black text-trovara-dark">Complete your order</h2></div><button type="button" class="grid h-10 w-10 place-items-center rounded-xl border border-gray-200" aria-label="Close checkout" @click="showCheckout = false">×</button></div>
        <label class="mt-6 block text-sm font-bold text-trovara-dark">Delivery address<textarea v-model="checkoutForm.address" required minlength="5" rows="4" class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-trovara-green" /></label>
        <label class="mt-4 block text-sm font-bold text-trovara-dark">Delivery phone<input v-model="checkoutForm.phone" type="tel" class="mt-2 min-h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-trovara-green" /></label>
        <div class="mt-6 flex items-center justify-between border-t border-gray-200 pt-5"><span class="font-bold">Estimated total</span><strong class="text-xl text-trovara-green">{{ formatShopPrice(cartTotalKobo) }}</strong></div>
        <button type="submit" class="btn-primary mt-5 w-full" :disabled="busy">{{ busy ? 'Placing order…' : 'Place order' }}</button>
      </form>
    </div>
  </div>
</template>
