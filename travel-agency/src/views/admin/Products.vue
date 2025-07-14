<template>
  <div class="products-page">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="search-filters">
        <input 
          type="text" 
          v-model="searchTerm"
          placeholder="상품명 검색..."
          class="search-input"
        >
        <select v-model="selectedCategory" class="filter-select">
          <option value="">전체 카테고리</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        상품 추가
      </button>
    </div>

    <!-- 상품 목록 -->
    <div class="products-grid">
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
        <button class="btn-primary" @click="openCreateModal">첫 번째 상품 만들기</button>
      </div>

      <div v-else class="products-table">
        <table>
          <thead>
            <tr>
              <th>상품 이미지</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>상태</th>
              <th>등록일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-image">
                  <img :src="product.images.length > 0 ? product.images[0].url : '/placeholder.jpg'" :alt="product.title">
                </div>
              </td>
              <td>
                <div class="product-info">
                  <h4>{{ product.title }}</h4>
                  <p>{{ product.productCode }}</p>
                </div>
              </td>
              <td>{{ product.category }}</td>
              <td>{{ formatPrice(product.adultPrice) }}원</td>
              <td>
                <span :class="['status', product.status === 'active' ? 'status-active' : 'status-inactive']">
                  {{ product.status === 'active' ? '활성' : '비활성' }}
                </span>
              </td>
              <td>{{ formatDate(product.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-edit"
                    @click="openEditModal(product)"
                    title="수정"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button 
                    class="btn-delete"
                    @click="deleteProduct(product)"
                    title="삭제"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
                      <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"/>
                      <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 상품 생성/수정 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? '상품 추가' : '상품 수정' }}</h3>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-grid">
            <!-- 기본 정보 -->
            <div class="form-section">
              <h4>기본 정보</h4>
              <div class="form-group">
                <label for="productTitle">상품명 *</label>
                <input 
                  type="text" 
                  id="productTitle"
                  v-model="formData.title"
                  placeholder="상품명을 입력하세요"
                  required
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="productCode">상품코드 *</label>
                <input 
                  type="text" 
                  id="productCode"
                  v-model="formData.productCode"
                  placeholder="상품코드를 입력하세요"
                  required
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="productCategory">카테고리 *</label>
                <select 
                  id="productCategory"
                  v-model="formData.categoryId"
                  required
                  class="form-input"
                >
                  <option value="">카테고리를 선택하세요</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="travelDuration">여행 기간 *</label>
                <input 
                  type="text" 
                  id="travelDuration"
                  v-model="formData.travelDuration"
                  placeholder="예: 2박 3일, 당일"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="productStatus">상품 상태</label>
                <select 
                  id="productStatus"
                  v-model="formData.status"
                  class="form-input"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            </div>
            
            <!-- 가격 정보 -->
            <div class="form-section">
              <h4>가격 정보</h4>
              <div class="form-group">
                <label for="adultPrice">성인 가격 *</label>
                <input 
                  type="number" 
                  id="adultPrice"
                  v-model="formData.adultPrice"
                  placeholder="성인 가격"
                  required
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="childPrice">소인 가격 *</label>
                <input 
                  type="number" 
                  id="childPrice"
                  v-model="formData.childPrice"
                  placeholder="소인 가격"
                  required
                  class="form-input"
                >
              </div>
            </div>
            
            <!-- 상세 정보 -->
            <div class="form-section full-width">
              <h4>상세 정보</h4>
              <div class="form-group">
                <label for="eventContent">행사 내용</label>
                <textarea 
                  id="eventContent"
                  v-model="formData.eventContent"
                  placeholder="행사 내용을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="includedItems">포함 사항</label>
                <textarea 
                  id="includedItems"
                  v-model="formData.includedItems"
                  placeholder="포함 사항을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="excludedItems">불포함 사항</label>
                <textarea 
                  id="excludedItems"
                  v-model="formData.excludedItems"
                  placeholder="불포함 사항을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="meetingPoint">모이는 장소</label>
                <div class="meeting-point-container">
                  <div class="meeting-point-input">
                    <input 
                      type="text"
                      v-model="newMeetingPoint"
                      placeholder="모이는 장소를 입력하세요"
                      class="form-input"
                      @keyup.enter="addMeetingPoint"
                    >
                    <button 
                      type="button"
                      @click="addMeetingPoint"
                      class="btn-add-meeting-point"
                      :disabled="!newMeetingPoint.trim()"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div v-if="formData.meetingPoint.length > 0" class="meeting-point-list">
                    <div 
                      v-for="(point, index) in formData.meetingPoint" 
                      :key="index"
                      class="meeting-point-item"
                    >
                      <span>{{ point }}</span>
                      <button 
                        type="button"
                        @click="removeMeetingPoint(index)"
                        class="btn-remove-meeting-point"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="imageUpload">상품 이미지 (최대 10개)</label>
                <div class="image-upload-container">
                  <div class="image-upload-input">
                    <input 
                      type="file"
                      id="imageUpload"
                      ref="imageFileInput"
                      @change="handleImageUpload"
                      accept=".png,.jpg,.jpeg"
                      multiple
                      class="file-input"
                    >
                    <button 
                      type="button"
                      @click="triggerImageUpload"
                      class="btn-upload-image"
                      :disabled="formData.images.length >= 10"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      이미지 선택 ({{ formData.images.length }}/10)
                    </button>
                  </div>
                  <div v-if="formData.images.length > 0" class="image-preview-list">
                    <div 
                      v-for="(image, index) in formData.images" 
                      :key="index"
                      class="image-preview-item"
                    >
                      <img :src="image.url" :alt="image.name" class="preview-image">
                      <div class="image-info">
                        <span class="image-name">{{ image.name }}</span>
                        <span class="image-size">{{ formatFileSize(image.size) }}</span>
                      </div>
                      <button 
                        type="button"
                        @click="removeImage(index)"
                        class="btn-remove-image"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              취소
            </button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? '처리 중...' : (modalMode === 'create' ? '추가' : '수정') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categoryService } from '@/lib/categories.js'

// 반응형 데이터
const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchTerm = ref('')
const selectedCategory = ref('')
const showModal = ref(false)
const modalMode = ref('create')
const submitting = ref(false)
const selectedProduct = ref(null)
const newMeetingPoint = ref('')
const imageFileInput = ref(null)

// 폼 데이터
const formData = ref({
  title: '',
  productCode: '',
  categoryId: '',
  travelDuration: '',
  adultPrice: '',
  childPrice: '',
  eventContent: '',
  includedItems: '',
  excludedItems: '',
  meetingPoint: [],
  images: [],
  status: 'active'
})

// 계산된 속성
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchTerm.value) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.categoryId === selectedCategory.value)
  }
  
  return filtered
})

// 메서드
const loadProducts = async () => {
  loading.value = true
  try {
    // 더미 데이터 (실제로는 API 호출)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    products.value = [
      {
        id: 1,
        title: '제주도 3일 완전정복',
        productCode: 'JEJU001',
        categoryId: 1,
        category: '국내여행',
        travelDuration: '2박 3일',
        adultPrice: 285000,
        childPrice: 220000,
        eventContent: '제주의 모든 명소를 담은 완벽한 여행',
        includedItems: '숙박, 식사, 교통비',
        excludedItems: '개인경비, 여행자보험',
        meetingPoint: ['김포공항', '인천공항'],
        images: [
          {
            name: 'jeju-main.jpg',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
            size: 250000
          }
        ],
        status: 'active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: '부산 맛집 투어',
        productCode: 'BUSAN001',
        categoryId: 1,
        category: '국내여행',
        travelDuration: '1박 2일',
        adultPrice: 189000,
        childPrice: 145000,
        eventContent: '부산의 대표 맛집들을 순회하는 미식 여행',
        includedItems: '숙박, 식사, 교통비',
        excludedItems: '개인경비, 여행자보험',
        meetingPoint: ['서울역', '부산역'],
        images: [
          {
            name: 'busan-main.jpg',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
            size: 280000
          }
        ],
        status: 'active',
        createdAt: '2024-01-10'
      }
    ]
  } catch (error) {
    console.error('상품 로드 오류:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const result = await categoryService.getAllCategories()
    if (result.success) {
      categories.value = result.categories
    }
  } catch (error) {
    console.error('카테고리 로드 오류:', error)
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  formData.value = {
    title: '',
    productCode: '',
    categoryId: '',
    travelDuration: '',
    adultPrice: '',
    childPrice: '',
    eventContent: '',
    includedItems: '',
    excludedItems: '',
    meetingPoint: [],
    images: [],
    status: 'active'
  }
  newMeetingPoint.value = ''
  showModal.value = true
}

const openEditModal = (product) => {
  modalMode.value = 'edit'
  selectedProduct.value = product
  formData.value = {
    title: product.title,
    productCode: product.productCode,
    categoryId: product.categoryId,
    travelDuration: product.travelDuration,
    adultPrice: product.adultPrice,
    childPrice: product.childPrice,
    eventContent: product.eventContent,
    includedItems: product.includedItems,
    excludedItems: product.excludedItems,
    meetingPoint: [...product.meetingPoint],
    images: [...product.images],
    status: product.status
  }
  newMeetingPoint.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  newMeetingPoint.value = ''
}

const addMeetingPoint = () => {
  if (newMeetingPoint.value.trim()) {
    formData.value.meetingPoint.push(newMeetingPoint.value.trim())
    newMeetingPoint.value = ''
  }
}

const removeMeetingPoint = (index) => {
  formData.value.meetingPoint.splice(index, 1)
}

const triggerImageUpload = () => {
  if (imageFileInput.value) {
    imageFileInput.value.click()
  }
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 10 - formData.value.images.length
  
  if (files.length > remainingSlots) {
    alert(`최대 ${remainingSlots}개의 이미지만 더 추가할 수 있습니다.`)
    return
  }
  
  files.forEach(file => {
    // 파일 타입 검사
    if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
      alert(`${file.name}은 지원되지 않는 파일 형식입니다. PNG, JPG, JPEG 파일만 업로드 가능합니다.`)
      return
    }
    
    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name}은 파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.`)
      return
    }
    
    // 파일을 URL로 변환
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.images.push({
        name: file.name,
        url: e.target.result,
        size: file.size,
        file: file
      })
    }
    reader.readAsDataURL(file)
  })
  
  // 파일 입력 초기화
  if (imageFileInput.value) {
    imageFileInput.value.value = ''
  }
}

const removeImage = (index) => {
  formData.value.images.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (modalMode.value === 'create') {
      alert('상품이 성공적으로 추가되었습니다.')
    } else {
      alert('상품이 성공적으로 수정되었습니다.')
    }
    
    closeModal()
    await loadProducts()
  } catch (error) {
    alert('처리 중 오류가 발생했습니다.')
    console.error('상품 처리 오류:', error)
  } finally {
    submitting.value = false
  }
}

const deleteProduct = async (product) => {
  if (!confirm(`'${product.title}' 상품을 삭제하시겠습니까?`)) {
    return
  }

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('상품이 성공적으로 삭제되었습니다.')
    await loadProducts()
  } catch (error) {
    alert('상품 삭제 중 오류가 발생했습니다.')
    console.error('상품 삭제 오류:', error)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

// 라이프사이클
onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

<style scoped>
.products-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* 액션 바 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
}

.search-input,
.filter-select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-input {
  flex: 1;
}

.filter-select {
  min-width: 150px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 버튼 스타일 */
.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

/* 상품 그리드 */
.products-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 로딩 및 빈 상태 */
.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #d1d5db;
}

/* 테이블 */
.products-table {
  overflow-x: auto;
}

.products-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.products-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.products-table td {
  color: #1f2937;
  font-size: 0.875rem;
}

.product-image {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

/* 상태 표시 */
.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #16a34a;
}

.status-inactive {
  background: #fee2e2;
  color: #dc2626;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
}

.btn-edit:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* 모달 */
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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #374151;
}

.modal-form {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.form-section {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

/* 모이는 장소 스타일 */
.meeting-point-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meeting-point-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.meeting-point-input input {
  flex: 1;
}

.btn-add-meeting-point {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-add-meeting-point:hover:not(:disabled) {
  background: #2563eb;
}

.btn-add-meeting-point:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.meeting-point-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meeting-point-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.meeting-point-item span {
  font-size: 0.875rem;
  color: #374151;
}

.btn-remove-meeting-point {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-remove-meeting-point:hover {
  background: #fecaca;
}

/* 이미지 업로드 스타일 */
.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-upload-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.file-input {
  display: none;
}

.btn-upload-image {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-upload-image:hover:not(:disabled) {
  background: #2563eb;
}

.btn-upload-image:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.image-preview-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
}

.image-preview-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.image-info {
  flex: 1;
  min-width: 0;
}

.image-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.btn-remove-image {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-remove-image:hover {
  background: #fecaca;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filters {
    max-width: none;
    flex-direction: column;
  }
  
  .products-table {
    font-size: 0.8rem;
  }
  
  .products-table th,
  .products-table td {
    padding: 0.5rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 