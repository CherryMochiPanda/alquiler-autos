import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../services/apiClient'
import { API_ENDPOINTS } from '../constants/app'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([])
  const isLoading = ref(false)

  async function fetchReservationsForUser(userId) {
    isLoading.value = true
    try {
      const res = await apiClient.get(`${API_ENDPOINTS.RESERVATIONS.GET_ALL}/user/${userId}`)
      if (!res.success) return { success: false, error: res.error }
      reservations.value = res.data || []
      return { success: true, data: reservations.value }
    } catch (e) {
      return { success: false, error: e.message }
    } finally {
      isLoading.value = false
    }
  }

  async function createReservation(reservation) {
    try {
      const res = await apiClient.post(API_ENDPOINTS.RESERVATIONS.CREATE, reservation)
      if (!res.success) return { success: false, error: res.error }
      // Optionally refresh list or push
      reservations.value.push(res.data)
      return { success: true, id: res.data?.id }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  function getReservationsByUser(userId) {
    // Backend may return rentals with nested `user` object or with `userId` field.
    return reservations.value.filter(r => {
      if (!r) return false
      if (r.userId && r.userId === userId) return true
      if (r.user && r.user.id && r.user.id === userId) return true
      // some payloads may use `user.id` nested under relations
      return false
    })
  }

  function _hoursUntilPickup(reservation) {
    const now = new Date()
    // backend uses `startDate`
    const pickup = new Date(reservation.startDate || reservation.pickupDateTime)
    const diffMs = pickup - now
    return diffMs / (1000 * 60 * 60)
  }

  function canCancel(reservation) {
    if (!reservation) return false
    const status = (reservation.status || '').toString().toUpperCase()
    if (status === 'CANCELLED') return false
    return _hoursUntilPickup(reservation) > 48
  }

  async function cancelReservation(reservationId) {
    try {
      // Call backend cancel endpoint (patch status)
      const res = await apiClient.patch(API_ENDPOINTS.RESERVATIONS.CANCEL.replace(':id', reservationId), { status: 'CANCELLED' })
      if (!res.success) return { success: false, error: res.error }
      // update local cache
      const idx = reservations.value.findIndex(r => r.id === reservationId)
      if (idx !== -1) reservations.value[idx] = { ...reservations.value[idx], status: 'CANCELLED', cancelledAt: new Date().toISOString() }
      return { success: true }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  return {
    reservations,
    isLoading,
    fetchReservationsForUser,
    createReservation,
    getReservationsByUser,
    cancelReservation,
    canCancel
  }
})