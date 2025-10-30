<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<style>
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --accent-color: #0077cc;
  --neon-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


.dark {
  --bg-color: #121212;
  --text-color: #f0f0f0;
  --accent-color: #00f0ff;
  --neon-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

body {
  transition: background-color 0.5s ease, color 0.5s ease;
  margin: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'Segoe UI', sans-serif;
}

</style>


