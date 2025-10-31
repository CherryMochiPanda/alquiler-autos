<template>
  <section class="auth-wrapper">
    <div class="auth-box">
      <h2>Crear cuenta</h2>
      <form @submit.prevent="handleSignup">
        <input type="text" placeholder="Nombre de usuario" v-model="name" required />
        <input type="email" placeholder="Correo electrónico" v-model="email" required/>
       <input type="password" v-model="password" placeholder="Contraseña" required />
<input type="password" v-model="confirmPassword" placeholder="Repetir contraseña" required/>
<p v-if="confirmPassword && confirmPassword !== password" class="error-msg">
  Las contraseñas no coinciden
</p>

        <button type="submit">Registrarse</button>
         <p class="switch-link" @click="$router.push('/login')">¿Ya tienes cuenta? Iniciar sesión</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const emailError = ref(false)
const passwordError = ref(false)

function handleLogin() {
  emailError.value = !email.value.includes('@')
  passwordError.value = password.value.length < 6

  if (!emailError.value && !passwordError.value) {
    
    console.log('Login exitoso')
  }
}
</script>

<style scoped>
.error-msg {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: -0.5rem;
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
</style>