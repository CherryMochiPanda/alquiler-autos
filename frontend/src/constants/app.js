/**
 * Constantes de aplicación
 * Centralizadas para fácil mantenimiento y escalabilidad
 */

export const APP_NAME = 'AutoRent'

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

export const CAR_CATEGORIES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  DEPORTIVO: 'deportivo',
  ELECTRICO: 'electrico',
  PICKUP: 'pickup'
}

export const TOAST_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
}

export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  AUTH_TOKEN: 'authToken',
  AUTOS: 'autos',
  USERS: 'users'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me'
  },
  CARS: {
    LIST: '/api/cars',
    DETAIL: '/api/cars',
    CREATE: '/api/cars',
    UPDATE: '/api/cars',
    DELETE: '/api/cars',
    FEATURED: '/api/cars/featured'
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: '/api/admin/users/:id',
    UPDATE_USER: '/api/admin/users/:id',
    UPDATE_USER_ROLE: '/api/admin/users/:id/role',
    DELETE_USER: '/api/admin/users/:id',
    STATS: '/api/admin/stats'
  },
  RESERVATIONS: {
    GET_ALL: '/api/rentals',
    CREATE: '/api/rentals',
    UPDATE: '/api/rentals/:id',
    CANCEL: '/api/rentals/:id/status'
  }
}

// Reglas de validación reutilizables
export const VALIDATION_RULES = {
  firstName: {
    required: true,
    // Permitir letras Unicode (tildes, ñ, etc.) y espacios
    pattern: /^[\p{L}\s]{2,50}$/u,
    message: 'Nombre debe tener entre 2 y 50 caracteres (solo letras)'
  },
  lastName: {
    required: true,
    pattern: /^[\p{L}\s]{2,50}$/u,
    message: 'Apellido debe tener entre 2 y 50 caracteres (solo letras)'
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Email inválido'
  },
  password: {
    required: true,
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    min: 8,
    message: 'Contraseña debe tener al menos 8 caracteres, una mayúscula y un número'
  },
  phone: {
    // Teléfono opcional; formato esperado: +53 8digitos (o menos), ejemplo: +53 59368215
    required: false,
    pattern: /^\+53\s?[0-9]{1,8}$/,
    message: 'Teléfono debe comenzar con +53 seguido de hasta 8 dígitos'
  },
  dni: {
    required: true,
    pattern: /^[0-9]{11}$/,
    message: 'DNI debe tener 11 dígitos.'
  }
}
