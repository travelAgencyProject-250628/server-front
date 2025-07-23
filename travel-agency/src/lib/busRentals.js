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

// 버스 대절 신청 상태 업데이트 (연락완료 처리)
export async function updateBusRentalStatus(rentalId, status) {
  try {
    const { data, error } = await supabase
      .from('BusRentals')
      .update({ status: status })
      .eq('id', rentalId)
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 상태 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// 버스 대절 신청 삭제
export async function deleteBusRental(rentalId) {
  try {
    const { error } = await supabase
      .from('BusRentals')
      .delete()
      .eq('id', rentalId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('버스 대절 삭제 오류:', error)
    return { success: false, error: error.message }
  }
} 