<script setup lang="ts">
import { buildWhatsAppLink } from '../lib/whatsapp'

const lastUpdated = '15 July 2026'

const privacyWhatsAppLink = buildWhatsAppLink(
  'Hi Trovara Farm, I have a question about your Privacy Policy and how you handle my personal data.',
)

interface Section {
  id: string
  title: string
}

const toc: Section[] = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'controller', title: '2. Who We Are (Data Controller)' },
  { id: 'information', title: '3. Information We Collect' },
  { id: 'use', title: '4. How We Use Your Information' },
  { id: 'lawful-basis', title: '5. Lawful Basis for Processing' },
  { id: 'cookies', title: '6. Cookies & Analytics' },
  { id: 'sharing', title: '7. How We Share Information' },
  { id: 'transfers', title: '8. International Data Transfers' },
  { id: 'retention', title: '9. Data Retention' },
  { id: 'security', title: '10. How We Protect Your Data' },
  { id: 'rights', title: '11. Your Rights Under the NDPA' },
  { id: 'ndpa', title: '12. NDPA Compliance Statement' },
  { id: 'children', title: '13. Children’s Privacy' },
  { id: 'changes', title: '14. Changes to This Policy' },
  { id: 'contact', title: '15. Contact & Complaints' },
]

const dataWeCollect = [
  {
    label: 'Information you provide',
    detail:
      'Your name, email address, phone number, company/organisation, delivery location, and the contents of any message when you use our contact form, request a quote, subscribe to our newsletter, message us on WhatsApp, or place an order through our Telegram customer bot.',
  },
  {
    label: 'Transaction & enquiry details',
    detail:
      'Products of interest, order quantities, wholesale or partnership requirements, and correspondence related to your enquiries.',
  },
  {
    label: 'Technical information',
    detail:
      'Aggregated, anonymised usage data such as pages visited, approximate region, device type, and referring site - collected via privacy-friendly analytics that do not use cookies or track you across websites.',
  },
]

const dataUses = [
  'Respond to your enquiries, quotes, and support requests.',
  'Process and fulfil orders, deliveries, and wholesale or partnership arrangements.',
  'Send you newsletters and updates - only where you have subscribed, and always with an option to unsubscribe.',
  'Improve our website, products, and customer experience using aggregated analytics.',
  'Comply with legal, regulatory, tax, and record-keeping obligations.',
  'Protect our website, prevent fraud, and secure our systems.',
]

const rights = [
  {
    title: 'Right to be informed',
    detail: 'Know what personal data we collect and how we use it - which this policy explains.',
  },
  {
    title: 'Right of access',
    detail: 'Request a copy of the personal data we hold about you.',
  },
  {
    title: 'Right to rectification',
    detail: 'Ask us to correct data that is inaccurate or incomplete.',
  },
  {
    title: 'Right to erasure',
    detail: 'Request deletion of your personal data where there is no lawful reason for us to keep it.',
  },
  {
    title: 'Right to restrict processing',
    detail: 'Ask us to limit how we use your data in certain circumstances.',
  },
  {
    title: 'Right to data portability',
    detail: 'Receive your data in a structured, commonly used, machine-readable format.',
  },
  {
    title: 'Right to object',
    detail: 'Object to processing based on our legitimate interests, or to direct marketing at any time.',
  },
  {
    title: 'Right to withdraw consent',
    detail: 'Withdraw consent at any time where our processing relies on it - without affecting prior processing.',
  },
]

const thirdParties = [
  {
    name: 'Formspree',
    purpose: 'Delivers contact-form and newsletter submissions to our team inbox (via our Netlify function).',
  },
  {
    name: 'Buttondown',
    purpose: 'Manages newsletter subscriptions and email delivery for subscribers.',
  },
  {
    name: 'Plausible Analytics',
    purpose:
      'Privacy-first, cookieless website analytics loaded from plausible.io when configured - no personal data or cross-site tracking.',
  },
  {
    name: 'WhatsApp (Meta)',
    purpose: 'Handles messages you choose to send us through the WhatsApp channel.',
  },
  {
    name: 'Facebook & Instagram (Meta)',
    purpose:
      'Hosts our public Facebook and Instagram pages when you choose to follow or message Trovara there.',
  },
  {
    name: 'LinkedIn',
    purpose: 'Hosts our company page when you choose to follow or message Trovara there.',
  },
  {
    name: 'Telegram',
    purpose:
      'Hosts the @TrovaraFarmBot customer order bot when you choose to order or track produce through Telegram.',
  },
  {
    name: 'Netlify',
    purpose: 'Hosts and serves this website and its infrastructure.',
  },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">Your Privacy Matters</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          Privacy Policy
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          How Trovara Farm collects, uses, and protects your personal data
          in line with the Nigeria Data Protection Act (NDPA) 2023.
        </p>
        <p class="text-white/50 text-sm mt-6">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <!-- Body -->
    <section class="py-16 md:py-24 bg-trovara-cream">
      <div class="container-trovara max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">

          <!-- Table of contents -->
          <aside class="lg:sticky lg:top-28 self-start">
            <div class="bg-white rounded-2xl shadow-sm p-6">
              <h2 class="text-xs font-bold uppercase tracking-widest text-trovara-green mb-4">
                On this page
              </h2>
              <nav>
                <ul class="space-y-2.5">
                  <li v-for="item in toc" :key="item.id">
                    <a
                      :href="`#${item.id}`"
                      class="text-sm text-gray-600 hover:text-trovara-green transition-colors leading-snug block"
                    >
                      {{ item.title }}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          <!-- Content -->
          <div class="space-y-12">

            <div id="introduction" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">1. Introduction</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Trovara Farm ("Trovara", "we", "us", or "our") is committed to protecting your
                  privacy and handling your personal data responsibly and transparently. This
                  Privacy Policy explains what information we collect, why we collect it, how we use
                  and safeguard it, and the rights you have over your data.
                </p>
                <p>
                  This policy applies to
                  <a href="https://trovara.farm" class="text-trovara-green font-semibold hover:underline">trovara.farm</a>
                  and to any personal data we collect through our website, contact channels, and
                  business dealings. We process personal data in accordance with the
                  <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and the regulations and
                  guidance issued by the Nigeria Data Protection Commission (NDPC).
                </p>
              </div>
            </div>

            <div id="controller" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">2. Who We Are (Data Controller)</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Trovara Farm is the <strong>data controller</strong> responsible for your personal
                  data. This means we determine how and why your personal data is processed.
                </p>
                <div class="bg-white rounded-2xl shadow-sm p-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="block font-bold text-trovara-dark">Entity</span>
                    <span class="text-gray-600">Trovara Farm</span>
                  </div>
                  <div>
                    <span class="block font-bold text-trovara-dark">Location</span>
                    <span class="text-gray-600">Abeokuta, Ogun State, Nigeria</span>
                  </div>
                  <div>
                    <span class="block font-bold text-trovara-dark">Email</span>
                    <a href="mailto:info@trovara.farm" class="text-trovara-green hover:underline">info@trovara.farm</a>
                  </div>
                  <div>
                    <span class="block font-bold text-trovara-dark">Phone</span>
                    <span class="text-gray-600">+234 810 369 3426</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="information" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">3. Information We Collect</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                We only collect personal data that we genuinely need. Depending on how you interact
                with us, this may include:
              </p>
              <div class="space-y-4">
                <div
                  v-for="item in dataWeCollect"
                  :key="item.label"
                  class="bg-white rounded-2xl shadow-sm p-6"
                >
                  <h3 class="font-bold text-trovara-dark mb-2">{{ item.label }}</h3>
                  <p class="text-gray-600 leading-relaxed text-sm">{{ item.detail }}</p>
                </div>
              </div>
            </div>

            <div id="use" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">4. How We Use Your Information</h2>
              <p class="text-gray-700 leading-relaxed mb-4">We use your personal data to:</p>
              <ul class="space-y-3">
                <li v-for="use in dataUses" :key="use" class="flex gap-3 text-gray-700">
                  <span class="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-trovara-green/10 text-trovara-green flex items-center justify-center">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="leading-relaxed">{{ use }}</span>
                </li>
              </ul>
              <p class="text-gray-700 leading-relaxed mt-6">
                We do <strong>not</strong> sell your personal data, and we do not use it for
                automated decision-making that produces legal or similarly significant effects on you.
              </p>
            </div>

            <div id="lawful-basis" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">5. Lawful Basis for Processing</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Under the NDPA, we process personal data only where we have a lawful basis to do so:
              </p>
              <ul class="space-y-3 text-gray-700">
                <li class="leading-relaxed"><strong>Consent</strong> - for example, when you subscribe to our newsletter.</li>
                <li class="leading-relaxed"><strong>Contract</strong> - to respond to quotes and fulfil orders or partnership arrangements you request.</li>
                <li class="leading-relaxed"><strong>Legal obligation</strong> - to meet tax, accounting, and regulatory requirements.</li>
                <li class="leading-relaxed"><strong>Legitimate interests</strong> - to operate, secure, and improve our website and business, provided these interests do not override your rights.</li>
              </ul>
            </div>

            <div id="cookies" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">6. Cookies & Analytics</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We use
                  <a
                    href="https://plausible.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-trovara-green font-semibold hover:underline"
                  >Plausible Analytics</a>,
                  a privacy-first, cookieless service, to understand how our website is used.
                  Plausible collects only aggregated, anonymised statistics - it does
                  <strong>not</strong> set tracking cookies, does not collect personal data, and does
                  not track you across other websites.
                </p>
                <p>
                  Analytics runs only when we have configured it for our production site. The
                  Plausible script is loaded from
                  <code class="text-sm bg-white px-1.5 py-0.5 rounded">https://plausible.io</code>
                  under our Content Security Policy allowlist. We do not use Subresource Integrity
                  (SRI) for this script because Plausible serves it from a single, unversioned URL
                  that may change when they update the service.
                </p>
                <p>
                  Because we do not use non-essential or advertising cookies, you are not required to
                  make cookie-consent choices to browse this site normally.
                </p>
                <p>
                  You may optionally install this site to your device Home Screen. That stores a
                  lightweight app shell and static assets in your browser for faster repeat visits.
                  It is not used to track you, and it does not keep personal form data offline.
                </p>
              </div>
            </div>

            <div id="sharing" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">7. How We Share Information</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                We never sell your data. We share it only with trusted service providers who help us
                operate our website and business, and only to the extent necessary. Each provider is
                required to protect your data and use it solely for the purposes we specify.
              </p>
              <div class="space-y-3">
                <div
                  v-for="party in thirdParties"
                  :key="party.name"
                  class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"
                >
                  <span class="font-bold text-trovara-dark sm:w-44 flex-shrink-0">{{ party.name }}</span>
                  <span class="text-gray-600 text-sm leading-relaxed">{{ party.purpose }}</span>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed mt-6">
                We may also disclose personal data where required by law, regulation, court order, or
                to protect our legal rights.
              </p>
            </div>

            <div id="transfers" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">8. International Data Transfers</h2>
              <p class="text-gray-700 leading-relaxed">
                Some of our service providers may store or process data outside Nigeria. Where
                personal data is transferred internationally, we take steps to ensure it receives an
                adequate level of protection consistent with the NDPA - for example, by relying on
                providers that offer appropriate contractual and technical safeguards.
              </p>
            </div>

            <div id="retention" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">9. Data Retention</h2>
              <p class="text-gray-700 leading-relaxed">
                We keep personal data only for as long as necessary to fulfil the purposes described
                in this policy, including to satisfy any legal, accounting, or reporting requirements.
                When data is no longer needed, we securely delete or anonymise it. You may ask us to
                delete your data at any time (see your rights below).
              </p>
            </div>

            <div id="security" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">10. How We Protect Your Data</h2>
              <p class="text-gray-700 leading-relaxed">
                We apply appropriate technical and organisational measures to protect your personal
                data against unauthorised access, loss, misuse, or alteration. These include encrypted
                connections (HTTPS), strict security headers, access controls, and working only with
                reputable service providers. While no method of transmission or storage is completely
                secure, we continually review and improve our safeguards.
              </p>
            </div>

            <div id="rights" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">11. Your Rights Under the NDPA</h2>
              <p class="text-gray-700 leading-relaxed mb-6">
                As a data subject, the Nigeria Data Protection Act grants you the following rights over
                your personal data:
              </p>
              <div class="grid sm:grid-cols-2 gap-4">
                <div
                  v-for="right in rights"
                  :key="right.title"
                  class="bg-white rounded-2xl shadow-sm p-5"
                >
                  <h3 class="font-bold text-trovara-dark mb-1.5 text-sm">{{ right.title }}</h3>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ right.detail }}</p>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed mt-6">
                To exercise any of these rights, contact us at
                <a href="mailto:info@trovara.farm" class="text-trovara-green font-semibold hover:underline">info@trovara.farm</a>.
                We will respond within the timeframe required by the NDPA. Exercising your rights is
                free of charge in most cases.
              </p>
            </div>

            <div id="ndpa" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">12. NDPA Compliance Statement</h2>
              <div class="bg-trovara-green rounded-2xl p-6 md:p-8 text-white">
                <p class="leading-relaxed mb-4">
                  Trovara Farm processes personal data in accordance with the
                  <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and the directives of the
                  Nigeria Data Protection Commission (NDPC). We are committed to upholding the core
                  data-protection principles required under the Act:
                </p>
                <ul class="space-y-2.5 text-white/90">
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Lawfulness, fairness & transparency</strong> - we process data on a valid legal basis and tell you how we use it.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Purpose limitation</strong> - we collect data for specified, legitimate purposes only.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Data minimisation</strong> - we collect only what is adequate and necessary.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Accuracy</strong> - we keep personal data accurate and up to date.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Storage limitation</strong> - we retain data no longer than necessary.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Integrity & confidentiality</strong> - we protect data with appropriate security measures.</span>
                  </li>
                  <li class="flex gap-3">
                    <span class="text-trovara-gold-300 font-bold">•</span>
                    <span><strong>Accountability</strong> - we take responsibility for, and can demonstrate, our compliance.</span>
                  </li>
                </ul>
                <p class="leading-relaxed mt-5 text-white/90">
                  For any data-protection query, or to raise a concern about how we handle your data,
                  contact our team at
                  <a href="mailto:info@trovara.farm" class="text-trovara-gold-300 font-semibold hover:underline">info@trovara.farm</a>.
                </p>
              </div>
            </div>

            <div id="children" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">13. Children’s Privacy</h2>
              <p class="text-gray-700 leading-relaxed">
                Our website and services are intended for businesses and adults. We do not knowingly
                collect personal data from children. If you believe a child has provided us with
                personal data, please contact us and we will delete it promptly.
              </p>
            </div>

            <div id="changes" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">14. Changes to This Policy</h2>
              <p class="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or legal requirements. When we do, we will revise the "Last updated" date at
                the top of this page. We encourage you to review this policy periodically.
              </p>
            </div>

            <div id="contact" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">15. Contact & Complaints</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have any questions, requests, or complaints about this policy or how we handle
                  your personal data, please reach out:
                </p>
                <ul class="space-y-1.5">
                  <li>Email: <a href="mailto:info@trovara.farm" class="text-trovara-green font-semibold hover:underline">info@trovara.farm</a></li>
                  <li>Phone: <span class="font-semibold text-trovara-dark">+234 810 369 3426</span></li>
                  <li>Address: <span class="font-semibold text-trovara-dark">Trovara Farm, Abeokuta, Ogun State, Nigeria</span></li>
                </ul>
                <p>
                  If you are not satisfied with our response, you have the right to lodge a complaint
                  with the <strong>Nigeria Data Protection Commission (NDPC)</strong>, the regulatory
                  authority for data protection in Nigeria.
                </p>
              </div>

              <div class="mt-8 flex flex-wrap gap-4">
                <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
                  Contact Us
                </RouterLink>
                <a
                  :href="privacyWhatsAppLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-trovara-green/30 text-trovara-green font-semibold hover:bg-trovara-green/10 transition-all duration-200 text-base"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>
