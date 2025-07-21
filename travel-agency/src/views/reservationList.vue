<!-- 예약 확인 페이지 -->
<template>
    <div class="reservation-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">예약/결제현황</h1>
                    <p class="page-subtitle">나라투어와 함께하는 특별한 여행의 예약 현황을 확인하세요</p>
                </div>

                <!-- 로딩 상태 -->
                <div v-if="isLoading" class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>예약 목록을 불러오는 중...</p>
                </div>

                <!-- 에러 상태 -->
                <div v-else-if="error" class="error-container">
                    <p>{{ error }}</p>
                    <button @click="loadReservations" class="retry-button">다시 시도</button>
                </div>

                <!-- 예약 리스트 -->
                <div v-else-if="reservations.length > 0" class="reservation-table">
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
                                    {{ getStatusText(reservation.status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 예약이 없을 때 -->
                <div v-else class="no-reservations">
                    <p>예약된 여행이 없습니다.</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyReservations } from '../lib/reservations.js'

const router = useRouter()

// 상태 관리
const reservations = ref([])
const isLoading = ref(true)
const error = ref(null)

// 예약 목록 로드
const loadReservations = async () => {
    try {
        isLoading.value = true
        error.value = null
        
        const result = await getMyReservations()
        
        if (result.success) {
            reservations.value = result.reservations || []
        } else {
            error.value = result.error || '예약 목록을 불러오는데 실패했습니다.'
            console.error('예약 목록 로드 실패:', result.error)
        }
    } catch (err) {
        error.value = '예약 목록을 불러오는데 실패했습니다.'
        console.error('예약 목록 로드 오류:', err)
    } finally {
        isLoading.value = false
    }
}

// 가격 포맷팅
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 상태에 따른 CSS 클래스
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

// 예약 상세 페이지로 이동
const goToDetail = (reservationId) => {
    router.push(`/mypage/reservations/${reservationId}`)
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    loadReservations()
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
    gap: 0.5rem;
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

.status-badge.completed {
    background-color: var(--success-color);
    color: white;
}

.status-badge.pending {
    background-color: var(--warning-color);
    color: white;
}

.status-badge.cancelled {
    background-color: var(--error-color);
    color: white;
}

.no-reservations {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

/* 로딩 상태 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
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
    margin: 0;
}

/* 에러 상태 */
.error-container {
    text-align: center;
    padding: 4rem 2rem;
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
    .main-content {
        padding-top: 1.5rem;
    }
    
    .container {
        padding: 0 15px;
    }

    .page-title {
        font-size: 1.75rem;
    }

    .page-subtitle {
        font-size: 0.9rem;
    }

    .table-header {
        display: none;
    }

    .reservation-content {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding: 1rem;
    }

    .product-info {
        order: 1;
    }

    .departure-date {
        order: 2;
        text-align: left;
        padding: 0.5rem;
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