<template>
  <div class="travel-calendar">
    <div class="calendar-header">
      <h3>출발일 선택</h3>
      <p class="calendar-description">
내일부터 3주간 출발 가능한 날짜를 선택하세요 (화살표로 다른 달도 확인 가능)
      </p>
    </div>

    <div class="calendar-container">
      <VCalendar v-model="selectedDate" 
      :columns="calendarColumns" 
      :rows="calendarRows" 
      :attributes="calendarAttributes"
      :disabled-dates="disabledDates" 
      locale="ko" 
      @dayclick="handleDateClick" 
      :nav-visibility="'focus'"
      :step="1"
      class="custom-calendar" 
      :style="calendarStyle">
        <template #day-content="{ day }">
          <div class="day-content" @click.stop="onDayContentClick(day)">
            <div class="day-number-container">
              <div v-if="getStatusClass(day.date) && isInSelectableRange(day.date)" 
                   :class="['status-circle', getStatusClass(day.date)]"></div>
              <div class="day-number">{{ day.day }}</div>
            </div>
            <div v-if="getDayLabel(day.date)" :class="['day-label', getStatusClass(day.date)]">
              {{ getDayLabel(day.date) }}
            </div>
          </div>
        </template>
      </VCalendar>
    </div>

    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-dot available"></div>
        <span>예약가능</span>
      </div>
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
import { getProductDepartureDatesInRange } from '@/lib/departureDates.js'
import { supabase } from '@/lib/supabase.js'

// Props 정의
const props = defineProps({
  // 상품 ID
  productId: {
    type: Number,
    required: true
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
  // 예약마감 기준 인원
  closingThreshold: {
    type: Number,
    default: 44
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
const availableDepartureDates = ref(new Set()) // 출발 가능한 날짜들
const bookingData = ref([]) // View에서 가져온 예약 데이터

// 반응형 columns와 rows 계산
const calendarColumns = computed(() => {
  return windowWidth.value > 750 ? 2 : 1  // 큰 화면: 가로 2개, 작은 화면: 가로 1개
})

const calendarRows = computed(() => {
  return 1  // 모든 화면에서 세로 1개 (한 달만 표시)
})

// 달력 크기 스타일 계산
const calendarStyle = computed(() => ({
  width: '100%',
}))


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

// 비활성화할 날짜들 (과거 날짜 + 출발 불가능 날짜 + 예약마감 날짜)
const disabledDates = computed(() => {
  const disabled = [
    // 오늘까지 이전 날짜들 (내일부터 선택 가능하도록)
    { start: null, end: today }
  ]
  
  // 3주 범위 내에서 출발 불가능한 날짜들과 예약마감 날짜들 추가
  for (let i = 1; i <= 21; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = formatDateKey(date)
    
    // 출발 불가능한 날짜 (ProductDepartureDates에 없는 날짜)
    if (!availableDepartureDates.value.has(dateKey)) {
      disabled.push(date)
      continue // 이미 비활성화된 날짜는 예약마감 체크 불필요
    }
    
    // 출발 가능하지만 예약마감된 날짜
    const bookingInfo = bookingMap.value.get(dateKey)
    if (bookingInfo && bookingInfo.bookingCount >= props.closingThreshold) {
      disabled.push(date)
    }
  }
  
  // 3주 범위를 넘어서는 모든 날짜들 비활성화 (선택은 불가능하지만 달력은 볼 수 있도록)
  const threeWeeksLater = new Date(today)
  threeWeeksLater.setDate(today.getDate() + 22) // 22일부터
  
  // 6개월 후까지 비활성화
  const sixMonthsLater = new Date(today)
  sixMonthsLater.setMonth(today.getMonth() + 6)
  
  for (let date = new Date(threeWeeksLater); date <= sixMonthsLater; date.setDate(date.getDate() + 1)) {
    disabled.push(new Date(date))
  }

  return disabled
})

// View에서 예약 데이터 가져오기
const loadBookingData = async () => {
  if (!props.productId) return
  
  try {
    console.log('🔍 예약 데이터 로드 시작 - productId:', props.productId)
    
    // 현재 시점으로부터 3주간의 날짜 범위 계산
    const startDate = formatDateKey(minSelectableDate.value) // 내일
    const endDate = formatDateKey(maxSelectableDate.value)   // 3주 후
    
    console.log('🔍 조회 날짜 범위:', { startDate, endDate })
    
    const { data, error } = await supabase
      .from('public_booking_products')
      .select('*')
      .eq('product_id', props.productId)
      .gte('departure_date', startDate)  // 내일부터
      .lte('departure_date', endDate)    // 3주까지
    
    if (error) throw error
    
    console.log('🔍 View에서 가져온 예약 데이터 (3주간):', data)
    
    // 날짜별로 예약 인원 수 계산 (성인 + 아동)
    const bookingCountMap = new Map()
    
    data?.forEach(booking => {
      const dateKey = booking.departure_date
      const adultCount = booking.adult_count || 0
      const childCount = booking.child_count || 0
      const totalCount = adultCount + childCount
      
      const currentCount = bookingCountMap.get(dateKey) || 0
      bookingCountMap.set(dateKey, currentCount + totalCount)
    })
    
    // bookingData 형식으로 변환
    const formattedData = []
    bookingCountMap.forEach((count, date) => {
      formattedData.push({
        date: date,
        bookingCount: count
      })
    })
    
    bookingData.value = formattedData
    console.log('🔍 최종 예약 데이터:', formattedData)
    
  } catch (error) {
    console.error('예약 데이터 로드 오류:', error)
  }
}

// 출발 가능 날짜 로드
const loadAvailableDepartureDates = async () => {
  if (!props.productId) return
  
  try {
    const startDate = formatDateKey(minSelectableDate.value)
    const endDate = formatDateKey(maxSelectableDate.value)
    
    const result = await getProductDepartureDatesInRange(props.productId, startDate, endDate)
    
    if (result.success) {
      const dateSet = new Set()
      result.departureDates.forEach(item => {
        if (item.status) {
          dateSet.add(item.departure_date)
        }
      })
      availableDepartureDates.value = dateSet
    }
  } catch (error) {
    console.error('출발 가능 날짜 로드 오류:', error)
  }
}

// 예약 데이터를 날짜별로 매핑
const bookingMap = computed(() => {
  const map = new Map()
  bookingData.value.forEach(item => {
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

    // 선택 가능하고 출발 가능한 날짜만 속성 추가
    if (isSelectable && availableDepartureDates.value.has(dateKey)) {
      let attributeKey = 'available'
      let order = 0

      if (bookingInfo) {
        
        if (bookingInfo.bookingCount >= props.closingThreshold) {
          // 예약마감 (closingThreshold 이상) - 청록색
          attributeKey = 'closed'
          order = 4
        } else if (bookingInfo.bookingCount >= props.confirmedThreshold) {
          // 출발확정 (confirmedThreshold 이상) - 빨간색
          attributeKey = 'guaranteed'
          order = 3
        } else if (bookingInfo.bookingCount >= props.minRequiredBooking) {
          // 출발유력 (minRequiredBooking 이상)
          attributeKey = 'confirmed'
          order = 2
        } else {
          // 예약가능 (기본)
          attributeKey = 'available'
          order = 1
        }
      } else {
        // 예약가능 (기본)
        attributeKey = 'available'
        order = 1
      }

      // 각 날짜별 속성 추가 (dot 제거)
      attributes.push({
        key: `${attributeKey}-${dateKey}`,
        dates: date,
        customData: {
          type: attributeKey,
          bookingInfo: bookingInfo || null
        },
        order: order
      })
    }
  }

  // 선택된 날짜 속성
  if (selectedDate.value) {
    attributes.push({
      key: 'selected',
      dates: [selectedDate.value],
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
  if (day.isDisabled) {
    alert('선택할 수 없는 날짜입니다.')
    return
  }

  // 3주 범위 내 날짜만 선택 가능
  const clickedDate = day.date
  if (clickedDate < minSelectableDate.value || clickedDate > maxSelectableDate.value) {
    return
  }
  
  // 출발 가능한 날짜만 선택 가능
  const dateKey = formatDateKey(clickedDate)
  if (!availableDepartureDates.value.has(dateKey)) {
    return
  }
  
  selectedDate.value = clickedDate
  emit('update:modelValue', clickedDate)
  emit('dateSelect', {
    date: clickedDate,
    bookingInfo: bookingMap.value.get(dateKey)
  })
}

// 날짜 상태 클래스 가져오기 (day-content 템플릿에서 사용)
const getStatusClass = (date) => {
  if (!date) return ''

  const dateKey = formatDateKey(date)
  
  // 출발 가능한 날짜(status가 true)가 아닌 경우 빈 문자열 반환
  if (!availableDepartureDates.value.has(dateKey)) {
    return ''
  }
  
  const bookingInfo = bookingMap.value.get(dateKey)

  if (bookingInfo) {
    if (bookingInfo.bookingCount >= props.closingThreshold) {
      return 'closed'
    } else if (bookingInfo.bookingCount >= props.confirmedThreshold) {
      return 'guaranteed'
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
  
  // 출발 가능한 날짜(status가 true)가 아닌 경우 빈 문자열 반환
  if (!availableDepartureDates.value.has(dateKey)) {
    return ''
  }
  
  const bookingInfo = bookingMap.value.get(dateKey)

  if (bookingInfo) {
    if (bookingInfo.bookingCount >= props.closingThreshold) {
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

// 날짜가 선택 가능한 범위에 있는지 확인하는 함수
const isInSelectableRange = (date) => {
  if (!date) return false
  return date >= minSelectableDate.value && date <= maxSelectableDate.value
}

// 날짜 레이블 가져오기 (예약 상태에 따라 다르게 표시)
const getDayLabel = (date) => {
  if (!date) return ''

  const dateKey = formatDateKey(date)
  
  // 3주 범위 내의 날짜만 텍스트 표시
  if (date < minSelectableDate.value || date > maxSelectableDate.value) {
    return ''
  }
  
  // 출발 가능한 날짜(status가 true)만 레이블 표시
  if (!availableDepartureDates.value.has(dateKey)) {
    return ''
  }
  
  const bookingInfo = bookingMap.value.get(dateKey)

  if (bookingInfo) {
    if (bookingInfo.bookingCount >= props.closingThreshold) {
      return '예약마감'
    } else if (bookingInfo.bookingCount >= props.confirmedThreshold) {
      return '출발확정'
    } else if (bookingInfo.bookingCount >= props.minRequiredBooking) {
      return '출발유력'
    } else {
      return '예약가능'
    }
  }
  
  // 예약 데이터가 없지만 출발 가능한 날짜는 예약가능으로 표시
  return '예약가능'
}

// 날짜 컨텐츠 클릭 핸들러
const onDayContentClick = (day) => {
  if (day.isDisabled) {
    alert('선택할 수 없는 날짜입니다.')
    return
  }

  // 3주 범위 내 날짜만 선택 가능
  const clickedDate = day.date
  if (clickedDate < minSelectableDate.value || clickedDate > maxSelectableDate.value) {
    return
  }
  
  // 출발 가능한 날짜만 선택 가능
  const dateKey = formatDateKey(clickedDate)
  if (!availableDepartureDates.value.has(dateKey)) {
    return
  }

  selectedDate.value = clickedDate
  emit('update:modelValue', clickedDate)
  emit('dateSelect', {
    date: clickedDate,
    bookingInfo: bookingMap.value.get(dateKey)
  })
}

// selectedDate 변경 감지
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = newValue
})

watch(selectedDate, (newValue) => {
  emit('update:modelValue', newValue)
})

// productId 변경 시 출발 가능 날짜와 예약 데이터 다시 로드
watch(() => props.productId, () => {
  loadAvailableDepartureDates()
  loadBookingData()
}, { immediate: true })

onMounted(() => {
  // 윈도우 리사이즈 이벤트 리스너 추가
  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }

  window.addEventListener('resize', handleResize)
  
  // 출발 가능 날짜 로드
  loadAvailableDepartureDates()
  
  // 예약 데이터 로드
  loadBookingData()

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
  width: 100%;
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
}

/* v-calendar 기본 스타일 설정 */

:deep(.vc-day) {
  aspect-ratio: 1/1;
}

/* 요일 헤더 */
:deep(.vc-weekday) {
  padding: 0.7em 0 !important;
  font-size: 1em !important;
}

/* 네비게이션 화살표 스타일 */
:deep(.vc-arrow) {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.vc-arrow:hover) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

:deep(.vc-arrow:disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}

:deep(.vc-arrow:disabled:hover) {
  background: transparent;
  border-color: #e2e8f0;
  color: #64748b;
}

/* 월 제목 스타일 */
:deep(.vc-title) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  cursor: pointer;
  padding: 0.75rem !important;
}


/* 모든 가능한 월 제목 선택자 */
:deep(.vc-title span) {
  font-weight: 700 !important;
  font-size: 1.2rem !important;
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

.legend-dot.available {
  background: #22c55e;
  border-color: #22c55e;
}

.legend-dot.confirmed {
  background: #2563eb;
  border-color: #2563eb;
}

.legend-dot.guaranteed {
  background: #dc2626;
  border-color: #dc2626;
}

.legend-dot.closed {
  background: #94a3b8;
  border-color: #94a3b8;
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
  background: #dcfce7;
  color: #22c55e;
}

.status-badge.confirmed {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.guaranteed {
  background: #fecaca;
  color: #dc2626;
}

.status-badge.closed {
  background: #f1f5f9;
  color: #94a3b8;
}

/* 반응형 디자인 */

@media (max-width: 768px) {
  /* 모바일에서 화살표 크기 조정 */
  :deep(.vc-arrow) {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
  
  /* 모바일에서 달력 헤더 여백 조정 */
  :deep(.vc-header) {
    margin-bottom: 0.75rem;
  }
  
  /* 모바일에서 월 제목 패딩 조정 */
  :deep(.vc-title) {
    padding: 0.5rem !important;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .calendar-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 1rem;
    justify-items: center;
  }
}

@media (max-width: 480px) {
  .selected-date-display {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

/* 커스텀 day-content 스타일 */
:deep(.day-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
  cursor: pointer;
  gap: 7px;
}

:deep(.day-number-container) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

:deep(.day-number) {
  font-size: 1rem;
  font-weight: 500;
  z-index: 2;
  position: relative;
}

:deep(.status-circle) {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  z-index: 1;
  opacity: 0.3;
}

:deep(.status-circle.available) {
  background-color: #22c55e; /* 초록색 */
}

:deep(.status-circle.confirmed) {
  background-color: #2563eb; /* 파란색 */
}

:deep(.status-circle.guaranteed) {
  background-color: #dc2626; /* 빨간색 */
}

:deep(.status-circle.closed) {
  background-color: #94a3b8; /* 회색 */
}

:deep(.day-label) {
  font-size: 0.6rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

:deep(.day-label.available) {
  color: #22c55e; /* 초록색 */
}

:deep(.day-label.confirmed) {
  color: #2563eb; /* 파란색 */
}

:deep(.day-label.guaranteed) {
  color: #dc2626; /* 빨간색 */
}

:deep(.day-label.closed) {
  color: #94a3b8; /* 회색 */
}
</style>
