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
        .select('id, name')
        .order('name')

      if (error) {
        console.error('카테고리 조회 실패:', error)
        throw error
      }

      return {
        success: true,
        categories: data
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error)
      return {
        success: false,
        error: error.message,
        categories: []
      }
    }
  }

  // 특정 카테고리 조회
  async getCategoryById(id) {
    try {
      const { data, error } = await this.supabase
        .from('Categories')
        .select('id, name')
        .eq('id', id)
        .single()

      if (error) {
        console.error('카테고리 조회 실패:', error)
        throw error
      }

      return {
        success: true,
        category: data
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error)
      return {
        success: false,
        error: error.message,
        category: null
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
        .single()

      if (error) {
        console.error('카테고리 생성 실패:', error)
        throw error
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
        .single()

      if (error) {
        console.error('카테고리 수정 실패:', error)
        throw error
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
}

export const categoryService = new CategoryService() 