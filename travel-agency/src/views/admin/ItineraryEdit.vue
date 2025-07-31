<template>
  <div class="itinerary-edit-page">
    <div class="page-header">
      <div class="header-content">
        <h1>{{ selectedProduct ? `${selectedProduct.title} - 일정표 편집` : '일정표 편집' }}</h1>
        <div class="header-actions">
          <button type="button" class="btn-secondary" @click="goBack">뒤로 가기</button>
          <button type="button" class="btn-primary" @click="saveItinerary" :disabled="saving">
            {{ saving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <div class="edit-container">
      <!-- 일정 정보 -->
      <div class="form-section">
        <h4>일정 정보</h4>
        <div v-for="(day, dayIndex) in itineraryData.itinerary" :key="dayIndex" class="day-section">
          <div class="day-header">
            <h5>{{ dayIndex + 1 }}일차</h5>
            <button type="button" class="btn-remove-day" @click="removeDay(dayIndex)" v-if="itineraryData.itinerary.length > 1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>

          <!-- 식사 정보 -->
          <div class="meal-section">
            <h6>식사 정보</h6>
            <div class="meal-inputs">
              <div class="meal-input">
                <label>조식</label>
                <input v-model="day.meals.breakfast" type="text" placeholder="조식 메뉴">
              </div>
              <div class="meal-input">
                <label>중식</label>
                <input v-model="day.meals.lunch" type="text" placeholder="중식 메뉴">
              </div>
              <div class="meal-input">
                <label>석식</label>
                <input v-model="day.meals.dinner" type="text" placeholder="석식 메뉴">
              </div>
            </div>
          </div>

          <!-- 장소 정보 -->
          <div class="locations-section">
            <div class="locations-header">
              <h6>방문 장소</h6>
              <button type="button" class="btn-add-location" @click="addLocation(dayIndex)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                </svg>
                장소 추가
              </button>
            </div>

            <div v-for="(location, locationIndex) in day.locations" :key="locationIndex" class="location-item">
              <div class="location-header">
                <h6>장소 {{ locationIndex + 1 }}</h6>
                <button type="button" class="btn-remove-location" @click="removeLocation(dayIndex, locationIndex)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>

              <div class="location-inputs">
                <div class="form-row">
                  <div class="form-group">
                    <label>장소명 (장소 이동 시에만 입력)</label>
                    <input v-model="location.name" type="text" placeholder="장소명을 입력하세요">
                  </div>
                  <div class="form-group">
                    <label>시간</label>
                    <input v-model="location.time" type="text" placeholder="예: 10:00">
                  </div>
                </div>
                <div class="form-group">
                  <label>활동</label>
                  <textarea v-model="location.activity" placeholder="해당 장소에서의 활동을 입력하세요"></textarea>
                </div>
                <div class="form-group">
                  <label>주의사항 (빨간색으로 표시됩니다.)</label>
                  <input v-model="location.caution" type="text" placeholder="주의사항을 입력하세요">
                </div>

                <!-- 상세 정보 -->
                <div class="details-section">
                  <div class="details-header">
                    <h6>상세 정보</h6>
                    <button type="button" class="btn-add-detail" @click="addDetail(dayIndex, locationIndex)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      상세 추가
                    </button>
                  </div>

                  <div v-for="(detail, detailIndex) in location.details" :key="detailIndex" class="detail-item">
                    <div class="detail-header">
                      <h6>상세 {{ detailIndex + 1 }}</h6>
                      <button type="button" class="btn-remove-detail" @click="removeDetail(dayIndex, locationIndex, detailIndex)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </button>
                    </div>

                    <div class="detail-inputs">
                      <div class="form-group">
                        <label>제목</label>
                        <input v-model="detail.title" type="text" placeholder="상세 제목을 입력하세요">
                      </div>
                      <div class="form-group">
                        <label>설명</label>
                        <textarea v-model="detail.description" placeholder="상세 설명을 입력하세요"></textarea>
                      </div>
                      <div class="form-group">
                        <label>이미지 URL (한 줄에 하나씩)</label>
                        <textarea v-model="detail.imagesText" placeholder="이미지 URL을 한 줄에 하나씩 입력하세요"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="btn-add-day" @click="addDay">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          일차 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase.js'
import { updateProduct } from '@/lib/products.js'

const route = useRoute()
const router = useRouter()

// 상태 변수
const selectedProduct = ref(null)
const saving = ref(false)
const itineraryData = ref({
  itinerary: [
    {
      day: 1,
      meals: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      locations: [
        {
          name: '',
          time: '',
          activity: '',
          caution: '',
          details: []
        }
      ]
    }
  ]
})

// 라이프사이클
onMounted(async () => {
  const productId = route.params.id
  if (productId) {
    await loadProduct(productId)
  }
})

// 상품 정보 로드
const loadProduct = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select('id, title, subtitle, itinerary')
      .eq('id', productId)
      .single()
    
    if (error) {
      console.error('상품 정보 조회 오류:', error)
      alert('상품 정보를 불러올 수 없습니다.')
      return
    }
    
    selectedProduct.value = data
    console.log('상품 일정표 데이터:', data?.itinerary)
    
    let itinerary = null
    
    // itinerary 데이터 파싱
    if (data?.itinerary) {
      if (typeof data.itinerary === 'string') {
        try {
          itinerary = JSON.parse(data.itinerary)
        } catch (error) {
          console.error('일정표 JSON 파싱 오류:', error)
          itinerary = null
        }
      } else if (Array.isArray(data.itinerary)) {
        itinerary = data.itinerary
      } else if (data.itinerary.itinerary && Array.isArray(data.itinerary.itinerary)) {
        // {days: 3, itinerary: [...]} 형태인 경우
        itinerary = data.itinerary.itinerary
      }
    }
    
    if (itinerary && Array.isArray(itinerary) && itinerary.length > 0) {
      // 기존 일정표 데이터가 있는 경우
      console.log('기존 일정표 데이터 로드:', itinerary)
      
      // 깊은 복사로 itinerary 설정
      const copiedItinerary = JSON.parse(JSON.stringify(itinerary))
      
      // 이미지 URL 배열을 텍스트로 변환 (편집용)
      copiedItinerary.forEach(day => {
        if (day.locations) {
          day.locations.forEach(location => {
            if (location.details) {
              location.details.forEach(detail => {
                if (detail.images && Array.isArray(detail.images)) {
                  detail.imagesText = detail.images.join('\n')
                } else {
                  detail.imagesText = ''
                }
              })
            }
          })
        }
      })
      
      itineraryData.value = {
        itinerary: copiedItinerary
      }
      
      console.log('itineraryData 설정 후:', itineraryData.value)
    } else {
      // 새로운 일정표 생성
      console.log('새로운 일정표 생성')
      itineraryData.value = {
        itinerary: [
          {
            day: 1,
            meals: {
              breakfast: '',
              lunch: '',
              dinner: ''
            },
            locations: [
              {
                name: '',
                time: '',
                activity: '',
                caution: '',
                details: []
              }
            ]
          }
        ]
      }
    }
  } catch (error) {
    console.error('상품 로드 오류:', error)
    alert('상품 정보를 불러올 수 없습니다.')
  }
}

// 일정표 관련 함수들
const addDay = () => {
  const newDay = {
    day: itineraryData.value.itinerary.length + 1,
    meals: {
      breakfast: '',
      lunch: '',
      dinner: ''
    },
    locations: [
      {
        name: '',
        time: '',
        activity: '',
        caution: '',
        details: []
      }
    ]
  }
  itineraryData.value.itinerary.push(newDay)
}

const removeDay = (dayIndex) => {
  itineraryData.value.itinerary.splice(dayIndex, 1)
  
  // day 번호 재정렬
  itineraryData.value.itinerary.forEach((day, index) => {
    day.day = index + 1
  })
}

const addLocation = (dayIndex) => {
  const newLocation = {
    name: '',
    time: '',
    activity: '',
    caution: '',
    details: []
  }
  itineraryData.value.itinerary[dayIndex].locations.push(newLocation)
}

const removeLocation = (dayIndex, locationIndex) => {
  itineraryData.value.itinerary[dayIndex].locations.splice(locationIndex, 1)
}

const addDetail = (dayIndex, locationIndex) => {
  const newDetail = {
    title: '',
    description: '',
    images: []
  }
  itineraryData.value.itinerary[dayIndex].locations[locationIndex].details.push(newDetail)
}

const removeDetail = (dayIndex, locationIndex, detailIndex) => {
  itineraryData.value.itinerary[dayIndex].locations[locationIndex].details.splice(detailIndex, 1)
}

const saveItinerary = async () => {
  saving.value = true
  try {
    // 이미지 URL 텍스트를 배열로 변환
    itineraryData.value.itinerary.forEach(day => {
      day.locations.forEach(location => {
        location.details.forEach(detail => {
          if (detail.imagesText) {
            detail.images = detail.imagesText.split('\n').filter(url => url.trim())
            delete detail.imagesText
          }
        })
      })
    })

    const updateData = {
      itinerary: itineraryData.value.itinerary
    }

    const result = await updateProduct(selectedProduct.value.id, updateData)
    if (result.success) {
      alert('일정표가 성공적으로 저장되었습니다.')
      goBack()
    } else {
      alert(`일정표 저장 실패: ${result.error}`)
    }
  } catch (error) {
    alert('일정표 저장 중 오류가 발생했습니다.')
    console.error('일정표 저장 오류:', error)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/admin/products')
}
</script>

<style scoped>
.itinerary-edit-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.edit-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.day-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.day-header h5 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.btn-remove-day {
  background: #fff3e0;
  color: #f57c00;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
}

.meal-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.meal-section h6 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.meal-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.meal-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meal-input label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.meal-input input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.locations-section {
  margin-top: 1.5rem;
}

.locations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.locations-header h6 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.btn-add-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: #e8f5e8;
  color: #2e7d32;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.location-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.location-header h6 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.btn-remove-location {
  background: #fff3e0;
  color: #f57c00;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
}

.location-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
}

.form-group textarea {
  min-height: 80px;
}

.details-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.details-header h6 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.btn-add-detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #e8f5e8;
  color: #2e7d32;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.detail-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-header h6 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.btn-remove-detail {
  background: #fff3e0;
  color: #f57c00;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
}

.detail-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-add-day {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #4b5563;
}
</style> 