/**
 * API Client Base
 * Centraliza todas las llamadas HTTP con interceptores y manejo de errores
 * Listo para conectar backend real
 */

import { HTTP_STATUS } from '../constants/app'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Obtiene el token de autenticación del localStorage
   * Se usará automáticamente en headers Authorization
   */
  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  /**
   * Construye headers comunes
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * GET request
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    try {
      const isForm = data instanceof FormData
      const headers = this.getHeaders()
      if (isForm) delete headers['Content-Type']
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isForm ? data : JSON.stringify(data)
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    try {
      const isForm = data instanceof FormData
      const headers = this.getHeaders()
      if (isForm) delete headers['Content-Type']
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: isForm ? data : JSON.stringify(data)
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    try {
      const isForm = data instanceof FormData
      const headers = this.getHeaders()
      if (isForm) delete headers['Content-Type']
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: isForm ? data : JSON.stringify(data)
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Maneja respuesta exitosa
   */
  async handleResponse(response) {
    let data = {}
    try {
      data = await response.json()
    } catch (e) {
      // Si no hay JSON, continuamos
    }
    if (response.status === 304) {
      return { success: true, data: data, status: response.status };
    }
    try {
      if (response.status !== 204 || response.status !==304) {
        data = await response.json();
      }
    } catch (e) {
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }

    return { success: true, data, status: response.status }
  }

  /**
   * Maneja errores de red/parseo
   */
  handleError(error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: error.message || 'Error de conexión',
      status: error.status || 500
    }
  }
}

export default new ApiClient()
