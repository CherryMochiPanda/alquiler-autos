/**
 * useNotification Composable
 * Proporciona métodos simplificados para mostrar notificaciones
 */

import { useNotificationStore } from '../stores/useNotificationStore'

export function useNotification() {
  const notificationStore = useNotificationStore()

  return {
    success: (message, duration) => notificationStore.showSuccess(message, duration),
    error: (message, duration) => notificationStore.showError(message, duration),
    warning: (message, duration) => notificationStore.showWarning(message, duration),
    info: (message, duration) => notificationStore.showInfo(message, duration),
    add: (message, type, duration) => notificationStore.addToast(message, type, duration),
    clear: () => notificationStore.clearAll()
  }
}
