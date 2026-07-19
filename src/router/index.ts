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
          'Explore Trovara Farm products including fresh produce and farm-made goods sourced with quality and care.',
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
          'Discover how Trovara Farm uses regenerative practices to grow healthy food and restore the land in Ogun State.',
      },
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: {
        title: 'Farm Services & Farm OS - Trovara Farm',
        description:
          'Trovara Farm OS (Operations System) plus hands-on advisory - farm setup, soil, crops, irrigation, and market linkage for modern sustainable farms.',
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
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: {
        title: 'Blog - Trovara Farm',
        description:
          'Read stories, field notes, and insights from Trovara Farm on food, farming, and the future of agriculture.',
      },
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
      meta: {
        title: 'Blog - Trovara Farm',
        description: 'Read a Trovara Farm blog post with field updates, lessons, and practical farming insights.',
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
          'Print-ready one-page summary of Trovara Farm wholesale supply, product lines, delivery zones, and contact details.',
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
      },
    },
  ],
})

export default router
