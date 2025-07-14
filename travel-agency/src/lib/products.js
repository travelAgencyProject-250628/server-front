import { supabase } from './supabase.js'

/**
 * 인기 투어 상품 리스트를 가져온다. -> 6개만
 * @returns {Promise<{success: boolean, tours: Array, error?: string}>}
 */
export async function getPopularTours() {
  try {
    // Products에서 duration, location(id) 포함, location은 Locations 테이블과 조인
    const { data, error } = await supabase
      .from('Products')
      .select('id, title, subtitle, main_image_url, adult_price, child_price, duration, location_id:location_id(id, name), badge_id:badge_id(id, name)')
      .order('created_at', { ascending: false })
      .limit(6)
    if (error) throw error

    // 더미 데이터 형식에 맞게 매핑
    const tours = (data || []).map((item, idx) => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge_id?.name || '',
      image: item.main_image_url || ''
    }))

    return { success: true, tours }
  } catch (error) {
    return { success: false, tours: [], error: error.message }
  }
}

/**
 * 특정 상품 상세 정보 조회
 * @param {number} productId
 * @returns {Promise<{success: boolean, product?: object, error?: string}>}
 */
export async function getProductDetail(productId) {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select('id, title, subtitle, main_image_url, adult_price, child_price, duration, location:location_id(id, name), badge:badge_id(id, name)')
      .eq('id', productId)
      .single()
    if (error) throw error

    const product = {
      id: data.id,
      title: data.title || '',
      description: data.subtitle || '',
      duration: data.duration || '',
      location: data.location?.name || '',
      price: data.adult_price || 0,
      badge: data.badge?.name || '',
      image: data.main_image_url || ''
    }

    return { success: true, product }
  } catch (error) {
    return { success: false, error: error.message }
  }
} 