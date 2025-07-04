<template>
  <div class="signup-form">
    <h2>회원가입</h2>
    
    <form @submit.prevent="handleSignUp" class="form">
      <!-- 기본 정보 -->
      <div class="form-section">
        <h3>기본 정보</h3>
        
        <div class="form-group">
          <label for="user_id">아이디 *</label>
          <input
            id="user_id"
            v-model="form.user_id"
            type="text"
            required
            @blur="checkUserId"
            :class="{ 'error': userIdError }"
          />
          <span v-if="userIdError" class="error-text">{{ userIdError }}</span>
          <span v-else-if="userIdAvailable" class="success-text">사용 가능한 아이디입니다.</span>
        </div>

        <div class="form-group">
          <label for="user_password">비밀번호 *</label>
          <input
            id="user_password"
            v-model="form.user_password"
            type="password"
            required
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirm_password">비밀번호 확인 *</label>
          <input
            id="confirm_password"
            v-model="confirmPassword"
            type="password"
            required
            :class="{ 'error': passwordMismatch }"
          />
          <span v-if="passwordMismatch" class="error-text">비밀번호가 일치하지 않습니다.</span>
        </div>

        <div class="form-group">
          <label for="name">이름 *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">이메일 *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            @blur="checkEmail"
            :class="{ 'error': emailError }"
          />
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
          <span v-else-if="emailAvailable" class="success-text">사용 가능한 이메일입니다.</span>
        </div>
      </div>

      <!-- 연락처 정보 -->
      <div class="form-section">
        <h3>연락처 정보</h3>
        
        <div class="form-group">
          <label for="phone_number">일반 전화번호</label>
          <input
            id="phone_number"
            v-model="form.phone_number"
            type="tel"
            placeholder="선택사항"
          />
        </div>

        <div class="form-group">
          <label for="mobile_number">휴대전화번호 *</label>
          <input
            id="mobile_number"
            v-model="form.mobile_number"
            type="tel"
            required
          />
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              v-model="form.receive_sms"
            />
            SMS 수신 동의 (선택사항)
          </label>
        </div>
      </div>

      <!-- 주소 정보 -->
      <div class="form-section">
        <h3>주소 정보</h3>
        
        <div class="form-group">
          <label for="postal_code">우편번호 *</label>
          <div class="postal-code-group">
            <input
              id="postal_code"
              v-model="form.postal_code"
              type="text"
              required
              readonly
            />
            <button type="button" @click="searchPostalCode" class="btn-secondary">
              우편번호 검색
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="address">기본 주소 *</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            readonly
          />
        </div>

        <div class="form-group">
          <label for="address_detail">상세 주소 *</label>
          <input
            id="address_detail"
            v-model="form.address_detail"
            type="text"
            required
            placeholder="상세 주소를 입력하세요"
          />
        </div>
      </div>

      <!-- 약관 동의 -->
      <div class="form-section">
        <div class="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              v-model="form.agree_terms"
              required
            />
            <span class="required">*</span> 이용약관 및 개인정보처리방침에 동의합니다.
          </label>
        </div>
      </div>

      <!-- 제출 버튼 -->
      <div class="form-actions">
        <button type="submit" :disabled="loading || !isFormValid" class="btn-primary">
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
      </div>
    </form>

    <!-- 결과 메시지 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// 폼 데이터
const form = ref({
  user_id: '',
  user_password: '',
  name: '',
  phone_number: '',
  mobile_number: '',
  email: '',
  address: '',
  address_detail: '',
  postal_code: '',
  receive_sms: false,
  agree_terms: false
})

const confirmPassword = ref('')
const userIdError = ref('')
const emailError = ref('')
const userIdAvailable = ref(false)
const emailAvailable = ref(false)
const message = ref('')
const messageType = ref('success')

// 계산된 속성
const loading = computed(() => authStore.loading)
const passwordMismatch = computed(() => 
  form.value.user_password && 
  confirmPassword.value && 
  form.value.user_password !== confirmPassword.value
)

const isFormValid = computed(() => {
  return form.value.user_id &&
         form.value.user_password &&
         form.value.name &&
         form.value.mobile_number &&
         form.value.email &&
         form.value.address &&
         form.value.address_detail &&
         form.value.postal_code &&
         form.value.agree_terms &&
         !passwordMismatch.value &&
         !userIdError.value &&
         !emailError.value
})

// 사용자 ID 중복 확인
const checkUserId = async () => {
  if (!form.value.user_id) return
  
  userIdError.value = ''
  userIdAvailable.value = false
  
  if (form.value.user_id.length < 4) {
    userIdError.value = '아이디는 4자 이상이어야 합니다.'
    return
  }
  
  const result = await authStore.checkUserIdExists(form.value.user_id)
  
  if (result.exists) {
    userIdError.value = '이미 사용 중인 아이디입니다.'
  } else if (result.available) {
    userIdAvailable.value = true
  }
}

// 이메일 중복 확인
const checkEmail = async () => {
  if (!form.value.email) return
  
  emailError.value = ''
  emailAvailable.value = false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    emailError.value = '올바른 이메일 형식을 입력해주세요.'
    return
  }
  
  const result = await authStore.checkEmailExists(form.value.email)
  
  if (result.exists) {
    emailError.value = '이미 사용 중인 이메일입니다.'
  } else if (result.available) {
    emailAvailable.value = true
  }
}

// 우편번호 검색
const searchPostalCode = () => {
  // 실제 구현에서는 우편번호 검색 API 사용
  alert('우편번호 검색 기능은 별도 구현이 필요합니다.')
}

// 회원가입 처리
const handleSignUp = async () => {
  if (!isFormValid.value) {
    showMessage('모든 필수 항목을 올바르게 입력해주세요.', 'error')
    return
  }
  
  const result = await authStore.signUp(form.value)
  
  if (result.success) {
    showMessage(result.message, 'success')
    // 회원가입 성공 시 로그인 페이지로 이동
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

// 비밀번호 변경 감지
watch(confirmPassword, () => {
  if (passwordMismatch.value) {
    // 비밀번호 불일치 처리
  }
})
</script>

<style scoped>
.signup-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-section h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.success-text {
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.required {
  color: #dc3545;
}

.postal-code-group {
  display: flex;
  gap: 10px;
}

.postal-code-group input {
  flex: 1;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-secondary:hover {
  background: #5a6268;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
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
</style> 