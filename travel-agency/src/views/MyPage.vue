<template>
  <div class="mypage-layout">
    <!-- 사이드바 (absolute 위치) -->
    <div class="sidebar-wrapper">
      <Sidebar 
        :title="mypageMenu.title" 
        :menuItems="mypageMenu.items"
      />
    </div>
    
    <!-- 메인 콘텐츠 (중앙 정렬) -->
    <div class="mypage-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()

// 마이페이지 메뉴 데이터 (정적 데이터)
const mypageMenu = ref({
  title: '마이페이지',
  items: [
    { name: '회원정보수정', path: '/mypage/profile' },
    { name: '예약/결제현황', path: '/mypage/reservations' },
    { name: '회원탈퇴', path: '/mypage/withdraw' }
  ]
})
</script>

<style scoped>
.mypage-layout {
  position: relative;
  background: #f8fafc;
  min-height: 100vh;
}

/* 사이드바 래퍼 (absolute 위치) */
.sidebar-wrapper {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

/* 메인 콘텐츠 (중앙 정렬) */
.mypage-content {
  width: 100%;
  min-height: 100vh;
  background: white;
  /* 기존 페이지들과 동일한 스타일 적용 */
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .sidebar-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .mypage-content {
    min-height: auto;
    padding: 1rem;
  }
}
</style> 