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
  AUTOS: 'demo_cars',
  USERS: 'demo_users'
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
    DETAIL: '/api/cars/:id',
    CREATE: '/api/cars',
    UPDATE: '/api/cars/:id',
    DELETE: '/api/cars/:id',
    FEATURED: '/api/cars/featured'
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: '/api/admin/users/:id',
    UPDATE_USER: '/api/admin/users/:id',
    DELETE_USER: '/api/admin/users/:id',
    STATS: '/api/admin/stats'
  },
  RESERVATIONS: {
    GET_ALL: '/api/reservations',
    CREATE: '/api/reservations',
    UPDATE: '/api/reservations/:id',
    CANCEL: '/api/reservations/:id/cancel'
  }
}

// Reglas de validación reutilizables
export const VALIDATION_RULES = {
  firstName: {
    required: true,
    pattern: /^[a-zA-Z\s]{2,50}$/,
    message: 'Nombre debe tener entre 2 y 50 caracteres'
  },
  lastName: {
    required: true,
    pattern: /^[a-zA-Z\s]{2,50}$/,
    message: 'Apellido debe tener entre 2 y 50 caracteres'
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
    required: true,
    pattern: /^\+?[0-9]{7,15}$/,
    message: 'Teléfono debe tener entre 7 y 15 dígitos'
  },
  dni: {
    required: true,
    pattern: /^[0-9]{7,9}$/,
    message: 'DNI debe tener entre 7 y 9 dígitos'
  }
}
