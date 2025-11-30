<template>
  <div />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/account')
})
</script>

<style scoped>
/* Redirect-only view: styles intentionally minimal */
</style>
