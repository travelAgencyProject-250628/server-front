<!-- 예약 상세 페이지 -->
<template>
    <div class="reservation-detail-page">
        <h1 class="page-title">예약/결제현황</h1>
        
        <!-- 예약자 정보 -->
        <section class="info-section">
            <h2>예약자정보</h2>
            <div class="info-table">
                <div class="info-row">
                    <span class="info-label">예약자 성명</span>
                    <span class="info-value">{{ reservationDetail.bookerName }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">휴대전화</span>
                    <span class="info-value">{{ reservationDetail.bookerPhone }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">일행연락처</span>
                    <span class="info-value">{{ reservationDetail.emergencyContact }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">E-Mail주소</span>
                    <span class="info-value">{{ reservationDetail.bookerEmail }}</span>
                </div>
            </div>
        </section>

        <!-- 여행지예약정보 -->
        <section class="info-section">
            <h2>여행지예약정보</h2>
            <div class="info-table">
                <div class="info-row">
                    <span class="info-label">예약상품명</span>
                    <span class="info-value">{{ reservationDetail.productTitle }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">예약인원</span>
                    <span class="info-value">대인/경로 {{ reservationDetail.adultCount }}명 소인 {{ reservationDetail.childCount }}명</span>
                </div>
                <div class="info-row">
                    <span class="info-label">여행기간</span>
                    <span class="info-value">{{ reservationDetail.duration }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">출발일</span>
                    <span class="info-value departureDate-highlight">{{ reservationDetail.departureDate }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">출발지역</span>
                    <span class="info-value">{{ reservationDetail.departureLocation }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">포함사항</span>
                    <span class="info-value">{{ reservationDetail.includedItems }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">불포함사항</span>
                    <span class="info-value">{{ reservationDetail.excludedItems }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">상품가격</span>
                    <span class="info-value">[성인 기준] 1인 : {{ formatPrice(reservationDetail.adultPrice) }}원</span>
                </div>
            </div>
        </section>

        <!-- 실제 여행자 정보 -->
        <section class="info-section">
            <h2>실제여행자정보</h2>
            <div class="traveler-list">
                <div v-for="(traveler, index) in reservationDetail.travelers" :key="index" class="traveler-item">
                    <div class="traveler-header">
                        <span class="traveler-number">{{ index + 1 }}번째 여행자</span>
                        <span class="traveler-type">{{ traveler.type }}</span>
                    </div>
                    <div class="traveler-info">
                        <div class="traveler-row">
                            <span class="traveler-label">성명</span>
                            <span class="traveler-value">{{ traveler.name }}</span>
                        </div>
                        <div class="traveler-row">
                            <span class="traveler-label">연락처</span>
                            <span class="traveler-value">{{ traveler.phone }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 결제정보 -->
        <section class="info-section">
            <h2>결제정보</h2>
            <div class="payment-table">
                <div class="payment-row">
                    <span class="payment-label">결제방법</span>
                    <span class="payment-value">
                        <span class="payment-method">무통장입금</span>
                        <span class="account-info">[입금자명] [입금완료] KB국민은행 421737-04-024850 (주식회사 굿모닝여행사)</span>
                    </span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">상태</span>
                    <span class="payment-value">{{ reservationDetail.status }}</span>
                </div>
                <div class="payment-row">
                    <span class="payment-label">구분</span>
                    <span class="payment-value">{{ reservationDetail.memberType }}</span>
                </div>
                <div class="payment-row total-row">
                    <span class="payment-label">결제금액</span>
                    <span class="payment-value total-amount">
                        <span class="won-icon">₩</span>
                        {{ formatPrice(reservationDetail.totalAmount) }}원
                    </span>
                </div>
            </div>
        </section>

        <!-- 뒤로가기 버튼 -->
        <div class="action-buttons">
            <button @click="goBack" class="btn-back">목록으로</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 예약 상세 정보 (실제로는 API에서 받아올 데이터)
const reservationDetail = ref({
    id: null,
    bookerName: '홍길동',
    bookerPhone: '010-2237-6938',
    emergencyContact: '010-2237-6938',
    bookerEmail: 'jbl6938@gmail.com',
    productTitle: '[당일]★리무진버스①속초*회*모듬한상차림①속초별미맛기행!1탄*속초*외옹치항*바다항기길+중앙어시장+속초영랑호수원길+속초주익의박물관',
    adultCount: 1,
    childCount: 0,
    duration: '당일',
    departureDate: '2025/08/08',
    departureLocation: '잠실',
    includedItems: '2식[중식+석식(회정식포함)], 전용차량',
    excludedItems: '개인경비(음료수 구입비용), 여행자 개인 사정, 기타 불가항목, 여행자보험가입비용, 선택관광 및 자유시간 중 개인경비 발생시,당일날씨 상황에따라 일정변경시 가이드안내에 따라 진행됩니다.',
    adultPrice: 87000,
    totalAmount: 87000,
    status: '예약확정',
    memberType: '회원예약',
    travelers: [
        {
            name: '홍길동',
            phone: '010-2237-6938',
            type: '성인'
        }
    ]
})

// 가격 포맷팅
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 뒤로가기
const goBack = () => {
    router.push('/reservations')
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    const reservationId = route.params.id
    reservationDetail.value.id = reservationId
    
    // 실제로는 API 호출하여 예약 상세 정보 로드
    // loadReservationDetail(reservationId)
})
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
    --warning-color: #d97706;
}

/* 전체 레이아웃 */
.reservation-detail-page {
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

.info-section {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.info-section h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-weight: 600;
}

.info-table {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.info-row {
    display: flex;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.info-label {
    font-size: 0.95rem;
    color: var(--text-secondary);
    min-width: 120px;
    font-weight: 500;
}


.info-value {
    font-size: 0.95rem;
    color: var(--text-primary);
    font-weight: 500;
    flex: 1;
}

.departureDate-highlight {
    color: var(--primary-color);
    font-weight: 600;
}
/* 여행자 정보 스타일 */
.traveler-list {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.traveler-item {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: white;
    margin-bottom: 1rem;
    padding: 1rem;
}

.traveler-item:last-child {
    margin-bottom: 0;
}

.traveler-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.traveler-number {
    font-weight: 500;
    color: var(--text-primary);
}

.traveler-type {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.traveler-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.traveler-row {
    display: flex;
}

.traveler-label {
    font-size: 0.95rem;
    color: var(--text-secondary);
    min-width: 80px;
    font-weight: 500;
}

.traveler-value {
    font-size: 0.95rem;
    color: var(--text-primary);
    font-weight: 500;
    flex: 1;
}

/* 결제정보 스타일 */
.payment-table {
    background: var(--bg-light);
    padding: 1rem;
    border-radius: var(--border-radius);
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
    min-width: 120px;
    font-weight: 500;
}

.payment-value {
    font-size: 0.95rem;
    color: var(--text-primary);
    font-weight: 500;
    flex: 1;
    line-height: 1.4;
}

.payment-method {
    color: var(--primary-color);
    font-weight: 600;
}

.account-info {
    display: block;
    margin-top: 0.25rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.total-row {
    background: white;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--primary-color);
    margin-top: 0.5rem;
}

.total-row .payment-label {
    font-weight: 600;
    color: var(--primary-color);
}

.total-amount {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--error-color);
}

.won-icon {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--error-color);
}

/* 액션 버튼 */
.action-buttons {
    text-align: center;
    margin-top: 2rem;
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

/* 반응형 디자인 */
@media (max-width: 768px) {
    .reservation-detail-page {
        padding: 1rem 15px;
    }

    .page-title {
        font-size: 1.3rem;
    }

    .info-row,
    .traveler-row,
    .payment-row {
        flex-direction: column;
    }

    .info-label,
    .traveler-label,
    .payment-label {
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        min-width: auto;
    }

    .contact-numbers {
        flex-direction: column;
        gap: 0.5rem;
    }

    .traveler-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }
}
</style> 