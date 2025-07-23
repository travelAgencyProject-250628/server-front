<template>
  <div class="datetime-picker">
    <div class="picker-input" @click="togglePicker">
      <div class="input-content">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="calendar-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span v-if="displayValue" class="selected-datetime">{{ displayValue }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron" :class="{ open: showPicker }">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </div>

    <div v-if="showPicker" class="picker-dropdown" ref="dropdown">
      <div class="picker-header">
        <h4>{{ label }}</h4>
        <button type="button" class="close-btn" @click="closePicker">×</button>
      </div>
      
      <div class="picker-content">
        <div class="date-section">
          <label class="section-label">날짜 선택</label>
          <input 
            type="date" 
            v-model="tempDate" 
            class="date-input"
            :min="minDate"
          >
        </div>
        
        <div class="time-section">
          <label class="section-label">시간 선택</label>
          <div class="time-inputs">
            <select v-model="tempHour" class="time-select">
              <option v-for="hour in hours" :key="hour" :value="hour">
                {{ hour.toString().padStart(2, '0') }}
              </option>
            </select>
            <span class="time-separator">:</span>
            <select v-model="tempMinute" class="time-select">
              <option v-for="minute in minutes" :key="minute" :value="minute">
                {{ minute.toString().padStart(2, '0') }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="picker-actions">
        <button type="button" class="cancel-btn" @click="cancelSelection">취소</button>
        <button type="button" class="confirm-btn" @click="confirmSelection">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '날짜와 시간을 선택해주세요'
  },
  label: {
    type: String,
    default: '날짜 및 시간 선택'
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const dropdown = ref(null)
const tempDate = ref('')
const tempHour = ref(9)
const tempMinute = ref(0)

// 최소 날짜 (오늘)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// 시간 옵션
const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 5분 단위

// 표시할 값
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  
  const date = new Date(props.modelValue)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  
  return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`
})

// 초기값 설정
const initializeValues = () => {
  if (props.modelValue) {
    const date = new Date(props.modelValue)
    tempDate.value = date.toISOString().split('T')[0]
    tempHour.value = date.getHours()
    tempMinute.value = date.getMinutes()
  } else {
    tempDate.value = minDate.value
    tempHour.value = 9
    tempMinute.value = 0
  }
}

const togglePicker = () => {
  if (showPicker.value) {
    closePicker()
  } else {
    initializeValues()
    showPicker.value = true
  }
}

const closePicker = () => {
  showPicker.value = false
}

const cancelSelection = () => {
  closePicker()
}

const confirmSelection = () => {
  if (!tempDate.value) return
  
  const selectedDateTime = new Date(tempDate.value)
  selectedDateTime.setHours(tempHour.value, tempMinute.value, 0, 0)
  
  emit('update:modelValue', selectedDateTime.toISOString())
  closePicker()
}

// 외부 클릭 감지
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target) && !event.target.closest('.picker-input')) {
    closePicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.datetime-picker {
  position: relative;
  width: 100%;
}

.picker-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.picker-input:hover {
  border-color: #cbd5e0;
}

.picker-input:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.input-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.calendar-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.selected-datetime {
  font-weight: 500;
  color: #2d3748;
}

.placeholder {
  color: #a0aec0;
}

.chevron {
  color: #718096;
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.picker-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #4a5568;
}

.picker-content {
  padding: 1.5rem;
}

.date-section, .time-section {
  margin-bottom: 1.5rem;
}

.time-section {
  margin-bottom: 0;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.date-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.time-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.time-separator {
  font-weight: bold;
  color: #4a5568;
  font-size: 1.2rem;
}

.picker-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #cbd5e0;
}

.confirm-btn {
  background: var(--primary-color);
  color: white;
}

.confirm-btn:hover {
  background: #2c5aa0;
  transform: translateY(-1px);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .picker-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    border-radius: 16px;
  }
  
  .picker-content {
    padding: 1rem;
  }
  
  .picker-actions {
    padding: 1rem;
  }
}
</style> 