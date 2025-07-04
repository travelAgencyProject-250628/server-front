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
}

export const categoryService = new CategoryService() 