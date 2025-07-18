<template>
  <div class="test-view">
    <div class="tab-buttons">
      <button :class="{active: activeTab === 'category'}" @click="activeTab = 'category'">카테고리 메뉴 API</button>
      <button :class="{active: activeTab === 'popular'}" @click="activeTab = 'popular'">인기 투어 API</button>
      <button :class="{active: activeTab === 'product'}" @click="activeTab = 'product'">상품 상세 API</button>
      <button :class="{active: activeTab === 'categoryProducts'}" @click="activeTab = 'categoryProducts'">카테고리별 상품 API</button>
      <button :class="{active: activeTab === 'searchProducts'}" @click="activeTab = 'searchProducts'">상품 검색 API</button>
      <button :class="{active: activeTab === 'banner'}" @click="activeTab = 'banner'">배너 이미지 API</button>
      <button :class="{active: activeTab === 'reservation'}" @click="activeTab = 'reservation'">예약 상세 API</button>
      <button :class="{active: activeTab === 'user'}" @click="activeTab = 'user'">유저 정보 API</button>
      <button :class="{active: activeTab === 'myBookings'}" @click="activeTab = 'myBookings'">내 예약 목록 API</button>
      <button :class="{active: activeTab === 'startingPoints'}" @click="activeTab = 'startingPoints'">출발지 목록 API</button>
      <button :class="{active: activeTab === 'addProduct'}" @click="activeTab = 'addProduct'">상품 추가 API</button>
      <button :class="{active: activeTab === 'tags'}" @click="activeTab = 'tags'">태그 API</button>
      <button :class="{active: activeTab === 'categories'}" @click="activeTab = 'categories'">카테고리 API</button>
    </div>

    <!-- 유저 정보 API 탭 -->
    <div v-if="activeTab === 'user'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 유저 정보 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/users.js</div>
          <div class="api-method">
            <span class="method">getCurrentUserInfo()</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              현재 로그인한 사용자의 상세 정보를 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{
  email: 'jbl6938@gmail.com',
  name: '이정원',
  phone: '010-2237-6938',
  mobile: '010-2237-6938',
  zipcode: '04759',
  address1: '서울 성동구 마조로15길 9 (마장동)',
  address2: '105호',
  smsReceive: 'Y'
}</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getCurrentUserInfo &#125; from '@/lib/users.js'<br>
                const result = await getCurrentUserInfo()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>유저 정보 데이터 테스트</h2>
      <div class="user-test">
        <button @click="fetchUserInfo" :disabled="loadingUser">유저 정보 불러오기</button>
      </div>
      <div v-if="loadingUser">로딩 중...</div>
      <div v-else-if="errorUser" style="color:red">에러: {{ errorUser }}</div>
      <pre v-else-if="userInfo">{{ userInfo }}</pre>
      <h2>유저 정보 수정 테스트</h2>
      <form @submit.prevent="submitEdit" class="user-edit-form">
        <label>이름</label>
        <input v-model="editForm.name" required />
        <label>휴대폰</label>
        <input v-model="editForm.phone" />
        <label>모바일</label>
        <input v-model="editForm.mobile" />
        <label>우편번호</label>
        <input v-model="editForm.zipcode" />
        <label>주소1</label>
        <input v-model="editForm.address1" />
        <label>주소2</label>
        <input v-model="editForm.address2" />
        <label>SMS 수신</label>
        <select v-model="editForm.smsReceive">
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
        <label>비밀번호(변경 시 입력)</label>
        <input v-model="editForm.password" type="password" autocomplete="new-password" />
        <button type="submit" :disabled="loadingEdit">수정</button>
      </form>
      <div v-if="loadingEdit">수정 중...</div>
      <div v-else-if="editError" style="color:red">에러: {{ editError }}</div>
      <div v-else-if="editResult" style="color:green">{{ editResult }}</div>
    </div>

    <!-- 내 예약 목록 API 탭 -->
    <div v-if="activeTab === 'myBookings'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 내 예약 목록 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/reservations.js</div>
          <div class="api-method">
            <span class="method">getMyReservations()</span>
        </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              현재 로그인된 사용자의 auth_id로 Bookings 테이블에서 내 예약 전체를 조회합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>[
  {
    id: 1,
    reservationDate: '2025/07/06',
    productTitle: '[당일]7월영주한정!(1만원상품권제공)천년고찰~영주부석사+힐링숲족욕겟길(족욕부~회방사페딩)+수수서원+인삼시장',
    departureDate: '2025/07/18',
    totalAmount: 32000,
    status: '예약확정',
    adultCount: 1,
    childCount: 0
  },
  ...
]</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getMyReservations &#125; from '@/lib/reservations.js'<br>
                const result = await getMyReservations()
              </code>
            </p>
        </div>
        </div>
      </div>
      <h2>내 예약 목록 데이터 테스트</h2>
      <div class="my-bookings-test">
        <button @click="fetchMyBookings" :disabled="loadingMyBookings">내 예약 불러오기</button>
      </div>
      <div v-if="loadingMyBookings">로딩 중...</div>
      <div v-else-if="errorMyBookings" style="color:red">에러: {{ errorMyBookings }}</div>
      <pre v-else-if="myBookingsData">{{ myBookingsData }}</pre>
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
            </p>
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

    <div v-else-if="activeTab === 'popular'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 인기 투어 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/products.js</div>
          <div class="api-method">
            <span class="method">getPopularTours()</span>
        </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              Supabase Products 테이블에서 duration, location(조인), 가격, 이미지 등 인기 투어 상품 6개를 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
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
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getPopularTours &#125; from '@/lib/products.js'<br>
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

    <div v-else-if="activeTab === 'product'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 상품 상세 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/products.js</div>
          <div class="api-method">
            <span class="method">getProductDetail(productId)</span>
      </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              product_id로 특정 상품의 상세 정보를 조회합니다.<br>
              location, badge 등 조인, 인기투어와 동일한 구조로 반환.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{
  id: 1,
  title: '제주도 3일 완전정복',
  description: '한라산, 성산일출봉, ...',
  duration: '2박 3일',
  location: '제주도',
  price: 285000,
  badge: '베스트',
  image: 'https://...'
}</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getProductDetail &#125; from '@/lib/products.js'<br>
                const result = await getProductDetail(1)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>상품 상세 데이터 테스트</h2>
      <div class="product-test">
        <input v-model="productId" type="number" min="1" placeholder="상품 id 입력" />
        <button @click="fetchProduct" :disabled="loadingProduct">조회</button>
      </div>
      <div v-if="loadingProduct">로딩 중...</div>
      <div v-else-if="errorProduct" style="color:red">에러: {{ errorProduct }}</div>
      <pre v-else-if="productData">{{ productData }}</pre>
    </div>

    <div v-else-if="activeTab === 'categoryProducts'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 카테고리별 상품 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/products.js</div>
          <div class="api-method">
            <span class="method">getProductsByCategory(categoryId)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              category_id로 해당 카테고리의 모든 상품을 조회합니다.<br>
              location, badge 등 조인, 인기투어와 동일한 구조로 반환.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
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
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getProductsByCategory &#125; from '@/lib/products.js'<br>
                const result = await getProductsByCategory(1)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>카테고리별 상품 데이터 테스트</h2>
      <div class="category-products-test">
        <input v-model="categoryId" type="number" min="1" placeholder="카테고리 id 입력" />
        <button @click="fetchCategoryProducts" :disabled="loadingCategoryProducts">조회</button>
      </div>
      <div v-if="loadingCategoryProducts">로딩 중...</div>
      <div v-else-if="errorCategoryProducts" style="color:red">에러: {{ errorCategoryProducts }}</div>
      <pre v-else-if="categoryProductsData">{{ categoryProductsData }}</pre>
    </div>

    <div v-else-if="activeTab === 'searchProducts'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 상품 검색 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/products.js</div>
          <div class="api-method">
            <span class="method">searchProducts(keyword)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              검색어(keyword)가 상품명, 부제목, 설명, 기간, 지역명에 하나라도 포함된 상품 전체를 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
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
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; searchProducts &#125; from '@/lib/products.js'<br>
                const result = await searchProducts('제주')
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>상품 검색 데이터 테스트</h2>
      <div class="search-products-test">
        <input v-model="searchKeyword" placeholder="검색어 입력" />
        <button @click="fetchSearchProducts" :disabled="loadingSearchProducts">검색</button>
      </div>
      <div v-if="loadingSearchProducts">로딩 중...</div>
      <div v-else-if="errorSearchProducts" style="color:red">에러: {{ errorSearchProducts }}</div>
      <pre v-else-if="searchProductsData">{{ searchProductsData }}</pre>
        </div>
        
    <div v-else-if="activeTab === 'banner'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 배너 이미지 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/banners.js</div>
          <div class="api-method">
            <span class="method">getBannerImages()</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              BannerImages 테이블에서 모든 image_url을 배열로 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>[
  "https://.../banner1.jpg",
  "https://.../banner2.jpg",
  ...
]</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getBannerImages &#125; from '@/lib/banners.js'<br>
                const result = await getBannerImages()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>배너 이미지 데이터 테스트</h2>
      <div class="banner-test">
        <button @click="fetchBannerImages" :disabled="loadingBanner">배너 이미지 불러오기</button>
      </div>
      <div v-if="loadingBanner">로딩 중...</div>
      <div v-else-if="errorBanner" style="color:red">에러: {{ errorBanner }}</div>
      <pre v-else-if="bannerData">{{ bannerData }}</pre>
      </div>

    <div v-else-if="activeTab === 'reservation'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 예약 상세 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/reservations.js</div>
          <div class="api-method">
            <span class="method">getReservationDetail(reservationId)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              예약 id로 예약 상세 정보를 조회합니다.<br>
              Bookings(예약) + Products(상품) + StartingPoints(출발지) + Users(예약자) 조인.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{
  id: 1,
  bookerName: '홍길동',
  bookerPhone: '010-2237-6938',
  emergencyContact: '010-2237-6938',
  bookerEmail: 'jbl6938@gmail.com',
  productTitle: '[당일]★리무진버스...'
  adultCount: 1,
  childCount: 0,
  duration: '당일',
  departureDate: '2025/08/08',
  departureLocation: '잠실',
  includedItems: '2식...',
  excludedItems: '개인경비...',
  adultPrice: 87000,
  totalAmount: 87000,
  status: '예약확정',
  memberType: '회원예약',
  travelers: [
    { name: '홍길동', phone: '010-2237-6938', type: '성인' }
  ]
}</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getReservationDetail &#125; from '@/lib/reservations.js'<br>
                const result = await getReservationDetail(예약id)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>예약 상세 데이터 테스트</h2>
      <div class="reservation-test">
        <input v-model="reservationId" type="number" min="1" placeholder="예약 id 입력" />
        <button @click="fetchReservation" :disabled="loadingReservation">조회</button>
      </div>
      <div v-if="loadingReservation">로딩 중...</div>
      <div v-else-if="errorReservation" style="color:red">에러: {{ errorReservation }}</div>
      <pre v-else-if="reservationData">{{ reservationData }}</pre>

      <div class="swagger-doc">
        <h2>📚 API 문서: 예약 생성(POST)</h2>
        <div class="api-section">
          <div class="api-title">POST /lib/reservations.js</div>
          <div class="api-method">
            <span class="method">createReservation(reservationData)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              예약 폼 데이터를 받아 Bookings 테이블에 예약을 생성합니다.<br>
              travelers_name, travelers_phone은 콤마로 join해서 저장.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{ success: true, id: 123 }</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; createReservation &#125; from '@/lib/reservations.js'<br>
                const result = await createReservation(reservationData)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>예약 생성(POST) 테스트</h2>
      <form class="reservation-post-test" @submit.prevent="submitReservation">
        <label>예약자명 <span class="example">예: 홍길동</span></label>
        <input v-model="postForm.bookerName" placeholder="예약자명" required />
        <label>예약자 전화번호 <span class="example">예: 010-1234-5678</span></label>
        <input v-model="postForm.bookerPhone" placeholder="전화번호" required />
        <label>예약자 이메일 <span class="example">예: test@email.com</span></label>
        <input v-model="postForm.bookerEmail" placeholder="이메일" required />
        <label>비상연락처 <span class="example">예: 010-9999-8888</span></label>
        <input v-model="postForm.emergencyContact" placeholder="비상연락처" />
        <label>입금자명 <span class="example">예: 홍길동</span></label>
        <input v-model="postForm.depositorName" placeholder="입금자명" />
        <label>성인 수 <span class="example">예: 2</span></label>
        <input v-model.number="postForm.adultCount" type="number" min="0" placeholder="성인 수" required />
        <label>소인 수 <span class="example">예: 1</span></label>
        <input v-model.number="postForm.childCount" type="number" min="0" placeholder="소인 수" required />
        <label>상품 ID <span class="example">예: 1</span></label>
        <input v-model="postForm.productId" type="number" placeholder="상품 ID" required />
        <label>출발지 ID <span class="example">예: 1</span></label>
        <input v-model="postForm.startingPointId" type="number" placeholder="출발지 ID" required />
        <label>출발일 <span class="example">예: 2025-08-08</span></label>
        <input v-model="postForm.departureDate" type="date" placeholder="출발일" required />
        <div class="agree-terms-row">
          <input v-model="postForm.agreeTerms" type="checkbox" id="agreeTerms" /> <label for="agreeTerms">약관동의 (필수)</label>
        </div>
        <label>상태 <span class="example">예: 예약확정, 대기 등</span></label>
        <input v-model="postForm.status" placeholder="상태" />
        <label>여행자명 <span class="example">여러 명은 콤마로 구분, 예: 홍길동,김철수</span></label>
        <input v-model="travelerName" placeholder="여행자명" />
        <label>여행자 전화 <span class="example">여러 명은 콤마로 구분, 예: 010-1234-5678,010-2222-3333</span></label>
        <input v-model="travelerPhone" placeholder="여행자 전화" />
        <button type="submit" :disabled="loadingPost">등록</button>
      </form>
      <div v-if="loadingPost">등록 중...</div>
      <div v-else-if="errorPost" style="color:red">에러: {{ errorPost }}</div>
      <div v-else-if="postResult">등록 성공! 예약 ID: {{ postResult }}</div>
      </div>

    <!-- 출발지 목록 API 탭 -->
    <div v-if="activeTab === 'startingPoints'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 출발지 목록 데이터</h2>
        <div class="api-section">
          <div class="api-title">GET /lib/startingpoints.js</div>
          <div class="api-method">
            <span class="method">getStartingPoints()</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              Supabase StartingPoints 테이블에서 출발지(id, name) 목록을 배열로 반환합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>[
  { id: 1, name: '영등포' },
  { id: 2, name: '서울역' },
  { id: 3, name: '잠실' },
  ...
]</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; getStartingPoints &#125; from '@/lib/startingpoints.js'<br>
                const result = await getStartingPoints()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>출발지 목록 데이터 테스트</h2>
      <div class="startingpoints-test">
        <button @click="fetchStartingPoints" :disabled="loadingStartingPoints">출발지 불러오기</button>
      </div>
      <div v-if="loadingStartingPoints">로딩 중...</div>
      <div v-else-if="errorStartingPoints" style="color:red">에러: {{ errorStartingPoints }}</div>
      <pre v-else-if="startingPointsData">{{ startingPointsData }}</pre>
      </div>

    <!-- 상품 추가 API 탭 -->
    <div v-if="activeTab === 'addProduct'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 상품 추가(등록)</h2>
        <div class="api-section">
          <div class="api-title">POST /lib/products.js</div>
          <div class="api-method">
            <span class="method">createProduct(productData)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              상품 정보를 입력받아 Products 테이블에 등록합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{ success: true, id: 123 }</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; createProduct &#125; from '@/lib/products.js'<br>
                const result = await createProduct(productData)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>상품 추가(등록) 테스트</h2>
      <form class="add-product-form" @submit.prevent="submitAddProduct">
        <label>상품명</label>
        <input v-model="addProductForm.title" required />
        <label>부제목</label>
        <input v-model="addProductForm.subtitle" />
        <label>대표 이미지 URL</label>
        <input v-model="addProductForm.main_image_url" disabled placeholder="이미지 업로드 시 자동 저장" />
        <label>상품 이미지 업로드 (여러 장 가능, 첫 번째가 대표)</label>
        <input type="file" multiple accept="image/*" @change="handleAddProductFiles" />
        <div v-if="addProductFiles.length" class="image-preview-list">
          <div v-for="(file, idx) in addProductFiles" :key="idx" class="image-preview-item">
            <img v-if="file.preview" :src="file.preview" style="max-width:80px;max-height:80px;object-fit:cover;border-radius:6px;" />
            <div>{{ idx === 0 ? 'main' : idx }}</div>
            <div style="font-size:0.9em;color:#64748b">{{ file.name }}</div>
          </div>
        </div>
        <label>성인 가격</label>
        <input v-model.number="addProductForm.adult_price" type="number" />
        <label>소인 가격</label>
        <input v-model.number="addProductForm.child_price" type="number" />
        <label>여행 기간</label>
        <input v-model="addProductForm.duration" />
        <label>카테고리 ID</label>
        <input v-model.number="addProductForm.category_id" type="number" />
        <label>지역(로케이션) ID</label>
        <input v-model.number="addProductForm.location_id" type="number" />
        <label>뱃지 ID(선택)</label>
        <input v-model.number="addProductForm.badge_id" type="number" />
        <label>태그 ID(tag_id, 선택)</label>
        <input v-model.number="addProductForm.tag_id" type="number" />
        <label>상품 코드(product_code, 선택)</label>
        <input v-model="addProductForm.product_code" />
        <label>이벤트 내용(선택)</label>
        <input v-model="addProductForm.event_content" />
        <label>포함사항(선택)</label>
        <input v-model="addProductForm.included_items" />
        <label>불포함사항(선택)</label>
        <input v-model="addProductForm.excluded_items" />
        <label>출발 유력 기준 인원(선택)</label>
        <input v-model.number="addProductForm.likely_departure_threshold" type="number" min="1" placeholder="예: 15" />
        <label>여행 확정 기준 인원(선택)</label>
        <input v-model.number="addProductForm.confirmed_departure_threshold" type="number" min="1" placeholder="예: 25" />
        <button type="submit" :disabled="loadingAddProduct">등록</button>
      </form>
      <div v-if="loadingAddProduct">등록 중...</div>
      <div v-else-if="addProductError" style="color:red">에러: {{ addProductError }}</div>
      <div v-else-if="addProductResult" style="color:green">등록 성공! 상품 ID: {{ addProductResult }}</div>
    </div>

    <!-- 태그 API 탭 -->
    <div v-if="activeTab === 'tags'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 태그 데이터</h2>
        <div class="api-section">
                  <div class="api-title">GET /lib/tags.js</div>
        <div class="api-method">
          <span class="method">tagService.getAllTags()</span>
        </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              전체 태그 목록을 조회합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>[
  { id: 1, name: '당일' },
  { id: 2, name: '1박2일' },
  ...
]</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; tagService &#125; from '@/lib/tags.js'<br>
                const result = await tagService.getAllTags()
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>태그 전체 조회 테스트</h2>
      <div class="tag-test-row">
        <button @click="fetchTags" :disabled="loadingTags">태그 목록 불러오기</button>
      </div>
      <div v-if="loadingTags">로딩 중...</div>
      <div v-else-if="errorTags" style="color:red">에러: {{ errorTags }}</div>
      <pre v-else-if="tagsData">{{ tagsData }}</pre>
      <h2>태그 추가(POST) 테스트</h2>
      <form class="add-tag-form" @submit.prevent="submitAddTag">
        <label>태그명</label>
        <input v-model="addTagName" required />
        <button type="submit" :disabled="loadingAddTag">추가</button>
      </form>
      <div v-if="loadingAddTag">추가 중...</div>
      <div v-else-if="addTagError" style="color:red">에러: {{ addTagError }}</div>
      <div v-else-if="addTagResult" style="color:green">추가 성공! 태그 ID: {{ addTagResult }}</div>
    </div>

    <!-- 카테고리 API 탭 -->
    <div v-if="activeTab === 'categories'">
      <div class="swagger-doc">
        <h2>📚 API 문서: 카테고리 데이터</h2>
        <div class="api-section">
          <div class="api-title">POST /lib/categories.js</div>
          <div class="api-method">
            <span class="method">categoryService.createCategory(categoryData)</span>
          </div>
          <div class="api-desc">
            <p>
              <strong>설명:</strong> <br>
              카테고리 정보를 입력받아 Categories 테이블에 등록합니다.<br>
              <br>
              <strong>반환 예시:</strong>
            </p>
            <pre>{ success: true, category: { id: 1, name: '인기여행' }, message: '카테고리가 성공적으로 생성되었습니다.' }</pre>
            <p>
              <strong>사용 예시:</strong><br>
              <code>
                import &#123; categoryService &#125; from '@/lib/categories.js'<br>
                const result = await categoryService.createCategory(&#123; name: '인기여행' &#125;)
              </code>
            </p>
          </div>
        </div>
      </div>
      <h2>카테고리 추가(POST) 테스트</h2>
      <form class="add-category-form" @submit.prevent="submitAddCategory">
        <label>카테고리명</label>
        <input v-model="addCategoryName" required />
        <button type="submit" :disabled="loadingAddCategory">추가</button>
      </form>
      <div v-if="loadingAddCategory">추가 중...</div>
      <div v-else-if="addCategoryError" style="color:red">에러: {{ addCategoryError }}</div>
      <div v-else-if="addCategoryResult" style="color:green">추가 성공! 카테고리 ID: {{ addCategoryResult }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { categoryService } from '@/lib/categories.js'
import { getPopularTours, getProductDetail, getProductsByCategory, searchProducts, createProduct } from '@/lib/products.js'
import { getBannerImages } from '@/lib/banners.js'
import { getReservationDetail, createReservation, getMyReservations } from '@/lib/reservations.js'
import { getCurrentUserInfo, updateUserInfo } from '@/lib/users.js'
import { getStartingPoints } from '@/lib/startingpoints.js'
import { tagService } from '@/lib/tags.js'

const menuData = ref(null)
const error = ref(null)
const loading = ref(true)

const toursData = ref(null)
const errorTours = ref(null)
const loadingTours = ref(true)

const activeTab = ref('category')

// 카테고리별 상품 테스트용
const categoryId = ref('')
const categoryProductsData = ref(null)
const errorCategoryProducts = ref(null)
const loadingCategoryProducts = ref(false)

function resetCategoryProductsTest() {
  categoryId.value = ''
  categoryProductsData.value = null
  errorCategoryProducts.value = null
  loadingCategoryProducts.value = false
}

async function fetchCategoryProducts() {
  if (!categoryId.value) return
  loadingCategoryProducts.value = true
  errorCategoryProducts.value = null
  categoryProductsData.value = null
  const result = await getProductsByCategory(Number(categoryId.value))
  if (result.success) {
    categoryProductsData.value = JSON.stringify(result.products, null, 2)
  } else {
    errorCategoryProducts.value = result.error
  }
  loadingCategoryProducts.value = false
}

// 상품 검색 테스트용
const searchKeyword = ref('')
const searchProductsData = ref(null)
const errorSearchProducts = ref(null)
const loadingSearchProducts = ref(false)

function resetSearchProductsTest() {
  searchKeyword.value = ''
  searchProductsData.value = null
  errorSearchProducts.value = null
  loadingSearchProducts.value = false
}

async function fetchSearchProducts() {
  if (!searchKeyword.value) return
  loadingSearchProducts.value = true
  errorSearchProducts.value = null
  searchProductsData.value = null
  const result = await searchProducts(searchKeyword.value)
  if (result.success) {
    searchProductsData.value = JSON.stringify(result.products, null, 2)
  } else {
    errorSearchProducts.value = result.error
  }
  loadingSearchProducts.value = false
}

// 배너 이미지 테스트용
const bannerData = ref(null)
const errorBanner = ref(null)
const loadingBanner = ref(false)

// 상품 상세 테스트용
const productId = ref('')
const productData = ref(null)
const errorProduct = ref(null)
const loadingProduct = ref(false)

// 예약 상세 테스트용
const reservationId = ref('')
const reservationData = ref(null)
const errorReservation = ref(null)
const loadingReservation = ref(false)

// 예약 생성 테스트용
const postForm = ref({
  bookerName: '홍길동',
  bookerPhone: '010-1234-5678',
  bookerEmail: 'test@email.com',
  emergencyContact: '010-9999-8888',
  depositorName: '홍길동',
  adultCount: 2,
  childCount: 1,
  productId: 1,
  startingPointId: 1,
  departureDate: '2025-08-08',
  agreeTerms: true,
  status: '예약확정'
})
const travelerName = ref('홍길동,김철수')
const travelerPhone = ref('010-1234-5678,010-2222-3333')
const postResult = ref(null)
const errorPost = ref(null)
const loadingPost = ref(false)

// 유저 정보 테스트용
const userInfo = ref(null)
const errorUser = ref(null)
const loadingUser = ref(false)
// 유저 정보 수정 테스트용
const editForm = ref({
  name: '',
  phone: '',
  mobile: '',
  zipcode: '',
  address1: '',
  address2: '',
  smsReceive: 'Y',
  password: ''
})
const editResult = ref(null)
const editError = ref(null)
const loadingEdit = ref(false)

// 내 예약 목록 테스트용
const myBookingsData = ref(null)
const errorMyBookings = ref(null)
const loadingMyBookings = ref(false)

// 출발지 목록 테스트용
const startingPointsData = ref(null)
const errorStartingPoints = ref(null)
const loadingStartingPoints = ref(false)

// 상품 추가 테스트용
const addProductForm = ref({
  title: '',
  subtitle: '',
  main_image_url: '',
  adult_price: 0,
  child_price: 0,
  duration: '',
  category_id: null,
  location_id: null,
  badge_id: null,
  tag_id: null,
  product_code: '',
  event_content: '',
  included_items: '',
  excluded_items: '',
  likely_departure_threshold: null,
  confirmed_departure_threshold: null
})
const addProductResult = ref(null)
const addProductError = ref(null)
const loadingAddProduct = ref(false)

// 상품 추가 이미지 파일 상태
const addProductFiles = ref([])

function handleAddProductFiles(e) {
  const files = Array.from(e.target.files || [])
  // 미리보기 URL 생성
  addProductFiles.value = files.map(f => {
    const preview = URL.createObjectURL(f)
    return Object.assign(f, { preview })
  })
}

async function submitAddProduct() {
  loadingAddProduct.value = true
  addProductError.value = null
  addProductResult.value = null
  try {
    // 빈 값/0/null은 제외하고 전송
    const payload = {}
    for (const key in addProductForm.value) {
      const v = addProductForm.value[key]
      if (v !== '' && v !== null && v !== undefined) payload[key] = v
    }
    if (addProductFiles.value.length) {
      payload.images = addProductFiles.value
    }
    const result = await createProduct(payload)
    if (result.success) {
      addProductResult.value = result.id
      // 폼 초기화
      Object.keys(addProductForm.value).forEach(k => addProductForm.value[k] = (typeof addProductForm.value[k] === 'number' ? 0 : ''))
      addProductFiles.value.forEach(f => URL.revokeObjectURL(f.preview))
      addProductFiles.value = []
    } else {
      addProductError.value = result.error
    }
  } catch (e) {
    addProductError.value = e.message
  } finally {
    loadingAddProduct.value = false
  }
}

// 태그 테스트용
const tagsData = ref(null)
const errorTags = ref(null)
const loadingTags = ref(false)
const addTagName = ref('')
const addTagResult = ref(null)
const addTagError = ref(null)
const loadingAddTag = ref(false)

async function fetchTags() {
  loadingTags.value = true
  errorTags.value = null
  tagsData.value = null
  const result = await tagService.getAllTags()
  if (result.success) {
    tagsData.value = JSON.stringify(result.tags, null, 2)
  } else {
    errorTags.value = result.error
  }
  loadingTags.value = false
}

async function submitAddTag() {
  loadingAddTag.value = true
  addTagError.value = null
  addTagResult.value = null
  try {
    const result = await tagService.createTag({ name: addTagName.value })
    if (result.success) {
      addTagResult.value = result.tag.id
      addTagName.value = ''
      // 태그 목록 새로고침
      await fetchTags()
    } else {
      addTagError.value = result.error
    }
  } catch (e) {
    addTagError.value = e.message
  } finally {
    loadingAddTag.value = false
  }
}

// 카테고리 추가 테스트용
const addCategoryName = ref('')
const addCategoryResult = ref(null)
const addCategoryError = ref(null)
const loadingAddCategory = ref(false)

async function submitAddCategory() {
  loadingAddCategory.value = true
  addCategoryError.value = null
  addCategoryResult.value = null
  try {
    const result = await categoryService.createCategory({ name: addCategoryName.value })
    if (result.success) {
      addCategoryResult.value = result.category.id
      addCategoryName.value = ''
    } else {
      addCategoryError.value = result.error
    }
  } catch (e) {
    addCategoryError.value = e.message
  } finally {
    loadingAddCategory.value = false
  }
}

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

async function fetchReservation() {
  if (!reservationId.value) return
  loadingReservation.value = true
  errorReservation.value = null
  reservationData.value = null
  const result = await getReservationDetail(Number(reservationId.value))
  if (result.success) {
    reservationData.value = JSON.stringify(result.reservation, null, 2)
  } else {
    errorReservation.value = result.error
  }
  loadingReservation.value = false
}

async function submitReservation() {
  if (!postForm.value.agreeTerms) {
    alert('약관에 동의해야 합니다.');
    return;
  }

  loadingPost.value = true;
  errorPost.value = null;
  postResult.value = null;

  try {
    const reservationData = {
      bookerName: postForm.value.bookerName,
      bookerPhone: postForm.value.bookerPhone,
      bookerEmail: postForm.value.bookerEmail,
      emergencyContact: postForm.value.emergencyContact,
      depositorName: postForm.value.depositorName,
      adultCount: postForm.value.adultCount,
      childCount: postForm.value.childCount,
      productId: postForm.value.productId,
      startingPointId: postForm.value.startingPointId,
      departureDate: postForm.value.departureDate,
      agreeTerms: postForm.value.agreeTerms,
      status: postForm.value.status,
      travelersName: travelerName.value,
      travelersPhone: travelerPhone.value
    };

    const result = await createReservation(reservationData);
    if (result.success) {
      postResult.value = result.id;
    } else {
      errorPost.value = result.error;
    }
  } catch (e) {
    errorPost.value = e.message;
  } finally {
    loadingPost.value = false;
  }
}

async function fetchUserInfo() {
  loadingUser.value = true
  errorUser.value = null
  userInfo.value = null
  const result = await getCurrentUserInfo()
  if (result.success) {
    userInfo.value = JSON.stringify(result.user, null, 2)
    // editForm에 값 세팅
    Object.assign(editForm.value, result.user)
    editForm.value.password = ''
  } else {
    errorUser.value = result.error
  }
  loadingUser.value = false
}

async function submitEdit() {
  loadingEdit.value = true
  editError.value = null
  editResult.value = null
  const result = await updateUserInfo(editForm.value)
  if (result.success) {
    editResult.value = '수정 성공!'
  } else {
    editError.value = result.error
  }
  loadingEdit.value = false
}

async function fetchMyBookings() {
  loadingMyBookings.value = true
  errorMyBookings.value = null
  myBookingsData.value = null
  const result = await getMyReservations()
  if (result.success) {
    myBookingsData.value = JSON.stringify(result.reservations, null, 2)
  } else {
    errorMyBookings.value = result.error
  }
  loadingMyBookings.value = false
}

function resetMyBookingsTest() {
  myBookingsData.value = null
  errorMyBookings.value = null
  loadingMyBookings.value = false
}

function resetProductTest() {
  productId.value = ''
  productData.value = null
  errorProduct.value = null
  loadingProduct.value = false
}

async function fetchProduct() {
  if (!productId.value) return
  loadingProduct.value = true
  errorProduct.value = null
  productData.value = null
  const result = await getProductDetail(Number(productId.value))
  if (result.success) {
    productData.value = JSON.stringify(result.product, null, 2)
  } else {
    errorProduct.value = result.error
  }
  loadingProduct.value = false
}

function resetBannerTest() {
  bannerData.value = null
  errorBanner.value = null
  loadingBanner.value = false
}

async function fetchBannerImages() {
  loadingBanner.value = true
  errorBanner.value = null
  bannerData.value = null
  const result = await getBannerImages()
  if (result.success) {
    bannerData.value = JSON.stringify(result.images, null, 2)
  } else {
    errorBanner.value = result.error
  }
  loadingBanner.value = false
}

async function fetchStartingPoints() {
  loadingStartingPoints.value = true
  errorStartingPoints.value = null
  startingPointsData.value = null
  const result = await getStartingPoints()
  if (result.success) {
    startingPointsData.value = JSON.stringify(result.startingPoints, null, 2)
  } else {
    errorStartingPoints.value = result.error
  }
  loadingStartingPoints.value = false
}

// 탭 전환 시 상품 상세 테스트 초기화
watch(activeTab, (tab) => {
  if (tab === 'product') resetProductTest()
  if (tab === 'banner') resetBannerTest()
  if (tab === 'categoryProducts') resetCategoryProductsTest()
  if (tab === 'searchProducts') resetSearchProductsTest()
  if (tab === 'user') {
    userInfo.value = null
    errorUser.value = null
    loadingUser.value = false
    // 유저 정보 수정 테스트 초기화
    editForm.value = {
      name: '',
      phone: '',
      mobile: '',
      zipcode: '',
      address1: '',
      address2: '',
      smsReceive: 'Y',
      password: ''
    }
    editResult.value = null
    editError.value = null
    loadingEdit.value = false
  }
  if (tab === 'myBookings') resetMyBookingsTest()
  if (tab === 'startingPoints') {
    startingPointsData.value = null
    errorStartingPoints.value = null
    loadingStartingPoints.value = false
  }
  if (tab === 'addProduct') {
    Object.keys(addProductForm.value).forEach(k => addProductForm.value[k] = (typeof addProductForm.value[k] === 'number' ? 0 : ''))
    addProductResult.value = null
    addProductError.value = null
    loadingAddProduct.value = false
    addProductFiles.value.forEach(f => URL.revokeObjectURL(f.preview))
    addProductFiles.value = []
  }
  if (tab === 'tags') {
    tagsData.value = null
    errorTags.value = null
    loadingTags.value = false
    addTagName.value = ''
    addTagResult.value = null
    addTagError.value = null
    loadingAddTag.value = false
  }
  if (tab === 'categories') {
    addCategoryName.value = ''
    addCategoryResult.value = null
    addCategoryError.value = null
    loadingAddCategory.value = false
  }
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
.reservation-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.reservation-test input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 160px;
}
.reservation-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.reservation-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.reservation-post-test {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.reservation-post-test input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 100%;
}
.reservation-post-test button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.reservation-post-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.reservation-post-test label {
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 0.1rem;
  display: block;
}
.reservation-post-test .example {
  color: #64748b;
  font-weight: 400;
  font-size: 0.95em;
  margin-left: 0.5em;
}
.reservation-post-guide {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.98rem;
}
.reservation-post-guide ul {
  margin: 0.5rem 0 0 1.2rem;
  padding: 0;
}
.reservation-post-guide li {
  margin-bottom: 0.2rem;
}
.agree-terms-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.product-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.product-test input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 160px;
}
.product-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.product-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.banner-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.banner-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.banner-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.category-products-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.category-products-test input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 160px;
}
.category-products-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.category-products-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.search-products-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.search-products-test input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 220px;
}
.search-products-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.search-products-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.user-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.user-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.user-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.my-bookings-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.my-bookings-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.my-bookings-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.startingpoints-test {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.startingpoints-test button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.startingpoints-test button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.user-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.user-edit-form input,
.user-edit-form select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 100%;
}
.user-edit-form button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.user-edit-form button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.add-product-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}
.add-product-form input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 100%;
}
.add-product-form button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-product-form button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.image-preview-list {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0 1rem 0;
}
.image-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
}
.tag-test-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.add-tag-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}
.add-tag-form input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 200px;
}
.add-tag-form button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-tag-form button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
.add-category-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}
.add-category-form input {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  width: 200px;
}
.add-category-form button {
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-category-form button:disabled {
  background: #b6c3e6;
  cursor: not-allowed;
}
</style> 