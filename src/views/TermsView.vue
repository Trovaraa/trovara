<script setup lang="ts">
import { buildWhatsAppLink } from '../lib/whatsapp'

const lastUpdated = '15 July 2026'

const termsWhatsAppLink = buildWhatsAppLink(
  'Hi Trovara Farm, I have a question about your Terms of Service.',
)

interface Section {
  id: string
  title: string
}

const toc: Section[] = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'who-we-are', title: '2. Who We Are' },
  { id: 'use-of-site', title: '3. Use of Our Website' },
  { id: 'products', title: '4. Products & Information' },
  { id: 'orders', title: '5. Orders, Quotes & Pricing' },
  { id: 'payment', title: '6. Payment' },
  { id: 'delivery', title: '7. Delivery & Logistics' },
  { id: 'returns', title: '8. Returns & Claims' },
  { id: 'ip', title: '9. Intellectual Property' },
  { id: 'user-content', title: '10. User Submissions' },
  { id: 'third-party', title: '11. Third-Party Links & Services' },
  { id: 'disclaimers', title: '12. Disclaimers' },
  { id: 'liability', title: '13. Limitation of Liability' },
  { id: 'indemnity', title: '14. Indemnification' },
  { id: 'privacy', title: '15. Privacy' },
  { id: 'law', title: '16. Governing Law' },
  { id: 'changes', title: '17. Changes to These Terms' },
  { id: 'contact', title: '18. Contact' },
]
</script>

<template>
  <div>

    <!-- Hero -->
    <section class="pt-32 pb-20 bg-trovara-green relative overflow-hidden">
      <div class="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
      <div class="container-trovara relative z-10 text-center max-w-3xl mx-auto">
        <p class="section-subheading text-trovara-gold-300 mb-4">The Fine Print</p>
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6">
          Terms of Service
        </h1>
        <p class="text-white/70 text-lg leading-relaxed">
          The terms that govern your use of the Trovara Farm website and our
          products and services.
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
                  These Terms of Service ("Terms") govern your access to and use of the Trovara Farm
                  website at
                  <a href="https://trovara.farm" class="text-trovara-green font-semibold hover:underline">trovara.farm</a>
                  and any products, quotes, or services you request from us. By using our website or
                  engaging with us, you agree to these Terms. If you do not agree, please do not use
                  our website or services.
                </p>
                <p>
                  Please also read our
                  <RouterLink to="/privacy" class="text-trovara-green font-semibold hover:underline">Privacy Policy</RouterLink>,
                  which explains how we handle your personal data.
                </p>
              </div>
            </div>

            <div id="who-we-are" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">2. Who We Are</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Trovara Farm ("Trovara", "we", "us", or "our") is a regenerative food company based
                  in Abeokuta, Ogun State, Nigeria, supplying premium produce and poultry to homes,
                  chefs, retailers, and wholesale partners.
                </p>
                <div class="bg-white rounded-2xl shadow-sm p-6 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="block font-bold text-trovara-dark">Email</span>
                    <a href="mailto:info@trovara.farm" class="text-trovara-green hover:underline">info@trovara.farm</a>
                  </div>
                  <div>
                    <span class="block font-bold text-trovara-dark">Phone</span>
                    <span class="text-gray-600">+234 810 369 3426</span>
                  </div>
                  <div class="sm:col-span-2">
                    <span class="block font-bold text-trovara-dark">Location</span>
                    <span class="text-gray-600">Trovara Farm, Abeokuta, Ogun State, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="use-of-site" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">3. Use of Our Website</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                You may use our website for lawful purposes only. You agree not to:
              </p>
              <ul class="space-y-3 text-gray-700">
                <li class="leading-relaxed">Use the site in any way that breaches applicable laws or regulations.</li>
                <li class="leading-relaxed">Attempt to gain unauthorised access to our systems, servers, or data.</li>
                <li class="leading-relaxed">Introduce malware, or otherwise interfere with the proper working of the site.</li>
                <li class="leading-relaxed">Copy, scrape, or harvest content or data except as expressly permitted.</li>
                <li class="leading-relaxed">Use the site to send spam or unsolicited communications.</li>
              </ul>
            </div>

            <div id="products" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">4. Products & Information</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We take care to describe our products accurately. However, product descriptions,
                  images, specifications, and availability are provided for general information and
                  may change. As we grow natural, seasonal produce, exact size, colour, appearance,
                  and availability can vary between harvests.
                </p>
                <p>
                  Nothing on our website constitutes a binding offer to sell. Product information does
                  not amount to advice, and you should confirm current details with us before relying
                  on them.
                </p>
              </div>
            </div>

            <div id="orders" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">5. Orders, Quotes & Pricing</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Enquiries and quote requests submitted through our website, WhatsApp, or email are
                  invitations for us to provide a quote - they do not create a binding contract. A
                  contract is formed only once we confirm your order in writing.
                </p>
                <p>
                  Prices are quoted per enquiry and may vary based on quantity, product, season,
                  delivery location, and market conditions. Quotes are valid for the period stated in
                  them, or otherwise for a reasonable time. We reserve the right to decline or cancel
                  any order.
                </p>
              </div>
            </div>

            <div id="payment" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">6. Payment</h2>
              <p class="text-gray-700 leading-relaxed">
                Accepted payment methods and terms are agreed during quoting and confirmed on your
                invoice. Unless otherwise agreed in writing, payment is due as stated on the invoice.
                We may withhold dispatch of goods until payment or agreed deposit is received. Any
                applicable taxes or duties are your responsibility unless stated otherwise.
              </p>
            </div>

            <div id="delivery" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">7. Delivery & Logistics</h2>
              <p class="text-gray-700 leading-relaxed">
                Delivery timelines are estimates and are not guaranteed. While we work with reliable
                logistics partners, we are not liable for delays caused by third parties or events
                outside our reasonable control. Risk in the goods passes to you on delivery, or on
                collection where you arrange your own transport. For export orders, responsibilities
                for shipping, insurance, and customs are set out in the agreed terms.
              </p>
            </div>

            <div id="returns" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">8. Returns & Claims</h2>
              <p class="text-gray-700 leading-relaxed">
                Because we supply fresh, perishable goods, returns are generally not possible once
                goods have been accepted. If your order arrives damaged or not as described, contact
                us within 48 hours of receipt with your order details and clear photographs, and we
                will work with you in good faith on a replacement or credit where appropriate.
              </p>
            </div>

            <div id="ip" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">9. Intellectual Property</h2>
              <p class="text-gray-700 leading-relaxed">
                All content on this website - including text, logos, branding, graphics, images, and
                layout - is owned by or licensed to Trovara Farm and is protected by intellectual
                property laws. You may not reproduce, distribute, or use our content for commercial
                purposes without our prior written permission. The Trovara Farm name and logo are our
                trademarks and may not be used without consent.
              </p>
            </div>

            <div id="user-content" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">10. User Submissions</h2>
              <p class="text-gray-700 leading-relaxed">
                When you send us information through our contact form, newsletter signup, WhatsApp, or
                email, you confirm that the information is accurate and that you have the right to
                share it. You grant us permission to use such information to respond to and service
                your enquiry. Do not submit content that is unlawful, infringing, or offensive.
              </p>
            </div>

            <div id="third-party" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">11. Third-Party Links & Services</h2>
              <p class="text-gray-700 leading-relaxed">
                Our website may link to or rely on third-party services (such as messaging, forms, and
                analytics providers). We are not responsible for the content, policies, or practices of
                third-party websites or services. Your use of them is governed by their own terms.
              </p>
            </div>

            <div id="disclaimers" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">12. Disclaimers</h2>
              <p class="text-gray-700 leading-relaxed">
                Our website is provided on an "as is" and "as available" basis without warranties of
                any kind, whether express or implied, to the fullest extent permitted by law. We do
                not warrant that the website will be uninterrupted, error-free, or free of harmful
                components. Any implied warranties are excluded to the extent permitted by law.
              </p>
            </div>

            <div id="liability" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">13. Limitation of Liability</h2>
              <p class="text-gray-700 leading-relaxed">
                To the fullest extent permitted by law, Trovara Farm will not be liable for any
                indirect, incidental, special, or consequential losses, or for loss of profits,
                revenue, or data, arising from your use of our website or services. Nothing in these
                Terms excludes or limits our liability where it would be unlawful to do so.
              </p>
            </div>

            <div id="indemnity" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">14. Indemnification</h2>
              <p class="text-gray-700 leading-relaxed">
                You agree to indemnify and hold Trovara Farm harmless from any claims, damages, losses,
                or expenses (including reasonable legal fees) arising from your breach of these Terms
                or your misuse of our website or services.
              </p>
            </div>

            <div id="privacy" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">15. Privacy</h2>
              <p class="text-gray-700 leading-relaxed">
                Your use of our website is also governed by our
                <RouterLink to="/privacy" class="text-trovara-green font-semibold hover:underline">Privacy Policy</RouterLink>,
                which explains how we collect, use, and protect your personal data in line with the
                Nigeria Data Protection Act (NDPA) 2023.
              </p>
            </div>

            <div id="law" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">16. Governing Law</h2>
              <p class="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes
                arising from or relating to these Terms or your use of our website and services shall
                be subject to the jurisdiction of the courts of Nigeria.
              </p>
            </div>

            <div id="changes" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">17. Changes to These Terms</h2>
              <p class="text-gray-700 leading-relaxed">
                We may update these Terms from time to time to reflect changes in our practices or
                legal requirements. When we do, we will revise the "Last updated" date at the top of
                this page. Your continued use of our website after changes take effect constitutes
                acceptance of the revised Terms.
              </p>
            </div>

            <div id="contact" class="scroll-mt-28">
              <h2 class="text-2xl md:text-3xl font-black text-trovara-dark mb-4">18. Contact</h2>
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p>If you have any questions about these Terms, please reach out:</p>
                <ul class="space-y-1.5">
                  <li>Email: <a href="mailto:info@trovara.farm" class="text-trovara-green font-semibold hover:underline">info@trovara.farm</a></li>
                  <li>Phone: <span class="font-semibold text-trovara-dark">+234 810 369 3426</span></li>
                  <li>Address: <span class="font-semibold text-trovara-dark">Trovara Farm, Abeokuta, Ogun State, Nigeria</span></li>
                </ul>
              </div>

              <div class="mt-8 flex flex-wrap gap-4">
                <RouterLink to="/contact" class="btn-gold text-base px-8 py-4">
                  Contact Us
                </RouterLink>
                <a
                  :href="termsWhatsAppLink"
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
