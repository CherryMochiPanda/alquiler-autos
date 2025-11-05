<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { autos } from '../data/autos'
import { useI18n } from 'vue-i18n'
import CarCard from '../components/CarCard.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// helper: infer category from carpeta or id (prefix before -)
function inferCategory(a) {
  const src = a.carpeta || a.id || ''
  const prefix = src.split('-')[0]
  return prefix || 'default'
}


const imagenActual = ref({})
autos.forEach(auto => {
  imagenActual.value[auto.id] = 0
})

function siguiente(id) {
  const total = autos.find(a => a.id === id).imagenes.length
  imagenActual.value[id] = (imagenActual.value[id] + 1) % total
}

function anterior(id) {
  const total = autos.find(a => a.id === id).imagenes.length
  imagenActual.value[id] = (imagenActual.value[id] - 1 + total) % total
}

// group autos by category
const grouped = computed(() => {
  const map = {}
  autos.forEach(a => {
    const cat = inferCategory(a)
    if (!map[cat]) map[cat] = []
    map[cat].push(a)
  })
  return map
})

const selectedCategory = computed(() => route.query.category || null)
const previewLimit = 3

function goToCategory(cat) {
  router.push({ path: '/catalogo', query: { category: cat } })
}

function backToCatalog() {
  router.push({ path: '/catalogo' })
}
</script>

<template>
  <section class="catalogo-wrapper">
    <h2>{{ t('nav.catalog') }}</h2>

    <template v-if="!selectedCategory">
      <div class="category-list">
        <div v-for="(items, cat) in grouped" :key="cat" class="category-block">
          <h3>{{ t(`catalog.categories.${cat}`) || cat }}</h3>
          <div class="catalogo-grid">
            <CarCard v-for="auto in items.slice(0, previewLimit)" :key="auto.id" :auto="auto" @view="id => $router.push({ path: '/detalle-auto', query: { auto: id } })" />
          </div>
          <div class="category-actions">
            <button class="btn-secondary" @click="goToCategory(cat)">{{ t('catalog.seeMore') }}</button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="category-full">
        <h3>{{ t(`catalog.categories.${selectedCategory}`) || selectedCategory }}</h3>
        <div class="catalogo-grid">
          <CarCard v-for="auto in grouped[selectedCategory] || []" :key="auto.id" :auto="auto" :showReserve="true" @view="id => $router.push({ path: '/detalle-auto', query: { auto: id } })" @reserve="id => $router.push({ path: '/reservar', query: { auto: id } })" />
        </div>
        <div class="category-actions">
          <button class="btn-secondary" @click="backToCatalog">{{ t('catalog.back') }}</button>
        </div>
      </div>
    </template>

  </section>
</template>

<style scoped>
.catalogo-wrapper {
  padding: 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.catalogo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.category-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.category-actions .btn-secondary {
  background-color: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.car-card {
  border: 1px solid var(--divider-color);
  width: 320px;
  background: var(--box-bg);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: var(--neon-shadow);
  text-align: center;
}

.car-carousel {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.car-carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.card-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.card-buttons button {
  background-color: var(--accent-color);
  color: #000;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>



