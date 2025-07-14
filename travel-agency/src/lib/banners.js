import { supabase } from './supabase.js'

/**
 * BannerImages 테이블에서 모든 image_url을 가져온다.
 * @returns {Promise<{success: boolean, images: string[], error?: string}>}
 */
export async function getBannerImages() {
  try {
    const { data, error } = await supabase
      .from('BannerImages')
      .select('image_url')
    if (error) throw error
    const images = (data || []).map(item => item.image_url)
    return { success: true, images }
  } catch (error) {
    return { success: false, images: [], error: error.message }
  }
} 