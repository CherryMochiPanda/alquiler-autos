<template>
  <div :class="['car-card', variant]">
    <div class="car-image">
      <img :src="displayImage" :alt="title" />
    </div>

    <h4>{{ title }}</h4>
    <p class="muted">{{ subtitle }}</p>

    <div class="meta">
      <span class="year">{{ auto.year || '' }}</span>
      <span class="plate">{{ auto.plate || '' }}</span>
      <span class="availability" :class="{ available: auto.isAvailable, unavailable: !auto.isAvailable }">{{ auto.isAvailable ? 'Disponible' : 'No disponible' }}</span>
    </div>

    <div class="reviews" v-if="reviewsCount > 0">
      <span class="rating">⭐ {{ averageRating.toFixed(1) }}</span>
      <span class="count">({{ reviewsCount }})</span>
    </div>

    <div class="card-buttons">
      <button class="btn-primary" @click="$emit('view', auto.id)">{{ $t('nav.verMas') }}</button>
      <button v-if="showReserve" class="btn-secondary" @click="$emit('reserve', auto.id)">{{ $t('detalle.reserveBtn') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  auto: { type: Object, required: true },
  showReserve: { type: Boolean, default: false },
  variant: { type: String, default: '' },
  coverImage: { type: String, default: '' }
})

const auto = props.auto
const variant = props.variant

const title = computed(() => {
  if (auto.brand && auto.model) return `${auto.brand} ${auto.model}`
  if (auto.nombre) return auto.nombre
  return 'Auto'
})

const subtitle = computed(() => {
  if (auto.pricePerDay) return `$${auto.pricePerDay}/día`
  if (auto.descripcion) return auto.descripcion
  return auto.category?.name || ''
})

const displayImage = computed(() => {
  // prefer backend-provided image (full path like /uploads/...)
  if (props.coverImage) return props.coverImage
  if (auto.image) return auto.image
  // fallback to first element of imagenes array (demo data)
  const img = (auto.imagenes && auto.imagenes[0]) || ''
  if (!img) return '/img/autos/default.jpg'
  if (img.startsWith('/')) return img
  if (auto.carpeta) return `/img/autos/${auto.carpeta}/${img}`
  return `/img/autos/${img}`
})

const reviews = computed(() => auto.reviews || [])
const reviewsCount = computed(() => reviews.value.length)
const averageRating = computed(() => {
  if (reviewsCount.value === 0) return 0
  const sum = reviews.value.reduce((s, r) => s + (r.rating || 0), 0)
  return sum / reviewsCount.value
})
</script>

<style scoped>
.car-card {
  border: 1px solid var(--divider-color);
  width: 320px;
  background: var(--box-bg);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: var(--neon-shadow);
  text-align: center;
}
.car-carousel {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}
.car-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
.card-buttons { 
  display:flex; 
  gap:0.5rem; 
  justify-content:center; 
  margin-top:1rem 
}
.btn-primary { 
  background-color: var(--accent-color); 
  color: var(--text-on-accent); 
  border:none; 
  padding:0.6rem 1rem; 
  border-radius:8px;   
  font-weight: bold;  
  cursor:pointer; 
}
.btn-secondary { 
  background-color: transparent; 
  border: 2px solid var(--accent-color); 
  color: var(--accent-color); 
  padding:0.5rem 0.9rem; 
  border-radius:8px;     
  font-weight: bold;
  cursor:pointer; 
}


.car-card.featured {
  width: 450px;
}
.car-card.featured .car-carousel {
  height: 300px;
}
.car-card.featured img {
  width: 400px;
  height: 100%;
  object-fit: cover;
}
.meta { display:flex; gap:0.5rem; justify-content:center; margin-top:0.5rem; font-size:0.9rem }
.meta .availability.available { color: green }
.meta .availability.unavailable { color: red }
.reviews { margin-top:0.5rem; color: var(--muted-color) }
.muted { color: var(--muted-color) }
</style>
