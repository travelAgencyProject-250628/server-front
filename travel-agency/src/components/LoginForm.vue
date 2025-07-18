<template>
  <div class="login-form">
    <h2>로그인</h2>
    
    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="email">이메일</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <div class="form-options">
        <label class="checkbox-group">
          <input
            type="checkbox"
            v-model="rememberMe"
          />
          로그인 상태 유지
        </label>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </div>

      <div class="form-links">
        <a href="/find-account" class="link">아이디/비밀번호 찾기</a>
        <span class="separator">|</span>
        <a href="/join" class="link">회원가입</a>
      </div>
    </form>

    <!-- 결과 메시지 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- 로그인 성공 시 사용자 정보 -->
    <div v-if="user" class="user-info">
      <h3>로그인 성공!</h3>
      <div class="user-details">
        <p><strong>이메일:</strong> {{ user.email }}</p>
        <p><strong>ID:</strong> {{ user.id }}</p>
      </div>
      <button @click="handleLogout" class="btn-secondary">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authService } from '../lib/auth.js'

// 폼 데이터
const form = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const message = ref('')
const messageType = ref('success')
const loading = ref(false)
const user = ref(null)

// 로그인 상태 확인
const checkAuthStatus = async () => {
  const { data: { user: currentUser } } = await authService.getCurrentUser()
  user.value = currentUser
}

// 로그인 처리
const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    showMessage('이메일과 비밀번호를 입력해주세요.', 'error')
    return
  }
  
  try {
    loading.value = true
    
    const { data, error } = await authService.signIn(form.value.email, form.value.password)
    
    if (error) {
      showMessage(error.message, 'error')
    } else {
      showMessage('로그인이 완료되었습니다.', 'success')
      await checkAuthStatus()
      // 로그인 성공 시 메인 페이지로 이동
      // router.push('/')
    }
  } catch (error) {
    showMessage('로그인 중 오류가 발생했습니다.', 'error')
  } finally {
    loading.value = false
  }
}

// 로그아웃 처리
const handleLogout = async () => {
  try {
    loading.value = true
    
    const { error } = await authService.signOut()
    
    if (error) {
      showMessage(error.message, 'error')
    } else {
      showMessage('로그아웃이 완료되었습니다.', 'success')
      user.value = null
      // 로그아웃 후 로그인 페이지로 이동
      // router.push('/login')
    }
  } catch (error) {
    showMessage('로그아웃 중 오류가 발생했습니다.', 'error')
  } finally {
    loading.value = false
  }
}

// 메시지 표시
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// 컴포넌트 마운트 시 로그인 상태 확인
onMounted(async () => {
  await checkAuthStatus()
})
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-options {
  margin-bottom: 20px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  margin-bottom: 20px;
}

.btn-primary {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-links {
  text-align: center;
  font-size: 14px;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 10px;
  color: #666;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.user-info {
  background: #e8f5e8;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

.user-info h3 {
  margin-top: 0;
  color: #28a745;
}

.user-details {
  margin: 15px 0;
  text-align: left;
}

.user-details p {
  margin: 8px 0;
  color: #2c3e50;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style> 