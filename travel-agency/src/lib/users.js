import { supabase } from './supabase.js'

/**
 * 현재 로그인한 사용자의 상세 정보를 반환한다.
 * 반환 형식은 profileEdit.vue의 임시데이터와 동일하게 맞춘다.
 */
export async function getCurrentUserInfo() {
  // 1. 현재 인증된 사용자 정보 가져오기
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // 2. Users 테이블에서 상세 정보 조회 (user_id/email 기준)
  // user_id는 이메일 앞부분(회원가입 시 user_id@travel-agency.local 형태)
  const userId = user.email.split('@')[0]
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return { success: false, error: '유저 정보를 찾을 수 없습니다.' }
  }

  // 3. profileEdit.vue 임시데이터 형식에 맞춰 반환
  return {
    success: true,
    user: {
      userId: data.user_id,
      name: data.name,
      phone: data.phone_number,
      mobile: data.mobile_number,
      email: data.email,
      zipcode: data.postal_code,
      address1: data.address,
      address2: data.address_detail,
      smsReceive: data.receive_sms ? 'Y' : 'N'
    }
  }
}

/**
 * 현재 로그인한 사용자의 정보를 수정한다.
 * profileEdit.vue 임시데이터 형식으로 반환하며,
 * password가 포함된 경우 비밀번호도 함께 변경한다.
 * @param {Object} updateData - 수정할 데이터 (userId, name, phone, mobile, email, zipcode, address1, address2, smsReceive, password 등)
 * @returns {Object} { success, user, error }
 */
export async function updateUserInfo(updateData) {
  // 1. 현재 인증된 사용자 정보 가져오기
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // 2. Users 테이블에서 기존 정보 조회 (user_id/email 기준)
  const userId = user.email.split('@')[0]
  const { data: userRow, error: userError } = await supabase
    .from('Users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (userError || !userRow) {
    return { success: false, error: '유저 정보를 찾을 수 없습니다.' }
  }

  // 3. 업데이트할 필드 준비
  const updateFields = {
    name: updateData.name,
    phone_number: updateData.phone,
    mobile_number: updateData.mobile,
    // email: updateData.email, // 이메일은 수정 불가
    postal_code: updateData.zipcode,
    address: updateData.address1,
    address_detail: updateData.address2,
    receive_sms: updateData.smsReceive === 'Y',
  }

  // 4. Users 테이블 정보 업데이트
  const { data: updatedUser, error: updateError } = await supabase
    .from('Users')
    .update(updateFields)
    .eq('user_id', userId)
    .select()
    .single()

  if (updateError || !updatedUser) {
    return { success: false, error: '회원정보 수정에 실패했습니다.' }
  }

  // 5. 비밀번호 변경이 포함된 경우
  if (updateData.password) {
    // Supabase Auth 비밀번호 변경
    const { error: pwError } = await supabase.auth.updateUser({
      password: updateData.password
    })
    if (pwError) {
      return { success: false, error: '비밀번호 변경에 실패했습니다.' }
    }
    // Users 테이블에도 비밀번호 컬럼이 있다면 같이 업데이트 (선택)
    await supabase
      .from('Users')
      .update({ user_password: updateData.password })
      .eq('user_id', userId)
  }

  // 6. profileEdit.vue 임시데이터 형식에 맞춰 반환
  return {
    success: true,
    user: {
      userId: updatedUser.user_id,
      name: updatedUser.name,
      phone: updatedUser.phone_number,
      mobile: updatedUser.mobile_number,
      email: updatedUser.email,
      zipcode: updatedUser.postal_code,
      address1: updatedUser.address,
      address2: updatedUser.address_detail,
      smsReceive: updatedUser.receive_sms ? 'Y' : 'N'
    }
  }
} 