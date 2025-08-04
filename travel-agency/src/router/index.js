import { createRouter, createWebHistory } from 'vue-router'
import { authService, checkAdminRole } from '@/lib/auth.js'

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
      path: '/driver-join',
      component: () => import('@/views/driver-join.vue')
    },
    {
      path: '/driver-info',
      component: () => import('@/views/driver-info.vue')
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
      path: '/reset-password',
      component: () => import('@/views/resetPassword.vue')
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
      component: () => import('@/views/booking.vue')
    },
    {
      path: '/bus-rental',
      name: 'busRental',
      component: () => import('@/views/busRental.vue')
    },
    {
      path: '/starting-points',
      name: 'startingPoints',
      component: () => import('@/views/StartingPoints.vue')
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
          meta: { requiresAuth: true },
          beforeEnter: (to, from, next) => {
            // 회원탈퇴 페이지 접근을 막고 마이페이지로 리다이렉트
            alert('현재 회원탈퇴 기능이 일시적으로 사용 중단되었습니다.')
            next('/mypage')
          }
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
      path: '/search',
      name: 'searchResults',
      component: () => import('@/views/SearchResults.vue')
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
          path: 'customers',
          name: 'adminCustomers',
          component: () => import('@/views/admin/Customers.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'reservations',
          name: 'adminReservations',
          component: () => import('@/views/admin/Reservations.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'tags',
          name: 'adminTags',
          component: () => import('@/views/admin/Tags.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'bus-rentals',
          name: 'adminBusRentals',
          component: () => import('@/views/admin/BusRentals.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'starting-points',
          name: 'adminStartingPoints',
          component: () => import('@/views/admin/StartingPoints.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'departure-dates',
          name: 'adminDepartureDates',
          component: () => import('@/views/admin/DepartureDates.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'itinerary/:id',
          name: 'adminItineraryEdit',
          component: () => import('@/views/admin/ItineraryEdit.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'drivers',
          name: 'adminDrivers',
          component: () => import('@/views/admin/Drivers.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'drivers/:id',
          name: 'adminDriverDetail',
          component: () => import('@/views/admin/DriverDetail.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },

      ]
    }
  ],
})

// 인증 가드
router.beforeEach(async (to, from, next) => {
  // admin 페이지에만 권한 체크 적용
  if (to.path.startsWith('/admin')) {
    // authService를 사용하여 현재 사용자 정보 조회
    const getCurrentUser = async () => {
      try {
        console.log('router.beforeEach 시작')
        const result = await authService.getCurrentUser()
        return result.success ? result.user : null
      } catch {
        return null
      }
    }
     
    const currentUser = await getCurrentUser()
    const isLoggedIn = currentUser !== null

    if (!isLoggedIn) {
      alert('로그인이 필요한 페이지입니다.')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 관리자 권한 체크
    const adminCheck = await checkAdminRole()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      alert('관리자 권한이 필요한 페이지입니다.')
      next('/')
      return
    }
    
    next()
    return
  }
   
  // 일반 인증이 필요한 페이지인지 확인 (admin 제외)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth && !to.path.startsWith('/admin'))

  if (requiresAuth) {
    // authService를 사용하여 현재 사용자 정보 조회
    const getCurrentUser = async () => {
      try {
        const result = await authService.getCurrentUser()
        return result.success ? result.user : null
      } catch {
        return null
      }
    }
     
    const currentUser = await getCurrentUser()
    const isLoggedIn = currentUser !== null

    if (!isLoggedIn) {
      alert('로그인이 필요한 페이지입니다.')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})

export default router
