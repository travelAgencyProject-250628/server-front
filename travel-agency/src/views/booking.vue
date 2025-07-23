<!-- 여행 예약 페이지 -->
<template>
    <div class="booking-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">여행 예약하기</h1>
                    <p class="page-subtitle">나라투어와 함께 특별한 여행을 시작하세요</p>
                </div>
                
                <!-- 로딩 인디케이터 -->
                <div v-if="isLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>상품 정보를 불러오는 중...</p>
                </div>
                
                <!-- 메인 컨텐츠 -->
                <div v-else>
        
        <!-- 상품 정보 요약 -->
        <div class="product-summary-box">
            <div class="summary-item">
                <span class="summary-label">예약상품명</span>
                <span class="summary-value">{{ product.title }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">여행기간</span>
                <span class="summary-value">{{ product.duration }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">출발일</span>
                <span class="summary-value">{{ product.travelDate }}</span>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="booking-form" novalidate>
            <!-- 예약자 정보 -->
            <section class="form-section">
                <h2>예약자 정보
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="bookerName" class="form-label required">
                            <span class="required-icon">⦁</span>
                            예약자 이름
                        </label>
                        <input type="text" id="bookerName" v-model="formData.bookerName" 
                               :class="{ 'error': validationErrors.bookerName }" required>
                        <span v-if="validationErrors.bookerName" class="error-message">{{ validationErrors.bookerName }}</span>
                    </div>
                    <div class="form-group">
                        <label for="bookerPhone" class="form-label required">
                            <span class="required-icon">⦁</span>
                            휴대폰 번호
                        </label>
                        <input type="tel" id="bookerPhone" v-model="formData.bookerPhone" 
                               placeholder="010-1234-5678" 
                               :class="{ 'error': validationErrors.bookerPhone }" required>
                        <span v-if="validationErrors.bookerPhone" class="error-message">{{ validationErrors.bookerPhone }}</span>
                    </div>
                    <div class="form-group">
                        <label for="bookerEmail" class="form-label required">
                            <span class="required-icon">⦁</span>
                            이메일
                        </label>
                        <input type="email" id="bookerEmail" v-model="formData.bookerEmail" 
                               placeholder="example@email.com" 
                               :class="{ 'error': validationErrors.bookerEmail }" required>
                        <span v-if="validationErrors.bookerEmail" class="error-message">{{ validationErrors.bookerEmail }}</span>
                    </div>
                    <div class="form-group">
                        <label for="emergencyContact" class="form-label">비상연락처</label>
                        <input type="tel" id="emergencyContact" v-model="formData.emergencyContact" 
                               placeholder="비상시 연락 가능한 번호"
                               :class="{ 'error': validationErrors.emergencyContact }">
                        <span v-if="validationErrors.emergencyContact" class="error-message">{{ validationErrors.emergencyContact }}</span>
                    </div>
                </div>
            </section>

            <!-- 출발지역 선택 -->
            <section class="form-section">
                <h2>출발지역 
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                <div class="departure-options-simple">
                    <label v-for="location in departureLocations" :key="location.id" class="departure-radio">
                        <input type="radio" 
                               name="departureLocation"
                               :value="location.id"
                               v-model="formData.departureLocation">
                        <span class="radio-text">
                            {{ location.name }}
                            <span class="departure-time">{{ formatTime(location.time) }}</span>
                        </span>
                    </label>
                </div>
            </section>

            <!-- 인원 선택 -->
            <section class="form-section">
                <h2>인원 선택 
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                <div class="people-selection">
                    <div class="people-counter-grid">
                        <div class="counter-group">
                            <div class="counter-header">
                                <label>대인 (만 13세 이상)</label>
                                <span class="price">{{ formatPrice(product.adultPrice) }}원</span>
                            </div>
                            <div class="counter">
                                <button type="button" @click="decreaseCount('adult')" 
                                        :disabled="formData.adultCount <= 0">-</button>
                                <span class="count">{{ formData.adultCount }}</span>
                                <button type="button" @click="increaseCount('adult')">+</button>
                            </div>
                        </div>
                        <div class="counter-group">
                            <div class="counter-header">
                                <label>소인 (만 12세 이하)</label>
                                <span class="price">{{ formatPrice(product.childPrice) }}원</span>
                            </div>
                            <div class="counter">
                                <button type="button" @click="decreaseCount('child')" 
                                        :disabled="formData.childCount <= 0">-</button>
                                <span class="count">{{ formData.childCount }}</span>
                                <button type="button" @click="increaseCount('child')">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="total-calculation">
                        <div class="calculation-row">
                            <span>대인 {{ formData.adultCount }}명</span>
                            <span>{{ formatPrice(formData.adultCount * product.adultPrice) }}원</span>
                        </div>
                        <div class="calculation-row">
                            <span>소인 {{ formData.childCount }}명</span>
                            <span>{{ formatPrice(formData.childCount * product.childPrice) }}원</span>
                        </div>
                        <div class="total-price">
                            <span>총 결제금액</span>
                            <strong>{{ formatPrice(totalPrice) }}원</strong>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 여행자 정보 -->
            <section class="form-section" v-if="totalTravelers > 0">
                <h2>실제여행자정보
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                <div class="traveler-info">
                    <div class="info-notice">
                        <p>※ 여행자 정보는 여행자보험 가입 및 예약 확인을 위해 필요합니다.</p>
                        <p>※ 총 {{ totalTravelers }}명의 여행자 정보를 입력해 주세요.</p>
                    </div>
                    
                    <div class="form-group traveler-info-checkbox">
                        <label>
                            <input type="checkbox" v-model="formData.bookerIsIncluded" @change="handleBookerIncluded">
                            예약자도 여행에 참여합니다
                        </label>
                    </div>

                    <div class="travelers-table">
                        <table class="traveler-info-table">
                            <thead>
                                <tr>
                                    <th class="traveler-number">번호</th>
                                    <th class="traveler-name">이름</th>
                                    <th class="traveler-contact">연락처</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(traveler, index) in formData.travelers" :key="traveler.id" class="traveler-row">
                                    <td class="traveler-number-cell">
                                        {{ index + 1 }}
                                        <span class="traveler-type">({{ traveler.type === 'adult' ? '대인' : '소인' }})</span>
                                        <span v-if="formData.bookerIsIncluded && index === 0" class="booker-badge">예약자</span>
                                    </td>
                                    <td class="traveler-name-cell">
                                        <input 
                                            type="text" 
                                            :id="`traveler-name-${index}`"
                                            v-model="traveler.name"
                                            :placeholder="formData.bookerIsIncluded && index === 0 ? '예약자 이름' : '이름'"
                                            :readonly="formData.bookerIsIncluded && index === 0"
                                            :class="{ 'table-input': true, 'error': validationErrors.travelers[index]?.name }"
                                            required>
                                    </td>
                                    <td class="traveler-contact-cell">
                                        <input 
                                            type="tel" 
                                            :id="`traveler-phone-${index}`"
                                            v-model="traveler.phone"
                                            :placeholder="formData.bookerIsIncluded && index === 0 ? '예약자 연락처' : '연락처'"
                                            :readonly="formData.bookerIsIncluded && index === 0"
                                            :class="{ 'table-input': true, 'error': validationErrors.travelers[index]?.phone }"
                                            required>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- 결제 정보 -->
            <section class="form-section">
                <h2>결제 정보
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                <div class="payment-info">
                    <div class="payment-details">
                        <div class="payment-row">
                            <span class="payment-label">결제 방법</span>
                            <span class="payment-value"><span class="highlight">무통장 입금</span></span>
                        </div>
                        <div class="payment-row">
                            <span class="payment-label">입금 계좌</span>
                            <span class="payment-value">국민은행 123456-78-901234 (예금주: 나라투어)</span>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="payerName" class="form-label required">
                                <span class="required-icon">⦁</span>
                                입금자명
                            </label>
                            <input type="text" id="payerName" v-model="formData.payerName" 
                                   placeholder="입금하실 분의 성함을 입력하세요" 
                                   :class="{ 'error': validationErrors.payerName }" required>
                            <span v-if="validationErrors.payerName" class="error-message">{{ validationErrors.payerName }}</span>
                        </div>
                        <div class="form-group full-width">
                            <label for="customerRequest" class="form-label">고객 요청사항</label>
                            <textarea id="customerRequest" v-model="formData.customerRequest" 
                                    rows="4"></textarea>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 약관 동의 -->
            <section class="form-section terms-section">
                <h2>약관 동의 
                    <span class="required-notice">
                        <span class="required-icon">⦁</span>
                        필수항목
                    </span>
                </h2>
                
                <div class="terms-container">
                    <!-- 전체 동의 -->
                    <div class="terms-all-agree">
                        <label class="checkbox-label all-agree-label">
                            <input type="checkbox" v-model="formData.agreeAll" @change="handleAgreeAll" class="checkbox-input">
                            <span class="checkbox-text">모든 내용에 동의</span>
                        </label>
                    </div>

                    <!-- 개별 약관 항목들 -->
                    <div class="terms-list">
                        <div v-for="(term, index) in terms" :key="index" class="terms-item">
                            <div class="terms-header">
                                <label class="checkbox-label">
                                    <input type="checkbox" 
                                           v-model="formData.agreements[index]" 
                                           @change="handleIndividualAgree"
                                           class="checkbox-input">
                                    <span class="checkbox-text">
                                        <span v-if="term.required" class="required-mark">[필수]</span>
                                        <span v-else class="optional-mark">[선택]</span>
                                        {{ term.title }}
                                    </span>
                                </label>
                                <button type="button" class="btn-terms" @click="viewTerms(term.id)">약관보기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 예약 확인 -->
            <section class="form-section booking-summary">
                <h2>예약 확인</h2>
                <div class="summary-content">
                    <div class="summary-row">
                        <span>상품명</span>
                        <span>{{ product.title }}</span>
                    </div>
                    <div class="summary-row">
                        <span>여행일자</span>
                        <span>{{ product.travelDate }}</span>
                    </div>
                    <div class="summary-row">
                        <span>출발지역</span>
                        <span>{{ getSelectedDepartureLocation() }}</span>
                    </div>
                    <div class="summary-row">
                        <span>인원</span>
                        <span>대인 {{ formData.adultCount }}명, 소인 {{ formData.childCount }}명</span>
                    </div>
                    <div class="summary-row total">
                        <span>총 결제금액</span>
                        <strong>{{ formatPrice(totalPrice) }}원</strong>
                    </div>
                </div>
            </section>

            <!-- 예약하기 버튼 -->
            <div class="submit-section">
                <p class="submit-notice">
                    위 내용을 확인하였으며, 예약 신청에 동의합니다.
                </p>
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                    {{ isSubmitting ? '예약 처리 중...' : '예약 신청하기' }}
                </button>
            </div>
        </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '../lib/products.js'
import { getProductStartingPoints } from '../lib/startingpoints.js'
import { createReservation } from '../lib/reservations.js'
import { authService } from '../lib/auth.js'

const route = useRoute()
const router = useRouter()

// === 상태 관리 ===
const isLoading = ref(true)
const isSubmitting = ref(false)
const product = ref({})
const departureLocations = ref([])

// === Validation 상태 ===
const validationErrors = ref({
    bookerName: '',
    bookerPhone: '',
    bookerEmail: '',
    emergencyContact: '',
    payerName: '',
    travelers: {}
})

// === Validation 패턴 ===
const validationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^010-\d{4}-\d{4}$/,
    name: /^[가-힣a-zA-Z]{2,10}$/
}

// 약관 데이터
const terms = [
    { id: 1, title: '여행약관 동의', required: true },
    { id: 2, title: '개인정보 수집 및 이용 동의', required: true },
    { id: 3, title: '개인정보 제3자 제공 동의', required: true },
    { id: 4, title: '여행자보험 가입 동의', required: true },
    { id: 5, title: '마케팅 활용 동의', required: false },
]

// 폼 데이터
const formData = ref({
    bookerName: '',
    bookerPhone: '',
    bookerEmail: '',
    emergencyContact: '',
    bookerIsIncluded: false,
    travelers: [],
    departureLocation: '',
    adultCount: 0,
    childCount: 0,
    payerName: '',
    customerRequest: '',
    agreeAll: false,
    agreements: new Array(terms.length).fill(false),
})

// === Validation 함수들 ===
const validateField = (field, value) => {
    if (!value) {
        // 선택 항목은 빈 값 허용
        return field === 'emergencyContact' ? '' : '필수 항목입니다'
    }
    
    const validationMap = {
        bookerName: { pattern: validationPatterns.name, message: '한글/영문 2-10자로 입력해주세요' },
        payerName: { pattern: validationPatterns.name, message: '한글/영문 2-10자로 입력해주세요' },
        bookerEmail: { pattern: validationPatterns.email, message: '올바른 이메일 형식으로 입력해주세요' },
        bookerPhone: { pattern: validationPatterns.phone, message: '010-0000-0000 형식으로 입력해주세요' },
        emergencyContact: { pattern: validationPatterns.phone, message: '010-0000-0000 형식으로 입력해주세요' }
    }
    
    const validation = validationMap[field]
    return validation && !validation.pattern.test(value) ? validation.message : ''
}

const validateTraveler = (traveler) => {
    const errors = {}
    if (!traveler.name) {
        errors.name = '필수 항목입니다'
    } else if (!validationPatterns.name.test(traveler.name)) {
        errors.name = '한글/영문 2-10자로 입력해주세요'
    }
    
    if (!traveler.phone) {
        errors.phone = '필수 항목입니다'
    } else if (!validationPatterns.phone.test(traveler.phone)) {
        errors.phone = '010-0000-0000 형식으로 입력해주세요'
    }
    
    return errors
}

const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

// === 계산된 값들 ===
const totalPrice = computed(() => {
    return (formData.value.adultCount * product.value.adultPrice) +
           (formData.value.childCount * product.value.childPrice)
})

const totalTravelers = computed(() => {
    return formData.value.adultCount + formData.value.childCount
})

const isFormValid = computed(() => {
    // 필수 필드 검증
    const bookerFieldsValid = [
        'bookerName', 'bookerPhone', 'bookerEmail', 'payerName'
    ].every(field => {
        const value = formData.value[field]
        const error = validateField(field, value)
        return value && !error
    })
    
    // 비상연락처 검증 (선택사항이지만 입력시 형식 검증)
    const emergencyContactValid = !formData.value.emergencyContact || 
        !validateField('emergencyContact', formData.value.emergencyContact)
    
    // 출발지역 선택 검증
    const departureValid = !!formData.value.departureLocation
    
    // 인원 선택 검증
    const peopleCountValid = formData.value.adultCount > 0 || formData.value.childCount > 0
    
    // 여행자 정보 검증
    const travelerInfoValid = formData.value.travelers.length > 0 && 
        formData.value.travelers.every(traveler => {
            const errors = validateTraveler(traveler)
            return !errors.name && !errors.phone
        })
    
    // 약관 동의 검증
    const requiredAgreements = terms
        .filter(term => term.required)
        .every((term, index) => formData.value.agreements[index])
    
    // 모든 validation 에러가 없는지 확인
    const noValidationErrors = !Object.values(validationErrors.value).some(error => 
        typeof error === 'string' ? error : Object.values(error).some(e => e)
    )
    
    return bookerFieldsValid && emergencyContactValid && departureValid && 
           peopleCountValid && travelerInfoValid && requiredAgreements && noValidationErrors
})

// === 초기 데이터 로드 ===
const loadInitialData = async () => {
    try {
        const productId = route.query.productId
        if (!productId) {
            throw new Error('상품 ID가 필요합니다.')
        }

        const [productResult, startingPointsResult] = await Promise.all([
            getProductDetail(productId),
            getProductStartingPoints(productId)
        ])

        if (!productResult.success || !productResult.product) {
            throw new Error('상품 정보를 찾을 수 없습니다.')
        }

        // 상품 정보 설정
        const selectedDate = route.query.selectedDate
        const travelDate = selectedDate ? formatDateForDisplay(selectedDate) : ''
        
        product.value = {
            id: productResult.product.id,
            title: productResult.product.title,
            duration: productResult.product.travelDuration,
            travelDate: travelDate,
            productCode: productResult.product.productCode,
            adultPrice: productResult.product.adultPrice,
            childPrice: productResult.product.childPrice,
        }

        // 출발지역 설정
        departureLocations.value = startingPointsResult.success 
            ? startingPointsResult.startingPoints
            : []

        // 로그인된 사용자 정보 로드 및 폼에 미리 채우기
        await loadUserInfo()

    } catch (error) {
        console.error('데이터 로드 오류:', error)
        alert(error.message || '페이지 로드 중 오류가 발생했습니다.')
        router.push('/')
    } finally {
        isLoading.value = false
    }
}

// 로그인된 사용자 정보 로드 및 폼에 미리 채우기
const loadUserInfo = async () => {
    try {
        const userResult = await authService.getCurrentUser()
        
        if (userResult.success && userResult.user) {
            const user = userResult.user
            
            // 사용자 정보를 폼에 미리 채우기
            formData.value.bookerName = user.name || ''
            formData.value.bookerEmail = user.email || ''
            
            // 전화번호 처리 (mobile_number 또는 phone_number 중 사용 가능한 것)
            if (user.mobile_number) {
                formData.value.bookerPhone = user.mobile_number
            } else if (user.phone_number) {
                formData.value.bookerPhone = user.phone_number
            }
            

        }
    } catch (error) {
        console.error('사용자 정보 로드 오류:', error)
        // 사용자 정보 로드 실패는 예약 진행에 영향을 주지 않으므로 에러를 던지지 않음
    }
}



// === 폼 핸들러들 ===

const increaseCount = (type) => {
    if (type === 'adult') {
        formData.value.adultCount++
    } else {
        formData.value.childCount++
    }
    updateTravelersList()
}

const decreaseCount = (type) => {
    if (type === 'adult' && formData.value.adultCount > 0) {
        formData.value.adultCount--
    } else if (type === 'child' && formData.value.childCount > 0) {
        formData.value.childCount--
    }
    updateTravelersList()
}

// 여행자 목록 업데이트
const updateTravelersList = () => {
    const newTotal = totalTravelers.value
    const currentLength = formData.value.travelers.length
    
    // 완전히 새로운 배열 생성
    const newTravelers = []
    
         // 대인 먼저 추가
     for (let i = 0; i < formData.value.adultCount; i++) {
         const existingTraveler = formData.value.travelers[i]
         newTravelers.push({
             id: i + 1,
             name: existingTraveler?.name || '',
             phone: existingTraveler?.phone || '',
             type: 'adult'
         })
     }
     
     // 소인 추가
     for (let i = 0; i < formData.value.childCount; i++) {
         const existingTraveler = formData.value.travelers[formData.value.adultCount + i]
         newTravelers.push({
             id: formData.value.adultCount + i + 1,
             name: existingTraveler?.name || '',
             phone: existingTraveler?.phone || '',
             type: 'child'
         })
     }
    
    formData.value.travelers = newTravelers
}

// 예약자 포함 여부 처리
const handleBookerIncluded = () => {
    if (formData.value.bookerIsIncluded && formData.value.travelers.length > 0) {
        // 첫 번째 여행자를 예약자 정보로 채움
        formData.value.travelers[0].name = formData.value.bookerName
        formData.value.travelers[0].phone = formData.value.bookerPhone
    } else if (!formData.value.bookerIsIncluded && formData.value.travelers.length > 0) {
        // 첫 번째 여행자 정보 초기화
        formData.value.travelers[0].name = ''
        formData.value.travelers[0].phone = ''
    }
}

const handleAgreeAll = () => {
    formData.value.agreements = formData.value.agreements.map(() => formData.value.agreeAll)
}

const handleIndividualAgree = () => {
    formData.value.agreeAll = formData.value.agreements.every(agreed => agreed)
}

const viewTerms = (termId) => {
    alert(`약관 ${termId} 내용을 표시합니다. (실제로는 모달이나 새 창으로 표시)`)
}

// === 유틸리티 함수들 ===
const getSelectedDepartureLocation = () => {
    if (!formData.value.departureLocation) return '-'
    const location = departureLocations.value.find(loc => loc.id === formData.value.departureLocation)
    return location ? location.name : '-'
}

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '2025/08/01'
    // 'YYYY-MM-DD' 형식을 'YYYY/MM/DD' 형식으로 변환
    return dateString.replace(/-/g, '/')
}

const formatTime = (timeString) => {
    if (!timeString) return ''
    // 'HH:MM:SS' 형식을 'HH:MM' 형식으로 변환
    return timeString.substring(0, 5)
}

// === 예약 신청 처리 ===
const buildReservationData = () => {
    // 모든 여행자 정보를 JSON 배열로 변환
    const validTravelers = formData.value.travelers.filter(traveler => traveler.name && traveler.phone)
    const travelersName = validTravelers.map(traveler => traveler.name)
    const travelersPhone = validTravelers.map(traveler => traveler.phone)
    
    return {
        productId: product.value.id,
        bookerName: formData.value.bookerName,
        bookerPhone: formData.value.bookerPhone,
        bookerEmail: formData.value.bookerEmail,
        emergencyContact: formData.value.emergencyContact,
        depositorName: formData.value.payerName,
        adultCount: formData.value.adultCount,
        childCount: formData.value.childCount,
        startingPointId: formData.value.departureLocation,
        departureDate: product.value.travelDate.replace(/\//g, '-'),
        agreeTerms: formData.value.agreements.every(agreed => agreed),
        travelersName, // JSON 배열: ["이정원", "정용욱", "김민수"]
        travelersPhone, // JSON 배열: ["01044444444", "01066666666", "01055555555"]
        status: 'pending'
    }
}

const handleSubmit = async () => {
    if (isSubmitting.value) return
    
    // 제출 전 최종 validation 체크
    const validationMessages = []
    
    // 예약자 정보 검증
    const bookerFields = ['bookerName', 'bookerPhone', 'bookerEmail', 'payerName']
    bookerFields.forEach(field => {
        const error = validateField(field, formData.value[field])
        if (error) {
            const fieldNames = {
                bookerName: '예약자 이름',
                bookerPhone: '휴대폰 번호',
                bookerEmail: '이메일',
                payerName: '입금자명'
            }
            validationMessages.push(`• ${fieldNames[field]}: ${error}`)
        }
    })
    
    // 비상연락처 검증 (선택사항이지만 입력시 형식 검증)
    if (formData.value.emergencyContact) {
        const error = validateField('emergencyContact', formData.value.emergencyContact)
        if (error) {
            validationMessages.push(`• 비상연락처: ${error}`)
        }
    }
    
    // 출발지역 선택 검증
    if (!formData.value.departureLocation) {
        validationMessages.push('• 출발지역을 선택해주세요')
    }
    
    // 인원 선택 검증
    if (formData.value.adultCount === 0 && formData.value.childCount === 0) {
        validationMessages.push('• 대인 또는 소인을 1명 이상 선택해주세요')
    }
    
    // 여행자 정보 검증
    if (formData.value.travelers.length > 0) {
        formData.value.travelers.forEach((traveler, index) => {
            const errors = validateTraveler(traveler)
            if (errors.name) {
                validationMessages.push(`• ${index + 1}번 여행자 이름: ${errors.name}`)
            }
            if (errors.phone) {
                validationMessages.push(`• ${index + 1}번 여행자 연락처: ${errors.phone}`)
            }
        })
    }
    
    // 약관 동의 검증
    const requiredTerms = terms.filter(term => term.required)
    requiredTerms.forEach((term, index) => {
        if (!formData.value.agreements[index]) {
            validationMessages.push(`• ${term.title}에 동의해주세요`)
        }
    })
    
    // validation 에러가 있으면 상세 메시지 표시
    if (validationMessages.length > 0) {
        alert('다음 항목을 확인해주세요:\n\n' + validationMessages.join('\n'))
        return
    }
    
    try {
        isSubmitting.value = true
        const reservationData = buildReservationData()
        const result = await createReservation(reservationData)

        if (result.success) {
            alert('예약 신청이 완료되었습니다. 담당자가 확인 후 연락드리겠습니다.')
            router.push('/')
        } else {
            throw new Error(result.error || '예약 처리 중 오류가 발생했습니다.')
        }
    } catch (error) {
        console.error('예약 신청 오류:', error)
        alert(error.message)
    } finally {
        isSubmitting.value = false
    }
}

// === Watchers (실시간 검증) ===
watch(() => formData.value.bookerName, (newVal) => {
    validationErrors.value.bookerName = validateField('bookerName', newVal)
})

watch(() => formData.value.bookerPhone, (newVal) => {
    // 전화번호 자동 포맷팅
    formData.value.bookerPhone = formatPhoneNumber(newVal)
    validationErrors.value.bookerPhone = validateField('bookerPhone', formData.value.bookerPhone)
})

watch(() => formData.value.bookerEmail, (newVal) => {
    validationErrors.value.bookerEmail = validateField('bookerEmail', newVal)
})

watch(() => formData.value.emergencyContact, (newVal) => {
    // 비상연락처 자동 포맷팅
    formData.value.emergencyContact = formatPhoneNumber(newVal)
    validationErrors.value.emergencyContact = validateField('emergencyContact', formData.value.emergencyContact)
})

watch(() => formData.value.payerName, (newVal) => {
    validationErrors.value.payerName = validateField('payerName', newVal)
})

// 여행자 정보 실시간 검증 (에러 메시지는 표시 안함)
watch(() => formData.value.travelers, (newTravelers) => {
    const travelerErrors = {}
    newTravelers.forEach((traveler, index) => {
        // 전화번호 자동 포맷팅
        if (traveler.phone) {
            traveler.phone = formatPhoneNumber(traveler.phone)
        }
        // 검증 (에러 메시지는 UI에 표시 안함)
        travelerErrors[index] = validateTraveler(traveler)
    })
    validationErrors.value.travelers = travelerErrors
}, { deep: true })

// === 생명주기 ===
onMounted(loadInitialData)
</script>

<style scoped>

/* 전체 레이아웃 */
.booking-page {
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

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
}

.product-summary-box {
    background: var(--bg-light);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.summary-label {
    font-size: 0.8rem;
    color: var(--primary-color);
    font-weight: 600;
}

.summary-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-section {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.form-section h2 {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    color: var(--text-primary);
    font-weight: 600;
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
    font-weight: bold;
    font-size: 0.8rem;
    margin-right: 0.25rem;
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

label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
}

input, textarea, select {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    transition: border-color 0.2s;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Validation 스타일 */
input.error, textarea.error {
    border-color: var(--error-color);
    background-color: rgba(220, 38, 38, 0.05);
}

input.error:focus, textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
    line-height: 1.2;
}



textarea {
    resize: vertical;
}

.info-notice, .departure-notice {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
}

.info-notice p, .departure-notice p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.8rem;
}

.traveler-info-checkbox {
    margin-bottom: 1rem;
}

.travelers-table {
    margin-top: 0;
}

.traveler-info-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.traveler-info-table thead th {
    background: var(--bg-light);
    padding: 0.5rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
}

.traveler-info-table tbody td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
}

.traveler-info-table tbody tr:last-child td {
    border-bottom: none;
}

.traveler-number {
    width: 20%;
}

.traveler-name {
    width: 40%;
}

.traveler-contact {
    width: 40%;
}

.traveler-number-cell {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary);
}

.traveler-type {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.2rem;
}

.booker-badge {
    background: var(--primary-color);
    color: white;
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-weight: 500;
    display: block;
    margin-top: 0.3rem;
}

.table-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.85rem;
    transition: border-color 0.2s;
}

.table-input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.table-input[readonly] {
    background-color: var(--bg-light);
    color: var(--text-secondary);
}

.payment-details {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
}

.payment-row {
    display: flex;
    margin-bottom: 0.75rem;
}

.payment-row:last-child {
    margin-bottom: 0;
}

.payment-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    min-width: 80px;
    font-weight: 500;
}

.payment-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.highlight {
    color: var(--primary-color);
    font-weight: 600;
}

.departure-options-simple {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
}

.departure-radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    transition: all 0.2s;
}

.departure-radio:hover {
    background: var(--bg-light);
}

.departure-radio input[type="radio"]:checked + .radio-text {
    color: var(--primary-color);
    font-weight: 500;
}

.radio-text {
    font-size: 0.95rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
}

.departure-time {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 400;
}

.people-counter-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.counter-group {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
}

.counter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.counter-header label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.85rem;
}

.counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.counter button {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: white;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
}

.counter button:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
}

.counter button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.count {
    font-size: 1rem;
    font-weight: 500;
    min-width: 1.5rem;
    text-align: center;
}

.price {
    color: var(--primary-color);
    font-weight: 500;
    font-size: 0.8rem;
}

.total-calculation {
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
}

.calculation-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--primary-color);
    margin-top: 1rem;
}

.total-price strong {
    font-size: 1rem;
    color: var(--primary-color);
}

/* 체크박스 */
.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
}

.checkbox-input {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
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

.checkbox-text .optional-mark {
    color: var(--text-secondary);
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

.booking-summary {
    background: var(--bg-light);
    border: 1px solid var(--border-color);
}

.summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.85rem;
}

.summary-row:nth-last-child(2) {
    border-bottom: none;
}

.summary-row.total {
    border-top: 1px solid var(--primary-color);
    border-bottom: none; 
    padding-top: 0.75rem;
    font-size: 0.95rem;
    font-weight: 500;
}

.submit-section {
    text-align: center;
    margin-top: 1.5rem;
}

.submit-notice {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-size: 0.85rem;
}

.submit-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.submit-btn:hover:not(:disabled) {
    background: var(--primary-dark);
}

.submit-btn:disabled {
    background: var(--border-color);
    cursor: not-allowed;
}

/* 로딩 인디케이터 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
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
    font-size: 0.9rem;
    margin: 0;
}

@media (max-width: 768px) {
    .main-content {
        padding-top: 1.5rem;
    }
    
    .container {
        padding: 0 15px;
    }

    .page-title {
        font-size: 1.75rem;
    }

    .product-summary-box {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .people-counter-grid {
        grid-template-columns: 1fr;
    }

    .departure-options-simple {
        grid-template-columns: repeat(2, 1fr);
    }

    .departure-radio {
        flex-direction: row;
        align-items: center;
    }

    .form-section {
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

    .terms-item {
        padding: 0.5rem 0.75rem;
    }

    .terms-all-agree {
        padding: 0.75rem;
    }
    
    .checkbox-text {
        font-size: 0.85rem;
    }
    
    .form-section h2 {
        font-size: 1rem;
    }

    .traveler-info-table thead th {
        padding: 0.5rem;
        font-size: 0.8rem;
    }

    .traveler-info-table tbody td {
        padding: 0.5rem;
    }

    .traveler-number {
        width: 25%;
    }

    .traveler-name {
        width: 37.5%;
    }

    .traveler-contact {
        width: 37.5%;
    }

    .traveler-type {
        font-size: 0.7rem;
    }

    .booker-badge {
        font-size: 0.55rem;
        padding: 0.05rem 0.2rem;
        margin-top: 0.2rem;
    }

    .table-input {
        padding: 0.4rem;
        font-size: 0.8rem;
    }
}
</style> 