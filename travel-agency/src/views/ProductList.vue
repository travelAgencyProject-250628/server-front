<!-- 여행 상품 리스트 페이지 -->
<template>
  <div class="product-list-page">
    <!-- 사이드바 -->
    <div class="sidebar-wrapper">
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
    </div>
    
    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 페이지 헤더 -->
        <div class="page-header">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <div class="breadcrumb">
            <span>홈</span>
            <span class="separator">></span>
            <span>{{ categoryName }}</span>
            <span class="separator" v-if="subCategoryName">></span>
            <span v-if="subCategoryName">{{ subCategoryName }}</span>
          </div>
        </div>

        <!-- 상품 정렬 및 뷰 -->
        <div class="filter-section">
          <div class="filter-right">
            <div class="sort-group">
              <label>정렬:</label>
              <select v-model="sortBy" @change="sortProducts">
                <option value="latest">최신순</option>
                <option value="price-low">가격 낮은순</option>
                <option value="price-high">가격 높은순</option>
                <option value="popular">인기순</option>
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
          총 <strong>{{ totalProducts }}</strong>개의 상품이 있습니다.
          ({{ currentPage }}/{{ totalPages }} 페이지)
        </div>

        <!-- 상품 리스트 -->
        <div class="product-grid" :class="{ 'list-view': viewMode === 'list' }">
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
              <div class="product-price">
                <span class="current-price">{{ formatPrice(product.price) }}원</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 상품이 없을 때 -->
        <div v-if="products.length === 0 && !loading" class="no-products">
          <p>조건에 맞는 상품이 없습니다.</p>
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

// 반응형 데이터
const products = ref([])
const sortBy = ref('latest')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 12
const menuData = ref(null)
const loading = ref(true)
const totalProducts = ref(0)

// 계산된 속성
const menuKey = computed(() => {
  return route.params.category || 'product'
})

const categoryName = computed(() => {
  return route.params.category || '여행상품'
})

const subCategoryName = computed(() => {
  return route.params.subcategory || ''
})

const pageTitle = computed(() => {
  if (subCategoryName.value) {
    return subCategoryName.value
  }
  return categoryName.value
})



const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage)
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
    loading.value = true
    
    // 실제로는 API 호출: const response = await fetch(`/api/menus/${menuKey.value}`)
    // const data = await response.json()
    
    // 더미 데이터 (서버에서 받은 해당 1차 메뉴의 2차 메뉴들)
    const dummyMenuData = {
      title: '국내여행',
      items: [
        { name: '서울/경기', path: '/products/domestic/seoul' },
        { name: '강원도', path: '/products/domestic/gangwon' },
        { name: '경상도', path: '/products/domestic/gyeongsang' },
        { name: '전라도', path: '/products/domestic/jeolla' },
        { name: '충청도', path: '/products/domestic/chungcheong' },
        { name: '제주도', path: '/products/domestic/jeju' }
      ]
    }
    
    // 시뮬레이션: 서버 응답 지연
    await new Promise(resolve => setTimeout(resolve, 300))
    
    menuData.value = dummyMenuData
    loading.value = false
  } catch (error) {
    console.error('메뉴 데이터 로드 실패:', error)
    loading.value = false
  }
}

const loadProducts = async () => {
  try {
    // 실제로는 API 호출로 카테고리별 상품을 가져옴 (페이징 포함)
    // const response = await fetch(`/api/products?category=${route.params.category}&subcategory=${route.params.subcategory}&page=${currentPage.value}&limit=${itemsPerPage}&sort=${sortBy.value}`)
    // const data = await response.json()
    
    // 더미 데이터 (서버에서 정렬된 상태로 받은 현재 라우트에 해당하는 상품들)
    const generateDummyProducts = (page, limit) => {
      const allProducts = []
      const startId = (page - 1) * limit + 1
      
      for (let i = 0; i < limit; i++) {
        const id = startId + i
        const price = Math.floor(Math.random() * 200000) + 30000
        const originalPrice = price + Math.floor(Math.random() * 50000) + 10000
        
        allProducts.push({
          id: id,
          title: `[${id % 3 === 0 ? '2박3일' : id % 2 === 0 ? '1박2일' : '당일'}] ${route.params.category || 'domestic'} 여행 상품 ${id} (${sortBy.value}정렬)`,
          category: route.params.category || 'domestic',
          subcategory: route.params.subcategory || 'seoul',
          price: price,
          originalPrice: originalPrice,
          discount: Math.floor(((originalPrice - price) / originalPrice) * 100),
          image: `https://images.unsplash.com/photo-${1500000000000 + (id * 1000)}?w=300&h=200&fit=crop`,
          isNew: id % 4 === 0,
          isHot: id % 5 === 0
        })
      }
      
      return allProducts
    }
    
    // 시뮬레이션: 서버 응답 지연
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const dummyProducts = generateDummyProducts(currentPage.value, itemsPerPage)
    
    // 서버에서 받은 데이터 (페이징 정보 포함)
    const serverResponse = {
      products: dummyProducts,
      totalCount: 85, // 전체 상품 수 (예시)
      currentPage: currentPage.value,
      totalPages: Math.ceil(85 / itemsPerPage),
      hasNextPage: currentPage.value < Math.ceil(85 / itemsPerPage),
      hasPrevPage: currentPage.value > 1
    }
    
    products.value = serverResponse.products
    totalProducts.value = serverResponse.totalCount
  } catch (error) {
    console.error('상품 로드 실패:', error)
  }
}



const sortProducts = async () => {
  currentPage.value = 1 // 정렬 변경 시 첫 페이지로 리셋
  await loadProducts()
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const changePage = async (page) => {
  currentPage.value = page
  await loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 라우트 변경 감지
watch(() => route.params, async () => {
  currentPage.value = 1 // 라우트 변경 시 첫 페이지로 리셋
  await loadMenuData()
  loadProducts()
})

// 컴포넌트 마운트
onMounted(async () => {
  await loadMenuData()
  loadProducts()
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
  position: relative;
  min-height: 100vh;
  background: var(--bg-light);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

/* 사이드바 래퍼 (absolute 위치) */
.sidebar-wrapper {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

/* 사이드바 로딩 */
.sidebar-loading {
  width: 200px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
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

.main-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
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
  .sidebar-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .content-container {
    padding: 1rem;
  }
  
  .filter-section {
    justify-content: center;
  }
  
  .filter-right {
    justify-content: center;
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
    height: 200px;
  }
}
</style> 