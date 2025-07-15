import { supabase } from './supabase.js'

/**
 * 출발지 목록 조회
 * @returns {Promise<{success: boolean, startingPoints: Array, error?: string}>}
 */
export async function getStartingPoints() {
  try {
    const { data, error } = await supabase
      .from('StartingPoints')
      .select('id, name')
      .order('id', { ascending: true })
    if (error) throw error
    return { success: true, startingPoints: data }
  } catch (error) {
    return { success: false, startingPoints: [], error: error.message }
  }
} 