<template>
  <section class="hero">
    <h2>Encuentra tu auto ideal</h2>
    <p>Rápido, seguro y al mejor precio</p>
    <router-link to="/catalogo">
      <button class="btn">Ver catálogo</button>
    </router-link>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(to right, #0055a5, #0077cc);
  color: white;
}
.btn {
  padding: 0.8rem 1.5rem;
  background: #ffcc00;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s ease;
}
.btn:hover {
  transform: scale(1.05);
}
</style>
