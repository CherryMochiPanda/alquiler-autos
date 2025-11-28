/**
 * Admin Service
 * Maneja operaciones administrativas (gestión de usuarios, etc.)
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../constants/app'

const DEMO_USERS_KEY = 'demo_users'

/**
 * Obtiene lista de usuarios demo
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
 * Guarda usuarios demo
 */
function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

const adminService = {
  /**
   * Obtiene lista de todos los usuarios
   * @returns {Promise} { success, users, error? }
   */
  async getUsers() {
    try {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(API_ENDPOINTS.ADMIN.USERS)
      // return result

      // Demo
      const users = getDemoUsers()
      // No mostrar contraseña
      const safeUsers = users.map(u => {
        const { password: _, ...user } = u
        // Normalize demo user role to 'user'|'admin' if isAdmin flag exists
        if (user.isAdmin !== undefined && !user.role) {
          user.role = user.isAdmin ? 'admin' : 'user'
        }
        return user
      })

      return { success: true, users: safeUsers }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtiene usuario por ID
   * @param {string} userId
   * @returns {Promise} { success, user, error? }
   */
  async getUser(userId) {
    try {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(`${API_ENDPOINTS.ADMIN.USER_DETAIL}/${userId}`)
      // return result

      // Demo
      const users = getDemoUsers()
      const user = users.find(u => u.id === userId)

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' }
      }

      const { password: _, ...safeUser } = user
      return { success: true, user: safeUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Elimina usuario
   * @param {string} userId
   * @returns {Promise} { success, error? }
   */
  async deleteUser(userId) {
    try {
      // TODO: Reemplazar con apiClient.delete
      // const result = await apiClient.delete(`${API_ENDPOINTS.ADMIN.DELETE_USER}/${userId}`)
      // return result

      // Demo
      const users = getDemoUsers()
      const index = users.findIndex(u => u.id === userId)

      if (index === -1) {
        return { success: false, error: 'Usuario no encontrado' }
      }

      users.splice(index, 1)
      saveDemoUsers(users)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Actualiza rol de usuario
   * @param {string} userId
   * @param {boolean} isAdmin
   * @returns {Promise} { success, user, error? }
   */
  async updateUserRole(userId, isAdmin) {
    try {
      // TODO: Reemplazar con apiClient.put
      // const result = await apiClient.put(`${API_ENDPOINTS.ADMIN.UPDATE_USER}/${userId}`, { isAdmin })
      // return result

      // Demo
      const users = getDemoUsers()
      const user = users.find(u => u.id === userId)

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' }
      }

      user.role = isAdmin ? 'admin' : 'user'
      // Keep backward-compatible isAdmin flag for demo data
      user.isAdmin = isAdmin
      saveDemoUsers(users)

      const { password: _, ...safeUser } = user
      return { success: true, user: safeUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtiene estadísticas del sistema
   * @returns {Promise} { success, stats, error? }
   */
  async getStats() {
    try {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(API_ENDPOINTS.ADMIN.STATS)
      // return result

      // Demo
      const users = getDemoUsers()
      const admins = users.filter(u => (u.role === 'admin') || u.isAdmin).length

      return {
        success: true,
        stats: {
          totalUsers: users.length,
          totalAdmins: admins,
          totalCars: 0, // Obtener de carsService si es necesario
          totalReservations: 0
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default adminService
