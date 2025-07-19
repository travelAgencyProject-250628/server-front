<template>
  <div class="tags-admin">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">태그 관리</h2>
        <p class="page-description">여행 상품에 사용되는 태그를 관리합니다.</p>
      </div>
      <button class="add-btn" @click="showAddModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        태그 추가
      </button>
    </div>

    <!-- 검색 -->
    <div class="search-section">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="태그명으로 검색..."
          class="search-input"
        >
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>태그 목록을 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>오류가 발생했습니다</h3>
      <p>{{ error }}</p>
      <button @click="fetchTags" class="retry-btn">다시 시도</button>
    </div>

    <!-- 태그 목록 -->
    <div v-else class="tags-container">
      <div v-if="filteredTags.length === 0" class="empty-state">
        <div class="empty-icon">🏷️</div>
        <h3>태그가 없습니다</h3>
        <p>{{ searchQuery ? '검색 결과가 없습니다.' : '첫 번째 태그를 추가해보세요.' }}</p>
      </div>
      
      <div v-else class="tags-list">
        <div 
          v-for="tag in filteredTags" 
          :key="tag.id"
          class="tag-item"
        >
          <div class="tag-info">
            <div class="tag-name">{{ tag.name }}</div>
            <div class="tag-id">ID: {{ tag.id }}</div>
          </div>
          <button 
            class="edit-btn" 
            @click="editTag(tag)"
            title="수정"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            수정
          </button>
        </div>
      </div>
    </div>

    <!-- 태그 추가/수정 모달 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '태그 수정' : '태그 추가' }}</h3>
          <button class="close-btn" @click="closeModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitTag" class="modal-form">
          <div class="form-group">
            <label for="tagName">태그명 *</label>
            <input 
              id="tagName"
              type="text" 
              v-model="tagForm.name" 
              placeholder="태그명을 입력하세요"
              required
              class="form-input"
              :class="{ 'error': tagFormErrors.name }"
              maxlength="50"
            >
            <span v-if="tagFormErrors.name" class="error-message">{{ tagFormErrors.name }}</span>
            <div class="char-count">{{ tagForm.name.length }}/50</div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">취소</button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? '처리 중...' : (showEditModal ? '수정' : '추가') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'

// 반응형 데이터
const loading = ref(false)
const error = ref('')
const tags = ref([])
const searchQuery = ref('')

// 모달 상태
const showAddModal = ref(false)
const showEditModal = ref(false)
const submitting = ref(false)

// 폼 데이터
const tagForm = ref({
  name: ''
})

const tagFormErrors = ref({})

// 필터된 태그 목록
const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value
  
  return tags.value.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 메서드들
const fetchTags = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await supabase
      .from('Tags')
      .select('*')
      .order('id')
    
    if (fetchError) {
      throw fetchError
    }
    
    tags.value = data || []
    console.log('태그 목록 로드 완료:', tags.value.length, '개')
  } catch (err) {
    console.error('태그 목록 로드 오류:', err)
    error.value = '태그 목록을 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  tagForm.value = { name: '' }
  tagFormErrors.value = {}
}

const validateForm = () => {
  const errors = {}
  
  if (!tagForm.value.name.trim()) {
    errors.name = '태그명을 입력해주세요.'
  } else if (tagForm.value.name.trim().length > 50) {
    errors.name = '태그명은 50자 이하여야 합니다.'
  }
  
  tagFormErrors.value = errors
  return Object.keys(errors).length === 0
}

const submitTag = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    if (showEditModal.value) {
      // 태그 수정
      const { error: updateError } = await supabase
        .from('Tags')
        .update({ name: tagForm.value.name.trim() })
        .eq('id', tagForm.value.id)
      
      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('이미 존재하는 태그명입니다.')
        }
        throw updateError
      }
      
      alert('태그가 수정되었습니다.')
    } else {
      // 태그 추가
      const { error: insertError } = await supabase
        .from('Tags')
        .insert({ name: tagForm.value.name.trim() })
      
      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('이미 존재하는 태그명입니다.')
        }
        throw insertError
      }
      
      alert('태그가 추가되었습니다.')
    }
    
    closeModal()
    await fetchTags()
  } catch (err) {
    console.error('태그 저장 오류:', err)
    alert(err.message || '태그 저장에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}

const editTag = (tag) => {
  tagForm.value = { ...tag }
  showEditModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

// 컴포넌트 마운트 시 태그 목록 로드
onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
/* CSS 변수 정의 제거 */

.tags-admin {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* 페이지 헤더 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.page-description {
  color: #6b7280;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #a9c4ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 검색 섹션 */
.search-section {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 400px;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 에러 상태 */
.error-container {
  text-align: center;
  padding: 4rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #2563eb;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

/* 태그 목록 */
.tags-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-item {
  background: rgb(216, 248, 255) !important;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.tag-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.tag-info {
  flex: 1;
}

.tag-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.tag-id {
  font-size: 0.8rem;
  color: #6b7280;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
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
  backdrop-filter: blur(4px);
}

.modal {
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: #6b7280;
}

.close-btn:hover {
  background: #f9fafb;
  color: #1f2937;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1f2937;
}

.form-input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #1f2937;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #6b7280;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .tags-admin {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .add-btn {
    align-self: flex-start;
  }
  
  .tag-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .edit-btn {
    align-self: flex-end;
  }
  
  .modal {
    width: 95%;
    margin: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn, .submit-btn {
    width: 100%;
  }
}
</style> 