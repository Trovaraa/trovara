import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Trovara Farm — Born Natural. Raised Global.' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About Us — Trovara Farm' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { title: 'Our Products — Trovara Farm' },
    },
    {
      path: '/farm',
      name: 'farm',
      component: () => import('../views/FarmView.vue'),
      meta: { title: 'The Farm — Trovara Farm' },
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: { title: 'Farm Development Services — Trovara Farm' },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { title: 'FAQ — Trovara Farm' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { title: 'Contact — Trovara Farm' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404 — Trovara Farm' },
    },
  ],
})

router.afterEach((to) => {
  document.title = (to.meta?.title as string) ?? 'Trovara Farm'
})

export default router
