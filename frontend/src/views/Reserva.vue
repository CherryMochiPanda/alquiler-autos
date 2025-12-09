<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useNotification } from '../composables'
import locationService from '../services/locationService'
import inventoryService from '../services/inventoryService'
import { checkDriverAvailability } from '../data/locations'
import { useAuth } from '../composables'
import { useReservationsStore } from '../stores/useReservationsStore'
import carsService from '../services/carsService'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const notification = useNotification()
const { isAuthenticated, user } = useAuth()
const reservationsStore = useReservationsStore()

// Auto selection
const autoId = ref(route.query.auto)
const autoSeleccionado = ref(null)

onMounted(async () => {
  if (!autoId.value) return
  const res = await carsService.getCar(autoId.value)
  if (res && res.success && res.data) {
    autoSeleccionado.value = res.data
  } else {
    autoSeleccionado.value = null
  }
})

// Reservation form fields
const provinceSelected = ref('')
const pickupOfficeSelected = ref('')
const deliveryOfficeSelected = ref('')
// Split date and time so date is selected via calendar and time can be edited
const pickupDate = ref('')
const pickupTime = ref('')
const deliveryDate = ref('')
const deliveryTime = ref('')
const driverCheckStatus = ref(null) // { available, message }
const hireDriver = ref(false)

// Constants
const hoy = new Date()
const hoyCadena = hoy.toISOString().split('T')[0]
const minDias = 3
const precioPorDia = 45

// State for locations from API
const provinces = ref([])
const pickupOffices = ref([])
const deliveryOffices = ref([])
const allLocations = ref([])
const inventoryMap = ref({}) // locationId -> stock

watch(provinceSelected, async () => {
  pickupOfficeSelected.value = ''
  deliveryOfficeSelected.value = ''
  hireDriver.value = false
  if (!provinceSelected.value) {
    pickupOffices.value = []
    return
  }
  // load locations in this province then filter by inventory availability for the car
  const locsRes = await locationService.getLocationsByProvince(provinceSelected.value)
  if (!locsRes.success) {
    pickupOffices.value = []
    return
  }
  const locs = locsRes.data || []
  // filter locations that have inventory for the selected car (stock>0)
  // If inventoryMap is empty (not yet loaded), fall back to showing all locations so user can continue selection.
  const hasInventoryInfo = Object.keys(inventoryMap.value || {}).length > 0
  const filtered = locs.filter(l => {
    const stock = inventoryMap.value[l.id]
    return stock && stock > 0
  })
  pickupOffices.value = hasInventoryInfo ? filtered : locs
})

// When inventory map becomes available later, re-filter pickupOffices if a province is selected
watch(inventoryMap, () => {
  if (!provinceSelected.value) return
  ;(async () => {
    const locsRes = await locationService.getLocationsByProvince(provinceSelected.value)
    if (!locsRes.success) return
    const locs = locsRes.data || []
    const filtered = locs.filter(l => {
      const stock = inventoryMap.value[l.id]
      return stock && stock > 0
    })
    pickupOffices.value = filtered
  })()
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

// Hours validation: store hours for selected pickup/delivery locations
const pickupLocationHours = ref(null)
const deliveryLocationHours = ref(null)

function timeToMinutes(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(x => parseInt(x, 10))
  return h * 60 + m
}

function isWithinLocationHours(hoursArray, dateStr, timeStr) {
  if (!hoursArray || hoursArray.length === 0) return true // no restrictions
  const d = new Date(dateStr + 'T' + timeStr)
  const day = d.getDay() // 0..6
  const entry = hoursArray.find(h => Number(h.dayOfWeek) === day)
  if (!entry) return true // no hours for that day -> assume open
  const open = timeToMinutes(entry.openTime)
  const close = timeToMinutes(entry.closeTime)
  const t = timeToMinutes(timeStr)
  if (open === null || close === null || t === null) return true
  return t >= open && t <= close
}

// Devuelve entry de hours para la fecha dada (día de la semana)
function getHoursForDay(hoursArray, dateStr) {
  if (!hoursArray || hoursArray.length === 0 || !dateStr) return null
  const d = new Date(dateStr + 'T00:00')
  const day = d.getDay()
  return hoursArray.find(h => Number(h.dayOfWeek) === day) || null
}

const pickupDayHours = computed(() => getHoursForDay(pickupLocationHours.value || [], pickupDate.value))
const deliveryDayHours = computed(() => getHoursForDay(deliveryLocationHours.value || [], deliveryDate.value))

const pickupTimeMin = computed(() => (pickupDayHours.value ? pickupDayHours.value.openTime : null))
const pickupTimeMax = computed(() => (pickupDayHours.value ? pickupDayHours.value.closeTime : null))
const deliveryTimeMin = computed(() => (deliveryDayHours.value ? deliveryDayHours.value.openTime : null))
const deliveryTimeMax = computed(() => (deliveryDayHours.value ? deliveryDayHours.value.closeTime : null))

// Clamp times if user or draft provides out-of-range value
watch(pickupTimeMin, (min) => {
  if (!min || !pickupTime.value) return
  if (pickupTime.value < min) pickupTime.value = min
})
watch(pickupTimeMax, (max) => {
  if (!max || !pickupTime.value) return
  if (pickupTime.value > max) pickupTime.value = max
})
watch(deliveryTimeMin, (min) => {
  if (!min || !deliveryTime.value) return
  if (deliveryTime.value < min) deliveryTime.value = min
})
watch(deliveryTimeMax, (max) => {
  if (!max || !deliveryTime.value) return
  if (deliveryTime.value > max) deliveryTime.value = max
})

watch([pickupOfficeSelected, pickupDate, pickupTime], async () => {
  if (!pickupOfficeSelected.value) {
    pickupLocationHours.value = null
    return
  }
  const res = await locationService.getLocation(pickupOfficeSelected.value)
  if (res.success && res.data) {
    pickupLocationHours.value = res.data.hours || []
  } else {
    pickupLocationHours.value = null
  }
})

watch([deliveryOfficeSelected, deliveryDate, deliveryTime], async () => {
  if (!deliveryOfficeSelected.value) {
    deliveryLocationHours.value = null
    return
  }
  const res = await locationService.getLocation(deliveryOfficeSelected.value)
  if (res.success && res.data) {
    deliveryLocationHours.value = res.data.hours || []
  } else {
    deliveryLocationHours.value = null
  }
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
  // Only require driver availability if the user opted to hire one
  (!hireDriver.value || driverAvailable.value) &&
  // validate pickup/delivery hours when hours are defined
  isWithinLocationHours(pickupLocationHours.value || [], pickupDate.value, pickupTime.value) &&
  isWithinLocationHours(deliveryLocationHours.value || [], deliveryDate.value, deliveryTime.value)
)

// Computed guards for sequential enabling
const canSelectPickupOffice = computed(() => Boolean(provinceSelected.value))
const canSelectDeliveryOffice = computed(() => Boolean(pickupOfficeSelected.value))
const canSelectPickupDate = computed(() => Boolean(deliveryOfficeSelected.value))
const canSelectPickupTime = computed(() => Boolean(pickupDate.value))
const canSelectDeliveryDate = computed(() => Boolean(pickupTime.value))
const canSelectDeliveryTime = computed(() => Boolean(deliveryDate.value))

function goBack() {
  router.back()
}

async function handleAddToCart() {
  // Validate form before proceeding
  if (!formValido.value) {
    notification.error('Formulario inválido: revisa los datos y horarios')
    return
  }

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

  // Guardar reserva en backend
  const payload = {
    startDate: pickupDateTime.value,
    endDate: deliveryDateTime.value,
    userId: user.value?.id,
    carId: autoId.value,
    pickupLocationId: pickupOfficeSelected.value,
    dropoffLocationId: deliveryOfficeSelected.value,
    hasDriver: hireDriver.value || false,
    totalPrice: precioTotal.value
  }

  try {
    const res = await reservationsStore.createReservation(payload)
    if (res && res.success) {
      notification.success('Reserva creada correctamente')
      router.push('/account')
    } else {
      notification.error(res.error || 'No se pudo crear la reserva')
    }
  } catch (e) {
    notification.error(e.message || 'Error al crear la reserva')
  }
}

// Restaurar draft si existe
onMounted(async () => {
  // restore draft
  const raw = sessionStorage.getItem('reservationDraft')
  if (raw) {
    try {
      const draft = JSON.parse(raw)
      if (draft && draft.autoId === autoId.value) {
        provinceSelected.value = draft.provinceSelected || ''
        pickupOfficeSelected.value = draft.pickupOfficeSelected || ''
        deliveryOfficeSelected.value = draft.deliveryOfficeSelected || ''
        pickupDate.value = draft.pickupDate || ''
        pickupTime.value = draft.pickupTime || ''
        deliveryDate.value = draft.deliveryDate || ''
        deliveryTime.value = draft.deliveryTime || ''
      }
    } catch (e) {
      // ignore
    }
    sessionStorage.removeItem('reservationDraft')
  }

  // load provinces
  const provRes = await locationService.getProvinces()
  provinces.value = provRes.success ? provRes.data : []

  // load all locations for delivery list
  const allRes = await locationService.getAllLocations()
  allLocations.value = allRes.success ? allRes.data : []
  deliveryOffices.value = allLocations.value

  // if we have a car id, load inventory map for that car
  if (autoId.value) {
    const invRes = await inventoryService.getByCar(autoId.value)
    if (invRes.success && Array.isArray(invRes.data)) {
      const map = {}
      for (const inv of invRes.data) {
        map[inv.locationId] = inv.stock
      }
      inventoryMap.value = map
    }
  }
})
</script>


<template>
  <div v-if="autoSeleccionado" class="reserva-layout">
    <div class="auto-preview">
      <h3>{{ autoSeleccionado.nombre }}</h3>
      <div class="carousel">
        <img
          :src="autoSeleccionado.image || '/img/default-car.jpg'"
          :alt="autoSeleccionado.brand + ' ' + autoSeleccionado.model"
        />
      </div>
      <ul>
        <li><strong>Marca / Modelo:</strong> {{ autoSeleccionado.brand }} {{ autoSeleccionado.model }}</li>
        <li><strong>Año:</strong> {{ autoSeleccionado.year }}</li>
        <li><strong>Placa:</strong> {{ autoSeleccionado.plate }}</li>
        <li><strong>Categoría:</strong> {{ autoSeleccionado.category?.name || '—' }}</li>
        <li><strong>Precio por día:</strong> ${{ autoSeleccionado.pricePerDay }}</li>
        <li><strong>Disponibilidad:</strong> {{ autoSeleccionado.isAvailable ? 'Sí' : 'No' }}</li>
        <li v-if="autoSeleccionado.reviews"><strong>Reseñas:</strong> {{ autoSeleccionado.reviews.length }} (media: {{ (autoSeleccionado.reviews.reduce((s,r)=>s+(r.rating||0),0)/ (autoSeleccionado.reviews.length||1)).toFixed(1) }})</li>
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
          <select v-model="pickupOfficeSelected" :disabled="!canSelectPickupOffice || pickupOffices.length===0" required>
            <option value="">Selecciona oficina...</option>
            <option v-for="office in pickupOffices" :key="office.id" :value="office.id">
              {{ office.name }}
            </option>
          </select>
          <small v-if="pickupLocationHours && pickupLocationHours.length>0" class="info-msg">
            Este local tiene horario. Horario para el día seleccionado:
            <span v-if="pickupDayHours">{{ pickupDayHours.openTime }} - {{ pickupDayHours.closeTime }}</span>
            <span v-else>Sin horario específico para el día seleccionado</span>
          </small>
        </div>

        <div class="form-group">
          <label>Lugar de Entrega</label>
          <select v-model="deliveryOfficeSelected" :disabled="!canSelectDeliveryOffice || deliveryOffices.length===0" required>
            <option value="">Selecciona oficina...</option>
            <option v-for="office in deliveryOffices" :key="office.id" :value="office.id">
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
                :disabled="!canSelectPickupDate"
                required
              />
            </div>
            <div class="half">
              <input
                type="time"
                v-model="pickupTime"
                :disabled="!canSelectPickupTime"
                :min="pickupTimeMin || undefined"
                :max="pickupTimeMax || undefined"
                required
                class="datetime-input"
              />
            </div>
          </div>
          <small v-if="pickupDateTime" class="info-msg">
            Seleccionado: {{ new Date(pickupDateTime).toLocaleString('es-CU') }}
          </small>
          <small v-if="pickupLocationHours && pickupDateTime && !isWithinLocationHours(pickupLocationHours, pickupDate.value, pickupTime.value)" class="error-msg">
            La hora seleccionada no está dentro del horario de atención del local seleccionado.
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
                :disabled="!canSelectDeliveryDate"
                required
              />
            </div>
            <div class="half">
              <input
                type="time"
                v-model="deliveryTime"
                :disabled="!canSelectDeliveryTime"
                :min="deliveryTimeMin || undefined"
                :max="deliveryTimeMax || undefined"
                required
                class="datetime-input"
              />
            </div>
          </div>
          <small v-if="deliveryLocationHours && deliveryLocationHours.length>0" class="info-msg">
            Este local tiene horario. Horario para el día seleccionado:
            <span v-if="deliveryDayHours">{{ deliveryDayHours.openTime }} - {{ deliveryDayHours.closeTime }}</span>
            <span v-else>Sin horario específico para el día seleccionado</span>
          </small>
          <small v-if="deliveryDateTime" class="info-msg">
            Seleccionado: {{ new Date(deliveryDateTime).toLocaleString('es-CU') }}
          </small>
          <small v-if="deliveryLocationHours && deliveryDateTime && !isWithinLocationHours(deliveryLocationHours, deliveryDate.value, deliveryTime.value)" class="error-msg">
            La hora seleccionada no está dentro del horario de atención del local de entrega.
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
          <button type="submit" class="btn-submit" :disabled="!formValido">
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
  color: var(--text-on-accent);
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
