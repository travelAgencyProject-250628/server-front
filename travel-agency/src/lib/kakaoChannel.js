const SOLAPI_SERVER_URL = 'https://backend-server.fly.dev';
const SOLAPI_WELCOME_TEMPLATE_ID = import.meta.env.VITE_SOLAPI_WELCOME_TEMPLATE_ID || 'KA01TP221025083117992xkz17KyvNbr';

/**
 * 카카오톡 알림톡 발송
 * @param {string} to - 수신자 전화번호 (01012345678 형식)
 * @param {string} templateType - 템플릿 타입 (WELCOME, RESERVATION 등)
 * @param {Object} variables - 템플릿 변수들
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendKakaoAlimtalk(to, templateType, variables = {}) {
  try {
    const requestBody = {
      to: to,
      template_type: templateType,
      variables: variables
    };
    
    // console.log('카카오톡 알림톡 요청 데이터:', requestBody);
    
    const response = await fetch(`${SOLAPI_SERVER_URL}/send-kakao-alimtalk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('카카오톡 알림톡 발송 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * SMS 발송
 * @param {string} to - 수신자 전화번호 (01012345678 형식)
 * @param {string} from - 발신번호
 * @param {string} text - SMS 내용
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendSMS(to, from, text) {
  try {
    const response = await fetch(`${SOLAPI_SERVER_URL}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        from: from,
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('SMS 발송 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * SOLAPI 잔액 조회
 * @returns {Promise<Object>} 잔액 정보
 */
export async function getBalance() {
  try {
    const response = await fetch(`${SOLAPI_SERVER_URL}/balance`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('잔액 조회 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 서버 헬스 체크
 * @returns {Promise<Object>} 서버 상태
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${SOLAPI_SERVER_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('헬스 체크 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 예약 확인 알림톡 발송
 * @param {string} phoneNumber - 수신자 전화번호
 * @param {Object} reservationData - 예약 정보
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendReservationConfirmation(phoneNumber, reservationData) {
  const variables = {
    홍길동: reservationData.customerName || '고객님',
    url: 'theshimtour.com'
  };

  return await sendKakaoAlimtalk(phoneNumber, 'WELCOME', variables);
}

/**
 * 예약 변경 알림톡 발송
 * @param {string} phoneNumber - 수신자 전화번호
 * @param {Object} reservationData - 예약 정보
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendReservationUpdate(phoneNumber, reservationData) {
  const variables = {
    홍길동: reservationData.customerName || '고객님',
    url: 'theshimtour.com'
  };

  return await sendKakaoAlimtalk(phoneNumber, 'WELCOME', variables);
}

/**
 * 예약 취소 알림톡 발송
 * @param {string} phoneNumber - 수신자 전화번호
 * @param {Object} reservationData - 예약 정보
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendReservationCancellation(phoneNumber, reservationData) {
  const variables = {
    홍길동: reservationData.customerName || '고객님',
    url: 'theshimtour.com'
  };

  return await sendKakaoAlimtalk(phoneNumber, 'WELCOME', variables);
}

/**
 * 출발 전 알림톡 발송
 * @param {string} phoneNumber - 수신자 전화번호
 * @param {Object} reservationData - 예약 정보
 * @returns {Promise<Object>} 발송 결과
 */
export async function sendDepartureReminder(phoneNumber, reservationData) {
  const variables = {
    홍길동: reservationData.customerName || '고객님',
    url: 'theshimtour.com'
  };

  return await sendKakaoAlimtalk(phoneNumber, 'WELCOME', variables);
} 