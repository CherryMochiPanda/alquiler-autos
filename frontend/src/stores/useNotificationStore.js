/**
 * Notification Store (Pinia)
 * Gestiona sistema de notificaciones/toasts
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TOAST_TYPES } from '../constants/app'

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref([])

  /**
   * Agrega un toast a la cola
   */
  function addToast(message, type = TOAST_TYPES.INFO, duration = 3000) {
    const id = Date.now()
    const toast = { id, message, type }

    toasts.value.push(toast)

    // Auto-remover después del duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * Elimina un toast por ID
   */
  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  /**
   * Muestra toast de éxito
   */
  function showSuccess(message, duration = 3000) {
    return addToast(message, TOAST_TYPES.SUCCESS, duration)
  }

  /**
   * Muestra toast de error
   */
  function showError(message, duration = 3000) {
    return addToast(message, TOAST_TYPES.ERROR, duration)
  }

  /**
   * Muestra toast de advertencia
   */
  function showWarning(message, duration = 3000) {
    return addToast(message, TOAST_TYPES.WARNING, duration)
  }

  /**
   * Muestra toast de información
   */
  function showInfo(message, duration = 3000) {
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
