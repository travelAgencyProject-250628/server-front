<template>
  <div class="email-test">
    <h2>이메일 전송 테스트</h2>
    
    <div class="form-group">
      <label for="to">받는 사람 이메일:</label>
      <input 
        id="to"
        v-model="emailData.to"
        type="email"
        placeholder="test@example.com"
        class="form-input"
      >
    </div>
    
    <div class="form-group">
      <label for="subject">제목:</label>
      <input 
        id="subject"
        v-model="emailData.subject"
        type="text"
        placeholder="테스트 이메일"
        class="form-input"
      >
    </div>
    
    <div class="form-group">
      <label for="content">내용:</label>
      <textarea 
        id="content"
        v-model="emailData.content"
        placeholder="이메일 내용을 입력하세요..."
        class="form-input"
        rows="5"
      ></textarea>
    </div>
    
    <button 
      @click="sendTestEmail"
      :disabled="isLoading"
      class="btn-primary"
    >
      {{ isLoading ? '전송 중...' : '이메일 전송' }}
    </button>
    
    <div v-if="result" class="result">
      <h3>결과:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendEmail } from '@/lib/email.js'

const emailData = ref({
  to: '',
  subject: '테스트 이메일',
  content: '<h1>안녕하세요!</h1><p>이것은 테스트 이메일입니다.</p>'
})

const isLoading = ref(false)
const result = ref(null)

const sendTestEmail = async () => {
  if (!emailData.value.to) {
    alert('받는 사람 이메일을 입력해주세요.')
    return
  }
  
  isLoading.value = true
  result.value = null
  
  try {
    const response = await sendEmail(emailData.value)
    result.value = response
    
    if (response.success) {
      alert('이메일 전송 성공!')
    } else {
      alert(`이메일 전송 실패: ${response.error}`)
    }
  } catch (error) {
    result.value = { success: false, error: error.message }
    alert(`오류 발생: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.email-test {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #1e40af;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.result {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.result pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 0.875rem;
  color: #374151;
}
</style> 