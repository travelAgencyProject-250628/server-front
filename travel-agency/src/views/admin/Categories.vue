<template>
  <div class="categories-page">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchTerm"
          placeholder="카테고리명 또는 설명 검색..."
          class="search-input"
          @input="handleSearch"
        >
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        카테고리 추가
      </button>
    </div>

    <!-- 카테고리 목록 -->
    <div class="categories-grid">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>카테고리를 불러오는 중...</p>
      </div>
      
      <div v-else-if="filteredCategories.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" stroke="currentColor" stroke-width="2"/>
          <path d="M8 21v-5a2 2 0 012-2h4a2 2 0 012 2v5" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>카테고리가 없습니다.</p>
        <button class="btn-primary" @click="openCreateModal">첫 번째 카테고리 만들기</button>
      </div>

      <div v-else class="categories-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>카테고리명</th>
              <th>설명</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in filteredCategories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>
                <div class="description-cell">
                  {{ category.description || '설명 없음' }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-edit"
                    @click="openEditModal(category)"
                    title="수정"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button 
                    class="btn-delete"
                    @click="deleteCategory(category)"
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

    <!-- 카테고리 생성/수정 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? '카테고리 추가' : '카테고리 수정' }}</h3>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label for="categoryName">카테고리명 *</label>
            <input 
              type="text" 
              id="categoryName"
              v-model="formData.name"
              placeholder="카테고리명을 입력하세요"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="categoryDescription">설명</label>
            <textarea 
              id="categoryDescription"
              v-model="formData.description"
              placeholder="카테고리 설명을 입력하세요 (선택사항)"
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="popularProducts">인기상품 지정 (최대 3개)</label>
            <div class="popular-products-selector">
              <div class="selected-products">
                <div 
                  v-for="(productId, index) in formData.popular_products" 
                  :key="index"
                  class="selected-product-item"
                >
                  <span class="product-name">{{ getProductName(productId) }}</span>
                  <button 
                    type="button" 
                    @click="removePopularProduct(index)"
                    class="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <button 
                type="button" 
                @click="showProductSelector = true"
                class="add-product-btn"
                :disabled="formData.popular_products.length >= 3"
              >
                + 상품 추가
              </button>
            </div>
            <small class="form-help">인기순 정렬 시 지정된 순서로 표시됩니다.</small>
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

    <!-- 상품 선택 모달 -->
    <div v-if="showProductSelector" class="modal-overlay" @click="closeProductSelector">
      <div class="modal-content product-selector-modal" @click.stop>
        <div class="modal-header">
          <h3>인기상품 선택</h3>
          <button class="modal-close" @click="closeProductSelector">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="product-selector-content">
          <div class="product-list">
            <div 
              v-for="product in categoryProducts" 
              :key="product.id"
              class="product-item"
              :class="{ selected: formData.popular_products.includes(product.id) }"
              @click="!formData.popular_products.includes(product.id) && selectProduct(product.id)"
              :style="formData.popular_products.includes(product.id) ? 'opacity:0.5;pointer-events:none;' : ''"
            >
              <div class="product-info">
                <div class="product-title">{{ product.title }}</div>
                <div class="product-details">
                  <span class="product-duration">{{ product.duration }}</span>
                  <span class="product-location">{{ product.location }}</span>
                  <span class="product-price">{{ formatPrice(product.adult_price) }}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categoryService } from '@/lib/categories.js'

// 반응형 데이터
const categories = ref([])
const loading = ref(false)
const searchTerm = ref('')
const showModal = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const submitting = ref(false)
const selectedCategory = ref(null)

// 상품 선택 관련
const showProductSelector = ref(false)
const productSearchTerm = ref('')
const categoryProducts = ref([])

// 폼 데이터
const formData = ref({
  name: '',
  description: '',
  popular_products: []
})

// 계산된 속성
const filteredCategories = computed(() => {
  if (!searchTerm.value) {
    return categories.value
  }
  return categories.value.filter(category => {
    const searchQuery = searchTerm.value.toLowerCase()
    const name = category.name.toLowerCase()
    const description = (category.description || '').toLowerCase()
    
    return name.includes(searchQuery) || description.includes(searchQuery)
  })
})

const filteredProducts = computed(() => {
  if (!productSearchTerm.value) {
    return categoryProducts.value
  }
  return categoryProducts.value.filter(product => {
    const searchQuery = productSearchTerm.value.toLowerCase()
    const title = product.title.toLowerCase()
    return title.includes(searchQuery)
  })
})

// 메서드
const loadCategories = async () => {
  loading.value = true
  try {
    const result = await categoryService.getAllCategories()
    if (result.success) {
      categories.value = result.categories
    } else {
      console.error('카테고리 로드 실패:', result.error)
    }
  } catch (error) {
    console.error('카테고리 로드 오류:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 실시간 검색 기능 (이미 computed로 구현됨)
}

const openCreateModal = () => {
  modalMode.value = 'create'
  formData.value = { name: '', description: '' }
  showModal.value = true
}

const openEditModal = async (category) => {
  modalMode.value = 'edit'
  selectedCategory.value = category
  formData.value = { 
    name: category.name,
    description: category.description || '',
    popular_products: category.popular_products || []
  }
  
  // 카테고리에 속한 상품들 로드
  await loadCategoryProducts(category.id)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCategory.value = null
  formData.value = { name: '', description: '', popular_products: [] }
  showProductSelector.value = false
  productSearchTerm.value = ''
  categoryProducts.value = []
}

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    alert('카테고리명을 입력해주세요.')
    return
  }

  submitting.value = true
  try {
    let result
    const payload = {
      name: formData.value.name,
      description: formData.value.description,
      popular_products: formData.value.popular_products
    }
    if (modalMode.value === 'create') {
      result = await categoryService.createCategory(payload)
    } else {
      result = await categoryService.updateCategory(selectedCategory.value.id, payload)
    }

    if (result.success) {
      alert(result.message)
      closeModal()
      await loadCategories()
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('처리 중 오류가 발생했습니다.')
    console.error('카테고리 처리 오류:', error)
  } finally {
    submitting.value = false
  }
}

const deleteCategory = async (category) => {
  if (!confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`)) {
    return
  }

  try {
    const result = await categoryService.deleteCategory(category.id)
    if (result.success) {
      alert(result.message)
      await loadCategories()
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('카테고리 삭제 중 오류가 발생했습니다.')
    console.error('카테고리 삭제 오류:', error)
  }
}

// 상품 관련 메서드들
const loadCategoryProducts = async (categoryId) => {
  try {
    const result = await categoryService.getCategoryProducts(categoryId)
    if (result.success) {
      categoryProducts.value = result.products
    } else {
      console.error('카테고리 상품 로드 실패:', result.error)
      categoryProducts.value = []
    }
  } catch (error) {
    console.error('카테고리 상품 로드 오류:', error)
    categoryProducts.value = []
  }
}

const getProductName = (productId) => {
  const product = categoryProducts.value.find(p => p.id === productId)
  return product ? product.title : '알 수 없는 상품'
}

const selectProduct = (productId) => {
  if (!formData.value.popular_products.includes(productId)) {
    formData.value.popular_products.push(productId)
  }
  closeProductSelector()
}

const removePopularProduct = (index) => {
  formData.value.popular_products.splice(index, 1)
}

const closeProductSelector = () => {
  showProductSelector.value = false
  productSearchTerm.value = ''
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}



// 라이프사이클
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-page {
  max-width: 1200px;
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

.search-box {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-input:focus {
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

/* 카테고리 그리드 */
.categories-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 로딩 상태 */
.loading-state {
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

/* 빈 상태 */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #d1d5db;
}

/* 테이블 */
.categories-table {
  overflow-x: auto;
}

.categories-table table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.categories-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.categories-table td {
  color: #1f2937;
  font-size: 0.875rem;
}

.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6b7280;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .categories-table {
    font-size: 0.8rem;
  }
  
  .categories-table th,
  .categories-table td {
    padding: 0.5rem;
  }
  
  .description-cell {
    max-width: 150px;
    font-size: 0.75rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* 인기상품 선택 관련 스타일 */
.popular-products-selector {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #f9fafb;
}

.selected-products {
  margin-bottom: 1rem;
}

.selected-product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.product-name {
  color: #374151;
  font-weight: 500;
}

.remove-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fecaca;
}

.add-product-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.add-product-btn:hover:not(:disabled) {
  background: #2563eb;
}

.add-product-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.form-help {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* 상품 선택 모달 */
.product-selector-modal {
  max-width: 600px;
  max-height: 80vh;
}

.product-selector-content {
  padding: 1.5rem;
}

.product-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.product-item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item:hover {
  background: #f9fafb;
}

.product-item.selected {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.product-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.product-duration,
.product-location,
.product-price {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.product-price {
  color: #059669;
  font-weight: 500;
}

/* 스크롤바 스타일 */
.product-list::-webkit-scrollbar {
  width: 6px;
}

.product-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.product-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.product-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 