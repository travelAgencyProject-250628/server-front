<template>
  <div class="driver-detail">
    <!-- 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          목록으로
        </button>
        <h1 class="page-title">기사 상세정보</h1>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>기사 정보를 불러오는 중...</p>
    </div>

    <!-- 기사 정보 -->
    <div v-else-if="driver" class="driver-info-container">
      <!-- 기본 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">기본 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>기사 ID</label>
            <span>{{ driver.id }}</span>
          </div>
          <div class="info-item">
            <label>가입일</label>
            <span>{{ formatDate(driver.created_at) }}</span>
          </div>
          <div class="info-item">
            <label>이름</label>
            <span>{{ driver.name || '미입력' }}</span>
          </div>
          <div class="info-item">
            <label>이메일</label>
            <span>{{ driver.email }}</span>
          </div>
          <div class="info-item">
            <label>연락처</label>
            <span>{{ driver.mobile_number || '미입력' }}</span>
          </div>
          <div class="info-item">
            <label>상태</label>
            <span :class="['status-badge', `status-${getDriverStatus(driver)}`]">
              {{ getStatusText(driver) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 소속 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">소속 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>소속</label>
            <span>{{ driver.driver_company || '미입력' }}</span>
          </div>
        </div>
      </div>

      <!-- 차량 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">차량 정보</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>차량번호</label>
            <span>{{ driver.driver_vehicle_number || '미입력' }}</span>
          </div>
          <div class="info-item">
            <label>차종</label>
            <span>{{ driver.driver_vehicle_type || '미입력' }}</span>
          </div>
          <div class="info-item">
            <label>년식</label>
            <span>{{ driver.driver_vehicle_year || '미입력' }}</span>
          </div>
          <div class="info-item">
            <label>승객 정원</label>
            <span>{{ driver.driver_passenger_capacity ? `${driver.driver_passenger_capacity}인승` : '미입력' }}</span>
          </div>
        </div>
      </div>

      <!-- 차고지 정보 섹션 -->
      <div class="info-section">
        <h2 class="section-title">차고지 정보</h2>
        <div class="info-grid">
          <div class="info-item full-width">
            <label>우편번호</label>
            <span>{{ driver.driver_garage_zipcode || '미입력' }}</span>
          </div>
          <div class="info-item full-width">
            <label>주소</label>
            <span>{{ driver.driver_garage_address || '미입력' }}</span>
          </div>
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div class="info-section">
        <h2 class="section-title">첨부 이미지</h2>
        <div class="images-grid">
          <!-- 기사 사진 -->
          <div class="image-item">
            <label>기사 사진</label>
            <div class="image-container">
              <img 
                v-if="driver.driver_photo_url" 
                :src="driver.driver_photo_url" 
                :alt="driver.name"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                <span>사진 없음</span>
              </div>
            </div>
          </div>

          <!-- 자격증 -->
          <div class="image-item">
            <label>버스운전자격증</label>
            <div class="image-container">
              <img 
                v-if="driver.driver_license_photo_url" 
                :src="driver.driver_license_photo_url" 
                alt="자격증"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>사진 없음</span>
              </div>
            </div>
          </div>

          <!-- 보험증권 -->
          <div class="image-item">
            <label>보험증권</label>
            <div class="image-container">
              <img 
                v-if="driver.driver_insurance_photo_url" 
                :src="driver.driver_insurance_photo_url" 
                alt="보험증권"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>사진 없음</span>
              </div>
            </div>
          </div>

          <!-- 등록증 -->
          <div class="image-item">
            <label>자동차등록증</label>
            <div class="image-container">
              <img 
                v-if="driver.driver_registration_photo_url" 
                :src="driver.driver_registration_photo_url" 
                alt="등록증"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>사진 없음</span>
              </div>
            </div>
          </div>

          <!-- 차량 사진들 -->
          <div v-for="(url, index) in vehiclePhotos" :key="index" class="image-item">
            <label>{{ getVehiclePhotoLabel(index) }}</label>
            <div class="image-container">
              <img 
                v-if="url" 
                :src="url" 
                :alt="getVehiclePhotoLabel(index)"
                @error="handleImageError"
              >
              <div v-else class="no-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
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

      <!-- 관리 액션 -->
      <div class="actions-section">
        <h2 class="section-title">관리 액션</h2>
        <div class="action-buttons">
          <button 
            @click="updateDriverStatus(driver.id, !driver.driver_approved, driver.driver_active)"
            :class="['btn-action', driver.driver_approved ? 'btn-reject' : 'btn-approve']"
          >
            {{ driver.driver_approved ? '승인 취소' : '승인' }}
          </button>
          <button 
            @click="toggleDriverActive(driver.id, !driver.driver_active)"
            :class="['btn-action', driver.driver_active ? 'btn-deactivate' : 'btn-activate']"
          >
            {{ driver.driver_active ? '비활성화' : '활성화' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else class="error-container">
      <p>기사 정보를 찾을 수 없습니다.</p>
      <button @click="goBack" class="btn-primary">목록으로 돌아가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase.js'

const router = useRouter()
const route = useRoute()

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
const fetchDriverDetail = async () => {
  try {
    loading.value = true
    
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', route.params.id)
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

// 기사 상태 업데이트
const updateDriverStatus = async (driverId, approved, active) => {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ 
        driver_approved: approved,
        driver_active: active 
      })
      .eq('id', driverId)
    
    if (error) throw error
    
    // 로컬 데이터 업데이트
    driver.value.driver_approved = approved
    driver.value.driver_active = active
    
    alert(approved ? '기사가 승인되었습니다.' : '기사 승인이 취소되었습니다.')
    
  } catch (error) {
    console.error('기사 상태 업데이트 실패:', error)
    alert('기사 상태 업데이트에 실패했습니다.')
  }
}

// 기사 활성화/비활성화 토글
const toggleDriverActive = async (driverId, active) => {
  try {
    const { error } = await supabase
      .from('Users')
      .update({ driver_active: active })
      .eq('id', driverId)
    
    if (error) throw error
    
    // 로컬 데이터 업데이트
    driver.value.driver_active = active
    
    alert(active ? '기사가 활성화되었습니다.' : '기사가 비활성화되었습니다.')
    
  } catch (error) {
    console.error('기사 활성화 상태 변경 실패:', error)
    alert('기사 활성화 상태 변경에 실패했습니다.')
  }
}

// 이미지 로드 실패 처리
const handleImageError = (event) => {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  const noImage = parent.querySelector('.no-image')
  if (noImage) {
    noImage.style.display = 'flex'
  }
}

// 뒤로 가기
const goBack = () => {
  router.push('/admin/drivers')
}

// 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// 차량 사진 라벨 가져오기
const getVehiclePhotoLabel = (index) => {
  const labels = ['대각측면', '차량정면', '좌석전체', '좌석측면']
  return labels[index] || `차량 사진 ${index + 1}`
}

// 초기 로드
onMounted(() => {
  fetchDriverDetail()
})
</script>

<style scoped>
.driver-detail {
  padding: 2rem;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

/* 헤더 */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: var(--primary-dark);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
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

/* 정보 섹션 */
.info-section {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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

/* 상태 배지 */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
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

/* 이미지 섹션 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
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

/* 액션 섹션 */
.actions-section {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.action-buttons {
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
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}

.btn-activate {
  background: #10b981;
  color: white;
}

.btn-activate:hover {
  background: #059669;
}

.btn-deactivate {
  background: #f59e0b;
  color: white;
}

.btn-deactivate:hover {
  background: #d97706;
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
  .driver-detail {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-action {
    width: 100%;
  }
}
</style> 