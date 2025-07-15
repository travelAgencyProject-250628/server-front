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
            <h1>굿모닝투어</h1>
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
            >
            <button class="search-btn" @click="handleSearch">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </button>
          </div>
        </div>

        <!-- 예약확인 버튼 -->
        <div class="reservation-menu">
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
          <li 
            v-for="category in menuData.primaryCategories" 
            :key="category.id"
            class="nav-item"
            @mouseenter="showSubMenu(category.id)"
            @mouseleave="hideSubMenu"
          >
            <a href="#" class="nav-link" @click="handleCategoryClick(category)">
              {{ category.name }}
            </a>
          </li>
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
              <a href="#" @click="handleSubCategoryClick(activeSubMenu, item)">
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
          <div class="all-menu-grid">
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
                  <a href="#" @click="handleSubCategoryClick(category.id, item)">
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
        <div class="mobile-logo">
          <h1>굿모닝투어</h1>
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
                <a href="#" @click="handleSubCategoryClick(category.id, item); closeMobileMenu()">
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
          
          <!-- 로그인된 경우 -->
          <template v-else>
            <router-link to="/mypage" class="btn-secondary" @click="closeMobileMenu">마이페이지</router-link>
            <button @click="handleLogout" class="btn-secondary">로그아웃</button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCategoryStore } from '../stores/categories.js'

const router = useRouter()
const authStore = useAuthStore()
const categoryStore = useCategoryStore()

// 반응형 데이터
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const activeSubMenu = ref(null)
const subMenuTimeout = ref(null)
const showAllMenuFlag = ref(false)
const allMenuTimeout = ref(null)
const expandedMobileCategory = ref(null)

// 메뉴 데이터 (서버에서 받아올 데이터 구조)
const menuData = ref({
  primaryCategories: [
    { id: 1, name: '절찬인기여행' },
    { id: 2, name: '먹거리여행' },
    { id: 3, name: '당일여행' },
    { id: 4, name: '숙박여행' },
    { id: 5, name: '리무진버스' },
    { id: 6, name: '제주도여행' },
    { id: 7, name: '섬여행' },
    { id: 8, name: '기차여행' },
    { id: 9, name: '해외여행' }
  ],
  // 심플한 2차 메뉴 구조
  secondaryCategories: {
    1: [ // 절찬인기여행
      { id: 111, name: '당일여행' },
      { id: 112, name: '1박2일' },
      { id: 113, name: '2박3일' }
    ],
    2: [ // 먹거리여행
      { id: 211, name: '당일여행' },
      { id: 212, name: '1박2일' },
      { id: 213, name: '2박3일' }
    ],
    3: [ // 당일여행
      { id: 311, name: '당일여행' }
    ],
    4: [ // 숙박여행
      { id: 411, name: '1박2일' },
      { id: 412, name: '1박3일' },
      { id: 413, name: '2박3일' },
      { id: 414, name: '3박4일' }
    ],
    5: [ // 리무진버스
      { id: 511, name: '당일여행' },
      { id: 512, name: '1박2일' },
      { id: 513, name: '2박3일' },
      { id: 514, name: '3박4일' }
    ],
    6: [ // 제주도여행
      { id: 611, name: '2박3일' },
      { id: 612, name: '3박4일' }
    ],
    7: [ // 섬여행
      { id: 711, name: '울릉도' },
      { id: 712, name: '홍도' },
      { id: 713, name: '백령도' }
    ],
    8: [ // 기차여행
      { id: 811, name: '당일여행' },
      { id: 812, name: '1박2일' },
      { id: 813, name: '2박3일' },
      { id: 814, name: '3박4일' }
    ],
    9: [ // 해외여행
      { id: 911, name: '일본' },
      { id: 912, name: '태국' },
      { id: 913, name: '베트남' },
      { id: 914, name: '라오스' },
      { id: 915, name: '중국' },
      { id: 916, name: '몽골' }
    ]
  }
})

// 로그인 상태 및 어드민 권한은 authStore에서 가져옴
const isLoggedIn = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const currentUser = computed(() => authStore.user)

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
  if (confirm('로그아웃하시겠습니까?')) {
    await authStore.signOut()
    closeMobileMenu()
    // 로그아웃 후 홈으로 이동
    router.push('/')
  }
}



// 어드민 페이지로 이동
const goToAdmin = () => {
  router.push('/admin')
}

const handleCategoryClick = (category) => {
  console.log('카테고리 클릭:', category)
  // 카테고리별 상품 페이지로 이동하는 로직
  const categoryPath = category.name === '국내여행' ? 'domestic' : 
                      category.name === '해외여행' ? 'international' : 
                      category.name === '패키지여행' ? 'package' : 
                      category.name === '자유여행' ? 'free' : 
                      category.name.toLowerCase()
  
  router.push(`/products/${categoryPath}`)
}

const handleSubCategoryClick = (categoryId, item) => {
  const category = menuData.value.primaryCategories.find(cat => cat.id === categoryId)
  console.log('서브카테고리 클릭:', category, item)
  
  // 서브카테고리별 상품 페이지로 이동하는 로직
  const categoryPath = category?.name === '국내여행' ? 'domestic' : 
                      category?.name === '해외여행' ? 'international' : 
                      category?.name === '패키지여행' ? 'package' : 
                      category?.name === '자유여행' ? 'free' : 
                      category?.name.toLowerCase()
  
  // 서브카테고리 이름을 URL에 적합한 형태로 변환
  const subCategoryPath = item.name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
  
  router.push(`/products/${categoryPath}/${subCategoryPath}`)
  hideSubMenu()
  hideAllMenu()
}

// 서브메뉴 관련 메서드
const showSubMenu = (categoryId) => {
  // 전체메뉴가 열려있으면 서브메뉴를 표시하지 않음
  if (showAllMenuFlag.value) return
  
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

const toggleAllMenu = () => {
  // 전체메뉴 토글 로직
  console.log('전체메뉴 토글')
  showAllMenuFlag.value = !showAllMenuFlag.value
}

// 전체메뉴 관련 메서드
const showAllMenu = () => {
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

// 메뉴 데이터를 서버에서 받아오는 함수 (추후 구현)
const fetchMenuData = async () => {
  try {
    // const response = await fetch('/api/menu')
    // const data = await response.json()
    // menuData.value = data
    console.log('메뉴 데이터 로드 완료')
  } catch (error) {
    console.error('메뉴 데이터 로드 실패:', error)
  }
}

const handleReservation = () => {
  // 로그인 체크
  // if (!isLoggedIn.value) {
  //   if (confirm('예약 확인을 위해 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
  //     router.push('/login')
  //   }
  //   return
  // }
  
  router.push('/mypage/reservations')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('검색어:', searchQuery.value)
    // 실제 검색 로직 구현
    alert(`"${searchQuery.value}" 검색 결과를 불러오는 중입니다.`)
  }
}

// 컴포넌트 마운트 시 메뉴 데이터 불러오기
onMounted(async () => {
  await categoryStore.fetchCategories()
  await fetchMenuData()
  
  // 테스트용: localStorage에서 로그인 상태 복원
  const testAuthState = localStorage.getItem('test_auth')
  if (testAuthState === 'true') {
    authStore.user = {
      id: 'test_user',
      name: '테스트 사용자',
      email: 'test@example.com'
    }
    console.log('테스트 로그인 상태 복원됨')
  }
  
  // 테스트용: localStorage에서 어드민 권한 상태 복원
  const testAdminState = localStorage.getItem('test_admin')
  if (testAdminState === 'true') {
    authStore.isAdmin = true
    console.log('어드민 권한 상태 복원됨')
  }
})
</script>

<style scoped>
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
  padding: 0.4rem 0;
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
.main-header {
  padding: 0.5rem 0;
}

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
}

.logo h1 {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.logo a {
  text-decoration: none;
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
  gap: 2rem;
}

.nav-item {
  position: relative;
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
  padding: 0.5rem;
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
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
  min-height: 60px;
}

.mobile-logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
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
  border-top: 2px solid var(--border-color);
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
  }
  
  .logo h1 {
    font-size: 1.5rem;
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
  
  .all-menu-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .all-menu-category {
    padding: 1rem;
  }
}
</style> 