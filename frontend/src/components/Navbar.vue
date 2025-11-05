<template>
  <nav class="navbar" aria-label="Navegación principal">
    <div class="nav-content">
      <h1>{{ $t('appName') }}</h1>

      <button
        class="hamburguesa"
        @click="menuAbierto = !menuAbierto"
        :aria-expanded="menuAbierto"
        aria-controls="nav-list"
        :aria-label="menuAbierto ? $t('navbar.closeMenu') : $t('navbar.openMenu')"
      >
        ☰
      </button>

      <ul id="nav-list" :class="{ abierto: menuAbierto }">
        <li><router-link to="/" @click="menuAbierto = false">{{ $t('nav.home') }}</router-link></li>
        <li><router-link to="/catalogo" @click="menuAbierto = false">{{ $t('nav.catalog') }}</router-link></li>
        <li><router-link to="/account" @click="menuAbierto = false">{{ $t('nav.account') }}</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" @click="menuAbierto = false">{{ $t('nav.admin') }}</router-link></li>
      </ul>

      <select v-model="locale" class="lang-select" :aria-label="$t('navbar.langSelectLabel')">
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>

      <button
        @click="toggleDark"
        class="modo-btn"
        :aria-pressed="isDark"
        :aria-label="isDark ? $t('navbar.toggleDarkOff') : $t('navbar.toggleDarkOn')"
      >
        🌓
      </button>

    </div>
  </nav>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const menuAbierto = ref(false)
const isDark = ref(false)
const route = useRoute()
const { locale } = useI18n()
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

function applyTheme(dark) {
  isDark.value = !!dark
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleDark = () => {
  applyTheme(!isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function onKeydown(e) {
  if (e.key === 'Escape') menuAbierto.value = false
}

onMounted(() => {
  // init theme from localStorage or prefers-color-scheme
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') applyTheme(true)
  else if (saved === 'light') applyTheme(false)
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true)

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// cerrar menú al navegar
watch(() => route.fullPath, () => {
  menuAbierto.value = false
  // update admin flag when route changes (login/logout may have updated localStorage)
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})

// expose locale to template
const localeRef = locale

// allow v-model on select to change locale
function setLocale(val) {
  localeRef.value = val
  localStorage.setItem('locale', val)
}

// init locale from localStorage
onMounted(() => {
  const savedLoc = localStorage.getItem('locale')
  if (savedLoc) localeRef.value = savedLoc
})
</script>

<style scoped>
.navbar {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: var(--nav-bg);
  border-bottom: 1px solid var(--divider-color);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--accent-color);
}

ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

ul li a:hover {
  color: var(--accent-color);
}

.modo-btn {
  background: none;
  border: none;
  border-radius: 30%;
  font-size: 1.2rem;
  color: var(--accent-color);
  cursor: pointer;
  box-shadow: var(--neon-shadow);
}

.lang-select {
  background: transparent;
  color: var(--accent-color);
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  margin-right: 0.5rem;
}

/* Hamburguesa solo visible en móvil */
.hamburguesa {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--accent-color);
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .hamburguesa {
    display: block;
  }

  ul {
    display: none;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }

  ul.abierto {
    display: flex;
  }

  ul li {
    padding: 0.5rem 0;
  }
}
</style>
