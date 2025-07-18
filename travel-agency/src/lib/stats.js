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