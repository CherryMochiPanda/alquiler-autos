/**
 * Auth Service
 * Maneja todas las operaciones de autenticación
 * Inicialmente con localStorage, listo para conectar API real
 */

import apiClient from './apiClient'
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/app'

// Demo: Simula almacenamiento de usuarios registrados
const DEMO_USERS_KEY = 'demo_users'

/**
 * Obtiene lista de usuarios demo (simulación)
 */
function getDemoUsers() {
  try {
    const users = localStorage.getItem(DEMO_USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch (e) {
    return []
  }
}

/**
 * Guarda usuarios demo (simulación)
 */
function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

const authService = {
  /**
   * Login - Intenta autenticar usuario
   * @param {string} email
   * @param {string} password
   * @returns {Promise} { success, user, token?, error? }
   */
  async login(email, password) {
    try {
      const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      if (!result.success) {
        return { success: false, error: result.error }
      }

      const { user, token } = result.data
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      }

      return { success: true, user, token }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Signup - Registra nuevo usuario
   * @param {object} userData { firstName, lastName, email, password, phone, dni }
   * @returns {Promise} { success, user, token?, error? }
   */
  async signup(userData) {
    try {
      const result = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData)
      if (!result.success) {
        return { success: false, error: result.error }
      }

      const { user, token } = result.data
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      }

      return { success: true, user, token }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Logout - Limpia sesión
   * @returns {Promise} { success }
   */
  async logout() {
    try {
      // Try calling backend logout if implemented (non-blocking)
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      } catch (e) {
        // ignore
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtiene usuario actual desde sessionStorage
   * @returns {object|null} Usuario actual o null
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      return user ? JSON.parse(user) : null
    } catch (e) {
      return null
    }
  },

  /**
   * Obtiene token actual
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  /**
   * Verifica si hay sesión activa
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser()
  },

  /**
   * Verifica si usuario actual es admin
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }
}

export default authService
