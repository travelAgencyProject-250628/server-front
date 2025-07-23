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

                    <!-- 에러 상태 -->
                    <div v-else-if="error" class="error-container">
                        <p>{{ error }}</p>
                        <button @click="loadUserProfile" class="retry-button">다시 시도</button>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="join-form" novalidate>
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
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        성명
                                    </label>
                                    <input type="text" v-model="formData.name" class="form-input"
                                        placeholder="성명" readonly>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        E-Mail주소
                                    </label>
                                    <input type="email" v-model="formData.email" class="form-input"
                                        placeholder="이메일 주소를 입력하세요" :class="{ error: errors.email }" readonly>
                                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        비밀번호
                                    </label>
                                    <input type="password" v-model="formData.password" class="form-input"
                                        placeholder="새 비밀번호를 입력하세요" 
                                        :class="{ error: errors.password }"
                                        @blur="validateField('password')"
                                        @input="validateField('password')">
                                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        비밀번호 확인
                                    </label>
                                    <input type="password" v-model="formData.passwordConfirm" class="form-input"
                                        placeholder="새 비밀번호를 다시 입력하세요" 
                                        :class="{ error: errors.passwordConfirm }"
                                        @blur="validateField('passwordConfirm')"
                                        @input="validateField('passwordConfirm')">
                                    <div v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        휴대전화번호
                                    </label>
                                    <input type="tel" v-model="formData.mobile" class="form-input"
                                        placeholder=""
                                        maxlength="13"
                                        :class="{ error: errors.mobile }"
                                        @blur="validateField('mobile')"
                                        @input="handleMobileInput">
                                    <div v-if="errors.mobile" class="error-message">{{ errors.mobile }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        전화번호 (선택사항)
                                    </label>
                                    <input type="tel" v-model="formData.phone" class="form-input"
                                        placeholder=""
                                        maxlength="13"
                                        :class="{ error: errors.phone }"
                                        @blur="validateField('phone')"
                                        @input="handlePhoneInput">
                                    <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
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
                                            placeholder="상세주소를 입력하세요"
                                            @blur="validateField('address')"
                                            @input="validateField('address')">
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
                    <button type="submit" class="btn-submit" @click="handleSubmit" :disabled="isSubmitting">
                        {{ isSubmitting ? '수정 중...' : '수정완료' }}
                    </button>
                    <button type="button" class="btn-cancel" @click="handleCancel" :disabled="isSubmitting">취소하기</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUserInfo, updateUserInfo } from '../lib/users.js'
import { authService } from '../lib/auth.js'

const router = useRouter()

// 로딩 상태
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

// 폼 데이터
const formData = reactive({
  userId: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',
  mobile: '',
  email: '',
  zipcode: '',
  address1: '',
  address2: '',
  smsReceive: 'Y'
})

// 반응형 데이터
const errors = ref({})
const fieldTouched = ref({})

// Validation 패턴들 (심플한 버전)
const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    name: /^[가-힣a-zA-Z\s]{2,20}$/,
    phoneNumber: /^[0-9]{3,4}$/,
    mobile: /^010-[0-9]{4}-[0-9]{4}$/
}

// 개별 필드 검증 함수들
const validatePassword = (password) => {
    if (!password) return null // 비밀번호는 선택사항
    if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (password.length > 20) return '비밀번호는 20자 이하여야 합니다.'
    if (!patterns.password.test(password)) {
        return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return null
}

const validatePasswordConfirm = (password, passwordConfirm) => {
    if (!password) return null // 비밀번호가 없으면 확인도 필요없음
    if (!passwordConfirm) return '비밀번호 확인을 입력해주세요.'
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.'
    return null
}

const validateMobile = (mobile) => {
    if (!mobile) return '휴대전화번호를 입력해주세요.'
    const cleanMobile = mobile.replace(/-/g, '')
    if (cleanMobile.length !== 11) return '휴대전화번호는 11자리여야 합니다.'
    if (!cleanMobile.startsWith('010')) return '010으로 시작하는 번호만 입력 가능합니다.'
    if (!/^[0-9]+$/.test(cleanMobile)) return '숫자만 입력해주세요.'
    return null
}

const validatePhone = (phone) => {
    // 선택사항이므로 비어있으면 통과
    if (!phone) return null
    const cleanPhone = phone.replace(/-/g, '')
    if (cleanPhone.length < 9 || cleanPhone.length > 11) return '올바른 전화번호 형식이 아닙니다.'
    if (!/^[0-9]+$/.test(cleanPhone)) return '숫자만 입력해주세요.'
    return null
}

// 휴대폰 번호 자동 포맷팅 함수
const formatMobileNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '')
    
    if (numbers.length <= 3) {
        return numbers
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
}

// 전화번호 자동 포맷팅 함수
const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '')
    
    if (numbers.length <= 2) {
        return numbers
    } else if (numbers.startsWith('02')) {
        // 서울 지역번호 (02)
        if (numbers.length <= 2) {
            return numbers
        } else if (numbers.length <= 6) {
            return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
        } else {
            return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
        }
    } else {
        // 기타 지역번호 (3자리)
        if (numbers.length <= 3) {
            return numbers
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
        }
    }
}

// 휴대폰 번호 입력 처리
const handleMobileInput = (event) => {
    const value = event.target.value
    const formatted = formatMobileNumber(value)
    formData.mobile = formatted
    validateField('mobile')
}

// 전화번호 입력 처리
const handlePhoneInput = (event) => {
    const value = event.target.value
    const formatted = formatPhoneNumber(value)
    formData.phone = formatted
    validateField('phone')
}

// 실시간 개별 필드 검증
const validateField = (fieldName) => {
    fieldTouched.value[fieldName] = true
    
    switch (fieldName) {
        case 'password':
            errors.value.password = validatePassword(formData.password)
            // 비밀번호가 변경되면 비밀번호 확인도 재검증
            if (fieldTouched.value.passwordConfirm) {
                errors.value.passwordConfirm = validatePasswordConfirm(formData.password, formData.passwordConfirm)
            }
            break
        case 'passwordConfirm':
            errors.value.passwordConfirm = validatePasswordConfirm(formData.password, formData.passwordConfirm)
            break
        case 'mobile':
            errors.value.mobile = validateMobile(formData.mobile)
            break
        case 'phone':
            errors.value.phone = validatePhone(formData.phone)
            break
        case 'address':
            errors.value.address = !formData.zipcode || !formData.address1 ? '주소를 입력해주세요.' : null
            break
    }
}

// 폼 유효성 검사
const isFormValid = computed(() => {
  return formData.name && 
         formData.mobile &&
         (!formData.password || (formData.password === formData.passwordConfirm))
})

// 사용자 정보 로드
const loadUserProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // users.js API를 사용하여 현재 사용자 정보 가져오기
    const result = await getCurrentUserInfo()
    
    if (!result.success) {
      throw new Error(result.error || '사용자 정보를 불러오는데 실패했습니다.')
    }

    const userData = result.user

    // 폼 데이터 설정
    formData.userId = userData.email
    formData.password = ''
    formData.passwordConfirm = ''
    formData.name = userData.name || ''
    formData.phone = userData.phone || ''
    formData.mobile = userData.mobile || ''
    formData.email = userData.email
    formData.zipcode = userData.zipcode || ''
    formData.address1 = userData.address1 || ''
    formData.address2 = userData.address2 || ''
    formData.smsReceive = userData.smsReceive || 'Y'

  } catch (err) {
    console.error('사용자 정보 로드 실패:', err)
    error.value = err.message || '사용자 정보를 불러오는 중 오류가 발생했습니다.'
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
        formData.zipcode = data.zonecode;
        formData.address1 = addr;
        formData.address2 = ''; // 상세주소 초기화
        validateField('address'); // 주소 검증
        
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
  if (isSubmitting.value) return

  // 전체 폼 검증
  validateField('password')
  validateField('passwordConfirm')
  validateField('mobile')
  validateField('phone')
  validateField('address')

  // 에러가 있는지 확인
  const hasErrors = Object.values(errors.value).some(error => error !== null)
  if (hasErrors) {
    alert('입력 정보를 다시 확인해주세요.')
    return
  }

  isSubmitting.value = true
  
  try {
    // 수정할 데이터 준비 (비밀번호 포함하여 API에 맡김)
    const updateData = {
      name: formData.name,
      phone: formData.phone ? formData.phone.trim() : null,
      mobile: formData.mobile.trim(),
      zipcode: formData.zipcode,
      address1: formData.address1,
      address2: formData.address2,
      smsReceive: formData.smsReceive
    }

    // 비밀번호가 있으면 API가 처리하도록 포함
    if (formData.password) {
      updateData.password = formData.password
    }

    const result = await updateUserInfo(updateData)
    
    if (!result.success) {
      throw new Error(result.error || '회원정보 수정에 실패했습니다.')
    }

    alert('회원정보가 성공적으로 수정되었습니다.')
    router.push('/mypage')
    
  } catch (error) {
    console.error('회원정보 수정 실패:', error)
    alert(error.message || '회원정보 수정 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
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
  const result = await authService.getCurrentUser()
  if (!result.success || !result.user) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  // 사용자 정보 로드
  await loadUserProfile()
})

// 실시간 validation을 위한 watch
watch(() => formData.password, () => {
    if (fieldTouched.value.password) {
        validateField('password')
    }
})

watch(() => formData.passwordConfirm, () => {
    if (fieldTouched.value.passwordConfirm) {
        validateField('passwordConfirm')
    }
})

watch(() => formData.mobile, () => {
    if (fieldTouched.value.mobile) {
        validateField('mobile')
    }
})

watch(() => formData.phone, () => {
    if (fieldTouched.value.phone) {
        validateField('phone')
    }
})
</script>

<style scoped>
/* 폼 래퍼 */
.join-form-wrapper {
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

/* 에러 상태 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  text-align: center;
}

.error-container p {
  color: var(--error-color);
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.retry-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.retry-button:hover {
  background: var(--primary-dark);
}

.join-form {
  padding: 0;
}

/* 폼 섹션 */
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

.required-icon {
  color: var(--primary-color);
}

/* 폼 필드 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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
  font-size: 0.85rem;
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
  font-size: 0.9rem;
  transition: var(--transition);
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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

/* 입력 필드 에러 상태 */
.form-input.error {
  border-color: var(--error-color);
  background-color: rgba(220, 38, 38, 0.05);
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
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
  font-size: 0.9rem;
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
  font-size: 0.8rem;
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

.btn-submit:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-submit:disabled {
  background: var(--border-color);
  cursor: not-allowed;
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

.btn-cancel:hover:not(:disabled) {
  background: #475569;
}

.btn-cancel:disabled {
  background: var(--border-color);
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .join-form {
    padding: 0;
  }

  .container {
    padding: 0;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .form-section {
    padding: 0;
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
    padding: 0;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .form-section {
    padding: 0;
    margin-bottom: 0.75rem;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-input {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .radio-label {
    font-size: 0.85rem;
  }

  .field-notice {
    font-size: 0.75rem;
    line-height: 1.4;
  }
}
</style> 