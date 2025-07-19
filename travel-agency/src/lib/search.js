import { supabase } from './supabase.js'

/**
 * 상품 검색 API
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