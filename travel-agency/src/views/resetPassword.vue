<template>
    <div class="reset-password-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">비밀번호 재설정</h1>
                    <p class="page-description">새로운 비밀번호를 입력해주세요.</p>
                </div>

                <!-- 비밀번호 재설정 폼 -->
                <div class="reset-form-wrapper">
                    <!-- 로딩 상태 -->
                    <div v-if="isLoading" class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>인증 정보를 확인하는 중...</p>
                    </div>

                    <!-- 에러 상태 -->
                    <div v-else-if="error" class="error-container">
                        <div class="error-icon">⚠️</div>
                        <h2 class="error-title">인증 오류</h2>
                        <p class="error-message">{{ error }}</p>
                        <button @click="goToFindAccount" class="btn-primary">비밀번호 찾기로 돌아가기</button>
                    </div>

                    <!-- 비밀번호 재설정 폼 -->
                    <form v-else @submit.prevent="handleSubmit" class="reset-form">
                        <div class="form-group">
                            <label class="form-label required">
                                <span class="required-icon">⦁</span>
                                새 비밀번호
                            </label>
                            <input 
                                type="password" 
                                v-model="formData.password" 
                                class="form-input"
                                placeholder="새 비밀번호를 입력하세요"
                                :class="{ error: errors.password }"
                                required
                            >
                            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                            <p class="field-notice">* 6자리 이상 입력해주세요</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">
                                <span class="required-icon">⦁</span>
                                새 비밀번호 확인
                            </label>
                            <input 
                                type="password" 
                                v-model="formData.passwordConfirm" 
                                class="form-input"
                                placeholder="새 비밀번호를 다시 입력하세요"
                                :class="{ error: errors.passwordConfirm }"
                                required
                            >
                            <div v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-submit" :disabled="isSubmitting">
                                {{ isSubmitting ? '변경 중...' : '비밀번호 변경' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../lib/auth.js'

const router = useRouter()
const route = useRoute()

// 상태 관리
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref('')

// 폼 데이터
const formData = reactive({
    password: '',
    passwordConfirm: ''
})

// 에러 메시지
const errors = reactive({})

// 비밀번호 재설정 토큰 확인
const checkResetToken = async () => {
    try {
        isLoading.value = true
        
        console.log('전체 URL:', window.location.href)
        console.log('URL 파라미터 확인:', route.query)
        
        // Supabase Auth 상태 변경 이벤트 리스너 설정
        const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth 상태 변경:', event, session)
            
            if (event === 'PASSWORD_RECOVERY') {
                console.log('비밀번호 재설정 이벤트 감지')
                isLoading.value = false
                // 폼을 표시하도록 상태 변경
                return
            }
        })

        // URL에서 토큰 파라미터 확인 (다양한 파라미터명 시도)
        const { token_hash, type, token, access_token, refresh_token } = route.query
        
        console.log('토큰 파라미터들:', { token_hash, type, token, access_token, refresh_token })
        
        // 토큰이 있는 경우 직접 검증 시도
        if (token_hash && type) {
            try {
                const { data, error: verifyError } = await authService.supabase.auth.verifyOtp({
                    token_hash,
                    type: 'recovery'
                })

                if (verifyError) {
                    console.error('토큰 검증 실패:', verifyError)
                    throw new Error('비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.')
                }

                console.log('토큰 검증 성공:', data)
                isLoading.value = false
                return
            } catch (verifyErr) {
                console.error('직접 토큰 검증 실패:', verifyErr)
            }
        }

        // 토큰이 없거나 검증 실패한 경우, 잠시 대기 후 상태 확인
        setTimeout(() => {
            console.log('토큰 검증 대기 완료, 상태 재확인')
            // 현재 세션 상태 확인
            authService.supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('현재 세션:', session)
                if (session) {
                    console.log('세션이 있음, 비밀번호 재설정 가능')
                    isLoading.value = false
                } else {
                    console.log('세션이 없음, 에러 표시')
                    error.value = '비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.'
                    isLoading.value = false
                }
            })
        }, 2000)
        
    } catch (err) {
        console.error('토큰 확인 오류:', err)
        error.value = err.message
        isLoading.value = false
    }
}

// 폼 제출 처리
const handleSubmit = async () => {
    // 에러 초기화
    Object.keys(errors).forEach(key => delete errors[key])
    
    // 유효성 검사
    if (!formData.password) {
        errors.password = '새 비밀번호를 입력해주세요.'
        return
    }
    
    if (formData.password.length < 6) {
        errors.password = '비밀번호는 6자리 이상 입력해주세요.'
        return
    }
    
    if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
        return
    }

    try {
        isSubmitting.value = true
        console.log('비밀번호 변경 시작:', formData.password)
        
        // 비밀번호 변경
        const result = await authService.updatePassword(formData.password)
        console.log('비밀번호 변경 결과:', result)
        console.log('result.success:', result.success)
        console.log('result.message:', result.message)
        
        if (result && result.success) {
            console.log('비밀번호 변경 성공 - 알림 표시')
            try {
                alert('비밀번호가 성공적으로 변경되었습니다.')
                console.log('alert 성공')
            } catch (alertError) {
                console.error('alert 실패:', alertError)
                // alert가 실패하면 다른 방식으로 알림
                console.log('비밀번호가 성공적으로 변경되었습니다!')
            }
            console.log('알림 표시 완료 - 로그아웃 후 로그인 페이지로 이동')
            
            // 비밀번호 변경 후 로그아웃하여 세션 정리
            try {
                await authService.signOut()
                console.log('로그아웃 완료')
            } catch (logoutError) {
                console.error('로그아웃 실패:', logoutError)
            }
            
            // 로그인 페이지로 이동
            router.push('/login')
        } else {
            console.error('비밀번호 변경 실패:', result ? result.message : 'result가 undefined')
            try {
                alert(result ? result.message : '비밀번호 변경에 실패했습니다.')
            } catch (alertError) {
                console.error('alert 실패:', alertError)
                console.log('비밀번호 변경에 실패했습니다.')
            }
        }
    } catch (err) {
        console.error('비밀번호 변경 오류:', err)
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
    } finally {
        console.log('비밀번호 변경 완료, isSubmitting을 false로 설정')
        isSubmitting.value = false
        
        // 추가로 한 번 더 확실하게 해제
        setTimeout(() => {
            isSubmitting.value = false
        }, 100)
    }
}

// 비밀번호 찾기 페이지로 이동
const goToFindAccount = () => {
    router.push('/find-account?tab=findPassword')
}

// 컴포넌트 마운트 시 토큰 확인
onMounted(() => {
    checkResetToken()
})
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
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
.reset-password-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-light);
    min-height: 100vh;
}

.main-content {
    padding: 2rem 0;
}

.container {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 20px;
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

/* 폼 래퍼 */
.reset-form-wrapper {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    overflow: hidden;
}

/* 로딩 상태 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
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

/* 에러 상태 */
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.error-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--error-color);
    margin-bottom: 0.5rem;
}

.error-message {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

/* 폼 스타일 */
.reset-form {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.form-label.required {
    color: var(--text-primary);
}

.required-icon {
    color: var(--error-color);
    margin-right: 0.25rem;
}

.form-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error {
    border-color: var(--error-color);
}

.form-input::placeholder {
    color: var(--text-secondary);
}

.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.field-notice {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    margin-bottom: 0;
}

/* 버튼 스타일 */
.form-actions {
    margin-top: 2rem;
}

.btn-submit {
    width: 100%;
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.btn-submit:hover:not(:disabled) {
    background: var(--primary-dark);
}

.btn-submit:disabled {
    background: var(--secondary-color);
    cursor: not-allowed;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.btn-primary:hover {
    background: var(--primary-dark);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }

    .container {
        padding: 0 15px;
    }

    .reset-form {
        padding: 1.5rem;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.75rem;
    }
}
</style> 