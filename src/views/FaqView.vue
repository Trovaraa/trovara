<script setup lang="ts">
import { ref } from 'vue'
import SectionHeader from '../components/ui/SectionHeader.vue'

interface FaqItem {
  q: string
  a: string
}

interface FaqGroup {
  category: string
  icon: string
  items: FaqItem[]
}

const faqs: FaqGroup[] = [
  {
    category: 'Products & Quality',
    icon: '🌿',
    items: [
      {
        q: 'Are your products organic?',
        a: 'All Trovara Farm produce is grown without synthetic pesticides, artificial ripening agents, or chemical fertilizers. We follow organic-aligned practices and are actively working toward formal organic certification.',
      },
      {
        q: 'How fresh are your products at delivery?',
        a: 'Plantains and coconuts are harvested on the day or day before shipment whenever possible. Poultry products follow the same farm-to-customer freshness principle. For exports, we use cold-chain logistics to preserve quality.',
      },
      {
        q: 'What plantain varieties do you grow?',
        a: 'We cultivate multiple plantain varieties suited for different uses — including cooking plantains harvested green for savory dishes, and sweeter ripe plantains for fried and dessert applications. Plantain flour is milled from fully mature plantains.',
      },
      {
        q: 'Do you offer plantain flour in retail packaging?',
        a: 'Yes. Plantain flour is available in retail-sized bags as well as bulk packaging for food manufacturers, bakeries, and distributors. Contact us for sizes and pricing.',
      },
    ],
  },
  {
    category: 'Orders & Pricing',
    icon: '📦',
    items: [
      {
        q: 'What is your minimum order quantity (MOQ)?',
        a: 'Retail orders have no minimum. For wholesale and bulk, MOQs vary by product — typically starting at one pallet for coconut, one tonne for plantain, and case quantities for poultry. Reach out for specifics on your needs.',
      },
      {
        q: 'How do I get a price quote?',
        a: 'Use the contact form, WhatsApp, or email us at info@trovara.farm with the product, quantity, and delivery location. We typically respond with a quote within 24 business hours.',
      },
      {
        q: 'Do you accept large bulk and export orders?',
        a: 'Yes. We supply distributors, retailers, food manufacturers, and international buyers. We are export-ready and can support documentation, packaging, and logistics requirements.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'For local orders: bank transfer, mobile money, and corporate cheques. For export orders: bank wire transfer, letter of credit (L/C), and other agreed terms. Payment terms are discussed during quoting.',
      },
    ],
  },
  {
    category: 'Shipping & Logistics',
    icon: '✈️',
    items: [
      {
        q: 'Where do you deliver?',
        a: 'We deliver locally across our region and ship nationally. For international export, we coordinate with global logistics partners to deliver to most destinations worldwide.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Local deliveries typically arrive within 1–3 business days. National shipping is 3–7 days. International export timing depends on the destination and shipping mode (sea or air freight) — typically 1–6 weeks.',
      },
      {
        q: 'Do you handle export documentation?',
        a: 'Yes. We provide all necessary export documentation including phytosanitary certificates, certificates of origin, packing lists, and commercial invoices. We can also coordinate with your freight forwarder.',
      },
      {
        q: 'What if my shipment arrives damaged?',
        a: 'We inspect every shipment before dispatch. In the rare event of damage in transit, contact us within 48 hours of receipt with photos, and we will work with you on replacement or credit.',
      },
    ],
  },
  {
    category: 'Farm Services',
    icon: '🌾',
    items: [
      {
        q: 'Can you help me start my own farm?',
        a: 'Yes — that is one of our ancillary services. Visit our Services page for the full list, including farm setup, soil advisory, crop planning, irrigation design, and market linkage.',
      },
      {
        q: 'How much do your farm services cost?',
        a: 'We don\'t publish fixed prices because every farm is different. The initial consultation is free. After understanding your situation, we provide a clear, written quote with no hidden fees.',
      },
      {
        q: 'Do you offer training for farm workers?',
        a: 'Yes. We provide hands-on, on-site training covering crop production, poultry management, record-keeping, and farm business management. Group and individual sessions are available.',
      },
      {
        q: 'Will you visit my farm?',
        a: 'Yes. On-site assessment is part of how we work. For sites outside our standard service region, additional travel costs may apply — discussed transparently before any commitment.',
      },
    ],
  },
  {
    category: 'Visiting & Partnerships',
    icon: '🤝',
    items: [
      {
        q: 'Can I visit Trovara Farm?',
        a: 'Yes, we welcome buyers, distributors, and serious partners for scheduled farm visits. Please contact us in advance to coordinate a tour.',
      },
      {
        q: 'Are you open to becoming a private-label supplier?',
        a: 'Yes. We support white-label and private-label arrangements for compatible buyers — particularly for plantain flour, dried coconut products, and packaged poultry.',
      },
      {
        q: 'How can I become a Trovara distributor?',
        a: 'Reach out via our contact form selecting "Distribution Partnership" as the subject. We\'ll schedule an introductory call to understand your market, scale, and goals.',
      },
      {
        q: 'Do you partner with smaller farmers as outgrowers?',
        a: 'Yes — building a network of partner farmers is part of our long-term strategy. If you are a smaller farmer interested in growing for Trovara under our standards, please get in touch.',
      },
    ],
  },
]

const openItems = ref<Set<string>>(new Set())

function toggle(key: string) {
  if (openItems.value.has(key)) {
    openItems.value.delete(key)
  } else {
    openItems.value.add(key)
  }
}

function itemKey(category: string, i: number) {
  return `${category}-${i}`
}
</script>

<template>
  <div>

    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">Frequently Asked Questions</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          Everything you wanted to know.
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          Answers to the questions we hear most often. If you don't see yours, reach out
          — we'll get back to you within a business day.
        </p>
      </div>
    </section>

    <section class="py-20 md:py-28 bg-trovara-cream">
      <div class="container-trovara max-w-4xl">
        <div v-for="group in faqs" :key="group.category" class="mb-12 last:mb-0">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
              {{ group.icon }}
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-trovara-dark">{{ group.category }}</h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, i) in group.items"
              :key="itemKey(group.category, i)"
              class="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
              :class="openItems.has(itemKey(group.category, i)) ? 'shadow-md' : ''"
            >
              <button
                @click="toggle(itemKey(group.category, i))"
                class="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-trovara-light/50 transition-colors"
                :aria-expanded="openItems.has(itemKey(group.category, i))"
              >
                <span class="font-bold text-trovara-dark">{{ item.q }}</span>
                <span
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-trovara-green/10 text-trovara-green flex items-center justify-center transition-transform duration-200"
                  :class="openItems.has(itemKey(group.category, i)) ? 'rotate-45' : ''"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                  </svg>
                </span>
              </button>

              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="openItems.has(itemKey(group.category, i))"
                  class="px-6 pb-5 pt-1"
                >
                  <p class="text-gray-600 leading-relaxed">{{ item.a }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-trovara-dark text-white text-center">
      <div class="container-trovara max-w-2xl mx-auto">
        <div class="text-5xl mb-6">💬</div>
        <h2 class="text-3xl md:text-4xl font-black mb-4">
          Still have questions?
        </h2>
        <p class="text-white/60 text-lg mb-10 leading-relaxed">
          Our team is happy to answer anything else. Reach out via our contact form
          or send us a quick message on WhatsApp.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
            Contact Us
          </RouterLink>
          <a
            href="https://wa.me/2348103693426"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 text-base"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>

  </div>
</template>
