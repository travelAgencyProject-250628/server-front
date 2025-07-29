<template>
  <div class="travel-site">

    <!-- 히어로 섹션 -->
    <section class="hero">  
      <div v-if="isLoading" class="hero-loading">
        <p>배너 로딩 중...</p>
      </div>
      <div v-else class="hero-slider">
        <div 
          v-for="(image, index) in bannerImages"
          :key="index"
          class="hero-slide" 
          :class="{ active: currentSlide === index }"
        >
          <div class="hero-bg" :style="{ backgroundImage: `url(${image})` }"></div>
        </div>
      </div>

      <!-- 슬라이더 인디케이터 -->
      <div v-if="!isLoading" class="hero-indicators">
        <span 
          v-for="(_, index) in bannerImages" 
          :key="index"
          :class="['dot', { active: index === currentSlide }]"
          @click="setSlide(index)"
        ></span>
      </div>
    </section>

    <!-- 여행 추천 배너 섹션 -->
    <section class="travel-recommendation-banner">
      <div class="container">
        <div class="banner-content">
          <!-- 왼쪽 텍스트 영역 -->
          <div class="banner-text">
            <h2 class="banner-title">
              요즘 여행 🪷<br>
              어디로 갈까?
            </h2>
            <div class="banner-buttons">
              <!-- PC 버전: 세로로 모든 버튼 -->
              <template v-if="windowWidth > 768">
                <button 
                  v-for="(category, index) in categories"
                  :key="category.id"
                  class="banner-btn" 
                  :class="{ primary: selectedCategoryIndex === index }"
                  @click="changeCategory(index)"
                >{{ getCategoryIcon(index) }} {{ category.description || category.name }}</button>
              </template>
              
              <!-- 모바일 버전: 2줄로 나누어서 -->
              <template v-else>
                <!-- 첫 번째 줄: 2개 -->
                <div class="banner-row">
                  <button 
                    v-for="(category, index) in categories.slice(0, 2)"
                    :key="category.id"
                    class="banner-btn" 
                    :class="{ primary: selectedCategoryIndex === index }"
                    @click="changeCategory(index)"
                  >{{ getCategoryIcon(index) }} {{ category.name }}</button>
                </div>
                <!-- 두 번째 줄: 3개 -->
                <div class="banner-row">
                  <button 
                    v-for="(category, index) in categories.slice(2, 5)"
                    :key="category.id"
                    class="banner-btn" 
                    :class="{ primary: selectedCategoryIndex === (index + 2) }"
                    @click="changeCategory(index + 2)"
                  >{{ getCategoryIcon(index + 2) }} {{ category.name }}</button>
                </div>
              </template>
            </div>
          </div>
          
          <!-- 오른쪽 상품 카드 영역 -->
          <div class="banner-products">
            <div class="product-slider" ref="productSlider" 
                 @touchstart="handleTouchStart" 
                 @touchend="handleTouchEnd">
              <ProductCard 
                v-for="product in bannerProducts" 
                :key="product.id"
                :product="product"
                @click="handleProductClick"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 인기 상품 섹션 -->
    <section class="popular-tours">
      <div class="container">
        <h2 class="section-title">인기 버스 여행 상품</h2>
        
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="tours-loading">
          <p>인기 상품을 불러오는 중...</p>
        </div>
        
        <!-- 투어 상품 그리드 -->
        <div v-else-if="popularTours.length > 0" class="tours-grid">
          <div 
            v-for="tour in popularTours" 
            :key="tour.id"
            class="tour-card"
            @click="goToProductDetail(tour.id)"
          >
            <div class="tour-image">
              <img :src="tour.image" :alt="tour.title" />
              <div class="tour-badge">{{ tour.badge }}</div>
            </div>
            <div class="tour-content">
              <div class="tour-info">
                <h3 class="tour-title">{{ tour.title }}</h3>
              </div>
              <div class="tour-details">
                <span class="tour-duration">{{ tour.duration }}</span>
                <span class="tour-location">{{ tour.location }}</span>
              </div>
              <div class="tour-footer">
                <div class="tour-price">
                  <span class="price">{{ tour.price.toLocaleString() }}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 상품이 없을 때 -->
        <div v-else class="no-tours">
          <p>현재 등록된 인기 상품이 없습니다.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed} from 'vue'
import { useRouter } from 'vue-router'
import { getBannerImages } from '../lib/banners.js'
import { getPopularTours } from '../lib/products.js'
import ProductCard from '@/components/ProductCard.vue'

// 라우터 초기화
const router = useRouter()

// 반응형 데이터
const currentSlide = ref(0)
const sliderInterval = ref(null)
const bannerImages = ref([])
const isLoading = ref(true)

// 인기 투어 데이터 (API에서 가져올 예정)
const popularTours = ref([])

// 배너 상품 데이터
const bannerProducts = ref([])
const selectedCategoryIndex = ref(0) // 기본 선택 카테고리 인덱스
const categories = ref([]) // 카테고리 목록
const categoryProducts = ref({}) // 카테고리별 상품 데이터

// 반응형 화면 크기 감지
const windowWidth = ref(window.innerWidth)

// 모바일 슬라이더 관련
const productSlider = ref(null)
const currentProductSlide = ref(0)

// 배너 데이터 가져오기
const fetchBannerData = async () => {
  try {
    isLoading.value = true
    const response = await getBannerImages()
    
    if (response.success && response.images.length > 0) {
      bannerImages.value = response.images
    } else {
      // 기본 배너 이미지 설정
      bannerImages.value = [
        'https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg',
        'https://img.hankyung.com/photo/202410/06.38500005.1.jpg',
        'https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg'
      ]
    }
  } catch (error) {
    console.error('배너 이미지 로드 실패:', error)
    // 기본 배너 이미지 설정
    bannerImages.value = [
      'https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg',
      'https://img.hankyung.com/photo/202410/06.38500005.1.jpg',
      'https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg'
    ]
  } finally {
    isLoading.value = false
  }
}

// 인기 투어 데이터 가져오기
const fetchPopularTours = async () => {
  try {
    const response = await getPopularTours()
    
    if (response.success) {
      popularTours.value = response.tours
    } else {
      console.error('인기 투어 데이터 로드 실패:', response.error)
    }
  } catch (error) {
    console.error('인기 투어 데이터 로드 오류:', error)
  }
}

// 카테고리 데이터 가져오기
const fetchCategoriesAndProducts = async () => {
  try {
    console.log('🚀 카테고리 및 상품 데이터 로딩 시작')
    
    // 1. 카테고리 id 순으로 앞쪽 5개 가져오기
    const { categoryService } = await import('@/lib/categories.js')
    const categoryResponse = await categoryService.getAllCategories()
    
    console.log('📂 카테고리 응답:', categoryResponse)
    
    if (categoryResponse.success) {
      categories.value = categoryResponse.categories
        .sort((a, b) => a.id - b.id) // id 순으로 정렬
        .slice(0, 5) // 앞쪽 5개만
      
      console.log('✅ 선택된 카테고리 5개:', categories.value)
    }
    
    // 2. 각 카테고리별로 상품 3개씩 가져오기
    const { getProductsByCategory } = await import('@/lib/products.js')
    
    // 각 카테고리별로 상품 조회
    for (const category of categories.value) {
      console.log(`🛍️ 카테고리 "${category.name}" (ID: ${category.id}) 상품 조회 중...`)
      
      const productsResponse = await getProductsByCategory(category.id, null, 'latest')
      
      console.log(`📦 카테고리 ${category.id} 상품 응답:`, productsResponse)
      
      let categoryProductList = []
      if (productsResponse.success && productsResponse.products.length > 0) {
        console.log(`✨ 실제 상품 ${productsResponse.products.length}개 발견`)
        
        // 실제 상품 데이터 매핑
        categoryProductList = productsResponse.products.slice(0, 3).map(product => {
          console.log(`🔍 상품 매핑 전체 객체:`, product)
          console.log(`💰 가격 정보 상세:`, {
            adult_price: product.adult_price,
            adult_price_type: typeof product.adult_price,
            adult_price_exists: product.adult_price !== undefined && product.adult_price !== null,
            child_price: product.child_price,
            all_keys: Object.keys(product)
          })
          
          const mappedProduct = {
            id: product.id,
            title: product.title,
            image: product.image || product.main_image_url || '/logo.png',
            price: product.price || 29000,
            badge: typeof product.badge === 'string' ? product.badge : (product.badge?.name || '리무진버스'),
            tag: null, // 실제 태그 로직이 있다면 적용
            category: category.name,
            isDummy: false
          }
          
          console.log(`🏷️ 상품 "${product.title}" badge 정보:`, {
            badge_object: product.badge,
            badge_type: typeof product.badge,
            badge_name: product.badge?.name,
            final_badge: mappedProduct.badge,
            full_product: product
          })
          
          console.log(`✅ 매핑된 상품:`, mappedProduct)
          return mappedProduct
        })
      } else {
        console.log(`⚠️ 카테고리 ${category.name}에 상품이 없음`)
      }
      
      // 3개가 안되면 더미데이터로 채우기
      const originalLength = categoryProductList.length
      while (categoryProductList.length < 3) {
        const dummyProduct = {
          id: `dummy_${category.id}_${categoryProductList.length + 1}`,
          title: `${category.name} 추천상품 ${categoryProductList.length + 1}`,
          image: '/logo.png', // 로컬 이미지 사용
          price: [29000, 139000, 35000][categoryProductList.length],
          badge: '리무진버스',
          tag: ['할인중', null, '덤핑할인'][categoryProductList.length],
          category: category.name,
          isDummy: true
        }
        categoryProductList.push(dummyProduct)
      }
      
      if (categoryProductList.length > originalLength) {
        console.log(`🔧 더미 상품 ${categoryProductList.length - originalLength}개 추가됨`)
      }
      
      categoryProducts.value[category.id] = categoryProductList
      console.log(`💾 카테고리 ${category.name} 최종 상품 리스트:`, categoryProductList)
    }
    
    // 기본 선택 카테고리의 상품 표시
    if (categories.value.length > 0) {
      bannerProducts.value = categoryProducts.value[categories.value[0].id] || []
      console.log('🎯 기본 선택된 배너 상품들:', bannerProducts.value)
    }
    
    console.log('🎉 카테고리 및 상품 데이터 로딩 완료!')
    console.log('📊 전체 카테고리별 상품 데이터:', categoryProducts.value)
    
  } catch (error) {
    console.error('❌ 카테고리 및 상품 로드 오류:', error)
  }
}

// 카테고리 변경 함수
const changeCategory = (categoryIndex) => {
  selectedCategoryIndex.value = categoryIndex
  const selectedCategory = categories.value[categoryIndex]
  if (selectedCategory) {
    bannerProducts.value = categoryProducts.value[selectedCategory.id] || []
    // 모바일 슬라이더 초기화
    currentProductSlide.value = 0
    updateProductSlider()
  }
}

// 메서드들
const startSlider = () => {
  if (bannerImages.value.length > 0) {
    sliderInterval.value = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % bannerImages.value.length
    }, 5000)
  }
}

const setSlide = (index) => {
  if (index >= 0 && index < bannerImages.value.length) {
    currentSlide.value = index
  }
}





// 카테고리 아이콘 가져오기
const getCategoryIcon = (index) => {
  const icons = ['🎉', '🌊', '🍽️', '🏕️', '🌿']
  return icons[index] || '✨'
}

// 상품 상세 페이지로 이동
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// ProductCard 컴포넌트에서 발생하는 클릭 이벤트 처리
const handleProductClick = (product) => {
  if (!product.isDummy) {
    goToProductDetail(product.id)
  }
}

// 라이프사이클 훅
// 화면 크기 변경 감지
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 모바일 상품 슬라이더 함수들
const nextProductSlide = () => {
  if (currentProductSlide.value < bannerProducts.value.length - 1) {
    currentProductSlide.value++
  } else {
    currentProductSlide.value = 0
  }
  updateProductSlider()
}

const prevProductSlide = () => {
  if (currentProductSlide.value > 0) {
    currentProductSlide.value--
  } else {
    currentProductSlide.value = bannerProducts.value.length - 1
  }
  updateProductSlider()
}

const updateProductSlider = () => {
  if (productSlider.value && windowWidth.value <= 768) {
    const cardWidth = 280 + 16 // 카드 너비 + gap
    const translateX = -currentProductSlide.value * cardWidth
    productSlider.value.style.transform = `translateX(${translateX}px)`
  }
}

// 터치/스와이프 이벤트 처리
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextProductSlide() // 왼쪽으로 스와이프 -> 다음 슬라이드
    } else {
      prevProductSlide() // 오른쪽으로 스와이프 -> 이전 슬라이드
    }
  }
}

onMounted(async () => {
  await Promise.all([
    fetchBannerData(),
    fetchPopularTours(),
    fetchCategoriesAndProducts() // 카테고리와 상품 로드
  ])
  startSlider()
  
  // 리사이즈 이벤트 리스너 추가
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (sliderInterval.value) {
    clearInterval(sliderInterval.value)
  }
  
  // 리사이즈 이벤트 리스너 제거
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* CSS 변수 정의 - 전역으로 적용 */


/* 전체 레이아웃 */
.travel-site {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.5;
  color: var(--text-primary);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Header/Footer 기본 스타일 */
.travel-site .header {
  display: block;
  visibility: visible;
  opacity: 1;
}

.travel-site .footer {
  display: block;
  visibility: visible;
  opacity: 1;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 헤더 스타일 - Header 컴포넌트로 이동 */

.btn-primary, .btn-secondary, .btn-outline, .btn-hero, .btn-search {
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-light);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

/* 모바일 메뉴 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}

.nav-mobile {
  display: none;
  background: white;
  border-top: 1px solid var(--border-color);
}

.nav-mobile.active {
  display: block;
}

.mobile-nav-menu {
  list-style: none;
  padding: 1rem;
  margin: 0;
}

.mobile-nav-menu li {
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-menu li:last-child {
  border-bottom: none;
}

.mobile-nav-menu a {
  display: block;
  padding: 1rem 0;
  text-decoration: none;
  color: var(--text-primary);
}

.mobile-user-menu {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 히어로 섹션 */
.hero {
  position: relative;
  height: 600px;
  overflow: hidden;
  width: 100%;
  display: block;
}

.hero-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-slide.active {
  opacity: 1;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 1;
}

.hero-content h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 0;
  opacity: 0.9;
}



.hero-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.hero-indicators .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-indicators .dot:hover {
  background: rgba(255, 255, 255, 0.7);
}

.hero-indicators .dot.active {
  background: var(--primary-color);
  transform: scale(1.2);
}

.hero-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  font-size: 1.2rem;
}



/* 여행 추천 배너 섹션 */
.travel-recommendation-banner {
  background: white;
  padding: 3rem 0;
}

.banner-content {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 400px;
}

/* 왼쪽 텍스트 영역 */
.banner-text {
  background: url('/section.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 3rem 2rem;
  border-radius: 20px;
  width: 45%;
  height: 570px;
  z-index: 1;
  position: relative;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.banner-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.banner-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  width: auto;
  display: inline-block;
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background: white;
}

.banner-btn.primary {
  background: rgba(31, 41, 55, 0.95);
  color: white;
}

.banner-btn.primary:hover {
  background: #1f2937;
}

/* 오른쪽 상품 카드 영역 */
.banner-products {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 70%;
  height: 70%;
  z-index: 2;
}

.product-slider {
  display: contents; /* PC에서는 일반 그리드 */
}



.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.product-badge.red {
  background: #ef4444;
}

.product-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.product-tag.green {
  background: #10b981;
}



/* 인기 상품 섹션 */
.popular-tours {
  padding: 2rem 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.tour-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  /* border: 1px solid var(--border-color); */
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tour-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.tour-image {
  position: relative;
  height: 130px;
  overflow: hidden;
}

/* PC에서 200px로 설정 */
@media (min-width: 768px) {
  .tour-image {
    height: 200px;
  }
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.tour-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.tour-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.tour-info {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tour-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}



.tour-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  flex: 0 0 auto;
}

.tour-duration, .tour-location {
  padding: 0.25rem 0.75rem;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  font-size: 0.85rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.tour-footer {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-top: auto;
}

.tour-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
}



.tours-loading, .no-tours {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.tours-loading p, .no-tours p {
  font-size: 1.1rem;
  margin: 0;
}

/* 푸터 스타일 - Footer 컴포넌트로 이동 */

/* 환영 배너 */
.welcome-banner {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 1rem 0;
  text-align: center;
}

.welcome-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.welcome-content p {
  font-size: 1rem;
  opacity: 0.9;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .tours-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  /* 모바일에서 히어로 배너 이미지 조정 */
  .hero {
    height: 250px; /* 모바일에서 높이 줄임 */
  }
  
  .hero-bg {
    background-size: 100% auto !important;
    background-position: center top !important;
    background-color: #f8fafc; /* 이미지가 없는 부분 배경색 */
  }
  
  .hero-content h2 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  /* 여행 추천 배너 모바일 스타일 */
  .travel-recommendation-banner {
    padding: 2rem 0;
  }
  
  .banner-content {
    flex-direction: column;
    min-height: auto;
    gap: 2rem;
  }
  
  .banner-text {
    height: auto;
    width: 100%;
    padding: 5px 1rem;
    text-align: center;
    position: static;
    background: white !important;
    border-radius: 0;
  }
  
  .banner-text .banner-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
  
  .banner-text .banner-buttons .banner-row {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .banner-text .banner-buttons .banner-row:first-child {
    /* 첫 번째 줄: 2개 */
  }
  
  .banner-text .banner-buttons .banner-row:last-child {
    /* 두 번째 줄: 3개 */
  }
  
  .banner-title {
    font-size: 1.8rem;
  }
  
  .banner-products {
    position: static;
    transform: none;
    width: 100%;
    overflow: hidden; /* 슬라이더를 위한 오버플로우 숨김 */
  }
  
  .product-slider {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
    gap: 2rem;
    padding: 2rem 3rem;
  }
  
  .product-slider .product-card {
    flex: 0 0 280px; /* 고정 너비로 변경 */
    max-width: 280px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .tours-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .container {
    padding: 0 8px;
  }

  .popular-tours {
    padding: 2rem 0;
  }
  
  /* 모바일에서 투어 카드 조정 */
  .tour-content {
    padding: 0.3rem;
  }
  
  .tour-title {
    font-size: 1rem;
  }
  
  .tour-details {
    margin-bottom: 1rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tour-duration, .tour-location {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .hero {
    height: 200px; /* 작은 화면에서 더 작게 */
  }
  
  .hero-bg {
    background-size: cover !important; /* 작은 화면에서는 cover 사용 */
    background-position: center !important;
  }
  
  .hero-content h2 {
    font-size: 1.5rem;
  }
  
  /* 작은 화면에서 배너 조정 */
  .banner-title {
    font-size: 1.5rem;
  }
  
  .banner-btn {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .banner-products .product-title {
    font-size: 0.85rem;
  }
  
  .banner-products .price {
    font-size: 0.9rem;
  }
}
</style>