import { supabase } from './supabase.js'

export class AuthService {
  constructor() {
    this.supabase = supabase
  }

  // 회원가입
  async signUp(userData) {
    try {
      console.log('회원가입 시작:', userData)
      
      // 1. Supabase Auth에 최소한의 정보만 저장 (이메일, 비밀번호)
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.user_password
      })

      if (authError) {
        console.error('Auth 생성 실패:', authError)
        throw authError
      }

      console.log('Auth 생성 성공:', authData)

      // 2. User 테이블에 상세 정보 저장
      const { data: userTableData, error: userTableError } = await this.supabase
        .from('User')
        .insert([userData])
        .select()

      if (userTableError) {
        console.error('User 테이블 저장 실패:', userTableError)
        throw userTableError
      }

      console.log('User 테이블 저장 성공:', userTableData[0])

      // 3. 회원가입 후 자동 로그인
      const loginResult = await this.signIn(userData.user_id, userData.user_password)
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: userTableData[0],
        autoLogin: loginResult.success,
        session: loginResult.session
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
      
      // 1. user_id로 User 테이블에서 이메일 조회
      const { data: userData, error: userError } = await this.supabase
        .from('User')
        .select('email')
        .eq('user_id', userId)
        .single()

      if (userError || !userData) {
        console.error('사용자 조회 실패:', userError)
        throw new Error('존재하지 않는 사용자입니다.')
      }

      console.log('사용자 이메일 조회 성공:', userData.email)

      // 2. Supabase Auth로 로그인 (이메일, 비밀번호)
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      })

      if (error) {
        console.error('Auth 로그인 실패:', error)
        throw error
      }

      console.log('Auth 로그인 성공')

      // 3. 로그인 성공 시 User 테이블에서 상세 정보 조회
      const { data: userInfo, error: userInfoError } = await this.supabase
        .from('User')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (userInfoError) {
        console.error('사용자 정보 조회 실패:', userInfoError)
        throw userInfoError
      }

      console.log('사용자 정보 조회 성공:', userInfo)

      return {
        success: true,
        message: '로그인되었습니다.',
        user: userInfo,
        session: data.session
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      return {
        success: false,
        error: error.message,
        message: '로그인에 실패했습니다.'
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

      // User 테이블에서 상세 정보 조회
      const { data: userInfo, error: userInfoError } = await this.supabase
        .from('User')
        .select('*')
        .eq('email', user.email)
        .single()

      if (userInfoError) {
        console.error('User 테이블 조회 실패:', userInfoError)
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
        .from('User')
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
        .from('User')
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

      // User 테이블의 비밀번호도 업데이트
      const { error: userTableError } = await this.supabase
        .from('User')
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