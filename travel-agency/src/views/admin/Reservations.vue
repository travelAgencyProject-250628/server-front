<template>
  <div class="reservations">
    <!-- 필터 및 검색 -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="status-filter">상태별 필터:</label>
        <select id="status-filter" v-model="filters.status" @change="loadReservations">
          <option value="">전체</option>
          <option value="confirmed">예약확정</option>
          <option value="pending">예약대기</option>
          <option value="cancelled">예약취소</option>
        </select>
      </div>

      <div class="search-group">
        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="예약자명 또는 상품명으로 검색"
          @keyup.enter="loadReservations"
          class="search-input"
        >
        <button @click="loadReservations" class="search-btn">검색</button>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">전체 예약</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.confirmed }}</div>
          <div class="stat-label">예약확정</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">예약대기</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.cancelled }}</div>
          <div class="stat-label">예약취소</div>
        </div>
      </div>
    </div>

    <!-- 예약 목록 -->
    <div class="reservations-section">
      <div class="section-header">
        <h3>예약 목록</h3>
        <div class="pagination-info">
          총 {{ pagination.total }}건 중 {{ paginationInfo.startIndex + 1 }}-{{ paginationInfo.endIndex }}건
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>예약 정보를 불러오는 중...</p>
      </div>

      <!-- 예약 테이블 -->
      <div v-else-if="reservations.length > 0" class="reservations-table">
        <table>
          <thead>
            <tr>
              <th>예약번호</th>
              <th>예약일</th>
              <th>예약자</th>
              <th>연락처</th>
              <th>상품명</th>
              <th>출발일</th>
              <th>출발지</th>
              <th>인원</th>
              <th>총 금액</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td>{{ reservation.id }}</td>
              <td>{{ formatDate(reservation.created_at) }}</td>
              <td>{{ reservation.booker_name }}</td>
              <td>{{ reservation.booker_phone }}</td>
              <td class="product-name">{{ reservation.product?.title }}</td>
              <td>{{ formatDate(reservation.departure_date) }}</td>
              <td>{{ reservation.starting_point?.name }}</td>
              <td>
                <span v-if="reservation.adult_count > 0">성인 {{ reservation.adult_count }}명</span>
                <span v-if="reservation.child_count > 0" class="child-count">아동 {{ reservation.child_count }}명</span>
              </td>
              <td class="amount">{{ formatCurrency(calculateTotal(reservation)) }}</td>
              <td>
                <span :class="['status', `status-${reservation.status}`]">
                  {{ getStatusText(reservation.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="viewDetail(reservation.id)" 
                    class="btn-detail"
                    title="상세보기"
                  >
                    👁️
                  </button>
                  <select 
                    v-model="reservation.status" 
                    @change="updateStatus(reservation.id, reservation.status)"
                    class="status-select"
                  >
                    <option value="pending">대기</option>
                    <option value="confirmed">확정</option>
                    <option value="cancelled">취소</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 예약이 없을 때 -->
      <div v-else class="no-reservations">
        <p>조회된 예약이 없습니다.</p>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="pagination.totalPages > 1" class="pagination">
        <button 
          @click="changePage(pagination.page - 1)" 
          :disabled="pagination.page <= 1"
          class="page-btn"
        >
          이전
        </button>
        
        <span class="page-info">
          {{ pagination.page }} / {{ pagination.totalPages }}
        </span>
        
        <button 
          @click="changePage(pagination.page + 1)" 
          :disabled="pagination.page >= pagination.totalPages"
          class="page-btn"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllReservations, updateReservationStatus } from '@/lib/reservations.js'

const router = useRouter()

// 반응형 데이터
const loading = ref(false)
const reservations = ref([])
const filters = ref({
  status: '',
  search: ''
})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// 통계 데이터
const stats = ref({
  total: 0,
  confirmed: 0,
  pending: 0,
  cancelled: 0
})

// 계산된 속성
const paginationInfo = computed(() => {
  const startIndex = (pagination.value.page - 1) * pagination.value.limit
  const endIndex = Math.min(startIndex + pagination.value.limit, pagination.value.total)
  return { startIndex, endIndex }
})

// 메서드
const loadReservations = async () => {
  loading.value = true
  try {
    const result = await getAllReservations({
      status: filters.value.status,
      search: filters.value.search,
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    if (result.success) {
      reservations.value = result.reservations
      pagination.value = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
      
      // 통계 업데이트
      updateStats()
    } else {
      console.error('예약 조회 실패:', result.error)
      alert('예약 정보를 불러오는데 실패했습니다.')
    }
  } catch (error) {
    console.error('예약 조회 오류:', error)
    alert('예약 정보를 불러오는 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

const updateStats = async () => {
  try {
    // 전체 통계 조회
    const [totalResult, confirmedResult, pendingResult, cancelledResult] = await Promise.all([
      getAllReservations({ limit: 1 }),
      getAllReservations({ status: 'confirmed', limit: 1 }),
      getAllReservations({ status: 'pending', limit: 1 }),
      getAllReservations({ status: 'cancelled', limit: 1 })
    ])

    stats.value = {
      total: totalResult.total || 0,
      confirmed: confirmedResult.total || 0,
      pending: pendingResult.total || 0,
      cancelled: cancelledResult.total || 0
    }
  } catch (error) {
    console.error('통계 업데이트 오류:', error)
  }
}

const updateStatus = async (reservationId, newStatus) => {
  try {
    const result = await updateReservationStatus(reservationId, newStatus)
    if (result.success) {
      alert('예약 상태가 업데이트되었습니다.')
      loadReservations() // 목록 새로고침
    } else {
      alert('상태 업데이트에 실패했습니다: ' + result.error)
    }
  } catch (error) {
    console.error('상태 업데이트 오류:', error)
    alert('상태 업데이트 중 오류가 발생했습니다.')
  }
}

const viewDetail = (reservationId) => {
  router.push(`/admin/reservations/${reservationId}`)
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    pagination.value.page = newPage
    loadReservations()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString.split('T')[0].replace(/-/g, '/')
}

const calculateTotal = (reservation) => {
  return (reservation.product?.adult_price || 0) * (reservation.adult_count || 0) + 
         (reservation.product?.child_price || 0) * (reservation.child_count || 0)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

const getStatusText = (status) => {
  const statusMap = {
    'confirmed': '예약확정',
    'pending': '예약대기',
    'cancelled': '예약취소'
  }
  return statusMap[status] || status
}

// 라이프사이클
onMounted(() => {
  loadReservations()
})
</script>

<style scoped>
.reservations {
  max-width: 1200px;
  margin: 0 auto;
}

/* 필터 섹션 */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.search-group {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.search-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background: #2563eb;
}

/* 통계 카드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 예약 섹션 */
.reservations-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
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

.loading-container p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* 예약 테이블 */
.reservations-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

td {
  font-size: 0.875rem;
  color: #1f2937;
}

.product-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.child-count {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.amount {
  font-weight: 600;
  color: #059669;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-detail {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-detail:hover {
  background: #f3f4f6;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  background: white;
}

/* 예약이 없을 때 */
.no-reservations {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .reservations-table {
    font-size: 0.75rem;
  }
  
  th, td {
    padding: 0.5rem 0.25rem;
  }
}
</style> 