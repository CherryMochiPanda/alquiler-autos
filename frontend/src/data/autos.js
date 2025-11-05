export const autos = [
  // Sedán Clásico
  {
    id: 'sedan',
    nombre: 'Sedán Clásico',
    carpeta: 'sedan-toyota',
    destacado: true,
    cover: '/img/autos/sedan-clasico.jpg',
    imagenes: [
      'toyota-corola-LE-2021-p1.webp',
      'toyota-corola-LE-2021-p2.webp',
      'toyota-corola-LE-2021-p3.webp',
      'toyota-corola-LE-2021-p4.webp',
      'toyota-corola-LE-2021-p5.webp'
    ],
    motor: '1.8L',
    transmision: 'Automático',
    capacidad: 5,
    extras: 'Aire acondicionado, Bluetooth',
    descripcion: 'Ideal para ciudad y viajes cortos.'
  },

  // SUV Familiar
  {
    id: 'suv',
    nombre: 'SUV Familiar',
    carpeta: 'suv-hyundai',
    destacado: true,
    cover: '/img/autos/suv-familiar.jpg',
    imagenes: [
      'hyundai-tucson-2022-p1.webp',
      'hyundai-tucson-2022-p2.webp',
      'hyundai-tucson-2022-p3.webp'
    ],
    motor: '2.5L',
    transmision: 'Automático AWD',
    capacidad: 7,
    extras: 'Pantalla táctil, sensores de reversa, techo panorámico',
    descripcion: 'Espacio y comodidad para toda la familia.'
  },

  // Deportivo GT
  {
    id: 'deportivo',
    nombre: 'Deportivo GT',
    carpeta: 'deportivo-ford',
    destacado: true,
    cover: '/img/autos/deportivo.jpg',
    imagenes: [
      'ford-mustang-gt-2021-p1.webp',
      'ford-mustang-gt-2021-p2.webp',
      'ford-mustang-gt-2021-p3.webp'
    ],
    motor: '5.0L V8',
    transmision: 'Manual',
    capacidad: 2,
    extras: 'Escape deportivo, asientos de cuero, control de tracción',
    descripcion: 'Potencia y estilo para los amantes de la velocidad.'
  },

  // Pickup robusta
  {
    id: 'pickup',
    nombre: 'Pickup 4x4',
    carpeta: 'pickup-ford',
    imagenes: [
      'ford-ranger-2022-p1.webp',
      'ford-ranger-2022-p2.webp',
      'ford-ranger-2022-p3.webp'
    ],
    motor: '3.2L Turbo Diesel',
    transmision: 'Manual 4x4',
    capacidad: 5,
    extras: 'Caja amplia, suspensión elevada, control de descenso',
    descripcion: 'Perfecta para terrenos difíciles y carga pesada.'
  },

  // Eléctrico urbano
  {
    id: 'electrico',
    nombre: 'Compacto Eléctrico',
    carpeta: 'electrico-nissan',
    imagenes: [
      'nissan-leaf-2023-p1.webp',
      'nissan-leaf-2023-p2.webp',
      'nissan-leaf-2023-p3.webp'
    ],
    motor: '100% Eléctrico',
    transmision: 'Automático',
    capacidad: 5,
    extras: 'Cargador rápido, navegación inteligente, cero emisiones',
    descripcion: 'Eficiencia y tecnología para la ciudad.'
  },

  //otros sedanes

  {
  id: 'sedan-honda',
  nombre: 'Honda Accord 2022',
  carpeta: 'sedan-honda',
  imagenes: ['accord-p1.webp', 'accord-p2.webp'],
  motor: '2.0L Turbo',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Pantalla táctil, control de crucero',
  descripcion: 'Elegancia y eficiencia para el día a día.'
},
{
  id: 'sedan-kia',
  nombre: 'Kia Forte 2023',
  carpeta: 'sedan-kia',
  imagenes: ['forte-p1.webp', 'forte-p2.webp'],
  motor: '2.0L',
  transmision: 'Manual',
  capacidad: 5,
  extras: 'Bluetooth, cámara trasera',
  descripcion: 'Compacto y confiable para ciudad.'
},
{
  id: 'sedan-chevy',
  nombre: 'Chevrolet Malibu 2021',
  carpeta: 'sedan-chevy',
  imagenes: ['malibu-p1.webp', 'malibu-p2.webp'],
  motor: '1.5L Turbo',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Wi-Fi integrado, sensores de reversa',
  descripcion: 'Tecnología y confort en un sedán moderno.'
},
//SUVs
{
  id: 'suv-toyota',
  nombre: 'Toyota RAV4 2022',
  carpeta: 'suv-toyota',
  imagenes: ['rav4-p1.webp', 'rav4-p2.webp'],
  motor: '2.5L',
  transmision: 'Automático AWD',
  capacidad: 5,
  extras: 'Asistente de carril, techo solar',
  descripcion: 'Versátil y seguro para toda la familia.'
},
{
  id: 'suv-ford',
  nombre: 'Ford Explorer 2023',
  carpeta: 'suv-ford',
  imagenes: ['explorer-p1.webp', 'explorer-p2.webp'],
  motor: '3.0L V6',
  transmision: 'Automático',
  capacidad: 7,
  extras: 'Pantalla de 12", tracción total',
  descripcion: 'Potencia y espacio para aventuras largas.'
},
{
  id: 'suv-chevy',
  nombre: 'Chevrolet Equinox 2022',
  carpeta: 'suv-chevy',
  imagenes: ['equinox-p1.webp', 'equinox-p2.webp'],
  motor: '1.5L Turbo',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Wi-Fi, frenado automático',
  descripcion: 'Tecnología y seguridad en cada viaje.'
},
//deportivos
{
  id: 'deportivo-toyota',
  nombre: 'Toyota Supra 2022',
  carpeta: 'deportivo-toyota',
  imagenes: ['supra-p1.webp', 'supra-p2.webp'],
  motor: '3.0L Turbo',
  transmision: 'Automático',
  capacidad: 2,
  extras: 'Modo Sport, escape doble',
  descripcion: 'Diseño agresivo y rendimiento puro.'
},
{
  id: 'deportivo-chevy',
  nombre: 'Chevrolet Camaro 2021',
  carpeta: 'deportivo-chevy',
  imagenes: ['camaro-p1.webp', 'camaro-p2.webp'],
  motor: '6.2L V8',
  transmision: 'Manual',
  capacidad: 4,
  extras: 'Suspensión deportiva, control de tracción',
  descripcion: 'Muscle car con actitud.'
},
{
  id: 'deportivo-bmw',
  nombre: 'BMW M4 2023',
  carpeta: 'deportivo-bmw',
  imagenes: ['m4-p1.webp', 'm4-p2.webp'],
  motor: '3.0L Twin Turbo',
  transmision: 'Automático',
  capacidad: 4,
  extras: 'Launch control, asientos deportivos',
  descripcion: 'Precisión alemana con alma de pista.'
},
//pickups
{
  id: 'pickup-chevy',
  nombre: 'Chevrolet Silverado 2022',
  carpeta: 'pickup-chevy',
  imagenes: ['silverado-p1.webp', 'silverado-p2.webp'],
  motor: '5.3L V8',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Caja amplia, cámara 360',
  descripcion: 'Robusta y lista para el trabajo duro.'
},
{
  id: 'pickup-toyota',
  nombre: 'Toyota Hilux 2023',
  carpeta: 'pickup-toyota',
  imagenes: ['hilux-p1.webp', 'hilux-p2.webp'],
  motor: '2.8L Diesel',
  transmision: 'Manual 4x4',
  capacidad: 5,
  extras: 'Suspensión elevada, control de descenso',
  descripcion: 'Fiabilidad japonesa en cualquier terreno.'
},
{
  id: 'pickup-nissan',
  nombre: 'Nissan Frontier 2022',
  carpeta: 'pickup-nissan',
  imagenes: ['frontier-p1.webp', 'frontier-p2.webp'],
  motor: '3.8L V6',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Pantalla táctil, tracción 4x4',
  descripcion: 'Moderna y capaz para trabajo y aventura.'
},
//elécticos
{
  id: 'electrico-tesla',
  nombre: 'Tesla Model 3',
  carpeta: 'electrico-tesla',
  imagenes: ['model3-p1.webp', 'model3-p2.webp'],
  motor: '100% Eléctrico',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Autopilot, pantalla central',
  descripcion: 'Tecnología futurista y cero emisiones.'
},
{
  id: 'electrico-kia',
  nombre: 'Kia EV6',
  carpeta: 'electrico-kia',
  imagenes: ['ev6-p1.webp', 'ev6-p2.webp'],
  motor: '100% Eléctrico',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Carga ultra rápida, diseño aerodinámico',
  descripcion: 'Estilo y eficiencia eléctrica.'
},
{
  id: 'electrico-hyundai',
  nombre: 'Hyundai Ioniq 5',
  carpeta: 'electrico-hyundai',
  imagenes: ['ioniq5-p1.webp', 'ioniq5-p2.webp'],
  motor: '100% Eléctrico',
  transmision: 'Automático',
  capacidad: 5,
  extras: 'Interior futurista, autonomía extendida',
  descripcion: 'Innovación coreana en movimiento.'
},

]

