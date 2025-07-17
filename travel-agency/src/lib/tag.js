import { supabase } from './supabase.js'

/**
 * 전체 태그 목록 조회
 * @returns {Promise<{success: boolean, tags?: Array, error?: string}>}
 */
export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('Tags')
      .select('id, name')
      .order('id', { ascending: true })
    if (error) throw error
    return { success: true, tags: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 태그 추가(등록)
 * @param {string} name - 태그명
 * @returns {Promise<{success: boolean, id?: number, error?: string}>}
 */
export async function createTag(name) {
  try {
    const { data, error } = await supabase
      .from('Tags')
      .insert([{ name }])
      .select('id')
      .single()
    if (error) throw error
    return { success: true, id: data.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
} 