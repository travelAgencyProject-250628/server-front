import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryService } from '../lib/categories.js'

export const useCategoryStore = defineStore('categories', () => {
  // 상태
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const hasCategories = computed(() => categories.value.length > 0)

  // 액션
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      const result = await categoryService.getAllCategories()
      
      if (result.success) {
        categories.value = result.categories
      } else {
        error.value = result.error
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getCategoryById = async (id) => {
    try {
      const result = await categoryService.getCategoryById(id)
      return result
    } catch (err) {
      return {
        success: false,
        error: err.message,
        category: null
      }
    }
  }

  return {
    // 상태
    categories,
    loading,
    error,
    
    // 계산된 속성
    hasCategories,
    
    // 액션
    fetchCategories,
    getCategoryById
  }
}) 