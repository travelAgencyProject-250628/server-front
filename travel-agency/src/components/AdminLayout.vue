<template>
  <div class="admin-layout">
    <!-- 사이드바 -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 class="logo">{{ sidebarCollapsed ? 'GM' : 'GM Admin' }}</h2>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 12h18m-9-9l9 9-9 9"/>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>대시보드</span>
        </router-link>
        
        <router-link to="/admin/categories" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 21v-5a2 2 0 012-2h4a2 2 0 012 2v5"/>
          </svg>
          <span>카테고리</span>
        </router-link>
        
        <router-link to="/admin/products" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span>상품관리</span>
        </router-link>
        
        <router-link to="/admin/customers" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>고객정보</span>
        </router-link>
        
        <router-link to="/admin/reservations" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>예약관리</span>
        </router-link>
      </nav>
    </div>
    
    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content" :class="{ expanded: sidebarCollapsed }">
      <!-- 상단 헤더 -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <div class="admin-user">
            <span class="admin-name">관리자</span>
          </div>
        </div>
      </header>
      
      <!-- 페이지 콘텐츠 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 사이드바 상태
const sidebarCollapsed = ref(false)

// 페이지 타이틀 계산
const pageTitle = computed(() => {
  const routeMap = {
    '/admin/dashboard': '대시보드',
    '/admin/categories': '카테고리 관리',
    '/admin/products': '상품 관리',
    '/admin/customers': '고객정보 관리',
    '/admin/reservations': '예약 관리'
  }
  return routeMap[route.path] || '관리자 페이지'
})

// 사이드바 토글
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
  --admin-primary: #1f2937;
  --admin-secondary: #374151;
  --admin-accent: #3b82f6;
  --admin-text: #1f2937;
  --admin-text-light: #6b7280;
  --admin-bg: #f9fafb;
  --admin-border: #e5e7eb;
  --admin-white: #ffffff;
  --admin-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --admin-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --admin-radius: 8px;
  --admin-transition: all 0.3s ease;
  --sidebar-width: 250px;
  --sidebar-collapsed: 60px;
}

.admin-layout {
  display: flex;
  height: 100vh;
  background: var(--admin-bg);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

/* 사이드바 */
.sidebar {
  width: var(--sidebar-width);
  background: var(--admin-primary);
  color: white;
  transition: var(--admin-transition);
  box-shadow: var(--admin-shadow-lg);
  z-index: 1000;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--admin-secondary);
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--admin-transition);
}

.sidebar-toggle:hover {
  background: var(--admin-secondary);
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: #989898;
  text-decoration: none;
  transition: var(--admin-transition);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: var(--admin-secondary);
  color: black;
}

.nav-item.router-link-active {
  background: var(--admin-secondary);
  color: black;
  border-left-color: var(--admin-accent);
}

.collapsed .nav-item span {
  display: none;
}

.collapsed .nav-item {
  justify-content: center;
  padding: 0.875rem 0.5rem;
}

/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  transition: var(--admin-transition);
}

.main-content.expanded {
  margin-left: 0;
}

/* 상단 헤더 */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--admin-white);
  border-bottom: 1px solid var(--admin-border);
  box-shadow: var(--admin-shadow);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--admin-text);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-name {
  font-weight: 500;
  color: var(--admin-text);
}

.logout-btn {
  background: var(--admin-accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--admin-radius);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--admin-transition);
}

.logout-btn:hover {
  background: #2563eb;
}

/* 콘텐츠 */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
    width: var(--sidebar-collapsed);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .admin-header {
    padding: 1rem;
  }
  
  .content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}
</style> 