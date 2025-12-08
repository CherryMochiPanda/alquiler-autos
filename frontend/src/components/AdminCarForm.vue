<template>
  <div class="car-form">
    <h3>{{ title }}</h3>
    
    <div class="form-row">
      <label>{{ $t('admin.cars.form.brand') }}</label>
      <select v-model="local.brand" required class="full-width-input">
        <option value="" disabled>{{ $t('admin.cars.form.selectBrand') }}</option>
        <option v-for="brand in brandOptions" :key="brand" :value="brand">{{ brand }}</option>
      </select>
    </div>

    <div class="form-row">
      <label>{{ $t('admin.cars.form.model') }}</label>
      <textarea v-model="local.model" required class="full-width-input"></textarea>
    </div>

    <div class="image-upload-section">
        <div class="form-row">
            <label>{{ $t('admin.cars.form.cover') }}</label>
            <div class="file-upload-wrapper">
                <input 
                    type="file" 
                    id="cover-upload"
                    @change="handleCoverUpload" 
                    accept="image/*"
                    class="file-input-display"
                />
            </div>
            <small v-if="local.coverUrl && !local.coverFile">{{ $t('admin.cars.form.currentCover') }}: **{{ local.coverUrl }}**</small>
            <small v-if="local.coverFile">{{ $t('admin.cars.form.newFile') }}: **{{ local.coverFile.name }}**</small>
        </div>
    </div>
    
    <div class="form-grid">
      <div>
        <label>{{ $t('admin.cars.form.year') }}</label>
        <select v-model.number="local.year" required class="grid-input">
          <option value="" disabled>{{ $t('admin.cars.form.selectYear') }}</option>
          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div>
        <label>{{ $t('admin.cars.form.pricePerDay') }}</label>
        <input 
          type="text" 
          :value="local.pricePerDay" 
          @input="formatAndValidatePrice" 
          required 
          class="grid-input" 
          placeholder="Mínimo 10.00"
        />
      </div>

      <div>
        <label>{{ $t('admin.cars.form.plate') }}</label>
        <input v-model="local.plate" required class="grid-input" />
      </div>
    </div>

    <div class="form-row">
      <label>{{ $t('admin.cars.form.category') }}</label>
      <select v-model.number="local.categoryId" required class="full-width-input">
        <option value="" disabled>{{ $t('admin.cars.form.selectCategory') }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    
    <div class="form-row checkbox-row">
        <label>
            <input type="checkbox" v-model="local.destacado" /> 
            {{ $t('admin.cars.form.destacado') }}
        </label>
        <label>
            <input type="checkbox" v-model="local.isAvailable" /> 
            {{ $t('admin.cars.form.isAvailable') }}
        </label>
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="onSave" :disabled="isSaving">{{ isSaving ? 'Guardando...' : $t('admin.cars.form.save') }}</button>
      <button class="btn-secondary" @click="$emit('cancel')" :disabled="isSaving">{{ $t('admin.cars.form.cancel') }}</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useCarsStore } from '../stores/useCarsStore' 
import { useNotification } from '../composables'

// SETUP 
const props = defineProps({ 
  model: { 
    type: Object, 
    default: null 
  } 
})
const emit = defineEmits(['save', 'cancel'])

const carsStore = useCarsStore()
const notification = useNotification()

const isSaving = ref(false)
const categories = ref([])

const brandOptions = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Ford', 'Chevrolet', 'Nissan']
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i).sort((a, b) => b - a)

// --- ESTADO LOCAL ---
const local = reactive({
  id: props.model?.id || null, 
  brand: props.model?.brand || '',
  model: props.model?.model || '', 
  year: props.model?.year || '',
  pricePerDay: props.model?.pricePerDay || null, 
  plate: props.model?.plate || '',
  categoryId: props.model?.categoryId || '', 
  isAvailable: props.model?.isAvailable !== undefined ? props.model.isAvailable : true, 
  
  coverFile: null, 
  coverUrl: props.model?.cover || '', 
  
  destacado: props.model?.destacado || false, 
})

const title = computed(() => props.model ? 'Editar vehículo' : 'Agregar vehículo')

function handleCoverUpload(event) {
    const file = event.target.files?.[0]
    local.coverFile = file || null
}

// Validacion
function formatAndValidatePrice(event) {
    let value = event.target.value;
    
    //Convertir comas a puntos y limpiar caracteres no permitidos
    value = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');

    // Eliminar puntos extra: Asegurar un solo punto decimal
    const firstDotIndex = value.indexOf('.');
    if (firstDotIndex !== -1) {
        let integerPart = value.substring(0, firstDotIndex);
        let decimalPart = value.substring(firstDotIndex + 1).replace(/\./g, '');
        value = integerPart + '.' + decimalPart;
    }
    if (value.startsWith('.')) {
        value = '0' + value; 
    } 
    // límites de formato (4 enteros, 2 decimales)
    const parts = value.split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? parts[1] : '';

    // a) Limitar dígitos enteros (4)
    if (integerPart.length > 4) {
        integerPart = integerPart.substring(0, 4);
    }
    // Limitar dígitos decimales (2)
    if (decimalPart.length > 2) {
        decimalPart = decimalPart.substring(0, 2);
    }
    
    //  '05' -> '5'
    if (integerPart.length > 1 && integerPart.startsWith('0')) {
        integerPart = integerPart.substring(1);
    }
    value = parts.length === 1 ? integerPart : integerPart + '.' + decimalPart;
    local.pricePerDay = value === '' || value === '0.' ? null : value;
    // Forzar la actualización visual del input
    event.target.value = value;
}


async function loadCategories() {
  // SIMULACIÓN (Reemplazar con tu llamada real)
  categories.value = [
      { id: 1, name: 'Sedán' },
      { id: 2, name: 'SUV' },
      { id: 3, name: 'Deportivo' },
      { id: 4, name: 'Furgoneta' }
    ]
}

onMounted(() => {
  loadCategories()
})


async function onSave() {
  // VALIDACIONES again ._ .
  if (!local.brand || !local.model || !local.year || !local.categoryId || !local.pricePerDay || !local.plate) {
    notification.error('Todos los campos principales son requeridos.')
    return
  }
  
  const priceValue = parseFloat(local.pricePerDay);
  
  // VALIDACIÓN DE MÍNIMO: El precio debe ser 10.00 o mayor
  if (isNaN(priceValue) || priceValue < 10.00) {
    notification.error('El precio por día debe ser igual o superior a 10.00.');
    return;
  }
  
  // PREPARACIÓN DE DATOS 
  const formData = new FormData()

  // DTO Data
  formData.append('brand', local.brand)
  formData.append('model', local.model)
  formData.append('year', String(local.year))
  
  // Formato final de precio (asegura 2 decimales para el backend)
  const finalPrice = priceValue.toFixed(2); 
  formData.append('pricePerDay', finalPrice)
  
  formData.append('plate', local.plate)
  formData.append('categoryId', String(local.categoryId))
  formData.append('isAvailable', local.isAvailable)
  formData.append('destacado', local.destacado)
  
  // Existing URLs
  formData.append('coverUrl', local.coverUrl)
  formData.append('imageUrls', JSON.stringify([])) 

  // New Files
  if (local.coverFile) {
    formData.append('cover', local.coverFile) 
  }

  isSaving.value = true

  try {
    let result;
    if (local.id) {
      result = await carsStore.updateCar(local.id, formData)
    } 
    else {
      result = await carsStore.createCar(formData)
    }

    if (result.success) {
      notification.success('Vehículo guardado exitosamente.')
      emit('save') 
    }
  } catch (error) {
    console.error('Error en onSave:', error)
    notification.error('Error al guardar el vehículo.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.car-form { 
    background: var(--box-bg); 
    padding: 1.5rem; 
    border-radius: 8px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.form-row { margin-bottom: 1rem; }
.form-row label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: bold;
    color: var(--text-color-light);
}

.full-width-input, .grid-input { 
    width: 100%; 
    padding: 0.75rem; 
    border-radius: 6px; 
    border: 1px solid var(--divider-color); 
    background: var(--input-bg, #f5f5f5);
    color: var(--text-color); 
    box-sizing: border-box;
}

.form-grid { 
    display:grid; 
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
    gap: 1rem; 
    margin-bottom: 1rem;
}

.image-upload-section {
    padding: 1rem;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.file-upload-wrapper {
    width: 100%; 
}

.file-input-display {
    width: 100%;
    padding: 0.75rem; 
    border-radius: 6px; 
    border: 1px solid var(--divider-color); 
    background: var(--input-bg, #f5f5f5); 
    box-sizing: border-box;
}

.file-input-display::file-selector-button {
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 1rem;
    transition: background-color 0.3s;
}

.file-input-display::file-selector-button:hover {
    filter: brightness(0.85); 
}

.checkbox-row {
    display: flex;
    gap: 2rem;
    align-items: center;
}
.checkbox-row label {
    display: flex;
    align-items: center;
    font-weight: normal;
}
.checkbox-row input[type="checkbox"] {
    margin-right: 0.5rem;
}

.form-actions { 
    display:flex; 
    gap:0.75rem; 
    justify-content:flex-end;
    padding-top: 1rem;
}
.form-actions .btn-primary, .form-actions .btn-secondary {
    padding: 0.75rem 1.5rem; 
    border-radius: 8px; 
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, border-color 0.3s, filter 0.3s;
}
.form-actions .btn-primary:hover:not(:disabled) { 
    background: var(--accent-color);
    filter: brightness(0.85);
}
.form-actions .btn-primary:disabled { 
    background: #aaa; 
    cursor: not-allowed; 
    filter: none;
}
.form-actions .btn-secondary { 
    background:transparent; 
    border:2px solid var(--accent-color); 
    color: var(--accent-color);
}
.form-actions .btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
    color: var(--accent-color);
    filter: none;
}
</style>