# travel-agency

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Install v-calendar for date picking functionality

```sh
npm install v-calendar@next
npm install vuedraggable@next
```

### Compile and Minify for Production

```sh
npm run build
```

-------------------------------------------------------------------
# for backend server
```sh
npm install @supabase/supabase-js
```

# 이메일 전송로직 테스트
```sh
brew install supabase/tap/supabase
```

```sh
npm install @unhead/vue
```

```sh
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```sh
npm install xlsx
```

## Cloudflare R2 설정

이 프로젝트는 이미지 저장을 위해 Cloudflare R2를 사용합니다.

### 1. Cloudflare R2 버킷 생성
1. Cloudflare 대시보드에서 R2 서비스로 이동
2. 새 버킷 생성 (예: `travel-agency-products`)
3. 버킷을 공개로 설정

### 2. API 토큰 생성
1. Cloudflare 대시보드에서 "My Profile" > "API Tokens"
2. "Create Custom Token" 클릭
3. 다음 권한 설정:
   - Object Read
   - Object Write
   - Object Delete
4. 토큰 생성 후 Access Key ID와 Secret Access Key 저장

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=your-access-key-id
VITE_R2_SECRET_ACCESS_KEY=your-secret-access-key
VITE_R2_BUCKET_NAME=travel-agency-products
```

### 4. R2 Endpoint URL 확인
- Cloudflare R2 대시보드에서 버킷 설정 확인
- Endpoint URL은 보통 `https://[account-id].r2.cloudflarestorage.com` 형식

# 수정사항
// 광고 배너 표시 여부 (true: 표시, false: 숨김)
// 이미지 업데이트

