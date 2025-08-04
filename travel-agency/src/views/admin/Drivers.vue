<template>
  <div class="drivers" @click="handlePageClick">
    <!-- 필터 및 검색 -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="status-filter">상태별 필터:</label>
        <select id="status-filter" v-model="filters.status">
          <option value="">전체</option>
          <option value="pending">승인 대기</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거부됨</option>
        </select>
      </div>

      <div class="search-group">
        <div class="search-input-wrapper">
          <input 
            ref="searchInputRef"
            type="text" 
            v-model="searchQuery" 
            placeholder="기사명, 소속, 차량번호로 검색"
            @keyup.enter="performSearch"
            @input="handleSearchInput"
            @focus="showSearchHistory = true"
            @blur="setTimeout(() => showSearchHistory = false, 200)"
            class="search-input"
          >
          <button @click="performSearch" class="search-btn">검색</button>
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-btn" 
            title="검색어 지우기"
          >
            ✕
          </button>
        </div>
        
        <!-- 검색 히스토리 -->
        <div v-if="showSearchHistory && searchHistory.length > 0" class="search-history" @click.stop>
          <div class="history-header">
            <span>최근 검색어</span>
            <button @click="searchHistory = []" class="clear-history-btn">전체 삭제</button>
          </div>
          <div 
            v-for="query in searchHistory" 
            :key="query"
            @click="selectFromHistory(query)"
            class="history-item"
          >
            <span class="history-icon">🔍</span>
            <span class="history-text">{{ query }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">전체 기사</div>
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
          <div class="stat-label">승인 대기</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.approved }}</div>
          <div class="stat-label">승인됨</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.rejected }}</div>
          <div class="stat-label">거부됨</div>
        </div>
      </div>
    </div>

    <!-- 기사 목록 -->
    <div class="drivers-section">
      <div class="section-header">
        <h3>기사 목록</h3>
        <div class="header-actions">
          <button 
            @click="downloadExcel" 
            class="download-btn"
            :disabled="filteredDrivers.length === 0"
            title="엑셀 다운로드"
          >
            📊 엑셀 다운로드
          </button>
          <div class="pagination-info">
            총 {{ paginationInfo.total }}건 중 {{ paginationInfo.startIndex + 1 }}-{{ paginationInfo.endIndex }}건
          </div>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>기사 정보를 불러오는 중...</p>
      </div>

      <!-- 기사 테이블 -->
      <div v-else-if="filteredDrivers.length > 0" class="drivers-table">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>가입일</th>
              <th>기사명</th>
              <th>이메일</th>
              <th>연락처</th>
              <th>소속</th>
              <th>차량번호</th>
              <th>차종</th>
              <th>년식</th>
              <th>정원</th>
              <th>차고지</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
                         <tr v-for="driver in paginatedDrivers" :key="driver.id">
               <td>{{ driver.id }}</td>
               <td>{{ formatDate(driver.created_at) }}</td>
               <td v-html="highlightText(driver.name, searchQuery)" :title="driver.name"></td>
               <td :title="driver.email">{{ driver.email }}</td>
               <td :title="driver.mobile_number">{{ driver.mobile_number }}</td>
               <td v-html="highlightText(driver.driver_company, searchQuery)" :title="driver.driver_company"></td>
               <td v-html="highlightText(driver.driver_vehicle_number, searchQuery)" :title="driver.driver_vehicle_number"></td>
               <td :title="driver.driver_vehicle_type">{{ driver.driver_vehicle_type }}</td>
               <td>{{ driver.driver_vehicle_year }}</td>
               <td>{{ driver.driver_passenger_capacity }}인승</td>
               <td :title="driver.driver_garage_address">{{ driver.driver_garage_address }}</td>
               <td>
                 <span :class="['status', `status-${getDriverStatus(driver)}`]">
                   {{ getStatusText(driver) }}
                 </span>
               </td>
               <td>
                 <div class="action-buttons">
                   <button 
                     @click="viewDetail(driver.id)" 
                     class="btn-detail"
                     title="상세보기"
                   >
                     상세보기
                   </button>
                   <select 
                     v-model="driver.driver_approved" 
                     @change="updateDriverStatus(driver.id, driver.driver_approved, driver.driver_active)"
                     class="status-select"
                   >
                     <option :value="false">승인 대기</option>
                     <option :value="true">승인됨</option>
                   </select>
                   <button 
                     @click="toggleDriverActive(driver.id, !driver.driver_active)" 
                     :class="['btn-toggle', driver.driver_active ? 'btn-deactivate' : 'btn-activate']"
                     :title="driver.driver_active ? '비활성화' : '활성화'"
                   >
                     {{ driver.driver_active ? '비활성화' : '활성화' }}
                   </button>
                 </div>
               </td>
             </tr>
          </tbody>
        </table>
      </div>

      <!-- 기사가 없을 때 -->
      <div v-else class="no-drivers">
        <p>조회된 기사가 없습니다.</p>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="Math.ceil(paginationInfo.total / pagination.limit) > 1" class="pagination">
        <button 
          @click="changePage(pagination.page - 1)" 
          :disabled="pagination.page <= 1"
          class="page-btn"
        >
          이전
        </button>
        
        <span class="page-info">
          {{ pagination.page }} / {{ Math.ceil(paginationInfo.total / pagination.limit) }}
        </span>
        
        <button 
          @click="changePage(pagination.page + 1)" 
          :disabled="pagination.page >= Math.ceil(paginationInfo.total / pagination.limit)"
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
import { supabase } from '@/lib/supabase.js'
import * as XLSX from 'xlsx'

const router = useRouter()

// 반응형 데이터
const loading = ref(false)
const drivers = ref([])
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

// 검색 관련 데이터
const searchQuery = ref('')
const searchTimeout = ref(null)
const searchHistory = ref([])
const showSearchHistory = ref(false)
const searchInputRef = ref(null)

// 통계 데이터
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

// 계산된 속성
const filteredDrivers = computed(() => {
  let filtered = drivers.value

  // 검색어 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(driver => {
      const name = (driver.name || '').toLowerCase()
      const company = (driver.driver_company || '').toLowerCase()
      const vehicleNumber = (driver.driver_vehicle_number || '').toLowerCase()
      return name.includes(query) || company.includes(query) || vehicleNumber.includes(query)
    })
  }

  // 상태 필터링
  if (filters.value.status) {
    switch (filters.value.status) {
      case 'pending':
        filtered = filtered.filter(driver => !driver.driver_approved && driver.driver_active)
        break
      case 'approved':
        filtered = filtered.filter(driver => driver.driver_approved && driver.driver_active)
        break
      case 'rejected':
        filtered = filtered.filter(driver => !driver.driver_approved && !driver.driver_active)
        break
    }
  }

  return filtered
})

const paginationInfo = computed(() => {
  const total = filteredDrivers.value.length
  const startIndex = (pagination.value.page - 1) * pagination.value.limit
  const endIndex = Math.min(startIndex + pagination.value.limit, total)
  return { total, startIndex, endIndex }
})

const paginatedDrivers = computed(() => {
  const startIndex = paginationInfo.value.startIndex
  const endIndex = paginationInfo.value.endIndex
  return filteredDrivers.value.slice(startIndex, endIndex)
})

// 기사 목록 가져오기
const fetchDrivers = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('is_driver', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('기사 목록 조회 실패:', error)
      throw error
    }
    
    drivers.value = data || []
    updateStats()
    
  } catch (error) {
    console.error('기사 목록 조회 오류:', error)
    alert('기사 목록을 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// 통계 업데이트
const updateStats = () => {
  const total = drivers.value.length
  const pending = drivers.value.filter(d => !d.driver_approved && d.driver_active).length
  const approved = drivers.value.filter(d => d.driver_approved && d.driver_active).length
  const rejected = drivers.value.filter(d => !d.driver_approved && !d.driver_active).length
  
  stats.value = { total, pending, approved, rejected }
}

// 기사 상태 가져오기
const getDriverStatus = (driver) => {
  if (!driver.driver_approved && driver.driver_active) return 'pending'
  if (driver.driver_approved && driver.driver_active) return 'approved'
  if (!driver.driver_approved && !driver.driver_active) return 'rejected'
  return 'unknown'
}

// 상태 텍스트
const getStatusText = (driver) => {
  if (!driver.driver_approved && driver.driver_active) return '승인 대기'
  if (driver.driver_approved && driver.driver_active) return '승인됨'
  if (!driver.driver_approved && !driver.driver_active) return '거부됨'
  return '알 수 없음'
}

// 기사 상태 업데이트
const updateDriverStatus = async (driverId, approved, active) => {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ 
        driver_approved: approved,
        driver_active: active 
      })
      .eq('id', driverId)
    
    if (error) throw error
    
    // 로컬 데이터 업데이트
    const driver = drivers.value.find(d => d.id === driverId)
    if (driver) {
      driver.driver_approved = approved
      driver.driver_active = active
    }
    
    updateStats()
    
  } catch (error) {
    console.error('기사 상태 업데이트 실패:', error)
    alert('기사 상태 업데이트에 실패했습니다.')
  }
}

// 기사 활성화/비활성화 토글
const toggleDriverActive = async (driverId, active) => {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ driver_active: active })
      .eq('id', driverId)
    
    if (error) throw error
    
    // 로컬 데이터 업데이트
    const driver = drivers.value.find(d => d.id === driverId)
    if (driver) {
      driver.driver_active = active
    }
    
    updateStats()
    
  } catch (error) {
    console.error('기사 활성화 상태 변경 실패:', error)
    alert('기사 활성화 상태 변경에 실패했습니다.')
  }
}

// 기사 상세보기
const viewDetail = (driverId) => {
  router.push(`/admin/drivers/${driverId}`)
}

// 검색 관련 함수들
const performSearch = () => {
  if (searchQuery.value.trim()) {
    addToSearchHistory(searchQuery.value.trim())
  }
  pagination.value.page = 1
}

const handleSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    performSearch()
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  performSearch()
}

const addToSearchHistory = (query) => {
  if (!searchHistory.value.includes(query)) {
    searchHistory.value.unshift(query)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }
}

const selectFromHistory = (query) => {
  searchQuery.value = query
  performSearch()
}

// 페이지네이션
const changePage = (page) => {
  if (page >= 1 && page <= Math.ceil(paginationInfo.value.total / pagination.value.limit)) {
    pagination.value.page = page
  }
}

// 엑셀 다운로드
const downloadExcel = () => {
  const data = filteredDrivers.value.map(driver => ({
    '번호': driver.id,
    '가입일': formatDate(driver.created_at),
    '기사명': driver.name,
    '이메일': driver.email,
    '연락처': driver.mobile_number,
    '소속': driver.driver_company,
    '차량번호': driver.driver_vehicle_number,
    '차종': driver.driver_vehicle_type,
    '년식': driver.driver_vehicle_year,
    '정원': `${driver.driver_passenger_capacity}인승`,
    '차고지': driver.driver_garage_address,
    '상태': getStatusText(driver)
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '기사목록')
  
  const fileName = `기사목록_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// 유틸리티 함수들
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

const highlightText = (text, query) => {
  if (!text || !query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const handlePageClick = () => {
  showSearchHistory.value = false
}

// 초기 로드
onMounted(() => {
  fetchDrivers()
})
</script>

<style scoped>
.drivers {
  width: 1000px;
  padding: 2rem;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

/* 필터 섹션 */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
  font-size: 0.9rem;
  min-width: 150px;
}

.search-group {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  background: white;
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
}

.clear-btn {
  position: absolute;
  right: 3rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.25rem;
}

/* 검색 히스토리 */
.search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.clear-history-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--bg-light);
}

.history-icon {
  font-size: 0.8rem;
}

.history-text {
  font-size: 0.9rem;
  color: var(--text-primary);
}

/* 통계 카드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  color: var(--primary-color);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 기사 목록 섹션 */
.drivers-section {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.download-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.download-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 테이블 */
.drivers-table {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
}

.drivers-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1500px; /* 최소 너비 증가 */
}

.drivers-table th,
.drivers-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* 최대 너비 제한 감소 */
}

/* 관리 컬럼은 더 넓게 */
.drivers-table th:last-child,
.drivers-table td:last-child {
  max-width: 250px;
  min-width: 200px;
}

.drivers-table th {
  background: var(--bg-light);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.drivers-table td {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.drivers-table tr:hover {
  background: var(--bg-light);
}

/* 긴 텍스트를 위한 툴팁 */
.drivers-table td[title] {
  cursor: help;
}

/* 상태 스타일 */
.status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: nowrap; /* 버튼들이 줄바꿈되지 않도록 */
  min-width: 200px; /* 최소 너비 보장 */
}

.btn-detail {
  padding: 0.25rem 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
  font-size: 0.8rem;
  min-width: 100px;
}

.btn-toggle {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-activate {
  background: #10b981;
  color: white;
}

.btn-deactivate {
  background: #ef4444;
  color: white;
}

/* 빈 상태 */
.no-drivers {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 하이라이트 */
mark {
  background: #fef3c7;
  color: #92400e;
  padding: 0.1rem 0.2rem;
  border-radius: 0.2rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .drivers {
    padding: 1rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    min-width: auto;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .drivers-table {
    font-size: 0.8rem;
  }
  
  .drivers-table th,
  .drivers-table td {
    padding: 0.5rem;
  }
}
</style> 