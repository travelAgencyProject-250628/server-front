import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../lib/auth.js'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.is_admin === true)

  // 액션
  const signUp = async (userData, authData) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.signUp(userData, authData)
      
      if (result.success) {
        user.value = result.user
        return { 
          success: true, 
          message: result.message,
          autoLogin: result.autoLogin,
          session: result.session
        }
      } else {
        error.value = result.error
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (userId, password) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.signIn(userId, password)
      
      if (result.success) {
        user.value = result.user
        // 세션 상태를 localStorage에 저장 (선택사항)
        if (result.session) {
          localStorage.setItem('auth_session', JSON.stringify(result.session))
        }
        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: '로그인 중 오류가 발생했습니다.' }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.signOut()
      
      if (result.success) {
        user.value = null
        // localStorage에서 세션 정보 제거
        localStorage.removeItem('auth_session')
        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: '로그아웃 중 오류가 발생했습니다.' }
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.getCurrentUser()
      
      if (result.success) {
        user.value = result.user
      } else {
        user.value = null
      }
    } catch (err) {
      error.value = err.message
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const checkUserIdExists = async (userId) => {
    try {
      return await authService.checkUserIdExists(userId)
    } catch (err) {
      return { exists: false, available: false, error: err.message }
    }
  }

  const checkEmailExists = async (email) => {
    try {
      return await authService.checkEmailExists(email)
    } catch (err) {
      return { exists: false, available: false, error: err.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.changePassword(currentPassword, newPassword)
      
      if (result.success) {
        return { success: true, message: result.message }
      } else {
        error.value = result.error
        return { success: false, message: result.message }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: '비밀번호 변경 중 오류가 발생했습니다.' }
    } finally {
      loading.value = false
    }
  }

  // 인증 상태 변경 리스너 설정
  const setupAuthListener = () => {
    authService.onAuthStateChange(async (event, session) => {
      console.log('Auth 상태 변경:', event, session)
      
      if (event === 'SIGNED_IN' && session) {
        await getCurrentUser()
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        localStorage.removeItem('auth_session')
      } else if (event === 'TOKEN_REFRESHED') {
        await getCurrentUser()
      }
    })
  }

  return {
    // 상태
    user,
    loading,
    error,
    
    // 계산된 속성
    isAuthenticated,
    isAdmin,
    
    // 액션
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    checkUserIdExists,
    checkEmailExists,
    changePassword,
    setupAuthListener
  }
}) 