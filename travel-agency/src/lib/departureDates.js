import { supabase } from './supabase.js'

/**
 * 특정 상품의 출발 가능 날짜 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise<{success: boolean, departureDates: Array, error?: string}>}
 */
export async function getProductDepartureDates(productId) {
  try {
    const { data, error } = await supabase
      .from('ProductDepartureDates')
      .select('departure_date, status')
      .eq('product_id', productId)
      .eq('status', true)
      .order('departure_date', { ascending: true })

    if (error) throw error

    return { success: true, departureDates: data || [] }
  } catch (error) {
    return { success: false, departureDates: [], error: error.message }
  }
}

/**
 * 상품의 출발 날짜 상태 업데이트 (토글)
 * @param {number} productId - 상품 ID
 * @param {string} departureDate - 출발 날짜 (YYYY-MM-DD)
 * @param {boolean} status - 출발 가능 여부
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateDepartureDate(productId, departureDate, status) {
  try {
    if (status) {
      // 출발 가능으로 설정 - 먼저 기존 레코드 확인 후 insert 또는 update
      const { data: existing, error: selectError } = await supabase
        .from('ProductDepartureDates')
        .select('id')
        .eq('product_id', productId)
        .eq('departure_date', departureDate)
        .single()

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116은 "no rows found" 에러
        throw selectError
      }

      if (existing) {
        // 기존 레코드 업데이트
        const { error } = await supabase
          .from('ProductDepartureDates')
          .update({ status: true })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // 새 레코드 생성
        const { error } = await supabase
          .from('ProductDepartureDates')
          .insert({
            product_id: productId,
            departure_date: departureDate,
            status: true
          })

        if (error) throw error
      }
    } else {
      // 출발 불가능으로 설정 - 해당 레코드 삭제
      const { error } = await supabase
        .from('ProductDepartureDates')
        .delete()
        .eq('product_id', productId)
        .eq('departure_date', departureDate)

      if (error) throw error
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 특정 기간의 상품 출발 날짜 조회 (관리자용)
 * @param {number} productId - 상품 ID
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, departureDates: Array, error?: string}>}
 */
export async function getProductDepartureDatesInRange(productId, startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('ProductDepartureDates')
      .select('departure_date, status')
      .eq('product_id', productId)
      .gte('departure_date', startDate)
      .lte('departure_date', endDate)
      .order('departure_date', { ascending: true })

    if (error) throw error

    return { success: true, departureDates: data || [] }
  } catch (error) {
    return { success: false, departureDates: [], error: error.message }
  }
}

/**
 * 여러 날짜의 출발 상태 일괄 업데이트
 * @param {number} productId - 상품 ID
 * @param {Array} dateUpdates - [{date: 'YYYY-MM-DD', status: boolean}, ...]
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function batchUpdateDepartureDates(productId, dateUpdates) {
  try {
    // 활성화할 날짜들
    const activeDates = dateUpdates.filter(update => update.status)
    // 비활성화할 날짜들
    const inactiveDates = dateUpdates.filter(update => !update.status)

    // 활성화할 날짜들 처리
    if (activeDates.length > 0) {
      // 먼저 기존 레코드들 조회
      const { data: existingRecords, error: selectError } = await supabase
        .from('ProductDepartureDates')
        .select('departure_date')
        .eq('product_id', productId)
        .in('departure_date', activeDates.map(update => update.date))

      if (selectError) throw selectError

      const existingDates = new Set(existingRecords?.map(record => record.departure_date) || [])
      
      // 새로 생성할 날짜들
      const newDates = activeDates.filter(update => !existingDates.has(update.date))
      
      // 업데이트할 날짜들
      const updateDates = activeDates.filter(update => existingDates.has(update.date))

      // 새 레코드들 생성
      if (newDates.length > 0) {
        const insertData = newDates.map(update => ({
          product_id: productId,
          departure_date: update.date,
          status: true
        }))

        const { error: insertError } = await supabase
          .from('ProductDepartureDates')
          .insert(insertData)

        if (insertError) throw insertError
      }

      // 기존 레코드들 업데이트
      if (updateDates.length > 0) {
        for (const update of updateDates) {
          const { error: updateError } = await supabase
            .from('ProductDepartureDates')
            .update({ status: true })
            .eq('product_id', productId)
            .eq('departure_date', update.date)

          if (updateError) throw updateError
        }
      }
    }

    // 비활성화할 날짜들 삭제
    if (inactiveDates.length > 0) {
      const datesToDelete = inactiveDates.map(update => update.date)
      
      const { error: deleteError } = await supabase
        .from('ProductDepartureDates')
        .delete()
        .eq('product_id', productId)
        .in('departure_date', datesToDelete)

      if (deleteError) throw deleteError
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
} 