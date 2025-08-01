<template>
  <div class="starting-points-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">출발장소 안내</h1>
        <p class="page-subtitle">여행 상품의 출발장소 정보를 확인하세요</p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-state">
        <p>출발장소 정보를 불러오는 중입니다...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <!-- 출발장소 목록 -->
      <div v-else class="starting-points-content">
        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="출발장소명을 입력해주세요" 
              v-model="searchQuery"
              class="search-input"
            >
            <button @click="handleSearch" class="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="points-grid">
          <div 
            v-for="point in filteredPoints" 
            :key="point.id" 
            class="point-card"
          >
            <div class="point-header">
              <h3 class="point-name">{{ point.name }}</h3>
              <span v-if="point.time" class="point-time">{{ formatTime(point.time) }}</span>
            </div>
            <div v-if="point.address" class="point-address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ point.address }}</span>
            </div>
            <div v-if="point.description" class="point-description">
              {{ point.description }}
            </div>
            <div class="point-products">
              <span class="products-label">관련 상품:</span>
              <div class="products-list">
                <span 
                  v-for="product in point.products" 
                  :key="product.id" 
                  class="product-tag"
                >
                  {{ product.title }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredPoints.length === 0 && !isLoading" class="no-points">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAllProducts } from '@/lib/products.js'
import { getAllStartingPoints } from '@/lib/startingpoints.js'

// 상태 관리
const isLoading = ref(false)
const error = ref(null)
const startingPoints = ref([])
const searchQuery = ref('')

// 검색된 출발장소 필터링
const filteredPoints = computed(() => {
  if (!searchQuery.value.trim()) {
    return startingPoints.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return startingPoints.value.filter(point => 
    point.name.toLowerCase().includes(query) ||
    point.address?.toLowerCase().includes(query) ||
    point.description?.toLowerCase().includes(query)
  )
})

// 시간 포맷팅
const formatTime = (timeString) => {
  if (!timeString) return ''
  return timeString.substring(0, 5) // HH:MM 형식으로 변환
}

// 출발장소 데이터 로드
const loadStartingPoints = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await getAllStartingPoints()
    if (response.success) {
      startingPoints.value = response.startingPoints
    } else {
      error.value = response.error || '출발장소 정보를 불러오는데 실패했습니다.'
    }
  } catch (e) {
    error.value = e.message || '출발장소 정보를 불러오는데 실패했습니다.'
    console.error('출발장소 정보 조회 실패:', e)
  } finally {
    isLoading.value = false
  }
}

// 검색 처리
const handleSearch = () => {
  // 검색은 computed에서 자동으로 처리됨
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadStartingPoints()
})
</script>

<style scoped>
.starting-points-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

.error-state {
  color: var(--error-color);
}

.search-section {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-btn {
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: var(--primary-dark);
}

.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.point-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.point-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.point-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.point-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.point-time {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: var(--primary-light);
  border-radius: 12px;
}

.point-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.point-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.point-products {
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
}

.products-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  color: var(--text-secondary);
  border-radius: 12px;
  font-weight: 500;
}

.no-points {
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .starting-points-page {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .points-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .point-card {
    padding: 1rem;
  }
  
  .point-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 