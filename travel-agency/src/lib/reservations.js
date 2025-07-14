import { supabase } from './supabase.js'

/**
 * 예약 상세 정보 조회
 * @param {number} reservationId - 예약 id
 * @returns {Promise<{success: boolean, reservation: object|null, error?: string}>}
 */
export async function getReservationDetail(reservationId) {
  try {
    // Bookings + Products + StartingPoints 조인, 예약자/여행자 정보는 Bookings에서 직접 사용
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id,
        created_at,
        user_id,
        product_id,
        starting_point_id,
        adult_count,
        child_count,
        agree_terms,
        departure_date,
        booker_name,
        booker_phone,
        booker_email,
        emergency_contact,
        travelers_name,
        travelers_phone,
        status,
        depositor_name,
        product:product_id(id, title, duration, included_items, excluded_items, adult_price, child_price),
        starting_point:starting_point_id(id, name)
      `)
      .eq('id', reservationId)
      .single()
    if (error) throw error
    if (!data) return { success: false, reservation: null, error: '예약 정보를 찾을 수 없습니다.' }

    // travelers_name, travelers_phone: 콤마로 구분된 문자열일 경우 배열로 변환
    let travelers = []
    if (data.travelers_name || data.travelers_phone) {
      const names = (data.travelers_name || '').split(',').map(s => s.trim())
      const phones = (data.travelers_phone || '').split(',').map(s => s.trim())
      travelers = names.map((name, idx) => ({
        name,
        phone: phones[idx] || '',
        type: '성인' // 타입 구분 필요시 추가 구현
      }))
    } else {
      travelers = [
        {
          name: data.booker_name || '',
          phone: data.booker_phone || '',
          type: '성인'
        }
      ]
    }

    // 반환 데이터 가공 (더미 데이터 구조에 맞춤)
    const reservation = {
      id: data.id,
      bookerName: data.booker_name || data.depositor_name || '',
      bookerPhone: data.booker_phone || '',
      emergencyContact: data.emergency_contact || '',
      bookerEmail: data.booker_email || '',
      productTitle: data.product?.title || '',
      adultCount: data.adult_count || 0,
      childCount: data.child_count || 0,
      duration: data.product?.duration || '',
      departureDate: data.departure_date || (data.created_at ? data.created_at.split('T')[0] : ''),
      departureLocation: data.starting_point?.name || '',
      includedItems: data.product?.included_items || '',
      excludedItems: data.product?.excluded_items || '',
      adultPrice: data.product?.adult_price || 0,
      childPrice: data.product?.child_price || 0,
      totalAmount:
        (data.product?.adult_price || 0) * (data.adult_count || 0) +
        (data.product?.child_price || 0) * (data.child_count || 0),
      status: data.status || (data.agree_terms ? '예약확정' : '대기'),
      memberType: '회원예약',
      travelers
    }
    return { success: true, reservation }
  } catch (error) {
    return { success: false, reservation: null, error: error.message }
  }
}

/**
 * 예약 생성(POST)
 * @param {object} reservationData - 예약 폼 데이터(예약자, 상품, 출발지, 인원 등)
 * @returns {Promise<{success: boolean, id?: number, error?: string}>}
 */
export async function createReservation(reservationData) {
  try {
    // travelers_name, travelers_phone: 입력받은 문자열 그대로 저장
    const travelers_name = reservationData.travelersName !== undefined
      ? reservationData.travelersName
      : (Array.isArray(reservationData.travelers)
          ? reservationData.travelers.map(t => t.name).filter(Boolean).join(',')
          : '');
    const travelers_phone = reservationData.travelersPhone !== undefined
      ? reservationData.travelersPhone
      : '';

    // Bookings 테이블에 insert
    const { data, error } = await supabase
      .from('Bookings')
      .insert([
        {
          booker_name: reservationData.bookerName,
          booker_phone: reservationData.bookerPhone,
          booker_email: reservationData.bookerEmail,
          emergency_contact: reservationData.emergencyContact,
          depositor_name: reservationData.depositorName || reservationData.bookerName,
          adult_count: reservationData.adultCount,
          child_count: reservationData.childCount,
          product_id: reservationData.productId,
          starting_point_id: reservationData.startingPointId,
          departure_date: reservationData.departureDate,
          agree_terms: reservationData.agreeTerms,
          status: reservationData.status || '대기',
          travelers_name,
          travelers_phone
        }
      ])
      .select('id')
      .single()
    if (error) throw error
    return { success: true, id: data.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
} 