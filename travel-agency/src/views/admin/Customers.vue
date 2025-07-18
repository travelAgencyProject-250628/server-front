




<template>
  <div class="customers-page">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="search-filters">
        <input 
          type="text" 
          v-model="searchTerm"
          placeholder="고객명 또는 이메일 검색..."
          class="search-input"
        >
        <select v-model="selectedStatus" class="filter-select">
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>
      <div class="customer-stats">
        <div class="stat-item">
          <span class="stat-label">총 고객수</span>
          <span class="stat-value">{{ customers.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">활성 고객</span>
          <span class="stat-value">{{ activeCustomers }}</span>
        </div>









        ?




        "
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        "
      </div>
    </div>

    <!-- 고객 목록 -->
    <div class="customers-grid">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>고객 정보를 불러오는 중...</p>
      </div>
      
      <div v-else-if="filteredCustomers.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>고객 정보가 없습니다.</p>
      </div>

      <div v-else class="customers-table">
        <table>
          <thead>
            <tr>
              <th>고객정보</th>
              <th>연락처</th>
              <th>가입일</th>
              <th>예약횟수</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td>
                <div class="customer-info">
                  <div class="customer-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <div class="customer-details">
                    <h4>{{ customer.name }}</h4>
                    <p>{{ customer.email }}</p>
                    <span class="customer-id">ID: {{ customer.id }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-info">
                  <p>{{ customer.phone }}</p>
                  <p v-if="customer.address" class="address">{{ customer.address }}</p>
                </div>
              </td>
              <td>{{ formatDate(customer.createdAt) }}</td>
              <td>
                <div class="booking-count">
                  <span class="count">{{ customer.bookingCount }}회</span>
                  <span v-if="customer.lastBooking" class="last-booking">
                    최근: {{ formatDate(customer.lastBooking) }}
                  </span>
                </div>
              </td>
              <td>
                <span :class="['status', customer.status === 'active' ? 'status-active' : 'status-inactive']">
                  {{ customer.status === 'active' ? '활성' : '비활성' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-view"
                    @click="viewCustomer(customer)"
                    title="상세 보기"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button 
                    class="btn-edit"
                    @click="editCustomer(customer)"
                    title="수정"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button 
                    class="btn-delete"
                    @click="deleteCustomer(customer)"
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

    <!-- 고객 상세 정보 모달 -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>고객 상세 정보</h3>
          <button class="modal-close" @click="closeViewModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedCustomer" class="modal-body">
          <div class="customer-detail-grid">
            <div class="detail-section">
              <h4>기본 정보</h4>
              <div class="detail-item">
                <label>고객 ID</label>
                <span>{{ selectedCustomer.id }}</span>
              </div>
              <div class="detail-item">
                <label>이름</label>
                <span>{{ selectedCustomer.name }}</span>
              </div>
              <div class="detail-item">
                <label>이메일</label>
                <span>{{ selectedCustomer.email }}</span>
              </div>
              <div class="detail-item">
                <label>전화번호</label>
                <span>{{ selectedCustomer.phone }}</span>
              </div>
              <div class="detail-item">
                <label>주소</label>
                <span>{{ selectedCustomer.address || '등록되지 않음' }}</span>
              </div>
              <div class="detail-item">
                <label>상태</label>
                <span :class="['status', selectedCustomer.status === 'active' ? 'status-active' : 'status-inactive']">
                  {{ selectedCustomer.status === 'active' ? '활성' : '비활성' }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>예약 정보</h4>
              <div class="detail-item">
                <label>총 예약 횟수</label>
                <span>{{ selectedCustomer.bookingCount }}회</span>
              </div>
              <div class="detail-item">
                <label>마지막 예약일</label>
                <span>{{ selectedCustomer.lastBooking ? formatDate(selectedCustomer.lastBooking) : '없음' }}</span>
              </div>
              <div class="detail-item">
                <label>총 결제 금액</label>
                <span>{{ formatPrice(selectedCustomer.totalPayment) }}원</span>
              </div>
              <div class="detail-item">
                <label>가입일</label>
                <span>{{ formatDate(selectedCustomer.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 고객 정보 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>고객 정보 수정</h3>
          <button class="modal-close" @click="closeEditModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateCustomer" class="modal-form">
          <div class="form-group">
            <label for="customerName">이름 *</label>
            <input 
              type="text" 
              id="customerName"
              v-model="editForm.name"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="customerEmail">이메일 *</label>
            <input 
              type="email" 
              id="customerEmail"
              v-model="editForm.email"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="customerPhone">전화번호 *</label>
            <input 
              type="tel" 
              id="customerPhone"
              v-model="editForm.phone"
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="customerAddress">주소</label>
            <input 
              type="text" 
              id="customerAddress"
              v-model="editForm.address"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="customerStatus">상태</label>
            <select 
              id="customerStatus"
              v-model="editForm.status"
              class="form-input"
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeEditModal">
              취소
            </button>
            <button type="submit" class="btn-primary" :disabled="updating">
              {{ updating ? '수정 중...' : '수정' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllUsers } from '@/lib/users.js'

// 반응형 데이터
const customers = ref([])
const loading = ref(false)
const searchTerm = ref('')
const selectedStatus = ref('')
const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedCustomer = ref(null)
const updating = ref(false)

// 수정 폼 데이터
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'active'
})

// 계산된 속성
const filteredCustomers = computed(() => {
  let filtered = customers.value
  
  if (searchTerm.value) {
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedStatus.value) {
    filtered = filtered.filter(customer => customer.status === selectedStatus.value)
  }
  
  return filtered
})

const activeCustomers = computed(() => {
  return customers.value.filter(customer => customer.status === 'active').length
})

// 메서드
const loadCustomers = async () => {
  loading.value = true
  try {
    const result = await getAllUsers()
    
    if (result.success) {
      customers.value = result.users
    } else {
      console.error('고객 정보 로드 실패:', result.error)
      alert('고객 정보를 불러오는데 실패했습니다.')
    }
  } catch (error) {
    console.error('고객 정보 로드 오류:', error)
    alert('고객 정보를 불러오는 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

const viewCustomer = (customer) => {
  selectedCustomer.value = customer
  showViewModal.value = true
}

const editCustomer = (customer) => {
  selectedCustomer.value = customer
  editForm.value = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address || '',
    status: customer.status
  }
  showEditModal.value = true
}

const updateCustomer = async () => {
  updating.value = true
  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 로컬 데이터 업데이트
    const index = customers.value.findIndex(c => c.id === selectedCustomer.value.id)
    if (index !== -1) {
      customers.value[index] = {
        ...customers.value[index],
        ...editForm.value
      }
    }
    
    alert('고객 정보가 성공적으로 수정되었습니다.')
    closeEditModal()
  } catch (error) {
    alert('고객 정보 수정 중 오류가 발생했습니다.')
    console.error('고객 정보 수정 오류:', error)
  } finally {
    updating.value = false
  }
}

const deleteCustomer = async (customer) => {
  if (!confirm(`'${customer.name}' 고객을 삭제하시겠습니까?`)) {
    return
  }

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 로컬 데이터에서 삭제
    const index = customers.value.findIndex(c => c.id === customer.id)
    if (index !== -1) {
      customers.value.splice(index, 1)
    }
    
    alert('고객이 성공적으로 삭제되었습니다.')
  } catch (error) {
    alert('고객 삭제 중 오류가 발생했습니다.')
    console.error('고객 삭제 오류:', error)
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedCustomer.value = null
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedCustomer.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

// 라이프사이클
onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
.customers-page {
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
  min-width: 120px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.customer-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  min-width: 100px;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

/* 고객 그리드 */
.customers-grid {
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
.customers-table {
  overflow-x: auto;
}

.customers-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.customers-table th,
.customers-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.customers-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.customers-table td {
  color: #1f2937;
  font-size: 0.875rem;
}

/* 고객 정보 */
.customer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.customer-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.customer-details p {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.customer-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
}

/* 연락처 정보 */
.contact-info p {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.contact-info .address {
  color: #6b7280;
  font-size: 0.75rem;
}

/* 예약 정보 */
.booking-count {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-count .count {
  font-weight: 600;
  color: #1f2937;
}

.booking-count .last-booking {
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

.btn-view,
.btn-edit,
.btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view {
  background: #e0f2fe;
  color: #0369a1;
}

.btn-view:hover {
  background: #bae6fd;
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
  max-width: 700px;
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

.modal-body {
  padding: 1.5rem;
}

.modal-form {
  padding: 1.5rem;
}

/* 고객 상세 정보 */
.customer-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-section {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.detail-item label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.detail-item span {
  font-size: 0.875rem;
  color: #1f2937;
}

/* 폼 스타일 */
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

/* 버튼 스타일 */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
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
  
  .customer-stats {
    justify-content: center;
  }
  
  .customers-table {
    font-size: 0.8rem;
  }
  
  .customers-table th,
  .customers-table td {
    padding: 0.5rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .customer-detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 