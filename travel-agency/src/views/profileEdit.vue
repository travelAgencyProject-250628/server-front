<template>
    <div class="profile-edit-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">회원정보수정</h1>
                    <p class="page-subtitle">기존하는 합리적인비용으로 즐기는 고품격여행 - 굿모닝여행사</p>
                </div>

                <!-- 회원정보수정 폼 -->
                <div class="join-form-wrapper">
                    <!-- 로딩 상태 -->
                    <div v-if="isLoading" class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>사용자 정보를 불러오는 중...</p>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="join-form">
                        <!-- 기본 회원정보 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                기본회원정보
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">
                                        아이디
                                    </label>
                                    <input type="text" v-model="formData.userId" class="form-input" readonly>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        성명
                                    </label>
                                    <input type="text" v-model="formData.name" class="form-input"
                                        placeholder="성명을 입력하세요" :class="{ error: errors.name }" required>
                                    <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        비밀번호
                                    </label>
                                    <input type="password" v-model="formData.password" class="form-input"
                                        placeholder="새 비밀번호를 입력하세요" :class="{ error: errors.password }">
                                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        비밀번호 확인
                                    </label>
                                    <input type="password" v-model="formData.passwordConfirm" class="form-input"
                                        placeholder="새 비밀번호를 다시 입력하세요" :class="{ error: errors.passwordConfirm }">
                                    <div v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        전화번호
                                    </label>
                                    <div class="phone-group">
                                        <input type="text" v-model="formData.phone1" class="form-input phone-input"
                                            placeholder="02" maxlength="3">
                                        <span class="phone-dash">-</span>
                                        <input type="text" v-model="formData.phone2" class="form-input phone-input"
                                            placeholder="1234" maxlength="4">
                                        <span class="phone-dash">-</span>
                                        <input type="text" v-model="formData.phone3" class="form-input phone-input"
                                            placeholder="5678" maxlength="4">
                                    </div>
                                    <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        휴대전화번호
                                    </label>
                                    <div class="phone-group">
                                        <input type="text" v-model="formData.mobile1" class="form-input phone-input"
                                            placeholder="010" maxlength="3">
                                        <span class="phone-dash">-</span>
                                        <input type="text" v-model="formData.mobile2" class="form-input phone-input"
                                            placeholder="1234" maxlength="4">
                                        <span class="phone-dash">-</span>
                                        <input type="text" v-model="formData.mobile3" class="form-input phone-input"
                                            placeholder="5678" maxlength="4">
                                    </div>
                                    <div v-if="errors.mobile" class="error-message">{{ errors.mobile }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        E-Mail주소
                                    </label>
                                    <input type="email" v-model="formData.email" class="form-input"
                                        placeholder="이메일 주소를 입력하세요" :class="{ error: errors.email }" required>
                                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                                </div>

                                <div class="form-group full-width">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        주소
                                    </label>
                                    <div class="address-group">
                                        <div class="input-with-button">
                                            <input type="text" v-model="formData.zipcode" class="form-input"
                                                placeholder="우편번호" readonly>
                                            <button type="button" class="btn-check" @click="findAddress">우편번호찾기</button>
                                        </div>
                                        <input type="text" v-model="formData.address1" class="form-input"
                                            placeholder="기본주소" readonly>
                                        <input type="text" v-model="formData.address2" class="form-input"
                                            placeholder="상세주소를 입력하세요">
                                    </div>
                                    <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
                                </div>

                                <div class="form-group full-width">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        SMS 수신여부
                                    </label>
                                    <div class="radio-group">
                                        <label class="radio-label">
                                            <input type="radio" v-model="formData.smsReceive" value="Y"
                                                class="radio-input">
                                            <span class="radio-text">수신에 동의</span>
                                        </label>
                                        <label class="radio-label">
                                            <input type="radio" v-model="formData.smsReceive" value="N"
                                                class="radio-input">
                                            <span class="radio-text">수신에 동의하지않음</span>
                                        </label>
                                    </div>
                                    <p class="field-notice">
                                        * 수신동의시 신상품 및 할인상품정보 (SMS)받아드립니다
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 제출 버튼 -->
                <div class="form-actions">
                    <button type="submit" class="btn-submit" @click="handleSubmit">수정완료</button>
                    <button type="button" class="btn-cancel" @click="handleCancel">취소하기</button>
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

// 로딩 상태
const isLoading = ref(true)

// 폼 데이터 (초기값은 빈 상태)
const formData = ref({
  userId: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone1: '',
  phone2: '',
  phone3: '',
  mobile1: '',
  mobile2: '',
  mobile3: '',
  email: '',
  zipcode: '',
  address1: '',
  address2: '',
  smsReceive: 'Y'
})

// 에러 메시지
const errors = ref({})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return formData.value.name && 
         formData.value.email &&
         formData.value.mobile1 && formData.value.mobile2 && formData.value.mobile3 &&
         (!formData.value.password || (formData.value.password === formData.value.passwordConfirm))
})

// 사용자 정보 로드
const loadUserProfile = async () => {
  try {
    isLoading.value = true
    
    // 현재 로그인한 사용자 정보 가져오기
    const { data: { user } } = await authService.getCurrentUser()
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 실제 API 호출 (예시)
    // const response = await fetch('/api/profile', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${user.access_token}`,
    //     'Content-Type': 'application/json',
    //   }
    // })
    // const userData = await response.json()

    // 임시 데이터 (실제로는 위의 API 응답 데이터를 사용)
    const userData = {
      userId: user.email,
      name: '이정원',
      phone: '010-2237-6938',
      mobile: '010-2237-6938',
      email: user.email,
      zipcode: '04759',
      address1: '서울 성동구 마조로15길 9 (마장동)',
      address2: '105호',
      smsReceive: 'Y'
    }

    // 전화번호 분리
    const phoneParts = userData.phone ? userData.phone.split('-') : ['', '', '']
    const mobileParts = userData.mobile ? userData.mobile.split('-') : ['', '', '']

    // 폼 데이터 설정
    formData.value = {
      userId: userData.userId,
      password: '',
      passwordConfirm: '',
      name: userData.name,
      phone1: phoneParts[0] || '',
      phone2: phoneParts[1] || '',
      phone3: phoneParts[2] || '',
      mobile1: mobileParts[0] || '',
      mobile2: mobileParts[1] || '',
      mobile3: mobileParts[2] || '',
      email: userData.email,
      zipcode: userData.zipcode,
      address1: userData.address1,
      address2: userData.address2,
      smsReceive: userData.smsReceive
    }

  } catch (error) {
    console.error('사용자 정보 로드 실패:', error)
    alert('사용자 정보를 불러오는 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 주소 찾기
const findAddress = () => {
  // Daum 우편번호 API 사용
  if (typeof daum !== 'undefined') {
    new daum.Postcode({
      oncomplete: function(data) {
        let addr = ''; // 주소 변수
        
        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }
        
        // Vue.js 방식으로 데이터 업데이트
        formData.value.zipcode = data.zonecode;
        formData.value.address1 = addr;
        formData.value.address2 = ''; // 상세주소 초기화
        errors.value.address = ''; // 에러 메시지 제거
        
        // 콘솔에 로그 출력 (디버깅용)
        console.log('주소 검색 결과:', data);
      }
    }).open();
  } else {
    alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
  }
}

// 폼 제출 처리
const handleSubmit = async () => {
  errors.value = {}
  
  // 유효성 검사
  if (!formData.value.name) {
    errors.value.name = '성명을 입력해주세요.'
  }
  
  if (!formData.value.email) {
    errors.value.email = '이메일을 입력해주세요.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = '올바른 이메일 주소를 입력해주세요.'
  }
  
  // 휴대폰번호 검증
  if (!formData.value.mobile1 || !formData.value.mobile2 || !formData.value.mobile3) {
    errors.value.mobile = '휴대폰번호를 모두 입력해주세요.'
  }
  
  // 전화번호 검증 (선택사항)
  if (formData.value.phone1 || formData.value.phone2 || formData.value.phone3) {
    if (!formData.value.phone1 || !formData.value.phone2 || !formData.value.phone3) {
      errors.value.phone = '전화번호를 입력하시려면 모두 입력해주세요.'
    }
  }
  
  // 비밀번호 검증 (변경하는 경우에만)
  if (formData.value.password) {
    if (formData.value.password.length < 6) {
      errors.value.password = '비밀번호는 6글자 이상 입력해주세요.'
    } else if (formData.value.password !== formData.value.passwordConfirm) {
      errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }
  }
  
  // 주소 검증
  if (!formData.value.zipcode || !formData.value.address1) {
    errors.value.address = '주소를 입력해주세요.'
  }
  
  if (Object.keys(errors.value).length > 0) {
    return
  }

  try {
    // 비밀번호 변경이 있는 경우 먼저 처리
    if (formData.value.password) {
      const passwordResult = await authService.changePassword('', formData.value.password)
      if (!passwordResult.success) {
        alert(passwordResult.message)
        return
      }
    }

    // 수정할 데이터 준비
    const updateData = {
      name: formData.value.name,
      phone_number: formData.value.phone1 && formData.value.phone2 && formData.value.phone3 
        ? `${formData.value.phone1}-${formData.value.phone2}-${formData.value.phone3}` 
        : null,
      mobile_number: `${formData.value.mobile1}-${formData.value.mobile2}-${formData.value.mobile3}`,
      email: formData.value.email,
      zipcode: formData.value.zipcode,
      address1: formData.value.address1,
      address2: formData.value.address2,
      sms_receive: formData.value.smsReceive
    }

    // Users 테이블 업데이트
    const { data: { user } } = await authService.getCurrentUser()
    if (user && user.auth_id) {
      const { error: updateError } = await authService.supabase
        .from('Users')
        .update(updateData)
        .eq('auth_id', user.auth_id)

      if (updateError) {
        console.error('Users 테이블 업데이트 실패:', updateError)
        throw new Error('회원정보 수정에 실패했습니다.')
      }
    }

    console.log('수정할 데이터:', updateData)
    alert('회원정보가 수정되었습니다.')
    router.push('/mypage')
  } catch (error) {
    console.error('회원정보 수정 실패:', error)
    alert('회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 취소 처리
const handleCancel = () => {
  if (confirm('수정을 취소하시겠습니까?')) {
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

  // 사용자 정보 로드
  await loadUserProfile()
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
.profile-edit-page {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-light);
  min-height: 100vh;
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
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
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0;
}

/* 폼 래퍼 */
.join-form-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 폼 섹션 */
.form-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: 2rem;
}

.section-title {
  font-size: 1.25rem;
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
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.required-icon {
  color: var(--primary-color);
  margin-right: 0.25rem;
}

/* 폼 그리드 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* 폼 라벨 */
.form-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-label.required {
  color: var(--text-secondary);
}

.required-icon {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 0.8rem;
}

/* 폼 입력 */
.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  transition: var(--transition);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
  border-color: var(--error-color);
  background-color: #fef2f2;
}

.form-input[readonly] {
  background-color: var(--bg-light);
  color: var(--text-secondary);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* 입력 필드와 버튼 조합 */
.input-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-button .form-input {
  flex: 1;
}

/* 전화번호 입력 */
.phone-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.phone-input {
  flex: 1;
  min-width: 0;
}

.phone-dash {
  color: var(--text-secondary);
  font-weight: 500;
}

/* 주소 입력 */
.address-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 라디오 버튼 */
.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  gap: 0.5rem;
}

.radio-input {
  width: 16px;
  height: 16px;
}

.radio-text {
  color: var(--text-primary);
}

.field-notice {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
}

/* 버튼 스타일 */
.btn-check {
  background: var(--secondary-color);
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  font-weight: 500;
}

.btn-check:hover {
  background: #475569;
}

/* 제출 버튼 */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 0;
}

.btn-submit {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.btn-submit:hover {
  background: var(--primary-dark);
}

.btn-cancel {
  background: var(--secondary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.btn-cancel:hover {
  background: #475569;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .main-content {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .form-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group {
    margin-bottom: 0;
  }

  .form-input {
    padding: 0.875rem;
    font-size: 1rem;
  }

  /* 입력 필드와 버튼 조합 */
  .input-with-button {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-check {
    width: 100%;
    padding: 0.875rem;
    font-size: 0.95rem;
  }

  /* 라디오 버튼 */
  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .radio-label {
    padding: 0.5rem 0;
  }

  /* 제출 버튼 */
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .form-section {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .section-title {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-input {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  .radio-label {
    font-size: 0.9rem;
  }

  .field-notice {
    font-size: 0.8rem;
    line-height: 1.4;
  }
}
</style> 