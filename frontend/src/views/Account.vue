<template>
  <section class="account-wrapper">
    <div v-if="user" class="profile-box">
      <h2>{{ $t('account.title') }}</h2>
      <p><strong>{{ $t('account.labels.name') }}:</strong> {{ user.name || '-' }}</p>
      <p><strong>{{ $t('account.labels.email') }}:</strong> {{ user.email }}</p>
      <p><strong>{{ $t('account.labels.role') }}:</strong> {{ isAdmin ? $t('account.role.adminDemo') : $t('account.role.user') }}</p>
      <div class="profile-actions">
        <button @click="logout">{{ $t('account.logout') }}</button>
        <button @click="toggleAdmin">{{ isAdmin ? $t('account.admin.remove') : $t('account.admin.add') }}</button>
      </div>
    </div>

    <div v-else class="auth-box">
      <h2>{{ $t('account.demoTitle') }}</h2>

      <div class="form-row">
        <input v-model="name" :placeholder="$t('account.placeholders.name')" />
      </div>
      <div class="form-row">
        <input v-model="email" :placeholder="$t('account.placeholders.email')" />
      </div>
      <div class="form-row">
        <input v-model="password" type="password" :placeholder="$t('account.placeholders.password')" />
      </div>

      <div class="form-actions">
        <button @click="login">{{ $t('account.login') }}</button>
        <button @click="signup">{{ $t('account.signup') }}</button>
      </div>

      <p class="hint">{{ $t('account.hint') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { pushToast } from '../utils/toastStore'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')

function persistUser(u) {
  localStorage.setItem('user', JSON.stringify(u))
  // keep a users list for admin demo
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const exists = users.find(x => x.email === u.email)
  if (!exists) {
    users.push(u)
    localStorage.setItem('users', JSON.stringify(users))
  }
}

function login() {
  if (!email.value) return pushToast(t('account.errors.emailRequired'), 'error')
  const u = { name: name.value || '', email: email.value }
  persistUser(u)
  const adminFlag = email.value.includes('admin')
  localStorage.setItem('isAdmin', adminFlag ? 'true' : 'false')
  isAdmin.value = adminFlag
  user.value = u
  // refresh view
  router.push('/account')
}

function signup() {
  if (!email.value) return pushToast(t('account.errors.emailRequired'), 'error')
  const u = { name: name.value || '', email: email.value }
  persistUser(u)
  const adminFlag = email.value.includes('admin')
  localStorage.setItem('isAdmin', adminFlag ? 'true' : 'false')
  isAdmin.value = adminFlag
  user.value = u
  router.push('/account')
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('isAdmin')
  user.value = null
  isAdmin.value = false
  router.push('/')
}

function toggleAdmin() {
  const newVal = !isAdmin.value
  localStorage.setItem('isAdmin', newVal ? 'true' : 'false')
  isAdmin.value = newVal
}
</script>

<style scoped>
.account-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
}
.profile-box, .auth-box {
  width: 100%;
  max-width: 480px;
  background: var(--box-bg);
  color: var(--text-color);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--neon-shadow);
}
.form-row {
  margin-bottom: 0.75rem;
}
.form-row input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.03);
  color: var(--text-color);
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.form-actions button, .profile-actions button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: var(--accent-color);
  color: #000;
}
.hint { margin-top: 1rem; color: var(--color-Tgrand); font-size: 0.9rem; }
</style>
