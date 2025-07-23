<template>
  <div class="bus-rental-page">
    <!-- 상단 빨간색 헤더 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="main-title">단체 이동, 쉽고 빠르게</h1>
        <p class="subtitle">원하는 일정과 조건만 입력하세요! 직접 연락드립니다.</p>
      </div>
    </div>

    <!-- 하단 흰색 폼 -->
    <div class="form-section">
      <div class="form-container">
        <!-- 탭 -->
        <div class="tabs">
          <button 
            class="tab-button" 
            :class="{ active: tripType === 'round' }"
            @click="tripType = 'round'"
          >
            왕복
          </button>
          <button 
            class="tab-button" 
            :class="{ active: tripType === 'oneway' }"
            @click="tripType = 'oneway'"
          >
            편도
          </button>
        </div>

        <!-- 입력 폼 -->
        <div class="input-fields">
          <div class="field-group">
            <label class="field-label">출발지</label>
            <div class="address-input-group">
              <input 
                type="text" 
                v-model="formData.departure" 
                placeholder="출발지 입력" 
                class="field-input"
                readonly
              >
              <button type="button" class="address-search-btn" @click="searchAddress('departure')">
                주소검색
              </button>
            </div>
          </div>

          <!-- 경유지 추가 버튼 -->
          <div class="stopover-section">
            <button class="stopover-button" @click="addStopover">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              경유지 추가
            </button>
          </div>

          <!-- 경유지 섹션 -->
          <div v-if="formData.stopovers.length > 0" class="stopovers-section">
            <h3 class="stopovers-title">경유지</h3>
            <div v-for="(stopover, index) in formData.stopovers" :key="index" class="stopover-item">
              <div class="field-group">
                <label class="field-label">경유지 {{ index + 1 }}</label>
                <div class="address-input-group">
                  <input 
                    type="text" 
                    v-model="formData.stopovers[index]" 
                    :placeholder="`경유지 ${index + 1} 입력`" 
                    class="field-input"
                    readonly
                  >
                  <button type="button" class="address-search-btn" @click="searchStopoverAddress(index)">
                    주소검색
                  </button>
                  <button type="button" class="remove-stopover-btn" @click="removeStopover(index)">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">도착지</label>
            <div class="address-input-group">
              <input 
                type="text" 
                v-model="formData.arrival" 
                placeholder="도착지 입력" 
                class="field-input"
                readonly
              >
              <button type="button" class="address-search-btn" @click="searchAddress('arrival')">
                주소검색
              </button>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">가는날</label>
            <div class="datetime-group">
              <input 
                type="date" 
                v-model="formData.departureDate" 
                class="field-input"
              >
              <input 
                type="time" 
                v-model="formData.departureTime" 
                class="field-input"
              >
            </div>
          </div>

          <div class="field-group" v-if="tripType === 'round'">
            <label class="field-label">오는날</label>
            <div class="datetime-group">
              <input 
                type="date" 
                v-model="formData.returnDate" 
                class="field-input"
              >
              <input 
                type="time" 
                v-model="formData.returnTime" 
                class="field-input"
              >
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">인원수</label>
            <select v-model="formData.passengers" class="field-input">
              <option value="">인원수 입력 미정</option>
              <option v-for="i in 50" :key="i" :value="i">{{ i }}명</option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">연락처</label>
            <input 
              type="tel" 
              v-model="formData.phone" 
              placeholder="연락처 입력 (예: 010-1234-5678)" 
              class="field-input"
            >
          </div>
        </div>

        <!-- 견적 신청 버튼 -->
        <div class="submit-section">
          <button class="submit-button" @click="requestQuote" :disabled="isSubmitting">
            {{ isSubmitting ? '신청 중...' : '견적 신청' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { createBusRental } from '@/lib/busRentals.js'

// 여행 타입 (왕복/편도)
const tripType = ref('round')

// 제출 상태
const isSubmitting = ref(false)

// 폼 데이터
const formData = reactive({
  departure: '',
  arrival: '',
  departureDate: '',
  departureTime: '',
  returnDate: '',
  returnTime: '',
  passengers: '',
  phone: '',
  stopovers: []
})

// 카카오 주소 API 초기화
onMounted(() => {
  // 카카오 주소 API 스크립트 로드
  if (!window.daum) {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    document.head.appendChild(script)
  }
})

// 주소 검색
const searchAddress = (type) => {
  if (!window.daum) {
    alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  new window.daum.Postcode({
    oncomplete: function(data) {
      // 주소 정보를 해당 필드에 설정
      if (type === 'departure') {
        formData.departure = data.address
      } else if (type === 'arrival') {
        formData.arrival = data.address
      }
    },
    onclose: function(state) {
      // 팝업이 닫힐 때 실행될 코드
      if (state === 'FORCE_CLOSE') {
        // 사용자가 검색결과를 선택하지 않고 팝업을 닫은 경우
      } else if (state === 'COMPLETE_CLOSE') {
        // 검색결과를 선택한 경우
      }
    }
  }).open()
}

// 경유지 주소 검색
const searchStopoverAddress = (index) => {
  if (!window.daum) {
    alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
    return
  }

  new window.daum.Postcode({
    oncomplete: function(data) {
      // 경유지 주소 정보를 해당 인덱스에 설정
      formData.stopovers[index] = data.address
    },
    onclose: function(state) {
      // 팝업이 닫힐 때 실행될 코드
    }
  }).open()
}

// 경유지 추가
const addStopover = () => {
  formData.stopovers.push('')
}

// 경유지 삭제
const removeStopover = (index) => {
  formData.stopovers.splice(index, 1)
}

// 견적 신청
const requestQuote = async () => {
  // 필수 필드 검증
  if (!formData.departure || !formData.arrival || !formData.departureDate) {
    alert('출발지, 도착지, 가는날을 입력해주세요.')
    return
  }

  if (!formData.departureTime) {
    alert('가는 시간을 입력해주세요.')
    return
  }

  if (tripType.value === 'round' && !formData.returnDate) {
    alert('오는날을 입력해주세요.')
    return
  }

  if (tripType.value === 'round' && !formData.returnTime) {
    alert('오는 시간을 입력해주세요.')
    return
  }

  if (!formData.passengers) {
    alert('인원수를 선택해주세요.')
    return
  }

  if (!formData.phone) {
    alert('연락처를 입력해주세요.')
    return
  }

  // 전화번호 형식 검증
  const phoneRegex = /^[0-9-]+$/
  if (!phoneRegex.test(formData.phone)) {
    alert('올바른 전화번호 형식으로 입력해주세요.')
    return
  }

  isSubmitting.value = true

  try {
    // JSON 형태로 데이터 구성
    const rentalData = {
      tripType: tripType.value,
      departure: formData.departure,
      arrival: formData.arrival,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      returnDate: formData.returnDate,
      returnTime: formData.returnTime,
      passengers: formData.passengers,
      phone: formData.phone,
      stopovers: formData.stopovers.filter(stopover => stopover.trim() !== ''),
      submittedAt: new Date().toISOString()
    }

    // 데이터베이스에 저장
    const result = await createBusRental(rentalData)
    
    if (result.success) {
      alert('견적 신청이 완료되었습니다. 곧 연락드리겠습니다.')
      
      // 폼 초기화
      formData.departure = ''
      formData.arrival = ''
      formData.departureDate = ''
      formData.departureTime = ''
      formData.returnDate = ''
      formData.returnTime = ''
      formData.passengers = ''
      formData.phone = ''
      formData.stopovers = []
      
      console.log('버스 대절 신청 저장 완료:', result.data)
    } else {
      alert(`견적 신청 중 오류가 발생했습니다: ${result.error}`)
    }
      } catch (error) {
      console.error('견적 신청 오류:', error)
      alert('견적 신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      isSubmitting.value = false
    }
}
</script>

<style scoped>
.bus-rental-page {
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
}

/* 상단 파란색 헤더 */
.header-section {
  background: var(--primary-color);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  max-width: 800px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

/* 하단 흰색 폼 */
.form-section {
  background: white;
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 탭 */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 2rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
}

.tab-button:not(.active) {
  color: #333;
}

.tab-button:hover:not(.active) {
  background: #f7f7f7;
}

/* 입력 필드 */
.input-fields {
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.9rem;
}

.field-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.field-input:focus {
  outline: none;
  border-color: #3182ce;
}

.field-input::placeholder {
  color: #a0aec0;
}

/* 주소 입력 그룹 */
.address-input-group {
  display: flex;
  gap: 0.5rem;
}

.address-input-group .field-input {
  flex: 1;
}

.address-search-btn {
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.address-search-btn:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
}

/* 날짜/시간 입력 그룹 */
.datetime-group {
  display: flex;
  gap: 0.5rem;
}

.datetime-group .field-input {
  flex: 1;
  width: 100px;
}

/* 경유지 섹션 */
.stopovers-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  max-width: 100%;
}

.stopovers-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stopovers-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: #3182ce;
  border-radius: 2px;
}

.stopover-item {
  margin-bottom: 1rem;
  max-width: 100%;
}

.stopover-item:last-child {
  margin-bottom: 0;
}

.stopover-item .field-group {
  width: 100%;
}

.remove-stopover-btn {
  padding: 0.75rem 1rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.remove-stopover-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* 경유지 추가 버튼 */
.stopover-section {
  margin-bottom: 2rem;
}

.stopover-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.stopover-button:hover {
  background: var(--primary-color);
  color: white;
}

/* 견적 신청 버튼 */
.submit-section {
  text-align: right;
}

.submit-button {
  background: #333;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* PC 뷰 최적화 */
@media (min-width: 769px) {
  .form-container {
    max-width: 1000px;
  }
  
  /* .input-fields {
    grid-template-columns: repeat(2, 1fr);
  } */
  
  .stopovers-section {
    grid-column: 1 / -1;
  }
  
  .submit-section {
    grid-column: 1 / -1;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header-section {
    padding: 2rem 1rem;
  }

  .main-title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .form-section {
    padding: 1.5rem;
    border-radius: 15px 15px 0 0;
  }

  .input-fields {
    /* grid-template-columns: 1fr; */
    gap: 1rem;
  }

  .tabs {
    justify-content: center;
  }

  .submit-section {
    text-align: center;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
  }
}
</style> 