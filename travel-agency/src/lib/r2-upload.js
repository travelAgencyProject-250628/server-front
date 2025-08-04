import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, BUCKET_NAME } from './r2.js';

/**
 * 백엔드 API를 통해 Cloudflare R2에 상품 이미지 업로드
 * @param {File[]} files - 업로드할 이미지 파일 배열
 * @param {string} productNumber - product_number (폴더명)
 * @returns {Promise<{success: boolean, urls?: string[], error?: string}>}
 */
export async function uploadProductImagesToR2(files, productNumber) {
  try {
    if (!files || !files.length) return { success: false, error: '이미지 파일이 없습니다.' };
    
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = i === 0 ? 'main' : String(i);
      const key = `${productNumber}/${fileName}`;
      
      // FormData를 사용하여 파일 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('bucket', BUCKET_NAME);
      
      // Supabase Edge Function을 통한 업로드
      const response = await fetch('https://tisgwtxxioenjuhjvuik.supabase.co/functions/v1/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '업로드 실패');
      }
      
      urls.push(result.url);
    }
    
    return { success: true, urls };
  } catch (error) {
    console.error('R2 이미지 업로드 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 백엔드 API를 통해 Cloudflare R2에 상세 이미지 업로드
 * @param {File} file - 업로드할 상세 이미지 파일
 * @param {string} productNumber - product_number (폴더명)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadDetailImageToR2(file, productNumber) {
  try {
    if (!file) return { success: false, error: '상세 이미지 파일이 없습니다.' };
    
    const key = `${productNumber}/detail`;
    
    // FormData를 사용하여 파일 업로드
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    formData.append('bucket', BUCKET_NAME);
    
    // Supabase Edge Function을 통한 업로드
    const response = await fetch('https://tisgwtxxioenjuhjvuik.supabase.co/functions/v1/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '업로드 실패');
    }
    
    return { success: true, url: result.url };
  } catch (error) {
    console.error('R2 상세 이미지 업로드 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 백엔드 API를 통해 Cloudflare R2에서 이미지 삭제
 * @param {string} key - 삭제할 파일의 키 (경로)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteImageFromR2(key) {
  try {
    const response = await fetch('https://tisgwtxxioenjuhjvuik.supabase.co/functions/v1/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key,
        bucket: BUCKET_NAME,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`삭제 실패: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '삭제 실패');
    }
    
    return { success: true };
  } catch (error) {
    console.error('R2 이미지 삭제 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 상품의 모든 이미지를 R2에서 삭제
 * @param {string} productNumber - product_number
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteAllProductImagesFromR2(productNumber) {
  try {
    // 상품 관련 모든 이미지 키들
    const keys = [
      `${productNumber}/main`,
      `${productNumber}/detail`,
      // 서브 이미지들 (0-9까지 가능)
      ...Array.from({ length: 10 }, (_, i) => `${productNumber}/${i}`),
      // 여행지정보(일정표) 이미지들 - 실제 저장 경로
      `${productNumber}/itinerary/main`,
      `${productNumber}/itinerary/detail`,
      // 일정표 서브 이미지들 (0-9까지 가능)
      ...Array.from({ length: 10 }, (_, i) => `${productNumber}/itinerary/${i}`),
      // 일정표 상세 이미지들 (0-9까지 가능)
      ...Array.from({ length: 10 }, (_, i) => `${productNumber}/itinerary/detail/${i}`),
      // 일정표 전체 폴더 내 모든 이미지 (추가 안전장치)
      `${productNumber}/itinerary`
    ];
    
    // 각 이미지 삭제 시도
    const deletePromises = keys.map(key => deleteImageFromR2(key));
    await Promise.allSettled(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('R2 상품 이미지 전체 삭제 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 백엔드 API를 통해 Cloudflare R2에 기사 이미지 업로드
 * @param {File} file - 업로드할 기사 이미지 파일
 * @param {string} driverId - driver_id (폴더명)
 * @param {string} imageType - 이미지 타입 (driver, vehicle, license, insurance, registration)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadDriverImageToR2(file, driverId, imageType) {
  try {
    if (!file) return { success: false, error: '이미지 파일이 없습니다.' };
    
    const key = `${driverId}/${imageType}`;
    
    // FormData를 사용하여 파일 업로드
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    formData.append('bucket', 'drivers'); // drivers 버킷 사용
    
    // Supabase Edge Function을 통한 업로드
    const response = await fetch('https://tisgwtxxioenjuhjvuik.supabase.co/functions/v1/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '업로드 실패');
    }
    
    return { success: true, url: result.url };
  } catch (error) {
    console.error('R2 기사 이미지 업로드 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 백엔드 API를 통해 Cloudflare R2에 기사 차량 이미지들 업로드
 * @param {File[]} files - 업로드할 차량 이미지 파일 배열
 * @param {string} driverId - driver_id (폴더명)
 * @returns {Promise<{success: boolean, urls?: string[], error?: string}>}
 */
export async function uploadDriverVehicleImagesToR2(files, driverId) {
  try {
    if (!files || !files.length) return { success: false, error: '차량 이미지 파일이 없습니다.' };
    
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `vehicle_${i + 1}`;
      const key = `${driverId}/${fileName}`;
      
      // FormData를 사용하여 파일 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('bucket', 'drivers'); // drivers 버킷 사용
      
      // Supabase Edge Function을 통한 업로드
      const response = await fetch('https://tisgwtxxioenjuhjvuik.supabase.co/functions/v1/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '업로드 실패');
      }
      
      urls.push(result.url);
    }
    
    return { success: true, urls };
  } catch (error) {
    console.error('R2 기사 차량 이미지 업로드 오류:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 기사의 모든 이미지를 R2에서 삭제
 * @param {string} driverId - driver_id
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteAllDriverImagesFromR2(driverId) {
  try {
    // 기사 관련 모든 이미지 키들
    const keys = [
      `${driverId}/driver`, // 기사사진
      `${driverId}/license`, // 자격증
      `${driverId}/insurance`, // 보험증권
      `${driverId}/registration`, // 등록증
      // 차량 이미지들 (1-4까지)
      ...Array.from({ length: 4 }, (_, i) => `${driverId}/vehicle_${i + 1}`),
    ];
    
    // 각 이미지 삭제 시도
    const deletePromises = keys.map(key => deleteImageFromR2(key));
    await Promise.allSettled(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error('R2 기사 이미지 전체 삭제 오류:', error);
    return { success: false, error: error.message };
  }
} 