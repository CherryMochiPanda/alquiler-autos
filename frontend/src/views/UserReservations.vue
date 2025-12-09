<template>
  <section class="user-reservations">
    <h2>Mis Reservas</h2>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else>
        <!-- Reports / Admin actions -->
        <div class="reports-panel">
          <div class="reports-row">
            <div class="report-field">
              <label>Tipo de reporte</label>
              <select v-model="reportType">
                <option value="reservations">Reservas</option>
                <option v-if="isAdmin" value="revenue">Ingresos (admin)</option>
                <option v-if="isAdmin" value="top_cars">Autos más solicitados (admin)</option>
                <option v-if="isAdmin" value="utilization">Utilización por auto (admin)</option>
              </select>
            </div>

            <div class="report-field">
              <label>Desde</label>
              <input type="date" v-model="fromDate" />
            </div>

            <div class="report-field">
              <label>Hasta</label>
              <input type="date" v-model="toDate" />
            </div>

            <div class="report-actions">
              <button class="btn-secondary" @click="generateReport">Generar</button>
              <button class="btn-primary" @click="exportReport">Exportar a PDF</button>
            </div>
          </div>
        </div>

      <div v-if="reservations.length === 0" class="empty-state">
        No tienes reservas activas.
      </div>

          <div class="reservations-list">
            <div v-for="r in reservations" :key="r.id" class="reservation-card">
              <div class="row">
                <div><strong>Auto:</strong> {{ getAutoName(r.car?.id) }}</div>
                <div><strong>Estado:</strong> {{ r.status }}</div>
              </div>
              <div class="row">
                <div><strong>Recogida:</strong> {{ formatDate(r.startDate) }}</div>
                <div><strong>Entrega:</strong> {{ formatDate(r.endDate) }}</div>
              </div>
              <div class="row">
                <div><strong>Oficina Recogida:</strong> {{ r.pickupLocation?.name || getOfficeName(r.pickupLocation?.id) }}</div>
                <div><strong>Oficina Entrega:</strong> {{ r.dropoffLocation?.name || getOfficeName(r.dropoffLocation?.id) }}</div>
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
import { getOfficeName } from '../data/locations'
import carsService from '../services/carsService'
import apiClient from '../services/apiClient'
import { API_ENDPOINTS } from '../constants/app'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const reservationsStore = useReservationsStore()
const { user, isAdmin } = useAuth()
const notification = useNotification()

const loading = ref(false)
const reservations = ref([])
const carsMap = ref({})
// report state
const reportType = ref('reservations')
const fromDate = ref('')
const toDate = ref('')

function getAutoName(autoId) {
  return carsMap.value[autoId] || autoId
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
  if (isAdmin.value) {
    // admin: fetch all rentals
    try {
      const res = await apiClient.get(API_ENDPOINTS.RESERVATIONS.GET_ALL)
      if (res && res.success && Array.isArray(res.data)) {
        reservations.value = res.data
      } else {
        reservations.value = []
      }
    } catch (e) {
      reservations.value = []
    }
  } else {
    const res = await reservationsStore.fetchReservationsForUser(uid)
    if (res && res.success) {
      reservations.value = Array.isArray(res.data) ? res.data : reservationsStore.reservations
    } else {
      reservations.value = []
    }
  }
  // load cars to map their names
  try {
    const carsRes = await carsService.getCars()
    if (carsRes && carsRes.success && Array.isArray(carsRes.data)) {
      const m = {}
      for (const c of carsRes.data) {
        m[c.id] = `${c.brand} ${c.model}`
      }
      carsMap.value = m
    }
  } catch (e) {
    // ignore
  }
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
  if (!confirm('¿Confirmas que deseas cancelar esta reserva?')) return
  const res = await reservationsStore.cancelReservation(id)
  if (res.success) {
    notification.success('Reserva cancelada')
    await load()
  } else {
    notification.error(res.error || 'No se pudo cancelar')
  }
}

onMounted(load)

function generateReport() {
  // Build a simple report in-memory; for now we just prepare filtered reservations
  const from = fromDate.value ? new Date(fromDate.value) : null
  const to = toDate.value ? new Date(toDate.value) : null
  const filtered = reservations.value.filter(r => {
    const sd = new Date(r.startDate)
    if (from && sd < from) return false
    if (to && sd > to) return false
    return true
  })

  // sanitize reservations (remove user PII)
  function sanitizeReservation(r) {
    return {
      id: r.id,
      carId: r.car?.id,
      carName: carsMap.value[r.car?.id] || (r.car?.brand ? `${r.car.brand} ${r.car.model}` : ''),
      startDate: r.startDate,
      endDate: r.endDate,
      status: r.status,
      totalPrice: r.totalPrice || r.total || 0,
      pickupLocation: r.pickupLocation?.name || r.pickupLocation?.id || '',
      dropoffLocation: r.dropoffLocation?.name || r.dropoffLocation?.id || ''
    }
  }

  // If admin and reportType != 'reservations', prefer server-side stats
  if (isAdmin.value && reportType.value !== 'reservations') {
    const params = new URLSearchParams()
    params.set('type', reportType.value)
    if (fromDate.value) params.set('from', fromDate.value)
    if (toDate.value) params.set('to', toDate.value)
    apiClient.get(`${API_ENDPOINTS.ADMIN.STATS}?${params.toString()}`)
      .then(res => {
        if (res && res.success) {
          // backend returns sanitized stats and items
          reportData.value = { type: reportType.value, items: res.items || [], summary: res.stats }
          notification.success('Reporte generado por servidor')
        } else {
          notification.error(res.error || 'No se pudo generar reporte en servidor')
        }
      })
      .catch(() => notification.error('Error generando reporte en servidor'))
    return
  }

  // Local generation (user-level or fallback)
  if (reportType.value === 'reservations') {
    const items = filtered.map(sanitizeReservation)
    reportData.value = { type: 'reservations', items }
    notification.success('Reporte de reservas generado (' + items.length + ')')
    return
  }
}

const reportData = ref({ type: 'reservations', items: [] })

function exportReport() {
  // Create printable HTML and open in new window, then call print()
  const type = reportData.value.type || 'reservations'
  let html = `<html><head><title>Reporte</title><meta charset="utf-8"/><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ccc;text-align:left}</style></head><body>`
  if (type === 'reservations') {
    html += `<h1>Reporte de Reservas</h1>`
    html += `<p>Periodo: ${fromDate.value || '-'} → ${toDate.value || '-'}</p>`
    html += '<table><thead><tr><th>ID</th><th>Auto</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Precio</th></tr></thead><tbody>'
    const d = reportData.value.items.length ? reportData.value.items : []
    for (const r of d) {
      const carName = r.carName || carsMap.value[r.carId] || ''
      html += `<tr><td>${r.id}</td><td>${carName}</td><td>${formatDate(r.startDate)}</td><td>${formatDate(r.endDate)}</td><td>${r.status}</td><td>${r.totalPrice ?? ''}</td></tr>`
    }
    html += '</tbody></table>'
  } else if (type === 'revenue') {
    const total = reportData.value.summary?.total ?? reportData.value.items.reduce((acc,r)=>acc+(parseFloat(r.totalPrice||0)||0),0)
    html += `<h1>Reporte de Ingresos</h1>`
    html += `<p>Periodo: ${fromDate.value || '-'} → ${toDate.value || '-'}</p>`
    html += `<p><strong>Total:</strong> ${total.toFixed(2)}</p>`
    html += '<table><thead><tr><th>ID</th><th>Auto</th><th>Inicio</th><th>Fin</th><th>Precio</th></tr></thead><tbody>'
    for (const r of reportData.value.items) {
      const carName = r.carName || carsMap.value[r.carId] || ''
      html += `<tr><td>${r.id}</td><td>${carName}</td><td>${formatDate(r.startDate)}</td><td>${formatDate(r.endDate)}</td><td>${r.totalPrice ?? ''}</td></tr>`
    }
    html += '</tbody></table>'
  } else if (type === 'top_cars') {
    html += `<h1>Autos más solicitados</h1>`
    html += `<p>Periodo: ${fromDate.value || '-'} → ${toDate.value || '-'}</p>`
    html += '<table><thead><tr><th>Auto</th><th>Reservas</th></tr></thead><tbody>'
    for (const it of reportData.value.items) {
      html += `<tr><td>${it.carName}</td><td>${it.count}</td></tr>`
    }
    html += '</tbody></table>'
  } else if (type === 'utilization') {
    html += `<h1>Utilización por Auto</h1>`
    html += `<p>Periodo: ${fromDate.value || '-'} → ${toDate.value || '-'}</p>`
    html += '<table><thead><tr><th>Auto</th><th>Días ocupados</th></tr></thead><tbody>'
    for (const it of reportData.value.items) {
      html += `<tr><td>${it.carName}</td><td>${it.occupiedDays}</td></tr>`
    }
    html += '</tbody></table>'
  }
  html += '</body></html>'

  // Use html2canvas + jsPDF for a professional PDF
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '1200px'
  container.innerHTML = html
  document.body.appendChild(container)

  html2canvas(container, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    const filename = `reporte-${reportData.value.type || 'report'}-${Date.now()}.pdf`
    pdf.save(filename)
    document.body.removeChild(container)
    notification.success('PDF descargado: ' + filename)
  }).catch((err) => {
    document.body.removeChild(container)
    notification.error('Error al generar PDF: ' + (err?.message || ''))
  })
}
</script>

<style scoped>
.user-reservations { padding: 1.5rem; max-width: 900px; margin: 0 auto; }
.reservation-card { background: var(--box-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border:1px solid rgba(255,255,255,0.06);} 
.row { display:flex; flex-wrap:wrap; justify-content:space-between; gap:0.75rem; margin-bottom:0.5rem; }
.row > div { min-width: 160px; flex: 1 1 45%; }
.actions { display:flex; justify-content:flex-end; }
.btn-cancel { background: var(--danger-color); color: var(--text-on-danger); border:none; padding:0.5rem 0.8rem; border-radius:6px; cursor:pointer }
.empty-state { text-align:center; color:var(--color-Tgrand); padding:2rem }

/* Reports panel */
.reports-panel { margin-bottom: 1rem; background: var(--box-bg); padding: 0.8rem; border-radius:8px; border:1px solid rgba(255,255,255,0.04) }
.reports-row { display:flex; gap:0.75rem; align-items:end; flex-wrap:wrap }
.report-field { display:flex; flex-direction:column; gap:0.25rem; min-width:150px }
.report-actions { display:flex; gap:0.5rem }

/* Make selects/inputs readable in dark mode */
select, option, input[type="date"], input[type="text"], input[type="tel"] {
  background: var(--color-caja);
  color: var(--text-color);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 0.5rem;
  border-radius: 6px;
}

/* Ensure options render legibly in some browsers */
select option { background: var(--color-caja); color: var(--text-color); }

@media (max-width: 640px) {
  .user-reservations { padding: 1rem }
  .row > div { flex-basis: 100%; }
  .reports-row { flex-direction: column; align-items:stretch }
  .report-actions { justify-content: flex-start }
}
</style>
