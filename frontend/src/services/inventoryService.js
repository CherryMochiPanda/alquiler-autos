import apiClient from './apiClient'

const inventoryService = {
  async getByCar(carId) {
    try {
      const res = await apiClient.get(`/api/inventory/car/${carId}`)
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  },

  async getByLocation(locationId) {
    try {
      const res = await apiClient.get(`/api/inventory/location/${locationId}`)
      if (!res.success) return { success: false, error: res.error }
      return { success: true, data: res.data }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }
}

export default inventoryService
