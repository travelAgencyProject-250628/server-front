<template>
  <div class="bus-rentals-admin">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h2>버스 대절 신청 관리</h2>
      <p>고객이 신청한 버스 대절 견적 요청을 확인하고 관리할 수 있습니다.</p>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>

    <!-- 데이터가 있는 경우 -->
    <div v-else-if="busRentals.length > 0" class="rentals-container">
      <!-- 필터 및 검색 -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="연락처 또는 주소로 검색..."
            class="search-input"
          >
        </div>
        <div class="filter-buttons">
          <button 
            class="filter-btn" 
            :class="{ active: statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            전체
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: statusFilter === false }"
            @click="statusFilter = false"
          >
            대기중
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: statusFilter === true }"
            @click="statusFilter = true"
          >
            연락완료
          </button>
        </div>
      </div>

      <!-- 신청 목록 -->
      <div class="rentals-list">
        <div 
          v-for="rental in filteredRentals" 
          :key="rental.id" 
          class="rental-card"
          :class="{ 'contacted': rental.status }"
        >
          <div class="rental-header">
            <div class="rental-info">
              <h3 class="rental-title">
                {{ rental.content.tripType === 'round' ? '왕복' : '편도' }} 버스 대절
              </h3>
              <span class="rental-date">{{ formatDate(rental.created_at) }}</span>
            </div>
                      <div class="rental-status">
            <span 
              class="status-badge"
              :class="rental.status ? 'contacted' : 'pending'"
            >
              {{ rental.status ? '연락완료' : '대기중' }}
            </span>
          </div>
          </div>

          <div class="rental-details">
            <div class="detail-row">
              <span class="detail-label">연락처:</span>
              <span class="detail-value">{{ rental.content.phone }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">인원:</span>
              <span class="detail-value">{{ rental.content.passengers }}명</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">출발지:</span>
              <span class="detail-value">{{ rental.content.departure }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">도착지:</span>
              <span class="detail-value">{{ rental.content.arrival }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">가는날:</span>
              <span class="detail-value">
                {{ formatDate(rental.content.departureDate) }} {{ rental.content.departureTime }}
              </span>
            </div>

            <div v-if="rental.content.tripType === 'round'" class="detail-row">
              <span class="detail-label">오는날:</span>
              <span class="detail-value">
                {{ formatDate(rental.content.returnDate) }} {{ rental.content.returnTime }}
              </span>
            </div>

            <div v-if="rental.content.stopovers && rental.content.stopovers.length > 0" class="detail-row">
              <span class="detail-label">경유지:</span>
              <span class="detail-value">
                {{ rental.content.stopovers.join(', ') }}
              </span>
            </div>
          </div>

          <div class="rental-actions">
            <button 
              v-if="!rental.status"
              class="action-btn contact-btn"
              @click="markAsContacted(rental.id)"
            >
              연락완료
            </button>
            <button 
              v-if="rental.status"
              class="action-btn pending-btn"
              @click="markAsPending(rental.id)"
            >
              대기중으로 변경
            </button>
            <button 
              class="action-btn delete-btn"
              @click="deleteRental(rental.id)"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 데이터가 없는 경우 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3>버스 대절 신청이 없습니다</h3>
      <p>아직 고객이 버스 대절을 신청하지 않았습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBusRentals, updateBusRentalStatus, deleteBusRental } from '../../lib/busRentals.js'

// 상태 관리
const isLoading = ref(true)
const busRentals = ref([])
const searchTerm = ref('')
const statusFilter = ref('all')

// 데이터 로드
const loadBusRentals = async () => {
  try {
    isLoading.value = true
    const result = await getBusRentals()
    
    if (result.success) {
      busRentals.value = result.data.map(rental => ({
        ...rental,
        content: typeof rental.content === 'string' ? JSON.parse(rental.content) : rental.content,
        status: rental.status || false
      }))
    } else {
      console.error('버스 대절 데이터 로드 실패:', result.error)
    }
  } catch (error) {
    console.error('버스 대절 데이터 로드 오류:', error)
  } finally {
    isLoading.value = false
  }
}

// 필터링된 데이터
const filteredRentals = computed(() => {
  let filtered = busRentals.value

  // 상태 필터
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(rental => rental.status === statusFilter.value)
  }

  // 검색 필터
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(rental => 
      rental.content.phone?.toLowerCase().includes(term) ||
      rental.content.departure?.toLowerCase().includes(term) ||
      rental.content.arrival?.toLowerCase().includes(term)
    )
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// 연락완료 처리
const markAsContacted = async (rentalId) => {
  try {
    const result = await updateBusRentalStatus(rentalId, true)
    
    if (result.success) {
      // 로컬 상태 업데이트
      const rental = busRentals.value.find(r => r.id === rentalId)
      if (rental) {
        rental.status = true
      }
      alert('연락완료로 처리되었습니다.')
    } else {
      alert(`상태 업데이트 실패: ${result.error}`)
    }
  } catch (error) {
    console.error('상태 업데이트 오류:', error)
    alert('상태 업데이트 중 오류가 발생했습니다.')
  }
}

// 대기중으로 변경 처리
const markAsPending = async (rentalId) => {
  try {
    const result = await updateBusRentalStatus(rentalId, false)
    
    if (result.success) {
      // 로컬 상태 업데이트
      const rental = busRentals.value.find(r => r.id === rentalId)
      if (rental) {
        rental.status = false
      }
      alert('대기중으로 변경되었습니다.')
    } else {
      alert(`상태 업데이트 실패: ${result.error}`)
    }
  } catch (error) {
    console.error('상태 업데이트 오류:', error)
    alert('상태 업데이트 중 오류가 발생했습니다.')
  }
}

// 삭제 처리
const deleteRental = async (rentalId) => {
  if (!confirm('정말로 이 신청을 삭제하시겠습니까?')) {
    return
  }

  try {
    const result = await deleteBusRental(rentalId)
    
    if (result.success) {
      // 로컬 상태에서 제거
      busRentals.value = busRentals.value.filter(r => r.id !== rentalId)
      alert('삭제되었습니다.')
    } else {
      alert(`삭제 실패: ${result.error}`)
    }
  } catch (error) {
    console.error('삭제 오류:', error)
    alert('삭제 중 오류가 발생했습니다.')
  }
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 초기 데이터 로드
onMounted(loadBusRentals)
</script>

<style scoped>
.bus-rentals-admin {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

/* 로딩 인디케이터 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
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

/* 필터 섹션 */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.filter-btn:hover:not(.active) {
  background: #f3f4f6;
}

/* 신청 목록 */
.rentals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rental-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.rental-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rental-card.contacted {
  opacity: 0.7;
  background: #f9fafb;
}

.rental-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.rental-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.rental-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.contacted {
  background: #d1fae5;
  color: #065f46;
}

.rental-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
  min-width: 60px;
}

.detail-value {
  color: #1f2937;
  font-size: 0.9rem;
}

.rental-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.contact-btn {
  background: #10b981;
  color: white;
}

.contact-btn:hover {
  background: #059669;
}

.pending-btn {
  background: #f59e0b;
  color: white;
}

.pending-btn:hover {
  background: #d97706;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.empty-state p {
  margin: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .bus-rentals-admin {
    padding: 1rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .filter-buttons {
    justify-content: center;
  }

  .rental-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .rental-details {
    grid-template-columns: 1fr;
  }

  .rental-actions {
    justify-content: center;
  }
}
</style> 