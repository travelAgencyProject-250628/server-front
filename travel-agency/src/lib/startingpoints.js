import { supabase } from './supabase.js'

/**
 * 출발지 목록 조회 (모든 출발지)
 * @returns {Promise<{success: boolean, startingPoints: Array, error?: string}>}
 */
export async function getStartingPoints() {
  try {
    const { data, error } = await supabase
      .from('StartingPoints')
      .select('id, name')
      .order('id', { ascending: true })
    if (error) throw error
    return { success: true, startingPoints: data }
  } catch (error) {
    return { success: false, startingPoints: [], error: error.message }
  }
}

/**
 * 특정 상품의 출발지 목록 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise<{success: boolean, startingPoints: Array, error?: string}>}
 */
export async function getProductStartingPoints(productId) {
  try {
    const { data, error } = await supabase
      .from('ProductStartingPoints')
      .select(`
        starting_point_id,
        time,
        startingPoint:starting_point_id(id, name)
      `)
      .eq('product_id', productId)
      .order('time', { ascending: true })
    
    if (error) throw error
    
    // 데이터 구조 변환
    const startingPoints = data.map(item => ({
      id: item.startingPoint.id,
      name: item.startingPoint.name,
      time: item.time
    }))
    
    return { success: true, startingPoints }
  } catch (error) {
    return { success: false, startingPoints: [], error: error.message }
  }
} 