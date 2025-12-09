<template>
  <div v-if="autoSeleccionado" class="detalle-auto">
    <h2>{{ title }}</h2>

    <div class="carousel">
      <img :src="displayImage" :alt="title" />
    </div>

    <ul class="auto-info">
      <li><strong>{{ $t('detalle.labels.motor') }}:</strong> {{ autoSeleccionado.motor }}</li>
      <li><strong>{{ $t('detalle.labels.transmission') }}:</strong> {{ autoSeleccionado.transmision }}</li>
      <li><strong>{{ $t('detalle.labels.capacity') }}:</strong> {{ autoSeleccionado.capacidad }} {{ $t('detalle.labels.people') }}</li>
      <li><strong>{{ $t('detalle.labels.extras') }}:</strong> {{ autoSeleccionado.extras }}</li>
      <li><strong>Categoría:</strong> {{ autoSeleccionado.category?.name || '—' }}</li>
      <li v-if="availableLocations.length"><strong>Disponible en:</strong> {{ availableLocations.join(', ') }}</li>
    </ul>

    <button class="reservar-btn" @click="$router.push({ path: '/reservar', query: { auto: autoSeleccionado.id } })">
      {{ $t('detalle.reserveBtn') }}
    </button>
  </div>

  <div v-else class="detalle-error">
    <h2>{{ $t('detalle.notFound.title') }}</h2>
    <p>{{ $t('detalle.notFound.message') }}</p>
    <button @click="$router.push('/catalogo')">{{ $t('detalle.backToCatalog') }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import carsService from '../services/carsService'
import inventoryService from '../services/inventoryService'

const route = useRoute()
const autoId = ref(route.query.auto)
const autoSeleccionado = ref(null)
const availableLocations = ref([])

onMounted(async () => {
  if (!autoId.value) return
  const res = await carsService.getCar(autoId.value)
  if (res && res.success && res.data) {
    autoSeleccionado.value = res.data
  } else {
    autoSeleccionado.value = null
  }

  // load inventory locations for this car
  if (autoId.value) {
    const invRes = await inventoryService.getByCar(autoId.value)
    if (invRes.success && Array.isArray(invRes.data)) {
      // invRes.data contains inventory entries with location relation
      availableLocations.value = invRes.data.filter(i => i.stock > 0).map(i => i.location?.name || i.locationId)
    }
  }
})

const title = computed(() => {
  if (!autoSeleccionado.value) return ''
  const a = autoSeleccionado.value
  if (a.brand && a.model) return `${a.brand} ${a.model}`
  return a.nombre || 'Auto'
})

const displayImage = computed(() => {
  const a = autoSeleccionado.value
  if (!a) return '/img/autos/default.jpg'
  if (a.image) return a.image
  const img = (a.imagenes && a.imagenes[0]) || ''
  if (!img) return '/img/autos/default.jpg'
  if (img.startsWith('/')) return img
  if (a.carpeta) return `/img/autos/${a.carpeta}/${img}`
  return `/img/autos/${img}`
})
</script>

<style scoped>
.detalle-auto {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  box-shadow: var(--neon-shadow);
  backdrop-filter: blur(12px);
  text-align: center;
}

.detalle-auto h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.carousel {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.auto-info {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  text-align: left;
}

.auto-info li {
  margin-bottom: 0.5rem;
}

.reservar-btn {
  background-color: var(--accent-color);
  color: var(--text-on-accent);
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.detalle-error {
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background-color: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  box-shadow: var(--neon-shadow);
  backdrop-filter: blur(10px);
}

.detalle-error h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.detalle-error p {
  margin-bottom: 2rem;
}

.detalle-error button {
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
