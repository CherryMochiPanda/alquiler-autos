<template>
  <section class="auth-wrapper">
    <div class="auth-box">
      <h2>Iniciar sesión</h2>
         <form @submit.prevent="iniciarSesion">
    <input v-model="correo" placeholder="Correo electrónico" :class="{ error: correo && !correoValido }" />
    <small v-if="correo && !correoValido" class="error-msg">Debe ser un correo válido de Gmail.</small>
        
        <div class="password-field">
      <input type="password" v-model="contrasena" placeholder="Contraseña" :class="{ error: contrasena && !contrasenaValida }" />
    
  <button type="button" @click="showPassword = !showPassword" class="icon-button">  
   <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
  </button> 
  <small v-if="contrasena && !contrasenaValida" class="error-msg">Mínimo 8 caracteres, 1 mayúscula y 1 número.</small> 
</div>

          <button type="submit" :disabled="!formValido">Iniciar sesión</button>
          <div v-if="mensaje" :class="['alert', tipoMensaje]">
            {{ mensaje }}
          </div>
        <p class="switch-link" @click="$router.push('/signup')">¿No tienes cuenta? Crear una</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const correo = ref('')
const contrasena = ref('')
const mensaje = ref('')

const correoValido = computed(() =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(correo.value)
)

const contrasenaValida = computed(() =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(contrasena.value)
)

const formValido = computed(() =>
  correoValido.value && contrasenaValida.value
)

function iniciarSesion() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
  const encontrado = usuarios.find(u => u.correo === correo.value)

  if (!encontrado) {
    mensaje.value = 'Correo no registrado.'
  } else if (encontrado.contrasena !== contrasena.value) {
    mensaje.value = 'Contraseña incorrecta.'
  } else {
    mensaje.value = `Bienvenido, ${encontrado.nombre}`
    // Aquí puedes redirigir o guardar sesión
  }
}

</script>

<style scoped>
.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  flex: 1;
  padding-right: 2.5rem;
}

.icon-button {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1.2rem;
  cursor: pointer;
}

.icon-button i {
  pointer-events: none;
}


.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-wrapper);
  padding: 2rem;
}

.auth-box {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px var(--color-sombra);
  color: #fff;
  animation: fadeIn 0.6s ease;
}

.auth-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: var(--accent-color);
}

.auth-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-box input {
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  background-color:var(--color-caja);
  color: var(--text-color);
  font-size: 1rem;
  transition: border 0.3s ease;
}

.auth-box input::placeholder {
  color: var(--color-Tgrand);
}

.auth-box input.error {
  border: 1px solid #ff4d4d;
}

.auth-box button {
  padding: 0.8rem;
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-box button:hover {
  background-color: #00c0ff;
}

.switch-link {
  text-align: center;
  margin-top: 1rem;
  color: var(--color-Tgrand);
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: #00ffff;
}

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
.error-msg {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: -0.5rem;
}
input.error {
  border: 1px solid #ff4d4d;
}
button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.alert {
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  color: #ff4d4d;
}

.alert.error {
  background-color: rgba(255, 77, 77, 0.2);
  color: #ff4d4d;
}

.alert.exito {
  background-color: rgba(0, 255, 128, 0.2);
  color: #00cc66;
}

</style>
