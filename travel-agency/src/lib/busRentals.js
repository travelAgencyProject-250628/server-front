import { supabase } from './supabase.js'

// 버스 대절 신청 저장
export async function createBusRental(rentalData) {
  try {
    const { data, error } = await supabase
      .from('BusRentals')
      .insert([
        {
          content: rentalData,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 신청 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

// 버스 대절 신청 목록 조회 (관리자용)
export async function getBusRentals() {
  try {
    const { data, error } = await supabase
      .from('BusRentals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 신청 조회 오류:', error)
    return { success: false, error: error.message }
  }
} 