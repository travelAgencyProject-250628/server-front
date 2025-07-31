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
                        <label>이미지</label>
                        <div class="image-upload-section">
                          <div class="image-upload-area">
                            <input 
                              type="file" 
                              :id="`image-upload-${detail.id}`"
                              @change="handleFileSelect($event, detail.id)"
                              multiple 
                              accept="image/*"
                              style="display: none;"
                            >
                            <label :for="`image-upload-${detail.id}`" class="upload-button">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                              </svg>
                              이미지 추가
                            </label>
                            <div v-if="uploadingImages[detail.id]" class="uploading-indicator">
                              업로드 중...
                            </div>
                          </div>
                          
                          <div v-if="detail.images && detail.images.length > 0" class="image-preview-grid">
                            <div 
                              v-for="(imageUrl, imageIndex) in detail.images" 
                              :key="imageIndex" 
                              class="image-preview-item"
                            >
                              <img :src="imageUrl" :alt="`이미지 ${imageIndex + 1}`" class="preview-image">
                              <button 
                                type="button" 
                                class="delete-image-btn"
                                @click="handleImageDelete(detail.id, imageUrl)"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                            </div>
                
                <!-- 장소 추가 버튼 -->
                <button type="button" class="btn-add-location" @click="addLocation(dayIndex)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  장소 추가
                </button>
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
import { uploadProductImagesToR2, deleteImageFromR2 } from '@/lib/r2-upload.js'

const route = useRoute()
const router = useRouter()

// 상태 변수
const selectedProduct = ref(null)
const saving = ref(false)
const uploadingImages = ref({}) // { detailId: boolean }
const imageFiles = ref({}) // { detailId: File[] }
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
      .select('id, title, subtitle, product_number, itinerary')
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
      
      // detail에 ID 부여 및 이미지 처리
      copiedItinerary.forEach(day => {
        if (day.locations) {
          day.locations.forEach(location => {
            // details 배열이 없으면 초기화
            if (!location.details) {
              location.details = []
            }
            
            location.details.forEach(detail => {
              // ID가 없으면 생성
              if (!detail.id) {
                detail.id = generateDetailId()
              }
              // imagesText 제거 (더 이상 사용하지 않음)
              if (detail.imagesText) {
                delete detail.imagesText
              }
              // images 배열이 없으면 초기화
              if (!detail.images) {
                detail.images = []
              }
            })
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
      
      // 새로운 일정표에도 ID 부여
      itineraryData.value.itinerary.forEach(day => {
        day.locations.forEach(location => {
          location.details.forEach(detail => {
            if (!detail.id) {
              detail.id = generateDetailId()
            }
          })
        })
      })
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

const generateDetailId = () => {
  return `detail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const addDetail = (dayIndex, locationIndex) => {
  console.log('상세 추가 시도:', { dayIndex, locationIndex })
  console.log('현재 location:', itineraryData.value.itinerary[dayIndex].locations[locationIndex])
  
  const newDetail = {
    id: generateDetailId(),
    title: '',
    description: '',
    images: []
  }
  
  // details 배열이 없으면 초기화
  if (!itineraryData.value.itinerary[dayIndex].locations[locationIndex].details) {
    itineraryData.value.itinerary[dayIndex].locations[locationIndex].details = []
  }
  
  itineraryData.value.itinerary[dayIndex].locations[locationIndex].details.push(newDetail)
  console.log('상세 추가 완료:', newDetail)
}

const removeDetail = (dayIndex, locationIndex, detailIndex) => {
  itineraryData.value.itinerary[dayIndex].locations[locationIndex].details.splice(detailIndex, 1)
}

const saveItinerary = async () => {
  saving.value = true
  try {
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

// 이미지 업로드 관련 함수들
const handleImageUpload = async (detailId, files) => {
  if (!selectedProduct.value) return
  
  uploadingImages.value[detailId] = true
  
  try {
    const productNumber = selectedProduct.value.product_number || `product_${selectedProduct.value.id}`
    const result = await uploadProductImagesToR2(files, `${productNumber}/itinerary`)
    
    if (result.success) {
      // 이미지 URL을 detail에 추가
      const detail = findDetailById(detailId)
      if (detail) {
        if (!detail.images) detail.images = []
        detail.images.push(...result.urls)
      }
    } else {
      alert(`이미지 업로드 실패: ${result.error}`)
    }
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
  } finally {
    uploadingImages.value[detailId] = false
  }
}

const handleImageDelete = async (detailId, imageUrl) => {
  if (!selectedProduct.value) return
  
  try {
    // URL에서 키 추출
    const urlParts = imageUrl.split('/')
    const key = urlParts.slice(-2).join('/') // product_number/itinerary/filename
    
    const result = await deleteImageFromR2(key)
    
    if (result.success) {
      // 이미지 URL을 detail에서 제거
      const detail = findDetailById(detailId)
      if (detail && detail.images) {
        detail.images = detail.images.filter(url => url !== imageUrl)
      }
    } else {
      alert(`이미지 삭제 실패: ${result.error}`)
    }
  } catch (error) {
    console.error('이미지 삭제 오류:', error)
    alert('이미지 삭제 중 오류가 발생했습니다.')
  }
}

const findDetailById = (detailId) => {
  for (const day of itineraryData.value.itinerary) {
    for (const location of day.locations) {
      for (const detail of location.details) {
        if (detail.id === detailId) {
          return detail
        }
      }
    }
  }
  return null
}

const handleFileSelect = async (event, detailId) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    await handleImageUpload(detailId, files)
    // 파일 입력 초기화
    event.target.value = ''
  }
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
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #e8f5e8;
  color: #2e7d32;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
}

.btn-add-location:hover {
  background: #c8e6c9;
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

/* 이미지 업로드 스타일 */
.image-upload-section {
  margin-top: 1rem;
}

.image-upload-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #e8f5e8;
  color: #2e7d32;
  border: 2px dashed #2e7d32;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button:hover {
  background: #c8e6c9;
  border-color: #1b5e20;
}

.uploading-indicator {
  color: #1976d2;
  font-size: 0.875rem;
  font-style: italic;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.delete-image-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-image-btn:hover {
  background: rgba(239, 68, 68, 1);
}
</style> 