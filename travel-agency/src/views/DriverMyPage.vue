<template>
  <div class="driver-mypage">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>기사 정보를 불러오는 중...</p>
    </div>

    <!-- 기사 정보 -->
    <div v-else-if="driver" class="driver-info-container">
      <!-- 프로필 헤더 -->
      <div class="profile-header">
        <div class="profile-photo">
          <img 
            v-if="driver.driver_photo_url" 
            :src="driver.driver_photo_url" 
            :alt="driver.name"
            @error="handleImageError"
          >
          <div v-else class="no-photo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        <div class="profile-info">
          <h2 class="driver-name">{{ driver.name || '이름 없음' }}</h2>
          <p class="driver-email">{{ driver.email }}</p>
          <span :class="['status-badge', `status-${getDriverStatus(driver)}`]">
            {{ getStatusText(driver) }}
          </span>
        </div>
        <div class="profile-actions">
          <router-link to="/driver-edit" class="btn-edit">정보 수정</router-link>
        </div>
      </div>

      <!-- 기본 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">기본 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>이름</label>
            <div class="info-value">{{ driver.name }}</div>
          </div>
          <div class="info-item">
            <label>이메일</label>
            <div class="info-value">{{ driver.email }}</div>
          </div>
          <div class="info-item">
            <label>연락처</label>
            <div class="info-value">{{ driver.mobile_number }}</div>
          </div>
          <div class="info-item">
            <label>가입일</label>
            <div class="info-value">{{ formatDate(driver.created_at) }}</div>
          </div>
        </div>

      </div>

      <!-- 소속 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">소속 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>소속</label>
            <div class="info-value">{{ driver.driver_company || '미입력' }}</div>
          </div>
        </div>
      </div>

      <!-- 차량 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">차량 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>차량번호</label>
            <div class="info-value">{{ driver.driver_vehicle_number || '미입력' }}</div>
          </div>
          <div class="info-item">
            <label>차종</label>
            <div class="info-value">{{ driver.driver_vehicle_type || '미입력' }}</div>
          </div>
          <div class="info-item">
            <label>년식</label>
            <div class="info-value">{{ driver.driver_vehicle_year || '미입력' }}</div>
          </div>
          <div class="info-item">
            <label>승객 정원</label>
            <div class="info-value">{{ driver.driver_passenger_capacity ? `${driver.driver_passenger_capacity}인승` : '미입력' }}</div>
          </div>
        </div>
      </div>

      <!-- 차고지 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">차고지 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>우편번호</label>
            <div class="info-value">{{ driver.driver_garage_zipcode || '미입력' }}</div>
          </div>
          <div class="info-item full-width">
            <label>주소</label>
            <div class="info-value">{{ driver.driver_garage_address || '미입력' }}</div>
          </div>
        </div>
      </div>

      <!-- 차량 사진 섹션 -->
      <div class="info-section">
        <h2 class="section-title">차량 사진</h2>
        <div class="vehicle-images-grid">
          <div v-for="(url, index) in vehiclePhotos" :key="index" class="vehicle-image-item">
            <label>{{ getVehiclePhotoLabel(index) }}</label>
            <div class="vehicle-image-container">
              <img 
                v-if="url" 
                :src="url" 
                :alt="getVehiclePhotoLabel(index)"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>사진 없음</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 버스운전자격증 섹션 -->
      <div class="info-section">
        <h2 class="section-title">버스운전자격증</h2>
        <div class="license-image-container">
          <img 
            v-if="driver.driver_license_photo_url" 
            :src="driver.driver_license_photo_url" 
            alt="버스운전자격증"
            @error="handleImageError"
          >
          <div v-else class="no-image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>사진 없음</span>
          </div>
        </div>
      </div>

      <!-- 보험증권 섹션 -->
      <div class="info-section">
        <h2 class="section-title">보험증권</h2>
        <div class="license-image-container">
          <img 
            v-if="driver.driver_insurance_photo_url" 
            :src="driver.driver_insurance_photo_url" 
            alt="보험증권"
            @error="handleImageError"
          >
          <div v-else class="no-image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>사진 없음</span>
          </div>
        </div>
      </div>

      <!-- 자동차등록증 섹션 -->
      <div class="info-section">
        <h2 class="section-title">자동차등록증</h2>
        <div class="license-image-container">
          <img 
            v-if="driver.driver_registration_photo_url" 
            :src="driver.driver_registration_photo_url" 
            alt="자동차등록증"
            @error="handleImageError"
          >
          <div v-else class="no-image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>사진 없음</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else class="error-container">
      <p>기사 정보를 찾을 수 없습니다.</p>
      <button @click="goHome" class="btn-primary">홈으로 돌아가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase.js'

const router = useRouter()

// 반응형 데이터
const loading = ref(true)
const driver = ref(null)

// 차량 사진 배열
const vehiclePhotos = computed(() => {
  if (!driver.value?.driver_vehicle_photo_urls) return []
  return Array.isArray(driver.value.driver_vehicle_photo_urls) 
    ? driver.value.driver_vehicle_photo_urls 
    : []
})

// 기사 정보 가져오기
const fetchDriverInfo = async () => {
  try {
    loading.value = true
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('auth_id', user.id)
      .eq('is_driver', true)
      .single()
    
    if (error) {
      console.error('기사 정보 조회 실패:', error)
      throw error
    }
    
    driver.value = data
    
  } catch (error) {
    console.error('기사 정보 조회 오류:', error)
    alert('기사 정보를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// 기사 상태 가져오기
const getDriverStatus = (driver) => {
  if (!driver.driver_approved && driver.driver_active) return 'pending'
  if (driver.driver_approved && driver.driver_active) return 'approved'
  if (!driver.driver_approved && !driver.driver_active) return 'rejected'
  return 'unknown'
}

// 상태 텍스트
const getStatusText = (driver) => {
  if (!driver.driver_approved && driver.driver_active) return '승인 대기'
  if (driver.driver_approved && driver.driver_active) return '승인됨'
  if (!driver.driver_approved && !driver.driver_active) return '거부됨'
  return '알 수 없음'
}

// 차량 사진 라벨 가져오기
const getVehiclePhotoLabel = (index) => {
  const labels = ['대각측면', '차량정면', '좌석전체', '좌석측면']
  return labels[index] || `차량 사진 ${index + 1}`
}

// 사용 가능한 년도
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= 2013; year--) {
    years.push(year)
  }
  return years
})

// 사용 가능한 정원
const availableCapacities = computed(() => {
  const capacities = []
  for (let capacity = 15; capacity <= 45; capacity++) {
    capacities.push(capacity)
  }
  return capacities
})

// 이미지 로드 실패 처리
const handleImageError = (event) => {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  const noImage = parent.querySelector('.no-image')
  if (noImage) {
    noImage.style.display = 'flex'
  }
}

// 주소 찾기 (새 페이지에서 사용할 예정)
const findGarageAddress = () => {
  new daum.Postcode({
    oncomplete: function(data) {
      // 새 페이지에서 구현
    }
  }).open()
}

// 비밀번호 변경
const changePassword = () => {
  router.push('/reset-password')
}

// 회원 탈퇴
const withdrawAccount = () => {
  if (confirm('정말로 회원 탈퇴를 하시겠습니까?\n탈퇴 후에는 복구할 수 없습니다.')) {
    router.push('/withdraw')
  }
}

// 홈으로 가기
const goHome = () => {
  router.push('/')
}

// 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// 초기 로드
onMounted(() => {
  fetchDriverInfo()
})
</script>

<style scoped>
.driver-mypage {
  padding: 2rem;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.driver-info-container {
  margin-bottom: 0.5rem;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 프로필 헤더 */
.profile-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  flex-shrink: 0;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  color: var(--text-secondary);
}

.profile-info {
  flex: 1;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-edit {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-edit:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.driver-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.driver-email {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.status-message {
  margin: 0;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.status-message.success {
  background: #d1fae5;
  color: #065f46;
}

/* 정보 섹션 */
.info-section {
  padding: 0.5rem 1.5rem;
  margin-bottom: 0em;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-item span {
  color: var(--text-primary);
  font-size: 1rem;
}

.section-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background: var(--primary-dark);
}

/* 폼 입력 스타일 */
.info-value {
  padding: 0.75rem;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  color: var(--text-primary);
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}



/* 이미지 섹션 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* 차량 사진 섹션 */
.vehicle-images-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 570px;
}

.vehicle-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.vehicle-image-item label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-align: center;
}

.vehicle-image-container {
  width: 120px;
  height: 120px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--bg-light);
}

.vehicle-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 자격증 섹션 */
.license-images-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

.license-image-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.license-image-item label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.license-image-container {
  width: 120px;
  height: 120px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--bg-light);
}

.license-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-item label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.image-container {
  width: 100%;
  height: 200px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  background: var(--bg-light);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  gap: 0.5rem;
}

.no-image svg {
  color: var(--text-secondary);
}

.no-image span {
  font-size: 0.8rem;
}

/* 계정 관리 */
.account-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  background: var(--primary-color);
  color: white;
}

.btn-action:hover {
  background: var(--primary-dark);
}

/* 에러 상태 */
.error-container {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* 반응형 */
@media (max-width: 768px) {
  .driver-mypage {
    padding: 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .profile-header {
    flex-direction: row;
    text-align: left;
    gap: 1rem;
    padding: 1.4rem;
    align-items: center;
  }
  
  .profile-actions {
    margin-top: 0;
    flex-shrink: 0;
  }
  
  .profile-photo {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .vehicle-images-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    width: 100%;
  }
  
  .vehicle-image-container {
    width: 70px;
    height: 70px;
  }
  
  .license-images-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .license-image-container {
    height: 70px;
    width: 70px;
    object-fit: cover;
  }
  
  .account-actions {
    flex-direction: column;
  }
  
  .btn-action {
    width: 100%;
  }
}
</style> 