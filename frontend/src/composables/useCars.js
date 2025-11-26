/**
 * useCars Composable
 * Proporciona acceso simplificado al catálogo de vehículos
 */

import { computed } from 'vue'
import { useCarsStore } from '../stores/useCarsStore'

export function useCars() {
  const carsStore = useCarsStore()

  // Exponer propiedades principales
  const cars = computed(() => carsStore.cars)
  const featuredCars = computed(() => carsStore.featuredCars)
  const filteredCars = computed(() => carsStore.filteredCars)
  const categories = computed(() => carsStore.categories)
  const currentCar = computed(() => carsStore.currentCar)
  const isLoading = computed(() => carsStore.isLoading)

  // Métodos de conveniencia
  const fetchCars = (filters) => carsStore.fetchCars(filters)
  const fetchFeaturedCars = (limit) => carsStore.fetchFeaturedCars(limit)
  const fetchCar = (id) => carsStore.fetchCar(id)
  const createCar = (data) => carsStore.createCar(data)
  const updateCar = (id, data) => carsStore.updateCar(id, data)
  const deleteCar = (id) => carsStore.deleteCar(id)
  const setFilter = (key, value) => carsStore.setFilter(key, value)
  const clearFilters = () => carsStore.clearFilters()

  return {
    cars,
    featuredCars,
    filteredCars,
    categories,
    currentCar,
    isLoading,
    fetchCars,
    fetchFeaturedCars,
    fetchCar,
    createCar,
    updateCar,
    deleteCar,
    setFilter,
    clearFilters
  }
}
