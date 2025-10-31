<template>
  <nav class="navbar">
    <div class="nav-content">
      <h1>AutoRent</h1>
      <ul>
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/catalogo">Catálogo</router-link></li>
<<<<<<< Updated upstream
        <li><router-link to="/reserva">Reservar</router-link></li>
        <li><router-link to="/login">Iniciar sesión</router-link></li>
        <li><router-link to="/signup">Crear cuenta</router-link></li>

=======
        <li><router-link to="/reservar">Reservar</router-link></li>
>>>>>>> Stashed changes
      </ul>
      <button @click="toggleDark" class="modo-btn">🌓</button>
    </div>
  </nav>
</template>

<script setup>
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
  width: 100%;
  margin: 0; 
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 1.2rem;
  color: var(--accent-color);
  cursor: pointer;
  box-shadow: var(--neon-shadow);
}
</style>
