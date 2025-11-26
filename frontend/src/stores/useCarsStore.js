/**
 * Cars Store (Pinia)
 * Gestiona estado de catálogo de vehículos
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import carsService from '../services/carsService'
import { useNotificationStore } from './useNotificationStore'

export const useCarsStore = defineStore('cars', () => {
  // State
  const cars = ref([])
  const featuredCars = ref([])
  const isLoading = ref(false)
  const currentCar = ref(null)
  const filters = ref({ category: null })

  // Composables
  const notificationStore = useNotificationStore()

  // Computed
  const filteredCars = computed(() => {
    if (!filters.value.category) return cars.value

    return cars.value.filter(car => car.categoria === filters.value.category)
  })

  const categories = computed(() => {
    const cats = new Set(cars.value.map(c => c.categoria))
    return Array.from(cats)
  })

  /**
   * Carga lista de autos
   */
  async function fetchCars(filterOptions = {}) {
    isLoading.value = true
    try {
      const result = await carsService.getCars(filterOptions)

      if (result.success) {
        cars.value = result.cars
        return { success: true }
      } else {
        notificationStore.showError('Error al cargar vehículos')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carga autos destacados
   */
  async function fetchFeaturedCars(limit = 3) {
    try {
      const result = await carsService.getFeaturedCars(limit)

      if (result.success) {
        featuredCars.value = result.cars
        return { success: true }
      } else {
        return { success: false }
      }
    } catch (error) {
      return { success: false }
    }
  }

  /**
   * Obtiene auto por ID
   */
  async function fetchCar(id) {
    isLoading.value = true
    try {
      const result = await carsService.getCar(id)

      if (result.success) {
        currentCar.value = result.car
        return { success: true, car: result.car }
      } else {
        notificationStore.showError('Auto no encontrado')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crea nuevo auto (admin)
   */
  async function createCar(carData) {
    try {
      const result = await carsService.createCar(carData)

      if (result.success) {
        cars.value.push(result.car)
        notificationStore.showSuccess('Vehículo creado')
        return { success: true, car: result.car }
      } else {
        notificationStore.showError(result.error || 'Error al crear vehículo')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    }
  }

  /**
   * Actualiza auto existente (admin)
   */
  async function updateCar(id, updates) {
    try {
      const result = await carsService.updateCar(id, updates)

      if (result.success) {
        const index = cars.value.findIndex(c => c.id === id)
        if (index !== -1) {
          cars.value[index] = result.car
        }
        if (currentCar.value?.id === id) {
          currentCar.value = result.car
        }
        notificationStore.showSuccess('Vehículo actualizado')
        return { success: true, car: result.car }
      } else {
        notificationStore.showError(result.error || 'Error al actualizar')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    }
  }

  /**
   * Elimina auto (admin)
   */
  async function deleteCar(id) {
    try {
      const result = await carsService.deleteCar(id)

      if (result.success) {
        cars.value = cars.value.filter(c => c.id !== id)
        if (currentCar.value?.id === id) {
          currentCar.value = null
        }
        notificationStore.showSuccess('Vehículo eliminado')
        return { success: true }
      } else {
        notificationStore.showError(result.error || 'Error al eliminar')
        return { success: false }
      }
    } catch (error) {
      notificationStore.showError('Error de conexión')
      return { success: false }
    }
  }

  /**
   * Actualiza filtros
   */
  function setFilter(key, value) {
    filters.value[key] = value
  }

  /**
   * Limpia filtros
   */
  function clearFilters() {
    filters.value = { category: null }
  }

  return {
    // State
    cars,
    featuredCars,
    isLoading,
    currentCar,
    filters,
    // Computed
    filteredCars,
    categories,
    // Actions
    fetchCars,
    fetchFeaturedCars,
    fetchCar,
    createCar,
    updateCar,
    deleteCar,
    setFilter,
    clearFilters
  }
})
