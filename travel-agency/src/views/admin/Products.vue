<template>
  <div class="products-page">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="search-filters">
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
              <th>태그</th>
              <th>배지</th>
              <th>지역</th>
              <th>가격</th>
              <th>출발장소</th>
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
                  <p v-if="product.subtitle" class="product-subtitle">{{ product.subtitle }}</p>
                  <p>{{ product.product_code }}</p>
                </div>
              </td>
              <td>{{ product.category?.name || '기타' }}</td>
              <td>{{ product.tag?.name || '-' }}</td>
              <td>{{ product.badge?.name || '-' }}</td>
              <td>{{ product.location?.name || '-' }}</td>
              <td>{{ formatPrice(product.adult_price) }}원</td>
              <td>
                <div class="starting-points-display">
                  <div v-if="product.startingPoints && product.startingPoints.length > 0">
                    <div 
                      v-for="(point, index) in product.startingPoints.slice(0, 2)" 
                      :key="index"
                      class="starting-point-display-item"
                    >
                      <span class="point-name">{{ point.name }}</span>
                      <span class="point-time">{{ formatDateTime(point.time) }}</span>
                    </div>
                    <div v-if="product.startingPoints.length > 2" class="more-points">
                      +{{ product.startingPoints.length - 2 }}개 더
                    </div>
                  </div>
                  <div v-else class="no-starting-points">
                    출발장소 없음
                  </div>
                </div>
              </td>
              <td>
                <span :class="['status', product.status ? 'status-active' : 'status-inactive']">
                  {{ product.status ? '활성' : '비활성' }}
                </span>
              </td>
              <td>{{ formatDate(product.created_at) }}</td>
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
                    @click="handleDeleteProduct(product)"
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
                <label for="productSubtitle">상품 부제목</label>
                <input 
                  type="text" 
                  id="productSubtitle"
                  v-model="formData.subtitle"
                  placeholder="상품 부제목을 입력하세요"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="productCode">상품코드 *</label>
                <input 
                  type="text" 
                  id="productCode"
                  v-model="formData.product_code"
                  placeholder="상품코드를 입력하세요"
                  required
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="productCategory">카테고리 * ({{ categories.length }}개)</label>
                <select 
                  id="productCategory"
                  v-model="formData.category_id"
                  required
                  class="form-input"
                >
                  <option value="">카테고리를 선택하세요</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <div v-if="categories.length === 0" class="error-message">
                  카테고리를 불러오는 중입니다...
                </div>
              </div>
              
              <div class="form-group">
                <label for="productTag">태그 ({{ tags.length }}개)</label>
                <select 
                  id="productTag"
                  v-model="formData.tag_id"
                  class="form-input"
                >
                  <option value="">태그를 선택하세요</option>
                  <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                    {{ tag.name }}
                  </option>
                </select>
                <div v-if="tags.length === 0" class="error-message">
                  태그를 불러오는 중입니다...
                </div>
              </div>
              
              <div class="form-group">
                <label for="productBadge">배지 ({{ badges.length }}개)</label>
                <select 
                  id="productBadge"
                  v-model="formData.badge_id"
                  class="form-input"
                >
                  <option value="">배지를 선택하세요</option>
                  <option v-for="badge in badges" :key="badge.id" :value="badge.id">
                    {{ badge.name }}
                  </option>
                </select>
                <div v-if="badges.length === 0" class="error-message">
                  배지를 불러오는 중입니다...
                </div>
              </div>
              
              <div class="form-group">
                <label for="productLocation">지역 ({{ locations.length }}개)</label>
                <select 
                  id="productLocation"
                  v-model="formData.location_id"
                  class="form-input"
                >
                  <option value="">지역을 선택하세요</option>
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <div v-if="locations.length === 0" class="error-message">
                  지역을 불러오는 중입니다...
                </div>
              </div>
              
              <div class="form-group">
                <label for="travelDuration">여행 기간 *</label>
                <input 
                  type="text" 
                  id="travelDuration"
                  v-model="formData.duration"
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
                  <option :value="true">활성</option>
                  <option :value="false">비활성</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="likelyDepartureThreshold">출발 유력 인원수</label>
                <input 
                  type="number" 
                  id="likelyDepartureThreshold"
                  v-model="formData.likely_departure_threshold"
                  placeholder="30"
                  min="1"
                  max="100"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="confirmedDepartureThreshold">확정 출발 인원수</label>
                <input 
                  type="number" 
                  id="confirmedDepartureThreshold"
                  v-model="formData.confirmed_departure_threshold"
                  placeholder="50"
                  min="1"
                  max="100"
                  class="form-input"
                >
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
                  v-model="formData.adult_price"
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
                  v-model="formData.child_price"
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
                  v-model="formData.event_content"
                  placeholder="행사 내용을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="includedItems">포함 사항</label>
                <textarea 
                  id="includedItems"
                  v-model="formData.included_items"
                  placeholder="포함 사항을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="excludedItems">불포함 사항</label>
                <textarea 
                  id="excludedItems"
                  v-model="formData.excluded_items"
                  placeholder="불포함 사항을 입력하세요"
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="startingPoints">출발장소 및 시간</label>
                <div class="starting-points-container">
                  <div class="starting-points-header">
                    <button 
                      type="button"
                      @click="addStartingPoint"
                      class="btn-add-starting-point"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      출발장소 추가
                    </button>
                  </div>
                  <div v-if="formData.startingPoints.length > 0" class="starting-points-list">
                    <div 
                      v-for="(point, index) in formData.startingPoints" 
                      :key="index"
                      class="starting-point-item"
                    >
                      <div class="starting-point-inputs">
                        <select 
                          :value="point.starting_point_id"
                          @change="updateStartingPoint(index, 'starting_point_id', $event.target.value)"
                          class="form-input starting-point-select"
                          required
                        >
                          <option value="">출발장소 선택</option>
                          <option 
                            v-for="sp in startingPoints" 
                            :key="sp.id" 
                            :value="sp.id"
                          >
                            {{ sp.name }}
                          </option>
                        </select>
                        <input 
                          type="datetime-local"
                          :value="point.time"
                          @change="updateStartingPoint(index, 'time', $event.target.value)"
                          class="form-input starting-point-time"
                          required
                        >
                      <button 
                        type="button"
                          @click="removeStartingPoint(index)"
                          class="btn-remove-starting-point"
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
import { tagService } from '@/lib/tags.js'
import { badgeService } from '@/lib/badges.js'
import { locationService } from '@/lib/locations.js'
import { createProduct, updateProduct, deleteProduct, getAllProducts, getAllStartingPoints } from '@/lib/products.js'

// 반응형 데이터
const products = ref([])
const categories = ref([])
const tags = ref([])
const badges = ref([])
const locations = ref([])
const startingPoints = ref([])
const loading = ref(false)
const selectedCategory = ref('')
const showModal = ref(false)
const modalMode = ref('create')
const submitting = ref(false)
const selectedProduct = ref(null)
const imageFileInput = ref(null)

// 폼 데이터 - Supabase 컬럼명에 맞게 수정
const formData = ref({
  title: '',
  subtitle: '',
  product_code: '',
  category_id: '',
  tag_id: '',
  badge_id: '',
  location_id: '',
  duration: '',
  adult_price: '',
  child_price: '',
  event_content: '',
  included_items: '',
  excluded_items: '',
  likely_departure_threshold: 30,
  confirmed_departure_threshold: 50,
  status: true,
  images: [],
  startingPoints: []
})

// 계산된 속성
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category_id === selectedCategory.value)
  }
  
  return filtered
})

// 메서드
const loadProducts = async () => {
  loading.value = true
  try {
    const result = await getAllProducts()
    if (result.success) {
      products.value = result.products
    } else {
      console.error('상품 로드 실패:', result.error)
      products.value = []
    }
  } catch (error) {
    console.error('상품 로드 오류:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    console.log('카테고리 로드 시작...')
    const result = await categoryService.getAllCategories()
    console.log('카테고리 로드 결과:', result)
    if (result.success) {
      categories.value = result.categories
      console.log('카테고리 설정 완료:', categories.value)
    } else {
      console.error('카테고리 로드 실패:', result.error)
    }
  } catch (error) {
    console.error('카테고리 로드 오류:', error)
  }
}

const loadStartingPoints = async () => {
  try {
    const result = await getAllStartingPoints()
    if (result.success) {
      startingPoints.value = result.startingPoints
    }
  } catch (error) {
    console.error('출발장소 로드 오류:', error)
  }
}

const loadTags = async () => {
  try {
    const result = await tagService.getAllTags()
    if (result.success) {
      tags.value = result.tags
    }
  } catch (error) {
    console.error('태그 로드 오류:', error)
  }
}

const loadBadges = async () => {
  try {
    const result = await badgeService.getAllBadges()
    if (result.success) {
      badges.value = result.badges
    }
  } catch (error) {
    console.error('배지 로드 오류:', error)
  }
}

const loadLocations = async () => {
  try {
    const result = await locationService.getAllLocations()
    if (result.success) {
      locations.value = result.locations
    }
  } catch (error) {
    console.error('지역 로드 오류:', error)
  }
}

const openCreateModal = () => {
  modalMode.value = 'create'
  formData.value = {
    title: '',
    subtitle: '',
    product_code: '',
    category_id: '',
    tag_id: '',
    badge_id: '',
    location_id: '',
    duration: '',
    adult_price: '',
    child_price: '',
    event_content: '',
    included_items: '',
    excluded_items: '',
    likely_departure_threshold: 30,
    confirmed_departure_threshold: 50,
    status: true,
    images: [],
    startingPoints: []
  }
  showModal.value = true
}

const openEditModal = (product) => {
  modalMode.value = 'edit'
  selectedProduct.value = product
  formData.value = {
    title: product.title,
    subtitle: product.subtitle || '',
    product_code: product.product_code,
    category_id: product.category_id,
    tag_id: product.tag_id || '',
    badge_id: product.badge_id || '',
    location_id: product.location_id || '',
    duration: product.duration,
    adult_price: product.adult_price,
    child_price: product.child_price,
    event_content: product.event_content,
    included_items: product.included_items,
    excluded_items: product.excluded_items,
    likely_departure_threshold: product.likely_departure_threshold || 30,
    confirmed_departure_threshold: product.confirmed_departure_threshold || 50,
    status: product.status,
    images: [...product.images],
    startingPoints: [...(product.startingPoints || [])]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
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

const addStartingPoint = () => {
  formData.value.startingPoints.push({
    starting_point_id: '',
    time: ''
  })
}

const removeStartingPoint = (index) => {
  formData.value.startingPoints.splice(index, 1)
}

const updateStartingPoint = (index, field, value) => {
  formData.value.startingPoints[index][field] = value
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
    // 빈 문자열을 null로 변환하는 함수
    const cleanData = (data) => {
      const cleaned = { ...data }
      Object.keys(cleaned).forEach(key => {
        if (cleaned[key] === '') {
          cleaned[key] = null
        }
      })
      return cleaned
    }
    
    if (modalMode.value === 'create') {
      // createProduct API 호출
      const productData = {
        ...cleanData(formData.value),
        adult_price: parseInt(formData.value.adult_price),
        child_price: parseInt(formData.value.child_price),
        images: formData.value.images.filter(img => img.file).map(img => img.file)
      }
      
      const result = await createProduct(productData)
      if (result.success) {
      alert('상품이 성공적으로 추가되었습니다.')
        closeModal()
        await loadProducts()
    } else {
        alert(`상품 추가 실패: ${result.error}`)
      }
    } else {
      // updateProduct API 호출
      const productData = {
        ...cleanData(formData.value),
        adult_price: parseInt(formData.value.adult_price),
        child_price: parseInt(formData.value.child_price),
        images: formData.value.images.filter(img => img.file).map(img => img.file)
      }
      
      const result = await updateProduct(selectedProduct.value.id, productData)
      if (result.success) {
      alert('상품이 성공적으로 수정되었습니다.')
    closeModal()
    await loadProducts()
      } else {
        alert(`상품 수정 실패: ${result.error}`)
      }
    }
  } catch (error) {
    alert('처리 중 오류가 발생했습니다.')
    console.error('상품 처리 오류:', error)
  } finally {
    submitting.value = false
  }
}

const handleDeleteProduct = async (product) => {
  if (!confirm(`'${product.title}' 상품을 삭제하시겠습니까?`)) {
    return
  }

  try {
    const result = await deleteProduct(product.id)
    if (result.success) {
    alert('상품이 성공적으로 삭제되었습니다.')
    await loadProducts()
    } else {
      alert(`상품 삭제 실패: ${result.error}`)
    }
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

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  const date = new Date(dateTimeString)
  return date.toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 라이프사이클
onMounted(async () => {
  await loadCategories()
  await loadTags()
  await loadBadges()
  await loadLocations()
  await loadStartingPoints()
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
  max-width: 300px;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 150px;
}

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
  min-width: 1200px;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  min-width: 100px;
}

.products-table th:first-child,
.products-table td:first-child {
  min-width: 80px;
}

.products-table th:last-child,
.products-table td:last-child {
  min-width: 120px;
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

.product-subtitle {
  font-size: 0.7rem !important;
  color: #9ca3af !important;
  font-style: italic;
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

/* 출발장소 스타일 */
.starting-points-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.starting-points-header {
  display: flex;
  justify-content: flex-start;
}

.btn-add-starting-point {
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

.btn-add-starting-point:hover {
  background: #2563eb;
}

.starting-points-list {
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

.starting-point-item {
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
}

.starting-point-inputs {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.starting-point-select {
  flex: 2;
  min-width: 0;
}

.starting-point-time {
  flex: 1;
  min-width: 0;
}

.btn-remove-starting-point {
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

.btn-remove-starting-point:hover {
  background: #fecaca;
}

/* 출발장소 표시 스타일 */
.starting-points-display {
  font-size: 0.75rem;
}

.starting-point-display-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.point-name {
  font-weight: 500;
  color: #374151;
}

.point-time {
  color: #6b7280;
  font-size: 0.7rem;
}

.more-points {
  color: #6b7280;
  font-style: italic;
  font-size: 0.7rem;
}

.no-starting-points {
  color: #9ca3af;
  font-style: italic;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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