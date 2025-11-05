<template>
  <footer class="footer">
    <p>{{ t('footer.copyright', { year }) }}</p>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  text-align: center;
  background-color: var(--nav-bg);
  border-top: 1px solid var(--divider-color);
  color: var(--text-color);
  backdrop-filter: blur(10px);
  margin-top: auto;
  font-size: 1rem;
}
</style>

