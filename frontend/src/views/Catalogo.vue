<template>
  <section class="catalogo-wrapper">
    <h2>Bienvenido a la página de Catálogo</h2>
    <div class="catalogo-grid">
      <div v-for="auto in autos" :key="auto.id" class="car-card">
        <div class="car-carousel">
          <img
            :src="`/img/autos/${auto.carpeta}/${auto.imagenes[imagenActual[auto.id]]}`"
            :alt="auto.nombre"
          />
          <div class="carousel-controls">
            <button @click="anterior(auto.id)">‹</button>
            <button @click="siguiente(auto.id)">›</button>
          </div>
        </div>
        <h3>{{ auto.nombre }}</h3>
        <p>{{ auto.descripcion }}</p>
        <button @click="$router.push({ path: '/reservar', query: { auto: auto.id } })">
          Reservar
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const autos = [
  {
    id: 'sedan',
    nombre: 'Sedán Clásico',
    carpeta: 'sedan-toyota',
    imagenes: [
      'toyota-corola-LE-2021-p1.webp',
      'toyota-corola-LE-2021-p2.webp',
      'toyota-corola-LE-2021-p3.webp',
      'toyota-corola-LE-2021-p4.webp',
      'toyota-corola-LE-2021-p5.webp'
    ],
    motor: '1.8L',
    transmision: 'Automático',
    capacidad: 5,
    extras: 'Aire acondicionado, Bluetooth',
    descripcion: 'Ideal para ciudad y viajes cortos.'
  }
]

const imagenActual = ref({})
autos.forEach(auto => {
  imagenActual.value[auto.id] = 0
})

function siguiente(id) {
  const total = autos.find(a => a.id === id).imagenes.length
  imagenActual.value[id] = (imagenActual.value[id] + 1) % total
}

function anterior(id) {
  const total = autos.find(a => a.id === id).imagenes.length
  imagenActual.value[id] = (imagenActual.value[id] - 1 + total) % total
}
</script>

<style scoped>
.catalogo-wrapper {
  padding: 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.catalogo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

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

.car-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.car-card button {
  margin-top: 1rem;
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
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
</style>



