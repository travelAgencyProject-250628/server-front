<template>
  <div class="product-list-page">
    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div class="content-container">
        <!-- 페이지 제목 -->
        <div class="filter-section">
          <h1 class="page-title">"{{ searchQuery }}" 검색 결과</h1>
        </div>

        <!-- 상세 검색 필터 (PC 전용) -->
        <div class="srh_dtabox desktop-only">
          <form @submit.prevent="handleSearch" name="fmSearch">
            <table class="tbl_srhdta" cellpadding="0" cellspacing="0" summary="여행상세검색">
              <caption>여행상세검색</caption>
              <colgroup>
                <col width="20%">
                <col width="20%">
                <col width="20%">
                <col width="20%">
                <col width="20%">
              </colgroup>
              <tbody>
                <tr>
                  <td>
                    <select v-model="searchFilters.category" class="srh_select" style="width:100%;">
                      <option value="">상품분류</option>
                      <option 
                        v-for="category in availableCategories" 
                        :key="category.id" 
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select v-model="searchFilters.duration" class="srh_select" style="width:100%;"> 
                      <option value="">여행기간</option>
                      <option 
                        v-for="duration in availableDurations" 
                        :key="duration" 
                        :value="duration"
                      >
                        {{ duration }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      v-model="searchFilters.tourDate" 
                      class="srh_date dateinput" 
                      maxlength="10" 
                      style="width:100%" 
                      placeholder="출발일"
                      disabled
                    >
                  </td>
                  <td>
                    <select v-model="searchFilters.sortType" class="srh_select" style="width:100%;">
                      <option value="popular">인기순</option>
                      <option value="price-high">높은가격순</option>
                      <option value="price-low">낮은가격순</option>
                    </select>
                  </td>
                  <td rowspan="2" class="srh_last hand">
                    <div class="btnsrh">
                      <button type="submit" class="search-btn">상품검색</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <input 
                      type="text" 
                      v-model="searchFilters.keyword" 
                      class="srh_input keyword_find" 
                      maxlength="20" 
                      style="width:100%" 
                      placeholder="상품명, 부제목으로 검색"
                    >
                  </td>
                  <td>
                    <div class="checkbox-container">
                      <input 
                        type="checkbox" 
                        id="fixtour" 
                        v-model="searchFilters.fixTour" 
                        value="1"
                      > 
                      <label for="fixtour">출발확정</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>검색 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button @click="retrySearch" class="retry-button">다시 시도</button>
        </div>

        <!-- 검색 결과가 있을 때 -->
        <template v-else-if="!loading && products.length > 0">
          <!-- 상품 정보 및 정렬 -->
          <div class="filter-info">
            <div class="product-count">
              총 <strong>{{ totalResults }}</strong>개의 상품을 찾았습니다.
              ({{ currentPage }}/{{ totalPages }} 페이지)
            </div>
            <div class="sort-group">
              <label>정렬:</label>
              <select v-model="searchFilters.sortType" @change="handleSortChange">
                <option value="popular">인기순</option>
                <option value="price-high">가격 높은순</option>
                <option value="price-low">가격 낮은순</option>
              </select>
            </div>
          </div>

          <!-- 상품 리스트 -->
          <div class="product-grid list-view">
            <div 
              v-for="product in products" 
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
          <div v-if="totalPages > 0" class="pagination">
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
              :disabled="currentPage >= totalPages || totalPages === 0"
              @click="changePage(currentPage + 1)"
            >
              다음
            </button>
          </div>
        </template>

        <!-- 검색 결과가 없을 때 -->
        <div v-else-if="!loading && products.length === 0" class="no-products">
          <p>"{{ searchQuery }}"에 대한 검색 결과가 없습니다.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchProducts, searchProductsWithFilters, getUniqueDurations, getCategories } from '@/lib/search.js'

const route = useRoute()
const router = useRouter()

// 반응형 데이터
const loading = ref(false)
const error = ref('')
const products = ref([])
const totalResults = ref(0)
const currentPage = ref(1)
const availableDurations = ref([])
const availableCategories = ref([])

// 검색 필터 데이터
const searchFilters = ref({
  category: '',
  duration: '',
  tourDate: '',
  sortType: 'popular',
  keyword: '',
  fixTour: false
})

// 필터 초기값 설정
const initializeFilters = () => {
  searchFilters.value = {
    category: '',
    duration: '',
    tourDate: '',
    sortType: 'popular',
    keyword: '',
    fixTour: false
  }
}

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

// 정렬은 서버에서 처리되므로 클라이언트 정렬 제거

// 메서드들
const performSearch = async () => {
  console.log('🚀 performSearch 함수 호출됨')
  
  // URL의 검색어 사용
  const searchTerm = searchQuery.value?.trim() || ''
  
  console.log('🔍 검색 조건:', { 
    searchTerm: searchTerm,
    searchQuery: searchQuery.value, 
    filterKeyword: searchFilters.value.keyword,
    currentPage: currentPage.value
  })
  
  // 검색어가 비어있어도 필터만으로 검색 가능하도록 허용
  console.log('🔍 검색 시작 (검색어 없어도 필터로 검색 가능)')

  console.log('🔄 검색 시작...')
  loading.value = true
  error.value = ''

  try {
    console.log('📡 searchProductsWithFilters API 호출 중...')
    const result = await searchProductsWithFilters(searchTerm, searchFilters.value, currentPage.value, 12)
    console.log('📡 searchProductsWithFilters API 응답:', result)
    
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

const handleSortChange = () => {
  console.log('정렬 변경:', searchFilters.value.sortType)
  currentPage.value = 1 // 정렬 변경 시 첫 페이지로 리셋
  performSearch()
}

const handleSearch = async () => {
  console.log('🔍 검색 필터:', searchFilters.value)
  console.log('🔍 여행기간 값:', { 
    value: searchFilters.value.duration, 
    type: typeof searchFilters.value.duration 
  })
  
  // 상품 검색 버튼 클릭 시 필터의 검색어로 URL 파라미터 변경
  const searchTerm = searchFilters.value.keyword?.trim() || ''
  console.log('🔍 필터 검색어:', searchTerm)
  
  // URL 파라미터 변경
  router.push({
    query: { 
      q: searchTerm,
      page: '1'
    }
  })
}

// 여행기간 데이터 로드
const loadDurations = async () => {
  try {
    const result = await getUniqueDurations()
    if (result.success) {
      availableDurations.value = result.durations
    }
  } catch (error) {
    console.error('여행기간 로드 오류:', error)
  }
}

// 카테고리 데이터 로드
const loadCategories = async () => {
  try {
    const result = await getCategories()
    if (result.success) {
      availableCategories.value = result.categories
    }
  } catch (error) {
    console.error('카테고리 로드 오류:', error)
  }
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
  
  // URL에 검색어가 있으면 검색 실행 (헤더 검색) - 빈 검색어도 허용
  console.log('🔄 URL 검색어로 검색 실행!')
    currentPage.value = page
    performSearch()
}, { immediate: true, deep: true })

// 필터 변경 감지
watch(searchFilters, () => {
  console.log('🔍 필터 변경 감지:', searchFilters.value)
  currentPage.value = 1
  performSearch()
}, { deep: true })

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  console.log('SearchResults 컴포넌트 마운트됨')
  // 여행기간 데이터 로드
  await loadDurations()
  // 카테고리 데이터 로드
  await loadCategories()
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
  --error-color: #dc2626;
  --success-color: #059669;
  --warning-color: #d97706;
}

/* 전체 레이아웃 */
.product-list-page {
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  padding-top: 3.5rem;
}

/* 제목 섹션 */
.filter-section {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.0rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--primary-color);
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 상세 검색 필터 */
.srh_dtabox {
  padding: 0.5rem;
  background: #f8f9ff;
  /* border: 1px solid var(--border-color); */
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

/* PC 전용 클래스 */
.desktop-only {
  display: block;
}

.tbl_srhdta {
  width: 100%;
  border-collapse: collapse;
}

.tbl_srhdta caption {
  display: none;
}

.tbl_srhdta td {
  padding: 0.5rem;
}

.srh_select,
.srh_date,
.srh_input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dadeec;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  transition: var(--transition);
}

.srh_select:focus,
.srh_date:focus,
.srh_input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.srh_last {
  text-align: center;
  padding: 0.5rem;
  vertical-align: middle;
}

.btnsrh {
  padding: 0.5rem;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-btn {
  background: var(--primary-color);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 1rem 2rem;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  min-height: 80px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.search-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.search-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.checkbox-container input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
  cursor: pointer;
}

.checkbox-container label {
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}

/* 필터 정보 섹션 */
.filter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 400;
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

/* 상품 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.3rem;
  margin-bottom: 2rem;
}

.product-grid.list-view {
  grid-template-columns: 1fr;
}

.product-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}

.product-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.product-image {
  position: relative;
  height: 180px;
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

/* 리스트 뷰 스타일 */
.product-grid.list-view .product-card {
  display: flex;
  height: 180px;
}

.product-grid.list-view .product-image {
  width: 250px;
  height: 180px;
  flex-shrink: 0;
}

.product-grid.list-view .product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 상품 없음 */
.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
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
  border-color: var(--primary-color);
  color: var(--primary-color);
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

.loading-container p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

/* 에러 상태 */
.error-container {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.retry-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;
}

.retry-button:hover {
  background: var(--primary-dark);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .product-list-page {
    padding-top: 2rem;
  }
  
  .main-content {
    padding: 0 1rem 2rem 1rem;
  }
  
  .content-container {
    padding: 0;
  }
  
  /* 모바일에서 상세 검색 필터 숨기기 */
  .desktop-only {
    display: none;
  }
  
  .filter-section {
    font-size: 1.125rem;
    padding-bottom: 0.5rem;
  }

  .filter-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .sort-group {
    align-self: flex-end;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .product-grid.list-view .product-card {
    flex-direction: column;
    height: auto;
  }
  
  .product-grid.list-view .product-image {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .product-list-page {
    padding-top: 1.5rem;
  }
  
  .main-content {
    padding: 0 0.75rem 1.5rem 0.75rem;
  }

  .filter-section {
    font-size: 1rem;
    padding-bottom: 0.5rem;
  }

  .page-title {
    font-size: 1rem;
  }

  .filter-info {
    gap: 0.75rem;
  }

  .product-count {
    font-size: 0.85rem;
  }

  .sort-group label {
    font-size: 0.8rem;
  }

  .sort-group select {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style> 