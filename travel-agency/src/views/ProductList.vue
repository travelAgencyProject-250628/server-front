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
      
      <!-- 여행 상담 & 예약 센터 정보 -->
      <div class="contact-info-section">
        <div class="contact-header">
          <h3>여행상담 & 예약센터</h3>
        </div>
        
        <div class="phone-numbers">
          <div class="phone-number primary">031)376-0597</div>
          <!-- <div class="phone-number secondary">0504-228-9300</div> -->
        </div>
        
        <div class="operating-hours">
          <div class="hours-item">
            <span class="hours-label">평일 : 09:00~18:00</span>
          </div>
          <div class="hours-item">
            <span class="hours-label">토요일 : 09:00~16:00</span>
          </div>
        </div>
        
        <div class="cancellation-policy">
          <p>*취소 및 변경은 평일 18시까지 전화로만 가능합니다. (공휴일 제외)</p>
        </div>
        
        <div class="bank-info">
          <div class="bank-header">
            <img src="/bank_icon.png" alt="신한은행" class="bank-logo-image" />
            <span class="bank-name">신한은행</span>
          </div>
          <div class="account-number">110-566-753667</div>
          <div class="account-holder">예금주 : 더쉼투어</div>
        </div>
      </div>
    </aside>
    
    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <div class="content-container">
        <!-- 인기 상품 섹션 -->
        <section class="popular-products">
          <div class="popular-title-group">
            <span class="title-green">절찬인기여행</span>
            <span class="title-black">더쉼투어 추천!</span>
            <span class="title-gray">더쉼투어가 추천하는 인기여행을 소개합니다.</span>
          </div>
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
                  <span class="popular-duration">{{ product.duration }}</span>
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
            class="product-card horizontal-card"
            @click="goToProduct(product.id)"
          >
            <div class="product-image-container">
              <img :src="product.image" :alt="product.title" class="product-image" />
            </div>
            <div class="product-content">
              <h3 class="product-title">{{ product.title }}</h3>
              
              <div class="product-badges ">
                <span class="badge departure-badge">출발일</span>
                <span class="badge-content">{{ product.departureDate }}</span>
              </div>
              
              <div class="product-badges mobile-hide">
                <span class="badge include-badge">포함내역</span>
                <div class="badge-content include-content">
                  <div v-if="product.includedItems" v-html="formatIncludedItems(product.includedItems)"></div>
                  <div v-else class="no-included-items">포함내역 정보가 없습니다.</div>
                </div>
              </div>
              
              <div class="product-price-section">
                <span class="price-badge">상품가</span>
                <span class="product-price">{{ formatPrice(product.price) }}원~</span>
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

const formatIncludedItems = (includedItems) => {
  if (!includedItems) return ''
  
  // 줄바꿈을 기준으로 분리하고 각 항목을 div로 감싸기
  return includedItems
    .split(/\n|\r\n/)
    .filter(item => item.trim() !== '')
    .map(item => `<div>${item.trim()}</div>`)
    .join('')
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
/* :root {
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
} */

/* 전체 레이아웃 */
.product-list-page {
  display: grid;
  grid-template-columns: 1fr 270px 850px 1fr;
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  padding-top: 3.5rem;
}

/* 사이드바 섹션 */
.sidebar-section {
  grid-column: 2;
  padding: 1.5rem 2rem 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-self: start;
  position: sticky;
  top: 1rem; 
  height: fit-content;
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

/* 여행 상담 & 예약 센터 정보 */
.contact-info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 1rem;
  padding-left: 2px;
}

.contact-header h3 {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--text-primary);
  text-align: left;
  margin-bottom: 0.4rem;
}

.phone-number {
  font-size: 1.2rem;
  font-weight: 800;
  text-align: left;
}

.phone-number.primary {
  color: var(--primary-color);
  font-size: 1.4rem;
  line-height: 1;
}

.phone-number.secondary {
  color: #1f2937;
  font-size: 1.4rem;
}

.operating-hours {
  margin-bottom: 1.5rem;
}

.hours-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
}

.hours-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.cancellation-policy {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--border-radius);
}

.cancellation-policy p {
  margin: 0;
  font-size: 0.8rem;
  color: #dc2626;
  line-height: 1.4;
  text-align: left;
}

.bank-info {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: var(--border-radius);
}

.bank-header {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.bank-logo-image {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.bank-name {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(87, 87, 255);
}

.account-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgb(87, 87, 255);
  text-align: left;
  margin: 0.2rem 0rem;
}

.account-holder {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: left;
  line-height: 1.3;
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
  margin-bottom: 2rem;
}

.product-grid.list-view {
  grid-template-columns: 1fr;
}

.product-card {
  background: white;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 2.5rem;
}

.product-card:last-child {
  border-bottom: none;
}

/* .product-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
} */

/* 가로형 레이아웃 */
.horizontal-card {
  display: flex;
  min-height: 280px;
}

.product-image-container {
  flex: 0 0 300px;
  height: 280px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 75%;
  object-fit: cover;
  border-radius: 8px;
}

.product-content {
  flex: 1;
  padding: 0rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
  margin: 0;
}

.product-badges {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.badge {
  background: #4285f4;
  color: white;
  padding: 0.3rem 0.3rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 64px;
  text-align: center;
}

.departure-badge {
  background: var(--primary-color);
}

.include-badge {
  background: var(--primary-color);
}

.badge-content {
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
}

.include-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.include-content div {
  color: #666;
  font-size: 0.9rem;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.price-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.3rem 0.3rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 64px;
  text-align: center;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e53e3e;
}

.no-included-items {
  color: #999;
  font-style: italic;
}

/* 반응형 디자인 - 태블릿 */
@media (max-width: 1024px) {
  .product-image-container {
    flex: 0 0 250px;
    height: 240px;
  }
  
  .product-content {
    padding: 1.2rem 1.5rem;
  }
  
  .product-title {
    font-size: 1.2rem;
  }
  
  .product-price {
    font-size: 1.5rem;
  }
}

/* 반응형 디자인 - 모바일 */
@media (max-width: 768px) {
  .horizontal-card {
    flex-direction: column;
    min-height: auto;
  }
  
  .product-image-container {
    flex: none;
    width: 100%;
    height: 200px;
  }
  
  .product-content {
    padding: 1rem;
    gap: 0.1rem;
  }
  
  .product-title {
    font-size: 1.1rem;
    line-height: 1.3;
  }
  
  .product-badges {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    min-width: 70px;
  }
  
  .badge-content {
    font-size: 0.85rem;
  }
  
  .include-content div {
    font-size: 0.8rem;
  }
  
  .product-price-section {
    margin-top: 0rem !important;
  }
  
  .price-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    min-width: 70px;
  }
  
  .product-price {
    font-size: 1.4rem;
  }
  
  /* 모바일에서 포함내역 내용 숨기기 */
  .mobile-hide {
    display: none;
  }
  
  /* 모바일에서 상품가 배지 숨기기 */
  .price-badge {
    display: none;
  }
  
  /* 모바일에서 출발일 배지 숨기기 */
  .departure-badge {
    display: none;
  }
  
  /* 모바일에서 출발일을 텍스트 형태로 표시 */
  .product-badges .badge-content {
    font-size: 0.9rem;
    color: #333;
    font-weight: 500;
  }
  
  /* 출발일 텍스트 앞에 "출발일: " 추가 */
  .product-badges:first-of-type .badge-content::before {
    content: "출발일: ";
    font-weight: 600;
    color: #666;
  }
  .product-card {
    padding-bottom: 0rem;
    margin-bottom: 0.5rem;
  }

  .product-content {
    padding: 0.5rem; 
  }

  .product-price-section {
    margin-top: 0.5rem;
  }
}

/* 반응형 디자인 - 작은 모바일 */
@media (max-width: 480px) {
  .product-content {
    padding: 0.8rem;
  }
  
  .product-title {
    font-size: 1rem;
  }
  
  .include-content div {
    font-size: 0.75rem;
    line-height: 1.3;
  }
  
  .product-price {
    font-size: 1.2rem;
  }
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


.product-grid.list-view .product-image {
  /* width: 250px;
  height: 210px; */
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

.popular-title-group {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.title-green {
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
  line-height: 1.2;
}

.title-black {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.title-gray {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 0.2rem;
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
  
  .title-green {
    font-size: 1.5rem;
  }
  
  .title-black {
    font-size: 1.2rem;
  }
  
  .title-gray {
    font-size: 0.8rem;
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
    display: flex;
    flex-direction: column;
  }
  
  /* 모바일에서 연락처 정보 섹션 숨기기 */
  .contact-info-section {
    display: none;
  }
  
  .main-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0.5rem 1rem 2rem 1rem;
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
    display: flex;
    flex-direction: column;
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