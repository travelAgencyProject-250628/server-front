import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/index.vue')
    },
    {
      path: '/join',
      component: () => import('@/views/join.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/login.vue')
    },
    {
      path: '/find-account',
      component: () => import('@/views/findAccount.vue')
    },
    {
      path: '/product/:id',
      component: () => import('@/views/productDetail.vue')
    }
  ],
})

export default router
