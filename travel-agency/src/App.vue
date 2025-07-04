<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()

onMounted(async () => {
  // 앱 시작 시 현재 사용자 정보 로드
  await authStore.getCurrentUser()
  
  // 인증 상태 변경 리스너 설정
  authStore.setupAuthListener()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
