import apiClient from './apiClient'

const locationService = {
  async getProvinces() {
    try {
      const res = await apiClient.get('/api/province')
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },

  async getLocationsByProvince(provinceId) {
    try {
      const res = await apiClient.get(`/api/location/province/${provinceId}`)
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },

  async getAllLocations() {
    try {
      const res = await apiClient.get('/api/location')
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },

  async getLocation(id) {
    try {
      const res = await apiClient.get(`/api/location/${id}`)
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }
}

export default locationService
