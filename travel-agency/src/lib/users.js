import { supabase } from './supabase.js'

/**
 * 전체 유저 목록을 가져온다.
 * Bookings 테이블에서 예약 수를 카운트하고 status를 계산한다.
 * UserRoles 테이블과 조인하여 관리자 권한도 포함한다.
 * @returns {Object} { success, users, error }
 */
export async function getAllUsers() {
  try {
    // 1. 모든 유저 정보 조회 (UserRoles 테이블과 조인)
    const { data: users, error: usersError } = await supabase
      .from('Users')
      .select(`
        *,
        UserRoles(is_admin)
      `)
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('유저 목록 조회 실패:', usersError)
      return { success: false, error: '유저 목록을 가져오는데 실패했습니다.' }
    }

    // 2. 각 유저별 예약 수 조회
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        // Bookings 테이블에서 해당 유저의 예약 수 카운트
        const { count: bookingCount, error: bookingError } = await supabase
          .from('Bookings')
          .select('*', { count: 'exact', head: true })
          .eq('auth_id', user.auth_id)

        if (bookingError) {
          console.error(`유저 ${user.email} 예약 수 조회 실패:`, bookingError)
          return {
            ...user,
            bookingCount: 0,
            status: false
          }
        }

        // status: bookingCount가 1 이상이면 true, 아니면 false
        const status = (bookingCount || 0) >= 1

        return {
          ...user,
          bookingCount: bookingCount || 0,
          status: status
        }
      })
    )

    // 3. Customers.vue 형식에 맞춰 데이터 변환
    const formattedUsers = usersWithBookings.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone_number || user.mobile_number || '',
      address: user.address || '',
      status: user.status ? 'active' : 'inactive',
      bookingCount: user.bookingCount,
      lastBooking: user.last_booking_date || null,
      totalPayment: user.total_payment || 0,
      createdAt: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : null,
      is_admin: user.UserRoles?.is_admin || false
    }))

    return {
      success: true,
      users: formattedUsers
    }
  } catch (error) {
    console.error('전체 유저 목록 조회 오류:', error)
    return {
      success: false,
      error: '유저 목록을 가져오는데 실패했습니다.'
    }
  }
}

/**
 * 현재 로그인한 사용자의 상세 정보를 반환한다.
 * 반환 형식은 profileEdit.vue의 임시데이터와 동일하게 맞춘다.
 */
export async function getCurrentUserInfo() {
  try {
    // 1. 현재 인증된 사용자 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    console.log('Auth 사용자 ID:', user.id)
    console.log('Auth 사용자 이메일:', user.email)

    // 2. Users 테이블에서 상세 정보 조회 (auth_id 기준)
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Users 테이블 조회 오류:', error)
      return { success: false, error: '유저 정보를 조회하는 중 오류가 발생했습니다.' }
    }

    if (!data) {
      // Users 테이블에 없는 경우, 전체 Users 테이블을 확인해보기
      const { data: allUsers, error: allUsersError } = await supabase
        .from('Users')
        .select('auth_id, email, name')
        .limit(5)
      
      console.log('전체 Users 테이블 샘플:', allUsers)
      console.log('현재 auth_id:', user.id)
      
      return { success: false, error: '유저 정보를 찾을 수 없습니다. 회원가입을 완료해주세요.' }
    }

    // 3. profileEdit.vue 임시데이터 형식에 맞춰 반환
    return {
      success: true,
      user: {
        email: data.email,
        name: data.name,
        phone: data.phone_number,
        mobile: data.mobile_number,
        zipcode: data.postal_code,
        address1: data.address,
        address2: data.address_detail,
        smsReceive: data.receive_sms ? 'Y' : 'N'
      }
    }
  } catch (error) {
    console.error('getCurrentUserInfo 오류:', error)
    return { success: false, error: '유저 정보를 가져오는 중 오류가 발생했습니다.' }
  }
}

/**
 * 현재 로그인한 사용자의 정보를 수정한다.
 * profileEdit.vue 임시데이터 형식으로 반환하며,
 * password가 포함된 경우 비밀번호도 함께 변경한다.
 * @param {Object} updateData - 수정할 데이터 (name, phone, mobile, zipcode, address1, address2, smsReceive, password 등)
 * @returns {Object} { success, user, error }
 */
export async function updateUserInfo(updateData) {
  try {
    // 1. 현재 인증된 사용자 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    // 2. Users 테이블에서 기존 정보 조회 (auth_id 기준)
    const { data: userRow, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle()

    if (userError) {
      console.error('Users 테이블 조회 오류:', userError)
      return { success: false, error: '유저 정보를 조회하는 중 오류가 발생했습니다.' }
    }

    if (!userRow) {
      return { success: false, error: '유저 정보를 찾을 수 없습니다. 회원가입을 완료해주세요.' }
    }

    // 3. 업데이트할 필드 준비
    const updateFields = {
      name: updateData.name,
      phone_number: updateData.phone,
      mobile_number: updateData.mobile,
      postal_code: updateData.zipcode,
      address: updateData.address1,
      address_detail: updateData.address2,
      receive_sms: updateData.smsReceive === 'Y',
    }

    // 4. Users 테이블 정보 업데이트
    const { data: updatedUser, error: updateError } = await supabase
      .from('Users')
      .update(updateFields)
      .eq('auth_id', user.id)
      .select()
      .maybeSingle()

    if (updateError) {
      console.error('Users 테이블 업데이트 오류:', updateError)
      return { success: false, error: '회원정보 수정에 실패했습니다.' }
    }

    if (!updatedUser) {
      return { success: false, error: '업데이트된 유저 정보를 찾을 수 없습니다.' }
    }

    // 5. 비밀번호 변경이 포함된 경우
    if (updateData.password) {
      // Supabase Auth 비밀번호 변경
      const { error: pwError } = await supabase.auth.updateUser({
        password: updateData.password
      })
      if (pwError) {
        console.error('비밀번호 변경 오류:', pwError)
        return { success: false, error: '비밀번호 변경에 실패했습니다.' }
      }
    }

    // 6. profileEdit.vue 임시데이터 형식에 맞춰 반환
    return {
      success: true,
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone_number,
        mobile: updatedUser.mobile_number,
        zipcode: updatedUser.postal_code,
        address1: updatedUser.address,
        address2: updatedUser.address_detail,
        smsReceive: updatedUser.receive_sms ? 'Y' : 'N'
      }
    }
  } catch (error) {
    console.error('updateUserInfo 오류:', error)
    return { success: false, error: '회원정보 수정 중 오류가 발생했습니다.' }
  }
} 