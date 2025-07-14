<template>
  <div class="test-view">
    <div class="tab-buttons">
      <button :class="{active: activeTab === 'category'}" @click="activeTab = 'category'">카테고리 메뉴 API</button>
      <button :class="{active: activeTab === 'popular'}" @click="activeTab = 'popular'">인기 투어 API</button>
    </div>

    <div v-if="activeTab === 'category'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 카테고리 메뉴 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/categories.js</div>
          <div class="api-method">
            <span class="method">categoryService.getMenuData()</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              Supabase에서 1차 카테고리(Categories)와 2차 카테고리(Products의 tag_id + Tags)를 조합하여<br>
              <code>{ primaryCategories, secondaryCategories }</code> 구조의 메뉴 데이터를 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
              <pre>{
  primaryCategories: [
    { id: 1, name: '인기여행' },
    { id: 2, name: '먹거리여행' },
    ...
  ],
  secondaryCategories: {
    1: [ { id: 1, name: '당일여행' }, ... ],
    2: [ { id: 2, name: '1박 2일' }, ... ],
    ...
  }
}</pre>
            </p>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; categoryService &#125; from '@/lib/categories.js'<br>
                const result = await categoryService.getMenuData()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>카테고리 메뉴 데이터 테스트</h2>
      <div v-if="loading">로딩 중...</div>
      <div v-else-if="error" style="color:red">에러: {{ error }}</div>
      <pre v-else>{{ menuData }}</pre>
    </div>

    <div v-else>
      <div class="swagger-doc">
        <h2>📚 API 문서: 인기 투어 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/popularTours.js</div>
          <div class="api-method">
            <span class="method">getPopularTours()</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              Supabase Products 테이블에서 duration, location(조인), 가격, 이미지 등 인기 투어 상품 6개를 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
              <pre>[
  {
    id: 1,
    title: '제주도 3일 완전정복',
    description: '한라산, 성산일출봉, ...',
    duration: '2박 3일',
    location: '제주도',
    price: 285000,
    badge: '베스트',
    image: 'https://...'
  },
  ...
]</pre>
            </p>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getPopularTours &#125; from '@/lib/popularTours.js'<br>
                const result = await getPopularTours()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>인기 투어 데이터 테스트</h2>
      <div v-if="loadingTours">로딩 중...</div>
      <div v-else-if="errorTours" style="color:red">에러: {{ errorTours }}</div>
      <pre v-else>{{ toursData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryService } from '@/lib/categories.js'
import { getPopularTours } from '@/lib/products.js'

const menuData = ref(null)
const error = ref(null)
const loading = ref(true)

const toursData = ref(null)
const errorTours = ref(null)
const loadingTours = ref(true)

const activeTab = ref('category')

onMounted(async () => {
  // 카테고리 메뉴 테스트
  loading.value = true
  const result = await categoryService.getMenuData()
  if (result.success) {
    menuData.value = JSON.stringify(result.menuData, null, 2)
  } else {
    error.value = result.error
  }
  loading.value = false

  // 인기 투어 테스트
  loadingTours.value = true
  const toursResult = await getPopularTours()
  if (toursResult.success) {
    toursData.value = JSON.stringify(toursResult.tours, null, 2)
  } else {
    errorTours.value = toursResult.error
  }
  loadingTours.value = false
})
</script>

<style scoped>
.test-view {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
.tab-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}
.tab-buttons button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px 8px 0 0;
  background: #e2e8f0;
  color: #22223b;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.tab-buttons button.active {
  background: #2563eb;
  color: #fff;
}
pre {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}
.swagger-doc {
  max-width: 800px;
  margin: 0 auto 2rem auto;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.api-section {
  margin-top: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 1.2rem;
  border: 1px solid #e2e8f0;
}
.api-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 0.5rem;
}
.api-method {
  font-size: 1rem;
  font-weight: 500;
  color: #059669;
  margin-bottom: 1rem;
}
.api-desc {
  font-size: 1rem;
  color: #22223b;
}
.api-desc pre {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  margin-top: 0.5rem;
}
.api-desc code {
  background: #f1f5f9;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.97em;
}
</style> 