<template>
  <div class="withdraw-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">회원탈퇴</h1>
        <p class="page-subtitle">저품없는 합리적인비용으로 즐기는 고품격여행 - 굿모닝여행사</p>
      </div>

      <!-- 탈퇴정보입력 섹션 -->
      <div class="form-section">
        <h2 class="section-title">탈퇴정보입력</h2>
        
        <form @submit.prevent="handleWithdraw" class="withdraw-form">
          <div class="form-row">
            <div class="form-group">
              <label for="userId">아이디</label>
              <input 
                type="text" 
                id="userId" 
                v-model="withdrawForm.userId" 
                readonly
                class="form-input readonly"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">비밀번호 <span class="required">*</span></label>
              <input 
                type="password" 
                id="password" 
                v-model="withdrawForm.password" 
                placeholder="현재 비밀번호를 입력해주세요"
                class="form-input"
                required
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="reason">탈퇴사유 <span class="required">*</span></label>
              <textarea 
                id="reason" 
                v-model="withdrawForm.reason" 
                placeholder="탈퇴 사유를 입력해주세요"
                class="form-textarea"
                rows="8"
                required
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- 버튼 섹션 -->
      <div class="button-section">
        <button 
          type="button" 
          @click="handleWithdraw" 
          :disabled="!isFormValid"
          class="btn btn-withdraw"
        >
          회원탈퇴
        </button>
        <button type="button" @click="handleCancel" class="btn btn-cancel">
          취소하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

// 탈퇴 폼 데이터
const withdrawForm = ref({
  userId: '',
  password: '',
  reason: ''
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return withdrawForm.value.password && 
         withdrawForm.value.reason.trim()
})

// 탈퇴 처리
const handleWithdraw = async () => {
  if (!isFormValid.value) {
    alert('모든 필수 항목을 입력해주세요.')
    return
  }

  if (!confirm('정말로 회원탈퇴를 진행하시겠습니까?\n탈퇴 후에는 복구가 불가능합니다.')) {
    return
  }

  try {
    // 실제 탈퇴 API 호출
    // const response = await fetch('/api/withdraw', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     password: withdrawForm.value.password,
    //     reason: withdrawForm.value.reason
    //   })
    // })

    // 임시 처리
    alert('회원탈퇴가 신청되었습니다.\n관리자 확인 후 처리 완료 시 이메일로 안내드리겠습니다.')
    
    // 로그아웃 처리
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('회원탈퇴 실패:', error)
    alert('회원탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 취소 처리
const handleCancel = () => {
  if (confirm('회원탈퇴를 취소하시겠습니까?')) {
    router.back()
  }
}

// 컴포넌트 마운트 시 사용자 정보 로드
onMounted(() => {
  // 로그인 체크
//   if (!authStore.isAuthenticated) {
//     alert('로그인이 필요합니다.')
//     router.push('/login')
//     return
//   }

  // 사용자 아이디 설정 (실제로는 스토어에서 가져와야 함)
  withdrawForm.value.userId = authStore.user?.userId || 'jbl6938'
})
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
  --primary-color: #2563eb;
  --primary-dark: #1e40af;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --bg-light: #f8fafc;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
  --error-color: #dc2626;
  --success-color: #059669;
}

/* 전체 레이아웃 */
.withdraw-page {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-light);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 페이지 헤더 */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 섹션 공통 스타일 */
.form-section {
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

/* 폼 스타일 */
.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required {
  color: var(--error-color);
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  transition: var(--transition);
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.readonly {
  background: var(--bg-light);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* 버튼 스타일 */
.button-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.btn-cancel {
  background: var(--secondary-color);
  color: white;
}

.btn-cancel:hover {
  background: #475569;
}

.btn-withdraw {
  background: var(--error-color);
  color: white;
}

.btn-withdraw:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-withdraw:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .withdraw-page {
    padding: 1rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .button-section {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}
</style> 