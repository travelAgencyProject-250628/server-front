<template>
  <div class="kakao-talk-button">
    <button @click="openKakaoTalk" class="kakao-btn" title="카카오톡 상담">
      <div class="kakao-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.442 1.492 4.625 3.77 6.056L5 20l3.925-1.965C9.835 18.35 10.892 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
        </svg>
      </div>
      <span class="kakao-text">카톡상담</span>
    </button>
  </div>
</template>

<script setup>
// 카카오톡 상담 열기
const openKakaoTalk = () => {
  // 실제 카카오톡 상담 링크로 변경하세요
  const kakaoUrl = 'https://pf.kakao.com/_xcxmgG/chat' // 예시 링크
  
  // 모바일에서는 카카오톡 앱으로, 데스크톱에서는 웹 버전으로
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 모바일 환경
    window.open(`kakaotalk://web/openChat?url=${encodeURIComponent(kakaoUrl)}`, '_blank')
    // 카카오톡 앱이 없는 경우를 위한 fallback
    setTimeout(() => {
      window.open(kakaoUrl, '_blank')
    }, 1000)
  } else {
    // 데스크톱 환경
    window.open(kakaoUrl, '_blank', 'width=400,height=600')
  }
}
</script>

<style scoped>
.kakao-talk-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.kakao-btn {
  background: linear-gradient(135deg, #FEE500 0%, #FFEB3B 100%);
  border: none;
  border-radius: 50px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #3C1E1E;
  font-weight: 600;
  font-size: 14px;
  min-width: 110px;
  justify-content: center;
}

.kakao-btn:hover {
  transform: translateY(-2px);
}

.kakao-btn:active {
  transform: translateY(0);
}

.kakao-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.kakao-icon svg {
  color: #3C1E1E;
}

.kakao-text {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  white-space: nowrap;
}

/* 모바일에서는 더 작게 */
@media (max-width: 768px) {
  .kakao-talk-button {
    bottom: 15px;
    right: 15px;
  }
  
  .kakao-btn {
    padding: 10px 14px;
    min-width: 100px;
    font-size: 13px;
  }
  
  .kakao-icon {
    width: 20px;
    height: 20px;
  }
  
  .kakao-icon svg {
    width: 20px;
    height: 20px;
  }
}

/* 아주 작은 화면에서는 아이콘만 */
@media (max-width: 480px) {
  .kakao-btn {
    border-radius: 50%;
    padding: 12px;
    min-width: auto;
    width: 48px;
    height: 48px;
  }
  
  .kakao-text {
    display: none;
  }
  
  .kakao-icon {
    width: 24px;
    height: 24px;
  }
  
  .kakao-icon svg {
    width: 24px;
    height: 24px;
  }
}

/* 스크롤 애니메이션 */
.kakao-talk-button {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 