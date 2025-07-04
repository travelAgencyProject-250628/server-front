<template>
  <div class="travel-site">
    <!-- 헤더 영역 -->
    <Header />

    <!-- 히어로 섹션 -->
    <section class="hero">
      <!-- 로그인된 사용자 환영 메시지 -->
      <div v-if="isLoggedIn" class="welcome-banner">
        <div class="container">
          <div class="welcome-content">
            <h3>🎉 환영합니다, {{ currentUser?.name }}님!</h3>
            <p>회원가입이 완료되었습니다. 지금 바로 여행을 시작해보세요!</p>
          </div>
        </div>
      </div>
      
      <div class="hero-slider">
        <div class="hero-slide" :class="{ active: currentSlide === 0 }">
          <div class="hero-content">
            <h2>새로운 여행의 시작</h2>
            <p>편안하고 안전한 버스여행으로 특별한 추억을 만들어보세요</p>
            <button class="btn-hero">여행 둘러보기</button>
          </div>
          <div class="hero-bg" style="background: linear-gradient(135deg, #2563eb, #1e40af);"></div>
        </div>
        
        <div class="hero-slide" :class="{ active: currentSlide === 1 }">
          <div class="hero-content">
            <h2>국내 최고의 여행 서비스</h2>
            <p>30년 경험의 전문 가이드와 함께하는 프리미엄 여행</p>
            <button class="btn-hero">상품 보기</button>
          </div>
          <div class="hero-bg" style="background: linear-gradient(135deg, #1e40af, #3730a3);"></div>
        </div>
        
        <div class="hero-slide" :class="{ active: currentSlide === 2 }">
          <div class="hero-content">
            <h2>합리적인 가격, 최상의 서비스</h2>
            <p>가족, 친구, 연인과 함께 즐기는 행복한 여행</p>
            <button class="btn-hero">예약하기</button>
          </div>
          <div class="hero-bg" style="background: linear-gradient(135deg, #3730a3, #2563eb);"></div>
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

    <!-- 검색 섹션 -->
    <section class="search-section">
      <div class="container">
        <div class="search-form-wrapper">
          <h3>여행 상품 검색</h3>
          <form class="search-form" @submit.prevent="handleSearch">
            <div class="search-input-group">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="여행지나 상품명을 입력하세요" 
                class="search-input"
                required
              >
              <button type="submit" class="btn-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                검색
              </button>
            </div>
            <div class="search-error" v-if="searchError">{{ searchError }}</div>
          </form>
        </div>
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

    <!-- 푸터 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// 반응형 데이터
const currentSlide = ref(0)
const searchQuery = ref('')
const searchError = ref('')
const sliderInterval = ref(null)

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

const handleSearch = () => {
  searchError.value = ''
  
  if (!searchQuery.value.trim()) {
    searchError.value = '검색어를 입력해주세요.'
    return
  }
  
  if (searchQuery.value.trim().length < 2) {
    searchError.value = '검색어는 2글자 이상 입력해주세요.'
    return
  }
  
  console.log('검색어:', searchQuery.value)
  // 실제 검색 로직은 여기에 구현
  alert(`"${searchQuery.value}" 검색 결과를 불러오는 중입니다.`)
}

// 라이프사이클 훅
onMounted(() => {
  startSlider()
})

onBeforeUnmount(() => {
  if (sliderInterval.value) {
    clearInterval(sliderInterval.value)
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
}

/* 전체 레이아웃 */
.travel-site {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
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
  border: 2px solid var(--primary-color);
  padding: 0.75rem 2rem;
  font-size: 1rem;
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
  height: 500px;
  overflow: hidden;
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
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-hero {
  background: white;
  color: var(--primary-color);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-hero:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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

/* 검색 섹션 */
.search-section {
  padding: 4rem 0;
  background: var(--bg-light);
}

.search-form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.search-form-wrapper h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.search-input-group {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-search {
  background: var(--primary-color);
  color: white;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.btn-search:hover {
  background: var(--primary-dark);
}

.search-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 인기 상품 섹션 */
.popular-tours {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-primary);
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.tour-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.tour-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
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
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.tour-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.tour-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tour-duration, .tour-location {
  padding: 0.25rem 0.75rem;
  background: var(--bg-light);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
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
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.btn-tour {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
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
@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .tours-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input-group {
    flex-direction: column;
  }
  
  .container {
    padding: 0 15px;
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