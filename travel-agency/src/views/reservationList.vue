<!-- 예약 확인 페이지 -->
<template>
    <div class="reservation-page">
        <div class="page-header">
            <h1 class="page-title">예약/결제현황</h1>
            <!-- <p class="page-subtitle">거꾸로는 합리적인비용으로 즐기는 고품격여행 - 굿모닝여행사</p> -->
        </div>

        <div class="reservation-table">
            <!-- 테이블 헤더 -->
            <div class="table-header">
                <div class="header-item">상품명</div>
                <div class="header-item">출발일</div>
                <div class="header-item">결제금액</div>
                <div class="header-item">예약상태</div>
            </div>

            <!-- 예약 리스트 -->
            <div v-for="reservation in reservations" :key="reservation.id" class="reservation-item" @click="goToDetail(reservation.id)">
                <div class="reservation-content">
                    <div class="product-info">
                        <div class="reservation-date">예약일 : {{ reservation.reservationDate }}</div>
                        <div class="product-title">{{ reservation.productTitle }}</div>
                        <div class="people-info">
                            <span class="people-badge adult">대인 <strong>{{ reservation.adultCount }}명</strong></span>
                            <span class="people-badge child">소인 <strong>{{ reservation.childCount }}명</strong></span>
                        </div>
                    </div>
                    <div class="departure-date">{{ reservation.departureDate }}</div>
                    <div class="price">
                        <span class="amount">{{ formatPrice(reservation.totalAmount) }}원</span>
                    </div>
                    <div class="status">
                        <span :class="['status-badge', getStatusClass(reservation.status)]">
                            {{ reservation.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 예약이 없을 때 -->
        <div v-if="reservations.length === 0" class="no-reservations">
            <p>예약된 여행이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 예약 데이터 (실제로는 API에서 받아올 데이터)
const reservations = ref([
    {
        id: 1,
        reservationDate: '2025/07/06',
        productTitle: '[당일]7월영주한정!(1만원상품권제공)천년고찰~영주부석사+힐링숲족욕겟길(족욕부~회방사페딩)+수수서원+인삼시장',
        departureDate: '2025/07/18',
        totalAmount: 32000,
        status: '예약확정',
        adultCount: 1,
        childCount: 0
    },
    {
        id: 2,
        reservationDate: '2025/07/06',
        productTitle: '[당일]★리무진버스①속초*회*모듬한상차림①속초별미맛기행!1탄*속초*외옹치항*바다항기길+중앙어시장+속초영랑호수원길+속초주익의박물관',
        departureDate: '2025/08/08',
        totalAmount: 87000,
        status: '예약확정',
        adultCount: 1,
        childCount: 0
    },
    {
        id: 3,
        reservationDate: '2025/07/06',
        productTitle: '[당일]★리무ㅁㄴㅇㄹㄴㅇㄹㅁ진버스①속초*회*모듬한상차림①속초별미맛기행!1탄*속초*외옹치항*바다항기길+중앙어시장+속초영랑호수원길+속초주익의박물관',
        departureDate: '2025/08/08',
        totalAmount: 87000,
        status: '예약대기',
        adultCount: 1,
        childCount: 0
    },
    {
        id: 4,
        reservationDate: '2025/07/06',
        productTitle: '[당일]★리무진버스①속초*회*모듬한상차림①속초별미맛기행!1탄*속초*외옹치항*바다항기길+중앙어시장+속초영랑호수원길+속초주익의박물관',
        departureDate: '2025/08/08',
        totalAmount: 87000,
        status: '예약확정',
        adultCount: 1,
        childCount: 0
    }
])

// 가격 포맷팅
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 상태에 따른 CSS 클래스
const getStatusClass = (status) => {
    switch (status) {
        case '예약확정':
            return 'confirmed'
        case '예약대기':
            return 'pending'
        case '예약취소':
            return 'cancelled'
        default:
            return 'confirmed'
    }
}

// 예약 상세 페이지로 이동
const goToDetail = (reservationId) => {
    router.push(`/mypage/reservations/${reservationId}`)
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    // 실제로는 API 호출
    // loadReservations()
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
.reservation-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.5;
    color: var(--text-primary);
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem 20px;
}

.page-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    text-align: center;
}

.page-subtitle {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
}

.reservation-table {
    background: white;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.table-header {
    background: var(--bg-light);
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.header-item {
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    font-size: 0.95rem;
}

.header-item:first-child {
    text-align: left;
}

.reservation-item {
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: var(--transition);
}

.reservation-item:hover {
    background: var(--bg-light);
}

.reservation-item:last-child {
    border-bottom: none;
}

.reservation-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1.25rem 1rem;
    align-items: center;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.reservation-date {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.product-title {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.4;
    margin-bottom: 0.75rem;
}

.people-info {
    display: flex;
    gap: 0.5rem;
}

.people-badge {
    background: var(--bg-light);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.people-badge.adult {
    background: #e0e7ff;
    color: var(--text-secondary);
}

.people-badge.child {
    background: #e0e7ff;
    color: var(--text-secondary);
}

.departure-date {
    text-align: center;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--primary-color);
}

.price {
    text-align: center;
}

.amount {
    font-size: 1rem;
    font-weight: 600;
    color: #dc2626;
}

.status {
    text-align: center;
}

.status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    display: inline-block;
    min-width: 80px;
}

.status-badge.confirmed {
    background: #dcfce7;
    color: var(--success-color);
}

.status-badge.pending {
    background: #fef3c7;
    color: var(--warning-color);
}

.status-badge.cancelled {
    background: #fee2e2;
    color: var(--error-color);
}

.no-reservations {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .reservation-page {
        padding: 1rem 15px;
    }

    .page-title {
        font-size: 1.3rem;
    }

    .table-header {
        display: none;
    }

    .reservation-content {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
    }

    .product-info {
        order: 1;
    }

    .departure-date {
        order: 2;
        text-align: left;
        padding: 0.5rem;
        background: var(--bg-light);
        border-radius: var(--border-radius);
    }

    .departure-date::before {
        content: '출발일: ';
        font-weight: 500;
        color: var(--text-secondary);
    }

    .price {
        order: 3;
        text-align: left;
        padding: 0.5rem;
        background: var(--bg-light);
        border-radius: var(--border-radius);
    }

    .price::before {
        content: '결제금액: ';
        font-weight: 500;
        color: var(--text-secondary);
    }

    .status {
        order: 4;
        text-align: left;
    }

    .people-info {
        flex-wrap: wrap;
    }
}
</style> 