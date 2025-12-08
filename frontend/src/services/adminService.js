/**
 * Admin Service
 * Maneja operaciones administrativas (gestión de usuarios, etc.)
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../constants/app'

const adminService = {
  /**
   * Obtiene lista de todos los usuarios
   * @returns {Promise} { success, users, error? }
   */
  async getUsers() {
    try {
      const result = await apiClient.get(API_ENDPOINTS.ADMIN.USERS)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
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
      const result = await apiClient.get(`${API_ENDPOINTS.ADMIN.USER_DETAIL.replace(':id', userId)}`)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
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
      const result = await apiClient.delete(`${API_ENDPOINTS.ADMIN.DELETE_USER.replace(':id', userId)}`)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Actualiza rol de usuario
   * @param {string} userId
   * @param {boolean} makeAdmin
   * @returns {Promise} { success, user, error? }
   */
  async updateUserRole(userId, makeAdmin) {
    try {
      const role = makeAdmin ? 'admin' : 'user'
      const result = await apiClient.patch(
        API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE.replace(':id', userId),
        { role }
      )
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
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
      const result = await apiClient.get(API_ENDPOINTS.ADMIN.STATS)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default adminService
