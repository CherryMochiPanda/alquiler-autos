/**
 * Auth Store (Pinia)
 * Gestiona estado de autenticación y usuario actual
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { useNotificationStore } from './useNotificationStore'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const isAdmin = ref(false)

  // Composables
  const notificationStore = useNotificationStore()

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /**
   * Inicializa store desde localStorage
   */
  function initializeAuth() {
    const savedUser = authService.getCurrentUser()
    const savedToken = authService.getToken()

    if (savedUser && savedToken) {
      user.value = savedUser
      token.value = savedToken
      isAdmin.value = savedUser.isAdmin || false
    }
  }

  /**
   * Login
   */
  async function login(email, password) {
    isLoading.value = true
    try {
      const result = await authService.login(email, password)

      if (result.success) {
        user.value = result.user
        token.value = result.token
        isAdmin.value = result.user.isAdmin || false
        // Persist isAdmin flag for router guard compatibility
        try {
          localStorage.setItem('isAdmin', String(isAdmin.value))
          localStorage.setItem('currentUser', JSON.stringify(result.user))
        } catch (e) {}
        notificationStore.showSuccess('¡Bienvenido!')
        return { success: true }
      } else {
        notificationStore.showError(result.error || 'Error al iniciar sesión')
        return { success: false, error: result.error }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Signup
   */
  async function signup(userData) {
    isLoading.value = true
    try {
      const result = await authService.signup(userData)

      if (result.success) {
        user.value = result.user
        token.value = result.token
        isAdmin.value = result.user.isAdmin || false
        try {
          localStorage.setItem('isAdmin', String(isAdmin.value))
          localStorage.setItem('currentUser', JSON.stringify(result.user))
        } catch (e) {}
        notificationStore.showSuccess('¡Cuenta creada exitosamente!')
        return { success: true }
      } else {
        notificationStore.showError(result.error || 'Error al registrarse')
        return { success: false, error: result.error }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout
   */
  async function logout() {
    try {
      await authService.logout()
      user.value = null
      token.value = null
      isAdmin.value = false
      try {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('currentUser')
      } catch (e) {}
      notificationStore.showSuccess('Sesión cerrada')
      return { success: true }
    } catch (error) {
      notificationStore.showError('Error al cerrar sesión')
      return { success: false }
    }
  }

  /**
   * Actualiza perfil de usuario
   */
  async function updateProfile(updates) {
    if (!user.value) return { success: false, error: 'No autenticado' }

    try {
      user.value = { ...user.value, ...updates }
      // TODO: Llamar a authService.updateProfile cuando esté disponible en API
      notificationStore.showSuccess('Perfil actualizado')
      return { success: true, user: user.value }
    } catch (error) {
      notificationStore.showError('Error al actualizar perfil')
      return { success: false, error: error.message }
    }
  }

  /**
   * Cambiar contraseña (simulado/local)
   */
  async function changePassword(newPassword) {
    if (!user.value) {
      notificationStore.showError('No autenticado')
      return { success: false, error: 'No autenticado' }
    }
    try {
      // Si existe un servicio real, delegar: await authService.changePassword(newPassword)
      // Aquí solo simulamos la acción y confirmamos el cambio
      // No guardamos la contraseña en el cliente por seguridad
      notificationStore.showSuccess('Contraseña actualizada')
      return { success: true }
    } catch (err) {
      notificationStore.showError('Error al cambiar contraseña')
      return { success: false, error: err.message }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    isAdmin,
    // Computed
    isAuthenticated,
    // Actions
    initializeAuth,
    login,
    signup,
    logout,
    updateProfile
    , changePassword
  }
})
