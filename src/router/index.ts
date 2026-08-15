import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return new Promise((resolve) => {
        window.setTimeout(() => resolve({ el: to.hash, top: 80 }), 50)
      })
    }
    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Trovara Farm - Food you can trust, from a farm built for tomorrow',
        description:
          'Food you can trust, from a farm built for tomorrow. Premium regenerative food from Ogun State, Nigeria for homes, chefs, and hospitality partners.',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About Us - Trovara Farm',
        description:
          'Learn about Trovara Farm, our mission, and the people building a regenerative food company in Nigeria.',
      },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: {
        title: 'Our Products - Trovara Farm',
        description:
          'Explore Trovara Farm product lines and join waitlists for coconut, plantain, palm oil, pasture-raised chicken, and eggs ahead of first harvest.',
      },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue'),
      meta: {
        title: 'Shop Account - Trovara Farm',
        description:
          'Create a Trovara Farm shop account to prepare for harvest checkout, connect WhatsApp or Telegram, and stay linked to waitlist updates as each supply window opens.',
        robots: 'noindex, nofollow',
      },
    },
    {
      path: '/shop/reset-password',
      name: 'shop-reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: {
        title: 'Reset Password - Trovara Farm',
        description: 'Set a new password for your Trovara Farm shop account.',
        robots: 'noindex, nofollow',
      },
    },
    {
      path: '/shop/verify-email',
      name: 'shop-verify-email',
      component: () => import('../views/VerifyEmailView.vue'),
      meta: {
        title: 'Verify Email - Trovara Farm',
        description: 'Verify your email address for your Trovara Farm shop account.',
        robots: 'noindex, nofollow',
      },
    },
    // Aliases for mistyped / truncated inbox links (keep query: token=...).
    {
      path: '/verify-email',
      redirect: (to) => ({ path: '/shop/verify-email', query: to.query, hash: to.hash }),
    },
    {
      path: '/reset-password',
      redirect: (to) => ({ path: '/shop/reset-password', query: to.query, hash: to.hash }),
    },
    {
      path: '/lot/:farmSlug/:lotCode',
      name: 'lot-trace',
      component: () => import('../views/LotTraceView.vue'),
      meta: {
        title: 'Harvest verification - Trovara Farm',
        description:
          'Verify a Trovara Farm harvest lot from a QR code or share link: product, plot, and farm confirmation.',
      },
    },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: {
        title: 'Product Details - Trovara Farm',
        description:
          'Explore detailed specifications, benefits, and enquiries for Trovara Farm product lines.',
      },
    },
    {
      path: '/farm',
      name: 'farm',
      component: () => import('../views/FarmView.vue'),
      meta: {
        title: 'The Farm - Trovara Farm',
        description:
          'How Trovara Farm uses regenerative practices to grow food and care for the land in Ogun State.',
      },
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: {
        title: 'Farm OS & Farm Advisory Services - Trovara Farm',
        description:
          'Explore Trovara Farm OS for daily operations and separate hands-on Farm Advisory Services covering setup, soil, crops, irrigation, training, and market linkage.',
      },
    },
    {
      path: '/farm-os',
      name: 'farm-os',
      component: () => import('../views/FarmOsView.vue'),
      meta: {
        title: 'Trovara Farm OS - Farm Operations Software',
        description:
          'Run tasks, field reports, products, inventory, traceability, sales, and customer support in one role-aware farm operations system.',
      },
    },
    {
      path: '/farm-advisory',
      name: 'farm-advisory',
      component: () => import('../views/FarmAdvisoryView.vue'),
      meta: {
        title: 'Farm Advisory Services - Trovara Farm',
        description:
          'Practical farm advisory for setup, crops, soil, irrigation, post-harvest work, team training, and market readiness.',
      },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: {
        title: 'FAQ - Trovara Farm',
        description:
          'Read common questions about Trovara Farm products, delivery, partnerships, and farm operations.',
      },
    },
    {
      path: '/journal',
      name: 'journal',
      component: () => import('../views/JournalView.vue'),
      meta: {
        title: 'Journal - Trovara Farm',
        description:
          'Read stories, field notes, and insights from Trovara Farm on food, farming, and the future of agriculture.',
      },
    },
    {
      path: '/journal/:slug',
      name: 'journal-post',
      component: () => import('../views/JournalPostView.vue'),
      meta: {
        title: 'Journal - Trovara Farm',
        description: 'Read a Trovara Farm journal post with field updates, lessons, and practical farming insights.',
      },
    },
    {
      path: '/blog',
      redirect: '/journal',
    },
    {
      path: '/blog/:slug',
      redirect: (to) => `/journal/${to.params.slug}`,
    },
    {
      path: '/moments',
      name: 'moments',
      component: () => import('../views/MomentsView.vue'),
      meta: {
        title: 'Moments - Trovara Farm',
        description:
          'Photos and videos from our farm community: harvest days, daily work, and the people behind Trovara.',
      },
    },
    {
      path: '/careers',
      name: 'careers',
      component: () => import('../views/CareersView.vue'),
      meta: {
        title: 'Careers - Trovara Farm',
        description:
          'Open roles at Trovara Farm. Join the team growing regenerative food from Abeokuta.',
      },
    },
    {
      path: '/careers/:slug',
      name: 'career-post',
      component: () => import('../views/CareerPostView.vue'),
      meta: {
        title: 'Role - Trovara Farm',
        description: 'Career opening at Trovara Farm.',
      },
    },
    {
      path: '/survey',
      name: 'survey',
      component: () => import('../views/SurveyView.vue'),
      meta: {
        title: 'Customer Food Survey - Trovara Farm',
        description:
          'Tell Trovara Farm how you buy fresh food in Nigeria. A 3-minute survey to help us design a better farm-to-table service.',
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contact - Trovara Farm',
        description:
          'Contact Trovara Farm for product inquiries, partnerships, wholesale opportunities, and farm visits.',
      },
    },
    {
      path: '/wholesale',
      name: 'wholesale',
      component: () => import('../views/WholesaleView.vue'),
      meta: {
        title: 'B2B Wholesale - Trovara Farm',
        description:
          'Explore Trovara Farm wholesale offerings for restaurants, retailers, and food service partners.',
      },
    },
    {
      path: '/wholesale/one-pager',
      name: 'wholesale-one-pager',
      component: () => import('../views/WholesaleOnePagerView.vue'),
      meta: {
        title: 'Wholesale One-Pager - Trovara Farm',
        description:
          'Print-ready wholesale supply brief covering product lines, nationwide delivery, harvest windows, packaging, minimum orders, and contact details.',
      },
    },
    {
      path: '/brand/:token',
      name: 'brand-pack',
      component: () => import('../views/BrandPackView.vue'),
      meta: {
        title: 'Brand pack - Trovara Farm',
        description: 'View and download Trovara Farm brand assets from a shared press pack.',
        robots: 'noindex, nofollow',
      },
    },
    {
      path: '/newsletter/confirm',
      name: 'newsletter-confirm',
      component: () => import('../views/NewsletterConfirmView.vue'),
      meta: {
        title: 'Confirm Newsletter Subscription - Trovara Farm',
        description: 'Confirm your subscription to Trovara Farm email updates.',
        robots: 'noindex, nofollow',
      },
    },
    {
      path: '/newsletter/unsubscribe',
      name: 'newsletter-unsubscribe',
      component: () => import('../views/NewsletterUnsubscribeView.vue'),
      meta: {
        title: 'Unsubscribe from Newsletter - Trovara Farm',
        description: 'Manage your Trovara Farm newsletter subscription.',
        robots: 'noindex, nofollow',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: {
        title: 'Privacy Policy - Trovara Farm',
        description:
          'How Trovara Farm collects, uses, and protects your personal data, in line with the Nigeria Data Protection Act (NDPA) 2023.',
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
      meta: {
        title: 'Terms of Service - Trovara Farm',
        description:
          'The terms that govern your use of the Trovara Farm website and our products and services.',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: '404 - Trovara Farm',
        description: 'The requested page could not be found on Trovara Farm.',
        robots: 'noindex, nofollow',
      },
    },
  ],
})

export default router
