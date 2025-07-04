import { supabase } from './supabase.js'

export class AuthService {
  constructor() {
    this.supabase = supabase
  }

  // 회원가입
  async signUp(userData, authData) {
    try {
      console.log('회원가입 시작:', userData)
      console.log('Auth 데이터:', authData)
      
      // authData 유효성 검사
      if (!authData || !authData.email || !authData.password) {
        throw new Error('이메일과 비밀번호가 필요합니다.')
      }
      
      // 1. Supabase Auth에 user_id를 이메일 형태로 저장
      const authEmail = `${userData.user_id}@travel-agency.local`
      const { data: authResult, error: authError } = await this.supabase.auth.signUp({
        email: authEmail,
        password: authData.password,
        options: {
          data: {
            user_id: userData.user_id,
            real_email: authData.email  // 실제 이메일은 metadata에 저장
          }
        }
      })

      if (authError) {
        console.error('Auth 생성 실패:', authError)
        throw authError
      }

      console.log('Auth 생성 성공:', authResult)

      // 2. Users 테이블에 상세 정보 저장 (비밀번호 제외)
      const { data: userTableData, error: userTableError } = await this.supabase
        .from('Users')
        .insert([userData])
        .select()

      if (userTableError) {
        console.error('Users 테이블 저장 실패:', userTableError)
        throw userTableError
      }

      console.log('Users 테이블 저장 성공:', userTableData[0])

      // 3. 회원가입 후 자동 로그인 시도 (이메일 확인 없이)
      let loginResult = null
      try {
        // 이메일 확인 없이 직접 로그인 시도
        const authEmail = `${userData.user_id}@travel-agency.local`
        const { data: signInData, error: signInError } = await this.supabase.auth.signInWithPassword({
          email: authEmail,
          password: authData.password
        })

        if (signInError) {
          console.error('자동 로그인 실패:', signInError)
          loginResult = { success: false, error: signInError.message }
        } else {
          console.log('자동 로그인 성공:', signInData)
          loginResult = { 
            success: true, 
            session: signInData.session,
            user: userTableData[0]
          }
        }
      } catch (loginError) {
        console.error('자동 로그인 실패:', loginError)
        loginResult = { success: false, error: loginError.message }
      }
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: userTableData[0],
        autoLogin: loginResult?.success || false,
        session: loginResult?.session || null,
        loginError: loginResult?.error || null
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
  async signIn(userId, password) {
    try {
      console.log('로그인 시도:', userId)
      
      // 1. user_id로 Users 테이블에서 사용자 존재 확인
      const { data: userData, error: userError } = await this.supabase
        .from('Users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (userError) {
        console.error('사용자 조회 실패:', userError)
        if (userError.code === 'PGRST116') {
          throw new Error('존재하지 않는 사용자입니다.')
        }
        throw new Error(`사용자 조회 오류: ${userError.message}`)
      }

      if (!userData) {
        console.error('사용자 데이터 없음:', userData)
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      }

      console.log('사용자 확인 성공:', userData.user_id)

      // 2. Supabase Auth로 로그인 (user_id@travel-agency.local, 비밀번호)
      const authEmail = `${userId}@travel-agency.local`
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: authEmail,
        password: password
      })

      if (error) {
        console.error('Auth 로그인 실패:', error)
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
        }
        throw new Error(`로그인 오류: ${error.message}`)
      }

      console.log('Auth 로그인 성공:', data)

      return {
        success: true,
        message: '로그인되었습니다.',
        user: userData,
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
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error || !user) {
        console.log('Auth 사용자 없음')
        return {
          success: false,
          user: null
        }
      }

      console.log('Auth 사용자 확인:', user.email)

      // user_id 추출 (user_id@travel-agency.local 형태에서)
      const userId = user.email.split('@')[0]
      console.log('추출된 user_id:', userId)

      // Users 테이블에서 상세 정보 조회
      const { data: userInfo, error: userInfoError } = await this.supabase
        .from('Users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (userInfoError) {
        console.error('Users 테이블 조회 실패:', userInfoError)
        throw userInfoError
      }

      console.log('현재 사용자 정보:', userInfo)
      return {
        success: true,
        user: userInfo
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

  // 사용자 ID 중복 확인
  async checkUserIdExists(userId) {
    try {
      const { data, error } = await this.supabase
        .from('Users')
        .select('user_id')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // 사용자가 존재하지 않는 경우
        return {
          exists: false,
          available: true
        }
      }

      if (error) throw error

      return {
        exists: true,
        available: false
      }
    } catch (error) {
      return {
        exists: false,
        available: true,
        error: error.message
      }
    }
  }

  // 이메일 중복 확인
  async checkEmailExists(email) {
    try {
      const { data, error } = await this.supabase
        .from('Users')
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code === 'PGRST116') {
        // 이메일이 존재하지 않는 경우
        return {
          exists: false,
          available: true
        }
      }

      if (error) throw error

      return {
        exists: true,
        available: false
      }
    } catch (error) {
      return {
        exists: false,
        available: true,
        error: error.message
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

      // 현재 비밀번호 확인
      const { error: signInError } = await this.supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.')
      }

      // 새 비밀번호로 업데이트
      const { error: updateError } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      // Users 테이블의 비밀번호도 업데이트
      const { error: userTableError } = await this.supabase
        .from('Users')
        .update({ user_password: newPassword })
        .eq('email', user.email)

      if (userTableError) throw userTableError

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

  // 인증 상태 리스너
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService() 