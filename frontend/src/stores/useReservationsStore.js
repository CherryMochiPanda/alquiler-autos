import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'demo_reservations'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {}
}

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref(loadFromStorage())
  const isLoading = ref(false)

  function _persist() {
    saveToStorage(reservations.value)
  }

  async function fetchReservationsForUser(userId) {
    isLoading.value = true
    try {
      // Demo: filtrar localStorage
      const list = loadFromStorage().filter(r => r.userId === userId)
      reservations.value = list
      return { success: true, data: list }
    } catch (e) {
      return { success: false, error: e.message }
    } finally {
      isLoading.value = false
    }
  }

  function createReservation(reservation) {
    // reservation must contain: id, userId, autoId, pickupDateTime, deliveryDateTime, pickupOffice, deliveryOffice, price, status
    reservations.value.push(reservation)
    _persist()
    return { success: true, id: reservation.id }
  }

  function getReservationsByUser(userId) {
    return reservations.value.filter(r => r.userId === userId)
  }

  function _hoursUntilPickup(reservation) {
    const now = new Date()
    const pickup = new Date(reservation.pickupDateTime)
    const diffMs = pickup - now
    return diffMs / (1000 * 60 * 60)
  }

  function canCancel(reservation) {
    // Allow cancel only if more than 48 hours before pickup and status is not cancelled
    if (!reservation || reservation.status === 'cancelled') return false
    return _hoursUntilPickup(reservation) > 48
  }

  async function cancelReservation(reservationId) {
    const idx = reservations.value.findIndex(r => r.id === reservationId)
    if (idx === -1) return { success: false, error: 'No encontrado' }

    const res = reservations.value[idx]
    if (!canCancel(res)) return { success: false, error: 'No se puede cancelar dentro de las 48 horas previas' }

    reservations.value[idx] = { ...res, status: 'cancelled', cancelledAt: new Date().toISOString() }
    _persist()
    return { success: true }
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