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
  <section class="timeline-loop">
  <h2>¿Cómo funciona?</h2>
  <div class="timeline-container">
    <div class="timeline-line"></div>
    <div class="timeline-steps">
      <div class="step" id="step1">
        <div class="circle">1</div>
        <h3>Explora el catálogo</h3>
      </div>
      <div class="step" id="step2">
        <div class="circle">2</div>
        <h3>Elige fechas</h3>
      </div>
      <div class="step" id="step3">
        <div class="circle">3</div>
        <h3>Confirma tu reserva</h3>
      </div>
      <div class="step" id="step4">
        <div class="circle">4</div>
        <h3>¡Disfruta tu auto!</h3>
      </div>
    </div>
  </div>
  </section>
  <section class="featured-cars">
  <h2>Autos destacados</h2>
  <div class="car-grid">
    <div class="car-card">
      <div class="image-placeholder">
      <!-- Aquí puedes poner un <img> o un <video> o un <iframe> más adelante -->
      <span>Imagen o GIF aquí</span>
      <h3>Sedán Clásico</h3>
      <p>Ideal para ciudad y viajes cortos.</p>
      <button>Reservar</button>
      </div>
    </div>
    <div class="car-card">
      <div class="image-placeholder">
      <!-- Aquí puedes poner un <img> o un <video> o un <iframe> más adelante -->
      <span>Imagen o GIF aquí</span>
      <h3>SUV Familiar</h3>
      <p>Espacio y comodidad para toda la familia.</p>
      <button>Reservar</button>
      </div>
    </div>
    <div class="car-card">
      <div class="image-placeholder">
      <!-- Aquí puedes poner un <img> o un <video> o un <iframe> más adelante -->
      <span>Imagen o GIF aquí</span>
      <h3>Auto Deportivo</h3>
      <p>Potencia y estilo para los que buscan adrenalina.</p>
      <button>Reservar</button>
      </div>
    </div>
  </div>
  </section>
  <section class="testimonials">
  <h2>Lo que dicen nuestros clientes</h2>
  <div class="testimonial-grid">
    <div class="testimonial">
      <p>“AutoRent me salvó en mi viaje a Varadero. El proceso fue rápido y el auto estaba impecable.”</p>
      <h4>— Laura G.</h4>
    </div>
    <div class="testimonial">
      <p>“Reservé desde mi celular en 5 minutos. ¡Muy fácil y sin sorpresas!”</p>
      <h4>— Ernesto P.</h4>
    </div>
    <div class="testimonial">
      <p>“Excelente atención y variedad de autos. Recomiendo AutoRent a todos mis amigos.”</p>
      <h4>— Yanelis M.</h4>
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

.timeline-loop {
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.timeline-loop h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--accent-color);
}

.timeline-steps {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.step {
  width: 200px;
  padding: 2rem 1rem;
  font-size: 1rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  backdrop-filter: blur(10px);
  text-align: center;
  transform: scale(1);
  box-shadow: none;
  animation: pulseStep 8s infinite;
}

.step h3 {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  color: var(--text-color);
}

.circle {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  border: 3px solid var(--accent-color);
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.timeline-container {
  position: relative;
  padding: 2rem 0;
  overflow: hidden;
}


.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background-color: var(--accent-color);
  width: 0%;
  animation: growLine 8s linear infinite;
  z-index: 0;
}

@keyframes growLine {
  0% {
    width: 0%;
  }
  25% {
    width: 25%;
  }
  50% {
    width: 50%;
  }
  75% {
    width: 75%;
  }
  100% {
    width: 100%;
  }
}


@keyframes lineProgress {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.timeline-steps {
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 1;
}



/* Animación base */
@keyframes pulseStep {
  0%, 100% {
    transform: scale(1);
    box-shadow: none;
  }
  10% {
    transform: scale(1.2);
    box-shadow: 0 0 20px var(--accent-color);
  }
  20% {
    transform: scale(1);
    box-shadow: none;
  }
}

/* Delays para que se activen en orden */
#step1 {
  animation-delay: 0s;
}
#step2 {
  animation-delay: 2s;
}
#step3 {
  animation-delay: 4s;
}
#step4 {
  animation-delay: 6s;
}


@keyframes pulse {
  0% {
    box-shadow: 0 0 0px var(--accent-color);
  }
  50% {
    box-shadow: 0 0 20px var(--accent-color);
  }
  100% {
    box-shadow: 0 0 0px var(--accent-color);
  }
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

.featured-cars {
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.featured-cars h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.car-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.car-card {
  width: 320px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 1.5rem;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.car-card img {
  width: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.car-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.car-card p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.car-card button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.car-card button:hover {
  background-color: #00c0ff;
}

.testimonials {
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: center;
}

.testimonials h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.testimonial-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.testimonial p {
  font-size: 1rem;
  line-height: 1.4;
}


.testimonial {
  max-width: 300px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  font-style: italic;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.testimonial:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.testimonial h4 {
  margin-top: 1rem;
  font-weight: bold;
  color: var(--accent-color);
}

.image-placeholder {
  width: 100%;
  height: 180px;
  background-color: #2c2c2c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.9rem;
  font-style: italic;
  border: 1px dashed var(--accent-color);
}


</style>


