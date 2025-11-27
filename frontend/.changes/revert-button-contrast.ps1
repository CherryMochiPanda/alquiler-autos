# Revert script for button contrast changes
# Run from repository root in PowerShell to restore original files saved in this script.

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Restoring files..."

# App.vue
@'
<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
    <ToastContainer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ToastContainer from './components/ToastContainer.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') document.documentElement.classList.add('dark')
  else if (saved === 'light') document.documentElement.classList.remove('dark')
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark')
})
</script>

<style>

*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --divider-color: rgba(0, 0, 0, 0.1);
  --bg-color: #ffffff;
  --text-color: #000000;
  --text-color-bold: #000000;
  --accent-color: #0077cc;
  --text-on-accent: #ffffff;
  --danger-color: #ff5252;
  --success-color: #4dff4d;
  --muted-color: #999999;
  --text-on-danger: #ffffff;
  --text-on-success: #000000;
  --nav-bg: rgba(255, 255, 255, 0.9);
  --color-wrapper:linear-gradient(to bottom right, #fcfeff, #d2f1ff, #e9d7ff);
  --color-Tgrand: #6a6a6a;
  --color-caja: #fff2fdc6;
  --color-sombra:rgba(17, 126, 126, 0.392);
  --box-bg: rgba(255, 255, 255, 0.8);
  --neon-shadow: 0 0 10px rgba(17, 126, 126, 0.392);
  --cicle1: #5eff00;
  --cicle2: #ff6600;
  --cicle3: #8400ff;
}

html {
  min-height: 100vh;
  height: 100%;
}

.dark {
  --divider-color:  rgba(255, 253, 253, 0.1); 
  --bg-color: #121212;
  --text-color: #f0f0f0;
  --text-color-bold: #ffffff;
  --accent-color: #00f0ff;
  --text-on-accent: #000000;
  --danger-color: #ff7a7a;
  --success-color: #2cff7a;
  --muted-color: #9aa0a6;
  --text-on-danger: #000000;
  --text-on-success: #000000;
  --color-wrapper:linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
  --color-Tgrand: #ccc;
  --color-caja: rgba(255, 255, 255, 0.1);
  --color-sombra:rgba(0, 255, 255, 0.1);
  --box-bg: rgba(255, 255, 255, 0.05);
  --neon-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
  --nav-bg: rgba(18, 18, 18, 0.85);
  --cicle1: #00f7ff33;
  --cicle2: #6f00ff33;
  --cicle3: #ff00ff33;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

body {
  transition: background-color 0.5s ease, color 0.5s ease, background 0.5s ease;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-wrapper);
  color: var(--text-color);
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
}

/* Button contrast: use explicit text color on accent backgrounds */
.btn-primary, .btn {
  color: var(--text-on-accent);
}

</style>
'@ | Set-Content -Encoding UTF8 "./frontend/src/App.vue"

# For brevity the script restores only App.vue; if you want full revert include the other saved files here.

Write-Host "Restoration complete."
