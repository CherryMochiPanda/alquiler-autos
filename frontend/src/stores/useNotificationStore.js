/**
 * Notification Store (Pinia)
 * Gestiona sistema de notificaciones/toasts
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TOAST_TYPES } from '../constants/app'

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref([])
  // map toastId -> timeoutId so we can clear if removed manually
  const timers = {}

  /**
   * Agrega un toast a la cola
   */
  function addToast(message, type = TOAST_TYPES.INFO, duration = 5000) {
    const id = `${Date.now()}-${Math.floor(Math.random()*100000)}`
    const toast = { id, message, type }

    toasts.value.push(toast)

    // Auto-remover después del duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        // sanity: only remove if still present
        if (toasts.value.some(t => t.id === id)) {
          removeToast(id)
        }
        if (timers[id]) {
          clearTimeout(timers[id])
          delete timers[id]
        }
      }, duration)
      timers[id] = timer
    }

    return id
  }

  /**
   * Elimina un toast por ID
   */
  function removeToast(id) {
    // clear any pending timer first
    if (timers[id]) {
      clearTimeout(timers[id])
      delete timers[id]
    }
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  /**
   * Muestra toast de éxito
   */
  function showSuccess(message, duration = 5000) {
    return addToast(message, TOAST_TYPES.SUCCESS, duration)
  }

  /**
   * Muestra toast de error
   */
  function showError(message, duration = 5000) {
    return addToast(message, TOAST_TYPES.ERROR, duration)
  }

  /**
   * Muestra toast de advertencia
   */
  function showWarning(message, duration = 5000) {
    return addToast(message, TOAST_TYPES.WARNING, duration)
  }

  /**
   * Muestra toast de información
   */
  function showInfo(message, duration = 5000) {
    return addToast(message, TOAST_TYPES.INFO, duration)
  }

  /**
   * Limpia todos los toasts
   */
  function clearAll() {
    // clear timers
    Object.keys(timers).forEach(k => {
      try { clearTimeout(timers[k]) } catch (e) {}
      delete timers[k]
    })
    toasts.value = []
  }

  return {
    // State
    toasts,
    // Actions
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  }
})
