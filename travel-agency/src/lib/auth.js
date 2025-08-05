import { supabase } from './supabase.js'

export class AuthService {
  constructor() {
    this.supabase = supabase
  }

  // 카카오 소셜 로그인
  async signInWithKakao(redirectTo = null) {
    try {
      console.log('카카오 로그인 시작')
      
      const options = {
        queryParams: {
          scope: 'account_email' // 이메일 정보만 요청
        }
      }
      if (redirectTo) {
        options.redirectTo = redirectTo
      }

      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options
      })

      if (error) {
        console.error('카카오 로그인 실패:', error)
        throw error
      }

      console.log('카카오 로그인 성공:', data)
      return {
        success: true,
        message: '카카오 로그인이 시작되었습니다.',
        data
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
      return {
        success: false,
        error: error.message,
        message: `카카오 로그인에 실패했습니다: ${error.message}`
      }
    }
  }

  // OAuth 콜백 처리 (서버 사이드에서 사용)
  async handleOAuthCallback(code) {
    try {
      console.log('OAuth 콜백 처리 시작')
      
      const { data, error } = await this.supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth 콜백 처리 실패:', error)
        throw error
      }

      console.log('OAuth 콜백 처리 성공:', data)

      // 카카오 로그인 사용자의 경우 Users 테이블에 정보 저장
      if (data.user && data.user.app_metadata?.provider === 'kakao') {
        await this.handleKakaoUserRegistration(data.user)
      }

      // Users 테이블에서 추가 정보 조회 (UserRoles 테이블과 left join)
      let userInfo = null
      if (data.user) {
        const { data: userData, error: userError } = await this.supabase
          .from('Users')
          .select(`
            *,
            UserRoles(is_admin)
          `)
          .eq('auth_id', data.user.id)
          .maybeSingle()

        if (!userError && userData) {
          // UserRoles 정보를 포함하여 userInfo 구성
          userInfo = {
            ...userData,
            is_admin: userData.UserRoles?.is_admin || false
          }
        } else if (userError) {
          console.warn('Users 테이블 조회 실패 (계속 진행):', userError)
        }
      }

      return {
        success: true,
        message: '카카오 로그인이 완료되었습니다.',
        user: userInfo || data.user,
        session: data.session
      }
    } catch (error) {
      console.error('OAuth 콜백 처리 오류:', error)
      return {
        success: false,
        error: error.message,
        message: `OAuth 콜백 처리에 실패했습니다: ${error.message}`
      }
    }
  }

  // 카카오 사용자 등록 처리
  async handleKakaoUserRegistration(user) {
    try {
      console.log('카카오 사용자 등록 처리 시작:', user.id)
      
      // 이미 Users 테이블에 존재하는지 확인
      const { data: existingUser, error: checkError } = await this.supabase
        .from('Users')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error('사용자 존재 확인 실패:', checkError)
        return
      }

      if (existingUser) {
        console.log('이미 등록된 카카오 사용자:', existingUser.id)
        return
      }

      // 카카오 사용자 정보 추출
      const userData = {
        auth_id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.nickname || '카카오 사용자',
        phone_number: user.user_metadata?.phone_number || null,
        mobile_number: user.user_metadata?.mobile_number || null,
        profile_image: user.user_metadata?.avatar_url || user.user_metadata?.profile_image_url || null,
        created_at: new Date().toISOString(),
      }

      // Users 테이블에 저장
      const { data: newUser, error: insertError } = await this.supabase
        .from('Users')
        .insert([userData])
        .select()

      if (insertError) {
        console.error('카카오 사용자 등록 실패:', insertError)
        throw insertError
      }

      console.log('카카오 사용자 등록 성공:', newUser[0])
    } catch (error) {
      console.error('카카오 사용자 등록 처리 오류:', error)
      // 사용자 등록 실패해도 로그인은 계속 진행
    }
  }

  // 카카오 사용자 정보 저장 (회원가입 페이지에서 사용)
  async saveKakaoUserInfo(userData) {
    try {
      console.log('카카오 사용자 정보 저장 시작:', userData)
      
      // 현재 카카오 인증된 사용자 정보 가져오기
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('카카오 인증이 필요합니다.')
      }

      // 이미 Users 테이블에 존재하는지 확인
      const { data: existingUser, error: checkError } = await this.supabase
        .from('Users')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error('사용자 존재 확인 실패:', checkError)
        throw checkError
      }

      if (existingUser) {
        // 기존 사용자 정보 업데이트
        const { data: updatedUser, error: updateError } = await this.supabase
          .from('Users')
          .update({
            ...userData
          })
          .eq('auth_id', user.id)
          .select()

        if (updateError) {
          console.error('카카오 사용자 정보 업데이트 실패:', updateError)
          throw updateError
        }

        console.log('카카오 사용자 정보 업데이트 성공:', updatedUser[0])
        return {
          success: true,
          message: '회원가입이 완료되었습니다.',
          user: updatedUser[0]
        }
      } else {
        // 새 사용자 정보 저장
        const newUserData = {
          ...userData,
          auth_id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
        }

        const { data: newUser, error: insertError } = await this.supabase
          .from('Users')
          .insert([newUserData])
          .select()

        if (insertError) {
          console.error('카카오 사용자 정보 저장 실패:', insertError)
          throw insertError
        }

        console.log('카카오 사용자 정보 저장 성공:', newUser[0])
        return {
          success: true,
          message: '회원가입이 완료되었습니다.',
          user: newUser[0]
        }
      }
    } catch (error) {
      console.error('카카오 사용자 정보 저장 오류:', error)
      return {
        success: false,
        error: error.message,
        message: `회원가입에 실패했습니다: ${error.message}`
      }
    }
  }

  // 회원가입
  async signUp(email, password, userData = {}) {
    try {
      console.log('회원가입 시작:', { email, ...userData })
      
      // Supabase Auth로 회원가입
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // 추가 사용자 데이터를 metadata에 저장
        }
      })

      if (error) {
        console.error('회원가입 실패:', error)
        
        // 이메일 중복 에러 처리
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered') ||
            error.message.includes('already exists')) {
          throw new Error('이미 등록된 이메일입니다.')
        }
        
        throw error
      }

      console.log('회원가입 성공:', data)

      // Users 테이블에 상세 정보 저장 (auth_id는 Supabase Auth의 user.id)
      if (data.user) {
        const userInsertData = {
          ...userData,
          email: email,
          auth_id: data.user.id
        }

      const { data: userTableData, error: userTableError } = await this.supabase
        .from('Users')
          .insert([userInsertData])
        .select()

      if (userTableError) {
        console.error('Users 테이블 저장 실패:', userTableError)
          // Users 테이블 저장 실패해도 Auth는 성공했으므로 경고만 표시
          console.warn('Auth는 성공했지만 Users 테이블 저장에 실패했습니다.')
        } else {
          console.log('Users 테이블 저장 성공:', userTableData[0])
        }
      }
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
        user: data.user,
        session: data.session
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      return {
        success: false,
        error: error.message,
        message: `회원가입에 실패했습니다: ${error.message}`
      }
    }
  }

  // 로그인
  async signIn(email, password) {
    try {
      console.log('로그인 시도:', email)
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('로그인 실패:', error)
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
        throw error
      }

      console.log('로그인 성공:', data)

      // Users 테이블에서 추가 정보 조회 (UserRoles 테이블과 left join)
      let userInfo = null
      if (data.user) {
        const { data: userData, error: userError } = await this.supabase
          .from('Users')
          .select(`
            *,
            UserRoles(is_admin)
          `)
          .eq('auth_id', data.user.id)
          .maybeSingle()

        if (!userError && userData) {
          // UserRoles 정보를 포함하여 userInfo 구성
          userInfo = {
            ...userData,
            is_admin: userData.UserRoles?.is_admin || false
          }
        } else if (userError) {
          console.warn('Users 테이블 조회 실패 (계속 진행):', userError)
        }
      }

      return {
        success: true,
        message: '로그인되었습니다.',
        user: userInfo || data.user,
        session: data.session
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      return {
        success: false,
        error: error.message,
        message: error.message
      }
    }
  }

  // 로그아웃
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) throw error

      return {
        success: true,
        message: '로그아웃되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '로그아웃에 실패했습니다.'
      }
    }
  }

  // 현재 사용자 정보 조회
  async getCurrentUser() {
    try {
      console.log('getCurrentUser 시작')
      
      // 타임아웃을 추가한 getUser 호출
      const getUserPromise = this.supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('getUser 타임아웃')), 5000)
      )
      
      const { data: { user }, error } = await Promise.race([getUserPromise, timeoutPromise])
      console.log('getUser 결과:', { user: user ? '있음' : '없음', error })
      
      if (error || !user) {
        console.log('Auth 사용자 없음')
        return {
          success: false,
          user: null
        }
      }

      console.log('Auth 사용자 확인:', user.email)

      // Users 테이블에서 상세 정보 조회 (UserRoles 테이블과 left join)
      console.log('Users 테이블 조회 시작, auth_id:', user.id)
      const { data: userInfo, error: userInfoError } = await this.supabase
        .from('Users')
        .select(`
          *,
          UserRoles(is_admin)
        `)
        .eq('auth_id', user.id)
        .maybeSingle()
      console.log('Users 테이블 조회 완료:', { userInfo: userInfo ? '있음' : '없음', userInfoError })

      if (userInfoError) {
        console.error('Users 테이블 조회 실패:', userInfoError)
        // Users 테이블에 없어도 Auth 사용자는 있으므로 Auth 사용자 정보 반환
        return {
          success: true,
          user: user
        }
      }

      if (!userInfo) {
        console.log('Users 테이블에 사용자 정보 없음, Auth 사용자 정보 반환')
        return {
          success: true,
          user: user
        }
      }

      // UserRoles 정보를 포함하여 반환
      const userWithRole = {
        ...userInfo,
        is_admin: userInfo.UserRoles?.is_admin || false
      }

      console.log('현재 사용자 정보!!!:', userWithRole)
      return {
        success: true,
        user: userWithRole
      }
    } catch (error) {
      console.error('현재 사용자 조회 오류:', error)
      return {
        success: false,
        error: error.message,
        user: null
      }
    }
  }



  // 비밀번호 변경
  async changePassword(currentPassword, newPassword) {
    try {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('로그인이 필요합니다.')
      }

      // 현재 비밀번호가 제공된 경우에만 확인
      if (currentPassword) {
      const { error: signInError } = await this.supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.')
        }
      }

      // 새 비밀번호로 업데이트
      const { error: updateError } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      return {
        success: true,
        message: '비밀번호가 변경되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '비밀번호 변경에 실패했습니다.'
      }
    }
  }

  // 비밀번호 재설정 이메일 발송
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      return {
        success: true,
        message: '비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인하여 비밀번호를 변경해주세요.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '비밀번호 재설정 이메일 발송에 실패했습니다.'
      }
    }
  }

  // 비밀번호 찾기 전 사용자 정보 확인
  async verifyUserForPasswordReset(email, name, phone) {
    try {
      console.log('비밀번호 찾기 사용자 확인:', { email, name, phone })
      
      // Users 테이블에서 이메일로 먼저 조회
      const { data, error } = await this.supabase
        .from('Users')
        .select('email, name, phone_number, mobile_number')
        .eq('email', email)
        .maybeSingle()

      if (error) {
        console.error('비밀번호 찾기 사용자 조회 실패:', error)
        throw error
      }

      if (!data) {
        console.log('일치하는 이메일의 사용자 정보 없음')
        return {
          success: false,
          error: '입력하신 정보로 등록된 계정을 찾을 수 없습니다.',
          message: '입력하신 정보로 등록된 계정을 찾을 수 없습니다.'
        }
      }

      // 이름과 전화번호가 일치하는지 확인
      const nameMatch = data.name === name
      const phoneMatch = data.phone_number === phone || data.mobile_number === phone

      if (!nameMatch || !phoneMatch) {
        console.log('이름 또는 전화번호 불일치')
        return {
          success: false,
          error: '입력하신 정보로 등록된 계정을 찾을 수 없습니다.',
          message: '입력하신 정보로 등록된 계정을 찾을 수 없습니다.'
        }
      }

      console.log('비밀번호 찾기 사용자 확인 성공:', data.email)
      return {
        success: true,
        user: data,
        message: '사용자 정보가 확인되었습니다.'
      }
    } catch (error) {
      console.error('비밀번호 찾기 사용자 확인 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '사용자 정보 확인에 실패했습니다.'
      }
    }
  }

  // 새 비밀번호 설정 (비밀번호 재설정 후)
  async updatePassword(newPassword) {
    try {
      console.log('updatePassword 호출됨:', { newPassword: newPassword ? '***' : 'undefined' })
      
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      console.log('updateUser 결과:', { data, error })

      if (error) {
        console.error('updateUser 에러:', error)
        throw error
      }

      console.log('비밀번호 변경 성공, 응답 반환')
      const result = {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      }
      console.log('반환할 결과:', result)
      return result
    } catch (error) {
      console.error('updatePassword 에러:', error)
      const result = {
        success: false,
        error: error.message,
        message: '비밀번호 변경에 실패했습니다.'
      }
      console.log('에러 결과 반환:', result)
      return result
    }
  }

  // 인증 상태 리스너
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  // 현재 세션 가져오기
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) throw error

      return {
        success: true,
        session: session
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        session: null
      }
    }
  }

  // 아이디(이메일) 찾기
  async findEmail(name, phone) {
    try {
      console.log('아이디 찾기 시도:', { name, phone })
      
      // Users 테이블에서 이름으로 먼저 조회
      const { data, error } = await this.supabase
        .from('Users')
        .select('email, name, phone_number, mobile_number')
        .eq('name', name)
        .maybeSingle()

      if (error) {
        console.error('아이디 찾기 조회 실패:', error)
        throw error
      }

      if (!data) {
        console.log('일치하는 이름의 사용자 정보 없음')
        return {
          success: false,
          error: '입력하신 정보로 등록된 아이디를 찾을 수 없습니다.',
          message: '입력하신 정보로 등록된 아이디를 찾을 수 없습니다.'
        }
      }

      // 전화번호가 일치하는지 확인
      const phoneMatch = data.phone_number === phone || data.mobile_number === phone

      if (!phoneMatch) {
        console.log('전화번호 불일치')
        return {
          success: false,
          error: '입력하신 정보로 등록된 아이디를 찾을 수 없습니다.',
          message: '입력하신 정보로 등록된 아이디를 찾을 수 없습니다.'
        }
      }

      console.log('아이디 찾기 성공:', data.email)
      return {
        success: true,
        email: data.email,
        message: `찾으시는 아이디는 "${data.email}" 입니다.`
      }
    } catch (error) {
      console.error('아이디 찾기 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '아이디 찾기에 실패했습니다.'
      }
    }
  }
}

export const authService = new AuthService() 

/**
 * 현재 사용자의 관리자 권한 확인
 * @returns {Promise<{success: boolean, isAdmin: boolean, error?: string}>}
 */
export async function checkAdminRole() {
  try {
    // 현재 로그인된 사용자 정보 가져오기
    const { data: userData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !userData?.user?.id) {
      return { success: false, isAdmin: false, error: '로그인이 필요합니다.' }
    }

    const auth_id = userData.user.id

    // UserRoles 테이블에서 관리자 권한 확인
    const { data, error } = await supabase
      .from('UserRoles')
      .select('is_admin')
      .eq('auth_id', auth_id)
      .single()

    if (error) {
      console.error('관리자 권한 확인 오류:', error)
      return { success: false, isAdmin: false, error: '권한 확인에 실패했습니다.' }
    }

    const isAdmin = data?.is_admin || false
    return { success: true, isAdmin }
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error)
    return { success: false, isAdmin: false, error: error.message }
  }
} 