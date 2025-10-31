<template>
  <nav class="navbar">
    <div class="nav-content">
      <h1>AutoRent</h1>

      <button class="hamburguesa" @click="menuAbierto = !menuAbierto">☰</button>

      <ul :class="{ abierto: menuAbierto }">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/catalogo">Catálogo</router-link></li>
        <li><router-link to="/reservar">Reservar</router-link></li>
        <li><router-link to="/login">Iniciar sesión</router-link></li>
        <li><router-link to="/signup">Crear cuenta</router-link></li>
      </ul>

      <button @click="toggleDark" class="modo-btn">
        🌓
      </button>

    </div>
  </nav>
</template>


<script setup>
import { ref } from 'vue'

const menuAbierto = ref(false)

const toggleDark = () => {
  document.documentElement.classList.toggle('dark')
}
</script>

<style scoped>
.navbar {
  width: 100vw;
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
