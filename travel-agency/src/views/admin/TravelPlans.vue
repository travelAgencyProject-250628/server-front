<template>
  <div class="travel-plans-page">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="search-filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="상품명으로 검색..." 
          class="search-input"
        >
      </div>
    </div>

    <!-- 상품 목록 -->
    <div class="travel-plans-grid">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>상품을 불러오는 중...</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="2"/>
          <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>상품이 없습니다.</p>
      </div>

      <div v-else class="travel-plans-table">
        <table>
          <thead>
            <tr>
              <th>상품 이미지</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>일정표 상태</th>
              <th>등록일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-image">
                  <img :src="product.main_image_url || '/placeholder.jpg'" :alt="product.title">
                </div>
              </td>
              <td>
                <div class="product-info">
                  <h4>{{ product.title }}</h4>
                  <p v-if="product.subtitle" class="product-subtitle">{{ product.subtitle }}</p>
                  <p>{{ product.product_code }}</p>
                </div>
              </td>
              <td>{{ product.category?.name || '기타' }}</td>
              <td>
                <span :class="['itinerary-status', product.itinerary ? 'has-itinerary' : 'no-itinerary']">
                  {{ product.itinerary ? '일정표 있음' : '일정표 없음' }}
                </span>
              </td>
              <td>{{ formatDate(product.created_at) }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-edit" @click="editItinerary(product)" title="일정표 편집">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? `${editingProduct.title} - 일정표 편집` : '일정표 편집' }}</h3>
          <button class="btn-close" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveItinerary" class="plan-form">
          <!-- 일정 정보 -->
          <div class="form-section">
            <h4>일정 정보</h4>
            <div v-for="(day, dayIndex) in formData.itinerary" :key="dayIndex" class="day-section">
              <div class="day-header">
                <h5>{{ dayIndex + 1 }}일차</h5>
                <button type="button" class="btn-remove-day" @click="removeDay(dayIndex)" v-if="formData.itinerary.length > 1">
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
                        <label>장소명</label>
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
                      <label>주의사항</label>
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

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">취소</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProducts, updateProduct } from '@/lib/products.js'

const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingProduct = ref(null)
const searchQuery = ref('')
const products = ref([])

const formData = ref({
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

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(product => 
    product.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.subtitle?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadProducts = async () => {
  loading.value = true
  try {
    const result = await getAllProducts()
    if (result.success) {
      products.value = result.products || []
    }
  } catch (error) {
    console.error('상품 로딩 실패:', error)
  } finally {
    loading.value = false
  }
}

const editItinerary = (product) => {
  editingProduct.value = product
  formData.value = {
    itinerary: product.itinerary ? JSON.parse(JSON.stringify(product.itinerary)) : [
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
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  formData.value = {
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

const addDay = () => {
  const newDay = {
    day: formData.value.itinerary.length + 1,
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
  formData.value.itinerary.push(newDay)
}

const removeDay = (dayIndex) => {
  formData.value.itinerary.splice(dayIndex, 1)
  
  // day 번호 재정렬
  formData.value.itinerary.forEach((day, index) => {
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
  formData.value.itinerary[dayIndex].locations.push(newLocation)
}

const removeLocation = (dayIndex, locationIndex) => {
  formData.value.itinerary[dayIndex].locations.splice(locationIndex, 1)
}

const addDetail = (dayIndex, locationIndex) => {
  const newDetail = {
    title: '',
    description: '',
    images: []
  }
  formData.value.itinerary[dayIndex].locations[locationIndex].details.push(newDetail)
}

const removeDetail = (dayIndex, locationIndex, detailIndex) => {
  formData.value.itinerary[dayIndex].locations[locationIndex].details.splice(detailIndex, 1)
}

const saveItinerary = async () => {
  saving.value = true
  try {
    // 이미지 URL 텍스트를 배열로 변환
    formData.value.itinerary.forEach(day => {
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
      itinerary: formData.value.itinerary
    }

    await updateProduct(editingProduct.value.id, updateData)
    await loadProducts()
    closeModal()
  } catch (error) {
    console.error('일정표 저장 실패:', error)
  } finally {
    saving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.travel-plans-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 300px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.travel-plans-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: var(--text-primary);
}

.product-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.product-subtitle {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.itinerary-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.itinerary-status.has-itinerary {
  background: #e8f5e8;
  color: #2e7d32;
}

.itinerary-status.no-itinerary {
  background: #ffebee;
  color: #d32f2f;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--text-secondary);
}

.btn-close:hover {
  background: #f5f5f5;
}

.plan-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.day-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.day-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.btn-remove-day {
  background: #ffebee;
  color: #d32f2f;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.meal-section {
  margin-bottom: 1.5rem;
}

.meal-section h6 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.meal-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.meal-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.meal-input input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
}

.locations-section {
  margin-bottom: 1rem;
}

.locations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.locations-header h6 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-add-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.location-item {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
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
}

.btn-remove-location {
  background: #ffebee;
  color: #d32f2f;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
}

.details-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
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
  border: 1px solid var(--border-color);
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
}

.btn-remove-detail {
  background: #fff3e0;
  color: #f57c00;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .travel-plans-page {
    padding: 1rem;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .meal-inputs {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style> 