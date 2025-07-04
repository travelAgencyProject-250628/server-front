<template>
  <header class="header">
    <div class="header-container">
      <!-- 로고 -->
      <div class="logo">
        <router-link to="/">
          <h1>굿모닝투어</h1>
        </router-link>
      </div>

      <!-- 데스크톱 네비게이션 -->
      <nav class="nav-desktop">
        <ul class="nav-menu">
          <li class="nav-item dropdown">
            <a href="#" class="nav-link">버스여행1</a>
            <ul class="dropdown-menu">
              <li><a href="#">당일여행</a></li>
              <li><a href="#">1박2일</a></li>
              <li><a href="#">2박3일</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link">버스여행2</a>
            <ul class="dropdown-menu">
              <li><a href="#">국내여행</a></li>
              <li><a href="#">테마여행</a></li>
              <li><a href="#">효도여행</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link">버스여행3</a>
            <ul class="dropdown-menu">
              <li><a href="#">단체여행</a></li>
              <li><a href="#">워크샵</a></li>
              <li><a href="#">수학여행</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link">버스여행4</a>
            <ul class="dropdown-menu">
              <li><a href="#">해외여행</a></li>
              <li><a href="#">크루즈</a></li>
              <li><a href="#">골프여행</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- 사용자 메뉴 -->
      <div class="user-menu">
        <!-- 로그인되지 않은 경우 -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="btn-secondary">로그인</router-link>
          <router-link to="/join" class="btn-secondary">회원가입</router-link>
          <button class="btn-primary">예약확인</button>
        </template>
        
        <!-- 로그인된 경우 -->
        <template v-else>
          <router-link to="#" class="btn-secondary">마이페이지</router-link>
          <button @click="handleLogout" class="btn-secondary">로그아웃</button>
        </template>
      </div>

      <!-- 모바일 햄버거 메뉴 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 모바일 네비게이션 -->
    <nav class="nav-mobile" :class="{ active: mobileMenuOpen }">
      <ul class="mobile-nav-menu">
        <li><a href="#" @click="closeMobileMenu">버스여행1</a></li>
        <li><a href="#" @click="closeMobileMenu">버스여행2</a></li>
        <li><a href="#" @click="closeMobileMenu">버스여행3</a></li>
        <li><a href="#" @click="closeMobileMenu">버스여행4</a></li>
        <li class="mobile-user-menu">
          <!-- 로그인되지 않은 경우 -->
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="btn-secondary" @click="closeMobileMenu">로그인</router-link>
            <router-link to="/join" class="btn-secondary" @click="closeMobileMenu">회원가입</router-link>
            <button class="btn-primary">예약확인</button>
          </template>
          
                  <!-- 로그인된 경우 -->
        <template v-else>
          <router-link to="/mypage" class="btn-secondary" @click="closeMobileMenu">마이페이지</router-link>
          <button @click="handleLogout" class="btn-secondary">로그아웃</button>
        </template>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// 반응형 데이터
const mobileMenuOpen = ref(false)

// 계산된 속성
const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// 메서드들
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = async () => {
  if (confirm('로그아웃하시겠습니까?')) {
    await authStore.signOut()
    closeMobileMenu()
  }
}
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

/* 헤더 스타일 */
.header {
  background: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.logo a {
  text-decoration: none;
}

.nav-desktop {
  display: flex;
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
}

.nav-link:hover {
  color: var(--primary-color);
}

/* 드롭다운 메뉴 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 150px;
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius);
  padding: 0.5rem 0;
  list-style: none;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: var(--transition);
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
}

.dropdown-menu a:hover {
  background: var(--bg-light);
  color: var(--primary-color);
}

/* 사용자 메뉴 */
.user-menu {
  display: flex;
  gap: 0.5rem;
}

.btn-primary, .btn-secondary {
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-light);
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
  background: white;
  border-top: 1px solid var(--border-color);
}

.nav-mobile.active {
  display: block;
}

.mobile-nav-menu {
  list-style: none;
  padding: 1rem;
  margin: 0;
}

.mobile-nav-menu li {
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-menu li:last-child {
  border-bottom: none;
}

.mobile-nav-menu a {
  display: block;
  padding: 1rem 0;
  text-decoration: none;
  color: var(--text-primary);
}

.mobile-user-menu {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .nav-desktop, .user-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .header-container {
    padding: 1rem 15px;
  }
}
</style> 