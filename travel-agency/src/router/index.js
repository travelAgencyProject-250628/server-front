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
      path: '/supabase-test',
      component: () => import('@/views/SupabaseTestView.vue')
    },
    {
      path: '/product/:id',
      component: () => import('@/views/productDetail.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('@/views/booking.vue')
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('@/views/reservationList.vue')
    }
  ],
})

export default router
