DOCUMENTACIÓN DEL PROYECTO "alquiler-autos" (Guía completa y acciones para hacerlo 100% funcional)
Idioma: Español
Ubicación: raíz del repositorio (DOCUMENTACION.md)

Resumen ejecutivo
- Propósito: Esta documentación explica el proyecto para alguien que está aprendiendo programación web, detalla cómo funciona lo ya presente en el repositorio, cómo modificar cada parte y un plan paso a paso para completar el proyecto hasta que sea 100% funcional.
- Estado actual (revisión rápida): el repositorio contiene carpetas frontend/ y backend/ (la carpeta backend existe pero parece vacía o sin implementación completa). El frontend usa Vite y Vue (hay index.html, package.json, vite.config.js, src/, public/). Se aportan ejemplos y plantillas para completar el backend y conectar todo.

Índice
1. Introducción y objetivos
2. Requisitos previos
3. Estructura del repositorio y explicación archivo por archivo (cómo modificar cada cosa)
4. Cómo ejecutar el proyecto localmente (frontend y backend de ejemplo)
5. Implementación completa recomendada del backend (paso a paso)
6. Cómo conectar frontend con backend y qué modificar en el frontend
7. Autenticación, autorización y seguridad (cómo implementarlo)
8. Base de datos y persistencia: migraciones y modelos
9. Pruebas (unitarias, integración, e2e) y cómo escribirlas
10. CI/CD y despliegue (GitHub Actions + Docker + hosting sugerido)
11. Checklist y plan de trabajo para completar el proyecto
12. Issues sugeridos y plantillas
13. Recursos y glosario

1) Introducción y objetivos
Este proyecto pretende ser una aplicación de alquiler de autos. La idea es disponer de:
- Catálogo de coches (CRUD)
- Registro y autenticación de usuarios
- Gestión de reservas (crear/listar/cancelar)
- Rol de administrador para gestionar flota y reservas

Objetivo de esta guía: que un alumno pueda entender la base del frontend existente, ver ejemplos de backend, modificar cada parte y seguir un roadmap claro para convertir el proyecto en una app funcional y desplegada.

2) Requisitos previos
- Git
- Node.js (recomendado LTS >= 18)
- npm (v9+) o yarn/pnpm
- Docker (opcional pero recomendado para producción)
- Editor (VSCode recomendado)
- Conocimientos básicos de HTML/CSS/JS y nociones de Vue/TypeScript

3) Estructura del repositorio y explicación archivo por archivo (cómo modificar cada cosa)
A continuación se indica la estructura detectada y qué modificar en cada elemento. Ajusta rutas y nombres si en tu repo hay diferencias.

Raíz/
- README.md: archivo de alto nivel. Modifícalo para añadir: objetivo del proyecto, comandos principales, link a DOCUMENTACION.md y licencias.
- DOCUMENTACION.md: este documento (añádelo en main). Modifica y actualiza conforme avance el proyecto.
- .gitattributes, .hintrc: configuraciones que puedes mantener. No suelen necesitar cambios a menos que cambie tu flujo de CI/linter.

frontend/
- package.json: contiene scripts y dependencias. Qué modificar:
  - "scripts": añade scripts claros: "dev" para desarrollo, "build" para producción, "preview" para servir build, "lint", "test".
  - Dependencias: actualiza versiones según necesidad; usa npm audit para comprobar vulnerabilidades.

- vite.config.js: configuración de Vite. Para desarrollo y proxy al backend modifica server.proxy para redirigir /api al backend. Ejemplo:
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }

- index.html: punto de entrada. Modifica meta tags para SEO/compartir y agrega manifest si haces PWA.

- src/: aquí está la app Vue. Estructura típica y qué modificar:
  - src/main.ts (o main.js): punto de montaje. Cambia configuración global (router, store, i18n, plugins).
  - src/App.vue: layout base. Modifica header/footer, añade rutas y slots.
  - src/components/: componentes UI. Para modificar: separar componentes por responsabilidad, añadir props, tests y estilos scoped.
  - src/views/: vistas/rutas principales (Home, CarsList, CarDetail, Login, Dashboard). Añade nuevas vistas según funciones.
  - src/router/index.ts: rutas de la SPA. Añade rutas protegidas con guardias (navigation guards) que verifiquen auth.
  - src/store/ o src/stores/: gestión de estado (Pinia o Vuex). Modifica para añadir stores: userStore, carsStore, reservationStore.
  - src/assets/: imágenes, fuentes. Añade logos y diferentes tamaños.

- public/: archivos estáticos que no pasan por Vite, como favicon. Mejora SEO/social con open graph tags y favicons.

- README.md (en frontend): instrucciones específicas del frontend. Mantenlo actualizado.

backend/
Actualmente la carpeta existe pero aparentemente no tiene implementación completa. Si no hay código, crea la estructura completa como se indica abajo. Si ya tiene algo, adapta los pasos.

Sugerencia de estructura backend/:
- backend/package.json
- backend/tsconfig.json
- backend/src/
  - src/index.ts (entrada)
  - src/app.ts (configuración express)
  - src/routes/
    - routes.cars.ts
    - routes.auth.ts
    - routes.reservations.ts
  - src/controllers/
    - cars.controller.ts
    - auth.controller.ts
    - reservation.controller.ts
  - src/models/
    - car.model.ts
    - user.model.ts
    - reservation.model.ts
  - src/services/
    - db.service.ts (conexión a la BD)
  - src/middlewares/
    - auth.middleware.ts
    - error.middleware.ts
  - src/utils/
    - logger.ts
- backend/.env.example
- backend/Dockerfile

Qué modificar en backend: cada archivo debe ser tratado como una unidad:
- package.json: scripts "dev" (ts-node-dev), "build" (tsc), "start" (node dist/index.js)
- src/index.ts: levantar servidor y leer variables de entorno.
- src/app.ts: registrar middlewares (cors, express.json, helmet), rutas y error handler.
- routes/*.ts: definir rutas y validar datos (express-validator o zod).
- controllers/*.ts: lógica estandar (recibir request, llamar a services, responder). Mantén la lógica de negocio fuera de controllers en services para testabilidad.
- models/*.ts: define tipos/ES6 clases o entidades de ORM (Prisma/TypeORM/Sequelize). Para empezar rápido puedes usar in-memory o SQLite.
- middlewares/auth.middleware.ts: validar JWT en headers Authorization Bearer <token>.

4) Cómo ejecutar el proyecto localmente (frontend y backend de ejemplo)
A continuación ejemplos concretos que puedes copiar.

A) Preparar frontend
1. Desde la raíz:
   cd frontend
   npm install
2. Scripts recomendados (añadir a frontend/package.json > scripts):
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview --port 4173",
     "lint": "eslint src --ext .ts,.vue --max-warnings=0",
     "test": "vitest"
   }
3. Ejecutar desarrollo:
   npm run dev
4. Abrir http://localhost:5173 (o puerto que muestre vite)

B) Backend de ejemplo (Node + Express + TypeScript)
1. Crear backend/package.json mínimo:
{
  "name": "alquiler-autos-backend",
  "version": "0.1.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0",
    "@types/express": "^4.17.13",
    "@types/node": "^18.0.0"
  }
}

2. Archivo backend/src/index.ts (ejemplo mínimo):
import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));

3. Archivo backend/src/app.ts:
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import carsRoutes from './routes/routes.cars';
import authRoutes from './routes/routes.auth';

const app = express();
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/cars', carsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export default app;

4. routes.cars.ts ejemplo:
import { Router } from 'express';
const router = Router();

let cars = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', precioDia: 30 },
  { id: 2, marca: 'Ford', modelo: 'Focus', precioDia: 28 }
];

router.get('/', (_req, res) => res.json(cars));
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find(c => c.id === id);
  if (!car) return res.status(404).json({ message: 'No encontrado' });
  res.json(car);
});

router.post('/', (req, res) => {
  const { marca, modelo, precioDia } = req.body;
  const newCar = { id: Date.now(), marca, modelo, precioDia };
  cars.push(newCar);
  res.status(201).json(newCar);
});

export default router;

5. Ejecutar backend:
   cd backend
   npm install
   npm run dev

6. Probar endpoint:
   curl http://localhost:4000/api/cars

5) Implementación completa recomendada del backend (paso a paso para llegar al 100% funcional)
A continuación un plan con pasos técnicos concretos y qué modificar en cada fase.

Fase 0 — Inicialización (1 día)
- Crear estructura backend (package.json, tsconfig.json, src/).
- Añadir script dev, start y build.
- Implementar /api/health y endpoints mock de cars (como ejemplo anterior).
- Comprobar CORS y conexión desde frontend (vite proxy o URL directa).

Fase 1 — Persistencia y modelos (1-2 días)
- Elegir BD: Postgres (recomendado) o SQLite para desarrollo local.
- Añadir ORM: Prisma (recomendado), TypeORM o Sequelize.
- Crear esquema (migrations) con tablas: users, cars, reservations.
- Implementar servicios que usen ORM para CRUD.

Ejemplo con Prisma (comandos):
- npm install prisma --save-dev
- npx prisma init
- En schema.prisma definir modelos:
model User {
  id Int @id @default(autoincrement())
  email String @unique
  password String
  role String @default("user")
  reservations Reservation[]
}

model Car {
  id Int @id @default(autoincrement())
  marca String
  modelo String
  precioDia Float
  available Boolean @default(true)
  reservations Reservation[]
}

model Reservation {
  id Int @id @default(autoincrement())
  user User @relation(fields: [userId], references: [id])
  userId Int
  car Car @relation(fields: [carId], references: [id])
  carId Int
  start DateTime
  end DateTime
  status String @default("active")
}

- Ejecutar npx prisma migrate dev --name init

Qué modificar: adapta campos, añade índices y relaciones según requisitos.

Fase 2 — Autenticación y autorización (1-2 días)
- Implementar register/login con bcrypt para hashear contraseñas y JWT para tokens.
- Añadir refresh tokens si quieres sesiones más seguras.
- Crear middleware auth.middleware.ts que valide token y añada req.user.
- En rutas protegidas, usar middleware para restringir.

Ejemplo (auth.controller.ts - esquemático):
- POST /api/auth/register: recibe email, password -> crea user, devuelve token.
- POST /api/auth/login: valida credenciales -> devuelve token.

Qué modificar: cambiar secret en .env, ajustar expiración, guardar refresh tokens en DB si usas.

Fase 3 — Reservas y lógica de negocio (2-3 días)
- Endpoint POST /api/reservations: validar disponibilidad del auto en fechas, crear reserva vinculada a user.
- Endpoint GET /api/reservations (user): listar reservas del usuario.
- Endpoint GET /api/reservations/admin: listar todas para admin (proteger con role).
- Validaciones: fechas coherentes, solapamientos, marcar coche como no disponible si requiere.

Fase 4 — Calidad, tests y documentación (2-4 días)
- Escribir tests unitarios y de integración para endpoints con Jest/Vitest + Supertest.
- Añadir Swagger/OpenAPI para documentar endpoints: npm install swagger-ui-express swagger-jsdoc.
- Añadir linter y formateador: ESLint + Prettier.

Fase 5 — Contenedores y despliegue (1-2 días)
- Crear Dockerfile backend y frontend.
- Crear docker-compose para levantar BD (postgres), backend y frontend.
- Configurar variables de entorno seguras y secretos del proveedor.
- Desplegar: Heroku/Render/Vercel (frontend) + Railway/Heroku/Render (backend) o plataforma propia.

6) Cómo conectar frontend con backend y qué modificar en el frontend
- En desarrollo: usar vite.config.js proxy o invocar el backend en fetch/axios con http://localhost:4000/api.
- En producción: apuntar a la URL pública del backend (usualmente se establece en .env de frontend en build time: VITE_API_URL).

Cambios concretos en frontend:
- src/services/api.ts (crear): archivo para centralizar llamadas HTTP, usar fetch o axios y añadir token en headers.

Ejemplo api.ts con fetch:
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

- Login flow: al obtener token, guardarlo en localStorage y en store global. Usar route guards para proteger rutas.
- Reserva flow: formulario que envíe POST /api/reservations con fechas y carId.

Qué modificar por componente:
- CarsList.vue: usar store to fetch cars; añadir botón "Reservar" que abra modal con formulario.
- CarDetail.vue: mostrar disponibilidad y formulario de reserva.
- Dashboard.vue (admin): mostrar gestión de coches y reservas.

7) Autenticación, autorización y seguridad (cómo implementarlo)
Recomendaciones concretas:
- Backend: usar bcrypt para hashear passwords: const hash = await bcrypt.hash(password, 10);
- JWT: firmar con SECRET en .env: JWT_SECRET=mi_secreto; usar expiresIn corto (p. ej. '1h').
- No guardar tokens en cookies sin Secure/HttpOnly si no sabes qué haces. Para SPA puedes usar localStorage, pero considera riesgos XSS. Alternativa: cookies httpOnly con CSRF protection.
- Implementar logout borrando token del cliente.
- Validar inputs con zod o express-validator.
- Usar helmet y rate-limit para protección básica.

8) Base de datos y persistencia: migraciones y modelos
- Recomiendo Prisma para rapidez y claridad.
- Ejemplo de pasos para migraciones:
  - npx prisma migrate dev --name init
  - npx prisma db seed (si preparas seed script)
- En producción, usar bases como Postgres; configurar connection string en DATABASE_URL en .env.
- Realiza backup y monitoreo de la BD en producción.

9) Pruebas (unitarias, integración, e2e) y cómo escribirlas
- Backend: usar Vitest/Jest + Supertest.
  - Test de ruta: arranca app en memory y llama endpoints.
  - Mock DB o usar SQLite en memoria para tests.

- Frontend: Vitest + Vue Testing Library para componentes.
  - Test de componente: montar componente y mockear fetch/axios.

- E2E: usar Cypress o Playwright para flujos completos (registro, login, crear reserva).

Ejemplo test backend con supertest (Jest/vitest):
import request from 'supertest';
import app from '../src/app';

test('GET /api/health', async () => {
  const res = await request(app).get('/api/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
});

10) CI/CD y despliegue (GitHub Actions + Docker + hosting sugerido)
- Crear workflow .github/workflows/ci.yml para instalar deps y ejecutar tests y build (ejemplo en la documentación previa).
- Crear Dockerfile para backend (ejemplo):

# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 4000
CMD [ "node", "dist/index.js" ]

- Dockerfile para frontend:
# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

- docker-compose.yml ejemplo en la raíz:
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: alquiler
    volumes:
      - db-data:/var/lib/postgresql/data
  backend:
    build: ./backend
    ports:
      - '4000:4000'
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/alquiler
    depends_on:
      - db
  frontend:
    build: ./frontend
    ports:
      - '5173:80'
    depends_on:
      - backend
volumes:
  db-data:

Despliegue recomendado:
- Frontend: Vercel / Netlify
- Backend: Render / Railway / Heroku / DigitalOcean App Platform
- Base de datos: managed Postgres (Supabase, Railway, Render DB, Neon)

11) Checklist y plan de trabajo para completar el proyecto (ordenado por prioridad)
Prioridad alta (MVP 100% funcional):
- [ ] Backend con persistencia (Postgres) y autenticación JWT
- [ ] Endpoints CRUD para coches y reservas
- [ ] Frontend consumiendo la API (login, listar coches, reservar)
- [ ] Validaciones y manejo de errores correcto
- [ ] Tests básicos para backend
- [ ] CI para ejecutar tests y build

Prioridad media:
- [ ] Roles (admin)
- [ ] Docker + docker-compose
- [ ] Documentación de API (Swagger)

Prioridad baja:
- [ ] E2E tests
- [ ] Internacionalización
- [ ] Pago (integración con un sandbox)

12) Issues sugeridos y plantillas
Incluye estos issues en GitHub (copiar contenido):
- Backend: Inicializar proyecto con Express + TypeScript
- Backend: Implementar modelos en Prisma y migraciones
- Backend: Implementar autenticación JWT (register/login)
- Backend: Endpoints CRUD para coches
- Frontend: Crear servicio API y store para manejar auth y cars
- Frontend: Implementar vistas: Login, Register, CarsList, CarDetail, Dashboard
- CI: Configurar workflow que ejecute tests y build
- Docker: Crear Dockerfile para backend y frontend

13) Recursos y glosario
- MDN Web Docs: https://developer.mozilla.org/
- Vue: https://vuejs.org/
- TypeScript: https://www.typescriptlang.org/
- Prisma: https://www.prisma.io/
- Express: https://expressjs.com/
- Postgres: https://www.postgresql.org/

Glosario rápido:
- SPA: Single Page Application
- JWT: JSON Web Token
- ORM: Object Relational Mapping
- CRUD: Create Read Update Delete
- CI: Continuous Integration
- CD: Continuous Delivery/Deployment

14) Anexos: snippets útiles
- vite.config.js proxy example:
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

- Ejemplo de api service (frontend/src/services/api.ts):
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error('Error en la petición')
  return res.json()
}

- Ejemplo de componente Vue (Composition API, src/components/CarsList.vue):
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiGet } from '../services/api'

const cars = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    cars.value = await apiGet('/api/cars')
  } catch (e) {
    console.error(e)
  } finally { loading.value = false }
})
</script>

<template>
  <div>
    <h2>Listado de coches</h2>
    <div v-if="loading">Cargando...</div>
    <ul v-else>
      <li v-for="car in cars" :key="car.id">{{ car.marca }} {{ car.modelo }} - {{ car.precioDia }}€/día</li>
    </ul>
  </div>
</template>

15) Cómo puedo ayudarte ahora
He creado este documento completo con instrucciones y ejemplos. Según tu petición, ahora lo subiré a la rama main del repositorio CherryMochiPanda/alquiler-autos como DOCUMENTACION.md. Si quieres que cambie la rama o el formato (por ejemplo docs/DOCUMENTACION.md), dímelo antes de que haga el commit.