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

/**
 * 출발지 추가
 * @param {string} name - 출발지명
 * @returns {Promise<{success: boolean, startingPoint?: Object, error?: string}>}
 */
export async function createStartingPoint(name) {
  try {
    const { data, error } = await supabase
      .from('StartingPoints')
      .insert([{ name }])
      .select()
    
    if (error) throw error
    
    return { success: true, startingPoint: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 출발지 수정
 * @param {number} id - 출발지 ID
 * @param {string} name - 새로운 출발지명
 * @returns {Promise<{success: boolean, startingPoint?: Object, error?: string}>}
 */
export async function updateStartingPoint(id, name) {
  try {
    const { data, error } = await supabase
      .from('StartingPoints')
      .update({ name })
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return { success: true, startingPoint: data[0] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 출발지 삭제
 * @param {number} id - 출발지 ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteStartingPoint(id) {
  try {
    // 먼저 해당 출발지가 상품에 연결되어 있는지 확인
    const { data: productStartingPoints, error: checkError } = await supabase
      .from('ProductStartingPoints')
      .select('id')
      .eq('starting_point_id', id)
    
    if (checkError) throw checkError
    
    // 연결된 상품이 있으면 삭제 불가
    if (productStartingPoints && productStartingPoints.length > 0) {
      return { 
        success: false, 
        error: '이 출발지는 상품에 연결되어 있어 삭제할 수 없습니다. 먼저 상품에서 연결을 해제해주세요.' 
      }
    }
    
    // 출발지 삭제
    const { error } = await supabase
      .from('StartingPoints')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
} 