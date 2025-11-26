<template>
  <section class="admin-wrapper">
    <!-- Sin autorización -->
    <div v-if="!isAdmin" class="not-auth">
      <div class="not-auth-box">
        <h2>{{ $t('admin.notAuthorized.title') }}</h2>
        <p>{{ $t('admin.notAuthorized.message') }}</p>
        <button @click="goHome" class="btn-primary">{{ $t('admin.backHome') }}</button>
      </div>
    </div>

    <!-- Panel de administración -->
    <div v-else class="admin-panel">
      <!-- Header con acciones -->
      <div class="admin-header">
        <div class="header-title">
          <h2>{{ $t('admin.panelTitle') }}</h2>
          <p class="subtitle">Gestión de sistema</p>
        </div>
        <div class="admin-actions">
          <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }" class="tab-btn">
            <span>{{ $t('admin.users.title') }}</span>
            <span class="badge">{{ userCount }}</span>
          </button>
          <button @click="activeTab = 'cars'" :class="{ active: activeTab === 'cars' }" class="tab-btn">
            <span>{{ $t('admin.cars.title') }}</span>
            <span class="badge">{{ cars.length }}</span>
          </button>
          <button @click="refreshData" class="btn-secondary">{{ $t('admin.refresh') }}</button>
        </div>
      </div>

      <!-- Sección de Usuarios -->
      <section v-if="activeTab === 'users'" class="admin-section users-section">
        <div class="section-header">
          <h3>{{ $t('admin.users.title') }}</h3>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar usuarios..."
            class="search-input"
          />
        </div>

        <div v-if="isLoading" class="loading">
          {{ $t('common.loading') }}...
        </div>

        <table v-else class="users-table">
          <thead>
            <tr>
              <th>{{ $t('admin.users.headers.name') }}</th>
              <th>{{ $t('admin.users.headers.email') }}</th>
              <th>{{ $t('admin.users.headers.role') }}</th>
              <th>{{ $t('admin.users.headers.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td class="name-cell">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="email-cell">{{ user.email }}</td>
              <td class="role-cell">
                <span v-if="user.isAdmin" class="role-badge admin">Admin</span>
                <span v-else class="role-badge user">{{ $t('account.role.user') }}</span>
              </td>
              <td class="actions-cell">
                <button
                  v-if="!user.isAdmin"
                  @click="toggleUserRole(user.id, true)"
                  class="btn-xs btn-primary"
                >
                  {{ $t('admin.users.actions.makeAdmin') }}
                </button>
                <button
                  v-else
                  @click="toggleUserRole(user.id, false)"
                  class="btn-xs btn-warning"
                >
                  {{ $t('admin.users.actions.revokeAdmin') }}
                </button>
                <button
                  @click="confirmDelete(user.id, user.email)"
                  class="btn-xs btn-danger"
                >
                  {{ $t('admin.users.actions.remove') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredUsers.length === 0" class="empty-state">
          {{ $t('common.noResults') }}
        </div>
      </section>

      <!-- Sección de Autos -->
      <section v-if="activeTab === 'cars'" class="admin-section cars-section">
        <div class="section-header">
          <h3>{{ $t('admin.cars.title') }}</h3>
          <button @click="showCarForm = true" class="btn-primary">
            {{ $t('admin.cars.actions.add') }}
          </button>
        </div>

        <!-- Formulario de Auto -->
        <div v-if="showCarForm" class="car-form-wrapper">
          <AdminCarForm
            :model="editingCar"
            @save="saveCar"
            @cancel="showCarForm = false"
          />
        </div>

        <div v-if="isLoadingCars" class="loading">
          {{ $t('common.loading') }}...
        </div>

        <!-- Grid de Autos -->
        <div v-else class="cars-grid">
          <div v-for="car in cars" :key="car.id" class="car-card">
            <div class="car-header">
              <h4>{{ car.nombre }}</h4>
              <span class="car-id">#{{ car.id.substring(0, 8) }}</span>
            </div>
            <p class="car-description">{{ car.descripcion }}</p>
            <div class="car-specs">
              <span class="spec">{{ car.motor }}</span>
              <span class="spec">{{ car.transmision }}</span>
              <span class="spec">{{ car.capacidad }} seats</span>
            </div>
            <div class="car-actions">
              <button @click="editCar(car)" class="btn-xs btn-primary">
                {{ $t('admin.cars.actions.edit') }}
              </button>
              <button @click="confirmDeleteCar(car.id, car.nombre)" class="btn-xs btn-danger">
                {{ $t('admin.cars.actions.remove') }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="cars.length === 0" class="empty-state">
          {{ $t('common.noResults') }}
        </div>
      </section>
    </div>

    <!-- Confirmación de eliminación -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('common.confirm') }}</h3>
        <p>{{ deleteConfirmMessage }}</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="btn-secondary">
            {{ $t('common.cancel') }}
          </button>
          <button @click="executeDelete" class="btn-danger">
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth, useNotification } from '../composables'
import { useAdminStore, useCarsStore } from '../stores'
import AdminCarForm from '../components/AdminCarForm.vue'

const router = useRouter()
const { t } = useI18n()
const { isAdmin } = useAuth()
const notification = useNotification()

const adminStore = useAdminStore()
const carsStore = useCarsStore()

// Estado
const activeTab = ref('users')
const searchQuery = ref('')
const showCarForm = ref(false)
const editingCar = ref(null)
const showDeleteConfirm = ref(false)
const deleteConfirmType = ref(null) // 'user' o 'car'
const deleteConfirmId = ref(null)
const deleteConfirmMessage = ref('')

const isLoading = computed(() => adminStore.isLoading)
const isLoadingCars = computed(() => carsStore.isLoading)
const users = computed(() => adminStore.users)
const cars = computed(() => carsStore.cars)
const userCount = computed(() => adminStore.userCount)

// Usuarios filtrados por búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.firstName?.toLowerCase().includes(q) ||
    u.lastName?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  )
})

// Cargar datos iniciales
onMounted(async () => {
  if (!isAdmin.value) return

  await adminStore.fetchUsers()
  await carsStore.fetchCars()
})

// Usuarios
async function toggleUserRole(userId, newIsAdmin) {
  const result = await adminStore.updateUserRole(userId, newIsAdmin)
  if (result.success) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.isAdmin = newIsAdmin
    }
  }
}

async function refreshData() {
  await adminStore.fetchUsers()
  await carsStore.fetchCars()
  notification.success(t('admin.refreshed'))
}

function confirmDelete(userId, email) {
  deleteConfirmType.value = 'user'
  deleteConfirmId.value = userId
  deleteConfirmMessage.value = `¿Está seguro de que desea eliminar al usuario ${email}?`
  showDeleteConfirm.value = true
}

async function executeDelete() {
  if (deleteConfirmType.value === 'user') {
    const result = await adminStore.deleteUser(deleteConfirmId.value)
    if (result.success) {
      users.value = users.value.filter(u => u.id !== deleteConfirmId.value)
    }
  } else if (deleteConfirmType.value === 'car') {
    const result = await carsStore.deleteCar(deleteConfirmId.value)
    if (result.success) {
      // Actualizar lista local
      await carsStore.fetchCars()
    }
  }
  showDeleteConfirm.value = false
}

// Autos
function editCar(car) {
  editingCar.value = { ...car }
  showCarForm.value = true
}

async function saveCar(car) {
  let result
  if (car.id?.startsWith('car-')) {
    // Nuevo auto
    result = await carsStore.createCar(car)
  } else {
    // Auto existente
    result = await carsStore.updateCar(car.id, car)
  }

  if (result.success) {
    showCarForm.value = false
    editingCar.value = null
    await carsStore.fetchCars()
  }
}

function confirmDeleteCar(carId, carName) {
  deleteConfirmType.value = 'car'
  deleteConfirmId.value = carId
  deleteConfirmMessage.value = `¿Está seguro de que desea eliminar el vehículo "${carName}"?`
  showDeleteConfirm.value = true
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.admin-wrapper {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  background: var(--color-wrapper);
}

/* No autorizado */
.not-auth {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.not-auth-box {
  background: var(--box-bg);
  padding: 3rem;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.not-auth-box h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.not-auth-box p {
  margin-bottom: 2rem;
  color: var(--color-Tgrand);
}

/* Panel principal */
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-title h2 {
  color: var(--accent-color);
  margin: 0;
  font-size: 2rem;
}

.header-title .subtitle {
  margin: 0.25rem 0 0 0;
  color: var(--color-Tgrand);
  font-size: 0.9rem;
}

.admin-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Tabs */
.tab-btn {
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.tab-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.tab-btn.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: #000;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.tab-btn.active .badge {
  background: rgba(0, 0, 0, 0.2);
}

/* Sección */
.admin-section {
  background: var(--box-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.3rem;
}

.search-input {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.1);
}

/* Tabla de Usuarios */
.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.users-table thead {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.users-table th {
  text-align: left;
  padding: 0.75rem;
  color: var(--color-Tgrand);
  font-weight: 600;
}

.users-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease;
}

.users-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.users-table td {
  padding: 0.75rem;
}

.name-cell {
  font-weight: 500;
}

.email-cell {
  color: var(--color-Tgrand);
}

.role-cell {
  text-align: center;
}

.role-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.admin {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.role-badge.user {
  background: rgba(76, 175, 80, 0.2);
  color: #4ade80;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Grid de Autos */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.car-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.car-card:hover {
  border-color: var(--accent-color);
  background: rgba(0, 192, 255, 0.05);
  transform: translateY(-2px);
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.75rem;
}

.car-header h4 {
  margin: 0;
  color: var(--accent-color);
  font-size: 1.1rem;
}

.car-id {
  font-size: 0.75rem;
  color: var(--color-Tgrand);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.car-description {
  color: var(--text-color);
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.car-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.car-specs .spec {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--color-Tgrand);
}

.car-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Formulario de Auto */
.car-form-wrapper {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 192, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Botones */
.btn-xs {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.btn-primary,
.btn-secondary,
.btn-warning,
.btn-danger {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--accent-color);
  color: #000;
}

.btn-primary:hover {
  background: #00c0ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 192, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--text-color);
}

.btn-warning {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.btn-warning:hover {
  background: rgba(255, 193, 7, 0.3);
}

.btn-danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.btn-danger:hover {
  background: rgba(244, 67, 54, 0.3);
  transform: translateY(-1px);
}

/* Loading y Empty */
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-Tgrand);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-Tgrand);
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--box-bg);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: var(--accent-color);
}

.modal-content p {
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-wrapper {
    padding: 1rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .cars-grid {
    grid-template-columns: 1fr;
  }

  .users-table {
    font-size: 0.85rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.5rem;
  }

  .search-input {
    width: 100%;
  }

  .modal-content {
    width: 90%;
    max-width: none;
  }
}
</style>