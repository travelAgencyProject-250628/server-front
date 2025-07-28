<script setup>
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from './lib/auth.js'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import KakaoTalkButton from './components/KakaoTalkButton.vue'

const route = useRoute()

// 어드민 페이지인지 확인
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})

onMounted(async () => {
  // 앱 시작 시 현재 사용자 정보 로드
  await authService.getCurrentUser()
  
  // 인증 상태 변경 리스너 설정 (Supabase는 자동으로 처리됨)
  // authService.setupAuthListener()
})
</script>

<template>
  <div id="app">
    <Header v-if="!isAdminPage" />
    <RouterView />
    <Footer v-if="!isAdminPage" />
    <!-- 카카오톡 상담 버튼 (어드민 페이지 제외) -->
    <KakaoTalkButton v-if="!isAdminPage" />
  </div>
</template>

<style>
/* CSS 변수 전역 정의 */
/* :root {
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
} */

/* 모바일에서 고정 헤더를 위한 body padding */
@media (max-width: 768px) {
  body {
    padding-top: 80px !important; /* 헤더 높이만큼 상단 여백 추가 */
  }
  
  #app {
    padding-top: 80px;
  }
}
</style>
