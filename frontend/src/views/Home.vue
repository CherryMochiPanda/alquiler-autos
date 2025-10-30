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
  <section class="features">
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'car']" class="icon" />
    <h3>Variedad de Autos</h3>
    <p>Desde compactos hasta SUVs, tenemos el vehículo perfecto para cada ocasión.</p>
  </div>
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'bolt']" class="icon" />
    <h3>Reservas Rápidas</h3>
    <p>Proceso simple, sin complicaciones. Reserva en minutos desde cualquier dispositivo.</p>
  </div>
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="icon" />
    <h3>Precios Transparentes</h3>
    <p>Sin cargos ocultos. Lo que ves es lo que pagas, siempre.</p>
  </div>
  </section>
  <section class="how-it-works">
  <h2>¿Cómo funciona?</h2>
  <div class="steps">
    <div class="step">
      <font-awesome-icon :icon="['fas', 'search']" class="icon" />
      <h3>Explora el catálogo</h3>
      <p>Encuentra el auto perfecto para tu viaje.</p>
    </div>
    <div class="step">
      <font-awesome-icon :icon="['fas', 'calendar-check']" class="icon" />
      <h3>Elige fechas</h3>
      <p>Selecciona cuándo y dónde lo necesitas.</p>
    </div>
    <div class="step">
      <font-awesome-icon :icon="['fas', 'clipboard-check']" class="icon" />
      <h3>Confirma tu reserva</h3>
      <p>Revisa los detalles y confirma en segundos.</p>
    </div>
    <div class="step">
      <font-awesome-icon :icon="['fas', 'car-side']" class="icon" />
      <h3>¡Disfruta tu auto!</h3>
      <p>Recoge tu vehículo y comienza tu aventura.</p>
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

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.feature {
  flex: 1 1 250px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.feature h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.feature p {
  font-size: 1.5rem;
  line-height: 1.5;
}

.icon {
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.how-it-works {
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: center;
}

.how-it-works h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.step {
  flex: 1 1 220px;
  max-width: 250px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.step h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
}

.step p {
  font-size: 0.95rem;
  line-height: 1.4;
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


