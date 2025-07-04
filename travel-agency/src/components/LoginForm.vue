<template>
  <div class="login-form">
    <h2>로그인</h2>
    
    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="user_id">아이디</label>
        <input
          id="user_id"
          v-model="form.user_id"
          type="text"
          required
          placeholder="아이디를 입력하세요"
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
        <p><strong>아이디:</strong> {{ user.user_id }}</p>
        <p><strong>이름:</strong> {{ user.name }}</p>
        <p><strong>이메일:</strong> {{ user.email }}</p>
      </div>
      <button @click="handleLogout" class="btn-secondary">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// 폼 데이터
const form = ref({
  user_id: '',
  password: ''
})

const rememberMe = ref(false)
const message = ref('')
const messageType = ref('success')

// 계산된 속성
const loading = computed(() => authStore.loading)
const user = computed(() => authStore.user)

// 로그인 처리
const handleLogin = async () => {
  if (!form.value.user_id || !form.value.password) {
    showMessage('아이디와 비밀번호를 입력해주세요.', 'error')
    return
  }
  
  const result = await authStore.signIn(form.value.user_id, form.value.password)
  
  if (result.success) {
    showMessage(result.message, 'success')
    // 로그인 성공 시 메인 페이지로 이동
    // router.push('/')
  } else {
    showMessage(result.message, 'error')
  }
}

// 로그아웃 처리
const handleLogout = async () => {
  const result = await authStore.signOut()
  
  if (result.success) {
    showMessage(result.message, 'success')
    // 로그아웃 후 로그인 페이지로 이동
    // router.push('/login')
  } else {
    showMessage(result.message, 'error')
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