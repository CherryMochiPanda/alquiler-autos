<template>
  <section class="hero">
    <div class="blur-bg"></div>
    <div class="hero-content">
      <h1>AutoRent</h1>
      <p>Tu viaje comienza aquí. Renta el auto ideal con un solo clic.</p>
      <div class="hero-buttons">
        <router-link to="/catalogo" class="btn">Ver Catálogo</router-link>
        <router-link to="/reserva" class="btn alt">Reservar Ahora</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--bg-color);
  color: var(--text-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  min-height: 80vh;
  overflow: hidden;
  
}

.blur-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle at 30% 30%, #00f0ff33, transparent 70%),
              radial-gradient(circle at 70% 70%, #0077cc33, transparent 70%);
  filter: blur(80px);
  z-index: 0;
  animation: moveGlow 20s ease-in-out infinite alternate;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

h1 {
  font-size: 8rem;
  font-weight: 800;
  color: var(--text-color);
  text-shadow: var(--neon-shadow);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  animation: glowShift 6s ease-in-out infinite;
}


p {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  color: var(--text-color);
}


.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  background-color: var(--accent-color);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  box-shadow: var(--neon-shadow);
  transition: transform 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn.alt {
  background-color: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}

@keyframes moveGlow {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  100% {
    transform: translateX(-50%) translateY(-20px);
  }
}


@keyframes glowShift {
  0% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
    border-color: #00f0ff;
  }
  50% {
    text-shadow: 0 0 10px #0077cc, 0 0 20px #0077cc;
    border-color: #0077cc;
  }
  100% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
    border-color: #00f0ff;
  }
}

</style>


