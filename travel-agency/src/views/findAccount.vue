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
                                        placeholder="핸드폰번호 (010-1234-5678)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-find">이메일 찾기</button>
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
                                        type="email" 
                                        v-model="findPasswordData.email" 
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
                                        placeholder="핸드폰번호 (010-1234-5678)"
                                        required
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn-find">비밀번호 찾기</button>
                        </form>

                        <!-- 안내 문구 -->
                        <div class="notice">
                            <p class="notice-text">※임시 비밀번호를 이메일로 전송합니다.</p>
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
import { authService } from '../lib/auth.js'

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
    email: '',
    name: '',
    phone: ''
})

// 메서드들
const handleFindId = async () => {
    if (!findIdData.name || !findIdData.phone) {
        alert('이름과 핸드폰번호를 입력해주세요.')
        return
    }

    try {
        console.log('아이디 찾기 시도:', findIdData)
    
        const result = await authService.findEmail(findIdData.name, findIdData.phone)
        
        if (result.success) {
            alert(result.message)
            // 성공 후 폼 초기화
            findIdData.name = ''
            findIdData.phone = ''
    } else {
            alert(result.message)
        }
    } catch (error) {
        console.error('아이디 찾기 오류:', error)
        alert('아이디 찾기에 실패했습니다. 다시 시도해주세요.')
    }
}

const handleFindPassword = async () => {
    if (!findPasswordData.email || !findPasswordData.name || !findPasswordData.phone) {
        alert('모든 항목을 입력해주세요.')
        return
    }

    try {
        console.log('비밀번호 찾기 시도:', findPasswordData)
    
        // 1단계: 사용자 정보 확인
        const verifyResult = await authService.verifyUserForPasswordReset(
            findPasswordData.email, 
            findPasswordData.name, 
            findPasswordData.phone
        )
        
        if (!verifyResult.success) {
            alert(verifyResult.message)
            return
        }

        // 2단계: 비밀번호 재설정 이메일 발송
        const resetResult = await authService.resetPassword(findPasswordData.email)
        
        if (resetResult.success) {
            alert('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인하여 비밀번호를 변경해주세요.')
            // 성공 후 폼 초기화
            findPasswordData.email = ''
            findPasswordData.name = ''
            findPasswordData.phone = ''
    } else {
            alert(resetResult.message)
        }
    } catch (error) {
        console.error('비밀번호 찾기 오류:', error)
        alert('비밀번호 찾기에 실패했습니다. 다시 시도해주세요.')
    }
}
</script>

<style scoped>

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
    padding: 3.5rem 0 2rem 0;
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
.find-form {
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

/* 찾기 버튼 */
.btn-find {
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
    .container {
        padding: 0 15px;
    }

    .find-form {
        padding: 1.5rem;
    }

    .tab-button {
        padding: 0.75rem;
        font-size: 0.85rem;
    }
}
</style> 