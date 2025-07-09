<template>
  <div class="travel-calendar">
    <div class="calendar-header">
      <h3>출발일 선택</h3>
      <p class="calendar-description">
        오늘부터 3주간 출발 가능한 날짜를 선택하세요
      </p>
    </div>
    
    <!-- 커스텀 월 헤더 -->
    <div class="custom-month-header">
      <div class="month-title">{{ getCurrentMonthTitle }}</div>
      <div class="month-title">{{ getNextMonthTitle }}</div>
    </div>
    
    <div class="calendar-container">
      <VCalendar
        v-model="selectedDate"
        :columns="2"
        :rows="1"
        :min-date="currentMonth"
        :max-date="nextMonthEnd"
        :from-page="fromPage"
        :to-page="toPage"
        :attributes="calendarAttributes"
        :disabled-dates="disabledDates"
        locale="ko"
        @dayclick="handleDateClick"
        class="custom-calendar"
        :is-nav-disabled="true"
      />
    </div>
    
    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-dot available"></div>
        <span>출발가능</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot confirmed"></div>
        <span>출발유력</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot selected"></div>
        <span>선택됨</span>
      </div>
    </div>
    
    <div v-if="selectedDate" class="selected-date-info">
      <div class="selected-date-display">
        <span class="date-label">선택한 출발일:</span>
        <span class="date-value">{{ formatSelectedDate }}</span>
      </div>
      <div class="booking-status">
        <span class="status-badge" :class="getStatusClass(selectedDate)">
          {{ getStatusText(selectedDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import 'v-calendar/style.css'

// Props 정의
const props = defineProps({
  // 예약 인원 데이터 (날짜별)
  bookingData: {
    type: Array,
    default: () => []
    // 예시: [{ date: '2024-03-15', bookingCount: 8, minRequired: 10 }]
  },
  // 출발유력 기준 인원
  minRequiredBooking: {
    type: Number,
    default: 10
  },
  // 선택된 날짜 (v-model)
  modelValue: {
    type: Date,
    default: null
  }
})

// Emits 정의
const emit = defineEmits(['update:modelValue', 'dateSelect'])

// 반응형 데이터
const selectedDate = ref(props.modelValue)
const today = new Date()

// 이번 달과 다음 달 설정
const currentMonth = computed(() => {
  return new Date(today.getFullYear(), today.getMonth(), 1)
})

const nextMonthEnd = computed(() => {
  return new Date(today.getFullYear(), today.getMonth() + 2, 0) // 다음 달 마지막 날
})

// 3주 범위 설정 (실제 선택 가능한 날짜)
const minSelectableDate = computed(() => {
  return new Date(today)
})

const maxSelectableDate = computed(() => {
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 21) // 3주 = 21일
  return maxDate
})

// 달력 페이지 설정 (이번 달과 다음 달 고정)
const fromPage = computed(() => {
  return { month: today.getMonth() + 1, year: today.getFullYear() }
})

const toPage = computed(() => {
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  return { month: nextMonth.getMonth() + 1, year: nextMonth.getFullYear() }
})

// 비활성화할 날짜들 (3주 범위 외)
const disabledDates = computed(() => {
  return [
    // 오늘 이전 날짜들
    { start: null, end: new Date(today.getTime() - 24 * 60 * 60 * 1000) },
    // 3주 이후 날짜들
    { start: new Date(maxSelectableDate.value.getTime() + 24 * 60 * 60 * 1000), end: null }
  ]
})

// 예약 데이터를 날짜별로 매핑
const bookingMap = computed(() => {
  const map = new Map()
  props.bookingData.forEach(item => {
    const dateKey = formatDateKey(new Date(item.date))
    map.set(dateKey, item)
  })
  return map
})

// 달력 속성 설정
const calendarAttributes = computed(() => {
  const attributes = []
  
  // 출발 가능한 날짜들 (3주 범위 내)
  const availableDates = []
  const confirmedDates = []
  
  for (let i = 0; i <= 21; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = formatDateKey(date)
    const bookingInfo = bookingMap.value.get(dateKey)
    
    if (bookingInfo && bookingInfo.bookingCount >= props.minRequiredBooking) {
      // 출발유력 (예약 인원이 기준 이상)
      confirmedDates.push(date)
    } else {
      // 출발가능 (기본)
      availableDates.push(date)
    }
  }
  
  // 출발가능 날짜 속성
  if (availableDates.length > 0) {
    attributes.push({
      key: 'available',
      dates: availableDates,
      dot: {
        color: 'blue',
        class: 'available-dot'
      },
      content: {
        class: 'available-content'
      },
      customData: { type: 'available' }
    })
  }
  
  // 출발유력 날짜 속성
  if (confirmedDates.length > 0) {
    attributes.push({
      key: 'confirmed',
      dates: confirmedDates,
      dot: {
        color: 'orange',
        class: 'confirmed-dot'
      },
      content: {
        class: 'confirmed-content'
      },
      customData: { type: 'confirmed' }
    })
  }
  
  // 선택된 날짜 속성
  if (selectedDate.value) {
    attributes.push({
      key: 'selected',
      dates: [selectedDate.value],
      highlight: {
        color: 'blue',
        fillMode: 'solid'
      },
      content: {
        class: 'selected-content'
      },
      customData: { type: 'selected' }
    })
  }
  
  return attributes
})

// 날짜 키 포맷팅 함수
const formatDateKey = (date) => {
  return date.toISOString().split('T')[0]
}

// 선택된 날짜 포맷팅
const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  
  const year = selectedDate.value.getFullYear()
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
  const day = String(selectedDate.value.getDate()).padStart(2, '0')
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const dayName = dayNames[selectedDate.value.getDay()]
  
  return `${year}.${month}.${day} (${dayName})`
})

// 현재 월 제목
const getCurrentMonthTitle = computed(() => {
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  return `${year}년 ${month}월`
})

// 다음 월 제목
const getNextMonthTitle = computed(() => {
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const year = nextMonth.getFullYear()
  const month = nextMonth.getMonth() + 1
  return `${year}년 ${month}월`
})

// 날짜 클릭 핸들러
const handleDateClick = (day) => {
  if (day.isDisabled) return
  
  // 3주 범위 내 날짜만 선택 가능
  const clickedDate = day.date
  if (clickedDate < minSelectableDate.value || clickedDate > maxSelectableDate.value) {
    return
  }
  
  selectedDate.value = clickedDate
  emit('update:modelValue', clickedDate)
  emit('dateSelect', {
    date: clickedDate,
    bookingInfo: bookingMap.value.get(formatDateKey(clickedDate))
  })
}

// 날짜 상태 클래스 가져오기
const getStatusClass = (date) => {
  if (!date) return ''
  
  const dateKey = formatDateKey(date)
  const bookingInfo = bookingMap.value.get(dateKey)
  
  if (bookingInfo && bookingInfo.bookingCount >= props.minRequiredBooking) {
    return 'confirmed'
  }
  return 'available'
}

// 날짜 상태 텍스트 가져오기
const getStatusText = (date) => {
  if (!date) return ''
  
  const dateKey = formatDateKey(date)
  const bookingInfo = bookingMap.value.get(dateKey)
  
  if (bookingInfo && bookingInfo.bookingCount >= props.minRequiredBooking) {
    return '출발유력'
  }
  return '출발가능'
}

// selectedDate 변경 감지
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue
})

watch(selectedDate, (newValue) => {
  emit('update:modelValue', newValue)
})

onMounted(() => {
  // 컴포넌트 마운트 시 초기화
})
</script>

<style scoped>
/* CSS 변수 사용 (기존 프로젝트와 통일) */
.travel-calendar {
  background: white;
  border-radius: var(--border-radius, 8px);
  border: 1px solid var(--border-color, #e2e8f0);
  padding: 1.5rem;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.calendar-header {
  margin-bottom: 2rem;
  text-align: center;
}

.calendar-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 0.5rem;
}

.calendar-description {
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
  margin: 0;
}

.calendar-container {
  margin-bottom: 1.5rem;
}

/* v-calendar 커스텀 스타일 */
.custom-calendar {
  width: 100%;
}

/* 달력 헤더 스타일 - 네비게이션 숨기기 */
:deep(.vc-header) {
  display: none;
}

/* 월 제목을 별도로 표시하기 위한 커스텀 헤더 추가 */
.custom-month-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-light, #f8fafc);
  border-radius: var(--border-radius, 8px);
  border: 1px solid var(--border-color, #e2e8f0);
}

.month-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  text-align: center;
  flex: 1;
}

/* 달력 그리드 스타일 */
:deep(.vc-weeks) {
  padding: 0;
}

:deep(.vc-weekday) {
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  background: var(--bg-light, #f8fafc);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

:deep(.vc-day) {
  position: relative;
  padding: 0.5rem;
  min-height: 50px;
  border: 1px solid var(--border-color, #e2e8f0);
  background: white;
  transition: all 0.2s ease;
}

:deep(.vc-day:hover) {
  background: var(--bg-light, #f8fafc);
}

:deep(.vc-day.is-disabled) {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

:deep(.vc-day.is-disabled:hover) {
  background: #f5f5f5;
}

/* 날짜 숫자 스타일 */
:deep(.vc-day-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 0.25rem;
  cursor: pointer;
  position: relative;
}

:deep(.vc-day-content .vc-day-number) {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

/* 출발가능 날짜 스타일 */
:deep(.available-content) {
  background: #f0f9ff !important;
  border-color: var(--primary-color, #2563eb) !important;
  position: relative;
}

:deep(.available-content::after) {
  content: '출발가능';
  font-size: 0.7rem;
  color: var(--primary-color, #2563eb);
  font-weight: 500;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 출발유력 날짜 스타일 */
:deep(.confirmed-content) {
  background: #fef3c7 !important;
  border-color: var(--accent-color, #f59e0b) !important;
  position: relative;
}

:deep(.confirmed-content::after) {
  content: '출발유력';
  font-size: 0.7rem;
  color: var(--accent-color, #f59e0b);
  font-weight: 600;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 선택된 날짜 스타일 */
:deep(.selected-content) {
  background: var(--primary-color, #2563eb) !important;
  border-color: var(--primary-color, #2563eb) !important;
  color: white !important;
  position: relative;
}

:deep(.selected-content::after) {
  color: white !important;
}

/* 하이라이트된 날짜 스타일 */
:deep(.vc-highlight) {
  background: var(--primary-color, #2563eb) !important;
  color: white !important;
}

:deep(.vc-highlight .vc-day-content) {
  color: white !important;
}

/* 범례 스타일 */
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-light, #f8fafc);
  border-radius: var(--border-radius, 8px);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid;
}

.legend-dot.available {
  background: #f0f9ff;
  border-color: var(--primary-color, #2563eb);
}

.legend-dot.confirmed {
  background: #fef3c7;
  border-color: var(--accent-color, #f59e0b);
}

.legend-dot.selected {
  background: var(--primary-color, #2563eb);
  border-color: var(--primary-color, #2563eb);
}

/* 선택된 날짜 정보 */
.selected-date-info {
  padding: 1rem;
  background: var(--bg-light, #f8fafc);
  border-radius: var(--border-radius, 8px);
  border: 1px solid var(--border-color, #e2e8f0);
}

.selected-date-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.date-label {
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
}

.date-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
}

.booking-status {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.available {
  background: #dbeafe;
  color: var(--primary-color, #2563eb);
}

.status-badge.confirmed {
  background: #fef3c7;
  color: var(--accent-color, #f59e0b);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .travel-calendar {
    padding: 1rem;
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
  
  .selected-date-display {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  :deep(.vc-day) {
    min-height: 50px;
  }
  
  :deep(.vc-day-content::after) {
    font-size: 0.6rem;
  }
}

/* 달력 컨테이너 그리드 조정 */
:deep(.vc-container) {
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
}

:deep(.vc-pane-container) {
  border: none;
}

:deep(.vc-pane) {
  min-width: 280px;
}

:deep(.vc-pane:not(:last-child)) {
  border-right: 1px solid var(--border-color, #e2e8f0);
}
</style> 