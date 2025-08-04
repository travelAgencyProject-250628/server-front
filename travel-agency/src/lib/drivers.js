import { supabase } from './supabase.js'

/**
 * 기사 정보 조회
 * @param {string} authId - 사용자 인증 ID
 * @returns {Promise<Object>}
 */
export async function getDriverInfo(authId) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('auth_id', authId)
      .eq('is_driver', true)
      .single()
    
    if (error) {
      throw error
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('기사 정보 조회 실패:', error)
    console.error('에러 상세 정보:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    return { success: false, error: error.message }
  }
}

/**
 * 기사 정보 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>}
 */
export async function updateDriverInfo(authId, updateData) {
  try {
    const { error } = await supabase
      .from('Users')
      .update(updateData)
      .eq('auth_id', authId)
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error('기사 정보 업데이트 실패:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 기사 사진 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {string} photoUrl - 사진 URL
 * @returns {Promise<Object>}
 */
export async function updateDriverPhoto(authId, photoUrl) {
  return updateDriverInfo(authId, { driver_photo_url: photoUrl })
}

/**
 * 기사 사진 삭제
 * @param {string} authId - 사용자 인증 ID
 * @returns {Promise<Object>}
 */
export async function deleteDriverPhoto(authId) {
  return updateDriverInfo(authId, { driver_photo_url: null })
}

/**
 * 차량 사진 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {Array} photoUrls - 차량 사진 URL 배열
 * @returns {Promise<Object>}
 */
export async function updateVehiclePhotos(authId, photoUrls) {
  return updateDriverInfo(authId, { driver_vehicle_photo_urls: photoUrls })
}

/**
 * 자격증 사진 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {string} photoUrl - 사진 URL
 * @returns {Promise<Object>}
 */
export async function updateLicensePhoto(authId, photoUrl) {
  return updateDriverInfo(authId, { driver_license_photo_url: photoUrl })
}

/**
 * 자격증 사진 삭제
 * @param {string} authId - 사용자 인증 ID
 * @returns {Promise<Object>}
 */
export async function deleteLicensePhoto(authId) {
  return updateDriverInfo(authId, { driver_license_photo_url: null })
}

/**
 * 보험증권 사진 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {string} photoUrl - 사진 URL
 * @returns {Promise<Object>}
 */
export async function updateInsurancePhoto(authId, photoUrl) {
  return updateDriverInfo(authId, { driver_insurance_photo_url: photoUrl })
}

/**
 * 보험증권 사진 삭제
 * @param {string} authId - 사용자 인증 ID
 * @returns {Promise<Object>}
 */
export async function deleteInsurancePhoto(authId) {
  return updateDriverInfo(authId, { driver_insurance_photo_url: null })
}

/**
 * 등록증 사진 업데이트
 * @param {string} authId - 사용자 인증 ID
 * @param {string} photoUrl - 사진 URL
 * @returns {Promise<Object>}
 */
export async function updateRegistrationPhoto(authId, photoUrl) {
  return updateDriverInfo(authId, { driver_registration_photo_url: photoUrl })
}

/**
 * 등록증 사진 삭제
 * @param {string} authId - 사용자 인증 ID
 * @returns {Promise<Object>}
 */
export async function deleteRegistrationPhoto(authId) {
  return updateDriverInfo(authId, { driver_registration_photo_url: null })
}

/**
 * 모든 기사 목록 조회 (관리자용)
 * @param {Object} options - 조회 옵션
 * @returns {Promise<Object>}
 */
export async function getAllDrivers(options = {}) {
  try {
    let query = supabase
      .from('Users')
      .select('*')
      .eq('is_driver', true)
    
    // 검색 필터
    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%,mobile_number.ilike.%${options.search}%`)
    }
    
    // 승인 상태 필터
    if (options.approved !== undefined) {
      query = query.eq('driver_approved', options.approved)
    }
    
    // 활성 상태 필터
    if (options.active !== undefined) {
      query = query.eq('driver_active', options.active)
    }
    
    // 정렬
    if (options.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortAsc !== false })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    
    // 페이지네이션
    if (options.page && options.pageSize) {
      const from = (options.page - 1) * options.pageSize
      const to = from + options.pageSize - 1
      query = query.range(from, to)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      throw error
    }
    
    return { 
      success: true, 
      data, 
      count: count || data?.length || 0 
    }
  } catch (error) {
    console.error('기사 목록 조회 실패:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 기사 승인 상태 변경 (관리자용)
 * @param {string} authId - 사용자 인증 ID
 * @param {boolean} approved - 승인 상태
 * @returns {Promise<Object>}
 */
export async function updateDriverApproval(authId, approved) {
  return updateDriverInfo(authId, { driver_approved: approved })
}

/**
 * 기사 활성 상태 변경 (관리자용)
 * @param {string} authId - 사용자 인증 ID
 * @param {boolean} active - 활성 상태
 * @returns {Promise<Object>}
 */
export async function updateDriverActive(authId, active) {
  return updateDriverInfo(authId, { driver_active: active })
}

/**
 * 기사 상태 텍스트 가져오기
 * @param {Object} driver - 기사 정보
 * @returns {string}
 */
export function getDriverStatusText(driver) {
  if (!driver.driver_approved && driver.driver_active) return '승인 대기'
  if (driver.driver_approved && driver.driver_active) return '승인됨'
  if (!driver.driver_approved && !driver.driver_active) return '거부됨'
  return '비활성'
}

/**
 * 기사 상태 클래스 가져오기
 * @param {Object} driver - 기사 정보
 * @returns {string}
 */
export function getDriverStatusClass(driver) {
  if (!driver.driver_approved && driver.driver_active) return 'pending'
  if (driver.driver_approved && driver.driver_active) return 'approved'
  if (!driver.driver_approved && !driver.driver_active) return 'rejected'
  return 'inactive'
} 