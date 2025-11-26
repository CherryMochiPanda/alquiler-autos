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
      // TODO: Reemplazar con llamada real a apiClient cuando esté listo el backend
      // const result = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
      // return result

      // Demo: búsqueda en localStorage
      const demoUsers = getDemoUsers()
      const user = demoUsers.find(u => u.email === email && u.password === password)

      if (!user) {
        return { success: false, error: 'Email o contraseña inválidos' }
      }

      // Simula token
      const token = 'demo-token-' + Date.now()
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))

      const { password: _, ...userWithoutPassword } = user
      return { success: true, user: userWithoutPassword, token }
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
      // TODO: Reemplazar con llamada real a apiClient
      // const result = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData)
      // return result

      // Demo: validación y almacenamiento en localStorage
      const demoUsers = getDemoUsers()

      if (demoUsers.some(u => u.email === userData.email)) {
        return { success: false, error: 'El email ya está registrado' }
      }

      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        isAdmin: false,
        createdAt: new Date().toISOString()
      }

      demoUsers.push(newUser)
      saveDemoUsers(demoUsers)

      // Auto-login
      const token = 'demo-token-' + Date.now()
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))

      const { password: _, ...userWithoutPassword } = newUser
      return { success: true, user: userWithoutPassword, token }
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
      // TODO: Llamar a API cuando exista
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)

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
    return user?.isAdmin ?? false
  }
}

export default authService
