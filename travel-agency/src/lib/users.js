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