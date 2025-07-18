import { supabase } from './supabase.js'

export class AuthService {
  constructor() {
    this.supabase = supabase
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
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error || !user) {
        console.log('Auth 사용자 없음')
        return {
          success: false,
          user: null
        }
      }

      console.log('Auth 사용자 확인:', user.email)

      // Users 테이블에서 상세 정보 조회 (UserRoles 테이블과 left join)
      const { data: userInfo, error: userInfoError } = await this.supabase
        .from('Users')
        .select(`
          *,
          UserRoles(is_admin)
        `)
        .eq('auth_id', user.id)
        .maybeSingle()

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

      console.log('현재 사용자 정보:', userWithRole)
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
        message: '비밀번호 재설정 이메일이 발송되었습니다.'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '비밀번호 재설정 이메일 발송에 실패했습니다.'
      }
    }
  }

  // 새 비밀번호 설정 (비밀번호 재설정 후)
  async updatePassword(newPassword) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
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
}

export const authService = new AuthService() 