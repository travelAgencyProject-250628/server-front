import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 뒤로가기/앞으로가기 버튼을 사용한 경우 이전 스크롤 위치로 복원
    if (savedPosition) {
      return savedPosition
    }
    // 새로운 페이지로 이동하는 경우 최상단으로 스크롤
    return { top: 0 }
  },
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
      path: '/mypage',
      component: () => import('@/views/MyPage.vue'),
      children: [
        {
          path: '',
          redirect: '/mypage/profile'
        },
        {
          path: 'profile',
          name: 'mypageProfile',
          component: () => import('@/views/profileEdit.vue')
        },
        {
          path: 'reservations',
          name: 'mypageReservations',
          component: () => import('@/views/reservationList.vue')
        },
        {
          path: 'withdraw',
          name: 'mypageWithdraw',
          component: () => import('@/views/withdraw.vue')
        },
        {
          path: 'reservations/:id',
          name: 'mypageReservationDetail',
          component: () => import('@/views/reservationDetail.vue')
        }
      ]
    },
    {
      path: '/products/:category',
      name: 'productList',
      component: () => import('@/views/ProductList.vue'),
      props: true
    },
    {
      path: '/products/:category/:subcategory',
      name: 'productSubList',
      component: () => import('@/views/ProductList.vue'),
      props: true
    }
  ],
})

export default router
