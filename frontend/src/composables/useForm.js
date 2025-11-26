/**
 * useForm Composable
 * Proporciona funcionalidad de validación y manejo de formularios reutilizable
 */

import { ref, reactive, computed } from 'vue'
import { VALIDATION_RULES } from '../constants/app'

export function useForm(initialValues = {}, onSubmit = null) {
  // State
  const values = reactive(initialValues)
  const errors = reactive({})
  const touched = reactive({})
  const isSubmitting = ref(false)

  // Computed
  const hasErrors = computed(() => Object.keys(errors).length > 0)
  const isValid = computed(() => !hasErrors.value)
  const isTouched = computed(() => Object.values(touched).some(v => v === true))

  /**
   * Valida un campo individual
   */
  function validateField(fieldName, fieldValue) {
    const rules = VALIDATION_RULES[fieldName]

    if (!rules) {
      delete errors[fieldName]
      return true
    }

    const { pattern, required, message, min, max } = rules

    // Validación requerida
    if (required && !fieldValue) {
      errors[fieldName] = message || `${fieldName} es requerido`
      return false
    }

    if (!fieldValue) {
      delete errors[fieldName]
      return true
    }

    // Validación de patrón (regex)
    if (pattern && !pattern.test(String(fieldValue))) {
      errors[fieldName] = message || `${fieldName} no es válido`
      return false
    }

    // Validación de longitud mínima
    if (min && String(fieldValue).length < min) {
      errors[fieldName] = message || `${fieldName} debe tener al menos ${min} caracteres`
      return false
    }

    // Validación de longitud máxima
    if (max && String(fieldValue).length > max) {
      errors[fieldName] = message || `${fieldName} no debe exceder ${max} caracteres`
      return false
    }

    delete errors[fieldName]
    return true
  }

  /**
   * Marca un campo como tocado
   */
  function markTouched(fieldName) {
    touched[fieldName] = true
    validateField(fieldName, values[fieldName])
  }

  /**
   * Actualiza valor de campo
   */
  function setFieldValue(fieldName, value) {
    values[fieldName] = value
    if (touched[fieldName]) {
      validateField(fieldName, value)
    }
  }

  /**
   * Valida todos los campos
   */
  function validateAll() {
    Object.keys(values).forEach(fieldName => {
      validateField(fieldName, values[fieldName])
    })
    return isValid.value
  }

  /**
   * Maneja submit del formulario
   */
  async function handleSubmit() {
    if (!validateAll()) {
      return
    }

    isSubmitting.value = true
    try {
      if (onSubmit) {
        await onSubmit(values)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Resetea formulario
   */
  function resetForm() {
    Object.keys(values).forEach(key => {
      values[key] = initialValues[key] || ''
    })
    Object.keys(errors).forEach(key => {
      delete errors[key]
    })
    Object.keys(touched).forEach(key => {
      delete touched[key]
    })
  }

  /**
   * Obtiene estado de error de un campo
   */
  function getFieldError(fieldName) {
    return touched[fieldName] ? errors[fieldName] : null
  }

  /**
   * Obtiene clase CSS para validación de campo
   */
  function getFieldClass(fieldName) {
    if (!touched[fieldName]) return ''

    return errors[fieldName] ? 'has-error' : 'is-valid'
  }

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    // Computed
    hasErrors,
    isValid,
    isTouched,
    // Methods
    validateField,
    validateAll,
    setFieldValue,
    markTouched,
    handleSubmit,
    resetForm,
    getFieldError,
    getFieldClass
  }
}
