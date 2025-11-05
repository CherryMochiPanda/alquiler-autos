<template>
  <div class="car-form">
    <h3>{{ title }}</h3>
    <div class="form-row">
      <label>{{ $t('admin.cars.form.nombre') }}</label>
      <input v-model="local.nombre" />
    </div>
    <div class="form-row">
      <label>{{ $t('admin.cars.form.carpeta') }}</label>
      <input v-model="local.carpeta" placeholder="carpeta-imagenes" />
    </div>
    <div class="form-row">
      <label>{{ $t('admin.cars.form.imagenes') }}</label>
      <textarea v-model="imagesText" placeholder="img1.jpg, img2.jpg"></textarea>
      <small>{{ $t('admin.cars.form.imagenesHint') }}</small>
    </div>
    <div class="form-row">
      <label>{{ $t('admin.cars.form.descripcion') }}</label>
      <textarea v-model="local.descripcion"></textarea>
    </div>
    <div class="form-grid">
      <div>
        <label>{{ $t('admin.cars.form.motor') }}</label>
        <input v-model="local.motor" />
      </div>
      <div>
        <label>{{ $t('admin.cars.form.transmision') }}</label>
        <input v-model="local.transmision" />
      </div>
      <div>
        <label>{{ $t('admin.cars.form.capacidad') }}</label>
        <input type="number" v-model.number="local.capacidad" />
      </div>
    </div>

    <div class="form-row">
      <label>{{ $t('admin.cars.form.extras') }}</label>
      <input v-model="local.extras" />
    </div>

    <div class="form-row">
      <label>{{ $t('admin.cars.form.cover') }}</label>
      <input v-model="local.cover" placeholder="/img/autos/ejemplo.jpg" />
    </div>

    <div class="form-row">
      <label><input type="checkbox" v-model="local.destacado" /> {{ $t('admin.cars.form.destacado') }}</label>
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="onSave">{{ $t('admin.cars.form.save') }}</button>
      <button class="btn-secondary" @click="$emit('cancel')">{{ $t('admin.cars.form.cancel') }}</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed } from 'vue'
const props = defineProps({ model: { type: Object, default: null } })
const emit = defineEmits(['save','cancel'])

const local = reactive({
  id: props.model?.id || '',
  nombre: props.model?.nombre || '',
  carpeta: props.model?.carpeta || '',
  imagenes: props.model?.imagenes ? [...props.model.imagenes] : [],
  descripcion: props.model?.descripcion || '',
  motor: props.model?.motor || '',
  transmision: props.model?.transmision || '',
  capacidad: props.model?.capacidad || 5,
  extras: props.model?.extras || '',
  destacado: props.model?.destacado || false,
  cover: props.model?.cover || ''
})

const imagesText = computed({
  get() { return local.imagenes.join(', ') },
  set(v) { local.imagenes = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const title = computed(() => props.model ? 'Editar vehículo' : 'Agregar vehículo')

function onSave() {
  // minimal validation
  if (!local.nombre) return alert('Nombre requerido')
  const out = {
    id: local.id || `${local.nombre.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`,
    nombre: local.nombre,
    carpeta: local.carpeta,
    imagenes: local.imagenes,
    descripcion: local.descripcion,
    motor: local.motor,
    transmision: local.transmision,
    capacidad: local.capacidad,
    extras: local.extras,
    destacado: !!local.destacado,
    cover: local.cover || ''
  }
  emit('save', out)
}
</script>

<style scoped>
.car-form { background: var(--box-bg); padding: 1rem; border-radius: 8px; }
.form-row { margin-bottom: 0.75rem; }
.form-row input, .form-row textarea { width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--divider-color); background: transparent; color: var(--text-color); }
.form-grid { display:grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; margin-bottom: 0.75rem }
.form-actions { display:flex; gap:0.5rem; justify-content:flex-end }
.form-actions .btn-primary { background:var(--accent-color); border:none; padding:0.6rem 1rem; border-radius:8px }
.form-actions .btn-secondary { background:transparent; border:2px solid var(--accent-color); padding:0.5rem 0.9rem; border-radius:8px }
</style>
