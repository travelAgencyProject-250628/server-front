<template>
  <div class="travel-calendar">
    <div class="calendar-header">
      <h3>출발일 선택</h3>
      <p class="calendar-description">
        내일부터 3주간 출발 가능한 날짜를 선택하세요
      </p>
    </div>
    
    <div class="calendar-container">
      <VCalendar
        v-model="selectedDate"
        :columns="calendarColumns"
        :rows="calendarRows"
        :min-date="currentMonth"
        :max-date="nextMonthEnd"
        :from-page="fromPage"
        :to-page="toPage"
        :attributes="calendarAttributes"
        :disabled-dates="disabledDates"
        locale="ko"
        @dayclick="handleDateClick"
        :nav-visibility="'hidden'"
        class="custom-calendar"
        :style="calendarStyle"
      />
    </div>
    
    <div class="calendar-legend">

      <div class="legend-item">
        <div class="legend-dot confirmed"></div>
        <span>출발유력</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot guaranteed"></div>
        <span>출발확정</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot closed"></div>
        <span>예약마감</span>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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
  // 출발확정 기준 인원
  confirmedThreshold: {
    type: Number,
    default: 20
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
// 시간 부분을 제거한 오늘 날짜 (00:00:00으로 설정)
const today = new Date()
today.setHours(0, 0, 0, 0)
const windowWidth = ref(window.innerWidth)

// 반응형 columns와 rows 계산
const calendarColumns = computed(() => {
  return windowWidth.value > 750 ? 2 : 1  // 큰 화면: 가로 2개, 작은 화면: 가로 1개
})

const calendarRows = computed(() => {
  return windowWidth.value > 750 ? 1 : 2  // 큰 화면: 세로 1개, 작은 화면: 세로 2개
})

// 달력 크기 스타일 계산
const calendarStyle = computed(() => {
  if (windowWidth.value > 750) {
    // 큰 화면: 2개월 가로 배치
    return {
      width: '100%',
      maxWidth: '650px',
      fontSize: '1rem'
    }
  } else {
    // 작은 화면: 2개월 세로 배치, 더 컴팩트
    return {
      width: '100%',
      maxWidth: '340px',
      fontSize: '0.9rem'
    }
  }
})

// 이번 달과 다음 달 설정
const currentMonth = computed(() => {
  return new Date(today.getFullYear(), today.getMonth(), 1)
})

const nextMonthEnd = computed(() => {
  return new Date(today.getFullYear(), today.getMonth() + 2, 0) // 다음 달 마지막 날
})

// 3주 범위 설정 (실제 선택 가능한 날짜)
const minSelectableDate = computed(() => {
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  return tomorrow
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

// 비활성화할 날짜들 (3주 범위 외 + 예약마감 날짜)
const disabledDates = computed(() => {
  const disabled = [
    // 오늘까지 이전 날짜들 (내일부터 선택 가능하도록)
    { start: null, end: today },
    // 3주 이후 날짜들
    { start: new Date(maxSelectableDate.value.getTime() + 24 * 60 * 60 * 1000), end: null }
  ]
  
  // 예약마감 날짜들 추가 (15명 이상)
  for (let i = 1; i <= 21; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = formatDateKey(date)
    const bookingInfo = bookingMap.value.get(dateKey)
    
    // 예약마감 조건: 15명 이상 20명 미만
    if (bookingInfo && bookingInfo.bookingCount >= 15 && bookingInfo.bookingCount < 20) {
      disabled.push(date)
    }
  }
  
  return disabled
})

// 예약 데이터를 날짜별로 매핑
const bookingMap = computed(() => {
  const map = new Map()
  props.bookingData.forEach(item => {
    // 시간대 문제 방지를 위해 로컬 시간대로 날짜 생성
    const dateKey = item.date // 이미 'YYYY-MM-DD' 형식이므로 그대로 사용
    map.set(dateKey, item)
  })
  return map
})

// 달력 속성 설정
const calendarAttributes = computed(() => {
  const attributes = []
  
  // 각 날짜별로 개별 속성 생성
  for (let i = 1; i <= 21; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = formatDateKey(date)
    const bookingInfo = bookingMap.value.get(dateKey)
    
    // 선택 가능한 날짜 범위 내에 있는지 확인
    const isSelectable = date >= minSelectableDate.value && date <= maxSelectableDate.value
    
    // 선택 가능한 날짜만 속성 추가
    if (isSelectable) {
      let dotColor = 'blue' // 기본 파란색 (예약가능)
      let attributeKey = 'available'
      let order = 0
      
      if (bookingInfo) {
        if (bookingInfo.bookingCount >= props.confirmedThreshold) {
          // 출발확정 (confirmedThreshold 이상) - 빨간색
          dotColor = 'red'
          attributeKey = 'guaranteed'
          order = 4
        } else if (bookingInfo.bookingCount >= 15) {
          // 예약마감 (15명 이상) - 청록색
          dotColor = null
          attributeKey = 'closed'
          order = 3
        } else if (bookingInfo.bookingCount >= props.minRequiredBooking) {
          // 출발유력 (minRequiredBooking 이상) - 파란색
          dotColor = 'blue'
          attributeKey = 'confirmed'
          order = 2
        } else {
          // 예약가능 (기본) - 속성 표시 안함
          dotColor = null
          attributeKey = 'available'
          order = 1
        }
      } else {
        // 예약가능 (기본) - 속성 표시 안함
        dotColor = null
        attributeKey = 'available'
        order = 1
      }
      
      // 각 날짜별 속성 추가 (예약가능 제외)
      if (dotColor) {
        attributes.push({
          key: `${attributeKey}-${dateKey}`,
          dates: date,
          dot: {
            color: dotColor,
            class: `${attributeKey}-dot`
          },
          order: order,
          customData: { 
            type: attributeKey,
            bookingInfo: bookingInfo || null
          }
        })
      }
    }
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
      order: 10,
      customData: { type: 'selected' }
    })
  }
  
  return attributes
})

// 날짜 키 포맷팅 함수 (로컬 시간대 유지)
const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 안전한 날짜 생성 함수 (시간대 문제 방지)
const createSafeDate = (dateString) => {
  if (!dateString) return null
  const [year, month, day] = dateString.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
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
  
  if (bookingInfo) {
    if (bookingInfo.bookingCount >= props.confirmedThreshold) {
      return 'guaranteed'
    } else if (bookingInfo.bookingCount >= 15) {
      return 'closed'
    } else if (bookingInfo.bookingCount >= props.minRequiredBooking) {
      return 'confirmed'
    } else {
      return 'available'
    }
  }
  return 'available'
}

// 날짜 상태 텍스트 가져오기
const getStatusText = (date) => {
  if (!date) return ''
  
  const dateKey = formatDateKey(date)
  const bookingInfo = bookingMap.value.get(dateKey)
  
  if (bookingInfo) {
    if (bookingInfo.bookingCount >= 45) {
      return '예약마감'
    } else if (bookingInfo.bookingCount >= props.confirmedThreshold) {
      return '출발확정'
    } else if (bookingInfo.bookingCount >= props.minRequiredBooking) {
      return '출발유력'
    } else {
      return '예약가능'
    }
  }
  return '예약가능'
}

// selectedDate 변경 감지
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue
})

watch(selectedDate, (newValue) => {
  emit('update:modelValue', newValue)
})

onMounted(() => {
  // 윈도우 리사이즈 이벤트 리스너 추가
  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  
  window.addEventListener('resize', handleResize)
  
  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
  --primary-color: #2563eb;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --calendar-title-weight: 700;
}

.travel-calendar {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  max-width: 100%;
  margin: 0 auto;
}

.calendar-header {
  margin-bottom: 1.5rem;
}

.calendar-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.6rem;
}

.calendar-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-weight: 400;
}

.calendar-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

/* v-calendar 기본 스타일 설정 */
.custom-calendar {
  margin: 0 auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* 네비게이션 화살표 제거 */
:deep(.vc-arrow) {
  display: none !important;
}

/* 월 제목 스타일 */
:deep(.vc-title) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none;
  cursor: default;
  padding: 0.75rem !important;
  font-size: 1.0rem !important;
  font-weight: 700 !important;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
}


/* 모든 가능한 월 제목 선택자 */
:deep(.vc-pane .vc-header .vc-title span) {
  font-weight: 700 !important;
}

:deep(.vc-header) {
    margin-bottom: 1rem;
}

/* 범례 스타일 */
.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid;
}

  .legend-text.available {
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .legend-dot.closed {
    background: #0d9488;
    border-color: #0d9488;
  }
  
  .legend-dot.confirmed {
    background: #2563eb;
    border-color: #2563eb;
  }
  
  .legend-dot.guaranteed {
    background: #dc2626;
    border-color: #dc2626;
  }


/* 선택된 날짜 정보 */
.selected-date-info {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.selected-date-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.date-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.date-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
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
  background: #f1f5f9;
  color: var(--text-secondary);
}

.status-badge.closed {
  background: #ccfbf1;
  color: #0d9488;
}

.status-badge.confirmed {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.guaranteed {
  background: #fecaca;
  color: #dc2626;
}

/* 반응형 디자인 */
@media (max-width: 750px) {
  .calendar-container {
    display: flex;
    justify-content: center;
  }
  
  /* 세로 배치일 때 월 간격 조정 */
  .custom-calendar :deep(.vc-pane) {
    margin-bottom: 1.5rem;
  }
  
  .custom-calendar :deep(.vc-pane:last-child) {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
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
}
</style> 
