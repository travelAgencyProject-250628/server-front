<template>
  <div class="departure-dates-page">
    <!-- 상단 헤더 -->
    <div class="page-header">
      <h2>출발 날짜 관리</h2>
      <p>상품별로 출발 가능한 날짜를 설정하세요</p>
    </div>

    <!-- 상품 선택 -->
    <div class="product-selector">
      <div class="form-group">
        <label for="productSelect">상품 선택</label>
        <select 
          id="productSelect"
          v-model="selectedProductId"
          @change="loadDepartureDates"
          class="form-select"
        >
          <option value="">상품을 선택하세요</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- 캘린더 섹션 -->
    <div v-if="selectedProductId" class="calendar-section">
      <div class="calendar-header">
        <div class="calendar-navigation">
          <button @click="previousMonth" class="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <h3>{{ formatMonthYear(currentMonth) }}</h3>
          <button @click="nextMonth" class="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="calendar-actions">
          <button @click="selectAllDates" class="btn-secondary">전체 선택</button>
          <button @click="clearAllDates" class="btn-secondary">전체 해제</button>
          <button @click="saveDepartureDates" class="btn-primary" :disabled="saving">
            {{ saving ? '저장 중...' : '변경사항 저장' }}
          </button>
        </div>
      </div>

      <!-- 캘린더 그리드 -->
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div v-for="day in weekdays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>
        
        <div class="calendar-dates">
          <div 
            v-for="date in calendarDates" 
            :key="date.key"
            :class="['calendar-date', {
              'other-month': date.isOtherMonth,
              'today': date.isToday,
              'past': date.isPast
            }]"
          >
            <div class="date-content">
              <span class="date-number">{{ date.day }}</span>
              <div v-if="!date.isOtherMonth && !date.isPast" class="date-toggle">
                <label class="toggle-switch">
                  <input 
                    type="checkbox"
                    :checked="isDepartureEnabled(date.dateString)"
                    @change="toggleDepartureDate(date.dateString, $event.target.checked)"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 범례 -->
      <div class="calendar-legend">
        <div class="legend-item">
          <div class="legend-color enabled"></div>
          <span>출발 가능</span>
        </div>
        <div class="legend-item">
          <div class="legend-color disabled"></div>
          <span>출발 불가</span>
        </div>
        <div class="legend-item">
          <div class="legend-color past"></div>
          <span>지난 날짜</span>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAllProducts } from '@/lib/products.js'
import { getProductDepartureDatesInRange, batchUpdateDepartureDates } from '@/lib/departureDates.js'

// 반응형 데이터
const products = ref([])
const selectedProductId = ref('')
const currentMonth = ref(new Date())
const departureDates = ref(new Map()) // 날짜별 출발 가능 여부
const originalDepartureDates = ref(new Map()) // 원본 데이터 (변경사항 추적용)
const loading = ref(false)
const saving = ref(false)

// 요일 배열
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

// 오늘 날짜
const today = new Date()
today.setHours(0, 0, 0, 0)

// 6달 후까지의 범위
const maxDate = computed(() => {
  const max = new Date(today)
  max.setMonth(max.getMonth() + 6)
  return max
})

// 현재 월의 캘린더 날짜들 생성
const calendarDates = computed(() => {
  const dates = []
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  // 월의 첫 번째 날
  const firstDay = new Date(year, month, 1)
  // 월의 마지막 날
  const lastDay = new Date(year, month + 1, 0)
  // 첫 주의 시작 (일요일)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  // 6주 * 7일 = 42일
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const isOtherMonth = date.getMonth() !== month
    const isToday = date.getTime() === today.getTime()
    const isPast = date < today
    const isInRange = date <= maxDate.value
    const dateString = formatDateString(date)
    
    dates.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      day: date.getDate(),
      dateString,
      isOtherMonth,
      isToday,
      isPast,
      isInRange
    })
  }
  
  return dates
})

// 메서드
const loadProducts = async () => {
  try {
    const result = await getAllProducts()
    if (result.success) {
      products.value = result.products.filter(product => product.status) // 활성 상품만
    }
  } catch (error) {
    console.error('상품 로드 오류:', error)
  }
}

const loadDepartureDates = async () => {
  if (!selectedProductId.value) return
  
  loading.value = true
  try {
    // 현재 월부터 6달 후까지의 날짜 범위
    const startDate = formatDateString(new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1))
    const endDate = formatDateString(maxDate.value)
    
    const result = await getProductDepartureDatesInRange(selectedProductId.value, startDate, endDate)
    
    if (result.success) {
      const dateMap = new Map()
      result.departureDates.forEach(item => {
        dateMap.set(item.departure_date, item.status)
      })
      departureDates.value = dateMap
      originalDepartureDates.value = new Map(dateMap) // 원본 복사
    }
  } catch (error) {
    console.error('출발 날짜 로드 오류:', error)
  } finally {
    loading.value = false
  }
}

const isDepartureEnabled = (dateString) => {
  return departureDates.value.get(dateString) || false
}

const toggleDepartureDate = (dateString, enabled) => {
  departureDates.value.set(dateString, enabled)
}

const selectAllDates = () => {
  calendarDates.value.forEach(date => {
    if (!date.isOtherMonth && !date.isPast && date.isInRange) {
      departureDates.value.set(date.dateString, true)
    }
  })
}

const clearAllDates = () => {
  calendarDates.value.forEach(date => {
    if (!date.isOtherMonth && !date.isPast && date.isInRange) {
      departureDates.value.set(date.dateString, false)
    }
  })
}

const saveDepartureDates = async () => {
  if (!selectedProductId.value) return
  
  saving.value = true
  try {
    // 변경된 날짜들만 찾기
    const updates = []
    
    // 현재 상태와 원본 상태 비교
    for (const [dateString, currentStatus] of departureDates.value) {
      const originalStatus = originalDepartureDates.value.get(dateString) || false
      if (currentStatus !== originalStatus) {
        updates.push({ date: dateString, status: currentStatus })
      }
    }
    
    // 원본에는 있지만 현재에는 없는 날짜들 (삭제된 것들)
    for (const [dateString, originalStatus] of originalDepartureDates.value) {
      if (!departureDates.value.has(dateString) && originalStatus) {
        updates.push({ date: dateString, status: false })
      }
    }
    
    if (updates.length > 0) {
      const result = await batchUpdateDepartureDates(selectedProductId.value, updates)
      
      if (result.success) {
        alert('출발 날짜가 성공적으로 저장되었습니다.')
        // 원본 데이터 업데이트
        originalDepartureDates.value = new Map(departureDates.value)
      } else {
        alert(`저장 실패: ${result.error}`)
      }
    } else {
      alert('변경된 내용이 없습니다.')
    }
  } catch (error) {
    console.error('저장 오류:', error)
    alert('저장 중 오류가 발생했습니다.')
  } finally {
    saving.value = false
  }
}

const previousMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() - 1)
  
  // 오늘 이전 월로는 이동 불가
  if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
    currentMonth.value = newMonth
  }
}

const nextMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + 1)
  
  // 6달 후까지만 이동 가능
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 6, 1)
  if (newMonth <= maxMonth) {
    currentMonth.value = newMonth
  }
}

const formatMonthYear = (date) => {
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long' 
  })
}

const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 월 변경 시 데이터 다시 로드
watch(currentMonth, () => {
  if (selectedProductId.value) {
    loadDepartureDates()
  }
})

// 라이프사이클
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.departure-dates-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* 상품 선택 */
.product-selector {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-select {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 캘린더 섹션 */
.calendar-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: #f3f4f6;
}

.calendar-navigation h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  min-width: 120px;
  text-align: center;
}

.calendar-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 캘린더 그리드 */
.calendar-grid {
  padding: 1.5rem;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 0.5rem;
}

.weekday {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
}

.calendar-dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border: 1px solid #e5e7eb;
}

.calendar-date {
  background: white;
  min-height: 80px;
  position: relative;
}

.calendar-date.other-month {
  background: #f9fafb;
  color: #9ca3af;
}

.calendar-date.today {
  background: #eff6ff;
}

.calendar-date.past {
  background: #f3f4f6;
  color: #9ca3af;
}

.date-content {
  padding: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.date-number {
  font-size: 0.875rem;
  font-weight: 500;
}

.date-toggle {
  display: flex;
  justify-content: center;
  margin-top: 0.25rem;
}

/* 토글 스위치 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* 범례 */
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.enabled {
  background: #3b82f6;
}

.legend-color.disabled {
  background: #e5e7eb;
}

.legend-color.past {
  background: #9ca3af;
}

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .departure-dates-page {
    padding: 1rem;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .calendar-navigation {
    justify-content: center;
  }
  
  .calendar-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .calendar-dates {
    gap: 0;
  }
  
  .calendar-date {
    min-height: 60px;
  }
  
  .date-content {
    padding: 0.25rem;
  }
  
  .date-number {
    font-size: 0.75rem;
  }
  
  .toggle-switch {
    width: 32px;
    height: 16px;
  }
  
  .toggle-slider:before {
    height: 12px;
    width: 12px;
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(16px);
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}
</style> 