import { supabase } from './supabase.js'

export class CategoryService {
  constructor() {
    this.supabase = supabase
  }

  // Supabase에서 1차/2차 카테고리 메뉴 데이터 동적 생성
  async getMenuData() {
    try {
      // 1. 1차 카테고리(Primary) 조회
      const { data: categories, error: catError } = await this.supabase
        .from('Categories')
        .select('id, name')
        .order('id')
      if (catError) throw catError

      // 2. 태그(2차 카테고리 후보) 조회
      const { data: tags, error: tagError } = await this.supabase
        .from('Tags')
        .select('id, name')
        .order('id')
      if (tagError) throw tagError

      // 3. Products에서 실제 연결된 (category, tag_id) 쌍만 추출
      const { data: prodPairs, error: prodError } = await this.supabase
        .from('Products')
        .select('category_id, tag_id')
      if (prodError) throw prodError

      // 4. secondaryCategories 구조 생성
      // { [categoryId]: [ {id, name}, ... ] }
      const secondaryCategories = {}
      categories.forEach(cat => {
        // 해당 카테고리에서 실제 상품에 연결된 tag_id만 추출
        const tagIds = prodPairs
          .filter(p => p.category_id === cat.id && p.tag_id)
          .map(p => p.tag_id)
        // 중복 제거
        const uniqueTagIds = [...new Set(tagIds)]
        // 태그 정보 매핑
        secondaryCategories[cat.id] = tags
          .filter(tag => uniqueTagIds.includes(tag.id))
          .map(tag => ({ id: tag.id, name: tag.name }))
      })

      // 5. primaryCategories 구조 생성
      const primaryCategories = categories.map(cat => ({ id: cat.id, name: cat.name }))

      return {
        success: true,
        menuData: {
          primaryCategories,
          secondaryCategories
        }
      }
    } catch (error) {
      console.error('메뉴 데이터 생성 오류:', error)
      return {
        success: false,
        error: error.message,
        menuData: {
          primaryCategories: [],
          secondaryCategories: {}
        }
      }
    }
  }
}

export const categoryService = new CategoryService() 