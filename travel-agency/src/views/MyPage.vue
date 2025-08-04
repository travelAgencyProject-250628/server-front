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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase.js'
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

// 기사 여부 확인 및 리다이렉트
const checkDriverStatus = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase
      .from('Users')
      .select('is_driver')
      .eq('auth_id', user.id)
      .single()
    
    if (!error && data && data.is_driver) {
      // 기사인 경우 기사 마이페이지로 리다이렉트
      router.replace('/driver-mypage')
    }
  } catch (error) {
    console.error('기사 상태 확인 오류:', error)
  }
}

onMounted(() => {
  checkDriverStatus()
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