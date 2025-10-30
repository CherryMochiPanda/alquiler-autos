<template>
  <nav class="navbar">
    <h1>AutoRent</h1>
    <button class="hamburger" @click="menuOpen = !menuOpen">☰</button>
    <ul :class="{ open: menuOpen }">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/catalogo">Catálogo</router-link></li>
      <li><router-link to="/reserva">Reservar</router-link></li>
    </ul>
    <button @click="toggleDark" class="modo-btn">🌓</button>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)

const toggleDark = () => {
  document.documentElement.classList.toggle('dark')
}
</script>

<style scoped>
.navbar {    
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: var(--accent-color);
  color: var(--text-color);
  padding: 1rem;
}

.hamburger {
  display: block;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
}

ul {
  width: 100%;
  display: none;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}

ul.open {
  display: flex;
}

ul li a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
}

@media (min-width: 768px) {
  .hamburger {
    display: none;
  }

  ul {
    display: flex !important;
    flex-direction: row;
    width: auto;
    margin-top: 0;
    gap: 2rem;
  }
}
</style>
