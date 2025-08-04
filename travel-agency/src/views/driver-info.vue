<template>
    <div class="driver-info-page">
        <!-- 메인 컨텐츠 -->
        <main class="main-content">
            <div class="container">
                <!-- 페이지 제목 -->
                <div class="page-header">
                    <h1 class="page-title">버스기사 추가정보</h1>
                    <p class="page-subtitle">버스기사 등록을 위한 추가 정보를 입력해주세요</p>
                </div>

                <!-- 추가정보 입력 폼 -->
                <div class="driver-info-form-wrapper">
                    <form @submit.prevent="handleSubmit" class="driver-info-form" novalidate>
                        <!-- 기사 정보 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                기사 정보
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        기사사진등록
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('driverPhotoInput')">
                                        <input type="file" 
                                            ref="driverPhotoInput"
                                            @change="handleDriverPhotoUpload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.driverPhoto }">
                                        <div class="upload-preview" v-if="driverPhotoPreview">
                                            <img :src="driverPhotoPreview" alt="기사사진" class="preview-image">
                                            <button type="button" @click.stop="removeDriverPhoto" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>기사사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.driverPhoto" class="error-message">{{ errors.driverPhoto }}</div>
                                </div>



                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        소속
                                    </label>
                                    <input type="text" v-model="formData.company" class="form-input"
                                        placeholder="소속 회사명을 입력하세요" 
                                        :class="{ error: errors.company }"
                                        @blur="validateField('company')"
                                        @input="validateField('company')"
                                        required>
                                    <div v-if="errors.company" class="error-message">{{ errors.company }}</div>
                                </div>

                                <div class="form-group full-width">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        차고지주소 (지역별 맞춤견적 제공)
                                    </label>
                                    <div class="address-group">
                                        <input type="text" v-model="formData.garageZipcode" class="form-input"
                                            placeholder="우편번호를 클릭하세요" readonly
                                            @click="findGarageAddress">
                                        <input type="text" v-model="formData.garageAddress1" class="form-input"
                                            placeholder="기본주소" readonly>
                                    </div>
                                    <div v-if="errors.garageAddress" class="error-message">{{ errors.garageAddress }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 차량 정보 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                차량 정보
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        차량번호
                                    </label>
                                    <input type="text" v-model="formData.vehicleNumber" class="form-input"
                                        placeholder="예: 서울70바8442" 
                                        :class="{ error: errors.vehicleNumber }"
                                        @blur="validateField('vehicleNumber')"
                                        @input="validateField('vehicleNumber')"
                                        required>
                                    <div v-if="errors.vehicleNumber" class="error-message">{{ errors.vehicleNumber }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        차종
                                    </label>
                                    <select v-model="formData.vehicleType" class="form-input"
                                        :class="{ error: errors.vehicleType }"
                                        @blur="validateField('vehicleType')"
                                        @change="validateField('vehicleType')"
                                        required>
                                        <option value="">차종을 선택하세요</option>
                                        <option value="현대 쏠라티 (15인승)">현대 쏠라티 (15인승)</option>
                                        <option value="벤츠 스프린터 (15인승)">벤츠 스프린터 (15인승)</option>
                                        <option value="미니버스 (25인승)">미니버스 (25인승)</option>
                                        <option value="대형버스 (44인승)">대형버스 (44인승)</option>
                                        <option value="우등버스 (28인승)">우등버스 (28인승)</option>
                                    </select>
                                    <div v-if="errors.vehicleType" class="error-message">{{ errors.vehicleType }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        년식
                                    </label>
                                    <select v-model="formData.vehicleYear" class="form-input"
                                        :class="{ error: errors.vehicleYear }"
                                        @blur="validateField('vehicleYear')"
                                        @change="validateField('vehicleYear')"
                                        required>
                                        <option value="">년식을 선택하세요</option>
                                        <option v-for="year in availableYears" :key="year" :value="year">
                                            {{ year }}년
                                        </option>
                                    </select>
                                    <div v-if="errors.vehicleYear" class="error-message">{{ errors.vehicleYear }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        승객 탑승정원
                                    </label>
                                    <select v-model="formData.passengerCapacity" class="form-input"
                                        :class="{ error: errors.passengerCapacity }"
                                        @blur="validateField('passengerCapacity')"
                                        @change="validateField('passengerCapacity')"
                                        required>
                                        <option value="">정원을 선택하세요</option>
                                        <option v-for="capacity in availableCapacities" :key="capacity" :value="capacity">
                                            {{ capacity }}인승
                                        </option>
                                    </select>
                                    <div v-if="errors.passengerCapacity" class="error-message">{{ errors.passengerCapacity }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 차량 사진 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                차량 사진 (4개)
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        대각측면
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto1Input')">
                                        <input type="file" 
                                            ref="vehiclePhoto1Input"
                                            @change="handleVehiclePhoto1Upload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.vehiclePhoto1 }">
                                        <div class="upload-preview" v-if="vehiclePhoto1Preview">
                                            <img :src="vehiclePhoto1Preview" alt="대각측면" class="preview-image">
                                            <button type="button" @click.stop="removeVehiclePhoto1" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>대각측면 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.vehiclePhoto1" class="error-message">{{ errors.vehiclePhoto1 }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        차량정면
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto2Input')">
                                        <input type="file" 
                                            ref="vehiclePhoto2Input"
                                            @change="handleVehiclePhoto2Upload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.vehiclePhoto2 }">
                                        <div class="upload-preview" v-if="vehiclePhoto2Preview">
                                            <img :src="vehiclePhoto2Preview" alt="차량정면" class="preview-image">
                                            <button type="button" @click.stop="removeVehiclePhoto2" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>차량정면 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.vehiclePhoto2" class="error-message">{{ errors.vehiclePhoto2 }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        좌석전체
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto3Input')">
                                        <input type="file" 
                                            ref="vehiclePhoto3Input"
                                            @change="handleVehiclePhoto3Upload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.vehiclePhoto3 }">
                                        <div class="upload-preview" v-if="vehiclePhoto3Preview">
                                            <img :src="vehiclePhoto3Preview" alt="좌석전체" class="preview-image">
                                            <button type="button" @click.stop="removeVehiclePhoto3" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>좌석전체 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.vehiclePhoto3" class="error-message">{{ errors.vehiclePhoto3 }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        좌석측면
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('vehiclePhoto4Input')">
                                        <input type="file" 
                                            ref="vehiclePhoto4Input"
                                            @change="handleVehiclePhoto4Upload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.vehiclePhoto4 }">
                                        <div class="upload-preview" v-if="vehiclePhoto4Preview">
                                            <img :src="vehiclePhoto4Preview" alt="좌석측면" class="preview-image">
                                            <button type="button" @click.stop="removeVehiclePhoto4" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>좌석측면 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.vehiclePhoto4" class="error-message">{{ errors.vehiclePhoto4 }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 서류 사진 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                서류 사진
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        버스운전 자격증 사진
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('licensePhotoInput')">
                                        <input type="file" 
                                            ref="licensePhotoInput"
                                            @change="handleLicensePhotoUpload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.licensePhoto }">
                                        <div class="upload-preview" v-if="licensePhotoPreview">
                                            <img :src="licensePhotoPreview" alt="자격증사진" class="preview-image">
                                            <button type="button" @click.stop="removeLicensePhoto" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>버스운전 자격증 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.licensePhoto" class="error-message">{{ errors.licensePhoto }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        보험증권 사진
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('insurancePhotoInput')">
                                        <input type="file" 
                                            ref="insurancePhotoInput"
                                            @change="handleInsurancePhotoUpload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.insurancePhoto }">
                                        <div class="upload-preview" v-if="insurancePhotoPreview">
                                            <img :src="insurancePhotoPreview" alt="보험증권사진" class="preview-image">
                                            <button type="button" @click.stop="removeInsurancePhoto" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>보험증권 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.insurancePhoto" class="error-message">{{ errors.insurancePhoto }}</div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label required">
                                        <span class="required-icon">⦁</span>
                                        자동차 등록증 사진
                                    </label>
                                    <div class="file-upload-area" @click="triggerFileInput('registrationPhotoInput')">
                                        <input type="file" 
                                            ref="registrationPhotoInput"
                                            @change="handleRegistrationPhotoUpload" 
                                            accept="image/*"
                                            class="file-input"
                                            :class="{ error: errors.registrationPhoto }">
                                        <div class="upload-preview" v-if="registrationPhotoPreview">
                                            <img :src="registrationPhotoPreview" alt="등록증사진" class="preview-image">
                                            <button type="button" @click.stop="removeRegistrationPhoto" class="remove-btn">삭제</button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7,10 12,15 17,10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            <span>자동차 등록증 사진을 업로드하세요</span>
                                        </div>
                                    </div>
                                    <div v-if="errors.registrationPhoto" class="error-message">{{ errors.registrationPhoto }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 기사님 한마디 -->
                        <div class="form-section">
                            <h2 class="section-title">
                                기사님 한마디
                                <span class="required-notice">
                                    <span class="required-icon">⦁</span>
                                    필수항목
                                </span>
                            </h2>

                            <div class="form-group full-width">
                                <label class="form-label required">
                                    <span class="required-icon">⦁</span>
                                    자기소개
                                </label>
                                <textarea v-model="formData.introduction" class="form-textarea"
                                    placeholder="안전하고 편안한 여행을 약속드립니다. 기사님의 경험과 특별한 서비스를 소개해주세요."
                                    rows="4"
                                    :class="{ error: errors.introduction }"
                                    @blur="validateField('introduction')"
                                    @input="validateField('introduction')"
                                    required></textarea>
                                <div v-if="errors.introduction" class="error-message">{{ errors.introduction }}</div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- 제출 버튼 -->
                <div class="form-actions">
                    <button type="submit" class="btn-submit" @click="handleSubmit">정보 등록 완료</button>
                    <button type="button" class="btn-cancel" @click="handleCancel">취소하기</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { uploadDriverImageToR2 } from '../lib/r2-upload.js'
import { supabase } from '../lib/supabase.js'

// 라우터 사용
const router = useRouter()

// 반응형 데이터
const errors = ref({})
const fieldTouched = ref({})

// 파일 업로드 관련
const driverPhotoInput = ref(null)
const licensePhotoInput = ref(null)
const insurancePhotoInput = ref(null)
const registrationPhotoInput = ref(null)
const vehiclePhoto1Input = ref(null)
const vehiclePhoto2Input = ref(null)
const vehiclePhoto3Input = ref(null)
const vehiclePhoto4Input = ref(null)

// 파일 미리보기
const driverPhotoPreview = ref(null)
const licensePhotoPreview = ref(null)
const insurancePhotoPreview = ref(null)
const registrationPhotoPreview = ref(null)
const vehiclePhoto1Preview = ref(null)
const vehiclePhoto2Preview = ref(null)
const vehiclePhoto3Preview = ref(null)
const vehiclePhoto4Preview = ref(null)

// 업로드된 파일들
const driverPhotoFile = ref(null)
const licensePhotoFile = ref(null)
const insurancePhotoFile = ref(null)
const registrationPhotoFile = ref(null)
const vehiclePhoto1File = ref(null)
const vehiclePhoto2File = ref(null)
const vehiclePhoto3File = ref(null)
const vehiclePhoto4File = ref(null)

// 폼 데이터
const formData = reactive({
    company: '',
    garageZipcode: '',
    garageAddress1: '',
    vehicleNumber: '',
    vehicleType: '',
    vehicleYear: '',
    passengerCapacity: '',
    introduction: ''
})

// 사용 가능한 년도 배열 (2013년부터 현재 년도까지)
const currentYear = new Date().getFullYear()
const availableYears = ref([])
for (let year = currentYear; year >= 2013; year--) {
    availableYears.value.push(year)
}

// 사용 가능한 정원 배열 (15인승부터 45인승까지)
const availableCapacities = ref([])
for (let capacity = 15; capacity <= 45; capacity++) {
    availableCapacities.value.push(capacity)
}

// Validation 패턴들
const patterns = {
    vehicleNumber: /^[가-힣]{2,3}[0-9]+[가-힣][0-9]+$/
}



const validateCompany = (company) => {
    if (!company) return '소속을 입력해주세요.'
    if (company.length < 2) return '소속은 2자 이상 입력해주세요.'
    return null
}

const validateVehicleNumber = (vehicleNumber) => {
    if (!vehicleNumber) return '차량번호를 입력해주세요.'
    if (!patterns.vehicleNumber.test(vehicleNumber)) return '올바른 차량번호 형식을 입력해주세요. (예: 서울70바8442)'
    return null
}

const validateVehicleType = (vehicleType) => {
    if (!vehicleType) return '차종을 선택해주세요.'
    return null
}

const validateVehicleYear = (vehicleYear) => {
    if (!vehicleYear) return '년식을 선택해주세요.'
    const year = parseInt(vehicleYear)
    if (year < 2013 || year > currentYear) return '2013년부터 현재 년도 사이의 년식을 선택해주세요.'
    return null
}

const validatePassengerCapacity = (passengerCapacity) => {
    if (!passengerCapacity) return '승객 탑승정원을 선택해주세요.'
    const capacity = parseInt(passengerCapacity)
    if (capacity < 15 || capacity > 45) return '15인승부터 45인승 사이의 정원을 선택해주세요.'
    return null
}

const validateIntroduction = (introduction) => {
    if (!introduction) return '자기소개를 입력해주세요.'
    if (introduction.length < 10) return '자기소개는 10자 이상 입력해주세요.'
    if (introduction.length > 500) return '자기소개는 500자 이하로 입력해주세요.'
    return null
}

// 실시간 개별 필드 검증
const validateField = (fieldName) => {
    fieldTouched.value[fieldName] = true
    
    switch (fieldName) {
        case 'company':
            errors.value.company = validateCompany(formData.company)
            break
        case 'vehicleNumber':
            errors.value.vehicleNumber = validateVehicleNumber(formData.vehicleNumber)
            break
        case 'vehicleType':
            errors.value.vehicleType = validateVehicleType(formData.vehicleType)
            break
        case 'vehicleYear':
            errors.value.vehicleYear = validateVehicleYear(formData.vehicleYear)
            break
        case 'passengerCapacity':
            errors.value.passengerCapacity = validatePassengerCapacity(formData.passengerCapacity)
            break
        case 'introduction':
            errors.value.introduction = validateIntroduction(formData.introduction)
            break
        case 'garageAddress':
            errors.value.garageAddress = !formData.garageZipcode || !formData.garageAddress1 ? '차고지 주소를 입력해주세요.' : null
            break
    }
}

// 파일 업로드 처리 함수들
const handleFileUpload = (event, previewRef, fileRef, errorKey) => {
    const file = event.target.files[0]
    if (file) {
        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.')
            event.target.value = ''
            return
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.')
            event.target.value = ''
            return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
            previewRef.value = e.target.result
        }
        reader.readAsDataURL(file)
        fileRef.value = file
        errors.value[errorKey] = null
    }
}

const handleDriverPhotoUpload = (event) => {
    handleFileUpload(event, driverPhotoPreview, driverPhotoFile, 'driverPhoto')
}

const handleLicensePhotoUpload = (event) => {
    handleFileUpload(event, licensePhotoPreview, licensePhotoFile, 'licensePhoto')
}

const handleInsurancePhotoUpload = (event) => {
    handleFileUpload(event, insurancePhotoPreview, insurancePhotoFile, 'insurancePhoto')
}

const handleRegistrationPhotoUpload = (event) => {
    handleFileUpload(event, registrationPhotoPreview, registrationPhotoFile, 'registrationPhoto')
}

const handleVehiclePhoto1Upload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.')
            event.target.value = ''
            return
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.')
            event.target.value = ''
            return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
            vehiclePhoto1Preview.value = e.target.result
        }
        reader.readAsDataURL(file)
        vehiclePhoto1File.value = file
        errors.value.vehiclePhoto1 = null
        
        console.log('차량사진 1 업로드 완료:', file.name)
    }
}

const handleVehiclePhoto2Upload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.')
            event.target.value = ''
            return
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.')
            event.target.value = ''
            return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
            vehiclePhoto2Preview.value = e.target.result
        }
        reader.readAsDataURL(file)
        vehiclePhoto2File.value = file
        errors.value.vehiclePhoto2 = null
        
        console.log('차량사진 2 업로드 완료:', file.name)
    }
}

const handleVehiclePhoto3Upload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.')
            event.target.value = ''
            return
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.')
            event.target.value = ''
            return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
            vehiclePhoto3Preview.value = e.target.result
        }
        reader.readAsDataURL(file)
        vehiclePhoto3File.value = file
        errors.value.vehiclePhoto3 = null
        
        console.log('차량사진 3 업로드 완료:', file.name)
    }
}

const handleVehiclePhoto4Upload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.')
            event.target.value = ''
            return
        }
        
        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.')
            event.target.value = ''
            return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
            vehiclePhoto4Preview.value = e.target.result
        }
        reader.readAsDataURL(file)
        vehiclePhoto4File.value = file
        errors.value.vehiclePhoto4 = null
        
        console.log('차량사진 4 업로드 완료:', file.name)
    }
}

// 파일 삭제 함수들
const removeDriverPhoto = () => {
    driverPhotoPreview.value = null
    driverPhotoFile.value = null
    if (driverPhotoInput.value) {
        driverPhotoInput.value.value = ''
    }
    errors.value.driverPhoto = null
}

const removeLicensePhoto = () => {
    licensePhotoPreview.value = null
    licensePhotoFile.value = null
    if (licensePhotoInput.value) {
        licensePhotoInput.value.value = ''
    }
    errors.value.licensePhoto = null
}

const removeInsurancePhoto = () => {
    insurancePhotoPreview.value = null
    insurancePhotoFile.value = null
    if (insurancePhotoInput.value) {
        insurancePhotoInput.value.value = ''
    }
    errors.value.insurancePhoto = null
}

const removeRegistrationPhoto = () => {
    registrationPhotoPreview.value = null
    registrationPhotoFile.value = null
    if (registrationPhotoInput.value) {
        registrationPhotoInput.value.value = ''
    }
    errors.value.registrationPhoto = null
}

const removeVehiclePhoto1 = () => {
    vehiclePhoto1Preview.value = null
    vehiclePhoto1File.value = null
    if (vehiclePhoto1Input.value) {
        vehiclePhoto1Input.value.value = ''
    }
    errors.value.vehiclePhoto1 = null
    console.log('차량사진 1 삭제 완료')
}

const removeVehiclePhoto2 = () => {
    vehiclePhoto2Preview.value = null
    vehiclePhoto2File.value = null
    if (vehiclePhoto2Input.value) {
        vehiclePhoto2Input.value.value = ''
    }
    errors.value.vehiclePhoto2 = null
    console.log('차량사진 2 삭제 완료')
}

const removeVehiclePhoto3 = () => {
    vehiclePhoto3Preview.value = null
    vehiclePhoto3File.value = null
    if (vehiclePhoto3Input.value) {
        vehiclePhoto3Input.value.value = ''
    }
    errors.value.vehiclePhoto3 = null
    console.log('차량사진 3 삭제 완료')
}

const removeVehiclePhoto4 = () => {
    vehiclePhoto4Preview.value = null
    vehiclePhoto4File.value = null
    if (vehiclePhoto4Input.value) {
        vehiclePhoto4Input.value.value = ''
    }
    errors.value.vehiclePhoto4 = null
    console.log('차량사진 4 삭제 완료')
}

// 파일 입력 트리거 함수들
const triggerFileInput = (inputRefName) => {
    let inputRef
    switch (inputRefName) {
        case 'driverPhotoInput':
            inputRef = driverPhotoInput
            break
        case 'licensePhotoInput':
            inputRef = licensePhotoInput
            break
        case 'insurancePhotoInput':
            inputRef = insurancePhotoInput
            break
        case 'registrationPhotoInput':
            inputRef = registrationPhotoInput
            break
        case 'vehiclePhoto1Input':
            inputRef = vehiclePhoto1Input
            break
        case 'vehiclePhoto2Input':
            inputRef = vehiclePhoto2Input
            break
        case 'vehiclePhoto3Input':
            inputRef = vehiclePhoto3Input
            break
        case 'vehiclePhoto4Input':
            inputRef = vehiclePhoto4Input
            break
    }
    
    if (inputRef && inputRef.value) {
        inputRef.value.click()
    }
}



// 주소 검색
const findGarageAddress = () => {
    if (typeof daum !== 'undefined') {
        new daum.Postcode({
            oncomplete: function(data) {
                let addr = ''
                
                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress
                } else {
                    addr = data.jibunAddress
                }
                
                formData.garageZipcode = data.zonecode
                formData.garageAddress1 = addr
                errors.value.garageAddress = ''
                
                console.log('차고지 주소 검색 결과:', data)
            }
        }).open()
    } else {
        alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.')
    }
}

// 전체 폼 검증
const validateForm = () => {
    // 모든 필드를 touched 상태로 만들기
    Object.keys(formData).forEach(key => {
        fieldTouched.value[key] = true
    })
    
    // 개별 검증 실행
    validateField('name')
    validateField('company')
    validateField('vehicleNumber')
    validateField('vehicleType')
    validateField('vehicleYear')
    validateField('passengerCapacity')
    validateField('introduction')
    validateField('garageAddress')

    // 파일 업로드 검증
    if (!driverPhotoFile.value) {
        errors.value.driverPhoto = '기사사진을 업로드해주세요.'
    }
    
    if (!licensePhotoFile.value) {
        errors.value.licensePhoto = '버스운전 자격증 사진을 업로드해주세요.'
    }
    
    if (!insurancePhotoFile.value) {
        errors.value.insurancePhoto = '보험증권 사진을 업로드해주세요.'
    }
    
    if (!registrationPhotoFile.value) {
        errors.value.registrationPhoto = '자동차 등록증 사진을 업로드해주세요.'
    }
    
    // 차량 사진 검증
    if (!vehiclePhoto1File.value) {
        errors.value.vehiclePhoto1 = '차량사진 1을 업로드해주세요.'
    }
    if (!vehiclePhoto2File.value) {
        errors.value.vehiclePhoto2 = '차량사진 2를 업로드해주세요.'
    }
    if (!vehiclePhoto3File.value) {
        errors.value.vehiclePhoto3 = '차량사진 3을 업로드해주세요.'
    }
    if (!vehiclePhoto4File.value) {
        errors.value.vehiclePhoto4 = '차량사진 4를 업로드해주세요.'
    }

    // 에러가 있는지 확인
    const hasErrors = Object.values(errors.value).some(error => error !== null)
    return !hasErrors
}

const handleCancel = () => {
    if (confirm('버스기사 정보 등록을 취소하시겠습니까?')) {
        router.push('/')
    }
}

const handleSubmit = async () => {
    // 전체 폼 검증
    const isValid = validateForm()
    
    if (!isValid) {
        alert('입력 정보를 다시 확인해주세요.')
        return
    }

    try {
        // 로딩 표시
        const submitBtn = document.querySelector('.btn-submit')
        const originalText = submitBtn.textContent
        submitBtn.textContent = '업로드 중 (잠시만 기다려주세요...)'
        submitBtn.disabled = true

        // 현재 로그인한 사용자의 auth_id로 driver_id 생성
        const { data: { user: currentUser }, error: currentAuthError } = await supabase.auth.getUser()
        if (currentAuthError || !currentUser) {
            throw new Error('로그인이 필요합니다.')
        }
        
        // Users 테이블에서 해당 사용자의 id 가져오기
        const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('id')
            .eq('auth_id', currentUser.id)
            .single()
        
        if (userError || !userData) {
            throw new Error('사용자 정보를 찾을 수 없습니다.')
        }
        
        const driverId = `driver_${userData.id}`
        
        // 이미지 업로드 결과들을 저장할 객체
        const uploadResults = {
            driverPhoto: null,
            licensePhoto: null,
            insurancePhoto: null,
            registrationPhoto: null,
            vehiclePhotos: []
        }

        // 1. 기사사진 업로드
        if (driverPhotoFile.value) {
            const result = await uploadDriverImageToR2(driverPhotoFile.value, driverId, 'driver')
            console.log('기사사진 업로드 결과:', result)
            if (result.success) {
                uploadResults.driverPhoto = result.url
                console.log('저장된 기사사진 URL:', result.url)
            } else {
                throw new Error(`기사사진 업로드 실패: ${result.error}`)
            }
        }

        // 2. 자격증 사진 업로드
        if (licensePhotoFile.value) {
            const result = await uploadDriverImageToR2(licensePhotoFile.value, driverId, 'license')
            console.log('자격증 업로드 결과:', result)
            if (result.success) {
                uploadResults.licensePhoto = result.url
                console.log('저장된 자격증 URL:', result.url)
            } else {
                throw new Error(`자격증 사진 업로드 실패: ${result.error}`)
            }
        }

        // 3. 보험증권 사진 업로드
        if (insurancePhotoFile.value) {
            const result = await uploadDriverImageToR2(insurancePhotoFile.value, driverId, 'insurance')
            console.log('보험증권 업로드 결과:', result)
            if (result.success) {
                uploadResults.insurancePhoto = result.url
                console.log('저장된 보험증권 URL:', result.url)
            } else {
                throw new Error(`보험증권 사진 업로드 실패: ${result.error}`)
            }
        }

        // 4. 등록증 사진 업로드
        if (registrationPhotoFile.value) {
            const result = await uploadDriverImageToR2(registrationPhotoFile.value, driverId, 'registration')
            if (result.success) {
                uploadResults.registrationPhoto = result.url
            } else {
                throw new Error(`등록증 사진 업로드 실패: ${result.error}`)
            }
        }

        // 5. 차량 사진들 업로드
        const vehicleUrls = []
        
        if (vehiclePhoto1File.value) {
            const result = await uploadDriverImageToR2(vehiclePhoto1File.value, driverId, 'vehicle1')
            if (result.success) {
                vehicleUrls.push(result.url)
            } else {
                throw new Error(`차량사진 1 업로드 실패: ${result.error}`)
            }
        }
        
        if (vehiclePhoto2File.value) {
            const result = await uploadDriverImageToR2(vehiclePhoto2File.value, driverId, 'vehicle2')
            if (result.success) {
                vehicleUrls.push(result.url)
            } else {
                throw new Error(`차량사진 2 업로드 실패: ${result.error}`)
            }
        }
        
        if (vehiclePhoto3File.value) {
            const result = await uploadDriverImageToR2(vehiclePhoto3File.value, driverId, 'vehicle3')
            if (result.success) {
                vehicleUrls.push(result.url)
            } else {
                throw new Error(`차량사진 3 업로드 실패: ${result.error}`)
            }
        }
        
        if (vehiclePhoto4File.value) {
            const result = await uploadDriverImageToR2(vehiclePhoto4File.value, driverId, 'vehicle4')
            if (result.success) {
                vehicleUrls.push(result.url)
            } else {
                throw new Error(`차량사진 4 업로드 실패: ${result.error}`)
            }
        }
        
        uploadResults.vehiclePhotos = vehicleUrls

        // 데이터베이스에 기사 정보 저장
        const driverData = {
            driver_company: formData.company,
            driver_garage_zipcode: formData.garageZipcode,
            driver_garage_address: formData.garageAddress1,
            driver_vehicle_number: formData.vehicleNumber,
            driver_vehicle_type: formData.vehicleType,
            driver_vehicle_year: formData.vehicleYear,
            driver_passenger_capacity: formData.passengerCapacity,
            driver_photo_url: uploadResults.driverPhoto,
            driver_license_photo_url: uploadResults.licensePhoto,
            driver_insurance_photo_url: uploadResults.insurancePhoto,
            driver_registration_photo_url: uploadResults.registrationPhoto,
            driver_vehicle_photo_urls: uploadResults.vehiclePhotos,
            driver_introduction: formData.introduction,
            driver_approved: false, // 기본값: 승인 대기
            driver_active: true // 기본값: 활성화
        }

        // 현재 로그인한 사용자의 auth_id로 Users 테이블 업데이트
        const { data: updateResult, error: updateError } = await supabase
            .from('Users')
            .update(driverData)
            .eq('id', userData.id)
            .select()

        if (updateError) {
            console.error('기사 정보 저장 실패:', updateError)
            throw new Error(`기사 정보 저장에 실패했습니다: ${updateError.message}`)
        }

        console.log('기사 정보 저장 완료:', updateResult)

        // 버튼 상태 복원
        submitBtn.textContent = originalText
        submitBtn.disabled = false

        alert('✅ 버스기사 정보가 등록되었습니다!\n관리자 승인 후 서비스 이용이 가능합니다.')
        router.push('/')

    } catch (error) {
        console.error('기사 정보 등록 실패:', error)
        
        // 버튼 상태 복원
        const submitBtn = document.querySelector('.btn-submit')
        submitBtn.textContent = '정보 등록 완료'
        submitBtn.disabled = false
        
        alert(`❌ 기사 정보 등록에 실패했습니다: ${error.message}`)
    }
}

// 실시간 validation을 위한 watch

watch(() => formData.company, () => {
    if (fieldTouched.value.company) {
        validateField('company')
    }
})

watch(() => formData.vehicleNumber, () => {
    if (fieldTouched.value.vehicleNumber) {
        validateField('vehicleNumber')
    }
})

watch(() => formData.vehicleType, () => {
    if (fieldTouched.value.vehicleType) {
        validateField('vehicleType')
    }
})

watch(() => formData.vehicleYear, () => {
    if (fieldTouched.value.vehicleYear) {
        validateField('vehicleYear')
    }
})

watch(() => formData.passengerCapacity, () => {
    if (fieldTouched.value.passengerCapacity) {
        validateField('passengerCapacity')
    }
})

watch(() => formData.introduction, () => {
    if (fieldTouched.value.introduction) {
        validateField('introduction')
    }
})
</script>

<style scoped>
/* 전체 레이아웃 */
.driver-info-page {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

/* 메인 컨텐츠 */
.main-content {
    padding: 3.5rem 0 2rem 0;
}

/* 페이지 헤더 */
.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
}

.driver-info-form {
    padding: 0;
}

.form-section {
    background: white;
    padding: 1.25rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--primary-color);
}

.required-notice {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 500;
}

/* 폼 필드 */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.form-label.required {
    color: var(--text-secondary);
}

.required-icon {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 0.8rem;
}

.form-input, .form-textarea, .form-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    transition: var(--transition);
    background: white;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.error, .form-textarea.error, .form-select.error {
    border-color: var(--error-color);
    background-color: rgba(220, 38, 38, 0.05);
}

.form-input[readonly] {
    background-color: var(--bg-light);
    color: var(--text-secondary);
    cursor: pointer;
}

.form-input[readonly]:hover {
    background-color: #e2e8f0;
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* 파일 업로드 */
.file-upload-area {
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
    text-align: center;
    transition: var(--transition);
    cursor: pointer;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-upload-area:hover {
    border-color: var(--primary-color);
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
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(220, 38, 38, 0.9);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
    transition: var(--transition);
    backdrop-filter: blur(4px);
}

.remove-btn:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.05);
}

/* 차량 사진 그리드 */
.vehicle-photos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.photo-upload-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* 입력 필드와 버튼 조합 */
.input-with-button {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.input-with-button .form-input {
    flex: 1;
}

/* 주소 입력 */
.address-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* 버튼 스타일 */
.btn-check {
    background: var(--secondary-color);
    color: white;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    font-weight: 500;
}

.btn-check:hover {
    background: #475569;
}

/* 제출 버튼 */
.form-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem 0;
}

.btn-submit {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    min-width: 120px;
}

.btn-submit:hover {
    background: var(--primary-dark);
}

.btn-cancel {
    background: var(--secondary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    min-width: 120px;
}

.btn-cancel:hover {
    background: #475569;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .page-subtitle {
        font-size: 0.9rem;
    }

    .form-section {
        padding: 0;
        margin-bottom: 1rem;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .vehicle-photos-grid {
        grid-template-columns: 1fr;
    }

    .form-group {
        margin-bottom: 0;
    }

    .form-input, .form-textarea, .form-select {
        padding: 0.875rem;
        font-size: 1rem;
    }

    /* 입력 필드와 버튼 조합 */
    .input-with-button {
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-check {
        width: 100%;
        padding: 0.875rem;
        font-size: 0.95rem;
    }

    /* 제출 버튼 */
    .form-actions {
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem 0;
    }

    .btn-submit,
    .btn-cancel {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 0.75rem;
    }

    .page-subtitle {
        font-size: 0.85rem;
    }

    .form-section {
        padding: 0;
        margin-bottom: 0.75rem;
    }

    .section-title {
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .form-label {
        font-size: 0.8rem;
    }

    .form-input, .form-textarea, .form-select {
        padding: 0.75rem;
        font-size: 0.9rem;
    }

    .form-actions {
        padding: 0.75rem 0;
    }
}
</style> 