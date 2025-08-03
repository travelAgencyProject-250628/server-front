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
            placeholder="연락처, 주소, 버스타입, 고객유형, 이용목적, 결제방식, 기사님동행, 특이사항으로 검색..."
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
                {{ rental.content.busTypeName }} - {{ rental.content.tripTypeName }}
              </h3>
              <div class="rental-meta">
                <span class="rental-date">{{ formatDate(rental.created_at) }}</span>
                <span class="rental-customer">{{ rental.content.customerTypeName }}</span>
                <span class="rental-purpose">{{ rental.content.purposeName }}</span>
              </div>
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
              <span class="detail-value">{{ rental.content.phoneNumber }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">버스 타입:</span>
              <span class="detail-value">{{ rental.content.busTypeName }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">고객 유형:</span>
              <span class="detail-value">{{ rental.content.customerTypeName }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">이용 목적:</span>
              <span class="detail-value">{{ rental.content.purposeName }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">인원:</span>
              <span class="detail-value">
                {{ rental.content.unknownPassengerCount ? '정확한 인원 모름' : rental.content.passengerCount + '명' }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">출발지:</span>
              <span class="detail-value">{{ rental.content.departure }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">도착지:</span>
              <span class="detail-value">{{ rental.content.destination }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">출발일:</span>
              <span class="detail-value">
                {{ formatDate(rental.content.departureDate) }} {{ rental.content.departureTime }}
              </span>
            </div>

            <div v-if="rental.content.tripType === 'round' && rental.content.returnDate" class="detail-row">
              <span class="detail-label">도착일:</span>
              <span class="detail-value">
                {{ formatDate(rental.content.returnDate) }} {{ rental.content.returnTime }}
              </span>
            </div>

            <!-- 기사님 동행 정보 (왕복인 경우에만 표시) -->
            <div v-if="rental.content.tripType === 'round' && rental.content.driverAccompaniment" class="detail-row">
              <span class="detail-label">기사님 동행:</span>
              <span class="detail-value">{{ rental.content.driverAccompanimentName || '미선택' }}</span>
            </div>

            <!-- 결제 정보 -->
            <div v-if="rental.content.paymentMethod" class="detail-row">
              <span class="detail-label">결제방식:</span>
              <span class="detail-value">{{ rental.content.paymentMethodName }}</span>
            </div>

            <div v-if="rental.content.needReceipt !== undefined" class="detail-row">
              <span class="detail-label">세금계산서:</span>
              <span class="detail-value">{{ rental.content.needReceipt ? '신청' : '미신청' }}</span>
            </div>

            <!-- 특이사항 -->
            <div v-if="rental.content.specialNotes" class="detail-row special-notes">
              <span class="detail-label">특이사항:</span>
              <span class="detail-value">{{ rental.content.specialNotes }}</span>
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
      rental.content.phoneNumber?.toLowerCase().includes(term) ||
      rental.content.departure?.toLowerCase().includes(term) ||
      rental.content.destination?.toLowerCase().includes(term) ||
      rental.content.busTypeName?.toLowerCase().includes(term) ||
      rental.content.customerTypeName?.toLowerCase().includes(term) ||
      rental.content.purposeName?.toLowerCase().includes(term) ||
      rental.content.paymentMethodName?.toLowerCase().includes(term) ||
      rental.content.driverAccompanimentName?.toLowerCase().includes(term) ||
      rental.content.specialNotes?.toLowerCase().includes(term)
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

.rental-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.25rem;
}

.rental-customer,
.rental-purpose {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
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
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  min-width: 80px;
}

.detail-value {
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 특이사항 스타일 */
.special-notes {
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.special-notes .detail-value {
  white-space: pre-wrap;
  line-height: 1.4;
  word-break: break-word;
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