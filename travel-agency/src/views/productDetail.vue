<template>
    <div class="product-detail-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 로딩 상태 표시 -->
                <div v-if="isLoading" class="loading-state">
                    <p>상품 정보를 불러오는 중입니다...</p>
                </div>

                <!-- 에러 상태 표시 -->
                <div v-else-if="error" class="error-state">
                    <p>{{ error }}</p>
                </div>

                <!-- 상품 정보 표시 -->
                <template v-else-if="productDetail">
                    <!-- 상품 헤더 -->
                    <div class="product-header">
                        <div class="product-category">{{ productDetail.category }}</div>
                        <h1 class="product-title">{{ productDetail.title }}</h1>
                        <p class="product-subtitle">{{ productDetail.subtitle }}</p>
                    </div>

                    <!-- 상품 이미지 섹션 -->
                    <div class="product-image-section">
                        <div class="image-slider">
                            <button class="slider-btn prev" @click="prevImage" :disabled="currentImageIndex === 0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <div class="image-container">
                                <img :src="productDetail.images[currentImageIndex]" :alt="'상품 이미지 ' + (currentImageIndex + 1)" class="product-image">
                            </div>
                            <button class="slider-btn next" @click="nextImage" :disabled="currentImageIndex === productDetail.images.length - 1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div class="image-pagination">
                            <span v-for="(_, index) in productDetail.images" 
                                  :key="index" 
                                  :class="['dot', { active: index === currentImageIndex }]"
                                  @click="setImage(index)">
                            </span>
                        </div>
                    </div>

                    <!-- 상품 요약 정보 -->
                    <div class="product-summary">
                        <div class="summary-item">
                            <span class="summary-label">상품 코드</span>
                            <span class="summary-value">{{ productDetail.productCode }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">상품 번호</span>
                            <span class="summary-value">{{ productDetail.productNumber }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">여행 기간</span>
                            <span class="summary-value">{{ productDetail.travelDuration }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">행사 내용</span>
                            <span class="summary-value">{{ productDetail.eventContent }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">상품 가격</span>
                            <span class="summary-value price">{{ formatPrice(productDetail.adultPrice) }}원~</span>
                        </div>
                    </div>

                    <!-- 일정 선택 -->
                    <div class="schedule-selection">
                        <TravelCalendar
                            v-model="selectedDate"
                            :booking-data="bookingData"
                            :min-required-booking="10"
                            @date-select="handleDateSelect"
                        />
                    </div>

                    <!-- 기본 가격표 추가 -->
                    <div class="base-price-section">
                        <h3 class="price-title">기본 가격</h3>
                        <div class="price-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>구분</th>
                                        <th>가격</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td rowspan="2" class="date-cell">모든 요일</td>
                                        <td>대인</td>
                                        <td class="price-cell">{{ formatPrice(productDetail.adultPrice) }}</td>
                                    </tr>
                                    <tr>
                                        <td>소인</td>
                                        <td class="price-cell">{{ formatPrice(productDetail.childPrice) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 탭 메뉴 -->
                    <div class="tab-section">
                        <div class="tab-menu">
                            <button 
                                type="button" 
                                class="tab-button" 
                                :class="{ active: activeTab === 'basic' }"
                                @click="scrollToSection('basic')"
                            >
                                기본정보
                            </button>
                            <button 
                                type="button" 
                                class="tab-button" 
                                :class="{ active: activeTab === 'notice' }"
                                @click="scrollToSection('notice')"
                            >
                                유의 및 취소사항
                            </button>
                            <button 
                                type="button" 
                                class="tab-button" 
                                :class="{ active: activeTab === 'insurance' }"
                                @click="scrollToSection('insurance')"
                            >
                                여행자보험
                            </button>
                        </div>
                    </div>

                    <!-- 기본정보 섹션 -->
                    <section id="basic" class="content-section" ref="basicSection">
                        <h2 class="section-title">기본정보</h2>
                        <div class="basic-info">
                            <div class="info-item">
                                <h3>포함내역</h3>
                                <p>{{ productDetail.includedItems }}</p>
                            </div>
                            <div class="info-item">
                                <h3>불포함내역</h3>
                                <p>{{ productDetail.excludedItems }}</p>
                            </div>
                            <div class="info-item">
                                <h3>모이는장소</h3>
                                <p>{{ productDetail.meetingPoint }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- 유의 및 취소사항 섹션 -->
                    <section id="notice" class="content-section" ref="noticeSection">
                        <h2 class="section-title">유의 및 취소사항</h2>
                        
                        <div class="notice-content">
                            <div class="notice-item">
                                <h3>예약 및 결제 안내</h3>
                                <ul>
                                    <li>예약금: 여행경비의 20% (최소 50,000원)</li>
                                    <li>잔금: 출발 3일 전까지 완납</li>
                                    <li>결제방법: 계좌이체, 카드결제, 무통장입금</li>
                                </ul>
                            </div>

                            <div class="notice-item">
                                <h3>취소 수수료 안내</h3>
                                <ul>
                                    <li>여행 시작일 15일 전: 취소 수수료 없음</li>
                                    <li>여행 시작일 14~8일 전: 여행경비의 10%</li>
                                    <li>여행 시작일 7~1일 전: 여행경비의 20%</li>
                                    <li>여행 시작일 당일: 여행경비의 50%</li>
                                    <li>여행 개시 후 또는 무연락 불참: 여행경비의 100%</li>
                                </ul>
                            </div>

                            <div class="notice-item">
                                <h3>여행 시 유의사항</h3>
                                <ul>
                                    <li>신분증을 반드시 지참해 주시기 바랍니다.</li>
                                    <li>개인 의약품이 필요한 경우 미리 준비해 주세요.</li>
                                    <li>날씨에 따라 일정이 변경될 수 있습니다.</li>
                                    <li>최소 출발 인원 미달 시 여행이 취소될 수 있습니다.</li>
                                    <li>안전사고 예방을 위해 가이드의 안내에 따라 주시기 바랍니다.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- 여행자보험 섹션 -->
                    <section id="insurance" class="content-section" ref="insuranceSection">
                        <h2 class="section-title">여행자보험</h2>
                        
                        <div class="insurance-content">
                            <div class="insurance-info">
                                <div class="info-title">
                                    <i class="info-icon">i</i>
                                    국내여행자보험 서비스 제공 중지에 따른 안내
                                </div>
                                <p>
                                    2012년 8월 18일부로 시행된 "개인정보통신법"은 인터넷상에서 개인정보(주민등록번호) 유출을 방지하고자 개인정보 수집을 금지토록 하고 있어 여행자보험가입이 안됨을 알려드립니다.이에 따라 2012년 8월 20일 이후 출발하는 국내여행상품의 여행자보험 가입을 원하는 경우에는 개별 가입을 권장합니다.
                                </p>
                                <a href="https://web.travelover.co.kr/insu/intro/dom?" target="_blank" class="insurance-button">
                                    여행자보험 가입 희망자 개별 신청해주세요!
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- 예약 버튼 -->
                    <div class="booking-section">
                        <div class="booking-info">
                            <div class="price-info">
                                <span class="price-label">1인 기준</span>
                                <span class="price-amount">{{ formatPrice(productDetail.adultPrice) }}원</span>
                            </div>
                                        <div class="date-info">
                <span class="selected-date">
                    {{ selectedDate ? formatSelectedDateForBooking(selectedDate) : '날짜를 선택해주세요' }}
                </span>
            </div>
                        </div>
                                <button class="btn-booking" @click="handleBooking" :disabled="!selectedDate">
            {{ selectedDate ? '예약하기' : '날짜를 선택해주세요' }}
        </button>
                    </div>
                </template>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TravelCalendar from '@/components/TravelCalendar.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('basic')

// 상태 관리
const isLoading = ref(false)
const error = ref(null)
const productDetail = ref(null)
const selectedDate = ref(null)
const bookingData = ref([])

// 섹션 refs
const basicSection = ref(null)
const noticeSection = ref(null)
const insuranceSection = ref(null)

// 가격 포맷팅
const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price)
}

// 상품 데이터 가져오기
const fetchProductDetail = async (productId) => {
    isLoading.value = true
    error.value = null
    
    try {
        // API 연동 시 실제 API 호출로 대체
        // const response = await fetch(\`/api/products/\${productId}\`)
        // const data = await response.json()
        
        // 임시 데이터
        const mockData = {
            id: productId,
            category: '당일 여행',
            title: '[당일/모닝출발]제주"회"랑놀자~한라산올레 제주맛집먹방투어 여행 1탄!',
            subtitle: '예송낭 "영화테우랑"바닷가놀자+중앙로먹방+화정해수욕장+가파도중앙로음식막거리',
            mainImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc7?w=800&h=400&fit=crop',
            productCode: 'JEJU001',
            productNumber: 'P20240301',
            travelDuration: '당일',
            eventContent: '제주도 당일 여행',
            adultPrice: 87000,
            childPrice: 67000,
            includedItems: '1식[조식제공], 교통비',
            excludedItems: '포함 외 식사, 기타 개인경비, 국내여행자보험',
            meetingPoint: '영등포 신세계백화점앞 / 서울역10번출구 남대문경찰서옆 / 잠실역4번출구 롯데마트앞 / 동천, 죽전, 신갈 간이정류장',
            images: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop', // 제주도 해안
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop', // 한라산
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', // 제주도 돌하르방
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop', // 제주도 오름
                'https://images.unsplash.com/photo-1441974231-5f9b92e4df3e?w=800&h=400&fit=crop', // 제주도 성산일출봉
                'https://images.unsplash.com/photo-1469474968-9eeefcd482b5?w=800&h=400&fit=crop', // 제주도 우도
                'https://images.unsplash.com/photo-1470071459-3aa88e2458dd?w=800&h=400&fit=crop', // 제주도 천지연폭포
                'https://images.unsplash.com/photo-1518837695-8b13bc4f7e78?w=800&h=400&fit=crop', // 제주도 협재해수욕장
                'https://images.unsplash.com/photo-1551698618-1c6c2f7db9b6?w=800&h=400&fit=crop', // 제주도 섭지코지
                'https://images.unsplash.com/photo-1559827260-3318565c6ad8?w=800&h=400&fit=crop', // 제주도 용머리해안
                'https://images.unsplash.com/photo-1519904981063-65d7b4d0b4f4?w=800&h=400&fit=crop', // 제주도 정방폭포
                'https://images.unsplash.com/photo-1539650116574-75c0c6d36dc7?w=800&h=400&fit=crop'  // 제주도 중문해수욕장
            ]
        }

        productDetail.value = mockData
        
        // 예약 데이터 로드 (더미 데이터)
        loadBookingData()
    } catch (e) {
        error.value = '상품 정보를 불러오는데 실패했습니다.'
        console.error('상품 정보 조회 실패:', e)
    } finally {
        isLoading.value = false
    }
}

// 스크롤 이벤트 핸들러
const handleScroll = () => {
    const sections = [
        { name: 'basic', element: basicSection.value },
        { name: 'notice', element: noticeSection.value },
        { name: 'insurance', element: insuranceSection.value }
    ]

    const scrollPosition = window.scrollY + 200

    for (const section of sections) {
        if (section.element) {
            const offsetTop = section.element.offsetTop
            const offsetBottom = offsetTop + section.element.offsetHeight

            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                activeTab.value = section.name
                break
            }
        }
    }
}

// 섹션으로 스크롤
const scrollToSection = (sectionName) => {
    const sectionMap = {
        basic: basicSection.value,
        notice: noticeSection.value,
        insurance: insuranceSection.value
    }

    const section = sectionMap[sectionName]
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

// 예약하기
const handleBooking = () => {
    router.push({
        name: 'booking',
        query: {
            productId: route.params.id
        }
    })
}

// 예약 데이터 로드 함수
const loadBookingData = () => {
    // 실제로는 API에서 받아올 데이터
    const today = new Date()
    const mockBookingData = []
    
    // 3주간의 더미 예약 데이터 생성
    for (let i = 0; i <= 21; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        // 랜덤하게 예약 인원 생성 (0~25명)
        const bookingCount = Math.floor(Math.random() * 26)
        
        // 로컬 시간대에서 날짜 포맷팅 (시간대 오류 방지)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateString = `${year}-${month}-${day}`
        
        mockBookingData.push({
            date: dateString,
            bookingCount: bookingCount,
            minRequired: 10
        })
    }
    
    bookingData.value = mockBookingData
}

// 날짜 선택 핸들러
const handleDateSelect = (dateInfo) => {
    console.log('선택된 날짜:', dateInfo)
    selectedDate.value = dateInfo.date
}

// 예약 섹션용 날짜 포맷팅
const formatSelectedDateForBooking = (date) => {
    if (!date) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[date.getDay()]
    
    return `${year}.${month}.${day} (${dayName})`
}

// 현재 URL 복사 함수
const copyCurrentUrl = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
        alert('주소가 복사되었습니다. 원하시는 곳에 붙여넣기 할 수 있습니다.')
    } catch (err) {
        alert('주소 복사에 실패했습니다. 다시 시도해주세요.')
        console.error('Failed to copy URL:', err)
    }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    const productId = route.params.id
    if (productId) {
        fetchProductDetail(productId)
    } else {
        error.value = '상품 ID가 없습니다.'
    }
    
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

// 이미지 슬라이더 관련 로직
const currentImageIndex = ref(0)

const prevImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    }
}

const nextImage = () => {
    if (currentImageIndex.value < productDetail.value.images.length - 1) {
        currentImageIndex.value++
    }
}

const setImage = (index) => {
    currentImageIndex.value = index
}
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
}

/* 전체 레이아웃 */
.product-detail-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--bg-light);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 메인 컨텐츠 */
.main-content {
    min-height: calc(100vh - 200px);
    padding: 1.5rem 0;
}

/* 상품 헤더 */
.product-header {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.product-category {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
}

.product-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.product-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
}

/* 상품 이미지 섹션 */
.product-image-section {
    margin: 2rem 0;
}

.image-slider {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
}

.image-container {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    border-radius: var(--border-radius);
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.slider-btn {
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1;
}

.slider-btn:hover {
    background: white;
    transform: scale(1.1);
}

.slider-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.prev {
    left: 1rem;
}

.next {
    right: 1rem;
}

.image-pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: var(--primary-color);
    transform: scale(1.2);
}

/* 상품 요약 정보 */
.product-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.summary-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    min-width: 80px;
}

.summary-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-primary);
}

.summary-value.price {
    color: var(--primary-color);
    font-size: 1.1rem;
    font-weight: 600;
}

/* 일정 선택 */
.schedule-selection {
    margin-bottom: 1.5rem;
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

/* 기본 가격표 추가 */
.base-price-section {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.price-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-table {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}

.price-table table {
    width: 100%;
    border-collapse: collapse;
}

.price-table th,
.price-table td {
    padding: 0.75rem;
    text-align: center;
    border: 1px solid var(--border-color);
}

.price-table th {
    background: #f8f9fa;
    font-weight: 500;
}

.price-table .date-cell {
    background: #f8f9fa;
    font-weight: 500;
    width: 30%;
}

.price-table .price-cell::after {
    content: '원';
    margin-left: 2px;
}

/* 탭 섹션 */
.tab-section {
    position: sticky;
    top: 0px;
    z-index: 100;
    background: white;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
}

.tab-menu {
    display: flex;
    border-bottom: 1px solid var(--border-color);
}

.tab-button {
    flex: 1;
    padding: 0.75rem;
    background: white;
    border: none;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    border-bottom: 2px solid transparent;
}

.tab-button.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    font-weight: 600;
}

.tab-button:hover:not(.active) {
    background: var(--bg-light);
}

/* 컨텐츠 섹션 */
.content-section {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
    scroll-margin-top: 140px;
}

.section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

/* 기본 정보 */
.basic-info {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.info-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.info-item:first-child {
    padding-top: 0;
}

.info-item h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
}

.info-item h3::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--primary-color);
    font-size: 1.2rem;
}

.info-item p {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    padding-left: 1rem;
    font-size: 0.95rem;
}

/* 공지사항 */
.notice-content, .insurance-content {
    display: grid;
    gap: 1rem;
}

.notice-item, .insurance-info, .insurance-details, .insurance-notice {
    padding: 1rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
}

.notice-item h3, .insurance-info h3, .insurance-details h3, .insurance-notice h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
}

.notice-item h3::before, .insurance-info h3::before, .insurance-details h3::before, .insurance-notice h3::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--primary-color);
}

.notice-item ul, .insurance-notice ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.notice-item li, .insurance-notice li {
    padding: 0.25rem 0;
    position: relative;
    padding-left: 1rem;
    font-size: 0.95rem;
    color: var(--text-secondary);
}

.notice-item li:before, .insurance-notice li:before {
    content: '-';
    position: absolute;
    left: 0;
    color: var(--text-secondary);
}

/* 보험 테이블 */
.insurance-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.75rem;
    font-size: 0.95rem;
}

.insurance-table th,
.insurance-table td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border: 1px solid var(--border-color);
}

.insurance-table th {
    background: var(--bg-light);
    color: var(--text-primary);
    font-weight: 600;
}

.insurance-table td {
    background: white;
    color: var(--text-secondary);
}

/* 예약 섹션 */
.booking-section {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
}

.booking-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.price-info {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.price-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.price-amount {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
}

.selected-date {
    font-size: 1rem;
    color: var(--text-primary);
}

.btn-booking {
    width: 100%;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.btn-booking:hover:not(:disabled) {
    background: var(--primary-dark);
}

.btn-booking:disabled {
    background: var(--border-color);
    color: var(--text-secondary);
    cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .product-title {
        font-size: 1.5rem;
    }

    .included-excluded {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .product-summary {
        grid-template-columns: 1fr;
    }

    .tab-section {
        top: 0;
        left: 0;
        right: 0;
        margin-bottom: 1.5rem;
        border-radius: 0;
        border-left: none;
        border-right: none;
    }

    .tab-menu {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid var(--border-color);
    }

    .tab-button {
        flex: 1;
        padding: 1rem 0.5rem;
        font-size: 0.9rem;
        white-space: nowrap;
        text-align: center;
    }

    .booking-section {
        padding: 0.75rem 1rem;
    }

    .booking-info {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 0.75rem;
    }

    .container {
        padding: 0 15px;
    }

    .content-section {
        padding: 1.5rem;
    }

    .slider-btn {
        width: 32px;
        height: 32px;
    }

    .prev {
        left: 0.5rem;
    }

    .next {
        right: 0.5rem;
    }
}

/* 보험 가입 섹션 스타일 */
.insurance-signup {
    margin: 30px 0;
}

.insurance-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.insurance-banner {
    background: linear-gradient(135deg, #4A90E2, #357ABD);
    border-radius: 12px;
    padding: 30px;
    color: white;
    transition: transform 0.2s ease;
}

.insurance-banner:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-content h3 {
    font-size: 24px;
    margin: 0 0 10px 0;
    color: white;
}

.banner-content p {
    font-size: 18px;
    margin: 0 0 20px 0;
    opacity: 0.9;
}

.banner-content ul {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.banner-content li {
    margin: 8px 0;
    font-size: 16px;
    opacity: 0.9;
    padding-left: 24px;
    position: relative;
}

.banner-content li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #ffffff;
}

.btn-insurance {
    background-color: white;
    color: #4A90E2;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-insurance:hover {
    background-color: #f0f0f0;
}

/* 보험 섹션 스타일 */
.insurance-content {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.insurance-info {
    background: white;
    padding: 20px;
    border-radius: 8px;
}

.info-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 16px;
}

.info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: #4A90E2;
    color: white;
    border-radius: 50%;
    font-style: normal;
    font-size: 14px;
}

.insurance-info p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
}

.insurance-button {
    display: inline-block;
    background: #6C8EF2;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
}

.insurance-button:hover {
    background: #5A7DE0;
}

/* 로딩 및 에러 상태 스타일 */
.loading-state,
.error-state {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: var(--border-radius);
    margin: 1rem 0;
}

.error-state {
    color: var(--error-color);
}

/* 가격 표시 스타일 */
.price-item {
    grid-column: 1 / -1;
}

.price-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.price-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.price-type {
    font-size: 0.9rem;
    color: var(--text-secondary);
    min-width: 40px;
}
</style> 