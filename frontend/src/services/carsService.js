/**
 * Cars Service
 * Maneja todas las operaciones con vehículos
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '../constants/app'
import { autos as demoAutos } from '../data/autos'

// Simulación: almacena autos editados en localStorage
const DEMO_CARS_KEY = 'demo_cars'

/**
 * Obtiene lista de autos demo
 */
function getDemoCars() {
  try {
    const cars = localStorage.getItem(DEMO_CARS_KEY)
    return cars ? JSON.parse(cars) : JSON.parse(JSON.stringify(demoAutos))
  } catch (e) {
    return JSON.parse(JSON.stringify(demoAutos))
  }
}

/**
 * Guarda autos demo
 */
function saveDemoCars(cars) {
  localStorage.setItem(DEMO_CARS_KEY, JSON.stringify(cars))
}

const carsService = {
  /**
   * Obtiene lista de todos los autos
   * @returns {Promise} { success, cars, error? }
   */
  async getCars(filters = {}) {
    try {
      // TODO: Reemplazar con llamada real a apiClient
      // const result = await apiClient.get(`${API_ENDPOINTS.CARS.LIST}?...filters`)
      // return result

      // Demo
      let cars = getDemoCars()

      if (filters.category) {
        cars = cars.filter(c => c.categoria === filters.category)
      }

      return { success: true, cars }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Obtiene auto por ID
   * @param {string} id
   * @returns {Promise} { success, car, error? }
   */
  async getCar(id) {
    try {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(`${API_ENDPOINTS.CARS.DETAIL}/${id}`)
      // return result

      // Demo
      const cars = getDemoCars()
      const car = cars.find(c => c.id === id)

      if (!car) {
        return { success: false, error: 'Auto no encontrado' }
      }

      return { success: true, car }
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
    try {
      // TODO: Reemplazar con apiClient.post
      // const result = await apiClient.post(API_ENDPOINTS.CARS.CREATE, carData)
      // return result

      // Demo
      const cars = getDemoCars()
      const newCar = {
        id: 'car-' + Date.now(),
        ...carData,
        createdAt: new Date().toISOString()
      }

      cars.push(newCar)
      saveDemoCars(cars)

      return { success: true, car: newCar }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Actualiza auto existente (solo admin)
   * @param {string} id
   * @param {object} updates
   * @returns {Promise} { success, car, error? }
   */
  async updateCar(id, updates) {
    try {
      // TODO: Reemplazar con apiClient.put
      // const result = await apiClient.put(`${API_ENDPOINTS.CARS.UPDATE}/${id}`, updates)
      // return result

      // Demo
      const cars = getDemoCars()
      const index = cars.findIndex(c => c.id === id)

      if (index === -1) {
        return { success: false, error: 'Auto no encontrado' }
      }

      cars[index] = { ...cars[index], ...updates }
      saveDemoCars(cars)

      return { success: true, car: cars[index] }
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
    try {
      // TODO: Reemplazar con apiClient.delete
      // const result = await apiClient.delete(`${API_ENDPOINTS.CARS.DELETE}/${id}`)
      // return result

      // Demo
      const cars = getDemoCars()
      const index = cars.findIndex(c => c.id === id)

      if (index === -1) {
        return { success: false, error: 'Auto no encontrado' }
      }

      cars.splice(index, 1)
      saveDemoCars(cars)

      return { success: true }
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
    try {
      // TODO: Reemplazar con apiClient.get
      // const result = await apiClient.get(`${API_ENDPOINTS.CARS.FEATURED}?limit=${limit}`)
      // return result

      // Demo
      const cars = getDemoCars()
      return { success: true, cars: cars.slice(0, limit) }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default carsService
