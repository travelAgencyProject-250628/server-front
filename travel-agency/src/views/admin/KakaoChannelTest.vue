<template>
  <div class="kakao-test-container">
    <h1>카카오톡 알림톡 테스트</h1>
    
    <!-- 서버 상태 확인 -->
    <div class="server-status">
      <h3>서버 상태</h3>
      <div class="status-buttons">
        <button @click="checkHealth" :disabled="loading.health">
          {{ loading.health ? '확인 중...' : '헬스 체크' }}
        </button>
        <button @click="checkBalance" :disabled="loading.balance">
          {{ loading.balance ? '확인 중...' : '잔액 조회' }}
        </button>
      </div>
      <div v-if="serverStatus" class="status-info">
        <p><strong>서버 상태:</strong> {{ serverStatus }}</p>
      </div>
      <div v-if="balanceInfo" class="balance-info">
        <p><strong>잔액 정보:</strong> {{ balanceInfo }}</p>
      </div>
    </div>

    <!-- 카카오톡 알림톡 테스트 -->
    <div class="alimtalk-test">
      <h3>카카오톡 알림톡 테스트</h3>
      <div class="form-group">
        <label>수신자 전화번호:</label>
        <input 
          v-model="testData.phoneNumber" 
          type="tel" 
          placeholder="01012345678"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>템플릿 타입:</label>
        <input 
          v-model="testData.templateType" 
          type="text" 
          placeholder="WELCOME"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>변수 (JSON 형식):</label>
        <textarea 
          v-model="testData.variablesJson" 
          placeholder='{"customerName": "홍길동", "productName": "제주도 여행"}'
          class="form-control"
          rows="4"
        ></textarea>
      </div>
      <button @click="sendTestAlimtalk" :disabled="loading.alimtalk" class="btn-primary">
        {{ loading.alimtalk ? '발송 중...' : '알림톡 발송 테스트' }}
      </button>
    </div>

    <!-- SMS 테스트 -->
    <div class="sms-test">
      <h3>SMS 테스트</h3>
      <div class="form-group">
        <label>수신자 전화번호:</label>
        <input 
          v-model="smsData.phoneNumber" 
          type="tel" 
          placeholder="01012345678"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>발신번호:</label>
        <input 
          v-model="smsData.fromNumber" 
          type="tel" 
          placeholder="발신번호"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>SMS 내용:</label>
        <textarea 
          v-model="smsData.message" 
          placeholder="안녕하세요! SMS 테스트입니다."
          class="form-control"
          rows="3"
        ></textarea>
      </div>
      <button @click="sendTestSMS" :disabled="loading.sms" class="btn-primary">
        {{ loading.sms ? '발송 중...' : 'SMS 발송 테스트' }}
      </button>
    </div>

    <!-- 예약 관련 알림톡 테스트 -->
    <div class="reservation-templates">
      <h3>예약 관련 알림톡 테스트</h3>
      <div class="template-buttons">
        <button @click="testReservationConfirmation" :disabled="loading.reservation">
          예약 확인 알림톡
        </button>
        <button @click="testReservationUpdate" :disabled="loading.reservation">
          예약 변경 알림톡
        </button>
        <button @click="testReservationCancellation" :disabled="loading.reservation">
          예약 취소 알림톡
        </button>
        <button @click="testDepartureReminder" :disabled="loading.reservation">
          출발 전 알림톡
        </button>
      </div>
    </div>

    <!-- 결과 표시 -->
    <div v-if="result" class="result-section">
      <h3>발송 결과</h3>
      <div :class="['result-box', result.success ? 'success' : 'error']">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  sendKakaoAlimtalk, 
  sendSMS, 
  getBalance, 
  healthCheck,
  sendReservationConfirmation,
  sendReservationUpdate,
  sendReservationCancellation,
  sendDepartureReminder
} from '@/lib/kakaoChannel.js';

export default {
  name: 'KakaoChannelTest',
  data() {
    return {
      loading: {
        health: false,
        balance: false,
        alimtalk: false,
        sms: false,
        reservation: false
      },
      serverStatus: null,
      balanceInfo: null,
      result: null,
      testData: {
        phoneNumber: '01044942688',
        templateType: 'WELCOME',
        variablesJson: '{"홍길동": "URL수정테스트", "url": "theshimtour.com"}'
      },
      smsData: {
        phoneNumber: '01044942688',
        fromNumber: '01038749300',
        message: '안녕하세요! SMS 테스트입니다.'
      }
    };
  },
  methods: {
    async checkHealth() {
      this.loading.health = true;
      try {
        const result = await healthCheck();
        this.serverStatus = result.success ? '정상' : `오류: ${result.error}`;
      } catch (error) {
        this.serverStatus = `오류: ${error.message}`;
      } finally {
        this.loading.health = false;
      }
    },
    
    async checkBalance() {
      this.loading.balance = true;
      try {
        const result = await getBalance();
        this.balanceInfo = result.success ? JSON.stringify(result.data) : `오류: ${result.error}`;
      } catch (error) {
        this.balanceInfo = `오류: ${error.message}`;
      } finally {
        this.loading.balance = false;
      }
    },
    
    async sendTestAlimtalk() {
      if (!this.testData.phoneNumber || !this.testData.templateType) {
        alert('전화번호와 템플릿 타입을 입력해주세요.');
        return;
      }
      
      this.loading.alimtalk = true;
      try {
        let variables = {};
        if (this.testData.variablesJson) {
          try {
            variables = JSON.parse(this.testData.variablesJson);
          } catch (e) {
            alert('변수 JSON 형식이 올바르지 않습니다.');
            return;
          }
        }
        
        const result = await sendKakaoAlimtalk(
          this.testData.phoneNumber,
          this.testData.templateType,
          variables
        );
        
        this.result = result;
        if (result.success) {
          alert('알림톡 발송이 완료되었습니다.');
        } else {
          alert(`알림톡 발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.alimtalk = false;
      }
    },
    
    async sendTestSMS() {
      if (!this.smsData.phoneNumber || !this.smsData.fromNumber || !this.smsData.message) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      
      this.loading.sms = true;
      try {
        const result = await sendSMS(
          this.smsData.phoneNumber,
          this.smsData.fromNumber,
          this.smsData.message
        );
        
        this.result = result;
        if (result.success) {
          alert('SMS 발송이 완료되었습니다.');
        } else {
          alert(`SMS 발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.sms = false;
      }
    },
    
    async testReservationConfirmation() {
      if (!this.testData.phoneNumber) {
        alert('전화번호를 입력해주세요.');
        return;
      }
      
      this.loading.reservation = true;
      try {
        const reservationData = {
          customerName: '홍길동',
          productName: '제주도 3박 4일 패키지',
          departureDate: '2024-01-15',
          reservationNumber: 'RES001',
          totalAmount: 150000,
          pickupLocation: '서울역',
          pickupTime: '08:00'
        };
        
        const result = await sendReservationConfirmation(this.testData.phoneNumber, reservationData);
        this.result = result;
        
        if (result.success) {
          alert('예약 확인 알림톡 발송이 완료되었습니다.');
        } else {
          alert(`발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.reservation = false;
      }
    },
    
    async testReservationUpdate() {
      if (!this.testData.phoneNumber) {
        alert('전화번호를 입력해주세요.');
        return;
      }
      
      this.loading.reservation = true;
      try {
        const reservationData = {
          customerName: '홍길동',
          productName: '제주도 3박 4일 패키지',
          departureDate: '2024-01-20',
          reservationNumber: 'RES001',
          changeDetails: '출발일이 2024-01-15에서 2024-01-20으로 변경되었습니다.'
        };
        
        const result = await sendReservationUpdate(this.testData.phoneNumber, reservationData);
        this.result = result;
        
        if (result.success) {
          alert('예약 변경 알림톡 발송이 완료되었습니다.');
        } else {
          alert(`발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.reservation = false;
      }
    },
    
    async testReservationCancellation() {
      if (!this.testData.phoneNumber) {
        alert('전화번호를 입력해주세요.');
        return;
      }
      
      this.loading.reservation = true;
      try {
        const reservationData = {
          customerName: '홍길동',
          productName: '제주도 3박 4일 패키지',
          departureDate: '2024-01-15',
          reservationNumber: 'RES001',
          refundAmount: 150000
        };
        
        const result = await sendReservationCancellation(this.testData.phoneNumber, reservationData);
        this.result = result;
        
        if (result.success) {
          alert('예약 취소 알림톡 발송이 완료되었습니다.');
        } else {
          alert(`발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.reservation = false;
      }
    },
    
    async testDepartureReminder() {
      if (!this.testData.phoneNumber) {
        alert('전화번호를 입력해주세요.');
        return;
      }
      
      this.loading.reservation = true;
      try {
        const reservationData = {
          customerName: '홍길동',
          productName: '제주도 3박 4일 패키지',
          departureDate: '2024-01-15',
          pickupLocation: '서울역',
          pickupTime: '08:00',
          guidePhone: '010-1234-5678'
        };
        
        const result = await sendDepartureReminder(this.testData.phoneNumber, reservationData);
        this.result = result;
        
        if (result.success) {
          alert('출발 전 알림톡 발송이 완료되었습니다.');
        } else {
          alert(`발송 실패: ${result.error}`);
        }
      } catch (error) {
        this.result = { success: false, error: error.message };
        alert(`오류: ${error.message}`);
      } finally {
        this.loading.reservation = false;
      }
    }
  },
  
  mounted() {
    // 페이지 로드 시 서버 상태 확인
    this.checkHealth();
  }
};
</script>

<style scoped>
.kakao-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

h3 {
  color: #555;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.server-status,
.alimtalk-test,
.sms-test,
.reservation-templates {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}

.status-buttons,
.template-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.status-info,
.balance-info {
  background: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.result-section {
  margin-top: 30px;
}

.result-box {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
}

.result-box.success {
  border-color: #28a745;
  background-color: #d4edda;
}

.result-box.error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.result-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

@media (max-width: 768px) {
  .kakao-test-container {
    padding: 10px;
  }
  
  .status-buttons,
  .template-buttons {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}
</style> 