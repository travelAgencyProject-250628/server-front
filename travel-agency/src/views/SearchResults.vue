<template>
  <div class="product-list-page">
    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 페이지 헤더 -->
        <div class="page-header">
          <h1 class="page-title">"{{ searchQuery }}" 검색 결과</h1>
          <div class="breadcrumb">
            <span>홈</span>
            <span class="separator">></span>
            <span>검색 결과</span>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>검색 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>검색 중 오류가 발생했습니다</h3>
          <p>{{ error }}</p>
          <button @click="retrySearch" class="retry-btn">다시 시도</button>
        </div>

        <!-- 검색 결과 없음 -->
        <div v-else-if="!loading && products.length === 0" class="no-products">
          <div class="no-results-icon">🔍</div>
          <h3>검색 결과가 없습니다</h3>
          <p>"{{ searchQuery }}"에 대한 검색 결과를 찾을 수 없습니다.</p>
          <div class="suggestions">
            <h4>검색 팁:</h4>
            <ul>
              <li>다른 키워드로 검색해보세요</li>
              <li>검색어의 철자를 확인해보세요</li>
              <li>더 일반적인 단어로 검색해보세요</li>
            </ul>
          </div>
          <router-link to="/" class="home-btn">홈으로 돌아가기</router-link>
        </div>

        <!-- 검색 결과 -->
        <div v-else>
          <!-- 상품 정렬 및 뷰 -->
          <div class="filter-section">
            <div class="filter-right">
              <div class="sort-group">
                <label>정렬:</label>
                <select v-model="sortBy" @change="sortProducts">
                  <option value="recent">최신순</option>
                  <option value="price-low">가격 낮은순</option>
                  <option value="price-high">가격 높은순</option>
                </select>
              </div>
              <div class="view-toggle">
                <button 
                  :class="['view-btn', { active: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                </button>
                <button 
                  :class="['view-btn', { active: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 상품 개수 표시 -->
          <div class="product-count">
            총 <strong>{{ totalResults }}</strong>개의 상품을 찾았습니다.
            ({{ currentPage }}/{{ totalPages }} 페이지)
          </div>

          <!-- 상품 그리드 -->
          <div class="product-grid" :class="{ 'list-view': viewMode === 'list' }">
            <div 
              v-for="product in sortedProducts" 
              :key="product.id"
              class="product-card"
              @click="goToProduct(product.id)"
            >
              <div class="product-image">
                <img 
                  :src="getProductImage(product)" 
                  :alt="product.title"
                  @error="handleImageError"
                />
              </div>
              <div class="product-info">
                <div class="product-number">상품번호 {{ product.id }}</div>
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="product-price">
                  <span class="current-price">{{ formatPrice(product.adult_price) }}원</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              이전
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              :class="['page-btn', { active: page === currentPage }]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchProducts } from '@/lib/search.js'

const route = useRoute()
const router = useRouter()

// 반응형 데이터
const loading = ref(false)
const error = ref('')
const products = ref([])
const totalResults = ref(0)
const currentPage = ref(1)
const sortBy = ref('recent')
const viewMode = ref('grid')

// 검색어
const searchQuery = computed(() => route.query.q || '')

// 페이지네이션 계산
const totalPages = computed(() => Math.ceil(totalResults.value / 12))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 정렬된 상품 목록
const sortedProducts = computed(() => {
  const sorted = [...products.value]
  
  switch (sortBy.value) {
    case 'price-low':
      return sorted.sort((a, b) => (a.adult_price || 0) - (b.adult_price || 0))
    case 'price-high':
      return sorted.sort((a, b) => (b.adult_price || 0) - (a.adult_price || 0))
    case 'recent':
    default:
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
})

// 메서드들
const performSearch = async () => {
  console.log('🚀 performSearch 함수 호출됨')
  console.log('🔍 검색 조건:', { 
    searchQuery: searchQuery.value, 
    currentPage: currentPage.value,
    trimmed: searchQuery.value?.trim()
  })
  
  if (!searchQuery.value.trim()) {
    console.log('❌ 검색어가 비어있음')
    error.value = '검색어를 입력해주세요.'
    return
  }

  console.log('🔄 검색 시작...')
  loading.value = true
  error.value = ''

  try {
    console.log('📡 searchProducts API 호출 중...')
    const result = await searchProducts(searchQuery.value, currentPage.value, 12)
    console.log('📡 searchProducts API 응답:', result)
    
    if (result.success) {
      products.value = result.products
      totalResults.value = result.total
      console.log('✅ 검색 완료:', result.products.length, '개')
    } else {
      console.log('❌ 검색 실패:', result.error)
      error.value = result.error
      products.value = []
      totalResults.value = 0
    }
  } catch (err) {
    console.error('💥 검색 예외 발생:', err)
    error.value = '검색 중 오류가 발생했습니다.'
    products.value = []
    totalResults.value = 0
  } finally {
    loading.value = false
    console.log('🏁 검색 프로세스 완료')
  }
}

const retrySearch = () => {
  performSearch()
}

const sortProducts = () => {
  // 정렬은 computed property에서 자동으로 처리됨
  console.log('정렬 변경:', sortBy.value)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    router.push({
      query: { 
        ...route.query, 
        page: page.toString() 
      }
    })
  }
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const getProductImage = (product) => {
  // main_image_url이 있으면 사용, 없으면 빈 문자열 (CSS로 처리)
  return product.main_image_url || ''
}

const handleImageError = (event) => {
  // 이미 에러 처리된 경우 무시
  if (event.target.dataset.errorHandled) {
    return
  }
  
  // 에러 처리 플래그 설정
  event.target.dataset.errorHandled = 'true'
  event.target.style.display = 'none'
  
  // 이미지 컨테이너에 플레이스홀더 표시
  const container = event.target.parentElement
  if (container) {
    container.classList.add('image-error')
  }
}

const formatPrice = (price) => {
  return price?.toLocaleString() || '0'
}

// 라우트 변경 감지 - 강제로 실행
watch(() => route.query, (newQuery) => {
  console.log('🔍 라우트 쿼리 변경 감지:', newQuery)
  
  const query = newQuery.q
  const page = parseInt(newQuery.page) || 1
  
  console.log('🔍 검색 조건:', { query, page })
  
  // 검색어가 있으면 무조건 검색 실행
  if (query) {
    console.log('🔄 검색 실행!')
    currentPage.value = page
    performSearch()
  }
}, { immediate: true, deep: true })

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  console.log('SearchResults 컴포넌트 마운트됨')
  // watch의 immediate: true 옵션으로 인해 자동으로 검색이 실행됨
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
  --error-color: #ef4444;
}

.product-list-page {
  min-height: 100vh;
  background: var(--bg-light);
  display: flex;
}

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.content-container {
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem 20px;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.breadcrumb {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.separator {
  margin: 0 0.5rem;
  color: var(--border-color);
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
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
  text-align: center;
  padding: 4rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: var(--error-color);
  margin-bottom: 0.5rem;
}

.error-container p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.retry-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.retry-btn:hover {
  background: var(--primary-dark);
}

/* 검색 결과 없음 */
.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-products h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.no-products p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.suggestions {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.suggestions h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.suggestions ul {
  text-align: left;
  color: var(--text-secondary);
  line-height: 1.6;
}

.home-btn {
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: var(--transition);
  display: inline-block;
}

.home-btn:hover {
  background: var(--primary-dark);
}

/* 필터 섹션 */
.filter-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.sort-group select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  background: white;
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.view-btn {
  padding: 0.5rem;
  background: white;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.view-btn:hover {
  background: var(--bg-light);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
}

/* 상품 개수 */
.product-count {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 상품 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-grid.list-view {
  grid-template-columns: 1fr;
}

.product-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image.image-error::before {
  content: '🖼️';
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 2rem;
}

.product-image:empty::before {
  content: '🖼️';
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 2rem;
}

/* 상품 정보 */
.product-info {
  padding: 1rem;
}

.product-number {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin-bottom: 0.75rem;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--error-color);
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-secondary);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
  background: var(--bg-light);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 리스트 뷰 스타일 */
.product-grid.list-view .product-card {
  display: flex;
  height: 200px;
}

.product-grid.list-view .product-image {
  width: 300px;
  height: 200px;
  flex-shrink: 0;
}

.product-grid.list-view .product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .content-container {
    padding: 1rem;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-section {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .sort-group select {
    font-size: 0.9rem;
    padding: 0.4rem;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style> 