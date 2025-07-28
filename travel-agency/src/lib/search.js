import { supabase } from './supabase.js'

/**
 * 상품 검색 API (기본)
 * @param {string} query - 검색어
 * @param {number} page - 페이지 번호 (기본값: 1)
 * @param {number} limit - 페이지당 항목 수 (기본값: 12)
 * @returns {Promise<{success: boolean, products: Array, total: number, error?: string}>}
 */
export async function searchProducts(query, page = 1, limit = 12) {
  console.log('🔍 searchProducts 함수 호출됨:', { query, page, limit })
  
  try {
    if (!query || query.trim() === '') {
      console.log('❌ 검색어가 비어있음')
      return {
        success: false,
        products: [],
        total: 0,
        error: '검색어를 입력해주세요.'
      }
    }

    const searchTerm = query.trim()
    const offset = (page - 1) * limit

    console.log('🔍 검색 시작:', { searchTerm, page, limit, offset })

    // 상품명과 부제목으로 검색
    console.log('🔍 Supabase 쿼리 실행 중...')
    const { data: products, error, count } = await supabase
      .from('Products')
      .select(`
        *,
        Categories(name)
      `, { count: 'exact' })
      .or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`)
      .or('status.is.null,status.eq.true')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    console.log('🔍 Supabase 응답:', { products: products?.length || 0, error, count })

    if (error) {
      console.error('❌ 상품 검색 오류:', error)
      return {
        success: false,
        products: [],
        total: 0,
        error: '검색 중 오류가 발생했습니다.'
      }
    }

    console.log('✅ 검색 완료:', products?.length || 0, '개')

    return {
      success: true,
      products: products || [],
      total: count || 0
    }
  } catch (error) {
    console.error('상품 검색 예외:', error)
    return {
      success: false,
      products: [],
      total: 0,
      error: '검색 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 상품 검색 API (필터링 포함)
 * @param {string} query - 검색어
 * @param {Object} filters - 필터 옵션
 * @param {number} page - 페이지 번호 (기본값: 1)
 * @param {number} limit - 페이지당 항목 수 (기본값: 12)
 * @returns {Promise<{success: boolean, products: Array, total: number, error?: string}>}
 */
export async function searchProductsWithFilters(query, filters = {}, page = 1, limit = 12) {
  console.log('🔍 searchProductsWithFilters 함수 호출됨:', { query, filters, page, limit })
  
  try {
    const searchTerm = query?.trim() || ''
    const offset = (page - 1) * limit

    console.log('🔍 필터링 검색 시작:', { searchTerm, filters, page, limit, offset })

    // 기본 쿼리 시작
    let queryBuilder = supabase
      .from('Products')
      .select(`
        *,
        Categories(name)
      `, { count: 'exact' })

    // 검색어가 있을 때만 검색어 필터링 적용
    if (searchTerm) {
      queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`)
    }

    // 카테고리 필터링
    if (filters.category && filters.category !== '') {
      queryBuilder = queryBuilder.eq('category_id', parseInt(filters.category))
    }

    // 여행 기간 필터링
    if (filters.duration && filters.duration !== '') {
      console.log('🔍 여행기간 필터링:', { 
        original: filters.duration, 
        type: typeof filters.duration 
      })
      queryBuilder = queryBuilder.eq('duration', filters.duration)
    }

    // 출발 확정 여행만 보기
    if (filters.fixTour) {
      queryBuilder = queryBuilder.eq('status', true)
    } else {
      // 기본적으로 활성 상품만
      queryBuilder = queryBuilder.or('status.is.null,status.eq.true')
    }

    // 정렬
    let sortColumn = 'created_at'
    let sortOrder = { ascending: false }

    switch (filters.sortType) {
      case 'price-high':
        sortColumn = 'adult_price'
        sortOrder = { ascending: false }
        break
      case 'price-low':
        sortColumn = 'adult_price'
        sortOrder = { ascending: true }
        break
      case 'popular':
      default:
        // 기본 정렬은 인기순 (예약 수 기준)
        queryBuilder = queryBuilder.order('created_at', { ascending: false }) // 기본 정렬
        // 예약 수 기준 정렬은 클라이언트에서 처리
        break
    }

    queryBuilder = queryBuilder.order(sortColumn, sortOrder)

    // 페이지네이션
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    console.log('🔍 Supabase 쿼리 실행 중...')
    console.log('🔍 최종 쿼리 조건:', { 
      searchTerm, 
      category: filters.category, 
      duration: filters.duration, 
      fixTour: filters.fixTour,
      sortType: filters.sortType,
      offset,
      limit
    })
    
    const { data: products, error, count } = await queryBuilder

    console.log('🔍 Supabase 응답:', { products: products?.length || 0, error, count })

    if (error) {
      console.error('❌ 필터링 검색 오류:', error)
      return {
        success: false,
        products: [],
        total: 0,
        error: '검색 중 오류가 발생했습니다.'
      }
    }

    console.log('✅ 필터링 검색 완료:', products?.length || 0, '개')

    // 인기순 정렬인 경우 예약 수를 가져와서 정렬
    if (filters.sortType === 'popular' && products && products.length > 0) {
      try {
        const productIds = products.map(p => p.id)
        const { data: bookings, error: bookingError } = await supabase
          .from('Bookings')
          .select('product_id')
          .in('product_id', productIds)

        if (!bookingError && bookings) {
          // 예약 수 계산
          const bookingCounts = {}
          bookings.forEach(booking => {
            bookingCounts[booking.product_id] = (bookingCounts[booking.product_id] || 0) + 1
          })

          // 예약 수로 정렬
          products.sort((a, b) => {
            const aCount = bookingCounts[a.id] || 0
            const bCount = bookingCounts[b.id] || 0
            return bCount - aCount // 내림차순 (예약 수 많은 순)
          })
        }
      } catch (bookingError) {
        console.error('예약 수 조회 오류:', bookingError)
        // 오류가 발생해도 기본 정렬 유지
      }
    }

    return {
      success: true,
      products: products || [],
      total: count || 0
    }
  } catch (error) {
    console.error('필터링 검색 예외:', error)
    return {
      success: false,
      products: [],
      total: 0,
      error: '검색 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 카테고리 목록 조회
 * @returns {Promise<{success: boolean, categories: Array, error?: string}>}
 */
export async function getCategories() {
  try {
    const { data: categories, error } = await supabase
      .from('Categories')
      .select('id, name')
      .order('id', { ascending: true })

    if (error) {
      console.error('카테고리 조회 오류:', error)
      return {
        success: false,
        categories: [],
        error: '카테고리를 불러올 수 없습니다.'
      }
    }

    return {
      success: true,
      categories: categories || []
    }
  } catch (error) {
    console.error('카테고리 조회 예외:', error)
    return {
      success: false,
      categories: [],
      error: '카테고리를 불러올 수 없습니다.'
    }
  }
}

/**
 * 상품의 고유한 여행 기간 조회
 * @returns {Promise<{success: boolean, durations: Array, error?: string}>}
 */
export async function getUniqueDurations() {
  try {
    const { data: products, error } = await supabase
      .from('Products')
      .select('duration')
      .or('status.is.null,status.eq.true')
      .not('duration', 'is', null)

    if (error) {
      console.error('여행 기간 조회 오류:', error)
      return {
        success: false,
        durations: [],
        error: '여행 기간을 불러올 수 없습니다.'
      }
    }

    // 고유한 duration 값들 추출 (의미있는 여행기간만)
    const meaningfulDurations = products
      .map(p => p.duration)
      .filter(duration => {
        // 의미있는 여행기간 패턴만 포함
        const patterns = ['당일', '1박 2일', '2박 3일', '3박 4일', '4박 5일', '5박 6일']
        return patterns.some(pattern => duration.includes(pattern) || duration === pattern)
      })
    
    const uniqueDurations = [...new Set(meaningfulDurations)].sort()

    return {
      success: true,
      durations: uniqueDurations
    }
  } catch (error) {
    console.error('여행 기간 조회 예외:', error)
    return {
      success: false,
      durations: [],
      error: '여행 기간을 불러올 수 없습니다.'
    }
  }
}

/**
 * 인기 검색어 조회
 * @returns {Promise<{success: boolean, keywords: Array, error?: string}>}
 */
export async function getPopularKeywords() {
  try {
    // 최근 상품들의 제목에서 키워드 추출
    const { data: recentProducts, error } = await supabase
      .from('Products')
      .select('title')
      .or('status.is.null,status.eq.true')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('인기 검색어 조회 오류:', error)
      return {
        success: false,
        keywords: [],
        error: '인기 검색어를 불러올 수 없습니다.'
      }
    }

    // 제목에서 키워드 추출 (간단한 구현)
    const keywords = []
    const keywordCount = {}

    recentProducts?.forEach(product => {
      const words = product.title.split(/\s+/).filter(word => word.length > 1)
      words.forEach(word => {
        if (keywordCount[word]) {
          keywordCount[word]++
        } else {
          keywordCount[word] = 1
        }
      })
    })

    // 빈도순으로 정렬하여 상위 10개 반환
    const sortedKeywords = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword]) => keyword)

    return {
      success: true,
      keywords: sortedKeywords
    }
  } catch (error) {
    console.error('인기 검색어 조회 예외:', error)
    return {
      success: false,
      keywords: [],
      error: '인기 검색어를 불러올 수 없습니다.'
    }
  }
} 