import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 클라이언트 설정
const r2Client = new S3Client({
  region: 'auto',
  endpoint: import.meta.env.VITE_R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
});

// R2 버킷 이름
const BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || 'travel-agency-products';

export { r2Client, BUCKET_NAME }; 