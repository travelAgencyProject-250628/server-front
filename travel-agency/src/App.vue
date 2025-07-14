<script setup>
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const authStore = useAuthStore()
const route = useRoute()

// 어드민 페이지인지 확인
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})

onMounted(async () => {
  // 앱 시작 시 현재 사용자 정보 로드
  await authStore.getCurrentUser()
  
  // 인증 상태 변경 리스너 설정
  authStore.setupAuthListener()
})
</script>

<template>
  <div id="app">
    <Header v-if="!isAdminPage" />
    <RouterView />
    <Footer v-if="!isAdminPage" />
  </div>
</template>

<style>
/* CSS 변수 전역 정의 */
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
</style>
