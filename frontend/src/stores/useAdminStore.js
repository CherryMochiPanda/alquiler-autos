/**
 * Admin Store (Pinia)
 * Gestiona estado del panel administrativo
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import adminService from '../services/adminService'
import { useNotificationStore } from './useNotificationStore'
import { useAuthStore } from './useAuthStore'

export const useAdminStore = defineStore('admin', () => {
  // State
  const users = ref([])
  const stats = ref(null)
  const isLoading = ref(false)

  // Composables
  const notificationStore = useNotificationStore()

  // Computed
  const adminCount = computed(() => users.value.filter(u => u.isAdmin).length)
  const userCount = computed(() => users.value.length)

  /**
   * Carga lista de usuarios
   */
  async function fetchUsers() {
    isLoading.value = true
    try {
      const result = await adminService.getUsers()

      if (result.success) {
        users.value = result.users
        return { success: true }
      } else {
        notificationStore.showError('Error al cargar usuarios')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtiene estadísticas
   */
  async function fetchStats() {
    try {
      const result = await adminService.getStats()

      if (result.success) {
        stats.value = result.stats
        return { success: true }
      } else {
        return { success: false }
      }
    } catch (error) {
      return { success: false }
    }
  }

  /**
   * Elimina usuario
   */
  async function deleteUser(userId) {
    try {
      const result = await adminService.deleteUser(userId)

      if (result.success) {
        users.value = users.value.filter(u => u.id !== userId)
        notificationStore.showSuccess('Usuario eliminado')
        return { success: true }
      } else {
        notificationStore.showError(result.error || 'Error al eliminar usuario')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    }
  }

  /**
   * Actualiza rol de usuario
   */
  async function updateUserRole(userId, isAdmin) {
    try {
      const result = await adminService.updateUserRole(userId, isAdmin)

      if (result.success) {
        const user = users.value.find(u => u.id === userId)
        if (user) {
          user.isAdmin = isAdmin
        }
        // If the updated user is the current authenticated user, update local isAdmin flag
        try {
          const authStore = useAuthStore()
          if (authStore.user && authStore.user.id === userId) {
            authStore.isAdmin = isAdmin
            localStorage.setItem('isAdmin', String(isAdmin))
          }
        } catch (e) {}

        notificationStore.showSuccess('Rol actualizado')
        return { success: true, user: result.user }
      } else {
        notificationStore.showError(result.error || 'Error al actualizar rol')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    }
  }

  /**
   * Busca usuarios
   */
  function searchUsers(query) {
    if (!query) return users.value

    const q = query.toLowerCase()
    return users.value.filter(u =>
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }

  return {
    // State
    users,
    stats,
    isLoading,
    // Computed
    adminCount,
    userCount,
    // Actions
    fetchUsers,
    fetchStats,
    deleteUser,
    updateUserRole,
    searchUsers
  }
})
