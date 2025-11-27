<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '../composables'
import { autos } from '../data/autos'
import { 
  provinces, 
  getMunicipalitiesByProvince, 
  getOfficesByMunicipality,
  checkDriverAvailability 
} from '../data/locations'
import { useAuth } from '../composables'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const notification = useNotification()
const { isAuthenticated } = useAuth()

// Auto selection
const autoId = ref(route.query.auto)
const autoSeleccionado = ref(null)
const imagenActual = ref(0)

onMounted(() => {
  autoSeleccionado.value = autos.find(a => a.id === autoId.value) || null
})

function siguiente() {
  if (!autoSeleccionado.value || !autoSeleccionado.value.imagenes) return
  const total = autoSeleccionado.value.imagenes.length
  imagenActual.value = (imagenActual.value + 1) % total
}

function anterior() {
  if (!autoSeleccionado.value || !autoSeleccionado.value.imagenes) return
  const total = autoSeleccionado.value.imagenes.length
  imagenActual.value = (imagenActual.value - 1 + total) % total
}

// Reservation form fields
const provinceSelected = ref('')
const pickupOfficeSelected = ref('')
const deliveryOfficeSelected = ref('')
// Split date and time so date is selected via calendar and time can be edited
const pickupDate = ref('')
const pickupTime = ref('18:00')
const deliveryDate = ref('')
const deliveryTime = ref('18:00')
const driverCheckStatus = ref(null) // { available, message }
const hireDriver = ref(false)

// Constants
const hoy = new Date()
const hoyCadena = hoy.toISOString().split('T')[0]
const minDias = 3
const precioPorDia = 45

// Computed properties for locations
const availablePickupOffices = computed(() => {
  if (!provinceSelected.value) return []
  const allOffices = []
  const munis = getMunicipalitiesByProvince(provinceSelected.value)
  for (const mun of munis) {
    const offices = getOfficesByMunicipality(mun.id)
    allOffices.push(...offices)
  }
  return allOffices
})

const availableDeliveryOffices = computed(() => {
  if (!provinceSelected.value) return []
  const allOffices = []
  const munis = getMunicipalitiesByProvince(provinceSelected.value)
  for (const mun of munis) {
    const offices = getOfficesByMunicipality(mun.id)
    allOffices.push(...offices)
  }
  return allOffices
})

watch(provinceSelected, () => {
  pickupOfficeSelected.value = ''
  deliveryOfficeSelected.value = ''
  hireDriver.value = false
})

// Helper: combinar date + time en datetime ISO local
const pickupDateTime = computed(() => {
  if (!pickupDate.value || !pickupTime.value) return ''
  return `${pickupDate.value}T${pickupTime.value}`
})

const deliveryDateTime = computed(() => {
  if (!deliveryDate.value || !deliveryTime.value) return ''
  return `${deliveryDate.value}T${deliveryTime.value}`
})

watch([pickupOfficeSelected, pickupDate, pickupTime, deliveryDate, deliveryTime, hireDriver], () => {
  // Verificar disponibilidad de conductores SOLO si el usuario optó por contratar uno
  if (!hireDriver.value) {
    driverCheckStatus.value = null
    return
  }

  if (pickupOfficeSelected.value && pickupDateTime.value && deliveryDateTime.value) {
    const availability = checkDriverAvailability(
      pickupOfficeSelected.value,
      pickupDateTime.value,
      deliveryDateTime.value
    )
    driverCheckStatus.value = availability
  }
})

// Calcula fecha mínima para recogida (hoy + 1 día a las 00:00)
function getMinPickupDate() {
  const tomorrow = new Date(hoy)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

// Calcula fecha mínima para entrega basada en recogida + minDias
function getMinDeliveryDate() {
  if (!pickupDate.value) {
    const min = new Date(hoy)
    min.setDate(min.getDate() + minDias)
    return min.toISOString().split('T')[0]
  }
  const pickup = new Date(pickupDate.value + 'T00:00')
  const minDelivery = new Date(pickup)
  minDelivery.setDate(minDelivery.getDate() + minDias)
  return minDelivery.toISOString().split('T')[0]
}

// Days calculation
const dias = computed(() => {
  if (!pickupDateTime.value || !deliveryDateTime.value) return 0
  const pickup = new Date(pickupDateTime.value)
  const delivery = new Date(deliveryDateTime.value)
  const diffMs = delivery - pickup
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
})

// Price calculation
const precioTotal = computed(() => {
  return dias.value * precioPorDia
})

// Validation
const diasValidos = computed(() => dias.value >= minDias)

const horasValidas = computed(() => {
  if (!pickupDateTime.value || !deliveryDateTime.value) return false
  const pickup = new Date(pickupDateTime.value)
  const delivery = new Date(deliveryDateTime.value)
  const diffMs = delivery - pickup
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDays >= minDias
})

const driverAvailable = computed(() => {
  return driverCheckStatus.value && driverCheckStatus.value.available
})

const formValido = computed(() =>
  provinceSelected.value &&
  pickupOfficeSelected.value &&
  deliveryOfficeSelected.value &&
  pickupDate.value &&
  pickupTime.value &&
  deliveryDate.value &&
  deliveryTime.value &&
  horasValidas.value &&
  diasValidos.value &&
  driverAvailable.value
)

function goBack() {
  router.back()
}

function handleAddToCart() {
  // Si no está autenticado, guardar borrador y redirigir a login
  if (!isAuthenticated.value) {
    const draft = {
      autoId: autoId.value,
      provinceSelected: provinceSelected.value,
      pickupOfficeSelected: pickupOfficeSelected.value,
      deliveryOfficeSelected: deliveryOfficeSelected.value,
      pickupDate: pickupDate.value,
      pickupTime: pickupTime.value,
      deliveryDate: deliveryDate.value,
      deliveryTime: deliveryTime.value
    }
    sessionStorage.setItem('reservationDraft', JSON.stringify(draft))
    router.push('/account')
    return
  }

  // TODO: Guardar en carrito (Pinia store)
  notification.success('Reserva agregada al carrito')
  router.push('/catalogo')
}

// Restaurar draft si existe
onMounted(() => {
  const raw = sessionStorage.getItem('reservationDraft')
  if (raw) {
    try {
      const draft = JSON.parse(raw)
      if (draft && draft.autoId === autoId.value) {
        provinceSelected.value = draft.provinceSelected || ''
        pickupOfficeSelected.value = draft.pickupOfficeSelected || ''
        deliveryOfficeSelected.value = draft.deliveryOfficeSelected || ''
        pickupDate.value = draft.pickupDate || ''
        pickupTime.value = draft.pickupTime || '18:00'
        deliveryDate.value = draft.deliveryDate || ''
        deliveryTime.value = draft.deliveryTime || '18:00'
      }
    } catch (e) {
      // ignore
    }
    sessionStorage.removeItem('reservationDraft')
  }
})
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
          <button type="button" @click="anterior">‹</button>
          <button type="button" @click="siguiente">›</button>
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
      <h2>Nueva Reserva</h2>
      <form @submit.prevent="handleAddToCart">
        <div class="form-group">
          <label>Destino</label>
          <select v-model="provinceSelected" required>
            <option value="">Selecciona una provincia...</option>
            <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
              {{ prov.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Lugar de Recogida</label>
          <select v-model="pickupOfficeSelected" :disabled="!provinceSelected" required>
            <option value="">Selecciona oficina...</option>
            <option v-for="office in availablePickupOffices" :key="office.id" :value="office.id">
              {{ office.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Lugar de Entrega</label>
          <select v-model="deliveryOfficeSelected" :disabled="!provinceSelected" required>
            <option value="">Selecciona oficina...</option>
            <option v-for="office in availableDeliveryOffices" :key="office.id" :value="office.id">
              {{ office.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Recogida</label>
          <div class="date-time-row">
            <div class="half">
              <input
                type="date"
                v-model="pickupDate"
                :min="getMinPickupDate()"
                @keydown.prevent
                required
              />
            </div>
            <div class="half">
              <input
                type="time"
                v-model="pickupTime"
                required
                class="datetime-input"
              />
            </div>
          </div>
          <small v-if="pickupDateTime" class="info-msg">
            Seleccionado: {{ new Date(pickupDateTime).toLocaleString('es-CU') }}
          </small>
        </div>

        <div class="form-group">
          <label>Entrega</label>
          <div class="date-time-row">
            <div class="half">
              <input
                type="date"
                v-model="deliveryDate"
                :min="getMinDeliveryDate()"
                @keydown.prevent
                required
              />
            </div>
            <div class="half">
              <input
                type="time"
                v-model="deliveryTime"
                required
                class="datetime-input"
              />
            </div>
          </div>
          <small v-if="deliveryDateTime" class="info-msg">
            Seleccionado: {{ new Date(deliveryDateTime).toLocaleString('es-CU') }}
          </small>
          <small v-if="deliveryDateTime && !diasValidos" class="error-msg">
            Mínimo {{ minDias }} días de renta (actualmente {{ dias }} días)
          </small>
        </div>

        <div v-if="driverCheckStatus && driverCheckStatus.available" class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="hireDriver" />
            ¿Contratar conductor?
          </label>
        </div>

        <div class="resumen">
          <p><strong>Días de renta:</strong> {{ dias }} día(s)</p>
          <p><strong>Precio por día:</strong> ${{ precioPorDia }}</p>
          <p class="total"><strong>TOTAL:</strong> ${{ precioTotal.toFixed(2) }}</p>
          <p style="font-size: 0.85rem; color: var(--accent-color); margin-top: 1rem;">
            Cancelación permitida hasta 48 horas antes de la recogida
          </p>
        </div>

        <div class="button-group">
          <button type="button" @click="goBack" class="btn-back">
            ← Regresar
          </button>
          <button type="submit" class="btn-submit">
            Agregar al Carrito
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-else class="reserva-error">
    <p>Auto no encontrado</p>
    <button @click="$router.push('/catalogo')">Volver al Catálogo</button>
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
  background: var(--color-wrapper);
  min-height: 100vh;
}

.auto-preview,
.reserva-box {
  width: 100%;
  max-width: 450px;
  background: var(--box-bg);
  color: var(--text-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--neon-shadow);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auto-preview h3,
.reserva-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  font-size: 1.5rem;
}

.carousel {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1.5rem;
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
  padding: 0 0.5rem;
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.carousel-controls button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.auto-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.auto-preview li {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.reserva-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.form-group input,
.form-group select {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.date-time-row {
  display: flex;
  gap: 0.5rem;
}

.date-time-row .half {
  flex: 1;
}

/* Reduce visual footprint de inputs date/time */
.date-time-row input[type="date"],
.date-time-row input[type="time"] {
  padding: 0.5rem;
  font-size: 0.95rem;
}

.datetime-input {
  cursor: pointer;
  background-color: rgba(0, 200, 255, 0.1) !important;
  border: 1px solid rgba(0, 200, 255, 0.3) !important;
}

.datetime-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(1);
  opacity: 0.8;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-color);
}

.form-group input.error {
  border-color: var(--danger-color);
}

.form-group input:disabled,
.form-group select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: -0.3rem;
}

.info-msg {
  color: var(--accent-color);
  font-size: 0.8rem;
  margin-top: -0.3rem;
}

.success-msg {
  color: var(--success-color);
  font-size: 0.85rem;
  padding: 0.5rem;
  background: rgba(77, 255, 77, 0.1);
  border-left: 3px solid var(--success-color);
  border-radius: 4px;
}

.reserva-error {
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.additional-drivers {
  background: rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent-color);
  margin-top: 0.5rem;
}

.driver-form {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.driver-form:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.driver-form h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: var(--accent-color);
}

.driver-form input {
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 0.5rem;
}

.btn-remove {
  background-color: rgba(255, 77, 77, 0.2);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-remove:hover {
  background-color: var(--danger-color);
  color: white;
}

.btn-add-driver {
  background-color: rgba(0, 200, 255, 0.2);
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-add-driver:hover {
  background-color: var(--accent-color);
  color: var(--text-color);
}

.resumen {
  background: rgba(0, 200, 255, 0.1);
  padding: 1.2rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent-color);
  text-align: left;
  font-size: 0.95rem;
  margin-top: 1.5rem;
}

.resumen p {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.resumen p.total {
  font-size: 1.1rem;
  color: var(--accent-color);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-back,
.btn-submit {
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-back {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-back:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.btn-submit {
  background-color: var(--accent-color);
  color: var(--text-color);
}

.btn-submit:hover:not(:disabled) {
  box-shadow: 0 0 20px var(--accent-color);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background-color: var(--muted-color);
  cursor: not-allowed;
  opacity: 0.6;
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

.reserva-error button {
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.reserva-error button:hover {
  box-shadow: 0 0 20px var(--accent-color);
}

/* Date input styling for disabled dates */
input[type="date"] {
  color: var(--text-color);
  background-color: var(--bg-color);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  cursor: pointer;
}

/* Responsive */
@media (max-width: 900px) {
  .reserva-layout {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .date-time-row {
    flex-direction: column;
  }

  .auto-preview,
  .reserva-box {
    max-width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-back,
  .btn-submit {
    width: 100%;
  }
}
</style>
