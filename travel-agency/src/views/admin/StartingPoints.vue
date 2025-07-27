<template>
  <div class="starting-points">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h2>출발지 관리</h2>
      <button class="add-btn" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        출발지 추가
      </button>
    </div>

    <!-- 검색 및 필터 -->
    <div class="filters">
      <div class="search-box">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="출발지명으로 검색..."
          @input="filterStartingPoints"
        >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- 출발지 목록 테이블 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>출발지명</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in filteredStartingPoints" :key="point.id">
            <td>{{ point.id }}</td>
            <td>{{ point.name }}</td>
            <td>
              <div class="action-buttons">
                <button class="edit-btn" @click="editStartingPoint(point)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button class="delete-btn" @click="deleteStartingPoint(point)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 데이터가 없을 때 -->
    <div v-if="filteredStartingPoints.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
      <p>{{ searchTerm ? '검색 결과가 없습니다.' : '등록된 출발지가 없습니다.' }}</p>
    </div>

    <!-- 추가/수정 모달 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '출발지 수정' : '출발지 추가' }}</h3>
          <button class="close-btn" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label for="name">출발지명 *</label>
            <input 
              id="name"
              v-model="formData.name" 
              type="text" 
              required
              placeholder="출발지명을 입력하세요"
              :class="{ error: formErrors.name }"
            >
            <span v-if="formErrors.name" class="error-message">{{ formErrors.name }}</span>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">취소</button>
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ showEditModal ? '수정' : '추가' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h3>출발지 삭제</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <p>정말로 "<strong>{{ selectedPoint?.name }}</strong>" 출발지를 삭제하시겠습니까?</p>
          <p class="warning">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="showDeleteModal = false">취소</button>
          <button type="button" class="delete-confirm-btn" @click="confirmDelete" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getStartingPoints, createStartingPoint, updateStartingPoint, deleteStartingPoint as deleteStartingPointAPI } from '@/lib/startingpoints.js'

// 반응형 데이터
const startingPoints = ref([])
const filteredStartingPoints = ref([])
const searchTerm = ref('')
const loading = ref(false)

// 모달 상태
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// 폼 데이터
const formData = ref({
  name: ''
})

// 폼 에러
const formErrors = ref({})

// 선택된 출발지
const selectedPoint = ref(null)

// 데이터 로드
const loadStartingPoints = async () => {
  loading.value = true
  try {
    const result = await getStartingPoints()
    if (result.success) {
      startingPoints.value = result.startingPoints
      filteredStartingPoints.value = [...result.startingPoints]
    } else {
      console.error('출발지 데이터 로드 실패:', result.error)
    }
  } catch (error) {
    console.error('출발지 데이터 로드 오류:', error)
  } finally {
    loading.value = false
  }
}

// 검색 필터
const filterStartingPoints = () => {
  if (!searchTerm.value.trim()) {
    filteredStartingPoints.value = [...startingPoints.value]
  } else {
    filteredStartingPoints.value = startingPoints.value.filter(point =>
      point.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
}

// 출발지 추가
const addStartingPoint = async () => {
  loading.value = true
  try {
    const result = await createStartingPoint(formData.value.name)
    if (result.success) {
      await loadStartingPoints()
      closeModal()
      alert('출발지가 성공적으로 추가되었습니다.')
    } else {
      alert('출발지 추가 실패: ' + result.error)
    }
  } catch (error) {
    console.error('출발지 추가 오류:', error)
    alert('출발지 추가 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 출발지 수정
const editStartingPoint = (point) => {
  selectedPoint.value = point
  formData.value.name = point.name
  showEditModal.value = true
}

// 출발지 수정 제출
const updateStartingPointData = async () => {
  loading.value = true
  try {
    const result = await updateStartingPoint(selectedPoint.value.id, formData.value.name)
    if (result.success) {
      await loadStartingPoints()
      closeModal()
      alert('출발지가 성공적으로 수정되었습니다.')
    } else {
      alert('출발지 수정 실패: ' + result.error)
    }
  } catch (error) {
    console.error('출발지 수정 오류:', error)
    alert('출발지 수정 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 출발지 삭제
const deleteStartingPoint = (point) => {
  selectedPoint.value = point
  showDeleteModal.value = true
}

// 삭제 확인
const confirmDelete = async () => {
  loading.value = true
  try {
    const result = await deleteStartingPointAPI(selectedPoint.value.id)
    if (result.success) {
      await loadStartingPoints()
      showDeleteModal.value = false
      alert('출발지가 성공적으로 삭제되었습니다.')
    } else {
      alert('출발지 삭제 실패: ' + result.error)
    }
  } catch (error) {
    console.error('출발지 삭제 오류:', error)
    alert('출발지 삭제 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 폼 제출
const submitForm = () => {
  // 폼 검증
  formErrors.value = {}
  
  if (!formData.value.name.trim()) {
    formErrors.value.name = '출발지명을 입력해주세요.'
    return
  }
  
  if (formData.value.name.length > 50) {
    formErrors.value.name = '출발지명은 50자 이하여야 합니다.'
    return
  }
  
  if (showEditModal.value) {
    updateStartingPointData()
  } else {
    addStartingPoint()
  }
}

// 모달 닫기
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  formData.value.name = ''
  formErrors.value = {}
  selectedPoint.value = null
}

// 라이프사이클
onMounted(() => {
  loadStartingPoints()
})
</script>

<style scoped>
.starting-points {
  padding: 1.5rem;
}

/* 페이지 헤더 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

/* 필터 */
.filters {
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
}

.search-box svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 테이블 */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.data-table td {
  color: #1f2937;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
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

.modal {
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
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
}

.form-group input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 삭제 모달 */
.delete-modal .modal-content {
  padding: 1.5rem;
}

.delete-modal .modal-content p {
  margin: 0 0 1rem 0;
  color: #374151;
}

.delete-modal .modal-content .warning {
  color: #dc2626;
  font-size: 0.875rem;
}

.delete-confirm-btn {
  background: #dc2626;
  color: white;
}

.delete-confirm-btn:hover:not(:disabled) {
  background: #b91c1c;
}

/* 로딩 스피너 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .starting-points {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .data-table {
    font-size: 0.75rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .modal {
    width: 95%;
    margin: 1rem;
  }
}
</style> 