<template>
  <section class="account-wrapper">
    <div v-if="isAuthenticated" class="profile-box">
      <h2>{{ t('account.title') }}</h2>
      <p><strong>{{ t('account.labels.name') }}:</strong> {{ user?.firstName }} {{ user?.lastName }}</p>
      <p><strong>{{ t('account.labels.email') }}:</strong> {{ user?.email }}</p>
      <p><strong>{{ t('account.labels.role') }}:</strong> {{ isAdmin ? t('account.role.adminDemo') : t('account.role.user') }}</p>
      <p><strong>{{ t('account.labels.phone') }}:</strong> {{ user?.phone || user?.phoneNumber || phone }}</p>

      <!-- Edit Phone Section -->
      <div class="edit-phone form-row">
        <label>{{ $t('account.labels.phone') }}</label>
        <div class="phone-row">
          <input class="input" v-model="phone" type="tel" :disabled="!editingPhone" placeholder="+53 00000000" @input="onAccountPhoneInput" />
          <div class="form-actions">
            <button v-if="editingPhone" class="btn-primary" @click="savePhone" :disabled="phoneSaving">
              {{ phoneSaving ? 'Guardando...' : $t('account.savePhone') }}
            </button>
            <button v-if="editingPhone" class="btn-secondary" @click="cancelEdit" :disabled="phoneSaving">{{ $t('account.cancelEdit') }}</button>
            <button v-else class="btn-secondary" @click="startEditPhone">{{ $t('account.editPhone') }}</button>
          </div>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="change-password form-row">
        <label>{{ $t('account.changePassword') }}</label>

        <div v-if="!showPasswordReset" class="pw-action">
          <button class="btn-secondary" @click="showPasswordReset = true">Restablecer contraseña</button>
        </div>

        <div v-else class="pw-grid">
          <input class="input" v-model="password" type="password" :placeholder="$t('account.placeholders.password')" />
          <input class="input" v-model="confirmPassword" type="password" :placeholder="$t('signup.placeholders.confirmPassword')" />
          <div class="form-actions">
            <button class="btn-primary" @click="updatePassword" :disabled="passwordSaving">
              {{ passwordSaving ? 'Guardando...' : $t('account.savePassword') }}
            </button>
            <button class="btn-secondary" @click="cancelPasswordReset" :disabled="passwordSaving">{{ $t('account.cancelEdit') }}</button>
          </div>
        </div>
      </div>

      <!-- Reservations Dashboard -->
      <div class="reservations-dashboard">
        <h3>{{ $t('account.myReservations') }}</h3>
        <UserReservations />
      </div>

      <div class="profile-actions">
        <button type="button" @click="handleLogout" :disabled="isLoading">{{ $t('account.logout') }}</button>
      </div>
    </div>

    <div v-else class="auth-box">
      <div class="auth-tabs">
        <button 
          v-for="tab in ['login', 'signup']"
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ $t(`account.${tab}`) }}
        </button>
      </div>

      <!-- Login Tab -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-row">
          <label>{{ $t('account.labels.email') }}</label>
          <input
            v-model="form.values.email"
            type="email"
            :placeholder="$t('account.placeholders.email')"
            @blur="form.markTouched('email')"
            :class="form.getFieldClass('email')"
          />
          <span v-if="form.getFieldError('email')" class="error-text">
            {{ form.getFieldError('email') }}
          </span>
        </div>

        <div class="form-row">
          <label>{{ $t('account.placeholders.password') }}</label>
          <input
            v-model="form.values.password"
            type="password"
            :placeholder="$t('account.placeholders.password')"
            @blur="form.markTouched('password')"
            :class="form.getFieldClass('password')"
          />
          <span v-if="form.getFieldError('password')" class="error-text">
            {{ form.getFieldError('password') }}
          </span>
        </div>

        <button type="submit">
          {{ isLoading ? $t('common.loading') : $t('account.login') }}
        </button>

        <p class="hint">{{ $t('account.hint') }}</p>
      </form>

      <!-- Signup Tab -->
      <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="auth-form">
        <div class="form-row">
          <label>{{ $t('account.labels.name') }}</label>
          <input
            v-model="signupForm.values.firstName"
            type="text"
            placeholder="Nombre"
            @blur="signupForm.markTouched('firstName')"
            @input="onFirstNameInput"
            :class="signupForm.getFieldClass('firstName')"
          />
          <span v-if="form.getFieldError('firstName')" class="error-text">
            {{ form.getFieldError('firstName') }}
          </span>
        </div>

        <div class="form-row">
          <label>{{ $t('account.labels.name') }}</label>
          <input
            v-model="signupForm.values.lastName"
            type="text"
            placeholder="Apellido"
            @blur="signupForm.markTouched('lastName')"
            @input="onLastNameInput"
            :class="signupForm.getFieldClass('lastName')"
          />
          <span v-if="form.getFieldError('lastName')" class="error-text">
            {{ form.getFieldError('lastName') }}
          </span>
        </div>

        <div class="form-row">
          <label>{{ $t('account.labels.email') }}</label>
          <input
            v-model="form.values.email"
            type="email"
            :placeholder="$t('account.placeholders.email')"
            @blur="form.markTouched('email')"
            :class="form.getFieldClass('email')"
          />
          <span v-if="form.getFieldError('email')" class="error-text">
            {{ form.getFieldError('email') }}
          </span>
        </div>

        <div class="form-row">
          <label>{{ $t('account.placeholders.password') }}</label>
          <input
            v-model="form.values.password"
            type="password"
            :placeholder="$t('account.placeholders.password')"
            @blur="form.markTouched('password')"
            :class="form.getFieldClass('password')"
          />
          <span v-if="form.getFieldError('password')" class="error-text">
            {{ form.getFieldError('password') }}
          </span>
        </div>

        <div class="form-row">
          <label>Teléfono</label>
          <input
            v-model="signupForm.values.phone"
            type="tel"
            placeholder="Teléfono (ej. +53 59368215)"
            @blur="signupForm.markTouched('phone')"
            @input="onPhoneInput"
            :class="signupForm.getFieldClass('phone')"
          />
          <span v-if="form.getFieldError('phone')" class="error-text">
            {{ form.getFieldError('phone') }}
          </span>
        </div>

        <div class="form-row">
          <label>DNI</label>
          <input
            v-model="signupForm.values.dni"
            type="text"
            placeholder="DNI"
            maxlength="11"
            @blur="signupForm.markTouched('dni')"
            @input="onDniInput"
            :class="signupForm.getFieldClass('dni')"
          />
          <span v-if="form.getFieldError('dni')" class="error-text">
            {{ form.getFieldError('dni') }}
          </span>
        </div>

        <button type="submit">
          {{ isLoading ? $t('common.loading') : $t('account.signup') }}
        </button>

        <p class="hint">{{ $t('account.hint') }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth, useForm, useNotification } from '../composables'
import UserReservations from './UserReservations.vue'

const router = useRouter()
const { t } = useI18n()
const { user, isAuthenticated, isAdmin, isLoading, login, logout, signup, updateProfile, changePassword } = useAuth()
const notification = useNotification()
// adminStore not required in this view

const activeTab = ref('login')
const phone = ref(user.value?.phone || '')
// small phone form validator
const phoneForm = useForm({ phone: phone.value })
const editingPhone = ref(false)
const phoneSaving = ref(false)
const password = ref('')
const confirmPassword = ref('')
const passwordSaving = ref(false)
const showPasswordReset = ref(false)

// Formulario de login
const loginForm = useForm(
  { email: '', password: '' },
  async (values) => {
    const result = await login(values.email, values.password)
    if (result.success) {
      loginForm.resetForm()
      // Si existe un borrador de reserva, redirigir a /reservar para restaurarlo
      const draft = sessionStorage.getItem('reservationDraft')
      if (draft) {
        router.push('/reservar')
      } else {
        router.push('/account')
      }
    }
  }
)

// Formulario de signup
const signupForm = useForm(
  {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '+53 ',
    dni: ''
  },
  async (values) => {
    const result = await signup(values)
    if (result.success) {
      signupForm.resetForm()
      activeTab.value = 'login'
    }
  }
)

// Seleccionar form según tab activo
const form = computed(() => activeTab.value === 'login' ? loginForm : signupForm)

// Sanitizadores y manejadores de input específicos para signup
function sanitizeNameInput(value) {
  // Eliminar números, permitir letras Unicode y espacios
  const cleaned = String(value).replace(/[0-9]/g, '')
  return cleaned
}

function onFirstNameInput(e) {
  const v = sanitizeNameInput(e.target.value)
  signupForm.setFieldValue('firstName', v)
}

function onLastNameInput(e) {
  const v = sanitizeNameInput(e.target.value)
  signupForm.setFieldValue('lastName', v)
}

function onPhoneInput(e) {
  // Mantener prefijo +53 y permitir hasta 8 dígitos después
  let v = String(e.target.value)
  // If user removes prefix, restore it
  if (!v.startsWith('+53')) {
    // allow user to type numbers but always keep prefix
    v = '+53 ' + v.replace(/[^0-9]/g, '')
  }
  // Remove any non-digits after prefix
  const parts = v.split(/\s+/)
  const rest = (parts[1] || '').replace(/[^0-9]/g, '').slice(0, 8)
  const final = '+53 ' + rest
  signupForm.setFieldValue('phone', final)
}

function onAccountPhoneInput(e) {
  // Similar sanitizer but writes to the account `phone` ref
  let v = String(e.target.value)
  if (!v.startsWith('+53')) {
    v = '+53 ' + v.replace(/[^0-9]/g, '')
  }
  const parts = v.split(/\s+/)
  const rest = (parts[1] || '').replace(/[^0-9]/g, '').slice(0, 8)
  phone.value = '+53 ' + rest
}

function onDniInput(e) {
  let v = String(e.target.value).replace(/[^0-9]/g, '').slice(0, 11)
  signupForm.setFieldValue('dni', v)
}

async function handleLogin() {
  if (!loginForm.validateAll()) {
    notification.error(t('account.errors.formInvalid') || 'Por favor completa correctamente el formulario')
    return
  }

  try {
    const result = await loginForm.handleSubmit()
    if (result && !result.success) {
      notification.error(result.error || 'Error al iniciar sesión')
    }
  } catch (e) {
    notification.error('Error al iniciar sesión')
  }
}

async function handleSignup() {
  if (!signupForm.validateAll()) {
    notification.error(t('account.errors.formInvalid') || 'Por favor completa correctamente el formulario')
    return
  }

  try {
    const result = await signupForm.handleSubmit()
    if (result && !result.success) {
      notification.error(result.error || 'Error al registrarse')
    }
  } catch (e) {
    notification.error('Error al registrarse')
  }
}

async function handleLogout() {
  const result = await logout()
  if (result.success) {
    router.push('/')
  }
}

function viewReservations() {
  router.push('/account/reservas')
}

function savePhone() {
//validar telefono
  phoneForm.setFieldValue('phone', phone.value)
  if (!phoneForm.validateField('phone', phone.value)) {
    notification.error(phoneForm.getFieldError('phone') || t('reserva.errors.phone'))
    return
  }

  phoneSaving.value = true
  updateProfile({ phoneNumber: phone.value })
    .then((res) => {
      if (res && res.success) {
        notification.success(t('account.savePhone'))
        editingPhone.value = false
      } else {
        notification.error(res?.error || 'Error al guardar teléfono')
      }
    })
    .catch(() => notification.error('Error al guardar teléfono'))
    .finally(() => {
      phoneSaving.value = false
    })
}

function cancelEdit() {
  phone.value = user.value?.phone || user.value?.phoneNumber || ''
  editingPhone.value = false
}

function startEditPhone() {
  // preload current phone from user into the input before enabling edit
  phone.value = user.value?.phone || user.value?.phoneNumber || ''
  editingPhone.value = true
}

// Keep phone in sync with user data when not editing
watch(user, (u) => {
  if (!editingPhone.value) {
    phone.value = u?.phone || u?.phoneNumber || ''
  }
})

function cancelPasswordReset() {
  password.value = ''
  confirmPassword.value = ''
  showPasswordReset.value = false
  passwordSaving.value = false
}

function updatePassword() {
  if (password.value !== confirmPassword.value) {
    notification.error(t('account.errors.passwordMismatch'))
    return
  }
  if (!password.value || password.value.length < 8) {
    notification.error(t('account.errors.passInvalid') || 'Contraseña inválida')
    return
  }

  passwordSaving.value = true
  changePassword(password.value)
    .then((res) => {
      if (res && res.success) {
        notification.success(t('account.success.passwordChanged'))
        password.value = ''
        confirmPassword.value = ''
        showPasswordReset.value = false
      } else {
        notification.error(res?.error || 'Error al actualizar contraseña')
      }
    })
    .catch(() => notification.error('Error al actualizar contraseña'))
    .finally(() => {
      passwordSaving.value = false
    })
}
// toggleAdmin removed: admin role must be managed from Admin panel
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.account-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background: var(--color-wrapper);
  min-height: calc(100vh - 80px);
}

.profile-box,
.auth-box {
  width: 100%;
  max-width: 480px;
  background: var(--box-bg);
  color: var(--text-color);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px var(--color-sombra);
  animation: fadeIn 0.6s ease;
}

.profile-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--accent-color);
}

.profile-box p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.profile-actions button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background-color: var(--accent-color);
  color: var(--text-on-accent);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-actions button:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.profile-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Edit Phone Section */
.edit-phone {
  margin: 1rem 0;
}

.edit-phone .phone-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pw-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-phone .input, .change-password .input, .input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: var(--color-caja);
  color: var(--text-color);
}

.form-actions { display:flex; gap:0.5rem; }
.btn-primary { background-color: var(--accent-color); color: var(--text-on-accent); border:none; padding:0.6rem 1rem; border-radius:8px; cursor:pointer }
.btn-secondary { background:transparent; border:2px solid var(--accent-color); color:var(--accent-color); padding:0.5rem .9rem; border-radius:8px; cursor:pointer }

/* Auth Tabs */
.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
}

.tab-button:hover:not(.active) {
  color: var(--accent-color);
  opacity: 0.7;
}

/* Auth Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--accent-color);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-row input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: var(--color-caja);
  color: var(--text-color);
  transition: all 0.3s ease;
  font-size: 1rem;
}

.form-row input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 8px rgba(0, 192, 255, 0.2);
}

.form-row input.has-error {
  border-color: var(--danger-color);
}

.form-row input.is-valid {
  border-color: var(--success-color);
}

.error-text {
  font-size: 0.8rem;
  color: var(--danger-color);
  margin-top: 0.25rem;
}

.auth-form button[type='submit'] {
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background-color: var(--accent-color);
  color: var(--text-on-accent);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.auth-form button[type='submit']:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.auth-form button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  margin-top: 1rem;
  color: var(--color-Tgrand);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 640px) {
  .account-wrapper {
    padding: 1rem;
  }

  .profile-box,
  .auth-box {
    max-width: 100%;
    padding: 1.5rem;
  }

  .profile-actions,
  .auth-tabs {
    flex-direction: column;
  }

  .profile-actions button {
    width: 100%;
  }
}
</style>