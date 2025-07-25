<template>
  <div class="dashboard">
    <!-- 통계 카드 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2-2v18h8zM2 21h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">
            <span v-if="loading" class="loading-dots">...</span>
            <span v-else>{{ formatNumber(stats.totalProducts) }}</span>
          </div>
          <div class="stat-label">총 상품</div>
        </div>
      </div>
      
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
          <div class="stat-number">
            <span v-if="loading" class="loading-dots">...</span>
            <span v-else>{{ formatNumber(stats.totalReservations) }}</span>
          </div>
          <div class="stat-label">총 예약</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">
            <span v-if="loading" class="loading-dots">...</span>
            <span v-else>{{ formatNumber(stats.activeProducts) }}</span>
          </div>
          <div class="stat-label">활성 상품</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">
            <span v-if="loading" class="loading-dots">...</span>
            <span v-else>{{ formatNumber(stats.totalUsers) }}</span>
          </div>
          <div class="stat-label">총 고객</div>
        </div>
      </div>
    </div>
    
    <!-- 차트 섹션 -->
    <div class="charts-section">
      <div class="chart-grid">
        <!-- 주간 유저 차트 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>주간 유저</h3>
            <select v-model="selectedWeek" @change="updateChartData">
              <option value="current">이번 주</option>
              <option value="last">지난 주</option>
            </select>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-wrapper">
                <div class="chart-bars">
                  <div 
                    v-for="(value, index) in chartData.users.data" 
                    :key="`${selectedWeek}-${index}`"
                    class="chart-bar"
                    :style="{ height: `${(value / Math.max(...chartData.users.data, 1)) * 100}%` }"
                  >
                    <span class="bar-value">{{ value }}</span>
                  </div>
                </div>
                <div class="chart-labels-user">
                  <span v-for="label in chartData.users.labels" :key="label">{{ label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 주간 예약 차트 -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>주간 예약</h3>
            <select v-model="selectedBookingWeek" @change="updateBookingChartData">
              <option value="current">이번 주</option>
              <option value="last">지난 주</option>
            </select>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-wrapper">
                <svg class="line-chart" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 200px;">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.1" />
                    </linearGradient>
                  </defs>
                  <!-- 그리드 라인 -->
                  <g class="grid-lines">
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#e5e7eb" stroke-width="1"/>
                    <line x1="0" y1="160" x2="400" y2="160" stroke="#e5e7eb" stroke-width="1"/>
                  </g>
                  <!-- 영역 채우기 -->
                  <path 
                    :d="getBookingAreaPath()" 
                    fill="url(#lineGradient)"
                  />
                  <!-- 선 -->
                  <path 
                    :d="getBookingLinePath()" 
                    stroke="#10b981" 
                    stroke-width="3" 
                    fill="none"
                  />
                  <!-- 포인트 -->
                  <g class="data-points">
                    <circle 
                      v-for="(value, index) in chartData.bookings.data" 
                      :key="index"
                      :cx="getBookingXPosition(index)"
                      :cy="getBookingYPosition(value)"
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      stroke-width="2"
                    />
                  </g>
                </svg>
                <div class="chart-labels-booking">
                  <span v-for="label in chartData.bookings.labels" :key="label">{{ label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 최근 예약 목록 -->
    <div class="recent-section">
      <div class="section-header">
        <h3>최근 예약</h3>
        <router-link to="/admin/reservations" class="view-all-btn">
          전체 보기 →
        </router-link>
      </div>
      
      <div class="recent-table">
        <table>
          <thead>
            <tr>
              <th>예약번호</th>
              <th>고객명</th>
              <th>상품명</th>
              <th>예약일</th>
              <th>금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in recentReservations" :key="reservation.id">
              <td>{{ reservation.id }}</td>
              <td>{{ reservation.customerName }}</td>
              <td class="product-name">{{ reservation.productName }}</td>
              <td>{{ formatDate(reservation.reservationDate) }}</td>
              <td>{{ formatNumber(reservation.amount) }}원</td>
              <td>
                <span :class="['status', `status-${reservation.status}`]">
                  {{ getStatusText(reservation.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getDashboardStats, getWeeklyUserStats, getWeeklyBookingStats } from '@/lib/stats.js'
import { getRecentReservations } from '@/lib/reservations.js'

// 반응형 데이터
const selectedWeek = ref('current')
const selectedBookingWeek = ref('current')
const userChart = ref(null)
const loading = ref(false)

// 통계 데이터
const stats = ref({
  totalProducts: 0,
  totalReservations: 0,
  activeProducts: 0,
  totalUsers: 0
})

// 최근 예약 데이터
const recentReservations = ref([])

// 차트 데이터
const chartData = ref({
  users: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    data: [0, 0, 0, 0, 0, 0, 0]
  },
  bookings: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    data: [0, 0, 0, 0, 0, 0, 0]
  }
})

// 메서드
const loadStats = async () => {
  loading.value = true
  try {
    const [statsResult, weeklyUserResult, weeklyBookingResult] = await Promise.all([
      getDashboardStats(),
      getWeeklyUserStats(),
      getWeeklyBookingStats()
    ])
    
    if (statsResult.success) {
      stats.value = {
        totalProducts: statsResult.stats.products.total,
        totalReservations: statsResult.stats.reservations.total,
        activeProducts: statsResult.stats.products.active,
        totalUsers: statsResult.stats.customers.total
      }
    } else {
      console.error('통계 데이터 로드 실패:', statsResult.error)
    }
    
    if (weeklyUserResult.success) {
      // 현재 주 데이터로 초기화
      chartData.value.users.data = weeklyUserResult.weeklyData.currentWeek.daily
    } else {
      console.error('주간 유저 데이터 로드 실패:', weeklyUserResult.error)
    }
    
    if (weeklyBookingResult.success) {
      // 현재 주 데이터로 초기화
      chartData.value.bookings.data = weeklyBookingResult.weeklyData.currentWeek.daily
    } else {
      console.error('주간 예약 데이터 로드 실패:', weeklyBookingResult.error)
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error)
  } finally {
    loading.value = false
  }
}

// 최근 예약 데이터 로드
const loadRecentReservations = async () => {
  try {
    const result = await getRecentReservations(8)
    
    if (result.success) {
      recentReservations.value = result.reservations
      console.log('최근 예약 데이터 로드 완료:', recentReservations.value.length, '개')
    } else {
      console.error('최근 예약 데이터 로드 오류:', result.error)
    }
  } catch (error) {
    console.error('최근 예약 데이터 로드 오류:', error)
  }
}

const formatNumber = (num) => {
  return num.toLocaleString()
}



const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR')
}

const getStatusText = (status) => {
  const statusMap = {
    confirmed: '예약확정',
    pending: '예약대기',
    cancelled: '예약취소',
    completed: '여행완료'
  }
  return statusMap[status] || status
}

// 차트 생성 (간단한 CSS 차트로 구현)
const createCharts = () => {
  // 실제 환경에서는 Chart.js 등의 라이브러리를 사용
  // 여기서는 간단한 CSS 바 차트로 구현
  console.log('차트 생성 완료')
}

const updateChartData = async () => {
  // 주 변경 시 차트 데이터 업데이트
  try {
    const result = await getWeeklyUserStats()
    if (result.success) {
      if (selectedWeek.value === 'current') {
        chartData.value.users.data = [...result.weeklyData.currentWeek.daily]
      } else {
        chartData.value.users.data = [...result.weeklyData.lastWeek.daily]
      }
      console.log('유저 차트 데이터 업데이트:', chartData.value.users.data)
    }
  } catch (error) {
    console.error('주간 데이터 업데이트 오류:', error)
  }
}

const updateBookingChartData = async () => {
  // 주 변경 시 예약 차트 데이터 업데이트
  try {
    const result = await getWeeklyBookingStats()
    if (result.success) {
      if (selectedBookingWeek.value === 'current') {
        chartData.value.bookings.data = [...result.weeklyData.currentWeek.daily]
      } else {
        chartData.value.bookings.data = [...result.weeklyData.lastWeek.daily]
      }
      console.log('예약 차트 데이터 업데이트:', chartData.value.bookings.data)
    }
  } catch (error) {
    console.error('주간 예약 데이터 업데이트 오류:', error)
  }
}

// 예약 차트 SVG 경로 생성 함수들
const getBookingXPosition = (index) => {
  const width = 400
  const padding = 40
  const availableWidth = width - (padding * 2)
  const stepWidth = availableWidth / 6
  return padding + stepWidth * index
}

const getBookingYPosition = (value) => {
  const height = 200
  const padding = 40
  const availableHeight = height - (padding * 2)
  const maxValue = Math.max(...chartData.value.bookings.data, 1)
  return height - padding - (value / maxValue) * availableHeight
}

const getBookingLinePath = () => {
  const points = chartData.value.bookings.data.map((value, index) => {
    const x = getBookingXPosition(index)
    const y = getBookingYPosition(value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  })
  return points.join(' ')
}

const getBookingAreaPath = () => {
  const points = chartData.value.bookings.data.map((value, index) => {
    const x = getBookingXPosition(index)
    const y = getBookingYPosition(value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  })
  const lastX = getBookingXPosition(chartData.value.bookings.data.length - 1)
  const firstX = getBookingXPosition(0)
  return `${points.join(' ')} L ${lastX} 160 L ${firstX} 160 Z`
}

// 라이프사이클
onMounted(() => {
  loadStats()
  loadRecentReservations()
  nextTick(() => {
    createCharts()
  })
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
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

/* 로딩 애니메이션 */
.loading-dots {
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80%, 100% {
    opacity: 0;
  }
}

/* 차트 섹션 */
.charts-section {
  margin-bottom: 2rem;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-header select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.chart-container {
  height: 300px;
  background: #f9fafb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  box-sizing: border-box;
}

.chart-wrapper {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 0;
  height: 200px;
  margin-bottom: 1rem;
  justify-content: space-between;
  width: 100%;
}

.chart-bar {
  width: 40px;
  background: #3b82f6;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 4px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.chart-bar:hover {
  background: #2563eb;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.chart-labels-user {
  display: flex;
  gap: 0;
  width: 100%;
  justify-content: space-between;
  padding-left: 14px;
  padding-right: 14px;
}

.chart-labels-booking {
  display: flex;
  gap: 0;
  width: 100%;
  justify-content: space-between;
  padding-left: 35px;
  padding-right: 35px;
}

.chart-labels span {
  width: 53.33px;
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
}

/* 최근 예약 섹션 */
.recent-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.view-all-btn {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}

/* 테이블 */
.recent-table {
  overflow-x: auto;
}

.recent-table table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th,
.recent-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.recent-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.recent-table td {
  color: #1f2937;
  font-size: 0.875rem;
}

.product-name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 상태 표시 */
.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-confirmed {
  background: #dcfce7;
  color: #16a34a;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.status-completed {
  background: #dbeafe;
  color: #2563eb;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    padding: 1rem;
  }
  
  .chart-container {
    height: 200px;
  }
  
  .recent-section {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}</style> 