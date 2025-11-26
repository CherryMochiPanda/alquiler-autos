<template>
  <section class="account-wrapper">
    <div v-if="isAuthenticated" class="profile-box">
      <h2>{{ $t('account.title') }}</h2>
      <p><strong>{{ $t('account.labels.name') }}:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>{{ $t('account.labels.email') }}:</strong> {{ user.email }}</p>
      <p><strong>{{ $t('account.labels.role') }}:</strong> {{ isAdmin ? $t('account.role.adminDemo') : $t('account.role.user') }}</p>
      <div class="profile-actions">
        <button @click="handleLogout" :disabled="isLoading">{{ $t('account.logout') }}</button>
        <button @click="toggleAdmin" :disabled="isLoading">{{ isAdmin ? $t('account.admin.remove') : $t('account.admin.add') }}</button>
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

        <button type="submit" :disabled="isLoading || form.isSubmitting">
          {{ isLoading ? $t('common.loading') : $t('account.login') }}
        </button>

        <p class="hint">{{ $t('account.hint') }}</p>
      </form>

      <!-- Signup Tab -->
      <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="auth-form">
        <div class="form-row">
          <label>{{ $t('account.labels.name') }}</label>
          <input
            v-model="form.values.firstName"
            type="text"
            placeholder="Nombre"
            @blur="form.markTouched('firstName')"
            :class="form.getFieldClass('firstName')"
          />
          <span v-if="form.getFieldError('firstName')" class="error-text">
            {{ form.getFieldError('firstName') }}
          </span>
        </div>

        <div class="form-row">
          <label>{{ $t('account.labels.name') }}</label>
          <input
            v-model="form.values.lastName"
            type="text"
            placeholder="Apellido"
            @blur="form.markTouched('lastName')"
            :class="form.getFieldClass('lastName')"
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
            v-model="form.values.phone"
            type="tel"
            placeholder="Teléfono"
            @blur="form.markTouched('phone')"
            :class="form.getFieldClass('phone')"
          />
          <span v-if="form.getFieldError('phone')" class="error-text">
            {{ form.getFieldError('phone') }}
          </span>
        </div>

        <div class="form-row">
          <label>DNI</label>
          <input
            v-model="form.values.dni"
            type="text"
            placeholder="DNI"
            @blur="form.markTouched('dni')"
            :class="form.getFieldClass('dni')"
          />
          <span v-if="form.getFieldError('dni')" class="error-text">
            {{ form.getFieldError('dni') }}
          </span>
        </div>

        <button type="submit" :disabled="isLoading || form.isSubmitting">
          {{ isLoading ? $t('common.loading') : $t('account.signup') }}
        </button>

        <p class="hint">{{ $t('account.hint') }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth, useForm, useNotification } from '../composables'
import { useAdminStore } from '../stores'

const router = useRouter()
const { t } = useI18n()
const { user, isAuthenticated, isAdmin, isLoading, login, logout, signup } = useAuth()
const notification = useNotification()
const adminStore = useAdminStore()

const activeTab = ref('login')

// Formulario de login
const loginForm = useForm(
  { email: '', password: '' },
  async (values) => {
    const result = await login(values.email, values.password)
    if (result.success) {
      form.resetForm()
      router.push('/account')
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
    phone: '',
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

async function handleLogin() {
  if (!loginForm.validateAll()) {
    return
  }
  await loginForm.handleSubmit()
}

async function handleSignup() {
  if (!signupForm.validateAll()) {
    return
  }
  await signupForm.handleSubmit()
}

async function handleLogout() {
  const result = await logout()
  if (result.success) {
    router.push('/')
  }
}

async function toggleAdmin() {
  if (!user.value?.id) return

  const newIsAdmin = !isAdmin.value
  const result = await adminStore.updateUserRole(user.value.id, newIsAdmin)

  if (result.success) {
    // Actualizar user local
    user.value.isAdmin = newIsAdmin
  }
}
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
  color: var(--text-color-bold);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-actions button:hover:not(:disabled) {
  background-color: #00c0ff;
}

.profile-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
  border-color: #ff4d4d;
}

.form-row input.is-valid {
  border-color: #4ade80;
}

.error-text {
  font-size: 0.8rem;
  color: #ff4d4d;
  margin-top: 0.25rem;
}

.auth-form button[type='submit'] {
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background-color: var(--accent-color);
  color: var(--text-color-bold);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.auth-form button[type='submit']:hover:not(:disabled) {
  background-color: #00c0ff;
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