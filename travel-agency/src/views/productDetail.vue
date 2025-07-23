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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <div class="image-container">
                                <img :src="productDetail.images[currentImageIndex]"
                                    :alt="'상품 이미지 ' + (currentImageIndex + 1)" class="product-image">
                            </div>
                            <button class="slider-btn next" @click="nextImage"
                                :disabled="currentImageIndex === productDetail.images.length - 1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                            <div class="image-pagination">
                                <span v-for="(_, index) in productDetail.images" :key="index"
                                    :class="['dot', { active: index === currentImageIndex }]" @click="setImage(index)">
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 상품 요약 정보 -->
                    <div class="product-summary">
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
                        <div class="share-buttons">
                            <button @click="copyCurrentUrl" class="share-btn copy-btn" title="링크 복사">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </button>
                            <button @click="shareToKakao" class="share-btn kakao-btn" title="카카오톡 공유">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.492 4.625 3.77 6.056L5 20l3.925-1.965C9.835 18.35 10.892 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
                                </svg>
                            </button>
                        </div>
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


                    <!-- 일정 선택 -->
                    <div class="schedule-selection">
                        <TravelCalendar 
                            v-model="selectedDate" 
                            :booking-data="bookingData" 
                            :min-required-booking="productDetail.likelyDepartureThreshold || 10"
                            :confirmed-threshold="confirmedThreshold"
                            @date-select="handleDateSelect" 
                        />
                    </div>

                    <!-- 탭 메뉴 -->
                    <div class="tab-section">
                        <div class="tab-menu">
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'basic' }"
                                @click="scrollToSection('basic')">
                                기본정보
                            </button>
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'detail' }"
                                @click="scrollToSection('detail')">
                                상세정보
                            </button>
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'notice' }"
                                @click="scrollToSection('notice')">
                                유의 및 취소사항
                            </button>
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'insurance' }"
                                @click="scrollToSection('insurance')">
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
                                <h3>모이는 장소</h3>
                                <div class="meeting-points-list">
                                    <div v-if="startingPoints.length === 0" class="no-points">
                                        <p>출발지점 정보를 불러오는 중입니다...</p>
                                    </div>
                                    <div v-else class="points-list">
                                        <div v-for="point in startingPoints" :key="point.id"
                                            class="point-item">
                                            <span class="point-name">{{ point.name }}</span>
                                            <span v-if="point.time" class="point-time">({{ formatTime(point.time) }})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 상세 이미지 섹션 -->
                    <section id="detail" v-if="productDetail.detailImage" class="content-section detail-image-section" ref="detailSection">
                        <h2 class="section-title">상세정보</h2>
                        <div class="detail-image-container">
                            <img 
                                :src="productDetail.detailImage" 
                                :alt="productDetail.title + ' 상세 이미지'"
                                class="detail-image"
                                @error="handleImageError"
                            />
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
                                    2012년 8월 18일부로 시행된 "개인정보통신법"은 인터넷상에서 개인정보(주민등록번호) 유출을 방지하고자 개인정보 수집을 금지토록 하고 있어
                                    여행자보험가입이 안됨을 알려드립니다.이에 따라 2012년 8월 20일 이후 출발하는 국내여행상품의 여행자보험 가입을 원하는 경우에는 개별 가입을
                                    권장합니다.
                                </p>
                                <a href="https://web.travelover.co.kr/insu/intro/dom?" target="_blank"
                                    class="insurance-button">
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
                            예약하기
                        </button>
                    </div>
                </template>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import TravelCalendar from '@/components/TravelCalendar.vue'
import { getProductDetail, getProductBookingData } from '@/lib/products.js'
import { getProductStartingPoints } from '@/lib/startingpoints.js'

const route = useRoute()
const router = useRouter()
const activeTab = ref('basic')

// SEO 메타 태그 설정
const setMetaTags = (product) => {
  if (!product) return
  
  const currentUrl = window.location.href
  
  // 이미지 URL 결정 (우선순위: mainImage > images[0] > 기본 이미지)
  let imageUrl = product.mainImage || product.images?.[0] || '/logo.png'
  
  // 이미지 URL이 이미 절대 경로인지 확인 (Supabase Storage URL)
  if (imageUrl && !imageUrl.startsWith('http')) {
    // 상대 경로인 경우 절대 경로로 변환
    if (imageUrl.startsWith('/')) {
      imageUrl = `${window.location.origin}${imageUrl}`
    } else {
      imageUrl = `${window.location.origin}/${imageUrl}`
    }
  }
  
  // 이미지 URL이 유효한지 확인
  if (!imageUrl || imageUrl === '/images/default-product.jpg') {
    imageUrl = `${window.location.origin}/logo.png` // 기본 로고 이미지 사용
  }
  
  console.log('메타 태그 설정:', {
    title: product.title,
    imageUrl: imageUrl,
    description: product.subtitle || product.title
  })
  
  // useHead를 사용하여 메타 태그 설정
  useHead({
    title: `${product.title} - 나라투어`,
    meta: [
      // Open Graph 태그
      { property: 'og:title', content: product.title },
      { property: 'og:description', content: product.subtitle || product.title },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: '나라투어' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      
      // Twitter Card 태그
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: product.title },
      { name: 'twitter:description', content: product.subtitle || product.title },
      { name: 'twitter:image', content: imageUrl },
      
      // 기본 메타 태그
      { name: 'description', content: product.subtitle || product.title },
      { name: 'keywords', content: `${product.title}, 여행, 투어, ${product.category || ''}` }
    ]
  })
}

// 상태 관리
const isLoading = ref(false)
const error = ref(null)
const productDetail = ref(null)
const selectedDate = ref(null)
const bookingData = ref([])
const confirmedThreshold = ref(20)
const startingPoints = ref([])

// 섹션 refs
const basicSection = ref(null)
const noticeSection = ref(null)
const insuranceSection = ref(null)
const detailSection = ref(null) // 상세 이미지 섹션을 위한 ref 추가

// 가격 포맷팅
const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price)
}

// 시간 포맷팅
const formatTime = (timeString) => {
    if (!timeString) return ''
    // 'HH:MM:SS' 형식을 'HH:MM' 형식으로 변환
    return timeString.substring(0, 5)
}

// productDetail 변경 시 메타 태그 업데이트
watch(productDetail, (newProduct) => {
  if (newProduct) {
    setMetaTags(newProduct)
  }
}, { immediate: true })

// 출발지점 데이터 가져오기
const fetchStartingPoints = async (productId) => {
    try {
        const response = await getProductStartingPoints(productId)
        if (response.success) {
            startingPoints.value = response.startingPoints
        } else {
            console.error('출발지점 조회 실패:', response.error)
            startingPoints.value = []
        }
    } catch (error) {
        console.error('출발지점 조회 오류:', error)
        startingPoints.value = []
    }
}

// 상품 데이터 가져오기
const fetchProductDetail = async (productId) => {
    isLoading.value = true
    error.value = null

    try {
        // 기존 구현된 getProductDetail 함수 사용
        const response = await getProductDetail(productId)

        if (response.success) {
            // API 응답 데이터를 화면에 맞게 매핑
            const product = response.product
            productDetail.value = {
                id: product.id,
                category: product.category,
                title: product.title,
                subtitle: product.subtitle,
                mainImage: product.mainImage,
                detailImage: product.detailImage,
                productCode: product.productCode,
                productNumber: product.productNumber,
                travelDuration: product.travelDuration,
                eventContent: product.eventContent,
                adultPrice: product.adultPrice,
                childPrice: product.childPrice,
                includedItems: product.includedItems,
                excludedItems: product.excludedItems,
                meetingPoint: product.meetingPoint,
                likelyDepartureThreshold: product.likelyDepartureThreshold,
                confirmedDepartureThreshold: product.confirmedDepartureThreshold,
                images: product.images.length > 0 ? product.images : ['/images/default-product.jpg']
            }
            
            // 예약 데이터 로드 (실제 데이터)
            await loadBookingData(productId)
            
            // 출발지점 데이터 로드
            await fetchStartingPoints(productId)
            
            // 출발확정 기준 설정
            confirmedThreshold.value = product.confirmedDepartureThreshold || 20
        } else {
            if (response.error && response.error.includes('No rows found')) {
                error.value = '존재하지 않는 상품입니다.'
            } else {
                error.value = response.error || '상품 정보를 불러오는데 실패했습니다.'
            }
        }
    } catch (e) {
        error.value = e.message || '상품 정보를 불러오는데 실패했습니다.'
        console.error('상품 정보 조회 실패:', e)
    } finally {
        isLoading.value = false
    }
}

// 스크롤 이벤트 핸들러
const handleScroll = () => {
    const sections = [
        { name: 'basic', element: basicSection.value },
        { name: 'detail', element: detailSection.value }, // 상세정보는 이미지 섹션에 포함되므로 별도 처리
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
        detail: detailSection.value, // 상세정보는 이미지 섹션에 포함되므로 별도 처리
        notice: noticeSection.value,
        insurance: insuranceSection.value
    }

    const section = sectionMap[sectionName]
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

// 로컬 시간대를 유지하여 날짜 형식 변환
const formatLocalDate = (date) => {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// 예약하기
const handleBooking = () => {
    router.push({
        name: 'booking',
        query: {
            productId: parseInt(route.params.id),
            selectedDate: selectedDate.value ? formatLocalDate(selectedDate.value) : null
        }
    })
}

// 예약 데이터 로드 함수
const loadBookingData = async (productId) => {
    try {
        const response = await getProductBookingData(productId)
        
        if (response.success) {
            bookingData.value = response.bookingData
            confirmedThreshold.value = response.confirmedThreshold
        } else {
            console.error('예약 데이터 로드 실패:', response.error)
            // 실패 시 빈 배열로 설정
            bookingData.value = []
        }
    } catch (error) {
        console.error('예약 데이터 로드 오류:', error)
        bookingData.value = []
    }
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
        alert('주소가 복사되었습니다.')
    } catch (err) {
        // 간단한 fallback
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('주소가 복사되었습니다.')
    }
}

// 카카오톡 공유 함수
const shareToKakao = () => {
    const url = window.location.href
    const title = productDetail.value?.title || '여행 상품'
    const text = `${title}\n${url}`

    // 모바일에서 Web Share API 시도
    if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        navigator.share({
            title: title,
            url: url
        }).catch(() => {
            // 실패하면 링크 복사
            copyCurrentUrl()
            alert('링크가 복사되었습니다. 카카오톡에서 붙여넣기 해주세요.')
        })
    } else {
        // 데스크톱이거나 Web Share API 미지원시 링크 복사
        copyCurrentUrl()
        alert('링크가 복사되었습니다. 카카오톡에서 붙여넣기 해주세요.')
    }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
    const productId = parseInt(route.params.id)
    if (productId && !isNaN(productId)) {
        fetchProductDetail(productId)
    } else {
        error.value = '올바르지 않은 상품 ID입니다.'
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

// 이미지 에러 핸들러
const handleImageError = (event) => {
    event.target.style.display = 'none'
    console.warn('상세 이미지를 불러올 수 없습니다:', event.target.src)
}
</script>

<style scoped>


/* 전체 레이아웃 */
.product-detail-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

.container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 메인 컨텐츠 */
.main-content {
    min-height: calc(100vh - 200px);
    padding: 3.5rem 0 2rem 0;
}

/* 상품 헤더 */
.product-header {
    background: white;
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
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

/* 공유 버튼 */
.product-summary .share-buttons {
    position: absolute;
    bottom: 1.25rem;
    right: 1.25rem;
    display: flex;
    gap: 0.5rem;
}

.share-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.share-btn:hover {
    box-shadow: var(--shadow-sm);
}

.copy-btn {
    color: var(--text-secondary);
}

.copy-btn:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
}

.kakao-btn {
    color: #3C1E1E;
    background: #FEE500;
    border-color: #FEE500;
}

/* 상품 이미지 섹션 */
.product-image-section {
    margin: 1.5rem 0;
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
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    z-index: 2;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot:hover {
    background: rgba(255, 255, 255, 0.9);
}

.dot.active {
    background: var(--primary-color);
    transform: scale(1.2);
}

/* 상품 요약 정보 */
.product-summary {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    background: white;
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow-x: auto;
}

/* 상세 이미지 섹션 */
.detail-image-section {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.detail-image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}

.detail-image {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
}

/* 기본 가격표 추가 */
.base-price-section {
    background: white;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
}

.price-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
}

.price-table {
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.price-table table {
    width: 100%;
    border-collapse: collapse;
}

.price-table th,
.price-table td {
    padding: 0.5rem 0.75rem;
    text-align: center;
    border: none;
    font-size: 0.95rem;
}

.price-table th {
    background: var(--primary-light);
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.9rem;
}

.price-table .date-cell {
    background: var(--bg-light);
    font-weight: 600;
    color: var(--text-primary);
    width: 30%;
    font-size: 0.9rem;
}

.price-table td {
    background: white;
}

.price-table tbody tr:last-child td {
    border-bottom: none;
}

.price-table .price-cell {
    font-weight: 600;
    color: var(--primary-light);
}

.price-table .price-cell::after {
    content: '원';
    margin-left: 2px;
    font-weight: 400;
}

/* 탭 섹션 */
.tab-section {
    position: sticky;
    top: 0px;
    z-index: 2;
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
    padding: 0.75rem 0.5rem;
    background: white;
    border: none;
    font-size: 0.9rem;
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
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    scroll-margin-top: 140px;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    padding-bottom: 0.75rem;
}

/* 기본 정보 */
.basic-info {
    margin-top: 0;
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
}

.info-item p {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    padding-left: 1rem;
    font-size: 0.95rem;
}

/* 모이는 장소 리스트 스타일 */
.meeting-points-list {
    padding-left: 1rem;
}

.no-points p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin: 0;
    font-style: italic;
}

.points-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.point-item {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 공지사항 */
.notice-content,
.insurance-content {
    display: grid;
    gap: 1rem;
}

.insurance-info,
.insurance-details,
.insurance-notice {
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);
}

.notice-item:last-child,
.insurance-info:last-child,
.insurance-details:last-child,
.insurance-notice:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.notice-item h3,
.insurance-info h3,
.insurance-details h3,
.insurance-notice h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
}

.notice-item h3::before,
.insurance-info h3::before,
.insurance-details h3::before,
.insurance-notice h3::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--primary-color);
}

.notice-item ul,
.insurance-notice ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.notice-item li,
.insurance-notice li {
    padding: 0.25rem 0;
    position: relative;
    padding-left: 1rem;
    font-size: 0.95rem;
    color: var(--text-secondary);
}

.notice-item li:before,
.insurance-notice li:before {
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
    z-index: 2;
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
    .main-content {
        padding-top: 1.5rem;
    }

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
        top: 80px;
        /* 헤더 높이만큼 아래로 */
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
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .booking-info {
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 0.75rem;
        width: 100%;
    }

    .btn-booking {
        max-width: 250px;
        width: 250px;
        padding: 0.75rem 1rem;
    }

    .container {
        padding: 0 15px;
    }

    .content-section {
        padding: 1rem;
        scroll-margin-top: 160px;
        /* 헤더(80px) + 탭섹션(약 80px) */
    }

    .schedule-selection {
        padding: 1rem;
    }

    .product-summary .share-buttons {
        position: static;
        justify-content: flex-end;
        margin-top: 1rem;
        bottom: auto;
        right: auto;
        grid-column: 1 / -1;
    }

    .share-btn {
        width: 32px;
        height: 32px;
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

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }

    .schedule-selection {
        padding: 0.75rem;
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
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: var(--border-radius);
    padding: 1.5rem;
    color: white;
    transition: transform 0.2s ease;
}

.insurance-banner:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-content h3 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
    color: white;
}

.banner-content p {
    font-size: 1rem;
    margin: 0 0 1rem 0;
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
    color: var(--primary-color);
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-insurance:hover {
    background-color: var(--bg-light);
}

/* 보험 섹션 스타일 */
.insurance-content {
    margin-top: 0;
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
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    font-style: normal;
    font-size: 14px;
}

.insurance-info p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.insurance-button {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
}

.insurance-button:hover {
    background: var(--primary-dark);
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