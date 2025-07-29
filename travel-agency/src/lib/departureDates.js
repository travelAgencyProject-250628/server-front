import { supabase } from './supabase.js'

/**
 * 특정 상품의 날짜 범위 내 출발 가능한 날짜들을 조회합니다.
 * @param {number} productId - 상품 ID
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD 형식)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<{success: boolean, departureDates: Array, error?: string}>}
 */
export const getProductDepartureDatesInRange = async (productId, startDate, endDate) => {
  try {
    console.log('🗓️ 출발 가능 날짜 조회 시작:', { productId, startDate, endDate })
    
    const { data, error } = await supabase
      .from('ProductDepartureDates')
      .select('departure_date, status')
      .eq('product_id', productId)
      .gte('departure_date', startDate)
      .lte('departure_date', endDate)
      .order('departure_date', { ascending: true })
    
    if (error) {
      console.error('출발 가능 날짜 조회 오류:', error)
      return {
        success: false,
        departureDates: [],
        error: error.message
      }
    }
    
    console.log('🗓️ 출발 가능 날짜 조회 완료:', data)
    
    return {
      success: true,
      departureDates: data || []
    }
    
  } catch (error) {
    console.error('출발 가능 날짜 조회 실패:', error)
    return {
      success: false,
      departureDates: [],
      error: error.message
    }
  }
}

/**
 * 특정 상품의 모든 출발 가능한 날짜들을 조회합니다.
 * @param {number} productId - 상품 ID
 * @returns {Promise<{success: boolean, departureDates: Array, error?: string}>}
 */
export const getAllProductDepartureDates = async (productId) => {
  try {
    console.log('🗓️ 전체 출발 가능 날짜 조회 시작:', productId)
    
    const { data, error } = await supabase
      .from('ProductDepartureDates')
      .select('departure_date, status')
      .eq('product_id', productId)
      .order('departure_date', { ascending: true })
    
    if (error) {
      console.error('전체 출발 가능 날짜 조회 오류:', error)
      return {
        success: false,
        departureDates: [],
        error: error.message
      }
    }
    
    console.log('🗓️ 전체 출발 가능 날짜 조회 완료:', data)
    
    return {
      success: true,
      departureDates: data || []
    }
    
  } catch (error) {
    console.error('전체 출발 가능 날짜 조회 실패:', error)
    return {
      success: false,
      departureDates: [],
      error: error.message
    }
  }
}

/**
 * 특정 날짜가 해당 상품의 출발 가능한 날짜인지 확인합니다.
 * @param {number} productId - 상품 ID
 * @param {string} date - 확인할 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<{success: boolean, isAvailable: boolean, error?: string}>}
 */
export const checkDateAvailability = async (productId, date) => {
  try {
    console.log('🗓️ 날짜 가용성 확인:', { productId, date })
    
    const { data, error } = await supabase
      .from('ProductDepartureDates')
      .select('status')
      .eq('product_id', productId)
      .eq('departure_date', date)
      .single()
    
    if (error) {
      // 데이터가 없는 경우 (PGRST116) 는 정상적인 경우로 처리
      if (error.code === 'PGRST116') {
        console.log('🗓️ 해당 날짜는 출발 불가능:', date)
        return {
          success: true,
          isAvailable: false
        }
      }
      
      console.error('날짜 가용성 확인 오류:', error)
      return {
        success: false,
        isAvailable: false,
        error: error.message
      }
    }
    
    const isAvailable = data && data.status === true
    console.log('🗓️ 날짜 가용성 확인 완료:', { date, isAvailable })
    
    return {
      success: true,
      isAvailable
    }
    
  } catch (error) {
    console.error('날짜 가용성 확인 실패:', error)
    return {
      success: false,
      isAvailable: false,
      error: error.message
    }
  }
} 