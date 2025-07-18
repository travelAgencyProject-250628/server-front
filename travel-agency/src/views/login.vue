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
                        <form @submit.prevent="handleLogin" class="form">
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
                        <form @submit.prevent="handleGuestReservation" class="form">
                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model="guestData.reservationNumber" 
                                        class="form-input"
                                        placeholder="예약번호"
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
                                        placeholder="휴대폰번호 ( - 없이 입력)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-login">예약조회</button>
                        </form>
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
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 라우터 사용
const router = useRouter()

// 반응형 데이터
const activeTab = ref('member')

// 로그인 데이터
const loginData = reactive({
    email: '',
    password: ''
})

// 비회원 예약조회 데이터
const guestData = reactive({
    reservationNumber: '',
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

const handleGuestReservation = () => {
    if (!guestData.reservationNumber || !guestData.phone) {
        alert('예약번호와 휴대폰번호를 입력해주세요.')
        return
    }

    // 실제로는 서버 API 호출
    console.log('예약조회:', guestData)
    alert('예약조회 기능은 준비 중입니다.')
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
    padding: 2rem 0;
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
    padding: 1rem;
    background:white;
    border: none;
    font-size: 1rem;
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
    padding: 2rem;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    left: 1rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
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
    padding: 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1.1rem;
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
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.link-button {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 0.9rem;
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
    .page-title {
        font-size: 2rem;
    }

    .container {
        padding: 0 15px;
    }

    .login-form,
    .guest-form {
        padding: 1.5rem;
    }

    .tab-button {
        padding: 0.75rem;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.75rem;
    }

    .login-links {
        flex-direction: column;
        gap: 1rem;
    }

    .link-divider {
        display: none;
    }
}
</style>