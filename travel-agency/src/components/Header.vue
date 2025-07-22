<template>
  <header class="header">
        <!-- 상단 유틸리티 바 -->
    <div class="top-bar">
      <div class="top-bar-container">
        <div class="top-bar-spacer"></div>
        <div class="top-bar-right">
          
          
          <!-- 어드민 페이지 이동 버튼 (어드민 권한이 있는 경우에만 표시) -->
          <button v-if="isAdmin" @click="goToAdmin" class="admin-go-btn">
            ⚙️ 어드민 페이지
          </button>
          
        <!-- 로그인되지 않은 경우 -->
        <template v-if="!isLoggedIn">
            <router-link to="/login" class="top-link">로그인</router-link>
            <router-link to="/join" class="top-link">회원가입</router-link>
        </template>
        
        <!-- 로그인된 경우 -->
        <template v-else>
            <router-link to="/mypage" class="top-link">마이페이지</router-link>
            <button @click="handleLogout" class="top-link">로그아웃</button>
        </template>
      </div>
      </div>
    </div>

    <!-- 메인 헤더 -->
    <div class="main-header">
      <div class="main-header-container">
        <!-- 로고 -->
        <div class="logo">
          <router-link to="/">
            <img src="/logo.png" alt="나라투어 로고" class="logo-image">
            <h1>나라투어</h1>
          </router-link>
        </div>

        <!-- 검색창 -->
        <div class="search-area">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="검색어를 입력해 주세요." 
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            >
            <button class="search-btn" @click="handleSearch">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </button>
          </div>
        </div>

        <!-- 버스대절 버튼 -->
        <div class="reservation-menu">
          <div class="menu-item" @click="handleBusRental">
            <div class="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16"/>
                <path d="M4 10h16"/>
                <path d="M4 14h16"/>
                <path d="M4 18h16"/>
                <path d="M2 6h20v12H2z"/>
                <circle cx="6" cy="16" r="2"/>
                <circle cx="18" cy="16" r="2"/>
              </svg>
            </div>
            <span class="menu-text">버스대절</span>
          </div>
           <!-- 예약확인 버튼 (항상 표시) -->
          <div class="menu-item" @click="handleReservation">
            <div class="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <span class="menu-text">예약확인</span>
          </div>
        </div>

      <!-- 모바일 햄버거 메뉴 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    </div>

    <!-- 네비게이션 바 -->
    <nav class="nav-bar">
      <div class="nav-container">
        <button 
          class="nav-toggle" 
          @click="toggleAllMenu"
          @mouseenter="showAllMenu"
          @mouseleave="hideAllMenu"
        >
          <span class="hamburger-icon">☰</span>
          <span>전체메뉴</span>
        </button>
        
        <ul class="nav-menu">
          <li v-if="menuLoading" class="nav-item">
            <span class="nav-link">메뉴 로딩중...</span>
          </li>
          <template v-else>
            <li 
              v-for="(category, index) in menuData.primaryCategories" 
              :key="category.id"
              class="nav-item"
              @mouseenter="showSubMenu(category.id)"
              @mouseleave="hideSubMenu"
            >
              <a href="#" class="nav-link" @click="handleCategoryClick(category)">
                {{ category.name }}
              </a>
              <span v-if="index < menuData.primaryCategories.length - 1" class="nav-separator">|</span>
            </li>
          </template>
        </ul>
      </div>

      <!-- 2차 메뉴 드롭다운 -->
      <div 
        v-if="activeSubMenu" 
        class="sub-menu-container"
        @mouseenter="keepSubMenuOpen"
        @mouseleave="hideSubMenu"
      >
        <div class="sub-menu-content">
          <ul class="sub-menu-list">
            <li 
              v-for="item in getSimpleSubCategories(activeSubMenu)" 
              :key="item.id"
              class="sub-menu-item"
            >
              <a href="#" @click="handleSubCategoryClick(getCurrentCategory(activeSubMenu), item)">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 전체메뉴 드롭다운 -->
      <div 
        v-if="showAllMenuFlag" 
        class="all-menu-container"
        @mouseenter="keepAllMenuOpen"
        @mouseleave="hideAllMenu"
      >
        <div class="all-menu-content">
          <div v-if="menuLoading" class="all-menu-loading">
            <p>메뉴 로딩중...</p>
          </div>
          <div v-else class="all-menu-grid">
            <div 
              v-for="category in menuData.primaryCategories" 
              :key="category.id"
              class="all-menu-category"
            >
              <h3 class="all-menu-title">{{ category.name }}</h3>
              <ul class="all-menu-sub-list">
                <li 
                  v-for="item in getSimpleSubCategories(category.id)" 
                  :key="item.id"
                  class="all-menu-sub-item"
                >
                  <a href="#" @click="handleSubCategoryClick(category, item)">
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 모바일 네비게이션 -->
    <nav class="nav-mobile" :class="{ active: mobileMenuOpen }">
      <div class="mobile-header">
        <div class="mobile-logo" @click="goHome">
          <img src="/logo.png" alt="나라투어 로고" class="logo-image">
          <h1>나라투어</h1>
        </div>
        <button class="mobile-close-btn" @click="closeMobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="mobile-content">
      <ul class="mobile-nav-menu">
          <li v-if="menuLoading" class="mobile-nav-item">
            <div class="mobile-category-header">
              <span class="category-name">메뉴 로딩중...</span>
            </div>
          </li>
          <li 
            v-for="category in menuData.primaryCategories" 
            :key="category.id"
            class="mobile-nav-item"
          >
            <div class="mobile-category-header" @click="toggleMobileCategory(category.id)">
              <span class="category-name">{{ category.name }}</span>
              <svg 
                class="mobile-arrow" 
                :class="{ 'mobile-arrow-open': expandedMobileCategory === category.id }"
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
            
            <ul 
              v-if="expandedMobileCategory === category.id" 
              class="mobile-sub-menu"
            >
              <li 
                v-for="item in getSimpleSubCategories(category.id)" 
                :key="item.id"
                class="mobile-sub-item"
              >
                <a href="#" @click="handleSubCategoryClick(category, item); closeMobileMenu()">
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        
        <div class="mobile-user-menu">
          
          <!-- 로그인되지 않은 경우 -->
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="btn-secondary" @click="closeMobileMenu">로그인</router-link>
            <router-link to="/join" class="btn-secondary" @click="closeMobileMenu">회원가입</router-link>
            <button class="btn-primary" @click="() => { handleBusRental(); closeMobileMenu(); }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16"/>
                <path d="M4 10h16"/>
                <path d="M4 14h16"/>
                <path d="M4 18h16"/>
                <path d="M2 6h20v12H2z"/>
                <circle cx="6" cy="16" r="2"/>
                <circle cx="18" cy="16" r="2"/>
              </svg>
              버스대절
            </button>
            <button class="btn-primary" @click="() => { handleGuestReservation(); closeMobileMenu(); }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
              </svg>
              비회원 예약조회
            </button>
          </template>
          
          <!-- 로그인된 경우 -->
          <template v-else>
            <router-link to="/mypage" class="btn-secondary" @click="closeMobileMenu">마이페이지</router-link>
            <button @click="handleLogout" class="btn-secondary">로그아웃</button>
            <button class="btn-primary" @click="() => { handleBusRental(); closeMobileMenu(); }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16"/>
                <path d="M4 10h16"/>
                <path d="M4 14h16"/>
                <path d="M4 18h16"/>
                <path d="M2 6h20v12H2z"/>
                <circle cx="6" cy="16" r="2"/>
                <circle cx="18" cy="16" r="2"/>
              </svg>
              버스대절
            </button>
            <button class="btn-primary" @click="() => { handleReservation(); closeMobileMenu(); }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              예약확인
            </button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../lib/auth.js'
import { categoryService } from '../lib/categories.js'

const router = useRouter()

// 반응형 데이터
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const activeSubMenu = ref(null)
const subMenuTimeout = ref(null)
const showAllMenuFlag = ref(false)
const allMenuTimeout = ref(null)
const expandedMobileCategory = ref(null)
const menuLoading = ref(true)

// 메뉴 데이터 (supabase에서 동적으로 불러올 데이터)
const menuData = ref({
  primaryCategories: [],
  secondaryCategories: {}
})

// 로그인 상태 확인
const isLoggedIn = ref(false)
const isAdmin = ref(false)

// 현재 세션 정보 가져오기
const getCurrentSession = async () => {
  try {
    console.log('세션 정보 조회 시작...')
    const { data: { session }, error } = await authService.supabase.auth.getSession()
    
    if (error) {
      console.error('세션 조회 에러:', error)
      isLoggedIn.value = false
      isAdmin.value = false
      return
    }
    
    if (session && session.user) {
      console.log('세션 정보 조회 성공:', session.user.email)
      isLoggedIn.value = true
      // 세션에서는 is_admin 정보를 직접 확인할 수 없으므로 기본값 false
      isAdmin.value = false
    } else {
      console.log('세션 없음 - 로그아웃 상태')
      isLoggedIn.value = false
      isAdmin.value = false
    }
  } catch (error) {
    console.error('세션 정보 조회 실패:', error)
    isLoggedIn.value = false
    isAdmin.value = false
  }
}


// 메서드들
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  
  // 모바일 메뉴가 열릴 때 body 스크롤 방지
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    expandedMobileCategory.value = null
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  expandedMobileCategory.value = null
  document.body.style.overflow = ''
}

const toggleMobileCategory = (categoryId) => {
  if (expandedMobileCategory.value === categoryId) {
    expandedMobileCategory.value = null
  } else {
    expandedMobileCategory.value = categoryId
  }
}

const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    try {
      console.log('로그아웃 시작...')
      
      // 로그아웃 실행
      const result = await authService.signOut()
      
      if (result.success) {
        console.log('로그아웃 성공:', result.message)
        
        // 로컬 상태 즉시 업데이트 (강제로 반응형 상태 변경)
        isLoggedIn.value = false
        isAdmin.value = false
        
        // Vue의 반응형 시스템이 변경을 감지하도록 강제 업데이트
        await nextTick()
        
        // 추가로 상태 변경을 확실히 하기 위해 한 번 더 업데이트
        setTimeout(() => {
          isLoggedIn.value = false
          isAdmin.value = false
        }, 0)
        
        // 모바일 메뉴 닫기
    closeMobileMenu()
        
        // 홈으로 이동
        router.push('/')
        
      } else {
        console.error('로그아웃 실패:', result.error)
        alert(`로그아웃에 실패했습니다: ${result.error}`)
      }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert(`로그아웃 중 오류가 발생했습니다: ${error.message}`)
    }
  }
}

// 홈으로 이동
const goHome = () => {
  router.push('/')
  closeMobileMenu()
}

// 어드민 페이지로 이동
const goToAdmin = () => {
  router.push('/admin')
}

const handleCategoryClick = (category) => {
  router.push({
    path: '/products',
    query: {
      categoryId: category.id
    }
  })
}

const handleSubCategoryClick = (category, item) => {
  router.push({
    path: '/products',
    query: {
      categoryId: category.id,
      subCategoryId: item.id
    }
  })
  
  hideSubMenu()
  hideAllMenu()
}

// 서브메뉴 관련 메서드
const showSubMenu = (categoryId) => {
  // 전체메뉴가 열려있거나 메뉴 로딩 중이면 서브메뉴를 표시하지 않음
  if (showAllMenuFlag.value || menuLoading.value) return
  
  if (subMenuTimeout.value) {
    clearTimeout(subMenuTimeout.value)
  }
  activeSubMenu.value = categoryId
}

const hideSubMenu = () => {
  subMenuTimeout.value = setTimeout(() => {
    activeSubMenu.value = null
  }, 200)
}

const keepSubMenuOpen = () => {
  if (subMenuTimeout.value) {
    clearTimeout(subMenuTimeout.value)
  }
}

const getSimpleSubCategories = (categoryId) => {
  return menuData.value.secondaryCategories[categoryId] || []
}

const getCurrentCategory = (categoryId) => {
  return menuData.value.primaryCategories.find(cat => cat.id === categoryId)
}

const toggleAllMenu = () => {
  // 전체메뉴 토글 로직
  console.log('전체메뉴 토글')
  showAllMenuFlag.value = !showAllMenuFlag.value
}

// 전체메뉴 관련 메서드
const showAllMenu = () => {
  // 메뉴 로딩 중이면 전체메뉴를 표시하지 않음
  if (menuLoading.value) return
  
  if (allMenuTimeout.value) {
    clearTimeout(allMenuTimeout.value)
  }
  showAllMenuFlag.value = true
  // 개별 서브메뉴는 숨김
  activeSubMenu.value = null
}

const hideAllMenu = () => {
  allMenuTimeout.value = setTimeout(() => {
    showAllMenuFlag.value = false
  }, 200)
}

const keepAllMenuOpen = () => {
  if (allMenuTimeout.value) {
    clearTimeout(allMenuTimeout.value)
  }
}

// 메뉴 데이터를 supabase에서 받아오는 함수
const fetchMenuData = async () => {
  try {
    menuLoading.value = true
    console.log('메뉴 데이터 로드 시작...')
    const response = await categoryService.getMenuData()
    
    if (response.success) {
      menuData.value = response.menuData
      console.log('메뉴 데이터 로드 완료:', response.menuData)
    } else {
      console.error('메뉴 데이터 로드 실패:', response.error)
      // 에러 시 빈 데이터로 설정
      menuData.value = {
        primaryCategories: [],
        secondaryCategories: {}
      }
    }
  } catch (error) {
    console.error('메뉴 데이터 로드 오류:', error)
    // 에러 시 빈 데이터로 설정
    menuData.value = {
      primaryCategories: [],
      secondaryCategories: {}
    }
  } finally {
    menuLoading.value = false
  }
}

const handleReservation = () => {
  // 로그인 체크
  if (!isLoggedIn.value) {
    alert('예약 확인을 위해 로그인이 필요합니다.')
    router.push('/login')
    return
  }
  
  router.push('/mypage/reservations')
}

const handleBusRental = () => {
  // 버스대절 페이지로 이동
  router.push('/bus-rental')
}

const handleGuestReservation = () => {
  router.push('/login?tab=guest')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('검색어:', searchQuery.value)
    // 검색 결과 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// 컴포넌트 마운트 시 메뉴 데이터 불러오기
onMounted(async () => {
  await Promise.all([
    fetchMenuData(),
    getCurrentSession()
  ])
  
  // 인증 상태 변경 리스너 설정
  const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      isLoggedIn.value = false
      isAdmin.value = false
    
    } else if (event === 'SIGNED_IN' && session?.user) {
      // 실제 로그인인 경우에만 세션 정보 업데이트
      isLoggedIn.value = true
      isAdmin.value = false
    }
    // TOKEN_REFRESHED 이벤트는 무시 (토큰 갱신은 자동으로 처리됨)
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

/* CSS 변수 정의 */
:root {
  --primary-color: #2563eb;
  --primary-dark: #1e40af;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --bg-light: #f8fafc;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

/* 헤더 전체 */
.header {
  background: white;
  position: relative;
}

/* 상단 유틸리티 바 */
.top-bar {
  background: white;
  padding-top: 0.5rem;
  font-size: 0.8rem;
}

.top-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.top-bar-spacer {
  flex: 1;
}

.top-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
}

.top-link:hover {
  color: var(--primary-color);
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.top-text {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.top-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* 메인 헤더 */

.main-header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: space-between;
}

/* 로고 */
.logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  height: 100%;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.logo h1 {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  line-height: 1;
  font-family: 'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', sans-serif;
  letter-spacing: -0.02em;
}

.logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 100%;
}

/* 검색 영역 */
.search-area {
  flex: 1;
  max-width: 350px;
  margin: 0 1.5rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border: 1px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  transition: var(--transition);
  height: 40px;
}

.search-box:focus-within {
  border-color: var(--primary-color);

  background: white;
}

.search-input {
  flex: 1;
  padding: 0.625rem 1rem;
  border: none;
  outline: none;
  font-size: 0.85rem;
  background: transparent;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-secondary);
  font-weight: 400;
}

.search-btn {
  background: transparent;
  border: none;
  padding: 0.625rem 0.7rem;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  border-radius: 0 10px 10px 0;
  margin: 0;
}

.search-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* 예약확인 메뉴 */
.reservation-menu {
  display: flex;
  flex-shrink: 0;
  gap: 1rem;
  align-items: center;
}

/* 로그인되지 않은 경우 빈 공간 */
.reservation-menu-spacer {
  display: flex;
  flex-shrink: 0;
  width: 80px; /* 예약확인 버튼과 동일한 너비 */
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: var(--transition);
}

.menu-item:hover {
  color: var(--primary-color);
}

.menu-item:hover .menu-icon svg {
  color: var(--primary-color);
}

.menu-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon svg {
  color: var(--text-secondary);
}

.menu-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* 네비게이션 바 */
.nav-bar {
  background: #f8f9fa;
  border-top: 1px solid var(--border-color);
  padding: 0.3rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
}

.hamburger-icon {
  font-size: 1.2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  padding: 0.5rem 0;
  transition: var(--transition);
  font-size: 0.9rem;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-separator {
  color: var(--text-secondary);
  font-weight: 300;
  margin: 0 1.2rem;
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 서브메뉴 컨테이너 */
.sub-menu-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--primary-color);
  z-index: 999;
}

.sub-menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
}

.sub-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 50px;
  margin-left: 8rem; /* 전체메뉴 버튼 너비만큼 왼쪽 여백 */
}

.sub-menu-item a {
  display: block;
  padding: 0.75rem 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  white-space: nowrap;
}

.sub-menu-item a:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

/* 전체메뉴 드롭다운 */
.all-menu-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-top: none;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 500px;
  overflow-y: auto;
}

.all-menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.all-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.all-menu-category {
  background: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.all-menu-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.all-menu-sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.all-menu-sub-item {
  flex: 0 0 auto;
}

.all-menu-sub-item a {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition: var(--transition);
  white-space: nowrap;
}

.all-menu-sub-item a:hover {
  color: white;
  background: var(--primary-color);
  border-color: var(--primary-color);
}

/* 모바일 메뉴 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}

.nav-mobile {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 9999;
  overflow-y: auto;
}

.nav-mobile.active {
  display: flex;
  flex-direction: column;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
  min-height: 80px;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  cursor: pointer;
  transition: var(--transition);
}

.mobile-logo:hover {
  opacity: 0.8;
}

.mobile-logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', sans-serif;
  letter-spacing: -0.02em;
  line-height: 1;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.75rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-close-btn:hover {
  background: var(--bg-light);
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
}

.mobile-nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--border-color);
}

.mobile-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  background: white;
}

.mobile-category-header:hover {
  background: var(--bg-light);
}

.mobile-category-header:active {
  background: #e2e8f0;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mobile-arrow {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.mobile-arrow-open {
  transform: rotate(180deg);
}

.mobile-sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: var(--bg-light);
  border-top: 1px solid var(--border-color);
}

.mobile-sub-item {
  border-bottom: 1px solid #e2e8f0;
}

.mobile-sub-item:last-child {
  border-bottom: none;
}

.mobile-sub-item a {
  display: block;
  padding: 1rem 2rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  transition: var(--transition);
}

.mobile-sub-item a:hover {
  background: white;
  color: var(--primary-color);
}

.mobile-user-menu {
  padding: 1.5rem;
  background: var(--bg-light);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-primary, .btn-secondary {
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 테스트용 버튼 스타일 */
.test-auth-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}

.test-auth-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4);
}

.test-admin-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.test-admin-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
}

.admin-go-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.admin-go-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
}

.test-auth-btn-mobile {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}

.test-auth-btn-mobile:hover {
  background: #ff5252;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  /* 모바일에서 헤더 고정 */
  .header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    z-index: 1000 !important;
    box-shadow: var(--shadow-md) !important;
    background: white !important;
  }
  
  .top-bar {
    display: none;
  }
  
  .test-auth-btn,
  .test-admin-btn,
  .admin-go-btn {
    display: none;
  }
  
  .main-header-container {
    padding: 0 1rem;
    gap: 1rem;
    min-height: 80px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .logo-image {
    width: 50px;
    height: 50px;
  }
  
  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
  }
  
  .mobile-logo .logo-image {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
  
  .search-area {
    display: none;
  }
  
  .reservation-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .nav-bar {
    display: none;
  }
  
  .all-menu-container {
    max-height: 400px;
  }
  
  .all-menu-content {
    padding: 1rem;
  }
  
  .all-menu-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    color: var(--text-secondary);
  }
  
  .all-menu-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .all-menu-category {
    padding: 1rem;
  }
}
</style> 