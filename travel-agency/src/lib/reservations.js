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

    // 출발장소 시간 정보 조회
    let departureTime = ''
    if (data.product_id && data.starting_point_id) {
      const { data: timeData, error: timeError } = await supabase
        .from('ProductStartingPoints')
        .select('time')
        .eq('product_id', data.product_id)
        .eq('starting_point_id', data.starting_point_id)
        .single()
      
      if (!timeError && timeData) {
        departureTime = timeData.time
      }
    }

    // travelers_name, travelers_phone: 콤마로 구분된 문자열 or 배열일 수 있음
    let names = []
    let phones = []
    if (Array.isArray(data.travelers_name)) {
      names = data.travelers_name
    } else if (typeof data.travelers_name === 'string') {
      names = data.travelers_name.split(',').map(s => s.trim())
    }
    if (Array.isArray(data.travelers_phone)) {
      phones = data.travelers_phone
    } else if (typeof data.travelers_phone === 'string') {
      phones = data.travelers_phone.split(',').map(s => s.trim())
    }
    let travelers = []
    if (names.length > 0 || phones.length > 0) {
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
      departureTime: departureTime,
      includedItems: data.product?.included_items || '',
      excludedItems: data.product?.excluded_items || '',
      adultPrice: data.product?.adult_price || 0,
      childPrice: data.product?.child_price || 0,
      totalAmount:
        (data.product?.adult_price || 0) * (data.adult_count || 0) +
        (data.product?.child_price || 0) * (data.child_count || 0),
      status: data.status || "",
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

    // 현재 로그인된 사용자의 auth_id(uuid) 가져오기
    let auth_id = null
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (!authError && userData?.user?.id) {
      auth_id = userData.user.id
    }
    console.log(auth_id)

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
          status: reservationData.status || 'pending',
          travelers_name,
          travelers_phone,
          auth_id // 로그인된 유저의 auth_id 추가
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

/**
 * 내 예약 전체 조회 (auth_id 기준)
 * @returns {Promise<{success: boolean, reservations: object[]|null, error?: string}>}
 */
export async function getMyReservations() {
  try {
    // 현재 로그인된 사용자의 auth_id(uuid) 가져오기
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user?.id) {
      throw new Error('로그인이 필요합니다.')
    }
    const auth_id = userData.user.id

    // Bookings 테이블에서 내 예약 전체 조회 (Products 조인)
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id,
        created_at,
        product:product_id(id, title, adult_price, child_price),
        departure_date,
        adult_count,
        child_count,
        status
      `)
      .eq('auth_id', auth_id)
      .order('created_at', { ascending: false })
    if (error) throw error

    // 프론트 요구 구조로 가공
    const reservations = (data || []).map(item => ({
      id: item.id,
      reservationDate: item.created_at ? item.created_at.split('T')[0].replace(/-/g, '/') : '',
      productTitle: item.product?.title || '',
      departureDate: item.departure_date ? item.departure_date.replace(/-/g, '/') : '',
      totalAmount: (item.product?.adult_price || 0) * (item.adult_count || 0) + (item.product?.child_price || 0) * (item.child_count || 0),
      status: item.status || '',
      adultCount: item.adult_count || 0,
      childCount: item.child_count || 0
    }))
    return { success: true, reservations }
  } catch (error) {
    return { success: false, reservations: null, error: error.message }
  }
}

/**
 * 모든 예약 조회 (관리자용)
 * @param {object} options - 조회 옵션
 * @param {string} options.status - 상태별 필터 (예: 'confirmed', 'pending', 'cancelled')
 * @param {string} options.search - 검색어 (예약자명, 상품명)
 * @param {number} options.page - 페이지 번호 (기본값: 1)
 * @param {number} options.limit - 페이지당 항목 수 (기본값: 20)
 * @returns {Promise<{success: boolean, reservations: object[]|null, total: number, error?: string}>}
 */
export async function getAllReservations(options = {}) {
  try {
    const { status, search, productId, page = 1, limit = 20 } = options
    const offset = (page - 1) * limit

    let query = supabase
      .from('Bookings')
      .select(`
        id,
        created_at,
        booker_name,
        booker_phone,
        booker_email,
        adult_count,
        child_count,
        departure_date,
        status,
        emergency_contact,
        travelers_name,
        travelers_phone,
        depositor_name,
        product:product_id(id, title, adult_price, child_price),
        starting_point:starting_point_id(id, name)
      `, { count: 'exact' })

    // 상태별 필터링
    if (status) {
      query = query.eq('status', status)
    }

    // 상품별 필터링
    if (productId) {
      query = query.eq('product_id', productId)
    }

    // 검색 필터링
    if (search) {
      query = query.or(`booker_name.ilike.%${search}%,product.title.ilike.%${search}%,booker_phone.ilike.%${search}%,booker_email.ilike.%${search}%,travelers_name.ilike.%${search}%,travelers_phone.ilike.%${search}%`)
    }

    // 페이지네이션 및 정렬
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // 데이터 그대로 반환
    const reservations = data || []

    return { 
      success: true, 
      reservations, 
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    return { success: false, reservations: null, total: 0, error: error.message }
  }
}

/**
 * 예약 상태 업데이트 (관리자용)
 * @param {number} reservationId - 예약 ID
 * @param {string} status - 새로운 상태
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateReservationStatus(reservationId, status) {
  try {
    const { error } = await supabase
      .from('Bookings')
      .update({ status })
      .eq('id', reservationId)
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 최근 예약 조회 (대시보드용)
 * @param {number} limit - 조회할 예약 수 (기본값: 8)
 * @returns {Promise<{success: boolean, reservations: object[]|null, error?: string}>}
 */
export async function getRecentReservations(limit = 8) {
  try {
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id,
        created_at,
        booker_name,
        departure_date,
        status,
        adult_count,
        child_count,
        product:product_id(id, title, adult_price, child_price)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error

    // 데이터 가공
    const reservations = (data || []).map(reservation => ({
      id: reservation.id,
      customerName: reservation.booker_name || '',
      productName: reservation.product?.title || '',
      reservationDate: reservation.created_at ? reservation.created_at.split('T')[0] : '',
      amount: (reservation.product?.adult_price || 0) * (reservation.adult_count || 0) + 
              (reservation.product?.child_price || 0) * (reservation.child_count || 0),
      status: reservation.status || ''
    }))

    return { success: true, reservations }
  } catch (error) {
    return { success: false, reservations: null, error: error.message }
  }
} 

/**
 * 비회원 예약조회 (auth_id가 null인 예약)
 * @param {string} bookerName - 예약자명
 * @param {string} bookerPhone - 예약자 전화번호
 * @returns {Promise<{success: boolean, reservations: Array, error?: string}>}
 */
export async function getGuestReservations(bookerName, bookerPhone) {
  try {
    const { data, error } = await supabase
      .from('Bookings')
      .select(`
        id,
        created_at,
        departure_date,
        status,
        booker_name,
        booker_phone,
        adult_count,
        child_count,
        product:product_id(
          id,
          title
        ),
        starting_point:starting_point_id(
          id,
          name
        )
      `)
      .is('auth_id', null) // auth_id가 null인 예약만 조회
      .eq('booker_name', bookerName)
      .eq('booker_phone', bookerPhone)
      .order('created_at', { ascending: false })
    
    if (error) throw error

    // 각 예약에 대해 출발 시간 정보 추가
    const reservationsWithTime = await Promise.all((data || []).map(async (reservation) => {
      let departureTime = ''
      
      if (reservation.product?.id && reservation.starting_point?.id) {
        const { data: timeData, error: timeError } = await supabase
          .from('ProductStartingPoints')
          .select('time')
          .eq('product_id', reservation.product.id)
          .eq('starting_point_id', reservation.starting_point.id)
          .single()
        
        if (!timeError && timeData) {
          departureTime = timeData.time
        }
      }
      
      return {
        ...reservation,
        departureTime
      }
    }))

    return { success: true, reservations: reservationsWithTime }
  } catch (error) {
    return { success: false, reservations: [], error: error.message }
  }
} 