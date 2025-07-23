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

        <form @submit.prevent="handleSubmit" class="booking-form">
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
                        <input type="text" id="bookerName" v-model="formData.bookerName" required>
                    </div>
                    <div class="form-group">
                        <label for="bookerPhone" class="form-label required">
                            <span class="required-icon">⦁</span>
                            휴대폰 번호
                        </label>
                        <input type="tel" id="bookerPhone" v-model="formData.bookerPhone" 
                               placeholder="010-1234-5678" required>
                    </div>
                    <div class="form-group">
                        <label for="bookerEmail" class="form-label required">
                            <span class="required-icon">⦁</span>
                            이메일
                        </label>
                        <input type="email" id="bookerEmail" v-model="formData.bookerEmail" 
                               placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="emergencyContact" class="form-label">비상연락처</label>
                        <input type="tel" id="emergencyContact" v-model="formData.emergencyContact" 
                               placeholder="비상시 연락 가능한 번호">
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

            <!-- 여행자 정보 -->
            <section class="form-section">
                <h2>여행자 정보</h2>
                <div class="traveler-info">
                    <div class="info-notice">
                        <p>※ 여행자 정보는 여행자보험 가입 및 예약 확인을 위해 필요합니다.</p>
                    </div>
                    <div class="form-group traveler-info-checkbox">
                        <label>
                            <input type="checkbox" v-model="formData.sameAsBooker" @change="handleSameAsBooker">
                            예약자와 여행자가 동일합니다
                        </label>
                    </div>
                    <div v-if="!formData.sameAsBooker" class="form-grid">
                        <div class="form-group">
                            <label for="travelerName" class="form-label required">
                                <span class="required-icon">⦁</span>
                                여행자 이름
                            </label>
                            <input type="text" id="travelerName" v-model="formData.travelerName" required>
                        </div>
                        <div class="form-group">
                            <label for="travelerPhone" class="form-label required">
                                <span class="required-icon">⦁</span>
                                여행자 연락처
                            </label>
                            <input type="tel" id="travelerPhone" v-model="formData.travelerPhone" required>
                        </div>
                    </div>
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
                                   placeholder="입금하실 분의 성함을 입력하세요" required>
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
                                <a :href="term.url" target="_blank" class="btn-terms">약관보기</a>
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
                <button type="submit" class="submit-btn" :disabled="!isFormValid || isSubmitting">
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
import { ref, computed, onMounted } from 'vue'
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

// 약관 데이터
const terms = [
    { id: 1, title: '여행약관 동의', required: true, url: 'https://naratour.notion.site/' },
    { id: 2, title: '개인정보 수집 및 이용 동의', required: true, url: 'https://naratour.notion.site/2390fe2b4a0380d88f66dd592754e8bf' },
    { id: 3, title: '나라투어 이용약관', required: true, url: 'https://naratour.notion.site/2390fe2b4a0380028b64e199dc914abe' },
    { id: 5, title: '마케팅 활용 동의', required: false, url: 'https://naratour.notion.site/2390fe2b4a03800eba46ea75f0865198' },
]

// 폼 데이터
const formData = ref({
    bookerName: '',
    bookerPhone: '',
    bookerEmail: '',
    emergencyContact: '',
    sameAsBooker: false,
    travelerName: '',
    travelerPhone: '',
    departureLocation: '',
    adultCount: 0,
    childCount: 0,
    payerName: '',
    customerRequest: '',
    agreeAll: false,
    agreements: new Array(terms.length).fill(false),
})

// === 계산된 값들 ===
const totalPrice = computed(() => {
    return (formData.value.adultCount * product.value.adultPrice) +
           (formData.value.childCount * product.value.childPrice)
})

const isFormValid = computed(() => {
    const requiredFields = [
        formData.value.bookerName,
        formData.value.bookerPhone,
        formData.value.bookerEmail,
        formData.value.departureLocation,
        formData.value.payerName,
        (formData.value.adultCount > 0 || formData.value.childCount > 0)
    ]
    
    const travelerInfoValid = formData.value.sameAsBooker || 
        (formData.value.travelerName && formData.value.travelerPhone)
    
    const requiredAgreements = terms
        .filter(term => term.required)
        .every((term, index) => formData.value.agreements[index])
    
    return requiredFields.every(field => field) && travelerInfoValid && requiredAgreements
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
        const travelDate = selectedDate ? formatDateForDisplay(selectedDate) : '2025/08/01'
        
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
            : getDefaultDepartureLocations()

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
            
            console.log('사용자 정보가 폼에 미리 채워졌습니다:', {
                name: formData.value.bookerName,
                email: formData.value.bookerEmail,
                phone: formData.value.bookerPhone
            })
        }
    } catch (error) {
        console.error('사용자 정보 로드 오류:', error)
        // 사용자 정보 로드 실패는 예약 진행에 영향을 주지 않으므로 에러를 던지지 않음
    }
}

// 기본 출발지역 데이터
const getDefaultDepartureLocations = () => [
    { id: 1, name: '영등포' },
    { id: 2, name: '서울역' },
    { id: 3, name: '잠실' },
    { id: 4, name: '동천' },
    { id: 5, name: '죽전' },
    { id: 6, name: '신갈' },
]

// === 폼 핸들러들 ===
const handleSameAsBooker = () => {
    if (formData.value.sameAsBooker) {
        formData.value.travelerName = ''
        formData.value.travelerPhone = ''
    }
}

const increaseCount = (type) => {
    if (type === 'adult') {
        formData.value.adultCount++
    } else {
        formData.value.childCount++
    }
}

const decreaseCount = (type) => {
    if (type === 'adult' && formData.value.adultCount > 0) {
        formData.value.adultCount--
    } else if (type === 'child' && formData.value.childCount > 0) {
        formData.value.childCount--
    }
}

const handleAgreeAll = () => {
    formData.value.agreements = formData.value.agreements.map(() => formData.value.agreeAll)
}

const handleIndividualAgree = () => {
    formData.value.agreeAll = formData.value.agreements.every(agreed => agreed)
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
    const travelersName = formData.value.sameAsBooker 
        ? formData.value.bookerName
        : formData.value.travelerName
    const travelersPhone = formData.value.sameAsBooker
        ? formData.value.bookerPhone
        : formData.value.travelerPhone
    
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
        travelersName,
        travelersPhone,
        status: 'pending'
    }
}

const handleSubmit = async () => {
    if (isSubmitting.value) return
    
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
}
</style> 