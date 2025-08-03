import { supabase } from './supabase.js'

export class CategoryService {
  constructor() {
    this.supabase = supabase
  }

  // 모든 카테고리 조회
  async getAllCategories() {
    try {
      const { data, error } = await this.supabase
        .from('Categories')
        .select('id, name, description')
        .order('id')
      
      if (error) throw error

      return {
        success: true,
        categories: data || []
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error)
      return {
        success: false,
        categories: [],
        error: error.message
      }
    }
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

      // 3. Products에서 실제 연결된 (category, tag_id) 쌍만 추출 (status가 true인 활성 상품만)
      const { data: prodPairs, error: prodError } = await this.supabase
        .from('Products')
        .select('category_id, tag_id')
        .eq('status', true)
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

  // 카테고리 생성
  async createCategory(categoryData) {
    try {
      const { data, error } = await this.supabase
        .from('Categories')
        .insert([categoryData])
        .select()
        .maybeSingle()

      if (error) {
        console.error('카테고리 생성 실패:', error)
        throw error
      }

      if (!data) {
        throw new Error('카테고리 생성 후 데이터를 찾을 수 없습니다.')
      }

      return {
        success: true,
        category: data,
        message: '카테고리가 성공적으로 생성되었습니다.'
      }
    } catch (error) {
      console.error('카테고리 생성 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '카테고리 생성에 실패했습니다.'
      }
    }
  }

  // 카테고리 수정
  async updateCategory(id, categoryData) {
    try {
      const { data, error } = await this.supabase
        .from('Categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) {
        console.error('카테고리 수정 실패:', error)
        throw error
      }

      if (!data) {
        throw new Error('수정할 카테고리를 찾을 수 없습니다.')
      }

      return {
        success: true,
        category: data,
        message: '카테고리가 성공적으로 수정되었습니다.'
      }
    } catch (error) {
      console.error('카테고리 수정 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '카테고리 수정에 실패했습니다.'
      }
    }
  }

  // 카테고리 삭제
  async deleteCategory(id) {
    try {
      const { error } = await this.supabase
        .from('Categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('카테고리 삭제 실패:', error)
        throw error
      }

      return {
        success: true,
        message: '카테고리가 성공적으로 삭제되었습니다.'
      }
    } catch (error) {
      console.error('카테고리 삭제 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '카테고리 삭제에 실패했습니다.'
      }
    }
  }


  // 카테고리의 인기상품 조회
  async getPopularProducts(categoryId) {
    try {
      // 카테고리의 popular_products 확인
      const { data: categoryData, error: categoryError } = await this.supabase
        .from('Categories')
        .select('popular_products')
        .eq('id', categoryId)
        .single()
      
      if (categoryError) {
        console.error('카테고리 조회 오류:', categoryError)
        return {
          success: false,
          products: [],
          error: categoryError.message
        }
      }
      
      // popular_products가 null이거나 비어있으면 빈 배열 반환
      if (!categoryData || !categoryData.popular_products || categoryData.popular_products.length === 0) {
        return {
          success: true,
          products: []
        }
      }
      
      // popular_products에서 지정한 상품들만 가져오기
      const { data: products, error: productsError } = await this.supabase
        .from('Products')
        .select(`
          id,
          title,
          main_image_url,
          adult_price,
          duration,
          location_id,
          location:location_id(id, name),
          badge_id,
          badge:badge_id(id, name)
        `)
        .in('id', categoryData.popular_products)
        .eq('status', true)
      
      if (productsError) {
        console.error('상품 조회 오류:', productsError)
        return {
          success: false,
          products: [],
          error: productsError.message
        }
      }
      
      if (products) {
        // popular_products 배열의 순서대로 정렬하고 price 필드 추가
        const sortedProducts = categoryData.popular_products.map(productId => {
          const product = products.find(p => p.id === productId)
          if (product) {
            return {
              ...product,
              price: product.adult_price // 템플릿에서 사용하는 price 필드로 매핑
            }
          }
          return null
        }).filter(Boolean)
        
        return {
          success: true,
          products: sortedProducts
        }
      }
      
      return {
        success: true,
        products: []
      }
    } catch (error) {
      console.error('인기상품 조회 오류:', error)
      return {
        success: false,
        products: [],
        error: error.message
      }
    }
  }

  // 카테고리에 속한 상품들 조회
  async getCategoryProducts(categoryId) {
    try {
      const { data: products, error } = await this.supabase
        .from('Products')
        .select(`
          id,
          title,
          adult_price
        `)
        .eq('category_id', categoryId)
        .eq('status', true)
        .order('title')
      
      if (error) {
        console.error('카테고리 상품 조회 오류:', error)
        return {
          success: false,
          products: [],
          error: error.message
        }
      }
      
      return {
        success: true,
        products: products || []
      }
    } catch (error) {
      console.error('카테고리 상품 조회 오류:', error)
      return {
        success: false,
        products: [],
        error: error.message
      }
    }
  }
}

export const categoryService = new CategoryService() 