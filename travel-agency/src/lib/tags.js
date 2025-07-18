import { supabase } from './supabase.js'

export const tagService = {
  // 모든 태그 조회
  async getAllTags() {
    try {
      const { data, error } = await supabase
        .from('Tags')
        .select('*')
        .order('name')

      if (error) {
        console.error('태그 조회 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, tags: data }
    } catch (error) {
      console.error('태그 조회 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 태그 생성
  async createTag(tagData) {
    try {
      const { data, error } = await supabase
        .from('Tags')
        .insert([tagData])
        .select()

      if (error) {
        console.error('태그 생성 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, tag: data[0] }
    } catch (error) {
      console.error('태그 생성 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 태그 수정
  async updateTag(id, tagData) {
    try {
      const { data, error } = await supabase
        .from('Tags')
        .update(tagData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('태그 수정 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, tag: data[0] }
    } catch (error) {
      console.error('태그 수정 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 태그 삭제
  async deleteTag(id) {
    try {
      const { error } = await supabase
        .from('Tags')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('태그 삭제 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('태그 삭제 예외:', error)
      return { success: false, error: error.message }
    }
  }
} 