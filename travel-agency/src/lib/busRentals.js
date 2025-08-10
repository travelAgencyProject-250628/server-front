import { supabase } from './supabase.js'

// 버스 대절 신청 저장
export async function createBusRental(rentalData) {
  try {
    // 1. Supabase에 버스 대절 신청 저장
    const { data, error } = await supabase
      .from('BusRentals')
      .insert([
        {
          content: rentalData,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error

    // 2. 카카오톡 알림톡 발송 요청
    try {
      await sendBusRentalNotification(rentalData)
    } catch (notificationError) {
      console.error('카카오톡 알림톡 발송 실패:', notificationError)
      // 알림톡 발송 실패는 전체 프로세스를 실패시키지 않음
    }

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 신청 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

// 버스 대절 신청 알림톡 발송
async function sendBusRentalNotification(rentalData) {
  try {
    // 관리자용 템플릿 변수 구성
    const templateVariables = {
      홍길동: rentalData.customerTypeName || '고객님',
      전화번호: rentalData.phoneNumber || '',
      상품이름: `${rentalData.busTypeName} ${rentalData.tripTypeName} 대절`,
      m_url: `theshimtour.com/admin/bus-rentals`, // 모바일 웹링크
      w_url: `theshimtour.com/admin/bus-rentals`  // PC 웹링크
    }

    // Flask 서버에 카카오톡 알림톡 발송 요청
    const response = await fetch('https://backend-server.fly.dev/send-kakao-alimtalk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '01044942688', // 관리자 전화번호 (환경변수로 관리하는 것이 좋음)
        template_type: 'ADMIN_TEMPLATE',
        variables: templateVariables
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('카카오톡 알림톡 발송 성공:', result)
    
    return { success: true, data: result }
  } catch (error) {
    console.error('카카오톡 알림톡 발송 실패:', error)
    throw error
  }
}

// 버스 대절 신청 목록 조회 (관리자용)
export async function getBusRentals() {
  try {
    const { data, error } = await supabase
      .from('BusRentals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 신청 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

// 버스 대절 신청 상태 업데이트 (연락완료 처리)
export async function updateBusRentalStatus(rentalId, status) {
  try {
    const { data, error } = await supabase
      .from('BusRentals')
      .update({ status: status })
      .eq('id', rentalId)
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('버스 대절 상태 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// 버스 대절 신청 삭제
export async function deleteBusRental(rentalId) {
  try {
    const { error } = await supabase
      .from('BusRentals')
      .delete()
      .eq('id', rentalId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('버스 대절 삭제 오류:', error)
    return { success: false, error: error.message }
  }
} 