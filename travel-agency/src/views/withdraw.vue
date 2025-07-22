<template>
  <div class="withdraw-page">
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">회원탈퇴</h1>
          <p class="page-subtitle">저품없는 합리적인비용으로 즐기는 고품격여행 - 굿모닝여행사</p>
        </div>

        <!-- 탈퇴정보입력 섹션 -->
        <div class="form-section">
          <h2 class="section-title">탈퇴정보입력
            <span class="required-notice">
              <span class="required-icon">⦁</span>
              필수항목
            </span>
          </h2>

          <form @submit.prevent="handleWithdraw" class="withdraw-form">
            <div class="form-row">
              <div class="form-group">
                <label for="email" class="form-label">이메일</label>
                <input type="email" id="email" v-model="withdrawForm.email" readonly class="form-input readonly">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password" class="form-label required">
                  <span class="required-icon">⦁</span>
                  비밀번호
                </label>
                <input type="password" id="password" v-model="withdrawForm.password" placeholder="현재 비밀번호를 입력해주세요"
                  class="form-input" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="reason" class="form-label required">
                  <span class="required-icon">⦁</span>
                  탈퇴사유
                </label>
                <textarea id="reason" v-model="withdrawForm.reason" placeholder="탈퇴 사유를 입력해주세요" class="form-textarea"
                  rows="8" required></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- 버튼 섹션 -->
        <div class="button-section">
          <button type="button" @click="handleWithdraw" :disabled="!isFormValid" class="btn btn-withdraw">
            회원탈퇴
          </button>
          <button type="button" @click="handleCancel" class="btn btn-cancel">
            취소하기
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../lib/auth.js'

const router = useRouter()

// 탈퇴 폼 데이터
const withdrawForm = ref({
  userId: '',
  email: '',
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
    await authService.signOut()
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
onMounted(async () => {
  // 로그인 체크
  const { data: { user } } = await authService.getCurrentUser()
  if (!user) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  // 사용자 정보 설정
  withdrawForm.value.userId = user.email || 'jbl6938'
  withdrawForm.value.email = user.email || ''
})
</script>

<style scoped>
/* 전체 레이아웃 */
.withdraw-page {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
}

/* 섹션 스타일 */
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.required-notice {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
}

/* 폼 스타일 */
.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.form-group label,
.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-label.required {
  color: var(--text-secondary);
}

.required-icon {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 0.8rem;
  margin-left: 0.25rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
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
  min-height: 100px;
}

/* 버튼 스타일 */
.button-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
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
  .form-section {
    padding: 1.25rem;
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

  .section-title {
    font-size: 1rem;
  }
}
</style>