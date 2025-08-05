<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="loading-spinner" v-if="isLoading">
        <div class="spinner"></div>
        <p>로그인 처리 중...</p>
      </div>
      <div class="error-message" v-else-if="error">
        <h2>로그인 실패</h2>
        <p>{{ error }}</p>
        <button @click="goToLogin" class="btn-retry">로그인 페이지로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../lib/auth.js'

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    console.log('AuthCallback 컴포넌트 마운트됨')
    console.log('현재 URL:', window.location.href)
    console.log('Route query:', route.query)
    console.log('URL 해시:', window.location.hash)
    
    // URL 해시에서 access_token 추출
    const hash = window.location.hash.substring(1) // '#' 제거
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    console.log('Access Token:', accessToken ? accessToken.substring(0, 20) + '...' : '없음')
    console.log('Refresh Token:', refreshToken ? refreshToken.substring(0, 20) + '...' : '없음')
    
    const next = route.query.next || '/'
    const error = route.query.error
    const errorDescription = route.query.error_description

    // 에러가 있는 경우
    if (error) {
      throw new Error(`OAuth 에러: ${error} - ${errorDescription || ''}`)
    }

    if (!accessToken) {
      console.error('Access Token이 없습니다. 현재 URL:', window.location.href)
      console.error('URL 파라미터들:', Object.keys(route.query))
      throw new Error('Access Token이 없습니다. 카카오 로그인 과정에서 문제가 발생했습니다.')
    }

    console.log('카카오 인증 토큰 처리 시작')

    // 카카오 인증 성공 처리
    console.log('카카오 인증 성공, 사용자 정보 확인 중...')
    
    // 현재 카카오 인증된 사용자 정보 가져오기
    const { data: { user }, error: userError } = await authService.supabase.auth.getUser()
    
    if (userError || !user) {
        console.error('사용자 정보 조회 실패:', userError)
        router.push('/join')
        return
    }
    
    console.log('카카오 사용자 확인:', user.id)
    
    // Users 테이블에서 해당 사용자가 이미 존재하는지 확인
    const { data: existingUser, error: checkError } = await authService.supabase
        .from('Users')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle()
    
    if (checkError) {
        console.error('사용자 존재 확인 실패:', checkError)
        router.push('/join')
        return
    }
    
    if (existingUser) {
        console.log('기존 사용자 발견, 메인 페이지로 이동')
        router.push('/')
    } else {
        console.log('새 사용자, 회원가입 페이지로 이동')
        router.push('/join')
    }
  } catch (err) {
    console.error('OAuth 콜백 처리 오류:', err)
    error.value = err.message
    isLoading.value = false
  }
})

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.callback-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message h2 {
  color: #dc2626;
  margin: 0;
  font-size: 1.5rem;
}

.error-message p {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.btn-retry {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-retry:hover {
  background: #2563eb;
}
</style> 