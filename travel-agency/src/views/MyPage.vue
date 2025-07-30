<template>
  <div class="mypage-layout">
    <!-- 사이드바 -->
    <aside class="sidebar-section">
      <Sidebar 
        :title="mypageMenu.title" 
        :menuItems="mypageMenu.items"
      />
    </aside>
    
    <!-- 메인 콘텐츠 -->
    <main class="mypage-content">
      <router-view />
    </main>
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
    { name: '예약/결제현황', path: '/mypage/reservations' }
  ]
})
</script>

<style scoped>
/* 전체 레이아웃 - ProductList와 동일 */
.mypage-layout {
  display: grid;
  grid-template-columns: 1fr 270px 850px 1fr;
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  padding-top: 3.5rem;
}

/* 사이드바 섹션 */
.sidebar-section {
  grid-column: 2;
  padding: 1.5rem 2rem 0 0;
}

/* 메인 콘텐츠 */

.mypage-content {
  grid-column: 3;
  width: 100%;
  padding: 0;
}

/* 반응형 디자인 - 모바일에서는 기존 방식으로 복구 */
@media (max-width: 768px) {
  .mypage-layout {
    display: block;
    position: relative;
    padding-top: 0rem !important;
  }
  
  .sidebar-section {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0;
    display: block;
  }
}

@media (max-width: 480px) {
  .mypage-layout {
    display: block;
    position: relative;
    padding-top: 1.5rem;
  }
  
  .sidebar-section {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0;
    display: block;
  }
}
</style> 