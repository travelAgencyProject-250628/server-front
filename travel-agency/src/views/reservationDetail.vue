<!-- 예약 상세 페이지 -->
<template>
    <div class="reservation-detail-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">예약 상세 정보</h1>
                    <p class="page-subtitle">예약하신 여행 상품의 상세 정보를 확인하세요</p>
                </div>
                
                <!-- 로딩 상태 -->
                <div v-if="isLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>예약 정보를 불러오는 중...</p>
                </div>

                <!-- 에러 상태 -->
                <div v-else-if="error" class="error-container">
                    <p>{{ error }}</p>
                    <button @click="loadReservationDetail(route.params.id)" class="retry-button">다시 시도</button>
                </div>

                <!-- 예약 상세 정보 -->
                <div v-else-if="reservationDetail.id" class="detail-sections">
                    <!-- 예약자 정보 -->
                    <section class="detail-card">
                        <h2 class="card-title">예약자 정보</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">예약자 성명</span>
                                <span class="info-value">{{ reservationDetail.bookerName }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">휴대전화</span>
                                <span class="info-value">{{ reservationDetail.bookerPhone }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">일행연락처</span>
                                <span class="info-value">{{ reservationDetail.emergencyContact || '미입력' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">E-Mail주소</span>
                                <span class="info-value">{{ reservationDetail.bookerEmail }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- 여행지 예약정보 -->
                    <section class="detail-card">
                        <h2 class="card-title">여행지 예약정보</h2>
                        <div class="product-info-section">
                            <div class="product-summary">
                                <h3 class="product-name">{{ reservationDetail.productTitle }}</h3>
                                <div class="departure-info">
                                    <span class="departure-label">출발일</span>
                                    <span class="departure-date">{{ reservationDetail.departureDate }}</span>
                                </div>
                            </div>
                            
                            <div class="travel-info-grid">
                                <div class="travel-item">
                                    <span class="travel-label">예약인원</span>
                                    <span class="travel-value">대인 {{ reservationDetail.adultCount }}명, 소인 {{ reservationDetail.childCount }}명</span>
                                </div>
                                <div class="travel-item">
                                    <span class="travel-label">여행기간</span>
                                    <span class="travel-value">{{ reservationDetail.duration }}</span>
                                </div>
                                <div class="travel-item">
                                    <span class="travel-label">출발지역</span>
                                    <span class="travel-value">
                                        {{ reservationDetail.departureLocation }}
                                        <span v-if="reservationDetail.departureTime" class="departure-time">
                                            ({{ formatTime(reservationDetail.departureTime) }})
                                        </span>
                                    </span>
                                </div>
                            </div>
                            
                            <div class="travel-details">
                                <div class="detail-row">
                                    <span class="detail-label">포함사항</span>
                                    <p class="detail-content">{{ reservationDetail.includedItems }}</p>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">불포함사항</span>
                                    <p class="detail-content">{{ reservationDetail.excludedItems }}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 실제 여행자 정보 -->
                    <section class="detail-card">
                        <h2 class="card-title">실제 여행자 정보</h2>
                        <div class="travelers-list">
                            <div v-for="(traveler, index) in reservationDetail.travelers" :key="index" class="traveler-item">
                                <div class="traveler-header">
                                    <span class="traveler-number">{{ index + 1 }}번째 여행자</span>
                                    <span class="traveler-type">{{ traveler.type }}</span>
                                </div>
                                <div class="traveler-details">
                                    <div class="traveler-field">
                                        <span class="field-label">성명</span>
                                        <span class="field-value">{{ traveler.name }}</span>
                                    </div>
                                    <div class="traveler-field">
                                        <span class="field-label">연락처</span>
                                        <span class="field-value">{{ traveler.phone }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 결제정보 -->
                    <section class="detail-card payment-section">
                        <h2 class="card-title">결제정보</h2>
                        <div class="payment-content">
                            <!-- 결제방법 및 계좌정보 -->
                            <div class="payment-method-info">
                                <div class="method-row">
                                    <span class="method-label">결제방법</span>
                                    <span class="method-value">{{ reservationDetail.paymentMethod || '무통장입금' }}</span>
                                </div>
                                <div class="account-row">
                                    <span class="account-label">입금계좌</span>
                                    <span class="account-value">{{ reservationDetail.bankAccount || '신한은행 110-566-753667 (예금주: 김태훈)' }}</span>
                                </div>
                                <div class="account-row">
                                    <span class="account-label">입금자명</span>
                                    <span class="account-value">{{ reservationDetail.depositorName || reservationDetail.bookerName }}</span>
                                </div>
                                <div class="status-row">
                                    <span class="status-label">예약상태</span>
                                    <span class="status-value">
                                        <span class="status-badge" :class="getStatusClass(reservationDetail.status)">
                                            {{ getStatusText(reservationDetail.status) }}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            
                            <!-- 결제 상태 및 금액 -->
                            <div class="payment-summary">
                                <div class="total-row">
                                    <span class="total-label">총 결제금액</span>
                                    <span class="total-amount">{{ formatPrice(reservationDetail.totalAmount) }}원</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 액션 버튼 -->
                    <div class="action-section">
                        <button @click="goBack" class="btn-back">목록으로 돌아가기</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getReservationDetail } from '../lib/reservations.js'

const route = useRoute()
const router = useRouter()

// 상태 관리
const reservationDetail = ref({})
const isLoading = ref(true)
const error = ref(null)

// 예약 상세 정보 로드
const loadReservationDetail = async (reservationId) => {
    try {
        isLoading.value = true
        error.value = null
        
        const result = await getReservationDetail(reservationId)
        
        if (result.success) {
            reservationDetail.value = result.reservation
        } else {
            error.value = result.error || '예약 정보를 불러오는데 실패했습니다.'
            console.error('예약 상세 정보 로드 실패:', result.error)
        }
    } catch (err) {
        error.value = '예약 정보를 불러오는데 실패했습니다.'
        console.error('예약 상세 정보 로드 오류:', err)
    } finally {
        isLoading.value = false
    }
}

// 가격 포맷팅
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 시간 포맷팅
const formatTime = (timeString) => {
    if (!timeString) return ''
    // 'HH:MM:SS' 형식을 'HH:MM' 형식으로 변환
    return timeString.substring(0, 5)
}

// 상태에 따른 클래스 반환
const getStatusClass = (status) => {
    if (status === 'confirmed') return 'completed'
    if (status === 'pending') return 'pending'
    if (status === 'cancelled') return 'cancelled'
    return 'pending'
}

// 상태에 따른 텍스트 반환
const getStatusText = (status) => {
    if (status === 'confirmed') return '예약완료'
    if (status === 'pending') return '예약대기'
    if (status === 'cancelled') return '예약취소'
    return '예약대기'
}

// 뒤로가기
const goBack = () => {
    router.push('/mypage/reservations')
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    const reservationId = route.params.id
    if (reservationId) {
        loadReservationDetail(reservationId)
    } else {
        error.value = '예약 ID가 필요합니다.'
        isLoading.value = false
    }
})
</script>

<style scoped>

/* 상세 섹션들 */

.detail-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.detail-card {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--primary-color);
}

/* 예약자 정보 */
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.info-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

/* 여행지 정보 */
.product-info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.product-summary {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
}

.product-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    line-height: 1.4;
}

.departure-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.departure-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.departure-date {
    font-size: 0.8rem;
    color: var(--primary-color);
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    background: white;
    border-radius: 4px;
    border: 1px solid var(--primary-color);
}

.travel-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.travel-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.travel-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.travel-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.travel-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
}

.detail-label {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 600;
}

.detail-content {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* 여행자 정보 */
.travelers-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.traveler-item {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.traveler-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.traveler-number {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.traveler-type {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
}

.traveler-details {
    display: flex;
    gap: 1.5rem;
}

.traveler-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.field-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.field-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

/* 결제정보 */
.payment-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.payment-method-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.method-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.method-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.method-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.account-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.account-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.account-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.account-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.payment-summary {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.status-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.status-value {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-badge.pending {
    background-color: var(--warning-color);
    color: white;
}

.status-badge.completed {
    background-color: var(--success-color);
    color: white;
}

.status-badge.cancelled {
    background-color: var(--error-color);
    color: white;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    margin-top: 0.5rem;
    border-top: 1px solid var(--border-color);
}

.total-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.total-amount {
    font-size: 1.1rem;
    color: #dc2626;
    font-weight: 600;
}

/* 액션 버튼 */
.action-section {
    text-align: center;
    margin-top: 1.5rem;
}

.btn-back {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.btn-back:hover {
    background: var(--primary-dark);
}

/* 로딩 상태 */
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

/* 에러 상태 */
.error-container {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

.error-container p {
    color: var(--error-color);
    margin-bottom: 1rem;
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

/* 반응형 디자인 */
@media (max-width: 768px) {

    .info-grid,
    .travel-info-grid {
        grid-template-columns: 1fr;
    }

    .departure-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .traveler-details {
        flex-direction: column;
        gap: 0.75rem;
    }

    .method-row,
    .account-row,
    .status-row,
    .total-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .total-row {
        padding: 0.75rem 0;
    }
}
</style> 