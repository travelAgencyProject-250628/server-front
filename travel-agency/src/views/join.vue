<template>
    <div class="join-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">회원가입</h1>
                    <p class="page-subtitle">더쉼투어와 함께 특별한 여행을 시작하세요</p>
                </div>

                <!-- 회원가입 폼 -->
                <div class="join-form-wrapper">
                    <form @submit.prevent="handleSubmit" class="join-form" novalidate>
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
                                        placeholder="한글 또는 영문 2-20자" 
                                        :class="{ error: errors.name }"
                                        @blur="validateField('name')"
                                        @input="validateField('name')"
                                        required>
                                    <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        이메일
                                    </label>
                                    <input type="email" v-model="formData.email" class="form-input"
                                        placeholder="이메일 주소를 입력하세요" 
                                        :class="{ error: errors.email }"
                                        @blur="validateField('email')"
                                        @input="validateField('email')"
                                        required>
                                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        비밀번호
                                    </label>
                                    <input type="password" v-model="formData.password" class="form-input"
                                        placeholder="영문과 숫자 포함 8자 이상" 
                                        :class="{ error: errors.password }"
                                        @blur="validateField('password')"
                                        @input="validateField('password')"
                                        required>
                                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        비밀번호 확인
                                    </label>
                                    <input type="password" v-model="formData.passwordConfirm" class="form-input"
                                        placeholder="비밀번호를 다시 입력하세요" 
                                        :class="{ error: errors.passwordConfirm }"
                                        @blur="validateField('passwordConfirm')"
                                        @input="validateField('passwordConfirm')"
                                        required>
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

                <!-- 약관동의 -->
                <div class="terms-section">
                    <h2 class="section-title">약관동의</h2>

                    <div class="terms-container">
                        <!-- 전체 동의 -->
                        <div class="terms-all-agree">
                            <label class="checkbox-label all-agree-label">
                                <input type="checkbox" v-model="agreeAll" @change="toggleAllTerms"
                                    class="checkbox-input">
                                <span class="checkbox-text">모든 내용에 동의</span>
                            </label>
                        </div>

                        <!-- 개별 약관 항목들 -->
                        <div class="terms-list">
                            <div class="terms-item">
                                <div class="terms-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" v-model="formData.agreePrivacy"
                                            class="checkbox-input" required>
                                        <span class="checkbox-text">
                                            <span class="required-mark">[필수]</span>
                                            개인정보 수집 및 이용 동의
                                        </span>
                                    </label>
                                    <button type="button" class="btn-terms"
                                        @click="showTerms('privacy')">약관보기</button>
                                </div>
                            </div>

                            <div class="terms-item">
                                <div class="terms-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" v-model="formData.agreePolicy" class="checkbox-input"
                                            required>
                                        <span class="checkbox-text">
                                            <span class="required-mark">[필수]</span>
                                            개인정보 취급위탁 내용에 동의
                                        </span>
                                    </label>
                                    <button type="button" class="btn-terms"
                                        @click="showTerms('policy')">약관보기</button>
                                </div>
                            </div>

                            <div class="terms-item">
                                <div class="terms-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" v-model="formData.agreeService"
                                            class="checkbox-input" required>
                                        <span class="checkbox-text">
                                            <span class="required-mark">[필수]</span>
                                            이용약관 내용에 동의
                                        </span>
                                    </label>
                                    <button type="button" class="btn-terms"
                                        @click="showTerms('service')">약관보기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 제출 버튼 -->
                <div class="form-actions">
                    <button type="submit" class="btn-submit" @click="handleSubmit">회원가입</button>
                    <button type="button" class="btn-cancel" @click="handleCancel">취소하기</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../lib/auth.js'

// 라우터 사용
const router = useRouter()

// 반응형 데이터
const errors = ref({})
const fieldTouched = ref({})
const agreeAll = ref(false)

// 폼 데이터 (reactive로 객체 전체를 반응형으로 관리)
const formData = reactive({
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    mobile: '',
    email: '',
    zipcode: '',
    address1: '',
    address2: '',
    address3: '',
    smsReceive: 'Y',
    agreePrivacy: false,
    agreePolicy: false,
    agreeService: false
})

// Validation 패턴들 (심플한 버전)
const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    name: /^[가-힣a-zA-Z\s]{2,20}$/,
    phoneNumber: /^[0-9]{3,4}$/,
    mobile: /^010-[0-9]{4}-[0-9]{4}$/
}

// 개별 필드 검증 함수들 (심플한 버전)
const validateEmail = (email) => {
    if (!email) return '이메일 주소를 입력해주세요.'
    if (!patterns.email.test(email)) return '올바른 이메일 형식을 입력해주세요.'
    return null
}

const validatePassword = (password) => {
    if (!password) return '비밀번호를 입력해주세요.'
    if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (password.length > 20) return '비밀번호는 20자 이하여야 합니다.'
    if (!patterns.password.test(password)) {
        return '비밀번호는 영문과 숫자를 포함해야 합니다.'
    }
    return null
}

const validatePasswordConfirm = (password, passwordConfirm) => {
    if (!passwordConfirm) return '비밀번호 확인을 입력해주세요.'
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.'
    return null
}

const validateName = (name) => {
    if (!name) return '성명을 입력해주세요.'
    if (!patterns.name.test(name)) return '한글 또는 영문 2-20자로 입력해주세요.'
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

// 휴대폰 번호 입력 처리
const handleMobileInput = (event) => {
    const value = event.target.value
    const formatted = formatMobileNumber(value)
    formData.mobile = formatted
    validateField('mobile')
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
        case 'email':
            errors.value.email = validateEmail(formData.email)
            break
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
        case 'name':
            errors.value.name = validateName(formData.name)
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

// 전체 폼 검증
const validateForm = () => {
    // 모든 필드를 touched 상태로 만들기
    Object.keys(formData).forEach(key => {
        fieldTouched.value[key] = true
    })
    
    // 개별 검증 실행
    validateField('email')
    validateField('password')
    validateField('passwordConfirm')
    validateField('name')
    validateField('mobile')
    validateField('phone')
    validateField('address')

    // 에러가 있는지 확인
    const hasErrors = Object.values(errors.value).some(error => error !== null)
    return !hasErrors
}



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
        errors.value.address = ''; // 에러 메시지 제거
        
        // 콘솔에 로그 출력 (디버깅용)
        console.log('주소 검색 결과:', data);
      }
    }).open();
  } else {
    alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
  }
}

const showTerms = (type) => {
    const termsContent = {
        privacy: '개인정보수집 및 이용에 관한 안내 내용...',
        policy: '개인정보 취급위탁 내용...',
        service: '이용약관 내용...'
    }

    alert(termsContent[type])
}

const toggleAllTerms = () => {
    if (agreeAll.value) {
        formData.agreePrivacy = true
        formData.agreePolicy = true
        formData.agreeService = true
    } else {
        formData.agreePrivacy = false
        formData.agreePolicy = false
        formData.agreeService = false
    }
}

const handleCancel = () => {
    if (confirm('회원가입을 취소하시겠습니까?')) {
        router.push('/')
    }
}

const handleSubmit = async () => {
    // 전체 폼 검증
    const isValid = validateForm()
    
    if (!isValid) {
        alert('입력 정보를 다시 확인해주세요.')
        return
    }

    // 필수 약관 동의 확인
    if (!formData.agreePrivacy || !formData.agreePolicy || !formData.agreeService) {
        alert('필수 약관에 모두 동의해주세요.')
        return
    }

    // Supabase User 테이블 형식에 맞게 데이터 변환 (비밀번호 제외)
    const userData = {
        name: formData.name.trim(),
        phone_number: formData.phone ? formData.phone.trim() : null,
        mobile_number: formData.mobile.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address1.trim(),
        address_detail: formData.address2.trim(),
        postal_code: formData.zipcode.trim(),
        receive_sms: formData.smsReceive === 'Y',
        agree_terms: true
    }

    const email = formData.email.trim().toLowerCase()
    const password = formData.password

    console.log('전송할 데이터:', userData)

    try {
        const result = await authService.signUp(email, password, userData)
        
        if (result.success) {
            alert('✅ 회원가입이 완료되었습니다!\n이메일 인증을 완료해주세요.')
            router.push('/')
        } else {
            alert(`회원가입 실패: ${result.message}`)
        }
    } catch (error) {
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`)
    }
}



// 개별 약관 동의 상태 감시 (전체 동의 체크박스 자동 업데이트)
watch([() => formData.agreePrivacy, () => formData.agreePolicy, () => formData.agreeService], () => {
    agreeAll.value = formData.agreePrivacy && formData.agreePolicy && formData.agreeService
})

// 실시간 validation을 위한 watch
watch(() => formData.email, () => {
    if (fieldTouched.value.email) {
        validateField('email')
    }
})

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

watch(() => formData.name, () => {
    if (fieldTouched.value.name) {
        validateField('name')
    }
})

// 휴대전화번호 실시간 감시
watch(() => formData.mobile, () => {
    if (fieldTouched.value.mobile) {
        validateField('mobile')
    }
})

// 전화번호 실시간 감시
watch(() => formData.phone, () => {
    if (fieldTouched.value.phone) {
        validateField('phone')
    }
})
</script>

<style scoped>

/* 전체 레이아웃 */
.join-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

.container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 메인 컨텐츠 */
.main-content {
    min-height: calc(100vh - 200px);
    padding: 3.5rem 0 2rem 0;
}

/* 페이지 헤더 */
.page-header {
    text-align: center;
    margin-bottom: 2rem;
}



.page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
}

.join-form {
    padding: 0;
}

.form-section {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--primary-color);
}

.required-notice {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 500;
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

/* 체크박스 */
.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    gap: 0.5rem;
}

.checkbox-input {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-right: 0;
}

.checkbox-text {
    font-size: 0.9rem;
    color: var(--text-primary);
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.checkbox-text .required-mark {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 0.8rem;
}

/* 약관 섹션 */
.terms-section {
    background: white;
    border-radius: var(--border-radius);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
}

.terms-container {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.terms-all-agree {
    background: var(--bg-light);
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.all-agree-label {
    font-weight: 500;
    font-size: 1rem;
}

.terms-list {
    background: white;
}

.terms-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
}

.terms-item:last-child {
    border-bottom: none;
}

.terms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
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

.btn-terms {
    background: white;
    color: var(--text-secondary);
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    font-weight: 500;
    
}

.btn-terms:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
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

    /* 약관 섹션 */
    .terms-section {
        padding: 1rem;
    }

    .terms-header {
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
    }

    .btn-terms {
        width: auto;
        padding: 0.5rem 0.25rem;
        font-size: 0.75rem;
        text-align: center;
        min-width: 60px;
        flex-shrink: 0;
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

    .checkbox-label,
    .radio-label {
        font-size: 0.85rem;
    }

    .checkbox-text {
        font-size: 0.85rem;
    }

    .field-notice {
        font-size: 0.75rem;
        line-height: 1.4;
    }

    .terms-section {
        padding: 0.75rem;
    }

    .terms-all-agree {
        padding: 0.75rem;
    }

    .terms-item {
        padding: 0.5rem 0.75rem;
    }

    .btn-check,
    .btn-terms {
        padding: 0.5rem 0.25rem;
        font-size: 0.75rem;
    }

    .form-actions {
        padding: 0.75rem 0;
    }
}
</style>

