import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

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
      path: '/products',
      name: 'ProductList',
      component: () => import('@/views/ProductList.vue')
    },
    {
      path: '/product/:id',
      component: () => import('@/views/productDetail.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('@/views/booking.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',
      component: () => import('@/views/MyPage.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/mypage/profile'
        },
        {
          path: 'profile',
          name: 'mypageProfile',
          component: () => import('@/views/profileEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'reservations',
          name: 'mypageReservations',
          component: () => import('@/views/reservationList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'withdraw',
          name: 'mypageWithdraw',
          component: () => import('@/views/withdraw.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'reservations/:id',
          name: 'mypageReservationDetail',
          component: () => import('@/views/reservationDetail.vue'),
          meta: { requiresAuth: true }
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
    },
    {
      path: '/admin',
      component: () => import('@/components/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'adminDashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'categories',
          name: 'adminCategories',
          component: () => import('@/views/admin/Categories.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'products',
          name: 'adminProducts',
          component: () => import('@/views/admin/Products.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'navigation',
          name: 'adminNavigation',
          component: () => import('@/views/admin/Navigation.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'customers',
          name: 'adminCustomers',
          component: () => import('@/views/admin/Customers.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        }
        // ,
        // {
        //   path: 'reservations',
        //   name: 'adminReservations',
        //   component: () => import('@/views/admin/Reservations.vue'),
        //   meta: { requiresAuth: true, requiresAdmin: true }
        // }
      ]
    }
  ],
})

// 인증 가드
router.beforeEach((to, from, next) => {
  // Header 컴포넌트에서 사용하는 테스트용 로그인 상태 확인
  // 실제 환경에서는 authStore.isAuthenticated를 사용
  const isLoggedIn = () => {
    try {
      const authStore = useAuthStore()
      return authStore.user !== null
    } catch {
      return false
    }
  }
  
  // 로그인된 상태에서 로그인/회원가입/계정찾기 페이지 접근 시 홈으로 리디렉션
  if (isLoggedIn() && (to.path === '/login' || to.path === '/join' || to.path === '/find-account')) {
    alert('이미 로그인 되어있습니다.')
    next('/')
    return
  }
  
  // 인증이 필요한 페이지인지 확인
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Pinia의 authStore를 사용하여 어드민 권한 확인
  const authStore = useAuthStore()

  if (requiresAuth && !isLoggedIn()) {
    alert('로그인이 필요한 페이지입니다.')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresAdmin && !(authStore.user && authStore.user.is_admin === true)) {
    alert('관리자 권한이 필요한 페이지입니다.')
    next('/')
  } else {
    next()
  }
})

export default router
