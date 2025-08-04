<template>
  <div class="driver-edit">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>정보를 불러오는 중...</p>
    </div>

    <!-- 메인 컨텐츠 -->
    <div v-else-if="driver" class="driver-edit-container">
      <div class="page-header">
        <router-link to="/driver-mypage" class="btn-back">← 마이페이지로</router-link>
      </div>    

      <div class="driver-info-container">
        <!-- 프로필 헤더 -->
        <div class="profile-header">
          <div class="file-upload-area" @click="triggerFileInput('driverPhotoInput')">
            <input type="file" 
              ref="driverPhotoInput"
              @change="handleDriverPhotoUpload" 
              accept="image/*"
              class="file-input">
            <div class="upload-preview" v-if="driverPhotoPreview">
              <img :src="driverPhotoPreview" alt="기사 사진" class="preview-image">
              <button type="button" @click.stop="removeDriverPhoto" class="remove-btn">X</button>
            </div>
            <div v-else class="upload-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>기사 사진을 업로드하세요</span>
            </div>
          </div>
          <div class="profile-info">
            <h2 class="driver-name">{{ driver.name }}</h2>
            <p class="driver-email">{{ driver.email }}</p>
            <div class="status-badge" :class="getDriverStatus(driver)">
              {{ getStatusText(driver) }}
            </div>
          </div>
        </div>

        <!-- 상태 카드 -->
        <div class="status-card">
          <div v-if="!driver.driver_approved && driver.driver_active" class="status-message warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>승인 대기 중입니다. 관리자 승인 후 서비스를 이용할 수 있습니다.</span>
          </div>
        </div>

        <!-- 기본 정보 섹션 -->
        <div class="info-section">
          <h2 class="section-title">기본 정보</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>이름</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="form-input"
                required
              >
            </div>
            <div class="info-item">
              <label>이메일</label>
              <input 
                v-model="formData.email" 
                type="email" 
                class="form-input"
                disabled
              >
            </div>
            <div class="info-item">
              <label>연락처</label>
              <input 
                v-model="formData.mobile_number" 
                type="tel" 
                class="form-input"
                required
              >
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
              <input 
                v-model="formData.driver_company" 
                type="text" 
                class="form-input"
              >
            </div>
          </div>
        </div>

        <!-- 차량 정보 섹션 -->
        <div class="info-section">
          <h2 class="section-title">차량 정보</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>차량번호</label>
              <input 
                v-model="formData.driver_vehicle_number" 
                type="text" 
                class="form-input"
                placeholder="예: 12가3456"
              >
            </div>
            <div class="info-item">
              <label>차종</label>
              <select 
                v-model="formData.driver_vehicle_type" 
                class="form-input"
              >
                <option value="">차종 선택</option>
                <option value="현대 쏠라티 (15인승)">현대 쏠라티 (15인승)</option>
                <option value="현대 쏠라티 (25인승)">현대 쏠라티 (25인승)</option>
                <option value="현대 쏠라티 (28인승)">현대 쏠라티 (28인승)</option>
                <option value="현대 쏠라티 (35인승)">현대 쏠라티 (35인승)</option>
                <option value="현대 쏠라티 (45인승)">현대 쏠라티 (45인승)</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div class="info-item">
              <label>년식</label>
              <select 
                v-model="formData.driver_vehicle_year" 
                class="form-input"
              >
                <option value="">년식 선택</option>
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="info-item">
              <label>승객 정원</label>
              <select 
                v-model="formData.driver_passenger_capacity" 
                class="form-input"
              >
                <option value="">정원 선택</option>
                <option v-for="capacity in availableCapacities" :key="capacity" :value="capacity">{{ capacity }}인승</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 차고지 정보 섹션 -->
        <div class="info-section">
          <h2 class="section-title">차고지 정보</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>우편번호</label>
              <input 
                v-model="formData.driver_garage_zipcode" 
                type="text" 
                class="form-input"
                @click="findGarageAddress"
                readonly
              >
            </div>
            <div class="info-item full-width">
              <label>주소</label>
              <input 
                v-model="formData.driver_garage_address" 
                type="text" 
                class="form-input"
              >
            </div>
          </div>
        </div>
        <!-- 차량 사진 섹션 -->
        <div class="info-section">
          <h2 class="section-title">차량 사진</h2>
          <div class="vehicle-images-grid">
            <div class="vehicle-image-item">
              <label>{{ getVehiclePhotoLabel(0) }}</label>
              <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto1Input')">
                <input type="file" 
                  ref="vehiclePhoto1Input"
                  @change="handleVehiclePhoto1Upload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="vehiclePhoto1Preview">
                  <img :src="vehiclePhoto1Preview" :alt="getVehiclePhotoLabel(0)" class="preview-image">
                  <button type="button" @click.stop="removeVehiclePhoto1" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{{ getVehiclePhotoLabel(0) }} 사진을 업로드하세요</span>
                </div>
              </div>
            </div>

            <div class="vehicle-image-item">
              <label>{{ getVehiclePhotoLabel(1) }}</label>
              <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto2Input')">
                <input type="file" 
                  ref="vehiclePhoto2Input"
                  @change="handleVehiclePhoto2Upload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="vehiclePhoto2Preview">
                  <img :src="vehiclePhoto2Preview" :alt="getVehiclePhotoLabel(1)" class="preview-image">
                  <button type="button" @click.stop="removeVehiclePhoto2" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{{ getVehiclePhotoLabel(1) }} 사진을 업로드하세요</span>
                </div>
              </div>
            </div>

            <div class="vehicle-image-item">
              <label>{{ getVehiclePhotoLabel(2) }}</label>
              <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto3Input')">
                <input type="file" 
                  ref="vehiclePhoto3Input"
                  @change="handleVehiclePhoto3Upload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="vehiclePhoto3Preview">
                  <img :src="vehiclePhoto3Preview" :alt="getVehiclePhotoLabel(2)" class="preview-image">
                  <button type="button" @click.stop="removeVehiclePhoto3" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{{ getVehiclePhotoLabel(2) }} 사진을 업로드하세요</span>
                </div>
              </div>
            </div>

            <div class="vehicle-image-item">
              <label>{{ getVehiclePhotoLabel(3) }}</label>
              <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto4Input')">
                <input type="file" 
                  ref="vehiclePhoto4Input"
                  @change="handleVehiclePhoto4Upload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="vehiclePhoto4Preview">
                  <img :src="vehiclePhoto4Preview" :alt="getVehiclePhotoLabel(3)" class="preview-image">
                  <button type="button" @click.stop="removeVehiclePhoto4" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{{ getVehiclePhotoLabel(3) }} 사진을 업로드하세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- 버스운전자격증 섹션 -->
        <div class="info-section">
          <h2 class="section-title">버스운전자격증</h2>
          <div class="license-images-grid">
            <div class="license-image-item">
              <div class="file-upload-area" @click="triggerFileInput('licensePhotoInput')">
                <input type="file" 
                  ref="licensePhotoInput"
                  @change="handleLicensePhotoUpload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="licensePhotoPreview">
                  <img :src="licensePhotoPreview" alt="버스운전자격증" class="preview-image">
                  <button type="button" @click.stop="removeLicensePhoto" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>버스운전자격증을 업로드하세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 보험증권 섹션 -->
        <div class="info-section">
          <h2 class="section-title">보험증권</h2>
          <div class="license-images-grid">
            <div class="license-image-item">
              <div class="file-upload-area" @click="triggerFileInput('insurancePhotoInput')">
                <input type="file" 
                  ref="insurancePhotoInput"
                  @change="handleInsurancePhotoUpload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="insurancePhotoPreview">
                  <img :src="insurancePhotoPreview" alt="보험증권" class="preview-image">
                  <button type="button" @click.stop="removeInsurancePhoto" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>보험증권을 업로드하세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 자동차등록증 섹션 -->
        <div class="info-section">
          <h2 class="section-title">자동차등록증</h2>
          <div class="license-images-grid">
            <div class="license-image-item">
              <div class="file-upload-area" @click="triggerFileInput('registrationPhotoInput')">
                <input type="file" 
                  ref="registrationPhotoInput"
                  @change="handleRegistrationPhotoUpload" 
                  accept="image/*"
                  class="file-input">
                <div class="upload-preview" v-if="registrationPhotoPreview">
                  <img :src="registrationPhotoPreview" alt="자동차등록증" class="preview-image">
                  <button type="button" @click.stop="removeRegistrationPhoto" class="remove-btn">X</button>
                </div>
                <div v-else class="upload-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>자동차등록증을 업로드하세요</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 계정 관리 섹션 -->
        <div class="info-section">
          <h2 class="section-title">계정 관리</h2>
          <div class="account-actions">
            <button @click="changePassword" class="btn-action">비밀번호 변경</button>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <div class="form-actions">
          <button @click="handleSubmit" class="btn-submit" :disabled="submitting">
            {{ submitting ? '저장 중...' : '정보 저장' }}
          </button>
          <router-link to="/driver-mypage" class="btn-cancel">취소</router-link>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else class="error-container">
      <p>기사 정보를 찾을 수 없습니다.</p>
      <router-link to="/driver-mypage" class="btn-primary">마이페이지로 돌아가기</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase.js'
import { 
  getDriverInfo, 
  updateDriverInfo, 
  updateDriverPhoto, 
  deleteDriverPhoto,
  updateVehiclePhotos,
  updateLicensePhoto,
  deleteLicensePhoto,
  updateInsurancePhoto,
  deleteInsurancePhoto,
  updateRegistrationPhoto,
  deleteRegistrationPhoto
} from '@/lib/drivers.js'

const router = useRouter()

// 반응형 데이터
const loading = ref(true)
const submitting = ref(false)
const driver = ref(null)

// 파일 입력 refs
const driverPhotoInput = ref(null)
const vehiclePhoto1Input = ref(null)
const vehiclePhoto2Input = ref(null)
const vehiclePhoto3Input = ref(null)
const vehiclePhoto4Input = ref(null)
const licensePhotoInput = ref(null)
const insurancePhotoInput = ref(null)
const registrationPhotoInput = ref(null)

// 파일 미리보기
const driverPhotoPreview = ref(null)
const vehiclePhoto1Preview = ref(null)
const vehiclePhoto2Preview = ref(null)
const vehiclePhoto3Preview = ref(null)
const vehiclePhoto4Preview = ref(null)
const licensePhotoPreview = ref(null)
const insurancePhotoPreview = ref(null)
const registrationPhotoPreview = ref(null)
const formData = ref({
  name: '',
  email: '',
  mobile_number: '',
  driver_company: '',
  driver_vehicle_number: '',
  driver_vehicle_type: '',
  driver_vehicle_year: '',
  driver_passenger_capacity: '',
  driver_garage_zipcode: '',
  driver_garage_address: ''
})

// 차량 사진 배열
const vehiclePhotos = computed(() => {
  if (!driver.value?.driver_vehicle_photo_urls) return []
  return Array.isArray(driver.value.driver_vehicle_photo_urls) 
    ? driver.value.driver_vehicle_photo_urls 
    : []
})

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

// 기사 정보 가져오기
const fetchDriverInfo = async () => {
  try {
    loading.value = true
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    const result = await getDriverInfo(user.id)
    if (!result.success) {
      throw new Error(result.error)
    }
    
    driver.value = result.data
    
    // 폼 데이터 초기화
    formData.value = {
      name: result.data.name || '',
      email: result.data.email || '',
      mobile_number: result.data.mobile_number || '',
      driver_company: result.data.driver_company || '',
      driver_vehicle_number: result.data.driver_vehicle_number || '',
      driver_vehicle_type: result.data.driver_vehicle_type || '',
      driver_vehicle_year: result.data.driver_vehicle_year || '',
      driver_passenger_capacity: result.data.driver_passenger_capacity || '',
      driver_garage_zipcode: result.data.driver_garage_zipcode || '',
      driver_garage_address: result.data.driver_garage_address || ''
    }

    // 이미지 미리보기 설정
    driverPhotoPreview.value = result.data.driver_photo_url || null
    if (result.data.driver_vehicle_photo_urls && Array.isArray(result.data.driver_vehicle_photo_urls)) {
      vehiclePhoto1Preview.value = result.data.driver_vehicle_photo_urls[0] || null
      vehiclePhoto2Preview.value = result.data.driver_vehicle_photo_urls[1] || null
      vehiclePhoto3Preview.value = result.data.driver_vehicle_photo_urls[2] || null
      vehiclePhoto4Preview.value = result.data.driver_vehicle_photo_urls[3] || null
    }
    licensePhotoPreview.value = result.data.driver_license_photo_url || null
    insurancePhotoPreview.value = result.data.driver_insurance_photo_url || null
    registrationPhotoPreview.value = result.data.driver_registration_photo_url || null
    
  } catch (error) {
    console.error('기사 정보 조회 오류:', error)
    console.error('에러 상세 정보:', {
      message: error.message,
      stack: error.stack,
      result: error
    })
    alert(`기사 정보를 불러오는데 실패했습니다: ${error.message}`)
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

// 이미지 로드 실패 처리
const handleImageError = (event) => {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  const noImage = parent.querySelector('.no-image')
  if (noImage) {
    noImage.style.display = 'flex'
  }
}

// 주소 찾기
const findGarageAddress = () => {
  new window.daum.Postcode({
    oncomplete: function(data) {
      formData.value.driver_garage_zipcode = data.zonecode
      formData.value.driver_garage_address = data.address
    }
  }).open()
}

// 파일 입력 트리거
const triggerFileInput = (inputRefName) => {
  const inputRef = eval(inputRefName)
  if (inputRef && inputRef.value) {
    inputRef.value.click()
  }
}

// 기사 사진 업로드 처리
const handleDriverPhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'driver')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    driver.value.driver_photo_url = result.url
    driverPhotoPreview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateDriverPhoto(driver.value.auth_id, result.url)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('기사 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('기사 사진 업로드 실패:', error)
    alert('기사 사진 업로드에 실패했습니다.')
  }
}

// 기사 사진 삭제
const removeDriverPhoto = async () => {
  if (!confirm('이 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    driver.value.driver_photo_url = null
    driverPhotoPreview.value = null
    
    // DB 업데이트
    const updateResult = await deleteDriverPhoto(driver.value.auth_id)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('기사 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('기사 사진 삭제 실패:', error)
    alert('기사 사진 삭제에 실패했습니다.')
  }
}

// 차량 사진 1 업로드 처리
const handleVehiclePhoto1Upload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'vehicle1')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[0] = result.url
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto1Preview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('차량 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 업로드 실패:', error)
    alert('차량 사진 업로드에 실패했습니다.')
  }
}

// 차량 사진 1 삭제
const removeVehiclePhoto1 = async () => {
  if (!confirm('이 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[0] = null
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto1Preview.value = null
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('차량 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 삭제 실패:', error)
    alert('차량 사진 삭제에 실패했습니다.')
  }
}

// 차량 사진 2 업로드 처리
const handleVehiclePhoto2Upload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'vehicle2')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[1] = result.url
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto2Preview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('차량 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 업로드 실패:', error)
    alert('차량 사진 업로드에 실패했습니다.')
  }
}

// 차량 사진 2 삭제
const removeVehiclePhoto2 = async () => {
  if (!confirm('이 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[1] = null
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto2Preview.value = null
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('차량 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 삭제 실패:', error)
    alert('차량 사진 삭제에 실패했습니다.')
  }
}

// 차량 사진 3 업로드 처리
const handleVehiclePhoto3Upload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'vehicle3')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[2] = result.url
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto3Preview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('차량 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 업로드 실패:', error)
    alert('차량 사진 업로드에 실패했습니다.')
  }
}

// 차량 사진 3 삭제
const removeVehiclePhoto3 = async () => {
  if (!confirm('이 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[2] = null
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto3Preview.value = null
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('차량 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 삭제 실패:', error)
    alert('차량 사진 삭제에 실패했습니다.')
  }
}

// 차량 사진 4 업로드 처리
const handleVehiclePhoto4Upload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'vehicle4')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[3] = result.url
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto4Preview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('차량 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 업로드 실패:', error)
    alert('차량 사진 업로드에 실패했습니다.')
  }
}

// 차량 사진 4 삭제
const removeVehiclePhoto4 = async () => {
  if (!confirm('이 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    const newPhotos = [...(driver.value.driver_vehicle_photo_urls || [])]
    newPhotos[3] = null
    driver.value.driver_vehicle_photo_urls = newPhotos
    vehiclePhoto4Preview.value = null
    
    // DB 업데이트
    const updateResult = await updateVehiclePhotos(driver.value.auth_id, newPhotos)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('차량 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('차량 사진 삭제 실패:', error)
    alert('차량 사진 삭제에 실패했습니다.')
  }
}

// 자격증 사진 업로드 처리
const handleLicensePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'license')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    driver.value.driver_license_photo_url = result.url
    licensePhotoPreview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateLicensePhoto(driver.value.auth_id, result.url)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('자격증 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('자격증 사진 업로드 실패:', error)
    alert('자격증 사진 업로드에 실패했습니다.')
  }
}

// 자격증 사진 삭제
const removeLicensePhoto = async () => {
  if (!confirm('자격증 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    driver.value.driver_license_photo_url = null
    licensePhotoPreview.value = null
    
    // DB 업데이트
    const updateResult = await deleteLicensePhoto(driver.value.auth_id)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('자격증 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('자격증 사진 삭제 실패:', error)
    alert('자격증 사진 삭제에 실패했습니다.')
  }
}

// 보험증권 사진 업로드 처리
const handleInsurancePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'insurance')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    driver.value.driver_insurance_photo_url = result.url
    insurancePhotoPreview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateInsurancePhoto(driver.value.auth_id, result.url)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('보험증권 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('보험증권 사진 업로드 실패:', error)
    alert('보험증권 사진 업로드에 실패했습니다.')
  }
}

// 보험증권 사진 삭제
const removeInsurancePhoto = async () => {
  if (!confirm('보험증권 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    driver.value.driver_insurance_photo_url = null
    insurancePhotoPreview.value = null
    
    // DB 업데이트
    const updateResult = await deleteInsurancePhoto(driver.value.auth_id)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('보험증권 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('보험증권 사진 삭제 실패:', error)
    alert('보험증권 사진 삭제에 실패했습니다.')
  }
}

// 등록증 사진 업로드 처리
const handleRegistrationPhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // R2에 업로드
    const { uploadDriverImageToR2 } = await import('@/lib/r2-upload.js')
    const driverId = `driver_${driver.value.id}`
    const result = await uploadDriverImageToR2(file, driverId, 'registration')
    
    if (!result.success) {
      throw new Error(result.error || '업로드 실패')
    }
    
    // 로컬 상태 업데이트
    driver.value.driver_registration_photo_url = result.url
    registrationPhotoPreview.value = result.url
    
    // DB 업데이트
    const updateResult = await updateRegistrationPhoto(driver.value.auth_id, result.url)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    // 파일 입력 초기화
    event.target.value = ''
    
    alert('등록증 사진이 업로드되었습니다.')
    
  } catch (error) {
    console.error('등록증 사진 업로드 실패:', error)
    alert('등록증 사진 업로드에 실패했습니다.')
  }
}

// 등록증 사진 삭제
const removeRegistrationPhoto = async () => {
  if (!confirm('등록증 사진을 삭제하시겠습니까?')) return

  try {
    // 로컬 상태 업데이트
    driver.value.driver_registration_photo_url = null
    registrationPhotoPreview.value = null
    
    // DB 업데이트
    const updateResult = await deleteRegistrationPhoto(driver.value.auth_id)
    if (!updateResult.success) {
      throw new Error(updateResult.error)
    }
    
    alert('등록증 사진이 삭제되었습니다.')
    
  } catch (error) {
    console.error('등록증 사진 삭제 실패:', error)
    alert('등록증 사진 삭제에 실패했습니다.')
  }
}

// 비밀번호 변경
const changePassword = () => {
  router.push('/reset-password')
}

// 폼 제출
const handleSubmit = async () => {
  try {
    submitting.value = true
    
    const updateResult = await updateDriverInfo(driver.value.auth_id, {
      name: formData.value.name,
      mobile_number: formData.value.mobile_number,
      driver_company: formData.value.driver_company,
      driver_vehicle_number: formData.value.driver_vehicle_number,
      driver_vehicle_type: formData.value.driver_vehicle_type,
      driver_vehicle_year: formData.value.driver_vehicle_year,
      driver_passenger_capacity: formData.value.driver_passenger_capacity,
      driver_garage_zipcode: formData.value.driver_garage_zipcode,
      driver_garage_address: formData.value.driver_garage_address
    })
    
    if (!updateResult.success) {
      console.error('정보 수정 실패:', updateResult.error)
      alert('정보 수정에 실패했습니다.')
      return
    }
    
    alert('정보가 성공적으로 수정되었습니다.')
    router.push('/driver-mypage')
    
  } catch (error) {
    console.error('정보 수정 오류:', error)
    alert('정보 수정 중 오류가 발생했습니다.')
  } finally {
    submitting.value = false
  }
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
.driver-edit {
  padding: 2rem;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.driver-edit-container {
  margin: 0.5rem 0;
  padding: 0.5rem;
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

/* 페이지 헤더 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: var(--bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--bg-hover);
}

/* 프로필 헤더 */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}

.profile-header .file-upload-area {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: visible;
  border: 3px solid var(--primary-color);
  flex-shrink: 0;
  min-height: 120px;
  position: relative;
}

.profile-header .preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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

.driver-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.driver-email {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* 상태 카드 */
.status-card {
  margin-bottom: 2rem;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.status-message.warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
}

/* 정보 섹션 */
.info-section {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  background: white;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-input:disabled {
  background: var(--bg-light);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.form-input[readonly] {
  background: var(--bg-light);
  cursor: pointer;
}

.form-input[readonly]:hover {
  background: var(--bg-hover);
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

.vehicle-image-container {
  position: relative;
}

.license-image-container {
  position: relative;
}

/* 버튼 스타일 */
.remove-btn,
.upload-btn {
  position: absolute;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.remove-btn {
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 1);
}

.upload-btn {
  bottom: 4px;
  right: 4px;
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.upload-btn:hover {
  background: rgba(16, 185, 129, 1);
}

.hidden-input {
  display: none;
}

/* 자격증 섹션 */
.license-images-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  width: 120px;
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
  background: var(--text-secondary);
  color: white;
}

.btn-action:hover {
  background: var(--primary-dark);
}

/* 폼 액션 */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}

.btn-submit {
  padding: 0.75rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-submit:disabled {
  background: var(--text-secondary);
  cursor: not-allowed;
}

.btn-cancel {
  padding: 0.75rem 2rem;
  background: var(--bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--bg-hover);
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
  text-decoration: none;
  margin-top: 1rem;
  display: inline-block;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* 파일 업로드 */
.file-upload-area {
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius);
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
}

.file-input {
    display: none;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.upload-placeholder svg {
    color: var(--text-secondary);
}

.upload-preview {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.remove-btn {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    background: rgba(220, 38, 38, 0.9);
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
    backdrop-filter: blur(4px);
    z-index: 10;
}

.remove-btn:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.05);
}

/* 반응형 */
@media (max-width: 768px) {
  .driver-edit {
    padding: 0rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-photo {
    width: 100px;
    height: 100px;
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
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-submit,
  .btn-cancel {
    width: 100%;
    text-align: center;
  }
}
</style> 