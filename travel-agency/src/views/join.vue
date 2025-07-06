<template>
    <div class="join-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">회원가입</h1>
                    <p class="page-subtitle">굿모닝투어와 함께 특별한 여행을 시작하세요</p>
                </div>

                <!-- 회원가입 폼 -->
                <div class="join-form-wrapper">
                    <form @submit.prevent="handleSubmit" class="join-form">
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
                                        placeholder="성명을 입력하세요" :class="{ error: errors.name }" required>
                                    <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        아이디
                                    </label>
                                    <div class="input-with-button">
                                        <input type="text" v-model="formData.userId" class="form-input"
                                            placeholder="아이디를 입력하세요" :class="{ error: errors.userId }" required>
                                        <button type="button" class="btn-check" @click="checkIdDuplicate">중복확인</button>
                                    </div>
                                    <div v-if="errors.userId" class="error-message">{{ errors.userId }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        비밀번호
                                    </label>
                                    <input type="password" v-model="formData.password" class="form-input"
                                        placeholder="비밀번호를 입력하세요" :class="{ error: errors.password }" required>
                                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        비밀번호 확인
                                    </label>
                                    <input type="password" v-model="formData.passwordConfirm" class="form-input"
                                        placeholder="비밀번호를 다시 입력하세요" :class="{ error: errors.passwordConfirm }"
                                        required>
                                    <div v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}
                                    </div>
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
                                            개인정보수집 및 이용에 관한 안내에 동의
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
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// 라우터 사용
const router = useRouter()

// 반응형 데이터
const idDuplicateChecked = ref(false)
const errors = ref({})
const agreeAll = ref(false)

// 폼 데이터 (reactive로 객체 전체를 반응형으로 관리)
const formData = reactive({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    mobile1: '010',
    mobile2: '',
    mobile3: '',
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

// 메서드들
const validateForm = () => {
    errors.value = {}

    // 아이디 검증
    if (!formData.userId) {
        errors.value.userId = '아이디를 입력해주세요.'
    } else if (formData.userId.length < 4) {
        errors.value.userId = '아이디는 4글자 이상 입력해주세요.'
    } else if (!idDuplicateChecked.value) {
        errors.value.userId = '아이디 중복확인을 해주세요.'
    }

    // 비밀번호 검증
    if (!formData.password) {
        errors.value.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 6) {
        errors.value.password = '비밀번호는 6글자 이상 입력해주세요.'
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
        errors.value.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.passwordConfirm) {
        errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검증
    if (!formData.name) {
        errors.value.name = '성명을 입력해주세요.'
    }

    // 전화번호 검증 (선택사항이므로 입력된 경우에만 검증)
    if (formData.phone1 || formData.phone2 || formData.phone3) {
        if (!formData.phone1 || !formData.phone2 || !formData.phone3) {
            errors.value.phone = '전화번호를 입력하시려면 모두 입력해주세요.'
        }
    }

    // 휴대전화번호 검증
    if (!formData.mobile1 || !formData.mobile2 || !formData.mobile3) {
        errors.value.mobile = '휴대전화번호를 모두 입력해주세요.'
    }

    // 이메일 검증
    if (!formData.email) {
        errors.value.email = '이메일 주소를 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.value.email = '올바른 이메일 주소를 입력해주세요.'
    }

    // 주소 검증
    if (!formData.zipcode || !formData.address1) {
        errors.value.address = '주소를 입력해주세요.'
    }

    return Object.keys(errors.value).length === 0
}

const checkIdDuplicate = async () => {
    if (!formData.userId) {
        alert('아이디를 입력해주세요.')
        return
    }

    if (formData.userId.length < 4) {
        alert('아이디는 4글자 이상 입력해주세요.')
        return
    }

    try {
        const result = await authStore.checkUserIdExists(formData.userId)
        
        if (result.exists) {
            alert('이미 사용중인 아이디입니다.')
            idDuplicateChecked.value = false
        } else {
            alert('사용 가능한 아이디입니다.')
            idDuplicateChecked.value = true
            errors.value.userId = ''
        }
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error)
        alert('아이디 중복 확인 중 오류가 발생했습니다.')
        idDuplicateChecked.value = false
    }
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
    if (!validateForm()) {
        alert('입력 정보를 확인해주세요.')
        return
    }

    // 필수 약관 동의 확인
    if (!formData.agreePrivacy || !formData.agreePolicy || !formData.agreeService) {
        alert('필수 약관에 모두 동의해주세요.')
        return
    }

    // Supabase User 테이블 형식에 맞게 데이터 변환 (비밀번호 제외)
    const userData = {
        user_id: formData.userId.trim(),
        name: formData.name.trim(),
        phone_number: (formData.phone1 && formData.phone2 && formData.phone3) 
            ? `${formData.phone1}-${formData.phone2}-${formData.phone3}` 
            : null,
        mobile_number: `${formData.mobile1}-${formData.mobile2}-${formData.mobile3}`,
        email: formData.email.trim().toLowerCase(),
        address: formData.address1.trim(),
        address_detail: formData.address2.trim(),
        postal_code: formData.zipcode.trim(),
        receive_sms: formData.smsReceive === 'Y',
        agree_terms: true
    }

    // Auth용 데이터 (이메일, 비밀번호만)
    const authData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
    }

    console.log('전송할 데이터:', userData)

    try {
        const result = await authStore.signUp(userData, authData)
        
        if (result.success) {
            if (result.autoLogin) {
                alert('회원가입이 완료되었습니다! 자동으로 로그인되었습니다.')
                router.push('/')
            } else {
                if (result.loginError) {
                    alert(`회원가입이 완료되었습니다! 자동 로그인에 실패했습니다: ${result.loginError}\n로그인 페이지에서 직접 로그인해주세요.`)
                } else {
                    alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
                }
                router.push('/login')
            }
        } else {
            alert(`회원가입 실패: ${result.message}`)
        }
    } catch (error) {
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`)
    }
}

// 아이디 변경 감시 (watch 사용)
watch(() => formData.userId, () => {
    idDuplicateChecked.value = false
})

// 개별 약관 동의 상태 감시 (전체 동의 체크박스 자동 업데이트)
watch([() => formData.agreePrivacy, () => formData.agreePolicy, () => formData.agreeService], () => {
    agreeAll.value = formData.agreePrivacy && formData.agreePolicy && formData.agreeService
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
.join-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--bg-light);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 메인 컨텐츠 */
.main-content {
    padding: 1.5rem 0;
}

/* 페이지 헤더 */
.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
}

/* 회원가입 폼 */
.join-form-wrapper {
    /* 배경 제거 - 개별 섹션들이 각자 배경을 가짐 */
}

.join-form {
    padding: 0;
}

.form-section {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

.required-notice {
    color: var(--text-secondary);
    font-size: 0.875rem;
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

/* 체크박스 */
.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.95rem;
    gap: 0.5rem;
}

.checkbox-input {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.checkbox-text {
    color: var(--text-primary);
    line-height: 1.4;
}

.checkbox-text .required-mark {
    color: var(--primary-color);
    font-weight: 600;
    margin-right: 0.25rem;
}

/* 약관 섹션 */
.terms-section {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
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
    padding: 0.5rem 0.75rem;
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

    /* 약관 섹션 */
    .terms-section {
        padding: 1rem;
    }

    .terms-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .btn-terms {
        width: 100%;
        padding: 0.75rem;
        font-size: 0.9rem;
        text-align: center;
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

    .checkbox-label,
    .radio-label {
        font-size: 0.9rem;
    }

    .field-notice {
        font-size: 0.8rem;
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
        padding: 0.75rem;
        font-size: 0.9rem;
    }

    .form-actions {
        padding: 0.75rem 0;
    }
}
</style>

