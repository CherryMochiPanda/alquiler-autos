<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { pushToast } from '../utils/toastStore'
import { useRoute } from 'vue-router'
import { autos } from '../data/autos'

const route = useRoute()
const autoId = ref(route.query.auto)
const autoSeleccionado = ref(null)
const imagenActual = ref(0)

const { t } = useI18n()

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
const telefono = ref('')
const documentoNumero = ref('')
const comentarios = ref('')

const hoy = new Date().toISOString().split('T')[0]

const dniValido = computed(() => /^\d{11}$/.test(documentoNumero.value))
const telefonoValido = computed(() => /^\+?\d{8,15}$/.test(telefono.value))
const nombreValido = computed(() => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,}$/.test(nombre.value))



const dias = computed(() => {
  if (!fechaInicio.value || !fechaFin.value) return 0
  const inicio = new Date(fechaInicio.value)
  const fin = new Date(fechaFin.value)
  return Math.max(0, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)))
})

const precioPorDia = 45
const precioTotal = computed(() => dias.value * precioPorDia)

const fechasValidas = computed(() => {
  return (
    fechaInicio.value >= hoy &&
    fechaFin.value > fechaInicio.value
  )
})

const formValido = computed(() =>
  nombreValido.value &&
  correo.value.includes('@') &&
  telefonoValido.value &&
  dniValido.value &&
  fechasValidas.value
)


function handleReserva() {
  pushToast(t('reservaMessages.confirmed', {
    car: autoSeleccionado.value.nombre,
    start: fechaInicio.value,
    end: fechaFin.value,
    days: dias.value,
    total: precioTotal.value
  }), 'success')
}
</script>


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
        <li><strong>{{ t('detalle.labels.motor') }}:</strong> {{ autoSeleccionado.motor }}</li>
        <li><strong>{{ t('detalle.labels.transmission') }}:</strong> {{ autoSeleccionado.transmision }}</li>
        <li><strong>{{ t('detalle.labels.capacity') }}:</strong> {{ autoSeleccionado.capacidad }} {{ t('detalle.labels.people') }}</li>
        <li><strong>{{ t('detalle.labels.extras') }}:</strong> {{ autoSeleccionado.extras }}</li>
      </ul>
    </div>

    <div class="reserva-box">
      <h2>{{ $t('reserva.title') }}</h2>
      <form @submit.prevent="handleReserva">
        <input type="text" v-model="nombre" :placeholder="$t('reserva.placeholders.name')" :class="{ error: !nombre }" />
        <small v-if="nombre && !nombreValido" class="error-msg">{{ $t('reserva.errors.name') }}</small>
        <input type="email" v-model="correo" :placeholder="$t('reserva.placeholders.email')" :class="{ error: !correo.includes('@') }" />
        <input type="tel" v-model="telefono" :placeholder="$t('reserva.placeholders.phone')" :class="{ error: telefono.length < 8 }" />
        <small v-if="telefono && !telefonoValido" class="error-msg">{{ $t('reserva.errors.phone') }}</small>
        <input type="text" v-model="documentoNumero" :placeholder="$t('reserva.placeholders.dni')" :class="{ error: !documentoNumero }" />               
        <small v-if="documentoNumero && !dniValido" class="error-msg">{{ $t('reserva.errors.dni') }}</small>
        <input type="date" v-model="fechaInicio" :min="hoy" :class="{ error: !fechaInicio || fechaInicio < hoy }" />
        <small v-if="fechaFin && fechaFin <= fechaInicio" class="error-msg">{{ $t('reserva.errors.dateEnd') }}</small>
        <small v-if="fechaInicio && fechaInicio < hoy" class="error-msg">{{ $t('reserva.errors.dateStart') }}</small>

        <input type="date" v-model="fechaFin" :min="fechaInicio" :class="{ error: !fechaFin || fechaFin <= fechaInicio }" />
        <small v-if="fechaFin && fechaFin <= fechaInicio" class="error-msg">{{ $t('reserva.errors.dateEnd') }}</small>

        <select disabled>
          <option>{{ $t('reserva.paymentComing') }}</option>
        </select>

        <div class="resumen">
          <p><strong>{{ $t('reserva.days') }}:</strong> {{ dias }}</p>
          <p><strong>{{ $t('reserva.estimated') }}:</strong> ${{ precioTotal }}</p>
        </div>

        <button type="submit" :disabled="!formValido">{{ $t('reserva.confirm') }}</button>
      </form>
    </div>
  </div>

  <div v-else class="reserva-error">
    <p>{{ $t('reservaFallback.notFound') }}</p>
    <button @click="$router.push('/catalogo')">{{ $t('reservaFallback.back') }}</button>
  </div>
</template>


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

.auto-preview,
.reserva-box {
  width: 100%;
  max-width: 400px;
  background: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--neon-shadow);
}

.auto-preview h3,
.reserva-box h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--accent-color);
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

.reserva-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reserva-box input,
.reserva-box select,
.reserva-box textarea {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
}

.reserva-box input.error,
.reserva-box select.error {
  border: 1px solid #ff4d4d;
}

.doc-group {
  display: flex;
  gap: 0.5rem;
}

.doc-group input:first-child {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
}

.doc-group input:last-child {
  flex: 2;
}

.resumen {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.error-msg {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: -0.5rem;
}

.reserva-box button {
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
