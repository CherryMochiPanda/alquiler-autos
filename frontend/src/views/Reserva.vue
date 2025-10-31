<template>
  <div v-if="autoSeleccionado" class="reserva-layout">
    <div class="auto-preview">
      <h3>{{ autoSeleccionado.nombre }}</h3>
      <div class="carousel">
        <img
          :src="`/img/autos/${autoSeleccionado.carpeta}/${autoSeleccionado.imagenes[imagenActual]}`"
          :alt="`Vista ${imagenActual + 1}`"
        />
        <div class="carousel-controls">
          <button @click="anterior">‹</button>
          <button @click="siguiente">›</button>
        </div>
      </div>
      <ul>
        <li><strong>Motor:</strong> {{ autoSeleccionado.motor }}</li>
        <li><strong>Transmisión:</strong> {{ autoSeleccionado.transmision }}</li>
        <li><strong>Capacidad:</strong> {{ autoSeleccionado.capacidad }} personas</li>
        <li><strong>Extras:</strong> {{ autoSeleccionado.extras }}</li>
      </ul>
    </div>
    

    <div class="reserva-box">
      <h2>Reservar Auto</h2>
      <form @submit.prevent="handleReserva">
        <input type="date" v-model="fechaInicio" :class="{ error: !fechaInicio }" />
        <input type="date" v-model="fechaFin" :class="{ error: !fechaFin || fechaFin <= fechaInicio }" />
        <input type="text" v-model="nombre" placeholder="Tu nombre" :class="{ error: !nombre }" />
        <input type="email" v-model="correo" placeholder="Correo electrónico" :class="{ error: !correo.includes('@') }" />
        <button type="submit" :disabled="!formValido">Confirmar reserva</button>
      </form>
    </div>
  </div>
  <div v-else class="reserva-error">
  <p>No se encontró el auto seleccionado.</p>
  <button @click="$router.push('/catalogo')">Volver al catálogo</button>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const autoId = ref(route.query.auto)
const autoSeleccionado = ref(null)
const imagenActual = ref(0)

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
    extras: 'Aire acondicionado, Bluetooth'
  }
]

onMounted(() => {
  autoSeleccionado.value = autos.find(a => a.id === autoId.value)
})

function siguiente() {
  const total = autoSeleccionado.value.imagenes.length
  imagenActual.value = (imagenActual.value + 1) % total
}

function anterior() {
  const total = autoSeleccionado.value.imagenes.length
  imagenActual.value = (imagenActual.value - 1 + total) % total
}

const fechaInicio = ref('')
const fechaFin = ref('')
const nombre = ref('')
const correo = ref('')

const formValido = computed(() =>
  nombre.value &&
  correo.value.includes('@') &&
  fechaInicio.value &&
  fechaFin.value &&
  fechaFin.value > fechaInicio.value
)

function handleReserva() {
  console.log('Reserva confirmada:', {
    auto: autoSeleccionado.value?.nombre,
    fechaInicio: fechaInicio.value,
    fechaFin: fechaFin.value,
    nombre: nombre.value,
    correo: correo.value
  })
}
</script>

<style scoped>
.reserva-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background-color: var(--bg-color);
}

.auto-preview {
  max-width: 400px;
  width: 100%;
  background: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--neon-shadow);
}

.auto-preview h3 {
  margin-bottom: 1rem;
  color: var(--accent-color);
  text-align: center;
}

.carousel {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.carousel img {
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

.auto-preview ul {
  list-style: none;
  padding: 0;
}

.auto-preview li {
  margin-bottom: 0.5rem;
}

.reserva-box {
  background: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: var(--neon-shadow);
}

.reserva-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
}

.reserva-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reserva-box input {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
}

.reserva-box input.error {
  border: 1px solid #ff4d4d;
}

.reserva-box button {
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.reserva-box button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.reserva-error {
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

.reserva-error h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.reserva-error p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.reserva-error button {
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

</style>
