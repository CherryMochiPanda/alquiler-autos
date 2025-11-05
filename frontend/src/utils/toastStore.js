import { ref } from 'vue'

const toasts = ref([])

function pushToast(message, type = 'info', timeout = 3500) {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  if (timeout > 0) {
    setTimeout(() => removeToast(id), timeout)
  }
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export { toasts, pushToast, removeToast }
