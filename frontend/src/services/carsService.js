/**
 * Cars Service
 * Maneja todas las operaciones con vehículos
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../constants/app'
import { autos as demoAutos } from '../data/autos'

// Simulación: almacena autos editados en localStorage
const DEMO_CARS_KEY = 'demo_cars'

const carsService = {
  /**
   * Obtiene lista de todos los autos
   * @returns {Promise} { success, cars, error? }
   */
  async getCars(filters = {}) {
try {
      const result = await apiClient.get(API_ENDPOINTS.CARS.LIST)

      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      return { success: true, data: result.data }; 

    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtiene auto por ID
   * @param {string} id
   * @returns {Promise} { success, car, error? }
   */
  async getCar(id) {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(`${API_ENDPOINTS.CARS.DETAIL}/${id}`)
      // return result
      try {
      const result = await apiClient.get(`${API_ENDPOINTS.CARS.DETAIL}/${id}`)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Crea nuevo auto (solo admin)
   * @param {object} carData
   * @returns {Promise} { success, car, error? }
   */
  async createCar(carData) {
      // TODO: Reemplazar con apiClient.post
      // const result = await apiClient.post(API_ENDPOINTS.CARS.CREATE, carData)
      // return result
try {
      const result = await apiClient.post(API_ENDPOINTS.CARS.CREATE, carData)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Elimina auto (solo admin)
   * @param {string} id
   * @returns {Promise} { success, error? }
   */
  async deleteCar(id) {
      // TODO: Reemplazar con apiClient.delete
      // const result = await apiClient.delete(`${API_ENDPOINTS.CARS.DELETE}/${id}`)
      // return result
try {
      const result = await apiClient.delete(`${API_ENDPOINTS.CARS.DELETE}/${id}`)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtiene featured cars (para homepage)
   * @param {number} limit
   * @returns {Promise} { success, cars, error? }
   */
  async getFeaturedCars(limit = 3) {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(`${API_ENDPOINTS.CARS.FEATURED}?limit=${limit}`)
      // return result
try {
      const result = await apiClient.get(`${API_ENDPOINTS.CARS.FEATURED}?limit=${limit}`)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      return result.data
    } catch (error) {
      return { success: false, error: error.message }
    }
}
}

export default carsService
