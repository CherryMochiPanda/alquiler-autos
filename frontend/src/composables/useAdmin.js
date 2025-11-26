/**
 * useAdmin Composable
 * Proporciona acceso simplificado a funcionalidades administrativas
 */

import { computed } from 'vue'
import { useAdminStore } from '../stores/useAdminStore'
import { useAuth } from './useAuth'

export function useAdmin() {
  const adminStore = useAdminStore()
  const { isAdmin } = useAuth()

  // Verificar permiso admin
  if (!isAdmin.value) {
    console.warn('User does not have admin access')
  }

  // Exponer propiedades principales
  const users = computed(() => adminStore.users)
  const stats = computed(() => adminStore.stats)
  const adminCount = computed(() => adminStore.adminCount)
  const userCount = computed(() => adminStore.userCount)
  const isLoading = computed(() => adminStore.isLoading)

  // Métodos de conveniencia
  const fetchUsers = () => adminStore.fetchUsers()
  const fetchStats = () => adminStore.fetchStats()
  const deleteUser = (userId) => adminStore.deleteUser(userId)
  const updateUserRole = (userId, isAdmin) => adminStore.updateUserRole(userId, isAdmin)
  const searchUsers = (query) => adminStore.searchUsers(query)

  return {
    users,
    stats,
    adminCount,
    userCount,
    isLoading,
    fetchUsers,
    fetchStats,
    deleteUser,
    updateUserRole,
    searchUsers
  }
}
