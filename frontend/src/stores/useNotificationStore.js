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
        removeToast(id)
      }, duration)
      timers[id] = timer
    }

    return id
  }

  /**
   * Elimina un toast por ID
   */
  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
    // clear any pending timer
    if (timers[id]) {
      clearTimeout(timers[id])
      delete timers[id]
    }
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
