<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>회사정보</h4>
          <p>더쉼투어</p>
          <p>경기도 오산시 궐리사로 38, 201-h35호(궐동, 하나)</p>
          <p>사업자등록번호: 348-32-01197</p>
        </div>
        
        <div class="footer-section">
          <h4>고객센터</h4>
          <p>전화: 031-376-0597</p>
          <p>팩스: 0504-228-9300</p>
          <p>이메일: casei@naver.com</p>
          <p>운영시간: 09:00~18:00 (주말/공휴일 휴무)</p>
        </div>
        
        <div class="footer-section">
          <h4>고객지원</h4>
          <ul class="footer-links">
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">여행약관</a></li>
            <li><a href="#">취소/환불정책</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>SNS</h4>
          <div class="social-links">
            <a href="#" class="social-link">페이스북</a>
            <a href="#" class="social-link">인스타그램</a>
            <a href="#" class="social-link">유튜브</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 더쉼투어. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer 컴포넌트는 별도의 로직이 필요하지 않습니다
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
  --primary-color: #2563eb;
  --primary-dark: #1e40af;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --bg-light: #f8fafc;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 푸터 스타일 */
.footer {
  background: var(--text-primary);
  color: white;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  color: white;
}

.footer-section p {
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: var(--transition);
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #94a3b8;
  text-decoration: none;
  transition: var(--transition);
}

.social-link:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #374151;
  color: #94a3b8;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style> 