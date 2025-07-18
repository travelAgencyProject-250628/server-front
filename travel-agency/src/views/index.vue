<template>
  <div class="travel-site">

    <!-- 히어로 섹션 -->
    <section class="hero">  
      <div class="hero-slider">
        <div class="hero-slide" :class="{ active: currentSlide === 0 }">
          <div class="hero-content">
            <h2>새로운 여행의 시작</h2>
            <p>편안하고 안전한 버스여행으로 특별한 추억을 만들어보세요</p>
          </div>
          <div class="hero-bg" style="background-image: url('https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg');"></div>
        </div>
        
        <div class="hero-slide" :class="{ active: currentSlide === 1 }">
          <div class="hero-content">
            <h2>국내 최고의 여행 서비스</h2>
            <p>30년 경험의 전문 가이드와 함께하는 프리미엄 여행</p>
          </div>
          <div class="hero-bg" style="background-image: url('https://img.hankyung.com/photo/202410/06.38500005.1.jpg');"></div>
        </div>
        
        <div class="hero-slide" :class="{ active: currentSlide === 2 }">
          <div class="hero-content">
            <h2>합리적인 가격, 최상의 서비스</h2>
            <p>가족, 친구, 연인과 함께 즐기는 행복한 여행</p>
          </div>
          <div class="hero-bg" style="background-image: url('https://www.artinsight.co.kr/data/tmp/2104/20210412173933_yxcqzfun.jpg');"></div>
        </div>
      </div>

      <!-- 슬라이더 인디케이터 -->
      <div class="hero-indicators">
        <button 
          v-for="(slide, index) in 3" 
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="setSlide(index)"
        ></button>
      </div>
    </section>



    <!-- 인기 상품 섹션 -->
    <section class="popular-tours">
      <div class="container">
        <h2 class="section-title">인기 버스 여행 상품</h2>
        <div class="tours-grid">
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
              <h3 class="tour-title">{{ tour.title }}</h3>
              <p class="tour-description">{{ tour.description }}</p>
              <div class="tour-details">
                <span class="tour-duration">{{ tour.duration }}</span>
                <span class="tour-location">{{ tour.location }}</span>
              </div>
              <div class="tour-footer">
                <div class="tour-price">
                  <span class="price-label">1인</span>
                  <span class="price">{{ tour.price.toLocaleString() }}원</span>
                </div>
                <button class="btn-tour">예약하기</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="more-tours">
          <button class="btn-outline">더 많은 상품 보기</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed} from 'vue'
import { authService } from '../lib/auth.js'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 라우터 초기화
const router = useRouter()

// 반응형 데이터
const currentSlide = ref(0)
const sliderInterval = ref(null)
const isLoggedIn = ref(false)
const currentUser = ref(null)

// 로그인 상태 확인
const checkAuthStatus = async () => {
  const { data: { user } } = await authService.getCurrentUser()
  isLoggedIn.value = !!user
  currentUser.value = user
}

// 인기 투어 데이터
const popularTours = ref([
  {
    id: 1,
    title: '제주도 3일 완전정복',
    description: '한라산, 성산일출봉, 우도까지 제주의 모든 명소를 담은 완벽한 여행',
    duration: '2박 3일',
    location: '제주도',
    price: 285000,
    badge: '베스트',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: '부산 맛집 투어',
    description: '광안리, 해운대와 함께 부산의 대표 맛집들을 순회하는 미식 여행',
    duration: '1박 2일',
    location: '부산',
    price: 189000,
    badge: '인기',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: '강원도 자연 힐링',
    description: '설악산과 동해안의 아름다운 자연 속에서 힐링하는 여행',
    duration: '2박 3일',
    location: '강원도',
    price: 235000,
    badge: '추천',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: '경주 역사 문화 탐방',
    description: '불국사, 석굴암 등 경주의 유네스코 세계문화유산 완전 정복',
    duration: '1박 2일',
    location: '경주',
    price: 156000,
    badge: '특가',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: '전주 한옥마을 체험',
    description: '전주 한옥마을에서의 전통 문화 체험과 맛있는 비빔밥 투어',
    duration: '당일',
    location: '전주',
    price: 89000,
    badge: '신규',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: '남해 독일마을 힐링',
    description: '이국적인 독일마을과 아름다운 남해의 해안선을 만나는 여행',
    duration: '1박 2일',
    location: '남해',
    price: 198000,
    badge: '한정',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
  }
])

// 메서드들
const startSlider = () => {
  sliderInterval.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 5000)
}

const setSlide = (index) => {
  currentSlide.value = index
}



// 상품 상세 페이지로 이동
const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 라이프사이클 훅
onMounted(async () => {
  await checkAuthStatus()
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

.btn-primary, .btn-secondary, .btn-outline, .btn-hero, .btn-search, .btn-tour {
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
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.hero-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
}

.hero-indicators button.active {
  background: white;
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
}

.tour-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.tour-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

.tour-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  justify-content: space-between;
  align-items: center;
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

.btn-tour {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-tour:hover {
  background: var(--primary-dark);
}

.more-tours {
  text-align: center;
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
    grid-template-columns: 1fr;
  }
  

  
  .container {
    padding: 0 15px;
  }

  .popular-tours {
    padding: 2rem 0;
  }
}

@media (max-width: 480px) {
  .hero {
    height: 400px;
  }
  
  .hero-content h2 {
    font-size: 1.5rem;
  }
  
  .tour-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>