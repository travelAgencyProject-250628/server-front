<template>
    <div class="product-detail-page">
        <!-- PC용 상품 헤더 - main-content 밖으로 이동 -->
        <div v-if="productDetail" class="product-header pc-header">
            <div class="product-category">{{ productDetail.category }}</div>
            <h1 class="product-title">{{ productDetail.title }}</h1>
            <p class="product-subtitle">{{ productDetail.subtitle }}</p>
        </div>
        
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
                    <!-- 모바일용 상품 헤더 - container 안에 유지 -->
                    <div class="product-header mobile-header">
                        <div class="product-category">{{ productDetail.category }}</div>
                        <h1 class="product-title">{{ productDetail.title }}</h1>
                        <p class="product-subtitle">{{ productDetail.subtitle }}</p>
                    </div>

                    <!-- PC용: 이미지만 포함하는 컨테이너 -->
                    <div class="product-main-info pc-only">
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
                    </div>

                    <!-- 모바일용: 이미지와 요약정보를 함께 포함하는 컨테이너 -->
                    <div class="product-main-info mobile-only">
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

                        <!-- 모바일용 상품 요약 정보 -->
                        <div class="product-summary mobile-summary">
                            <div class="summary-content">
                                <div class="summary-item">
                                    <span class="summary-label">여행 기간</span>
                                    <span class="summary-value">{{ productDetail.travelDuration }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">포함 내역</span>
                                    <span class="summary-value">{{ productDetail.includedItems }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">불포함 내역</span>
                                    <span class="summary-value">{{ productDetail.excludedItems }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="summary-label">출발 날짜</span>
                                    <span class="summary-value">2024.03.15 (금)</span>
                                </div>
                            </div>
                            <div class="share-buttons">
                                <button @click="shareToKakao" class="share-btn kakao-btn" title="카카오톡 공유">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.492 4.625 3.77 6.056L5 20l3.925-1.965C9.835 18.35 10.892 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
                                    </svg>
                                    <span>카카오톡공유</span>
                                </button>
                                <button @click="copyCurrentUrl" class="share-btn url-btn" title="URL 복사">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    <span>URL공유하기</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    <!-- 일정 선택 -->
                    <div class="schedule-selection">
                        <TravelCalendar 
                            v-model="selectedDate" 
                            :product-id="parseInt(route.params.id)"
                            :min-required-booking="productDetail.likelyDepartureThreshold || 10"
                            :confirmed-threshold="confirmedThreshold"
                            :closing-threshold="productDetail.closingThreshold || 44"
                            @date-select="handleDateSelect" 
                        />
                    </div>

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
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'basic' }"
                                @click="scrollToSection('basic')">
                                기본정보
                            </button>
                            <button type="button" class="tab-button" :class="{ active: activeTab === 'detail' }"
                                @click="scrollToSection('detail')">
                                여행일정표
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

                    <!-- 여행일정표 섹션 -->
                    <section id="detail" class="content-section itinerary-section" ref="detailSection">

                        <h2 class="section-title">여행일정표</h2>
                        <div v-if="productDetail.itinerary" class="itinerary-container">
                            <div v-for="day in (Array.isArray(productDetail.itinerary) ? productDetail.itinerary : productDetail.itinerary.itinerary)" :key="day.day" class="day-section">
                                <div class="day-header">
                                    <h3 class="day-title">{{ day.day }}일차</h3>
                                </div>
                                
                                                            <!-- 식사 정보 -->
                            <div class="meal-info" v-if="day.meals">
                                <div class="meal-row">
                                    <div class="meal-icon">🍽️</div>
                                    <div class="meal-content">
                                        <span class="meal-label">식사</span>
                                        <div class="meal-buttons">
                                            <div class="meal-item" v-if="day.meals.breakfast">
                                                <span class="meal-keyword">조식</span>
                                                <span class="meal-menu">{{ day.meals.breakfast }}</span>
                                            </div>
                                            <div class="meal-item" v-if="day.meals.lunch">
                                                <span class="meal-keyword">중식</span>
                                                <span class="meal-menu">{{ day.meals.lunch }}</span>
                                            </div>
                                            <div class="meal-item" v-if="day.meals.dinner">
                                                <span class="meal-keyword">석식</span>
                                                <span class="meal-menu">{{ day.meals.dinner }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                
                                <!-- 타임라인 일정 -->
                                <div class="timeline-container">
                                    <div class="timeline-line"></div>
                                    <div class="timeline-events">
                                        <template v-for="(location, index) in day.locations" :key="index">
                                            <!-- 지역 헤더 -->
                                            <div v-if="location.isAreaHeader" class="area-header">
                                                <div class="area-marker"></div>
                                                <div class="area-content">
                                                    <div class="area-icon">📍</div>
                                                    <span class="area-name">{{ location.name }}</span>
                                                </div>
                                            </div>
                                            
                                            <!-- 일정 항목 -->
                                            <div class="timeline-event">
                                                <div v-if="location.name" class="event-marker">
                                                    <div class="location-icon">
                                                        <img src="/place_icon.png" alt="장소" class="location-icon-img" />
                                                    </div>
                                                </div>
                                                <div class="event-content">
                                                    <div class="event-details">
                                                        <!-- PC용 location-info -->
                                                        <div class="location-info pc-location-info">
                                                            <div class="location-name">{{ location.name }}</div>
                                                            <div class="event-time">{{ location.time }}</div>
                                                            <div class="activity-description">
                                                                {{ location.activity }}
                                                                <div v-if="location.caution" class="caution-note">
                                                                    <span class="caution-text">{{ location.caution }}</span>
                                                                </div>
                                                            </div>                                                            
                                                        </div>
                                                        
                                                        <!-- 모바일용 location-info -->
                                                        <div class="location-info mobile-location-info">
                                                            <div class="mobile-time-name">
                                                                <div class="event-time">{{ location.time }}</div>
                                                                <div class="location-name">{{ location.name }}</div>
                                                            </div>
                                                            <div class="activity-description">
                                                                {{ location.activity }}
                                                                <div v-if="location.caution" class="caution-note">
                                                                    <span class="caution-text">{{ location.caution }}</span>
                                                                </div>
                                                            </div>                                                            
                                                        </div>
                                                        
                                                        <!-- 주의사항 -->
                                                        
                                                        
                                                        <!-- 상세 정보 -->
                                                        <div v-if="location.details && location.details.length > 0" class="detail-sections">
                                                            <div v-for="(detail, detailIndex) in location.details" :key="detailIndex" class="detail-section">
                                                                <h4 class="detail-title">{{ detail.title }}</h4>
                                                                <p class="detail-description" v-html="formatDescription(detail.description)"></p>
                                                                <div v-if="detail.images && detail.images.length > 0" class="detail-images">
                                                                    <img 
                                                                        v-for="(image, imageIndex) in detail.images" 
                                                                        :key="imageIndex"
                                                                        :src="image"
                                                                        :alt="detail.title + ' 이미지'"
                                                                        class="detail-image"
                                                                        @error="handleImageError"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-itinerary">
                            <p>여행일정표 정보가 준비 중입니다.</p>
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

                    <!-- 모바일용 예약 버튼 -->
                    <div class="booking-section mobile-booking">
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
            
            <!-- PC용 상품 요약 정보 - main-content 내부, container와 같은 레벨 -->
            <div v-if="productDetail" class="product-summary">
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="summary-label">상품코드</span>
                        <span class="summary-value">{{ productDetail.productCode }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">여행기간</span>
                        <span class="summary-value">{{ productDetail.travelDuration }}</span>
                    </div>
                    <!-- <div class="summary-item">
                        <span class="summary-label">포함내역</span>
                        <span class="summary-value">{{ productDetail.includedItems }}</span>
                    </div>                                         -->
                    <div v-if="productDetail.eventContent" class="summary-item event-content-summary">
                        <span class="summary-label">행사내용</span>
                        <span class="summary-value">{{ productDetail.eventContent }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">출발날짜</span>
                        <span class="summary-value">2024.03.15 (금)</span>
                    </div>
                </div>
                <div class="share-buttons">
                    <button @click="shareToKakao" class="share-btn kakao-btn" title="카카오톡 공유">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.492 4.625 3.77 6.056L5 20l3.925-1.965C9.835 18.35 10.892 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
                        </svg>
                        <span>카카오톡 공유</span>
                    </button>
                    <button @click="copyCurrentUrl" class="share-btn url-btn" title="URL 복사">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span>링크 공유</span>
                    </button>
                </div>
                
                <!-- PC용 예약 버튼 - product-summary 안에 포함 -->
                <div class="booking-section pc-booking">
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
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TravelCalendar from '@/components/TravelCalendar.vue'
import { getProductDetail, getProductBookingData } from '@/lib/products.js'
import { getProductStartingPoints } from '@/lib/startingpoints.js'

const route = useRoute()
const router = useRouter()
const activeTab = ref('basic')

// 줄바꿈을 <br> 태그로 변환하는 함수
const formatDescription = (description) => {
  if (!description) return ''
  return description.replace(/\n/g, '<br>')
}

// SEO 메타 태그 설정
const setMetaTags = (product) => {
  if (!product) return
  
  const currentUrl = window.location.href
  
  console.log('setMetaTags 호출됨 - 상품 데이터:', {
    mainImage: product.mainImage,
    images: product.images,
    title: product.title
  })
  
  // 이미지 URL 결정 (우선순위: mainImage > images[0] > 기본 이미지)
  let imageUrl = product.mainImage || product.images?.[0] || '/logo.png'
  
  console.log('선택된 이미지 URL:', imageUrl)
  
  // 이미지 URL 처리
  if (imageUrl && imageUrl.startsWith('http')) {
    // 절대 URL - 그대로 사용
    // (확장자 처리 제거)
  } else if (imageUrl && !imageUrl.startsWith('http')) {
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
  
  console.log('최종 메타 태그 설정:', {
    title: product.title,
    imageUrl: imageUrl,
    description: product.subtitle || product.title
  })
  
  // 페이지 제목 설정
  document.title = `${product.title} - 더쉼투어`
  
  // 기존 메타 태그 제거
  const existingMetaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"], meta[name="keywords"]')
  existingMetaTags.forEach(tag => tag.remove())
  
  // Open Graph 태그 추가
  const ogTags = [
    { property: 'og:title', content: product.title },
    { property: 'og:description', content: product.subtitle || product.title },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: currentUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: '더쉼투어' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' }
  ]
  
  // Twitter Card 태그 추가
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: product.title },
    { name: 'twitter:description', content: product.subtitle || product.title },
    { name: 'twitter:image', content: imageUrl }
  ]
  
  // 기본 메타 태그 추가
  const basicTags = [
    { name: 'description', content: product.subtitle || product.title },
    { name: 'keywords', content: `${product.title}, 여행, 투어, ${product.category || ''}` }
  ]
  
  // 모든 태그를 head에 추가
  ;[...ogTags, ...twitterTags, ...basicTags].forEach(tag => {
    const meta = document.createElement('meta')
    Object.entries(tag).forEach(([key, value]) => {
      meta.setAttribute(key, value)
    })
    document.head.appendChild(meta)
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
            
            console.log('API에서 받아온 상품 데이터:', product)
            
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
                closingThreshold: product.closingThreshold,
                images: product.images.length > 0 ? product.images : ['/images/default-product.jpg'],
                main_image_url: product.main_image_url, // 새로 추가된 필드
                itinerary: (() => {
                    let itinerary = product.itinerary
                    
                    // 문자열인 경우 파싱
                    if (typeof itinerary === 'string') {
                        try {
                            itinerary = JSON.parse(itinerary)
                        } catch (error) {
                            console.error('itinerary JSON 파싱 오류:', error)
                            return null
                        }
                    }
                    
                    // 배열 형태로 저장된 경우 그대로 사용
                    if (Array.isArray(itinerary)) {
                        return itinerary
                    }
                    
                    // {days: ..., itinerary: [...]} 형태인 경우
                    if (itinerary && itinerary.itinerary && Array.isArray(itinerary.itinerary)) {
                        return itinerary
                    }
                    
                    return null
                })()
            }
            
            console.log('매핑된 productDetail:', productDetail.value)
            console.log('API에서 받아온 원본 데이터:', product)
            console.log('itinerary 데이터:', productDetail.value.itinerary)
            
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
    const url = location.href;          // 현재 페이지
    const title = productDetail.value?.name || document.title || '여행상품';
    
    // 메인 이미지 URL 처리 (절대 URL로 변환, fallback은 로고)
    let imageUrl = `${window.location.origin}/logo.png`; // 기본값: 로고
    
    // 여러 가능한 필드명 확인
    const mainImageUrl = productDetail.value?.main_image_url || 
                         productDetail.value?.mainImage || 
                         productDetail.value?.images?.[0];
    
    if (mainImageUrl) {
        console.log('원본 메인 이미지 URL:', mainImageUrl);
        
        // URL 형태별 처리
        if (mainImageUrl.startsWith('http://') || mainImageUrl.startsWith('https://')) {
            // 절대 URL - 그대로 사용
            imageUrl = mainImageUrl;
        } else if (mainImageUrl.startsWith('/')) {
            // 상대 URL을 절대 URL로 변환
            imageUrl = `${window.location.origin}${mainImageUrl}`;
        } else {
            // 파일명만 있는 경우
            imageUrl = `${window.location.origin}/${mainImageUrl}`;
        }
    }
    
    console.log('카카오톡 공유 최종 이미지 URL:', imageUrl);

    try {
        Kakao.Share.sendDefault({
            objectType: 'feed',                 // 가장 단순한 카드형
            content: {
                title,
                description: productDetail.value?.description || '함께 여행해요!',
                imageUrl: imageUrl,   // 메인 이미지 (또는 로고)
                link: {
                    mobileWebUrl: url,
                    webUrl: url
                }
            },
            buttons: [
                {
                    title: '여행상품 보러가기',
                    link: { mobileWebUrl: url, webUrl: url }
                }
            ]
        });
    } catch (error) {
        console.error('카카오톡 공유 오류:', error);
        alert('카카오톡 공유 중 오류가 발생했습니다.');
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
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* 메인 컨텐츠 */
.main-content {
    min-height: calc(100vh - 200px);
    padding: 3.5rem 0 2rem 0;
}

/* PC용 상품 헤더 */
@media (min-width: 1200px) {
    .pc-header {
        width: calc(1200px - 4rem);
        margin: 0 auto;
        position: relative;
        padding-top: 2rem;
    }
    
    .pc-header::after {
        content: '';
        position: absolute;
        bottom: -1.5rem;
        left: 0;
        right: -2rem;
        height: 1px;
        background-color: black;
    }

    /* PC에서 모바일용 location-info 숨기기 */
    .mobile-location-info {
        display: none !important;
    }

    /* PC에서 PC용 location-info 표시 */
    .pc-location-info {
        display: flex !important;
    }
}

/* 모바일용 상품 헤더 */
@media (max-width: 1199px) {
    .mobile-header {
        background: white;
        padding: 0 0.7rem;
    }
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

/* 공유 버튼 스타일 */
.share-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    justify-content: flex-end;
}

.share-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    min-width: 140px;
    justify-content: center;
}

.kakao-btn {
    background-color: #FEE500;
    color: #3C1E1E;
}

.kakao-btn:hover {
    background-color: #FDD835;
}

.url-btn {
    background-color: white;
    color: #0D9488;
    border: 1px solid #0D9488;
}

.url-btn:hover {
    background-color: #F0FDFA;
}

.share-btn svg {
    flex-shrink: 0;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.8rem;
    background: white;
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    margin-bottom: 1.5rem;
}

/* PC에서만 main-content를 flex로 만들고 사이드바 배치 */
@media (min-width: 1200px) {
    .main-content {
        display: flex;
        align-items: flex-start;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .main-content .container {
        flex: 1;
    }
    
    .product-summary {
        width: 330px;
        flex-shrink: 0;
        margin-bottom: 0;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 45px;
        align-self: flex-start;
        height: fit-content;
    }
    
    /* PC에서만 pc-only 컨테이너 보이기 */
    .pc-only {
        display: block !important;
    }
    
    .mobile-only {
        display: none !important;
    }
    
    /* PC에서만 pc-header 보이기 */
    .pc-header {
        display: block !important;
    }
    
    .mobile-header {
        display: none !important;
    }
    
    /* PC에서만 pc-booking 보이기 */
    .pc-booking {
        display: block !important;
    }
    
    .mobile-booking {
        display: none !important;
    }
}

/* 모바일에서는 기존과 완전히 동일하게 - 모바일용 컨테이너 사용 */
@media (max-width: 1199px) {
    .main-content {
        display: flex;
        flex-direction: column;
    }
    
    .main-content .container {
        display: flex;
        flex-direction: column;
        padding: 0;
    }
    
    /* 모바일에서만 mobile-only 컨테이너 보이기 */
    .pc-only {
        display: none !important;
    }
    
    .mobile-only {
        display: block !important;
    }
    
    /* 모바일에서만 mobile-header 보이기 */
    .pc-header {
        display: none !important;
    }
    
    .mobile-header {
        display: block !important;
    }
    
    /* 모바일에서만 mobile-booking 보이기 */
    .pc-booking {
        display: none !important;
    }
    
    .mobile-booking {
        display: block !important;
    }
    
    /* 모바일에서 PC용 사이드바 숨기기 */
    .main-content > .product-summary {
        display: none !important;
    }
    
    /* 모바일용 요약정보는 기존 스타일 유지 */
    .mobile-summary {
        margin-bottom: 1.5rem;
    }

    .image-container {
        border-radius: 0;
    }
    
    /* 768px 이하에서는 이미지와 요약정보를 붙여서 하나의 카드처럼 만들기 */
    @media (max-width: 768px) {
        .mobile-only .product-main-info {
            margin-bottom: 0;
        }
        
        .mobile-summary {
            margin-top: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }
}

.summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
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

/* 여행일정표 섹션 */
.itinerary-section {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.itinerary-container {
    margin-top: 1rem;
}

.day-section {
    margin-bottom: 2rem;
    background: white;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.day-section:last-child {
    margin-bottom: 0;
}

.day-header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 1.5rem;
}

.day-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}

/* 식사 정보 */
.meal-info {
    border-bottom: 1px solid var(--border-color);
}

.meal-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
}

.meal-icon {
    font-size: 1.2rem;
}

.meal-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
}

.meal-label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
}

.meal-buttons {
    display: flex;
    gap: 1rem;
}

.meal-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.meal-keyword {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
}

.meal-menu {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
}

/* 타임라인 컨테이너 */
.timeline-container {
    position: relative;
    padding: 2rem 0;
    padding-right: 10px;
}

.timeline-line {
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--primary-color);
    z-index: 1;
}

.timeline-events {
    position: relative;
    z-index: 2;
}

/* 지역 헤더 */
.area-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 0 0 0 60px;
}

.area-marker {
    position: absolute;
    left: 20px;
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 0 0 2px var(--primary-color);
    z-index: 3;
}

.area-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-weight: 600;
    color: var(--text-primary);
}

.area-icon {
    font-size: 1.2rem;
}

.area-name {
    font-size: 1.1rem;
}

/* 타임라인 이벤트 */
.timeline-event {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 0 0 0 40px;
    position: relative;
}

.timeline-event:last-child {
    margin-bottom: 0;
}

.event-marker {
    position: absolute;
    left: calc(40px/2 - 24px/2);
    z-index: 2;
}

.location-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.location-icon-img {
    width: 26px;
    height: 26px;
    object-fit: contain;
}

.event-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.event-time {
    color: var(--primary-color);
    font-weight: 600;
    font-size: 0.9rem;
    width: 4rem;
}

.event-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}

.location-info {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.location-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
    width: 7rem;
}

.activity-description {
    color: black;
    font-size: 0.9rem;
    line-height: 1.4;
    word-wrap: break-word;
    white-space: normal;
    flex: 1;
}

/* 주의사항 */
.caution-note {
    display: inline;
    margin-left: 0.5rem;
    text-align: center;
}

.caution-text {
    font-size: 0.85rem;
    color: red;
    font-weight: 500;
}

.detail-sections {
    padding: 0 10px 0 11rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-section {
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid gray;
}

.detail-description {
    font-size: 0.9rem;
    color: black;
    line-height: 1.5;
    margin-bottom: 0.75rem;
}

.detail-images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.detail-image {
    width: 100%;
    height: 170px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid var(--border-color);
}

/* 반응형 디자인 */
/* 여행지정보 모바일뷰 */
@media (max-width: 768px) {
    .section-title {
        margin: 0 !important;
        padding: 0 !important;
    }

    .meal-keyword {
        padding: 0.25rem 0.5rem;
        font-size: 0.5rem;
    }

    .meal-menu {
        font-size: 0.7rem;
    }

    /* 모바일에서 border 제거하고 구분선으로 변경 */
    .product-summary,
    .schedule-selection,
    .base-price-section,
    .tab-section,
    .content-section,
    .day-section {
        border: none !important;
        /* border-bottom: 1px solid var(--border-color) !important; */
        margin-bottom: 0 !important;
    }

    .day-section:last-child,
    .timeline-event:last-child,
    .detail-section:last-child {
        border-bottom: none !important;
    }

    .product-summary {
        border-bottom: 1px solid var(--border-color) !important;
    }

    .schedule-selection {
        border-bottom: 1px solid var(--border-color) !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .base-price-section {
        border-bottom: 1px solid var(--border-color) !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .tab-section {
        border-bottom: 1px solid var(--border-color) !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .content-section {
        border-bottom: 1px solid var(--border-color) !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .day-section {
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .timeline-event {
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .detail-section {
        box-shadow: none;
        padding: 0.5rem;
    }

    .day-header {
        padding: 0.5rem 0.5rem;
        border-radius: 5px;
    }
    
    .meal-row {
        padding: 0.5rem 0.5rem;
        border-radius: 5px;
    }
    
    .meal-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
    
    .timeline-container {
        padding: 0.5rem 0;
    }
    
    .timeline-line {
        left: 6px;
    }
    
    .area-header,
    .timeline-event {
        padding-left: 20px;
    }
    
    .area-marker,
    .event-marker {
        left: 2px;
        top: 5px;
    }
    
    .area-marker {
        width: 16px;
        height: 16px;
    }
    
    .event-marker {
        width: 10px;
        height: 10px;
    }
    
    .detail-images {
        justify-content: center;
    }
    
    .detail-image {
        width: 100%;
        height: 170px;
    }
    .location-icon-img {
        width: 16px;
        height: 16px;
        object-fit: contain;
    }

    /* PC용 location-info 숨기기 */
    .pc-location-info {
        display: none !important;
    }

    /* 모바일용 location-info 표시 */
    .mobile-location-info {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0 !important;
    }

    .mobile-time-name {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
    }

    .mobile-time-name .event-time {
        order: 1;
        width: 3rem;
    }

    .mobile-time-name .location-name {
        order: 2;
    }

    .mobile-location-info .activity-description {
        width: 100% !important;
        text-align: left !important;
        margin-top: 0.25rem;
    }

    .detail-sections {
        padding: 0 0 0 0;
    }
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
    z-index: 4;
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
    border-top: 1px solid var(--border-color);
    z-index: 2;
}

.booking-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.3rem;
    padding: 0.5rem 0rem;
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
        padding-bottom: 0;
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
        padding: 0 0 1rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .booking-info {
        gap: 0;
        padding: rem 0rem;
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
        padding: 0.7rem;
        scroll-margin-top: 160px;
        /* 헤더(80px) + 탭섹션(약 80px) */
    }

    .schedule-selection {
        padding: 1rem;
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
    .meal-icon, .meal-label {
        display: none;
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

/* 이미지와 요약정보를 감싸는 컨테이너 스타일 */
.product-main-info {
    display: flex;
    flex-direction: column;
    gap: 0rem;
    margin-bottom: 1.5rem;
}

/* 기본적으로 모든 컨테이너 숨기기 */
.pc-only,
.mobile-only {
    display: none;
}

/* 기본적으로 모든 헤더 숨기기 */
.pc-header,
.mobile-header {
    display: none;
}

/* 기본적으로 모든 booking-section 숨기기 */
.pc-booking,
.mobile-booking {
    display: none;
}

/* PC에서만 레이아웃 조정 */
@media (min-width: 1200px) {
    .product-main-info {
        flex-direction: column; /* PC에서는 세로 배치 (사이드바가 별도로 배치되므로) */
    }

    .product-image-section {
        width: 100%; /* 전체 너비 사용 */
        margin: 0;
    }
}

/* 태블릿 레이아웃 (769px ~ 1199px) */
@media (min-width: 769px) and (max-width: 1199px) {
    .product-main-info {
        flex-direction: row;
        align-items: flex-start;
        gap: 0rem;
    }

    .product-image-section {
        
        margin: 0;
    }

    .product-summary {
        /* width: calc(100% * 3/7); */
        flex-shrink: 0;
        margin: 0;
        align-self: stretch;
        display: flex;
        flex-direction: column;
    }
}

/* 모바일 레이아웃 유지 */
@media (max-width: 768px) {
    .product-main-info {
        flex-direction: column;
        margin-bottom: 0rem;
    }

    .product-image-section {
        width: 100%;
    }

    .product-summary {
        border: none;
        width: 100%;
        border-radius: 0 !important;
        box-shadow: none !important;
    }
}
</style>