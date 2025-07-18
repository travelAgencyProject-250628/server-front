<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">{{ title }}</h2>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="menu-list">
        <li 
          v-for="item in menuItems" 
          :key="item.path"
          class="menu-item"
          :class="{ active: isActive(item.path) }"
        >
          <router-link 
            :to="item.path" 
            class="menu-link"
            :class="{ active: isActive(item.path) }"
          >
            <span class="menu-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  menuItems: {
    type: Array,
    required: true
  }
})

const route = useRoute()

const isActive = (path) => {
  // 쿼리 파라미터 기반으로 활성 상태 판단
  if (path.includes('?')) {
    const url = new URL(path, window.location.origin)
    const pathParams = Object.fromEntries(url.searchParams.entries())
    const currentParams = route.query
    
    // 카테고리 ID와 서브카테고리 ID가 모두 일치하는지 확인
    return pathParams.categoryId === currentParams.categoryId && 
           pathParams.subCategoryId === currentParams.subCategoryId
  }
  return route.path === path
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
  --error-color: #dc2626;
  --success-color: #059669;
}

.sidebar {
  width: 200px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  min-height: auto;
  padding: 0;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.sidebar-header {
  padding: 0.75rem;
  border-bottom: 2px solid var(--primary-color);
  background: var(--bg-light);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.sidebar-nav {
  padding: 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  border-bottom: 1px solid var(--border-color);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  border-left: 3px solid transparent;
}

.menu-link:hover {
  background: var(--bg-light);
  color: var(--primary-color);
}

.menu-link.active {
  background: #eff6ff;
  color: var(--primary-color);
  font-weight: 600;
}

.menu-text {
  flex: 1;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    border-radius: 0;
    box-shadow: var(--shadow-sm);
    border-left: none;
    border-right: none;
  }
  
  .sidebar-header {
    padding: 1rem;
    border-radius: 0;
  }
  
  .sidebar-title {
    font-size: 1rem;
  }
  
  .menu-link {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
}
</style> 