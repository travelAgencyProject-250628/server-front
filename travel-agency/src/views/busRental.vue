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
                      <img src="/bus-red.png" alt="우등버스" class="bus-img">
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
                      <img src="/bus-red.png" alt="미니버스" class="bus-img">
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

            <!-- 자동 이동 안내 메시지 -->
            <div v-if="selectedCustomerType && selectedPurpose" class="auto-move-message">
              <div class="loading-spinner"></div>
              <span>견적 신청 처리 중...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// 현재 섹션 상태
const currentSection = ref('bus-selection')
const selectedBusType = ref('')

// 선택된 값들
const selectedCustomerType = ref('')
const selectedPurpose = ref('')

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

// 섹션 변환 계산
const getSectionTransform = computed(() => {
  if (currentSection.value === 'options') {
    return '-100vh'
  }
  return '0'
})

// 고객 타입과 목적이 모두 선택되면 자동으로 견적 신청 완료
watch([selectedCustomerType, selectedPurpose], ([customerType, purpose]) => {
  if (customerType && purpose && currentSection.value === 'options') {
    setTimeout(() => {
      console.log('견적 신청:', {
        busType: selectedBusType.value,
        customerType: customerType,
        purpose: purpose
      })
      
      alert(`견적 신청이 완료되었습니다!\n버스 타입: ${getBusTypeName(selectedBusType.value)}\n고객 유형: ${getCustomerTypeName(customerType)}\n이용 목적: ${getPurposeName(purpose)}\n\n곧 연락드리겠습니다.`)
      
      // 첫 번째 페이지로 돌아가기
      currentSection.value = 'bus-selection'
      selectedCustomerType.value = ''
      selectedPurpose.value = ''
      selectedBusType.value = ''
    }, 1000)
  }
})

// 가격 비교 함수
const comparePrice = (busType) => {
  selectedBusType.value = busType
  currentSection.value = 'options'
}

// 뒤로가기 함수
const goBack = () => {
  currentSection.value = 'bus-selection'
  selectedCustomerType.value = ''
  selectedPurpose.value = ''
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
  const purposes = {
    'wedding_guest': '결혼식 하객버스',
    'corporate_event': '기업행사/워크샵',
    'wedding_car': '웨딩카',
    'commuter': '통근버스 정기운행',
    'group_travel': '단체여행',
    'school_event': '학교 행사/MT',
    'field_trip': '현장학습',
    'club': '동호회',
    'concert': '콘서트/페스티발',
    'golf': '골프모임',
    'mountain': '산악회',
    'religious': '종교행사',
    'airport': '공항이용',
    'other': '기타'
  }
  return purposes[purpose] || purpose
}
</script>

<style scoped>
.bus-rental-page {
  height: calc(100vh - 80px);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
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
  height: 200vh;
  transition: transform 0.5s ease-in-out;
}

/* 섹션 공통 스타일 */
.section {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

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
}

/* 옵션 선택 컨텐츠 */
.options-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-top: 1rem;
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
  margin: 1rem 0;
  text-align: center;
}

.section-title-top {
  margin-top: 3rem;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.type-btn {
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
  padding: 1rem 0.8rem;
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

/* 자동 이동 안내 메시지 */
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
}

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
  padding: 6rem 1rem 3rem;
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
  font-size: 1.8rem;
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
  padding: 5rem 2rem 3rem;
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
</style> 