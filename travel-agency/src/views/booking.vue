<!-- 여행 예약 페이지 -->
<template>
    <div class="booking-page">
        <h1 class="page-title">여행 예약하기</h1>
        
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
                <h2>예약자 정보</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="bookerName">예약자 이름 <span class="required">*</span></label>
                        <input type="text" id="bookerName" v-model="formData.bookerName" required>
                    </div>
                    <div class="form-group">
                        <label for="bookerPhone">휴대폰 번호 <span class="required">*</span></label>
                        <input type="tel" id="bookerPhone" v-model="formData.bookerPhone" 
                               placeholder="010-1234-5678" required>
                    </div>
                    <div class="form-group">
                        <label for="bookerEmail">이메일 <span class="required">*</span></label>
                        <input type="email" id="bookerEmail" v-model="formData.bookerEmail" 
                               placeholder="example@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="emergencyContact">비상연락처</label>
                        <input type="tel" id="emergencyContact" v-model="formData.emergencyContact" 
                               placeholder="비상시 연락 가능한 번호">
                    </div>
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
                            <label for="travelerName">여행자 이름 <span class="required">*</span></label>
                            <input type="text" id="travelerName" v-model="formData.travelerName" required>
                        </div>
                        <div class="form-group">
                            <label for="travelerPhone">여행자 연락처 <span class="required">*</span></label>
                            <input type="tel" id="travelerPhone" v-model="formData.travelerPhone" required>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 출발지역 선택 -->
            <section class="form-section">
                <h2>출발지역 <span class="required">*</span></h2>
                <div class="departure-options-simple">
                    <label v-for="location in departureLocations" :key="location.id" class="departure-radio">
                        <input type="radio" 
                               name="departureLocation"
                               :value="location.id"
                               v-model="formData.departureLocation">
                        <span class="radio-text">{{ location.name }}</span>
                    </label>
                </div>
            </section>

            <!-- 인원 선택 -->
            <section class="form-section">
                <h2>인원 선택 <span class="required">*</span></h2>
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
                <h2>결제 정보</h2>
                <div class="payment-info">
                    <div class="payment-details">
                        <div class="payment-row">
                            <span class="payment-label">결제 방법</span>
                            <span class="payment-value"><span class="highlight">무통장 입금</span></span>
                        </div>
                        <div class="payment-row">
                            <span class="payment-label">입금 계좌</span>
                            <span class="payment-value">국민은행 123456-78-901234 (예금주: 굿모닝투어)</span>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="payerName">입금자명 <span class="required">*</span></label>
                            <input type="text" id="payerName" v-model="formData.payerName" 
                                   placeholder="입금하실 분의 성함을 입력하세요" required>
                        </div>
                        <div class="form-group full-width">
                            <label for="customerRequest">고객 요청사항</label>
                            <textarea id="customerRequest" v-model="formData.customerRequest" 
                                    rows="4"></textarea>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 약관 동의 -->
            <section class="form-section terms-section">
                <h2>약관 동의 <span class="required">*</span></h2>
                
                <div class="terms-container">
                    <!-- 전체 동의 -->
                    <div class="terms-all-agree">
                        <label class="checkbox-label all-agree-label">
                            <input type="checkbox" v-model="formData.agreeAll" @change="handleAgreeAll" class="checkbox-input">
                            <span class="checkbox-text">모든 내용에 동의합니다.</span>
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
                <button type="submit" class="submit-btn" :disabled="!isFormValid">
                    예약 신청하기
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 상품 정보 (실제로는 API에서 받아올 데이터)
const product = ref({
    id: route.query.productId,
    title: '설악산 당일치기 여행',
    duration: '1박2일',
    travelDate: '2025/08/01',
    productCode: 'GM240320001',
    adultPrice: 87000,
    childPrice: 67000,
})

// 출발 지역 데이터
const departureLocations = [
    { id: 1, name: '영등포' },
    { id: 2, name: '서울역' },
    { id: 3, name: '잠실' },
    { id: 4, name: '동천' },
    { id: 5, name: '죽전' },
    { id: 6, name: '신갈' },
]

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

// 총 결제금액 계산
const totalPrice = computed(() => {
    return (formData.value.adultCount * product.value.adultPrice) +
           (formData.value.childCount * product.value.childPrice)
})

// 폼 유효성 검사
const isFormValid = computed(() => {
    const requiredAgreements = terms
        .map((term, index) => term.required ? formData.value.agreements[index] : true)
        .every(agreed => agreed)
    
    const travelerInfoValid = formData.value.sameAsBooker || 
        (formData.value.travelerName && formData.value.travelerPhone)
    
    return formData.value.bookerName &&
           formData.value.bookerPhone &&
           formData.value.bookerEmail &&
           travelerInfoValid &&
           formData.value.departureLocation &&
           (formData.value.adultCount > 0 || formData.value.childCount > 0) &&
           formData.value.payerName &&
           requiredAgreements
})

// 예약자와 여행자 동일 처리
const handleSameAsBooker = () => {
    if (formData.value.sameAsBooker) {
        formData.value.travelerName = ''
        formData.value.travelerPhone = ''
    }
}

// 인원 수 증감 메서드
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

// 약관 동의 처리 메서드
const handleAgreeAll = () => {
    formData.value.agreements = formData.value.agreements.map(() => formData.value.agreeAll)
}

const handleIndividualAgree = () => {
    formData.value.agreeAll = formData.value.agreements.every(agreed => agreed)
}

// 약관 보기
const viewTerms = (termId) => {
    alert(`약관 ${termId} 내용을 표시합니다. (실제로는 모달이나 새 창으로 표시)`)
}



// 선택된 출발지역 가져오기
const getSelectedDepartureLocation = () => {
    if (!formData.value.departureLocation) return '-'
    const location = departureLocations.find(loc => loc.id === formData.value.departureLocation)
    return location ? location.name : '-'
}

// 가격 포맷팅
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 폼 제출 처리
const handleSubmit = async () => {
    try {
        // API 호출 (실제 구현 필요)
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: product.value.id,
                ...formData.value,
            }),
        })

        if (response.ok) {
            alert('예약 신청이 완료되었습니다. 담당자가 확인 후 연락드리겠습니다.')
            router.push('/') // 메인 페이지로 이동
        } else {
            throw new Error('예약 처리 중 오류가 발생했습니다.')
        }
    } catch (error) {
        alert(error.message)
    }
}
</script>

<style scoped>
/* CSS 변수 정의 - 전역으로 적용 */
:global(:root) {
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
.booking-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.5;
    color: var(--text-primary);
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem 20px;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    text-align: center;
}

.product-summary-box {
    background: #e8f2ff;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid #b8d4ff;
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
    font-size: 0.9rem;
    color: var(--primary-color);
    font-weight: 600;
}

.summary-value {
    font-size: 0.95rem;
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
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-weight: 600;
}

.required {
    color: var(--error-color);
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
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

input, textarea, select {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 0.95rem;
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
    font-size: 0.85rem;
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
    font-size: 0.95rem;
    color: var(--text-secondary);
    min-width: 80px;
    font-weight: 500;
}

.payment-value {
    font-size: 0.95rem;
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
    font-size: 0.9rem;
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
    font-size: 0.85rem;
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
    font-size: 0.9rem;
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
    font-size: 1.1rem;
    color: var(--primary-color);
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

.checkbox-text .optional-mark {
    background: none;
    color: #6b7280;
    padding: 0;
    border-radius: 0;
    font-size: 1rem;
    font-weight: 600;
    margin-right: 0.3rem;
}

/* 약관 섹션 */
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
    font-size: 0.9rem;
}

.summary-row:nth-last-child(2) {
    border-bottom: none;
}

.summary-row.total {
    border-top: 1px solid var(--primary-color);
    border-bottom: none; 
    padding-top: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
}

.submit-section {
    text-align: center;
    margin-top: 1.5rem;
}

.submit-notice {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-size: 0.9rem;
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

@media (max-width: 768px) {
    .booking-page {
        padding: 1rem 15px;
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

    .terms-item {
        padding: 1rem;
    }

    .terms-all-agree {
        padding: 1rem;
    }
}
</style> 