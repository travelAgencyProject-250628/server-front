<template>
  <div class="product-list-page">
    <aside class="sidebar-section">
      <Sidebar 
        title="출발장소안내"
        :menuItems="[
          { name: '버스탑승장소', path: '/starting-points' }
        ]"
      />
      
      <!-- 여행 상담 & 예약 센터 정보 -->
      <div class="contact-info-section">
        <div class="contact-header">
          <h3>여행상담 & 예약센터</h3>
        </div>
        
        <div class="phone-numbers">
          <div class="phone-number primary">031)376-0597</div>
        </div>
        
        <div class="operating-hours">
          <div class="hours-item">
            <span class="hours-label">평일 : 09:00~18:00</span>
          </div>
          <div class="hours-item">
            <span class="hours-label">토요일 : 09:00~16:00</span>
          </div>
        </div>
        
        <div class="cancellation-policy">
          <p>*취소 및 변경은 평일 18시까지 전화로만 가능합니다. (공휴일 제외)</p>
        </div>
        
        <div class="bank-info">
          <div class="bank-header">
            <img src="/bank_icon.png" alt="신한은행" class="bank-logo-image" />
            <span class="bank-name">신한은행</span>
          </div>
          <div class="account-number">110-566-753667</div>
          <div class="account-holder">예금주 : 김태훈</div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">출발장소안내</h1>
          <p class="page-slogan">고품질 여행을 착한 가격에 - 더쉼투어</p>
        </div>
      </div>

      <!-- 탭 네비게이션 -->
      <div class="tab-navigation">
        <div class="tab-container">
          <button 
            v-for="point in startingPoints" 
            :key="point.id"
            :class="['tab-button', { active: selectedPoint?.id === point.id }]"
            @click="selectPoint(point)"
          >
            {{ point.name }}
          </button>
          <!-- 빈 탭 버튼들 (총 12개가 되도록) -->
          <button 
            v-for="i in (12 - startingPoints.length)" 
            :key="`empty-${i}`"
            class="tab-button empty"
            disabled
          >
            -
          </button>
        </div>
      </div>

      <!-- 콘텐츠 영역 -->
      <div class="content-area">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-state">
          <p>출발장소 정보를 불러오는 중입니다...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <!-- 지도와 정보 패널 -->
        <div v-else-if="selectedPoint" class="content-layout">
          <!-- 지도 영역 -->
          <div class="map-section">
            <div class="map-container">
              <div id="map" class="map-placeholder">
                <div class="map-fallback">
                  <h3>{{ selectedPoint.name }} 지도</h3>
                  <p>카카오맵이 여기에 표시됩니다</p>
                  <p class="map-note">* 카카오 개발자 센터에서 localhost:5173 도메인을 등록해주세요</p>
                  <div class="map-controls">
                    <button class="map-control-btn" @click="zoomIn">+</button>
                    <button class="map-control-btn" @click="zoomOut">-</button>
                    <button class="map-control-btn center-btn" @click="centerMap">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="map-footer">
                <div class="scale-bar">100m</div>
                <div class="map-provider">kakao</div>
              </div>
            </div>
          </div>

          <!-- 정보 패널 -->
          <div class="info-panel">
            <div class="panel-content">
              <!-- 출발 시간 -->
              <div class="time-section">
                <div class="time-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <span class="time-text">{{ formatTime(selectedPoint.time) }}</span>
              </div>

              <!-- 출발 장소 -->
              <div class="location-section">
                <h3 class="location-title">{{ selectedPoint.name }}</h3>
                <p class="location-description">{{ selectedPoint.address || '주소 정보가 없습니다.' }}</p>
              </div>

              <!-- 지하철 이용 안내 -->
              <div class="subway-section">
                <div class="subway-header">
                  <div class="subway-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <span class="subway-title">지하철 이용안내</span>
                </div>
                
                <div class="subway-lines">
                  <span class="line-tag line-2">2호선</span>
                  <span class="line-tag line-8">8호선</span>
                </div>
                
                <div class="subway-direction">
                  <p>{{ selectedPoint.description || '잠실역 4번 출구에서 롯데월드 방향으로 200m 직진' }}</p>
                </div>
              </div>

              <!-- 관련 상품 -->
              <div v-if="selectedPoint.products && selectedPoint.products.length > 0" class="products-section">
                <h4 class="products-title">관련 상품</h4>
                <div class="products-list">
                  <span 
                    v-for="product in selectedPoint.products" 
                    :key="product.id" 
                    class="product-tag"
                  >
                    {{ product.title }}
                  </span>
                </div>
              </div>

              <!-- 지도 자세히보기 버튼 -->
              <div class="map-detail-btn" @click="openKakaoMap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>지도 자세히보기</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 선택된 출발장소가 없는 경우 -->
        <div v-else class="no-selection">
          <p>출발장소를 선택해주세요</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getAllStartingPoints } from '@/lib/startingpoints.js'
import Sidebar from '@/components/Sidebar.vue'

// 상태 관리
const isLoading = ref(false)
const error = ref(null)
const startingPoints = ref([])
const selectedPoint = ref(null)
const map = ref(null)
const marker = ref(null)

// 시간 포맷팅
const formatTime = (timeString) => {
  if (!timeString) return '7시 30분'
  const time = timeString.substring(0, 5) // HH:MM 형식
  const [hours, minutes] = time.split(':')
  return `${hours}시 ${minutes}분`
}

// 출발장소 선택
const selectPoint = (point) => {
  console.log('출발장소 선택:', point)
  selectedPoint.value = point
  if (point.address) {
    searchAddress(point.address, point.name)
  }
}

// 카카오맵 초기화
const initKakaoMap = () => {
  if (!window.kakao || !window.kakao.maps) {
    console.warn('카카오맵 SDK가 로드되지 않았습니다.')
    return
  }

  try {
    const container = document.getElementById('map')
    if (!container) {
      console.error('지도 컨테이너를 찾을 수 없습니다.')
      return
    }

    // kakao.maps가 완전히 로드되었는지 확인
    if (typeof window.kakao.maps.LatLng !== 'function') {
      console.error('kakao.maps.LatLng이 로드되지 않았습니다.')
      return
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
      level: 3
    }
    map.value = new window.kakao.maps.Map(container, options)
    console.log('카카오맵 초기화 성공')
  } catch (error) {
    console.error('카카오맵 초기화 실패:', error)
  }
}

// 주소 검색 및 마커 표시
const searchAddress = (address, name) => {
  if (!map.value || !address) {
    console.warn('지도가 초기화되지 않았거나 주소가 없습니다.')
    return
  }

  if (!window.kakao || !window.kakao.maps) {
    console.warn('카카오맵 SDK가 로드되지 않았습니다.')
    return
  }

  try {
    // 기존 마커 제거
    if (marker.value) {
      marker.value.setMap(null)
    }

    // 주소-좌표 변환 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder()

    // 주소로 좌표 검색
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

        // 결과값으로 받은 위치를 마커로 표시
        marker.value = new window.kakao.maps.Marker({
          map: map.value,
          position: coords
        })

        // 인포윈도우로 장소에 대한 설명 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${name}</div>`
        })
        infowindow.open(map.value, marker.value)

        // 지도의 중심을 결과값으로 받은 위치로 이동
        map.value.setCenter(coords)
        console.log('주소 검색 성공:', address)
      } else {
        console.error('주소 검색 실패:', status, address)
      }
    })
  } catch (error) {
    console.error('주소 검색 중 오류 발생:', error)
  }
}

// 카카오맵 새 창으로 열기
const openKakaoMap = () => {
  if (selectedPoint.value && selectedPoint.value.address) {
    const encodedAddress = encodeURIComponent(selectedPoint.value.address)
    const url = `https://map.kakao.com/link/search/${encodedAddress}`
    window.open(url, '_blank')
  }
}

// 줌 인
const zoomIn = () => {
  if (map.value) {
    const currentLevel = map.value.getLevel()
    map.value.setLevel(currentLevel - 1)
  }
}

// 줌 아웃
const zoomOut = () => {
  if (map.value) {
    const currentLevel = map.value.getLevel()
    map.value.setLevel(currentLevel + 1)
  }
}

// 지도 중심 이동
const centerMap = () => {
  if (map.value && selectedPoint.value && selectedPoint.value.address) {
    searchAddress(selectedPoint.value.address, selectedPoint.value.name)
  }
}

// 출발장소 데이터 로드
const loadStartingPoints = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await getAllStartingPoints()
    if (response.success) {
      startingPoints.value = response.startingPoints
      // 첫 번째 출발장소를 기본 선택
      if (startingPoints.value.length > 0) {
        selectedPoint.value = startingPoints.value[0]
      }
    } else {
      error.value = response.error || '출발장소 정보를 불러오는데 실패했습니다.'
    }
  } catch (e) {
    error.value = e.message || '출발장소 정보를 불러오는데 실패했습니다.'
    console.error('출발장소 정보 조회 실패:', e)
  } finally {
    isLoading.value = false
  }
}

// 카카오맵 스크립트 로드
const loadKakaoMapScript = () => {
  return new Promise((resolve) => {
    // 이미 index.html에 로드되어 있으므로 바로 확인
    if (window.kakao && window.kakao.maps) {
      console.log('카카오맵 SDK가 이미 로드되어 있습니다.')
      resolve()
      return
    }

    console.warn('카카오맵 SDK가 로드되지 않았습니다.')
    resolve() // 에러 없이 진행
  })
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  try {
    await loadStartingPoints()
    
    // 카카오맵 로드 시도 (실패해도 앱은 계속 실행)
    try {
      await loadKakaoMapScript()
      initKakaoMap()
    } catch (mapError) {
      console.warn('카카오맵 로드 실패, 지도 기능이 제한됩니다:', mapError)
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error)
  }
})

// selectedPoint 변경 시 지도 업데이트
watch(selectedPoint, (newPoint) => {
  if (newPoint && newPoint.address) {
    searchAddress(newPoint.address, newPoint.name)
  }
})
</script>

<style scoped>
.product-list-page {
  display: grid;
  grid-template-columns: 1fr 270px 850px 1fr;
  min-height: 100vh;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  padding-top: 3.5rem;
}

/* 사이드바 섹션 */
.sidebar-section {
  grid-column: 2;
  padding: 1.5rem 2rem 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-self: start;
  position: sticky;
  top: 1rem; 
  height: fit-content;
}

/* 사이드바 로딩 */
.sidebar-loading {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 여행 상담 & 예약 센터 정보 */
.contact-info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 1rem;
  padding-left: 2px;
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.phone-numbers {
  margin-bottom: 1rem;
}

.phone-number {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.phone-number.primary {
  color: var(--primary-color);
}

.phone-number.secondary {
  color: var(--text-secondary);
}

.operating-hours {
  margin-bottom: 1rem;
}

.hours-item {
  margin-bottom: 0.25rem;
}

.hours-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.cancellation-policy {
  margin-bottom: 1rem;
}

.cancellation-policy p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.bank-info {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.bank-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.bank-logo-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.bank-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.account-number {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.account-holder {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 메인 콘텐츠 */
.main-content {
  grid-column: 3;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
  margin-bottom: 1rem;
}

.header-content {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.page-slogan {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.tab-navigation {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
}

.tab-container {
  width: 850px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-container::-webkit-scrollbar {
  display: none;
}

.tab-button {
  padding: 0.8rem 0.5rem;
  background: #f0f0f0;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border-bottom: 1px solid transparent;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: relative;
  z-index: 10;
}

.tab-button:hover {
  color: var(--primary-color);
  background: #f8f9fa;
}

.tab-button.active {
  color: white;
  border-bottom-color: var(--primary-color);
  background: var(--primary-color);
}

.tab-button:active {
  transform: scale(0.98);
}

.tab-button.empty {
  background: #f0f0f0;
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

.content-area {
  flex: 1;
  padding: 2rem 1rem;
  background-color: #f8f9fa;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  margin: 1rem 0;
}

.error-state {
  color: var(--error-color);
}

.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.map-section {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-placeholder {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.map-fallback {
  text-align: center;
  z-index: 2;
}

.map-fallback h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.map-fallback p {
  margin: 0;
  opacity: 0.9;
}

.map-note {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.map-info {
  text-align: center;
  z-index: 2;
}

.map-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.map-info p {
  margin: 0;
  opacity: 0.9;
}

.map-controls {
  position: absolute;
  right: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-control-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.map-control-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.center-btn {
  background: var(--primary-color);
  color: white;
}

.center-btn:hover {
  background: var(--primary-dark);
}

.map-footer {
  background: white;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
}

.scale-bar {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.map-provider {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.info-panel {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.time-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.time-icon {
  color: var(--primary-color);
}

.time-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.location-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.location-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.location-description {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.subway-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.subway-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.subway-icon {
  color: var(--primary-color);
}

.subway-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.subway-lines {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.line-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.line-2 {
  background: #4CAF50;
}

.line-8 {
  background: #E91E63;
}

.subway-direction {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.products-section {
  flex: 1;
}

.products-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  color: var(--text-secondary);
  border-radius: 12px;
  font-weight: 500;
}

.map-detail-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-top: auto;
}

.map-detail-btn:hover {
  background: #4b5563;
}

.no-selection {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  color: var(--text-secondary);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .product-list-page {
    grid-template-columns: 1fr;
    padding-top: 2rem;
  }
  
  .sidebar-section {
    grid-column: 1;
    order: 2;
    width: 100%;
    padding: 1rem;
  }
  
  .main-content {
    grid-column: 1;
    order: 1;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .page-slogan {
    font-size: 0.8rem;
  }
  
  .content-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
    height: auto;
  }
  
  .map-section {
    height: 400px;
  }
  
  .tab-container {
    padding: 0 0.5rem;
  }
  
  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .panel-content {
    padding: 1rem;
  }
}
</style> 