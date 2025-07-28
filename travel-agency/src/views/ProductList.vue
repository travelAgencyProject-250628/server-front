<!-- 여행 상품 리스트 페이지 -->
<template>
  <div class="product-list-page">
    <!-- 사이드바 -->
    <aside class="sidebar-section">
      <Sidebar 
        v-if="!loading"
        :title="menuData.title" 
        :menuItems="menuData.items"
      />
      <div v-else class="sidebar-loading">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>메뉴 로딩중...</p>
        </div>
      </div>
    </aside>
    
    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div class="content-container">
        <!-- 인기 상품 섹션 -->
        <section class="popular-products">
          <h2 class="popular-title">인기 상품</h2>
          <div class="popular-grid">
            <div 
              v-for="product in popularProducts" 
              :key="product.id"
              class="popular-card"
              @click="goToProduct(product.id)"
            >
              <div class="popular-image">
                <img :src="product.image" :alt="product.title" />
                <div v-if="product.badge" class="popular-badge">{{ product.badge }}</div>
              </div>
              <div class="popular-content">
                <div class="popular-info">
                  <h3 class="popular-title-text">{{ product.title }}</h3>
                </div>
                <div class="popular-details">
                  <span class="popular-duration">{{ product.travelDuration }}</span>
                  <span class="popular-location">{{ product.location }}</span>
                </div>
                <div class="popular-footer">
                  <div class="popular-price">
                    <span class="popular-price-text">{{ formatPrice(product.price) }}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 페이지 제목 -->
        <div class="filter-section">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <!-- 상품 정보 및 정렬 -->
        <div class="filter-info">
          <div class="product-count">
            총 <strong>{{ totalProducts }}</strong>개의 상품이 있습니다.
          </div>
          <div class="sort-group">
            <label>정렬:</label>
            <select v-model="sortBy" @change="sortProducts">
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="popular">인기순</option>
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
              <img :src="product.image" :alt="product.title" />
            </div>
            <div class="product-info">
              <div class="product-number">상품번호 {{ product.id }}</div>
              <h3 class="product-title">{{ product.title }}</h3>
              <div class="product-details">
                <div class="detail-item">
                  <span class="detail-label">포함내용:</span>
                  <span class="detail-value">{{ product.includedItems }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">출발날짜:</span>
                  <span class="detail-value">2024.03.15 (금)</span>
                </div>
              </div>
              <div class="product-price">
                <span class="current-price">{{ formatPrice(product.price) }}원</span>
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

        <!-- 상품이 없을 때 -->
        <div v-if="products.length === 0 && !loading" class="no-products">
          <p>조건에 맞는 상품이 없습니다.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { getProductsByCategory } from '@/lib/products.js'
import { categoryService } from '@/lib/categories.js'

const route = useRoute()
const router = useRouter()

// 반응형 데이터
const products = ref([])
const popularProducts = ref([])
const sortBy = ref('popular')
const itemsPerPage = 12
const menuData = ref(null)
const loading = ref(true)
const totalProducts = ref(0)
const currentPage = ref(1)
const itemsPerPageRef = ref(itemsPerPage)

// 전체 메뉴 데이터 (Header에서 사용하는 것과 동일)
const allMenuData = ref({
  primaryCategories: [],
  secondaryCategories: {}
})

// 계산된 속성
const categoryName = computed(() => {
  const categoryId = parseInt(route.query.categoryId)
  const category = allMenuData.value.primaryCategories.find(cat => cat.id === categoryId)
  return category?.name || '여행상품'
})

const subCategoryName = computed(() => {
  const subCategoryId = parseInt(route.query.subCategoryId)
  const categoryId = parseInt(route.query.categoryId)
  const subCategories = allMenuData.value.secondaryCategories[categoryId] || []
  const subCategory = subCategories.find(sub => sub.id === subCategoryId)
  return subCategory?.name || ''
})

const pageTitle = computed(() => {
  if (subCategoryName.value) {
    return subCategoryName.value
  }
  return categoryName.value
})

const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPageRef.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})


// 메서드
const loadMenuData = async () => {
  try {
    // 전체 메뉴 데이터 가져오기
    const response = await categoryService.getMenuData()
    
    if (response.success) {
      allMenuData.value = response.menuData
      
      // 현재 카테고리의 서브카테고리들로 사이드바 메뉴 생성
      const categoryId = parseInt(route.query.categoryId)
      const category = allMenuData.value.primaryCategories.find(cat => cat.id === categoryId)
      const subCategories = allMenuData.value.secondaryCategories[categoryId] || []
      
      if (category) {
        menuData.value = {
          title: category.name,
          items: subCategories.map(subCat => ({
            name: subCat.name,
            path: `/products?categoryId=${categoryId}&subCategoryId=${subCat.id}`
          }))
        }
      } else {
        // 카테고리 정보가 없는 경우 기본값
        menuData.value = {
          title: '여행상품',
          items: []
        }
      }
    } else {
      console.error('메뉴 데이터 로드 실패:', response.error)
      menuData.value = {
        title: '여행상품',
        items: []
      }
    }
  } catch (error) {
    console.error('메뉴 데이터 로드 오류:', error)
    menuData.value = {
      title: '여행상품',
      items: []
    }
  }
}

const loadProducts = async () => {
  try {
    const categoryId = parseInt(route.query.categoryId)
    const subCategoryId = parseInt(route.query.subCategoryId)
    const page = currentPage.value
    
    if (!categoryId) {
      console.warn('카테고리 ID가 없습니다. 홈페이지로 리다이렉트합니다.')
      router.push('/')
      return
    }
    
    // Supabase에서 카테고리별 상품 가져오기 (서브카테고리 필터링, 정렬 포함)
    const response = await getProductsByCategory(categoryId, subCategoryId, sortBy.value, page, itemsPerPageRef.value)
    
    if (response.success) {
      // 서버에서 이미 매핑된 데이터를 그대로 사용
      products.value = response.products || []
      totalProducts.value = response.totalCount || 0
    } else {
      products.value = []
      totalProducts.value = 0
    }
  } catch (error) {
    console.error('상품 로드 오류:', error)
    products.value = []
    totalProducts.value = 0
  }
}

const loadPopularProducts = async () => {
  try {
    const categoryId = parseInt(route.query.categoryId)
    
    if (!categoryId) {
      popularProducts.value = []
      return
    }
    
    // 인기순으로 정렬된 상품 중 상위 3개 가져오기
    const response = await getProductsByCategory(categoryId, null, 'popular')
    
    if (response.success) {
      popularProducts.value = (response.products || []).slice(0, 3)
    } else {
      popularProducts.value = []
    }
  } catch (error) {
    console.error('인기 상품 로드 오류:', error)
    popularProducts.value = []
  }
}

const sortProducts = async () => {
  currentPage.value = 1 // 정렬 변경 시 페이지 초기화
  await loadProducts() // 서버에서 정렬된 데이터 요청
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadProducts()
  }
}

// 라우트 변경 감지
watch(() => route.query, async () => {
  loading.value = true
  currentPage.value = 1 // 쿼리 변경 시 페이지 초기화
  
  try {
    // 병렬로 처리하여 로딩 시간 단축
    await Promise.all([
      loadMenuData(),
      loadProducts(),
      loadPopularProducts()
    ])
  } finally {
    loading.value = false
  }
})

// 컴포넌트 마운트
onMounted(async () => {
  loading.value = true
  
  try {
    // 병렬로 처리하여 로딩 시간 단축
    await Promise.all([
      loadMenuData(),
      loadProducts(),
      loadPopularProducts()
    ])
  } finally {
    loading.value = false
  }
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
  display: grid;
  grid-template-columns: 1fr 220px 900px 1fr;
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  padding-top: 3.5rem;
}

/* 사이드바 섹션 */
.sidebar-section {
  grid-column: 2;
  padding: 1.5rem 1rem 0 0;
  display: flex;
  align-items: flex-start;
  align-self: start;
}

/* 사이드바 로딩 */
.sidebar-loading {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem 1rem;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 상품 정보 */
.product-info {
  padding: 0.5rem 1.25rem;
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

.product-details {
  margin-bottom: 0.75rem;
  background-color: none;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  line-height: 1.3;
}

.detail-label {
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 60px;
  flex-shrink: 0;
}

.detail-value {
  color: var(--text-primary);
  flex: 1;
}

.product-price {
  margin-bottom: 0.75rem;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--error-color);
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

/* 리스트 뷰 스타일 */
.product-grid.list-view .product-card {
  display: flex;
  height: 210px;
}

.product-grid.list-view .product-image {
  width: 250px;
  height: 210px;
  flex-shrink: 0;
}

.product-grid.list-view .product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 인기 상품 섹션 */
.popular-products {
  margin-bottom: 2rem;
}

.popular-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.popular-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popular-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.popular-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.popular-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.popular-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.popular-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.popular-info {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.popular-title-text {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-details {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex: 0 0 auto;
}

.popular-duration, .popular-location {
  padding: 0.25rem 0.5rem;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  font-size: 0.75rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.popular-footer {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-top: auto;
}

.popular-price {
  display: flex;
  flex-direction: column;
}

.popular-price-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--error-color);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .popular-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .popular-products {
    display: none;
  }
  
  .popular-grid {
    grid-template-columns: 1fr;
  }
  
  .popular-title {
    font-size: 1.25rem;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .product-list-page {
    display: block;
    position: relative;
    padding-top: 0rem !important;
  }
  
  .sidebar-section {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0;
    display: block;
  }
  
  .main-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem 2rem 1rem;
  }
  
  .content-container {
    padding: 0;
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
    display: block;
    position: relative;
    padding-top: 1.5rem;
  }
  
  .sidebar-section {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0;
    display: block;
  }
  
  .main-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 0.75rem 1.5rem 0.75rem;
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