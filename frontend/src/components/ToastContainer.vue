<template>
  <div class="toast-root" aria-live="polite">
    <div v-for="t in list" :key="t.id" class="toast" :class="t.type">
      {{ t.message }}
      <button class="close-btn" @click="remove(t.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { toasts, removeToast } from '../utils/toastStore'

const list = toasts
const remove = id => removeToast(id)
</script>

<style scoped>
.toast-root {
  position: fixed;
  right: 16px;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}
.toast {
  background: rgba(0,0,0,0.75);
  color: white;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toast.info { background: rgba(0,0,0,0.75); }
.toast.success { background: #2ecc71; color: #fff; }
.toast.error { background: #e74c3c; color: #fff; }
.close-btn { background: transparent; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; }
</style>
