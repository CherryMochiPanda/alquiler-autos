<template>
  <section class="admin-wrapper">
    <div v-if="!isAdmin" class="not-auth">
      <h2>{{ $t('admin.notAuthorized.title') }}</h2>
      <p>{{ $t('admin.notAuthorized.message') }}</p>
      <button @click="goHome">{{ $t('admin.backHome') }}</button>
    </div>

    <div v-else class="admin-panel">
      <div class="admin-header">
        <h2>{{ $t('admin.panelTitle') }}</h2>
        <div class="admin-actions">
          <button class="btn-secondary" @click="refreshData">{{ $t('admin.refresh') }}</button>
          <button class="btn-primary" @click="exportUsers">{{ $t('admin.exportUsers') }}</button>
          <button class="btn-primary" @click="addNewCar">{{ $t('admin.cars.actions.add') }}</button>
        </div>
      </div>

      <section class="admin-section">
        <h3>{{ $t('admin.users.title') }}</h3>
        <table>
          <thead>
            <tr>
              <th>{{ $t('admin.users.headers.name') }}</th>
              <th>{{ $t('admin.users.headers.email') }}</th>
              <th>{{ $t('admin.users.headers.role') }}</th>
              <th>{{ $t('admin.users.headers.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.email">
              <td>{{ u.name || '-' }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span class="role-badge" v-if="u.isAdmin">Admin</span>
                <span v-else>User</span>
              </td>
              <td>
                <button class="btn-primary" v-if="!u.isAdmin" @click="makeAdmin(u)">{{ $t('admin.users.actions.makeAdmin') }}</button>
                <button class="btn-secondary" v-else @click="revokeAdmin(u)">{{ $t('admin.users.actions.revokeAdmin') }}</button>
                <button class="btn-danger" @click="removeUser(u)">{{ $t('admin.users.actions.remove') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="admin-section">
        <h3>{{ $t('admin.cars.title') }}</h3>

        <div v-if="editingCar" class="editor-block">
          <AdminCarForm :model="editingCar" @save="saveCar" @cancel="cancelEdit" />
        </div>

        <div class="cars-grid">
          <div v-for="a in localAutos" :key="a.id" class="car-box">
            <h4>{{ a.nombre }}</h4>
            <p>{{ a.descripcion }}</p>
            <small>{{ a.motor }} · {{ a.transmision }}</small>
            <div class="car-actions">
              <button class="btn-primary" @click="editCar(a)">{{ $t('admin.cars.actions.edit') }}</button>
              <button class="btn-danger" @click="removeCar(a)">{{ $t('admin.cars.actions.remove') }}</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { autos } from '../data/autos'
import { useI18n } from 'vue-i18n'
import { pushToast } from '../utils/toastStore'
import AdminCarForm from '../components/AdminCarForm.vue'

const router = useRouter()
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')
const users = ref(JSON.parse(localStorage.getItem('users') || '[]'))
// editable autos list saved in localStorage for admin actions (fallback to imported autos)
const localAutos = ref(JSON.parse(localStorage.getItem('autos') || 'null') || autos)
const { t } = useI18n()

const editingCar = ref(null)

function goHome() {
  router.push('/')
}

function makeAdmin(u) {
  // For demo: mark this user as admin and set global flag
  u.isAdmin = true
  localStorage.setItem('users', JSON.stringify(users.value))
  localStorage.setItem('isAdmin', 'true')
  isAdmin.value = true
  pushToast(t('admin.alertUserNowAdmin', { email: u.email }), 'success')
}

function removeUser(u) {
  const list = users.value.filter(x => x.email !== u.email)
  users.value = list
  localStorage.setItem('users', JSON.stringify(list))
}

function revokeAdmin(u) {
  u.isAdmin = false
  localStorage.setItem('users', JSON.stringify(users.value))
  // if revoking the currently active admin, clear global flag
  if (localStorage.getItem('isAdmin') === 'true' && u.email === localStorage.getItem('adminEmail')) {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminEmail')
    isAdmin.value = false
  }
  pushToast(t('admin.alertUserRevoked', { email: u.email }), 'info')
}

function removeCar(a) {
  const list = localAutos.value.filter(x => x.id !== a.id)
  localAutos.value = list
  localStorage.setItem('autos', JSON.stringify(list))
  pushToast(t('admin.cars.messages.removed', { name: a.nombre }), 'success')
}

function addNewCar() {
  editingCar.value = null // pass null to form -> it will be an add
  // show blank object instead of null so form can read properties
  editingCar.value = { nombre: '', carpeta: '', imagenes: [], descripcion: '', motor: '', transmision: '', capacidad: 5, extras: '', destacado: false, cover: '' }
}

function editCar(a) {
  editingCar.value = { ...a }
}

function saveCar(car) {
  const idx = localAutos.value.findIndex(x => x.id === car.id)
  if (idx >= 0) {
    localAutos.value.splice(idx, 1, car)
  } else {
    localAutos.value.unshift(car)
  }
  localStorage.setItem('autos', JSON.stringify(localAutos.value))
  pushToast(t('admin.cars.messages.saved', { name: car.nombre }), 'success')
  editingCar.value = null
}

function cancelEdit() {
  editingCar.value = null
}

function exportUsers() {
  try {
    const text = JSON.stringify(users.value, null, 2)
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
      pushToast(t('admin.exportSuccess'), 'success')
    } else {
      // fallback: prompt
      window.prompt(t('admin.exportPrompt'), text)
    }
  } catch (e) {
    pushToast(t('admin.exportFail'), 'error')
  }
}

function refreshData() {
  users.value = JSON.parse(localStorage.getItem('users') || '[]')
  localAutos.value = JSON.parse(localStorage.getItem('autos') || 'null') || autos
  pushToast(t('admin.refreshed'), 'info')
}

onMounted(() => {
  // ensure adminEmail is set when makeAdmin used
  if (localStorage.getItem('isAdmin') === 'true' && !localStorage.getItem('adminEmail')) {
    const admin = users.value.find(u => u.isAdmin)
    if (admin) localStorage.setItem('adminEmail', admin.email)
  }
})
</script>

<style scoped>
.admin-wrapper { padding: 2rem; }
.admin-panel { max-width: 1000px; margin: 0 auto; }
.admin-section { background: var(--box-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
.cars-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.car-box { width: 240px; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; }
table { width: 100%; border-collapse: collapse; }
thead th { text-align: left; }
tbody td { padding: 0.5rem 0; }
</style>
