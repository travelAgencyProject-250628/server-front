<template>
    <div class="join-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">회원가입</h1>
                </div>

                <!-- 회원가입 폼 -->
                <div class="join-form-wrapper">
                    <form @submit.prevent="handleSubmit" class="join-form">
                        <!-- 기본 회원정보 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                기본회원정보
                                <span class="required-mark">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    아이디
                                </label>
                                <div class="form-input-group">
                                    <div class="id-row">
                                        <input type="text" v-model="formData.userId" class="form-input"
                                            placeholder="아이디를 입력하세요" :class="{ error: errors.userId }" required>
                                        <button type="button" class="btn-check" @click="checkIdDuplicate">중복확인</button>
                                    </div>
                                </div>
                                <div v-if="errors.userId" class="error-message">{{ errors.userId }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    비밀번호
                                </label>
                                <div class="form-input-group">
                                    <input type="password" v-model="formData.password" class="form-input"
                                        placeholder="비밀번호를 입력하세요" :class="{ error: errors.password }" required>
                                </div>
                                <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    비밀번호 확인
                                </label>
                                <div class="form-input-group">
                                    <input type="password" v-model="formData.passwordConfirm" class="form-input"
                                        placeholder="비밀번호를 다시 입력하세요" :class="{ error: errors.passwordConfirm }"
                                        required>
                                </div>
                                <div v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}
                                </div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    성명
                                </label>
                                <div class="form-input-group">
                                    <input type="text" v-model="formData.name" class="form-input"
                                        placeholder="성명을 입력하세요" :class="{ error: errors.name }" required>
                                </div>
                                <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label">
                                    <span class="required-icon-placeholder"></span>
                                    전화번호
                                </label>
                                <div class="form-input-group phone-group">
                                    <input type="text" v-model="formData.phone1" class="form-input phone-input"
                                        placeholder="02" maxlength="3">
                                    <span class="phone-dash">-</span>
                                    <input type="text" v-model="formData.phone2" class="form-input phone-input"
                                        placeholder="0000" maxlength="4">
                                    <span class="phone-dash">-</span>
                                    <input type="text" v-model="formData.phone3" class="form-input phone-input"
                                        placeholder="0000" maxlength="4">
                                </div>
                                <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    휴대전화번호
                                </label>
                                <div class="form-input-group phone-group">
                                    <input type="text" v-model="formData.mobile1" class="form-input phone-input"
                                        placeholder="010" maxlength="3">
                                    <span class="phone-dash">-</span>
                                    <input type="text" v-model="formData.mobile2" class="form-input phone-input"
                                        placeholder="0000" maxlength="4">
                                    <span class="phone-dash">-</span>
                                    <input type="text" v-model="formData.mobile3" class="form-input phone-input"
                                        placeholder="0000" maxlength="4">
                                </div>
                                <div v-if="errors.mobile" class="error-message">{{ errors.mobile }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    E-Mail주소
                                </label>
                                <div class="form-input-group">
                                    <input type="email" v-model="formData.email" class="form-input"
                                        placeholder="이메일 주소를 입력하세요" :class="{ error: errors.email }" required>
                                </div>
                                <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                            </div>

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    주소
                                </label>
                                <div class="form-input-group address-group">
                                    <div class="address-row">
                                        <input type="text" v-model="formData.zipcode" class="form-input zipcode-input"
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

                            <div class="form-row">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    SMS 수신여부
                                </label>
                                <div class="form-input-group">
                                    <div class="radio-group">
                                        <label class="radio-label">
                                            <input type="radio" v-model="formData.smsReceive" value="Y"
                                                class="radio-input">
                                            <span class="radio-text">수신에 동의합니다</span>
                                        </label>
                                        <label class="radio-label">
                                            <input type="radio" v-model="formData.smsReceive" value="N"
                                                class="radio-input">
                                            <span class="radio-text">수신에 동의하지않습니다</span>
                                        </label>
                                    </div>
                                    <p class="sms-info">
                                        * 수신동의시 신상품 및 할인상품정보 (SMS)받아드립니다
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 약관동의 -->
                        <div class="form-section terms-section">
                            <h2 class="section-title">약관동의</h2>

                            <div class="terms-section">
                                <!-- 전체 동의 -->
                                <div class="terms-all-agree">
                                    <label class="checkbox-label all-agree-label">
                                        <input type="checkbox" v-model="agreeAll" @change="toggleAllTerms"
                                            class="checkbox-input">
                                        <span class="checkbox-text">모든 내용에 동의합니다.</span>
                                    </label>
                                </div>

                                <!-- 개별 약관 항목들 -->
                                <div class="terms-item">
                                    <div class="terms-header">
                                        <label class="checkbox-label">
                                            <input type="checkbox" v-model="formData.agreePrivacy"
                                                class="checkbox-input" required>
                                            <span class="checkbox-text">
                                                <span class="required-mark">[필수]</span>
                                                개인정보수집 및 이용에 관한 안내에 동의합니다.
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
                                                개인정보 취급위탁 내용에 동의합니다.
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
                                                이용약관 내용에 동의합니다.
                                            </span>
                                        </label>
                                        <button type="button" class="btn-terms"
                                            @click="showTerms('service')">약관보기</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 제출 버튼 -->
                        <div class="form-actions">
                            <button type="submit" class="btn-submit">회원가입</button>
                            <button type="button" class="btn-cancel" @click="handleCancel">취소하기</button>
                        </div>
                    </form>
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
/* CSS 변수 정의 (index.vue와 동일) */
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
    line-height: 1.6;
    color: var(--text-primary);
}

.container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 헤더 스타일 - Header 컴포넌트로 이동 */

.btn-primary,
.btn-secondary,
.btn-check,
.btn-terms,
.btn-submit,
.btn-cancel {
    border: none;
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background: var(--bg-light);
}

/* 모바일 메뉴 - Header 컴포넌트로 이동 */

/* 메인 컨텐츠 */
.main-content {
    min-height: calc(100vh - 200px);
    padding: 2rem 0;
}

/* 페이지 헤더 */
.page-header {
    text-align: center;
    margin-bottom: 1rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.1rem;
}

/* 회원가입 폼 */
.join-form-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.join-form {
    padding: 2rem;
}

.form-section {
    margin-bottom: 3rem;
}

.form-section:last-child {
    margin-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
}

.terms-section .section-title {
    margin-bottom: 0;
}

.required-mark {
    color: var(--text-primary);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 1.0rem;
    font-weight: 600;
    margin-right: 0.5rem;
}

/* 폼 필드 */
.form-row {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: flex-start;
}

.form-label {
    min-width: 150px;
    padding: 0.75rem 1rem 0.75rem 0;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 1.0rem;
}

.form-label.required {
    color: #333;
}

.required-icon {
    color: #2563eb;
    font-weight: bold;
    margin-right: 0.3rem;
    font-size: 1rem;
}

.optional-text {
    color: #666;
    font-size: 0.9rem;
    font-weight: normal;
    margin-left: 0.5rem;
}

.required-icon-placeholder {
    width: 1rem;
    display: inline-block;
}

.form-input-group {
    flex: 1;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    background-color: #f5f5f5;
    color: var(--text-primary);
    transition: var(--transition);
}

.form-input:focus {
    outline: none;
    background-color: #eeeeee;
    box-shadow: none;
}

.form-input.error {
    background-color: #ffe6e6;
    border: 1px solid var(--error-color);
}

.form-input[readonly] {
    background-color: #f0f0f0;
    color: #999999;
}

.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
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
    gap: 0.9rem;
}

.id-row, .address-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.zipcode-input {
    flex: 1;
}

/* 라디오 버튼 */
.radio-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
}

.radio-input {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
}

.radio-text {
    font-size: 0.9rem;
    color: var(--text-primary);
}

.sms-info {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0;
}

/* 체크박스 */
.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
}

.checkbox-input {
    margin-right: 0.7rem;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.checkbox-text {
    font-size: 1rem;
    color: var(--text-primary);
    line-height: 1.4;
}

.checkbox-text .required-mark {
    background: none;
    color: #2563eb;
    padding: 0;
    border-radius: 0;
    font-size: 1rem;
    font-weight: 600;
    margin-right: 0.3rem;
}

/* 약관 섹션 */

.terms-all-agree {
    background: #f5f5f5;
    padding: 1.2rem;
    margin: 0;
}

.all-agree-label {
    font-weight: 500;
    font-size: 1rem;
    margin: 0;
}

.all-agree-label .checkbox-text {
    color: var(--text-primary);
}

.terms-item {
    background: white;
    padding: 0.5rem 2rem;

}

.terms-item:last-child {
    border-bottom: none;
}

.terms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.btn-check {
    background: #a0a0a0;
    color: white;
    padding: 0.7rem 1rem;
    font-size: 0.875rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    line-height: 1.5;
}

.btn-check:hover {
    background: #888888;
}

.btn-terms {
    background: white;
    color: black;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border: 1px solid rgb(180, 180, 180, 0.5);
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    line-height: 1.2;
    font-weight: 500;
    min-width: 60px;
}

.btn-terms:hover {
    border: 1px solid #888888;
}

/* 제출 버튼 */
.form-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
}

.btn-submit {
    background: #2563eb;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 120px;
}

.btn-cancel {
    background: #6b7280;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    min-width: 120px;
    border: none;
}


/* 반응형 디자인 */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }

    .form-row {
        flex-direction: column;
    }

    .form-label {
        min-width: auto;
        margin-bottom: 0.5rem;
    }

    .phone-group {
        flex-wrap: wrap;
    }

    .radio-group {
        flex-direction: column;
        gap: 0.5rem;
    }

    .terms-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .container {
        padding: 0 15px;
    }

    .join-form {
        padding: 1.5rem;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.75rem;
    }

    .btn-submit {
        width: 100%;
        padding: 1rem;
    }

    .address-row {
        flex-direction: column;
    }

    .form-actions {
        flex-direction: column;
        align-items: center;
    }

    .btn-submit,
    .btn-cancel {
        width: 100%;
        max-width: 250px;
    }
}
</style>

