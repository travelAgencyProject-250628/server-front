import { supabase } from './supabase.js'

/**
 * 전체 통계 데이터 조회
 * @returns {Promise<{success: boolean, stats: object, error?: string}>}
 */
export async function getDashboardStats() {
  try {
    // 모든 통계를 병렬로 조회
    const [productStats, reservationStats, customerStats] = await Promise.all([
      getProductStats(),
      getReservationStats(),
      getCustomerStats()
    ])

    return {
      success: true,
      stats: {
        products: productStats,
        reservations: reservationStats,
        customers: customerStats
      }
    }
  } catch (error) {
    return {
      success: false,
      stats: {
        products: { total: 0, active: 0 },
        reservations: { total: 0, pending: 0, confirmed: 0 },
        customers: { total: 0, active: 0 }
      },
      error: error.message
    }
  }
}

/**
 * 상품 통계 데이터 조회
 * @returns {Promise<{total: number, active: number}>}
 */
async function getProductStats() {
  try {
    // 전체 상품 수
    const { count: total, error: totalError } = await supabase
      .from('Products')
      .select('*', { count: 'exact', head: true })
    
    if (totalError) throw totalError
    
    // 활성 상품 수 (status가 true인 상품)
    const { count: active, error: activeError } = await supabase
      .from('Products')
      .select('*', { count: 'exact', head: true })
      .eq('status', true)
    
    if (activeError) throw activeError
    
    return { 
      total: total || 0, 
      active: active || 0 
    }
  } catch (error) {
    console.error('상품 통계 조회 오류:', error)
    return { total: 0, active: 0 }
  }
}

/**
 * 예약 통계 데이터 조회
 * @returns {Promise<{total: number, pending: number, confirmed: number}>}
 */
async function getReservationStats() {
  try {
    // 전체 예약 수
    const { count: total, error: totalError } = await supabase
      .from('Bookings')
      .select('*', { count: 'exact', head: true })
    
    if (totalError) throw totalError
    
    // 대기 중인 예약 수
    const { count: pending, error: pendingError } = await supabase
      .from('Bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', '대기')
    
    if (pendingError) throw pendingError
    
    // 확정된 예약 수
    const { count: confirmed, error: confirmedError } = await supabase
      .from('Bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', '예약확정')
    
    if (confirmedError) throw confirmedError
    
    return { 
      total: total || 0, 
      pending: pending || 0, 
      confirmed: confirmed || 0 
    }
  } catch (error) {
    console.error('예약 통계 조회 오류:', error)
    return { total: 0, pending: 0, confirmed: 0 }
  }
}

/**
 * 고객 통계 데이터 조회
 * @returns {Promise<{total: number, active: number}>}
 */
async function getCustomerStats() {
  try {
    // 전체 고객 수 (Users 테이블)
    const { count: total, error: totalError } = await supabase
      .from('Users')
      .select('*', { count: 'exact', head: true })
    
    if (totalError) throw totalError
    
    // 활성 고객 수 (예약이 1개 이상인 고객)
    const { data: activeCustomers, error: activeError } = await supabase
      .from('Bookings')
      .select('auth_id')
      .not('auth_id', 'is', null)
    
    if (activeError) throw activeError
    
    // 중복 제거하여 활성 고객 수 계산
    const uniqueActiveCustomers = new Set(
      (activeCustomers || []).map(booking => booking.auth_id)
    ).size
    
    return { 
      total: total || 0, 
      active: uniqueActiveCustomers || 0 
    }
  } catch (error) {
    console.error('고객 통계 조회 오류:', error)
    return { total: 0, active: 0 }
  }
} 

/**
 * 주간 유저 생성 데이터 조회
 * @returns {Promise<{success: boolean, weeklyData: object, error?: string}>}
 */
export async function getWeeklyUserStats() {
  try {
    const { currentWeekData, lastWeekData } = await getWeeklyUserData()
    
    return {
      success: true,
      weeklyData: {
        currentWeek: currentWeekData,
        lastWeek: lastWeekData
      }
    }
  } catch (error) {
    console.error('주간 유저 통계 조회 오류:', error)
    return {
      success: false,
      weeklyData: {
        currentWeek: { daily: [0, 0, 0, 0, 0, 0, 0], total: 0 },
        lastWeek: { daily: [0, 0, 0, 0, 0, 0, 0], total: 0 }
      },
      error: error.message
    }
  }
}

/**
 * 주간 유저 데이터 계산
 * @returns {Promise<{currentWeekData: object, lastWeekData: object}>}
 */
async function getWeeklyUserData() {
  // 현재 날짜 기준으로 주차 계산
  const now = new Date()
  const currentWeekStart = getWeekStart(now)
  const currentWeekEnd = new Date(currentWeekStart)
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6)
  
  const lastWeekStart = new Date(currentWeekStart)
  lastWeekStart.setDate(currentWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(currentWeekStart)
  lastWeekEnd.setDate(currentWeekStart.getDate() - 1)
  
  // 현재 주와 이전 주의 유저 데이터 조회
  const [currentWeekUsers, lastWeekUsers] = await Promise.all([
    getUsersByDateRange(currentWeekStart, currentWeekEnd),
    getUsersByDateRange(lastWeekStart, lastWeekEnd)
  ])
  
  // 일별 데이터로 변환
  const currentWeekData = convertToDailyData(currentWeekUsers, currentWeekStart)
  const lastWeekData = convertToDailyData(lastWeekUsers, lastWeekStart)
  
  return {
    currentWeekData,
    lastWeekData
  }
}

/**
 * 주간 활성 예약 데이터 조회
 * @returns {Promise<{success: boolean, weeklyData: object, error?: string}>}
 */
export async function getWeeklyBookingStats() {
  try {
    const { currentWeekData, lastWeekData } = await getWeeklyBookingData()
    
    return {
      success: true,
      weeklyData: {
        currentWeek: currentWeekData,
        lastWeek: lastWeekData
      }
    }
  } catch (error) {
    console.error('주간 예약 통계 조회 오류:', error)
    return {
      success: false,
      weeklyData: {
        currentWeek: { daily: [0, 0, 0, 0, 0, 0, 0], total: 0 },
        lastWeek: { daily: [0, 0, 0, 0, 0, 0, 0], total: 0 }
      },
      error: error.message
    }
  }
}

/**
 * 주간 예약 데이터 계산
 * @returns {Promise<{currentWeekData: object, lastWeekData: object}>}
 */
async function getWeeklyBookingData() {
  // 현재 날짜 기준으로 주차 계산
  const now = new Date()
  const currentWeekStart = getWeekStart(now)
  const currentWeekEnd = new Date(currentWeekStart)
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6)
  
  const lastWeekStart = new Date(currentWeekStart)
  lastWeekStart.setDate(currentWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(currentWeekStart)
  lastWeekEnd.setDate(currentWeekStart.getDate() - 1)
  
  // 현재 주와 이전 주의 예약 데이터 조회 (예약확정 상태만)
  const [currentWeekBookings, lastWeekBookings] = await Promise.all([
    getBookingsByDateRange(currentWeekStart, currentWeekEnd),
    getBookingsByDateRange(lastWeekStart, lastWeekEnd)
  ])
  
  // 일별 데이터로 변환
  const currentWeekData = convertToDailyBookingData(currentWeekBookings, currentWeekStart)
  const lastWeekData = convertToDailyBookingData(lastWeekBookings, lastWeekStart)
  
  return {
    currentWeekData,
    lastWeekData
  }
}

/**
 * 주의 시작일 (월요일) 계산
 * @param {Date} date 
 * @returns {Date}
 */
function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 월요일을 1로 설정
  return new Date(d.setDate(diff))
}

/**
 * 특정 날짜 범위의 유저 조회
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<Array>}
 */
async function getUsersByDateRange(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('날짜 범위 유저 조회 오류:', error)
    return []
  }
}

/**
 * 유저 데이터를 일별 데이터로 변환
 * @param {Array} users 
 * @param {Date} weekStart 
 * @returns {object}
 */
function convertToDailyData(users, weekStart) {
  const daily = [0, 0, 0, 0, 0, 0, 0] // 월~일
  
  users.forEach(user => {
    const userDate = new Date(user.created_at)
    const dayDiff = Math.floor((userDate - weekStart) / (1000 * 60 * 60 * 24))
    
    if (dayDiff >= 0 && dayDiff < 7) {
      daily[dayDiff]++
    }
  })
  
  return {
    daily,
    total: users.length
  }
} 

/**
 * 특정 날짜 범위의 예약 조회 (예약확정 상태만)
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<Array>}
 */
async function getBookingsByDateRange(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('Bookings')
      .select('created_at')
      .eq('status', '예약확정')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('날짜 범위 예약 조회 오류:', error)
    return []
  }
}

/**
 * 예약 데이터를 일별 데이터로 변환
 * @param {Array} bookings 
 * @param {Date} weekStart 
 * @returns {object}
 */
function convertToDailyBookingData(bookings, weekStart) {
  const daily = [0, 0, 0, 0, 0, 0, 0] // 월~일
  
  bookings.forEach(booking => {
    const bookingDate = new Date(booking.created_at)
    const dayDiff = Math.floor((bookingDate - weekStart) / (1000 * 60 * 60 * 24))
    
    if (dayDiff >= 0 && dayDiff < 7) {
      daily[dayDiff]++
    }
  })
  
  return {
    daily,
    total: bookings.length
  }
} 