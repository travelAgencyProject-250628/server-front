<template>
    <div class="login-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">로그인</h1>
                    <p class="page-description">로그인을 하시면 회원만의 서비스를 이용하실 수 있습니다.</p>
                </div>

                <!-- 로그인 폼 -->
                <div class="login-form-wrapper">
                    <!-- 탭 메뉴 -->
                    <div class="tab-menu">
                        <button 
                            type="button" 
                            class="tab-button" 
                            :class="{ active: activeTab === 'member' }"
                            @click="activeTab = 'member'"
                        >
                            회원 로그인
                        </button>
                        <button 
                            type="button" 
                            class="tab-button" 
                            :class="{ active: activeTab === 'guest' }"
                            @click="activeTab = 'guest'"
                        >
                            비회원 예약조회
                        </button>
                    </div>

                    <!-- 회원 로그인 -->
                    <div v-if="activeTab === 'member'" class="login-form">
                        <!-- 카카오 인증 완료 메시지 -->
                        <div v-if="kakaoAuthSuccess" class="kakao-success-message">
                            <div class="success-icon">✅</div>
                            <p>카카오 인증이 완료되었습니다. 추가 정보를 입력해주세요.</p>
                        </div>
                        
                        <form @submit.prevent="handleLogin" class="form" novalidate>
                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#9CA3AF"/>
                                            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#9CA3AF"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        v-model="loginData.email" 
                                        class="form-input"
                                        placeholder="이메일"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" fill="#9CA3AF"/>
                                            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="password" 
                                        v-model="loginData.password" 
                                        class="form-input"
                                        placeholder="비밀번호"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-login">로그인</button>
                        </form>

                        <!-- 소셜 로그인 -->
                        <div class="social-login">
                            <div class="divider">
                                <span class="divider-text">또는</span>
                            </div>
                            <button type="button" class="btn-kakao-login" @click="handleKakaoLogin">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 3C6.48 3 2 6.48 2 12c0 4.41 2.72 8.18 6.56 9.72.48.09.88-.18.88-.66v-2.24c-2.67.58-5.44-1.08-5.44-3.82 0-2.12 1.72-3.84 3.84-3.84 2.12 0 3.84 1.72 3.84 3.84 0 2.74-2.77 4.4-5.44 3.82v2.24c0 .48.4.75.88.66C9.28 20.18 12 16.41 12 12c0-4.96-4.04-9-9-9z" fill="#FEE500"/>
                                    <path d="M12 3C6.48 3 2 6.48 2 12c0 4.41 2.72 8.18 6.56 9.72.48.09.88-.18.88-.66v-2.24c-2.67.58-5.44-1.08-5.44-3.82 0-2.12 1.72-3.84 3.84-3.84 2.12 0 3.84 1.72 3.84 3.84 0 2.74-2.77 4.4-5.44 3.82v2.24c0 .48.4.75.88.66C9.28 20.18 12 16.41 12 12c0-4.96-4.04-9-9-9z" fill="#FEE500"/>
                                </svg>
                                카카오로 로그인
                            </button>
                        </div>

                        <!-- 하단 링크 -->
                        <div class="login-links">
                            <button type="button" class="link-button" @click="findId">아이디 찾기</button>
                            <span class="link-divider">|</span>
                            <button type="button" class="link-button" @click="findPassword">비밀번호 찾기</button>
                            <span class="link-divider">|</span>
                            <button type="button" class="link-button" @click="goToJoin">회원가입</button>
                        </div>
                    </div>

                    <!-- 비회원 예약조회 -->
                    <div v-if="activeTab === 'guest'" class="guest-form">
                        <form @submit.prevent="handleGuestReservation" class="form" novalidate>
                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#9CA3AF"/>
                                            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#9CA3AF"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model="guestData.name" 
                                        class="form-input"
                                        placeholder="예약자명"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="#9CA3AF" stroke-width="2" fill="none"/>
                                            <circle cx="12" cy="18" r="1" fill="#9CA3AF"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model="guestData.phone" 
                                        class="form-input"
                                        placeholder="휴대폰번호 (010-1234-5678)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-login" :disabled="isLoading">
                                {{ isLoading ? '조회 중...' : '예약조회' }}
                            </button>
                        </form>

                        <!-- 예약조회 결과 -->
                        <div v-if="showGuestResults && guestReservations.length > 0" class="reservation-results">
                            <h3 class="results-title">예약 조회 결과</h3>
                            <div class="reservation-list">
                                <div v-for="reservation in guestReservations" :key="reservation.id" class="reservation-item">
                                    <div class="reservation-header">
                                        <h4 class="product-title">{{ reservation.product?.title || '상품명 없음' }}</h4>
                                        <span class="reservation-status" :class="`status-${reservation.status}`">
                                            {{ getStatusText(reservation.status) }}
                                        </span>
                                    </div>
                                    <div class="reservation-details">
                                        <div class="detail-row">
                                            <span class="detail-label">예약번호:</span>
                                            <span class="detail-value">{{ reservation.id }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">출발일:</span>
                                            <span class="detail-value">{{ formatDate(reservation.departure_date) }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">출발지:</span>
                                            <span class="detail-value">
                                                {{ reservation.starting_point?.name || '미정' }}
                                                <span v-if="reservation.departureTime" class="departure-time">
                                                    ({{ formatTime(reservation.departureTime) }})
                                                </span>
                                            </span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">인원:</span>
                                            <span class="detail-value">
                                                성인 {{ reservation.adult_count }}명, 
                                                아동 {{ reservation.child_count }}명
                                            </span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">예약일:</span>
                                            <span class="detail-value">{{ formatDateTime(reservation.created_at) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../lib/auth.js'
import { getGuestReservations } from '../lib/reservations.js'

// 라우터 사용
const router = useRouter()

// 반응형 데이터
const activeTab = ref('member')
const isLoading = ref(false)
const guestReservations = ref([])
const showGuestResults = ref(false)

// URL 파라미터에서 탭 설정
const route = useRouter().currentRoute
if (route.value.query.tab === 'guest') {
    activeTab.value = 'guest'
}

// 카카오 인증 완료 상태 확인
const kakaoAuthSuccess = ref(false)
if (route.value.query.kakao_auth === 'success') {
    // 카카오 인증이 완료된 경우 처리
    console.log('카카오 인증 완료됨')
    kakaoAuthSuccess.value = true
    // URL에서 파라미터 제거
    router.replace('/login')
}

// 로그인 데이터
const loginData = reactive({
    email: '',
    password: ''
})

// 비회원 예약조회 데이터
const guestData = reactive({
    name: '',
    phone: ''
})

// 메서드들
const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
        alert('이메일과 비밀번호를 입력해주세요.')
        return
    }

    try {
        const result = await authService.signIn(loginData.email, loginData.password)
        
        if (result.success) {
            // 로그인 후 원래 가려던 페이지로 리디렉션
            const redirectPath = router.currentRoute.value.query.redirect || '/'
            router.push(redirectPath)
        } else {
            alert(`로그인 실패: ${result.message}`)
        }
    } catch (error) {
        alert(`로그인 중 오류가 발생했습니다: ${error.message}`)
    }
}

const handleKakaoLogin = async () => {
    try {
        // 원래 가려던 페이지 URL 가져오기
        const redirectPath = router.currentRoute.value.query.redirect || '/'
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
        
        console.log('카카오 로그인 시작, redirectTo:', redirectTo)
        
        const result = await authService.signInWithKakao(redirectTo)
        
        if (result.success) {
            console.log('카카오 로그인 시작됨')
            // 카카오 로그인은 자동으로 리디렉션되므로 여기서는 아무것도 하지 않음
        } else {
            alert(`카카오 로그인 실패: ${result.message}`)
        }
    } catch (error) {
        console.error('카카오 로그인 오류:', error)
        alert(`카카오 로그인 중 오류가 발생했습니다: ${error.message}`)
    }
}

const handleGuestReservation = async () => {
    if (!guestData.name || !guestData.phone) {
        alert('예약자명과 휴대폰번호를 입력해주세요.')
        return
    }

    isLoading.value = true
    showGuestResults.value = false
    
    try {
        const result = await getGuestReservations(guestData.name, guestData.phone)
        
        if (result.success) {
            guestReservations.value = result.reservations
            showGuestResults.value = true
            
            if (result.reservations.length === 0) {
                alert('해당 정보로 조회된 예약이 없습니다.')
            }
        } else {
            alert(`예약조회 실패: ${result.error}`)
        }
    } catch (error) {
        alert(`예약조회 중 오류가 발생했습니다: ${error.message}`)
    } finally {
        isLoading.value = false
    }
}

const findId = () => {
    router.push('/find-account?tab=findId')
}

const findPassword = () => {
    router.push('/find-account?tab=findPassword')
}

const goToJoin = () => {
    router.push('/join')
}

// 유틸리티 함수들
const getStatusText = (status) => {
    switch (status) {
        case 'pending':
            return '예약대기'
        case 'confirmed':
            return '예약확정'
        case 'cancelled':
            return '예약취소'
        default:
            return status || '대기중'
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[date.getDay()]
    return `${year}.${month}.${day} (${dayName})`
}

const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.substring(0, 5)
}

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const date = new Date(dateTimeString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}.${month}.${day} ${hours}:${minutes}`
}
</script>

<style scoped>


/* 전체 레이아웃 */
.login-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

.container {
    max-width: 500px;
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



.page-description {
    color: var(--text-secondary);
    font-size: 1rem;
    margin: 0;
}

/* 로그인 폼 */
.login-form-wrapper {
    background: white;
    border-radius: var(--border-radius);
    overflow: hidden;
}

/* 탭 메뉴 */
.tab-menu {
    display: flex;
    border-bottom: 1px solid var(--border-color);
}

.tab-button {
    flex: 1;
    padding: 0.875rem;
    background:white;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    border-bottom: 3px solid transparent;
}

.tab-button.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    font-weight: 600;
}

/* 폼 스타일 */
.login-form,
.guest-form {
    padding: 1.5rem;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.input-group {
    display: flex;
    flex-direction: column;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 0.875rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-input {
    width: 100%;
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    background-color: #f5f5f5;
    color: var(--text-primary);
    transition: var(--transition);
}

.form-input:focus {
    outline: none;
    background-color: #eeeeee;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
    color: #9ca3af;
}

/* 로그인 버튼 */
.btn-login {
    background: var(--primary-color);
    color: white;
    padding: 0.875rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 0.5rem;
}

.btn-login:hover {
    background: var(--primary-dark);
}

/* 하단 링크 */
.login-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-color);
}

.link-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 0.85rem;
    cursor: pointer;
    transition: var(--transition);
}

.link-button:hover {
    color: var(--primary-color);
}

.link-divider {
    color: var(--border-color);
    font-size: 0.9rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }

    .login-form,
    .guest-form {
        padding: 1.5rem;
    }

    .tab-button {
        padding: 0.75rem;
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .login-links {
        flex-direction: column;
        gap: 1rem;
    }

    .link-divider {
        display: none;
    }
}

/* 예약조회 결과 스타일 */
.reservation-results {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.results-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.reservation-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.reservation-item {
    background: var(--bg-light);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
}

.reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
}

.product-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    flex: 1;
}

.reservation-status {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    margin-left: 0.5rem;
}

.status-pending {
    background: #fef3c7;
    color: #d97706;
}

.status-confirmed {
    background: #d1fae5;
    color: #059669;
}

.status-cancelled {
    background: #fee2e2;
    color: #dc2626;
}

.reservation-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.detail-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 60px;
}

.detail-value {
    font-size: 0.85rem;
    color: var(--text-primary);
}

.departure-time {
    color: var(--primary-color);
    font-weight: 500;
}

/* 소셜 로그인 */
.social-login {
    margin-top: 1.5rem;
}

.divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
}

.divider-text {
    background: white;
    padding: 0 1rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
    position: relative;
    z-index: 1;
}

.btn-kakao-login {
    width: 100%;
    background: #FEE500;
    color: #3C1E1E;
    padding: 0.875rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-kakao-login:hover {
    background: #FDD835;
}

.btn-kakao-login svg {
    width: 20px;
    height: 20px;
}

/* 카카오 인증 완료 메시지 */
.kakao-success-message {
    background: #d1fae5;
    border: 1px solid #10b981;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.success-icon {
    font-size: 1.25rem;
}

.kakao-success-message p {
    margin: 0;
    color: #065f46;
    font-weight: 500;
}

/* 로딩 상태 */
.btn-login:disabled {
    background: var(--text-secondary);
    cursor: not-allowed;
}

.btn-login:disabled:hover {
    background: var(--text-secondary);
}
</style>