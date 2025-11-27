<template>
  <section class="user-reservations">
    <h2>Mis Reservas</h2>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else>
      <div v-if="reservations.length === 0" class="empty-state">
        No tienes reservas activas.
      </div>

      <div class="reservations-list">
        <div v-for="r in reservations" :key="r.id" class="reservation-card">
          <div class="row">
            <div><strong>Auto:</strong> {{ getAutoName(r.autoId) }}</div>
            <div><strong>Estado:</strong> {{ r.status }}</div>
          </div>
          <div class="row">
            <div><strong>Recogida:</strong> {{ formatDate(r.pickupDateTime) }}</div>
            <div><strong>Entrega:</strong> {{ formatDate(r.deliveryDateTime) }}</div>
          </div>
          <div class="row">
            <div><strong>Oficina Recogida:</strong> {{ getOfficeName(r.pickupOffice) }}</div>
            <div><strong>Oficina Entrega:</strong> {{ getOfficeName(r.deliveryOffice) }}</div>
          </div>
          <div class="actions">
            <button v-if="canCancel(r)" @click="cancel(r.id)" class="btn-cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useReservationsStore } from '../stores/useReservationsStore'
import { useAuth } from '../composables'
import { useNotification } from '../composables'
import { autos } from '../data/autos'
import { getOfficeName } from '../data/locations'

const reservationsStore = useReservationsStore()
const { user } = useAuth()
const notification = useNotification()

const loading = ref(false)
const reservations = ref([])

function getAutoName(autoId) {
  const a = autos.find(x => x.id === autoId)
  return a ? a.nombre : autoId
}

function formatDate(dt) {
  try { return new Date(dt).toLocaleString('es-CU') } catch { return dt }
}

async function load() {
  const uid = user.value?.id
  if (!uid) {
    reservations.value = []
    return
  }
  loading.value = true
  await reservationsStore.fetchReservationsForUser(uid)
  reservations.value = reservationsStore.getReservationsByUser(uid)
  loading.value = false
}

// If user logs in after mounting, reload reservations
watch(() => user.value && user.value.id, (newId) => {
  if (newId) load()
})

function canCancel(r) {
  return reservationsStore.canCancel(r)
}

async function cancel(id) {
  const res = await reservationsStore.cancelReservation(id)
  if (res.success) {
    notification.success('Reserva cancelada')
    await load()
  } else {
    notification.error(res.error || 'No se pudo cancelar')
  }
}

onMounted(load)
</script>

<style scoped>
.user-reservations { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
.reservation-card { background: var(--box-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border:1px solid rgba(255,255,255,0.06);} 
.row { display:flex; justify-content:space-between; gap:1rem; margin-bottom:0.5rem; }
.actions { display:flex; justify-content:flex-end; }
.btn-cancel { background: #ff5252; color: #fff; border:none; padding:0.5rem 0.8rem; border-radius:6px; cursor:pointer }
.empty-state { text-align:center; color:var(--color-Tgrand); padding:2rem }
</style>
