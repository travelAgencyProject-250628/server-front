import { supabase } from './supabase.js'

export const badgeService = {
  // 모든 배지 조회
  async getAllBadges() {
    try {
      const { data, error } = await supabase
        .from('Badges')
        .select('*')
        .order('name')

      if (error) {
        console.error('배지 조회 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, badges: data }
    } catch (error) {
      console.error('배지 조회 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 배지 생성
  async createBadge(badgeData) {
    try {
      const { data, error } = await supabase
        .from('Badges')
        .insert([badgeData])
        .select()

      if (error) {
        console.error('배지 생성 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, badge: data[0] }
    } catch (error) {
      console.error('배지 생성 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 배지 수정
  async updateBadge(id, badgeData) {
    try {
      const { data, error } = await supabase
        .from('Badges')
        .update(badgeData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('배지 수정 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, badge: data[0] }
    } catch (error) {
      console.error('배지 수정 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 배지 삭제
  async deleteBadge(id) {
    try {
      const { error } = await supabase
        .from('Badges')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('배지 삭제 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('배지 삭제 예외:', error)
      return { success: false, error: error.message }
    }
  }
} 