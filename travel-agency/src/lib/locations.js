import { supabase } from './supabase.js'

export const locationService = {
  // 모든 지역 조회
  async getAllLocations() {
    try {
      const { data, error } = await supabase
        .from('Locations')
        .select('*')
        .order('name')

      if (error) {
        console.error('지역 조회 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, locations: data }
    } catch (error) {
      console.error('지역 조회 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 지역 생성
  async createLocation(locationData) {
    try {
      const { data, error } = await supabase
        .from('Locations')
        .insert([locationData])
        .select()

      if (error) {
        console.error('지역 생성 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, location: data[0] }
    } catch (error) {
      console.error('지역 생성 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 지역 수정
  async updateLocation(id, locationData) {
    try {
      const { data, error } = await supabase
        .from('Locations')
        .update(locationData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('지역 수정 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true, location: data[0] }
    } catch (error) {
      console.error('지역 수정 예외:', error)
      return { success: false, error: error.message }
    }
  },

  // 지역 삭제
  async deleteLocation(id) {
    try {
      const { error } = await supabase
        .from('Locations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('지역 삭제 오류:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('지역 삭제 예외:', error)
      return { success: false, error: error.message }
    }
  }
} 