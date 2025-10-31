<template>
  <section class="auth-wrapper">
    <div class="auth-box">
      <h2>Crear cuenta</h2>
      <form @submit.prevent="handleSignup">
        <input type="text" placeholder="Nombre de usuario" v-model="name" />
        <input type="email" placeholder="Correo electrónico" v-model="email" />
        <input type="password" placeholder="Contraseña" v-model="password" />
        <input type="password" placeholder="Repita la contraseña" v-model="password2" />
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
const emailError = ref(false)
const passwordError = ref(false)

function handleLogin() {
  emailError.value = !email.value.includes('@')
  passwordError.value = password.value.length < 6

  if (!emailError.value && !passwordError.value) {
    // Aquí va tu lógica de login
    console.log('Login exitoso')
  }
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
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
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  color: #fff;
  animation: fadeIn 0.6s ease;
}

.auth-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #00ffff;
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
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.auth-box input::placeholder {
  color: #ccc;
}

.auth-box input.error {
  border: 1px solid #ff4d4d;
}

.auth-box button {
  padding: 0.8rem;
  background-color: #00ffff;
  color: #000;
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
  color: #ccc;
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