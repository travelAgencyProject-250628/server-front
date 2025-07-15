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
 * 특정 상품 상세 정보 조회 (프론트 요구 mockData 구조)
 * @param {number} productId
 * @returns {Promise<{success: boolean, product?: object, error?: string}>}
 */
export async function getProductDetail(productId) {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        subtitle,
        main_image_url,
        product_code,
        product_number,
        duration,
        event_content,
        adult_price,
        child_price,
        included_items,
        excluded_items,
        category:category_id(id, name)
      `)
      .eq('id', productId)
      .single()
    if (error) throw error

    const product = {
      id: data.id,
      category: data.category?.name || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      mainImage: data.main_image_url || '',
      productCode: data.product_code || '',
      productNumber: data.product_number || '',
      travelDuration: data.duration || '',
      eventContent: data.event_content || '',
      adultPrice: data.adult_price || 0,
      childPrice: data.child_price || 0,
      includedItems: data.included_items || '',
      excludedItems: data.excluded_items || '',
      meetingPoint: '', // Products 테이블에 meeting_point 없음. 필요시 location 조인 등으로 확장 가능
      images: data.main_image_url ? [data.main_image_url] : []
    }

    return { success: true, product }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 특정 카테고리의 상품 전체 조회
 * @param {number} categoryId
 * @returns {Promise<{success: boolean, products: Array, error?: string}>}
 */
export async function getProductsByCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select('id, title, subtitle, main_image_url, adult_price, child_price, duration, location:location_id(id, name), badge:badge_id(id, name)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    if (error) throw error

    const products = (data || []).map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge?.name || '',
      image: item.main_image_url || ''
    }))

    return { success: true, products }
  } catch (error) {
    return { success: false, products: [], error: error.message }
  }
}

/**
 * 상품 검색 API
 * @param {string} keyword
 * @returns {Promise<{success: boolean, products: Array, error?: string}>}
 */
export async function searchProducts(keyword) {
  try {
    // 1차: Products의 텍스트 필드만 or 검색
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        subtitle,
        main_image_url,
        adult_price,
        child_price,
        duration,
        event_content,
        location:location_id(id, name),
        badge:badge_id(id, name)
      `)
      .or([
        `title.ilike.%${keyword}%`,
        `subtitle.ilike.%${keyword}%`,
        `event_content.ilike.%${keyword}%`,
        `duration.ilike.%${keyword}%`
      ].join(','))

    if (error) throw error

    // 2차: location.name도 프론트에서 필터링
    const products = (data || []).filter(item =>
      item.location?.name?.includes(keyword) ||
      item.title?.includes(keyword) ||
      item.subtitle?.includes(keyword) ||
      item.event_content?.includes(keyword) ||
      item.duration?.includes(keyword)
    ).map(item => ({
      id: item.id,
      title: item.title || '',
      description: item.subtitle || '',
      duration: item.duration || '',
      location: item.location?.name || '',
      price: item.adult_price || 0,
      badge: item.badge?.name || '',
      image: item.main_image_url || ''
    }))

    return { success: true, products }
  } catch (error) {
    return { success: false, products: [], error: error.message }
  }
} 