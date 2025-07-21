import { supabase } from './supabase.js'

export async function sendEmail(emailData) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    })
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('이메일 전송 오류:', error)
    return { success: false, error: error.message }
  }
}

// 예약 확인 이메일 전송
export async function sendBookingConfirmationEmail(bookingData) {
  const emailContent = `
    <h1>예약이 확인되었습니다!</h1>
    <p>안녕하세요, ${bookingData.customerName}님</p>
    <p>다음과 같이 예약이 확인되었습니다:</p>
    <ul>
      <li>상품명: ${bookingData.productName}</li>
      <li>출발일: ${bookingData.departureDate}</li>
      <li>성인: ${bookingData.adultCount}명</li>
      <li>아동: ${bookingData.childCount}명</li>
      <li>총 금액: ${bookingData.totalAmount}원</li>
    </ul>
    <p>감사합니다.</p>
  `
  
  return await sendEmail({
    to: bookingData.customerEmail,
    subject: '예약 확인 이메일',
    content: emailContent
  })
}

// 예약 취소 이메일 전송
export async function sendBookingCancellationEmail(bookingData) {
  const emailContent = `
    <h1>예약이 취소되었습니다</h1>
    <p>안녕하세요, ${bookingData.customerName}님</p>
    <p>다음 예약이 취소되었습니다:</p>
    <ul>
      <li>상품명: ${bookingData.productName}</li>
      <li>출발일: ${bookingData.departureDate}</li>
    </ul>
    <p>문의사항이 있으시면 연락주세요.</p>
  `
  
  return await sendEmail({
    to: bookingData.customerEmail,
    subject: '예약 취소 안내',
    content: emailContent
  })
} 