<template>
  <div class="bus-rental-page">
    <div class="container">
      <div class="sections-wrapper" :style="{ transform: `translateY(${getSectionTransform})` }">
        <!-- 첫 번째 섹션: 버스 선택 -->
        <div class="section bus-selection-section">
          <div class="bus-selection-content">
            <!-- 상단 헤더 섹션 -->
            <div class="header-section">
              <div class="header-content">
                <h1 class="header-subtitle">70만 고객 후기 다 모았다.</h1>
                <h2 class="header-title">친절버스 골라주는 더쉼투어</h2>
              </div>
            </div>

            <!-- 버스 타입 카드 섹션 -->
            <div class="bus-cards-section">
              <div class="bus-cards-container">
                <!-- 대형버스 카드 -->
                <div class="bus-card-container">
                  <div class="bus-card">
                    <div class="bus-card-header">
                      <h3 class="bus-type">대형버스</h3>
                      <div class="bus-info">
                        <span class="passenger-count">45인</span>
                        <span class="price">14만원~</span>
                      </div>
                    </div>
                    <div class="bus-image">
                      <img src="/bus-red.png" alt="대형버스" class="bus-img">
                    </div>
                  </div>
                  <button class="compare-btn" @click="comparePrice('large')">
                    가격비교 >
                  </button>
                </div>

                <!-- 우등버스 카드 -->
                <div class="bus-card-container">
                  <div class="bus-card">
                    <div class="bus-card-header">
                      <h3 class="bus-type">우등버스</h3>
                      <div class="bus-info">
                        <span class="passenger-count">28인</span>
                        <span class="price">17만원~</span>
                      </div>
                    </div>
                    <div class="bus-image">
                      <img src="/bus-blue.png" alt="우등버스" class="bus-img">
                    </div>
                  </div>
                  <button class="compare-btn" @click="comparePrice('premium')">
                    가격비교 >
                  </button>
                </div>

                <!-- 미니버스 카드 -->
                <div class="bus-card-container">
                  <div class="bus-card">
                    <div class="bus-card-header">
                      <h3 class="bus-type">미니버스·밴</h3>
                      <div class="bus-info">
                        <span class="passenger-count">18인</span>
                        <span class="price">10만원~</span>
                      </div>
                    </div>
                    <div class="bus-image">
                      <img src="/bus-yellow.png" alt="미니버스" class="bus-img">
                    </div>
                  </div>
                  <button class="compare-btn" @click="comparePrice('minibus')">
                    가격비교 >
                  </button>
                </div>
              </div>
            </div>

            <!-- 하단 정보 섹션 -->
            <div class="info-section">
              <div class="info-container">
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <span class="info-text">70만명이 가격비교를 진행했습니다.</span>
                </div>
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <span class="info-text">예약한 고객님 96%가 만족했습니다.</span>
                </div>
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <span class="info-text">콜버스는 시중가보다 23% 저렴합니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 두 번째 섹션: 옵션 선택 -->
        <div class="section options-section">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button" @click="goBack">
            <span>^</span>
          </div>

          <!-- 옵션 선택 컨텐츠 -->
          <div class="options-content">
            <!-- 고객 유형 선택 -->
            <div class="options-group">
              <div class="section-title section-title-top">고객님은 누구신가요?</div>
              <div class="type-selector">
                <button 
                  class="type-btn" 
                  :class="{ active: selectedCustomerType === 'individual' }"
                  @click="selectedCustomerType = 'individual'"
                >
                  개인
                </button>
                <button 
                  class="type-btn" 
                  :class="{ active: selectedCustomerType === 'corporate' }"
                  @click="selectedCustomerType = 'corporate'"
                >
                  법인
                </button>
                <button 
                  class="type-btn" 
                  :class="{ active: selectedCustomerType === 'travel' }"
                  @click="selectedCustomerType = 'travel'"
                >
                  여행사
                </button>
              </div>
            </div>

            <!-- 이용 목적 선택 -->
            <div class="options-group">
              <div class="section-title">어떤 목적으로 이용하시나요?</div>
              <div class="purpose-grid">
                <button 
                  v-for="purpose in purposes" 
                  :key="purpose.id"
                  class="purpose-btn"
                  :class="{ active: selectedPurpose === purpose.id }"
                  @click="selectedPurpose = purpose.id"
                >
                  {{ purpose.name }}
                </button>
              </div>
            </div>

            <!-- 자동 이동 안내 메시지
            <div v-if="selectedCustomerType && selectedPurpose" class="auto-move-message">
              <div class="loading-spinner"></div>
              <span>다음 단계로 이동 중...</span>
            </div> -->
          </div>
        </div>

        <!-- 세 번째 섹션: 경로 입력 -->
        <div class="section route-section">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button" @click="goBackToOptions">
            <span>^</span>
          </div>

          <!-- 경로 입력 컨텐츠 -->
          <div class="route-content">
            <div class="route-form">
              <!-- 제목 -->
              <div class="route-title">
                <h2>경로를 입력해주세요</h2>
              </div>

              <!-- 왕복/편도 선택 -->
              <div class="trip-type-section">
                <div class="trip-type-selector">
                  <button 
                    class="trip-type-btn" 
                    :class="{ active: tripType === 'round' }"
                    @click="tripType = 'round'"
                  >
                    왕복
                  </button>
                  <button 
                    class="trip-type-btn" 
                    :class="{ active: tripType === 'one-way' }"
                    @click="tripType = 'one-way'"
                  >
                    편도
                  </button>
                </div>
              </div>

              <!-- 출발지 입력 -->
              <div class="form-group">
                <div class="address-search-container">
                  <div class="input-wrapper">
                    <input 
                      type="text" 
                      v-model="routeData.departure" 
                      @input="searchDepartureAddress"
                      @focus="onDepartureInputFocus"
                      @blur="onInputBlur"
                      placeholder="출발지 입력" 
                      class="route-input"
                    >
                    
                    <!-- 출발지 검색 결과 -->
                    <div v-if="showDepartureSuggestions && departureSuggestions.length > 0" class="address-suggestions">
                      <div 
                        v-for="(address, index) in departureSuggestions" 
                        :key="index"
                        class="address-item"
                        @click="selectDepartureAddress(address)"
                      >
                        <div class="address-name">{{ address.place_name }}</div>
                        <div class="address-detail">
                          {{ address.road_address_name || address.address_name }}
                        </div>
                        <div v-if="address.category_name" class="address-category">
                          {{ address.category_name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 도착지 입력 (출발지가 입력되면 표시) -->
              <div v-if="routeData.departure.trim()" class="form-group destination-group">
                <div class="address-search-container">
                  <div class="input-wrapper">
                    <input 
                      type="text" 
                      v-model="routeData.destination" 
                      @input="searchDestinationAddress"
                      @focus="onDestinationInputFocus"
                      @blur="onInputBlur"
                      placeholder="도착지 입력" 
                      class="route-input destination-input"
                    >
                    
                    <!-- 도착지 검색 결과 -->
                    <div v-if="showDestinationSuggestions && destinationSuggestions.length > 0" class="address-suggestions">
                      <div 
                        v-for="(address, index) in destinationSuggestions" 
                        :key="index"
                        class="address-item"
                        @click="selectDestinationAddress(address)"
                      >
                        <div class="address-name">{{ address.place_name }}</div>
                        <div class="address-detail">
                          {{ address.road_address_name || address.address_name }}
                        </div>
                        <div v-if="address.category_name" class="address-category">
                          {{ address.category_name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 다음 버튼 -->
              <div class="next-section">
                <button 
                  class="next-btn" 
                  @click="goToDateStep"
                  :disabled="!routeData.departure.trim() || !routeData.destination.trim()"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 네 번째 섹션: 출발 날짜 입력 -->
        <div class="section date-section">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button" @click="goBackToRoute">
            <span>^</span>
          </div>

          <!-- 날짜 입력 컨텐츠 -->
          <div class="date-content">
            <div class="date-form">
              <!-- 제목 -->
              <div class="date-title">
                <h2>{{ tripType === 'round' ? '출발일과 도착일을 입력해주세요.' : '출발 날짜와 시간을 선택해주세요' }}</h2>
              </div>

              <!-- 출발 날짜 및 시간 입력 -->
              <div class="form-group">
                <div class="date-time-wrapper">
                  <div class="date-input-container">
                    <input 
                      type="date" 
                      v-model="routeData.departureDate" 
                      :min="todayDate"
                      class="date-input"
                    >
                  </div>
                  <div class="time-input-container">
                    <input 
                      type="time"
                      v-model="routeData.departureTime"
                      class="time-input"
                    >
                  </div>
                </div>
              </div>

              <!-- 왕복인 경우 도착 날짜 및 시간 입력 -->
              <div v-if="tripType === 'round' && routeData.departureDate" class="form-group return-date-group">
                <div class="date-time-wrapper">
                  <div class="date-input-container">
                    <input 
                      type="date" 
                      v-model="routeData.returnDate" 
                      :min="routeData.departureDate"
                      placeholder="도착 날짜 선택"
                      class="date-input"
                    >
                  </div>
                  <div class="time-input-container">
                    <input
                      type="time"
                      v-model="routeData.returnTime"
                      class="time-input"
                    >
                  </div>
                </div>
              </div>

              <!-- 다음 버튼 -->
              <div class="next-section">
                <button 
                  class="next-btn" 
                  @click="goToPassengerStep"
                  :disabled="!isDateValid"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 다섯 번째 섹션: 인원수 입력 -->
        <div class="section passenger-section">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button" @click="goBackToDate">
            <span>^</span>
          </div>

          <!-- 인원수 입력 컨텐츠 -->
          <div class="passenger-content">
            <div class="passenger-form">
              <!-- 제목 -->
              <div class="passenger-title">
                <h2>인원은 몇 명인가요?</h2>
              </div>

              <!-- 인원수 입력 -->
              <div class="form-group">
                <div class="passenger-input-container">
                  <input 
                    type="number" 
                    v-model="passengerCount" 
                    placeholder="숫자만 입력"
                    class="passenger-input"
                    min="1"
                    max="100"
                  >
                </div>
              </div>

              <!-- 정확한 인원을 모른다는 체크박스 -->

              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="unknownPassengerCount"
                    class="checkbox-input"
                  >
                  <span class="checkbox-text">정확한 인원을 모릅니다.</span>
                </label>
              </div>


              <!-- 다음 버튼 -->
              <div class="next-section">
                <button 
                  class="next-btn" 
                  @click="goToPhoneStep"
                  :disabled="!isPassengerValid"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 여섯 번째 섹션: 전화번호 입력 -->
        <div class="section phone-section">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button" @click="goBackToPassenger">
            <span>^</span>
          </div>

          <!-- 전화번호 입력 컨텐츠 -->
          <div class="phone-content">
            <!-- 동영상 섹션 -->
            <div class="video-section">
              <video 
                src="https://pub-5d84e73636f44524b9cc63f124cda236.r2.dev/bus_rental_video/video.mp4"
                autoplay
                muted
                loop
                playsinline
                class="intro-video"
                preload="metadata"
              >
                브라우저가 비디오를 지원하지 않습니다.
              </video>
            </div>

            <div class="phone-form">
              <!-- 제목 -->
              <div class="phone-title">
                <h2>내 폰으로 5분만에 견적 확인</h2>
                <p class="phone-subtitle">견적 확인 후 예약 안하셔도 됩니다.</p>
              </div>

              <!-- 전화번호 입력 -->
              <div class="form-group">
                <div class="phone-input-container">
                  <input 
                    type="tel" 
                    v-model="phoneNumber" 
                    @input="handlePhoneInput"
                    placeholder="휴대폰 번호 입력"
                    class="phone-input"
                    maxlength="13"
                  >
                </div>
              </div>

              <!-- 견적 신청 버튼 -->
              <div class="next-section">
                <button 
                  class="next-btn" 
                  @click="submitQuote"
                  :disabled="!isPhoneValid"
                >
                  견적 신청
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive, onMounted } from 'vue'
import { createBusRental } from '../lib/busRentals.js'

// 현재 섹션 상태
const currentSection = ref('bus-selection')
const selectedBusType = ref('')

// 선택된 값들
const selectedCustomerType = ref('')
const selectedPurpose = ref('')

// 여행 타입 (왕복/편도)
const tripType = ref('round')

// 경로 데이터
const routeData = reactive({
  departure: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  returnDate: '',
  returnTime: ''
})

// 인원수 관련 데이터
const passengerCount = ref('')
const unknownPassengerCount = ref(false)

// 전화번호 관련 데이터
const phoneNumber = ref('')

// 오늘 날짜 (최소 선택 가능 날짜)
const todayDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 날짜 유효성 검사
const isDateValid = computed(() => {
  if (tripType.value === 'one-way') {
    return !!routeData.departureDate && !!routeData.departureTime
  } else {
    return !!routeData.departureDate && !!routeData.departureTime && !!routeData.returnDate && !!routeData.returnTime
  }
})

// 인원수 유효성 검사
const isPassengerValid = computed(() => {
  return unknownPassengerCount.value || (passengerCount.value && passengerCount.value > 0)
})

// 전화번호 유효성 검사
const isPhoneValid = computed(() => {
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/
  return phoneRegex.test(phoneNumber.value)
})



// 주소 검색 관련
const departureSuggestions = ref([])
const destinationSuggestions = ref([])
const showDepartureSuggestions = ref(false)
const showDestinationSuggestions = ref(false)
const searchTimeout = ref(null)
const geocoder = ref(null)

// 이용 목적 목록
const purposes = [
  { id: 'wedding_guest', name: '결혼식 하객버스' },
  { id: 'corporate_event', name: '기업행사/워크샵' },
  { id: 'wedding_car', name: '웨딩카' },
  { id: 'commuter', name: '통근버스 정기운행' },
  { id: 'group_travel', name: '단체여행' },
  { id: 'school_event', name: '학교 행사/MT' },
  { id: 'field_trip', name: '현장학습' },
  { id: 'club', name: '동호회' },
  { id: 'concert', name: '콘서트/페스티발' },
  { id: 'golf', name: '골프모임' },
  { id: 'mountain', name: '산악회' },
  { id: 'religious', name: '종교행사' },
  { id: 'airport', name: '공항이용' },
  { id: 'other', name: '기타' }
]

// 카카오 지도 SDK 초기화
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    // 지도 서비스 객체 생성
    geocoder.value = new window.kakao.maps.services.Geocoder()
  }
})

const searchAddress = (query, suggestionsRef, showSuggestionsRef) => {
  if (query.length < 2) {
    suggestionsRef.value = []
    showSuggestionsRef.value = false
    return
  }

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    if (!geocoder.value) return

    const ps = new window.kakao.maps.services.Places()
    ps.keywordSearch(query, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        suggestionsRef.value = data.slice(0, 5).map(item => ({
          place_name: item.place_name,
          address_name: item.address_name,
          road_address_name: item.road_address_name,
          category_name: item.category_name,
          x: item.x,
          y: item.y
        }))
        showSuggestionsRef.value = true
      } else {
        geocoder.value.addressSearch(query, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            suggestionsRef.value = result.slice(0, 5).map(item => ({
              place_name: item.address_name,
              address_name: item.address_name,
              road_address_name: item.road_address && item.road_address.address_name,
              x: item.x,
              y: item.y
            }))
            showSuggestionsRef.value = true
          } else {
            suggestionsRef.value = []
            showSuggestionsRef.value = false
          }
        })
      }
    })
  }, 300)
}

// 출발지 주소 검색
const searchDepartureAddress = () => {
  searchAddress(routeData.departure.trim(), departureSuggestions, showDepartureSuggestions)
}

// 도착지 주소 검색
const searchDestinationAddress = () => {
  searchAddress(routeData.destination.trim(), destinationSuggestions, showDestinationSuggestions)
}

// 출발지 주소 선택
const selectDepartureAddress = (address) => {
  // 장소명이 있으면 장소명 + 상세주소, 없으면 주소명만 사용
  if (address.place_name && address.place_name !== address.address_name) {
    routeData.departure = `${address.place_name} (${address.road_address_name || address.address_name})`
  } else {
    routeData.departure = address.road_address_name || address.address_name
  }
  departureSuggestions.value = []
  showDepartureSuggestions.value = false
}

// 도착지 주소 선택
const selectDestinationAddress = (address) => {
  // 장소명이 있으면 장소명 + 상세주소, 없으면 주소명만 사용
  if (address.place_name && address.place_name !== address.address_name) {
    routeData.destination = `${address.place_name} (${address.road_address_name || address.address_name})`
  } else {
    routeData.destination = address.road_address_name || address.address_name
  }
  destinationSuggestions.value = []
  showDestinationSuggestions.value = false
}

// 입력 필드 포커스 시 검색 결과 표시
const onDepartureInputFocus = () => {
  if (departureSuggestions.value.length > 0) {
    showDepartureSuggestions.value = true
  }
}

const onDestinationInputFocus = () => {
  if (destinationSuggestions.value.length > 0) {
    showDestinationSuggestions.value = true
  }
}

// 입력 필드 블러 시 검색 결과 숨기기 (지연 처리)
const onInputBlur = () => {
  setTimeout(() => {
    showDepartureSuggestions.value = false
    showDestinationSuggestions.value = false
  }, 200)
}

// 섹션 변환 계산
const getSectionTransform = computed(() => {
  if (currentSection.value === 'options') {
    return 'calc(-100vh + 80px)'
  } else if (currentSection.value === 'route') {
    return 'calc(-200vh + 160px)'
  } else if (currentSection.value === 'date') {
    return 'calc(-300vh + 240px)'
  } else if (currentSection.value === 'passenger') {
    return 'calc(-400vh + 320px)'
  } else if (currentSection.value === 'phone') {
    return 'calc(-500vh + 400px)'
  }
  return '0'
})

// 고객 타입과 목적이 모두 선택되면 자동으로 다음 섹션으로 이동
watch([selectedCustomerType, selectedPurpose], ([customerType, purpose]) => {
  if (customerType && purpose && currentSection.value === 'options') {
    setTimeout(() => {
      currentSection.value = 'route'
    }, 1000)
  }
})

// 가격 비교 함수
const comparePrice = (busType) => {
  selectedBusType.value = busType
  currentSection.value = 'options'
}

// 뒤로가기 함수 (첫 번째 페이지로)
const goBack = () => {
  currentSection.value = 'bus-selection'
  selectedCustomerType.value = ''
  selectedPurpose.value = ''
}

// 뒤로가기 함수 (옵션 페이지로)
const goBackToOptions = () => {
  currentSection.value = 'options'
}

// 뒤로가기 함수 (경로 페이지로)
const goBackToRoute = () => {
  currentSection.value = 'route'
}

// 뒤로가기 함수 (날짜 페이지로)
const goBackToDate = () => {
  currentSection.value = 'date'
}

// 뒤로가기 함수 (인원수 페이지로)
const goBackToPassenger = () => {
  currentSection.value = 'passenger'
}

// 날짜 단계로 이동
const goToDateStep = () => {
  currentSection.value = 'date'
}

// 인원수 단계로 이동
const goToPassengerStep = () => {
  currentSection.value = 'passenger'
}

// 전화번호 단계로 이동
const goToPhoneStep = () => {
  currentSection.value = 'phone'
}

// 최종 단계로 이동
const goToContactStep = () => {
  console.log('견적 신청 데이터:', {
    busType: selectedBusType.value,
    customerType: selectedCustomerType.value,
    purpose: selectedPurpose.value,
    tripType: tripType.value,
    departure: routeData.departure,
    destination: routeData.destination,
    departureDate: routeData.departureDate,
    departureTime: routeData.departureTime,
    returnDate: routeData.returnDate,
    returnTime: routeData.returnTime,
    passengerCount: unknownPassengerCount.value ? '정확한 인원 모름' : passengerCount.value
  })
  
  const tripTypeText = tripType.value === 'round' ? '왕복' : '편도'
  const dateText = tripType.value === 'round' 
    ? `출발: ${routeData.departureDate} ${routeData.departureTime}\n도착: ${routeData.returnDate} ${routeData.returnTime}`
    : `출발: ${routeData.departureDate} ${routeData.departureTime}`
  const passengerText = unknownPassengerCount.value ? '정확한 인원 모름' : `${passengerCount.value}명`
  
  alert(`견적 신청이 완료되었습니다!\n버스 타입: ${getBusTypeName(selectedBusType.value)}\n고객 유형: ${getCustomerTypeName(selectedCustomerType.value)}\n이용 목적: ${getPurposeName(selectedPurpose.value)}\n여행 타입: ${tripTypeText}\n출발지: ${routeData.departure}\n도착지: ${routeData.destination}\n${dateText}\n인원수: ${passengerText}\n\n곧 연락드리겠습니다.`)
  
  // 처음으로 돌아가기
  resetForm()
}

// 폼 초기화 함수
const resetForm = () => {
  currentSection.value = 'bus-selection'
  selectedCustomerType.value = ''
  selectedPurpose.value = ''
  selectedBusType.value = ''
  tripType.value = 'round'
  routeData.departure = ''
  routeData.destination = ''
  routeData.departureDate = ''
  routeData.departureTime = ''
  routeData.returnDate = ''
  routeData.returnTime = ''
  passengerCount.value = ''
  unknownPassengerCount.value = false
  phoneNumber.value = ''
  departureSuggestions.value = []
  destinationSuggestions.value = []
}

// 버스 타입 이름 변환
const getBusTypeName = (type) => {
  const types = {
    'large': '대형버스',
    'premium': '우등버스',
    'minibus': '미니버스·밴'
  }
  return types[type] || type
}

// 고객 유형 이름 변환
const getCustomerTypeName = (type) => {
  const types = {
    'individual': '개인',
    'corporate': '법인',
    'travel': '여행사'
  }
  return types[type] || type
}

// 이용 목적 이름 변환
const getPurposeName = (purpose) => {
  const p = purposes.find(item => item.id === purpose)
  return p ? p.name : purpose
}

// 전화번호 포맷팅
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, '')
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}

// 전화번호 입력 처리
const handlePhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  phoneNumber.value = formatted
}

// 견적 신청
const submitQuote = async () => {
  if (!isPhoneValid.value) return
  
  // 견적 신청 데이터 구성
  const quoteData = {
    busType: selectedBusType.value,
    busTypeName: getBusTypeName(selectedBusType.value),
    customerType: selectedCustomerType.value,
    customerTypeName: getCustomerTypeName(selectedCustomerType.value),
    purpose: selectedPurpose.value,
    purposeName: getPurposeName(selectedPurpose.value),
    tripType: tripType.value,
    tripTypeName: tripType.value === 'round' ? '왕복' : '편도',
    departure: routeData.departure,
    destination: routeData.destination,
    departureDate: routeData.departureDate,
    departureTime: routeData.departureTime,
    returnDate: routeData.returnDate,
    returnTime: routeData.returnTime,
    passengerCount: unknownPassengerCount.value ? '정확한 인원 모름' : passengerCount.value,
    unknownPassengerCount: unknownPassengerCount.value,
    phoneNumber: phoneNumber.value,
    submittedAt: new Date().toISOString()
  }
  
  try {
    // BusRentals 테이블에 저장
    const result = await createBusRental(quoteData)
    
    if (result.success) {
      const tripTypeText = tripType.value === 'round' ? '왕복' : '편도'
      const dateText = tripType.value === 'round' 
        ? `출발: ${routeData.departureDate} ${routeData.departureTime}\n도착: ${routeData.returnDate} ${routeData.returnTime}`
        : `출발: ${routeData.departureDate} ${routeData.departureTime}`
      const passengerText = unknownPassengerCount.value ? '정확한 인원 모름' : `${passengerCount.value}명`
      
      alert(`견적 신청이 완료되었습니다!\n버스 타입: ${getBusTypeName(selectedBusType.value)}\n고객 유형: ${getCustomerTypeName(selectedCustomerType.value)}\n이용 목적: ${getPurposeName(selectedPurpose.value)}\n여행 타입: ${tripTypeText}\n출발지: ${routeData.departure}\n도착지: ${routeData.destination}\n${dateText}\n인원수: ${passengerText}\n전화번호: ${phoneNumber.value}\n\n곧 연락드리겠습니다.`)
      
      // 처음으로 돌아가기
      resetForm()
    } else {
      alert('견적 신청 중 오류가 발생했습니다. 다시 시도해주세요.')
      console.error('견적 신청 오류:', result.error)
    }
  } catch (error) {
    alert('견적 신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    console.error('견적 신청 오류:', error)
  }
}
</script>

<style scoped>
.bus-rental-page {
  height: calc(100vh - 80px);
  /* background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); */
  background-color: #60a5fa;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bus-rental-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
  pointer-events: none;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 섹션들을 감싸는 래퍼 - 세로 배치 */
.sections-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(600vh - 480px); /* 6개 섹션 * (100vh - 80px) */
  transition: transform 0.5s ease-in-out;
}

/* 섹션 공통 스타일 */
.section {
  width: 100%;
  height: calc(100vh - 80px);
  /* background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); */
  background-color: #60a5fa;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

/* bus-selection-section만 스크롤 제거 */
.bus-selection-section {
  overflow-y: hidden;
}

/* 다른 섹션들은 스크롤 허용
.options-section,
.route-section,
.date-section,
.passenger-section,
.phone-section {
  overflow-y: auto;
} */

/* 뒤로가기 버튼 */
.back-button {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: black;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 버스 선택 컨텐츠 */
.bus-selection-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;
}

/* 옵션 선택 컨텐츠 */
.options-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-top: 1rem;
  justify-content: center;
}

.options-group {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: black;
  margin: 0.4rem 0;
  text-align: center;
}

.section-title-top {
  margin-top: 3rem;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.3rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.type-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #6b7280;
}

.type-btn.active {
  background: #3b82f6;
  color: white;
}

.type-btn:hover:not(.active) {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.purpose-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.purpose-btn {
  padding: 0.5rem 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  backdrop-filter: blur(10px);
}

.purpose-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.purpose-btn:hover:not(.active) {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* 자동 이동 안내 메시지
.auto-move-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin-top: 2rem;
  color: #3b82f6;
  font-weight: 600;
} */

/* 로딩 스피너 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 헤더 섹션 */
.header-section {
  padding: 3rem 1rem 3rem;
  text-align: center;
  color: black;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.header-content {
  margin: 0 auto;
}

.header-subtitle {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.bus-cards-container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
}

.bus-card-container {
  border-radius: 5px;
  overflow: hidden;
}

.bus-card {
  background: white;
  padding: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
}

.bus-type {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.bus-info {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.passenger-count {
  font-size: 0.7rem;
  color: #374151;
  font-weight: 500;
}

.price {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.7rem;
}

.bus-image {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: 1.2rem;
}

.bus-img {
  width: 80px;
  object-fit: contain;
}

.compare-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 0 5px 5px;
}

.compare-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.info-section {
  padding: 3rem 2rem 3rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.info-container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: black;
}

.info-icon {
  background: white;
  color: black;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.info-text {
  font-size: 1rem;
  font-weight: 500;
}

/* 경로 입력 컨텐츠 */
.route-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.route-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  max-width: 350px;
  justify-content: center;
  margin-top: 6rem;
}

/* 제목 */
.route-title {
  text-align: center;
}

.route-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
}

/* 왕복/편도 선택 */
.trip-type-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.trip-type-selector {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 0.3rem;
  backdrop-filter: blur(10px);
  width: 90%;
}

.trip-type-btn {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #6b7280;
}

.trip-type-btn.active {
  background: #374151;
  color: white;
}

.trip-type-btn:hover:not(.active) {
  background: rgba(55, 65, 81, 0.1);
  color: #374151;
}

/* 경로 입력 필드 */
.form-group {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 주소 검색 컨테이너 */
.address-search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-wrapper {
  position: relative;
  width: 90%;
}

/* 경로 입력 필드 */
.route-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.route-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.route-input::placeholder {
  color: #9ca3af;
}

/* 도착지 입력 그룹 애니메이션 */
.destination-group {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 도착지 입력 필드 스타일 - 출발지와 동일하게 */
.destination-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.destination-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.destination-input::placeholder {
  color: #9ca3af;
}

/* 주소 검색 결과 */
.address-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.5rem;
}

.address-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
}

.address-item:hover {
  background-color: #f8fafc;
}

.address-item:last-child {
  border-bottom: none;
}

.address-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.address-detail {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.address-category {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

/* 날짜 입력 컨텐츠 */
.date-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.date-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  max-width: 350px;
  justify-content: center;
}

/* 날짜 제목 */
.date-title {
  text-align: center;
}

.date-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
}

.date-time-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 90%;
}

/* 데스크톱에서는 가로 배치 */
@media (min-width: 768px) {
  .date-time-wrapper {
    flex-direction: row;
  }
}

.date-input-container,
.time-input-container {
  flex: 1;
}

/* 날짜 및 시간 입력 필드 */
.date-input,
.time-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: #374151;
}

.date-input:focus,
.time-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.date-input::-webkit-calendar-picker-indicator,
.time-input::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* 도착 날짜 입력 그룹 애니메이션 */
.return-date-group {
  animation: slideDown 0.3s ease-out;
}

/* 다음 버튼 */
.next-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.next-btn {
  background: #374151;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.next-btn:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.next-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 인원수 입력 컨텐츠 */
.passenger-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.passenger-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 350px;
  justify-content: center;
}

/* 인원수 제목 */
.passenger-title {
  text-align: center;
  margin-bottom: 1rem;
}

.passenger-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
}

/* 인원수 입력 컨테이너 */
.passenger-input-container {
  width: 90%;
  margin-bottom: 1rem;
}

/* 인원수 입력 필드 */
.passenger-input {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  background: white;
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.passenger-input:focus {
  outline: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.passenger-input::placeholder {
  color: #9ca3af;
}

/* 체크박스 컨테이너 */
.checkbox-container {
  width: 90%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

/* 체크박스 라벨 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding: 0.5rem;
  /* background: white; */
  border-radius: 8px;
  /* transition: all 0.3s ease; */
  /* width: 100%; */
  justify-content: flex-start;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}

/* 체크박스 입력 */
.checkbox-input {
  width: 20px;
  height: 20px;
  accent-color: #374151;
  cursor: pointer;
}

/* 체크박스 텍스트 */
.checkbox-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

/* 전화번호 입력 컨텐츠 */
.phone-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.phone-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  max-width: 350px;
  justify-content: center;
}

/* 전화번호 제목 */
.phone-title {
  text-align: center;
}

.phone-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  margin: 1rem 0 0.5rem 0;
}

.phone-subtitle {
  font-size: 1rem;
  color: #374151;
  margin: 0;
  font-weight: 500;
}

/* 전화번호 입력 컨테이너 */
.phone-input-container {
  width: 90%;
}

/* 전화번호 입력 필드 */
.phone-input {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  background: white;
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phone-input:focus {
  outline: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.phone-input::placeholder {
  color: #9ca3af;
}

/* 동영상 섹션 */
.video-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.intro-video {
  width: 40%;
  max-width: 400px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  background: #000;
  object-fit: cover;
  object-position: center 10%;
  overflow: hidden;
}
</style>