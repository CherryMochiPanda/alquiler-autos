// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Nota: para producción usa variables de entorno Vite (import.meta.env.VITE_...)
// Ejemplo (comentado):
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// }

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_DOMINIO.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
  appId: 'TU_APP_ID'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
