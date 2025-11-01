<template>
  <div :class="['car-card', variant]">
    <div class="car-carousel">
      <img :src="displayImage" :alt="auto.nombre" />
      <div class="carousel-controls">
        <button @click="prev">‹</button>
        <button @click="next">›</button>
      </div>
    </div>

    <h4>{{ auto.nombre }}</h4>
    <p>{{ auto.descripcion }}</p>

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
const current = ref(0)

const imageSrc = computed(() => {
  const img = (auto.imagenes && auto.imagenes[current.value]) || ''
  // if img is an absolute path (starts with /) use directly
  if (img && img.startsWith('/')) return img
  // if carpeta provided build path
  if (auto.carpeta) return `/img/autos/${auto.carpeta}/${img}`
  // fallback to /img/autos/<img>
  return `/img/autos/${img}`
})

const displayImage = computed(() => {
  if (props.coverImage) return props.coverImage
  return imageSrc.value
})

function next() {
  const total = (auto.imagenes && auto.imagenes.length) || 1
  current.value = (current.value + 1) % total
}

function prev() {
  const total = (auto.imagenes && auto.imagenes.length) || 1
  current.value = (current.value - 1 + total) % total
}
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
.card-buttons { display:flex; gap:0.5rem; justify-content:center; margin-top:1rem }
.btn-primary { background-color: var(--accent-color); color: #000; border:none; padding:0.6rem 1rem; border-radius:8px; cursor:pointer; }
.btn-secondary { background-color: transparent; border: 2px solid var(--accent-color); color: var(--accent-color); padding:0.5rem 0.9rem; border-radius:8px; cursor:pointer; }


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
</style>
