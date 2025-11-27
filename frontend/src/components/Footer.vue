<template>
  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; 2025 Alquiler Autos. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  text-align: center;
  background-color: var(--nav-bg);
  border-top: 1px solid var(--divider-color);
  color: var(--text-color);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  margin-top: auto;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

