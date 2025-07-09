<template>
  <div class="mypage-layout">
    <!-- 사이드바 (absolute 위치) -->
    <div class="sidebar-wrapper">
      <Sidebar 
        v-if="!loading && mypageMenu"
        :title="mypageMenu.title" 
        :menuItems="mypageMenu.items"
      />
      <div v-else class="sidebar-loading">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>메뉴 로딩중...</p>
        </div>
      </div>
    </div>
    
    <!-- 메인 콘텐츠 (중앙 정렬) -->
    <div class="mypage-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const mypageMenu = ref(null)
const loading = ref(true)

const loadMypageMenu = async () => {
  try {
    loading.value = true
    
    // 실제로는 API 호출: const response = await fetch('/api/mypage-menu')
    // const data = await response.json()
    
    // 더미 데이터 (서버에서 받아온 마이페이지 메뉴)
    const dummyMypageMenu = {
      title: '마이페이지',
      items: [
        { name: '회원정보수정', path: '/mypage/profile' },
        { name: '예약/결제현황', path: '/mypage/reservations' },
        { name: '회원탈퇴', path: '/mypage/withdraw' }
      ]
    }
    
    // 시뮬레이션: 서버 응답 지연
    await new Promise(resolve => setTimeout(resolve, 200))
    
    mypageMenu.value = dummyMypageMenu
    loading.value = false
  } catch (error) {
    console.error('마이페이지 메뉴 로드 실패:', error)
    loading.value = false
  }
}

onMounted(() => {
  loadMypageMenu()
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

/* 사이드바 로딩 */
.sidebar-loading {
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 2rem 1rem;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 메인 콘텐츠 (중앙 정렬) */
.mypage-content {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  /* 기존 페이지들과 동일한 스타일 적용 */
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .sidebar-wrapper {
    position: relative;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }
  
  .mypage-content {
    min-height: auto;
  }
}
</style> 