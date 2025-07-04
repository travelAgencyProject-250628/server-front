<template>
  <div class="supabase-test-view">
    <div class="container">
      <h1>🔧 Supabase 연결 테스트</h1>
      <p class="description">
        이 페이지는 Supabase 연결 상태를 확인하는 개발용 페이지입니다.
        프로덕션에서는 이 페이지를 제거하거나 접근을 제한해야 합니다.
      </p>
      
      <div class="test-section">
        <h2>연결 상태</h2>
        <div v-if="loading" class="status loading">
          🔄 연결 확인 중...
        </div>
        <div v-else-if="error" class="status error">
          ❌ 연결 실패: {{ error }}
        </div>
        <div v-else class="status success">
          ✅ Supabase 연결 성공!
        </div>
        
        <button @click="testConnection" :disabled="loading" class="test-btn">
          {{ loading ? '테스트 중...' : '연결 재테스트' }}
        </button>
      </div>

      <div class="info-section">
        <h3>환경 변수 확인</h3>
        <div class="env-info">
          <p><strong>URL 설정:</strong> {{ hasUrl ? '✅ 설정됨' : '❌ 설정 안됨' }}</p>
          <p><strong>API Key 설정:</strong> {{ hasKey ? '✅ 설정됨' : '❌ 설정 안됨' }}</p>
        </div>
      </div>

      <div class="warning">
        <h3>⚠️ 보안 주의사항</h3>
        <ul>
          <li>이 페이지는 개발 환경에서만 사용하세요</li>
          <li>프로덕션 배포 시 이 페이지를 제거하세요</li>
          <li>환경 변수는 절대 클라이언트에 노출하지 마세요</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase.js'

const loading = ref(false)
const error = ref(null)
const hasUrl = ref(false)
const hasKey = ref(false)

const testConnection = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 간단한 쿼리로 연결 테스트
    const { data, error: queryError } = await supabase
      .from('_dummy_table_')
      .select('*')
      .limit(1)
    
    // 테이블이 없어도 연결은 성공
    if (queryError && queryError.code === 'PGRST116') {
      // 테이블이 없는 경우 (정상적인 연결)
      console.log('Supabase 연결 성공!')
    } else if (queryError) {
      throw queryError
    }
  } catch (err) {
    error.value = err.message
    console.error('Supabase 연결 오류:', err)
  } finally {
    loading.value = false
  }
}

const checkEnvironmentVariables = () => {
  hasUrl.value = !!import.meta.env.VITE_SUPABASE_URL
  hasKey.value = !!import.meta.env.VITE_SUPABASE_ANON_KEY
}

onMounted(() => {
  checkEnvironmentVariables()
  testConnection()
})
</script>

<style scoped>
.supabase-test-view {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.description {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.test-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.status {
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
  font-weight: bold;
}

.status.loading {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.test-btn:hover:not(:disabled) {
  background: #0056b3;
}

.test-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.info-section {
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.env-info p {
  margin: 8px 0;
  font-family: monospace;
}

.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 20px;
  border-radius: 8px;
}

.warning h3 {
  color: #856404;
  margin-top: 0;
}

.warning ul {
  color: #856404;
  margin: 10px 0;
  padding-left: 20px;
}

.warning li {
  margin: 5px 0;
}
</style> 