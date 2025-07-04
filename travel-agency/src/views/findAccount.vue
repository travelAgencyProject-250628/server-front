<template>
    <div class="find-account-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">아이디/비밀번호 찾기</h1>
                    <p class="page-description">아래 정보를 정확히 입력해 주세요.</p>
                </div>

                <!-- 찾기 폼 -->
                <div class="find-form-wrapper">
                    <!-- 탭 메뉴 -->
                    <div class="tab-menu">
                        <button 
                            type="button" 
                            class="tab-button" 
                            :class="{ active: activeTab === 'findId' }"
                            @click="activeTab = 'findId'"
                        >
                            아이디 찾기
                        </button>
                        <button 
                            type="button" 
                            class="tab-button" 
                            :class="{ active: activeTab === 'findPassword' }"
                            @click="activeTab = 'findPassword'"
                        >
                            비밀번호 찾기
                        </button>
                    </div>

                    <!-- 아이디 찾기 -->
                    <div v-if="activeTab === 'findId'" class="find-form">
                        <form @submit.prevent="handleFindId" class="form">
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
                                        v-model="findIdData.name" 
                                        class="form-input"
                                        placeholder="이 름"
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
                                        v-model="findIdData.phone" 
                                        class="form-input"
                                        placeholder="핸드폰번호 ( - 입력제외)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-find">아이디 찾기</button>
                        </form>
                    </div>

                    <!-- 비밀번호 찾기 -->
                    <div v-if="activeTab === 'findPassword'" class="find-form">
                        <form @submit.prevent="handleFindPassword" class="form">
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
                                        v-model="findPasswordData.userId" 
                                        class="form-input"
                                        placeholder="아이디"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="input-group">
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="#9CA3AF" stroke-width="2" fill="none"/>
                                            <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                            <line x1="9" y1="9" x2="9.01" y2="9" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
                                            <line x1="15" y1="9" x2="15.01" y2="9" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        v-model="findPasswordData.name" 
                                        class="form-input"
                                        placeholder="이 름"
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
                                        v-model="findPasswordData.phone" 
                                        class="form-input"
                                        placeholder="핸드폰번호 ( - 입력제외)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-find">비밀번호 찾기</button>
                        </form>

                        <!-- 안내 문구 -->
                        <div class="notice">
                            <p class="notice-text">※임시 비밀번호를 문자로 발급합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 라우터 사용
const router = useRouter()
const route = useRoute()

// 반응형 데이터
const activeTab = ref('findId')

// URL 파라미터에 따라 탭 설정
onMounted(() => {
    const tab = route.query.tab
    if (tab === 'findPassword') {
        activeTab.value = 'findPassword'
    } else {
        activeTab.value = 'findId'
    }
})

// 아이디 찾기 데이터
const findIdData = reactive({
    name: '',
    phone: ''
})

// 비밀번호 찾기 데이터
const findPasswordData = reactive({
    userId: '',
    name: '',
    phone: ''
})

// 메서드들
const handleFindId = () => {
    if (!findIdData.name || !findIdData.phone) {
        alert('이름과 핸드폰번호를 입력해주세요.')
        return
    }

    // 실제로는 서버 API 호출
    console.log('아이디 찾기:', findIdData)
    
    // 임시 로직
    if (findIdData.name === '홍길동' && findIdData.phone === '01012345678') {
        alert('찾으시는 아이디는 "testuser" 입니다.')
    } else {
        alert('입력하신 정보로 등록된 아이디를 찾을 수 없습니다.')
    }
}

const handleFindPassword = () => {
    if (!findPasswordData.userId || !findPasswordData.name || !findPasswordData.phone) {
        alert('모든 항목을 입력해주세요.')
        return
    }

    // 실제로는 서버 API 호출
    console.log('비밀번호 찾기:', findPasswordData)
    
    // 임시 로직
    if (findPasswordData.userId === 'testuser' && 
        findPasswordData.name === '홍길동' && 
        findPasswordData.phone === '01012345678') {
        alert('임시 비밀번호가 문자로 발송되었습니다.')
    } else {
        alert('입력하신 정보가 일치하지 않습니다.')
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
.find-account-page {
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

/* 찾기 폼 */
.find-form-wrapper {
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
    background: white;
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
.find-form {
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

/* 찾기 버튼 */
.btn-find {
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

.btn-find:hover {
    background: var(--primary-dark);
}

/* 안내 문구 */
.notice {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.notice-text {
    color: #dc2626;
    font-size: 0.9rem;
    margin: 0;
    text-align: left;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }

    .container {
        padding: 0 15px;
    }

    .find-form {
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
}
</style> 