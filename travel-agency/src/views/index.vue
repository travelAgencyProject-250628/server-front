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

// 라우터 초기화
const router = useRouter()

// 반응형 데이터
const currentSlide = ref(0)
const sliderInterval = ref(null)
const bannerImages = ref([])
const isLoading = ref(true)

// 인기 투어 데이터 (API에서 가져올 예정)
const popularTours = ref([])

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



// 상품 상세 페이지로 이동
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 라이프사이클 훅
onMounted(async () => {
  await Promise.all([
    fetchBannerData(),
    fetchPopularTours()
  ])
  startSlider()
})

onBeforeUnmount(() => {
  if (sliderInterval.value) {
    clearInterval(sliderInterval.value)
  }
})
</script>

<style scoped>
/* CSS 변수 정의 - 전역으로 적용 */
:global(:root) {
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



/* 인기 상품 섹션 */
.popular-tours {
  padding: 4rem 0;
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
  border: 1px solid var(--border-color);
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
  height: 200px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.tour-card:hover .tour-image img {
  transform: scale(1.05);
}

.tour-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
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
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .tours-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .container {
    padding: 0 15px;
  }

  .popular-tours {
    padding: 2rem 0;
  }
  
  /* 모바일에서 투어 카드 조정 */
  .tour-content {
    padding: 1rem;
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
  

}
</style>