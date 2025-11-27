/**
 * useAuth Composable
 * Proporciona funcionalidades de autenticación simplificadas
 */

import { computed } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'

export function useAuth() {
  const authStore = useAuthStore()

  // Exponer propiedades principales
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isLoading = computed(() => authStore.isLoading)

  // Métodos de conveniencia
  const login = (email, password) => authStore.login(email, password)
  const signup = (userData) => authStore.signup(userData)
  const logout = () => authStore.logout()
  const updateProfile = (updates) => authStore.updateProfile(updates)
  const changePassword = (pw) => authStore.changePassword ? authStore.changePassword(pw) : Promise.resolve({ success: false, error: 'Not supported' })

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
    , changePassword
  }
}
