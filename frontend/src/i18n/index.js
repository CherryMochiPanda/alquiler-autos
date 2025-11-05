import { createI18n } from 'vue-i18n'

const messages = {
  es: {
    appName: 'AutoRent',
    nav: {
      home: 'Inicio',
      catalog: 'Catálogo',
      account: 'Mi cuenta',
      admin: 'Administración',
      verMas: 'Ver más',
      theme: 'Tema'
    },
    navbar: {
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      langSelectLabel: 'Selector de idioma',
      toggleDarkOn: 'Activar tema oscuro',
      toggleDarkOff: 'Desactivar tema oscuro'
    },
    home: {
      hero: {
        title: 'AutoRent',
        subtitle: 'Tu viaje comienza aquí. Renta el auto ideal con un solo clic.',
        ctaCatalog: 'Ver Catálogo',
        ctaReserve: 'Reservar Ahora'
      },
      features: {
        varietyTitle: 'Variedad de Autos',
        varietyText: 'Desde compactos hasta SUVs, tenemos el vehículo perfecto para cada ocasión.',
        fastTitle: 'Reservas Rápidas',
        fastText: 'Proceso simple, sin complicaciones. Reserva en minutos desde cualquier dispositivo.',
        priceTitle: 'Precios Transparentes',
        priceText: 'Sin cargos ocultos. Lo que ves es lo que pagas, siempre.'
      },
      howItWorks: '¿Cómo funciona?',
      steps: {
        explore: 'Explora el catálogo',
        pickDates: 'Elige fechas',
        confirm: 'Confirma tu reserva',
        enjoy: '¡Disfruta tu auto!'
      },
      stepsDesc: {
        explore: 'Navega por nuestra selección y elige el auto que más te guste.',
        pickDates: 'Selecciona las fechas de inicio y fin para tu reserva.',
        confirm: 'Revisa los detalles y confirma la reserva de forma rápida.',
        enjoy: 'Recoge el auto y disfruta tu viaje.'
      },
      featured: 'Autos destacados',
      featuredBtn: 'Ver',
      testimonials: 'Lo que dicen nuestros clientes'
    },
    catalog: {
      categories: {
        sedan: 'Sedán',
        suv: 'SUV',
        deportivo: 'Deportivo',
        electrico: 'Eléctrico',
        pickup: 'Pickup',
        default: 'Otros'
      },
      seeMore: 'Ver más',
      back: 'Volver'
    },
    reserva: {
      title: 'Reserve Car',
      placeholders: {
        name: 'Your name',
        email: 'Email',
        phone: 'Phone',
        dni: 'Document number'
      },
      errors: {
        name: 'Only letters, minimum 2 characters.',
        phone: 'Invalid phone. Minimum 8 digits.',
        dni: 'Document must have 11 digits.',
        dateEnd: 'End date must be after start date.',
        dateStart: "Start date can't be before today."
      },
      paymentComing: 'Payment method (coming soon)',
      days: 'Days',
      estimated: 'Estimated price',
      confirm: 'Confirm reservation'
    },
    login: {
      title: 'Login',
      placeholders: {
        email: 'Email',
        password: 'Password'
      },
      errors: {
        email: 'Must be a valid Gmail address.',
        password: 'Minimum 8 characters, 1 uppercase and 1 number.'
      },
      submit: 'Sign in',
      noAccount: "Don't have an account? Create one"
    },
    signup: {
      title: 'Crear cuenta',
      placeholders: {
        name: 'Nombre de usuario',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirmPassword: 'Repetir contraseña'
      },
      errors: {
        passwordMismatch: 'Las contraseñas no coinciden'
      },
      submit: 'Registrarse',
      haveAccount: '¿Ya tienes cuenta? Iniciar sesión'
    },
    reserva: {
      title: 'Reservar Auto',
      placeholders: {
        name: 'Tu nombre',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        dni: 'Número de documento'
      },
      errors: {
        name: 'Solo letras, mínimo 2 caracteres.',
        phone: 'Teléfono inválido. Mínimo 8 dígitos.',
        dni: 'DNI debe tener 11 dígitos.',
        dateEnd: 'La fecha final debe ser posterior a la de inicio.',
        dateStart: 'La fecha de inicio no puede ser anterior a hoy.'
      },
      paymentComing: 'Método de pago (próximamente)',
      days: 'Días',
      estimated: 'Precio estimado',
      confirm: 'Confirmar reserva'
    },
    reservaMessages: {
      confirmed: '¡Reserva confirmada para el {car}!\nDel {start} al {end} ({days} días)\nTotal estimado: ${total}'
    },
    footer: {
      copyright: '© {year} AutoRent. Todos los derechos reservados.'
    },
    reservaFallback: {
      notFound: 'No se encontró el auto seleccionado, para acceder a las reservaciones debería visitar primero nuestro catálogo de autos',
      back: 'Volver al catálogo'
    },
    
    login: {
      notRegistered: 'Correo no registrado.',
      wrongPassword: 'Contraseña incorrecta.',
      welcome: 'Bienvenido, {name}'
    },
    account: {
      title: 'Mi cuenta',
      labels: {
        name: 'Nombre',
        email: 'Correo',
        role: 'Rol'
      },
      role: {
        adminDemo: 'Admin (demo)',
        user: 'Usuario'
      },
      logout: 'Cerrar sesión',
      admin: {
        add: 'Hacer admin (demo)',
        remove: 'Quitar admin (demo)'
      },
      demoTitle: 'Iniciar sesión / Crear cuenta (demo)',
      placeholders: {
        name: 'Nombre',
        email: 'Correo electrónico',
        password: 'Contraseña'
      },
      login: 'Iniciar sesión (demo)',
      signup: 'Crear cuenta (demo)',
      hint: 'Demo: cualquier email sirve. Si el correo contiene "admin" se marcará como admin.',
      errors: {
        emailRequired: 'Introduce un correo'
      }
    },
    admin: {
      notAuthorized: {
        title: 'No autorizado',
        message: 'Debes estar autenticado como administrador para ver esta página.'
      },
      backHome: 'Volver al inicio',
      panelTitle: 'Panel de administración (demo)',
      users: {
        title: 'Usuarios registrados (demo)',
        headers: {
          name: 'Nombre',
          email: 'Correo',
          role: 'Rol',
          actions: 'Acciones'
        },
        actions: {
          makeAdmin: 'Hacer admin',
          remove: 'Eliminar',
          revokeAdmin: 'Quitar admin'
        }
      },
      cars: {
        title: 'Vehículos',
        actions: {
          remove: 'Eliminar',
          edit: 'Editar',
          add: 'Agregar vehículo'
        },
        form: {
          nombre: 'Nombre',
          carpeta: 'Carpeta',
          cover: 'Imagen de portada (ruta)',
          imagenes: 'Imágenes (coma separadas)',
          imagenesHint: 'Ej: img1.jpg, img2.jpg',
          descripcion: 'Descripción',
          motor: 'Motor',
          transmision: 'Transmisión',
          capacidad: 'Capacidad',
          extras: 'Extras',
          destacado: 'Destacado',
          save: 'Guardar',
          cancel: 'Cancelar'
        },
        actions: {
          remove: 'Eliminar'
        },
        messages: {
          removed: 'Vehículo {name} eliminado.',
          saved: 'Vehículo {name} guardado.'
        }
      },
      alertUserNowAdmin: '{email} ahora es admin (demo)',
      alertUserRevoked: '{email} ya no es admin (demo)',
      refresh: 'Refrescar',
      exportUsers: 'Exportar usuarios',
      exportSuccess: 'Usuarios copiados al portapapeles',
      exportFail: 'Error al exportar usuarios',
      exportPrompt: 'Copia manualmente los datos de usuarios:',
      refreshed: 'Datos actualizados'
    },
    detalle: {
      labels: {
        motor: 'Motor',
        transmission: 'Transmisión',
        capacity: 'Capacidad',
        people: 'personas',
        extras: 'Extras'
      },
      reserveBtn: 'Reservar este auto',
      notFound: {
        title: 'Auto no encontrado',
        message: 'El auto que intentas ver no está disponible.'
      },
      backToCatalog: 'Volver al catálogo'
    }
  },
  en: {
    appName: 'AutoRent',
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      account: 'My Account',
      admin: 'Admin',
      verMas: 'See more',
      theme: 'Theme'
    },
    home: {
      hero: {
        title: 'AutoRent',
        subtitle: 'Your trip starts here. Rent the ideal car with one click.',
        ctaCatalog: 'View Catalog',
        ctaReserve: 'Reserve Now'
      },
      features: {
        varietyTitle: 'Car Variety',
        varietyText: 'From compacts to SUVs, we have the perfect vehicle for every occasion.',
        fastTitle: 'Fast Bookings',
        fastText: 'Simple process, no hassle. Book in minutes from any device.',
        priceTitle: 'Transparent Pricing',
        priceText: 'No hidden fees. What you see is what you pay.'
      },
      howItWorks: 'How it works',
      steps: {
        explore: 'Explore the catalog',
        pickDates: 'Pick dates',
        confirm: 'Confirm your booking',
        enjoy: 'Enjoy your car!'
      },
      stepsDesc: {
        explore: 'Browse our selection and pick the car you like the most.',
        pickDates: 'Choose start and end dates for your booking.',
        confirm: 'Review details and confirm your booking quickly.',
        enjoy: 'Pick up the car and enjoy your trip.'
      },
      featured: 'Featured cars',
      featuredBtn: 'View',
      testimonials: 'What our customers say'
    },
    catalog: {
      categories: {
        sedan: 'Sedan',
        suv: 'SUV',
        deportivo: 'Sports',
        electrico: 'Electric',
        pickup: 'Pickup',
        default: 'Others'
      },
      seeMore: 'See more',
      back: 'Back'
    },
    signup: {
      title: 'Create account',
      placeholders: {
        name: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password'
      },
      errors: {
        passwordMismatch: "Passwords don't match"
      },
      submit: 'Sign up',
      haveAccount: 'Already have an account? Sign in'
    },
    footer: {
      copyright: '© {year} AutoRent. All rights reserved.'
    },
    reservaFallback: {
      notFound: 'The selected car was not found. To make reservations first visit our catalog.',
      back: 'Back to catalog'
    },
    navbar: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langSelectLabel: 'Language selector',
      toggleDarkOn: 'Enable dark theme',
      toggleDarkOff: 'Disable dark theme'
    },
    login: {
      notRegistered: 'Email not registered.',
      wrongPassword: 'Incorrect password.',
      welcome: 'Welcome, {name}'
    },
    reservaMessages: {
      confirmed: 'The reservation is confirmed for {car}!\nFrom {start} to {end} ({days} days)\nEstimated total: ${total}'
    },
    account: {
      title: 'My Account',
      labels: {
        name: 'Name',
        email: 'Email',
        role: 'Role'
      },
      role: {
        adminDemo: 'Admin (demo)',
        user: 'User'
      },
      logout: 'Sign out',
      admin: {
        add: 'Make admin (demo)',
        remove: 'Remove admin (demo)'
      },
      demoTitle: 'Sign in / Create account (demo)',
      placeholders: {
        name: 'Name',
        email: 'Email',
        password: 'Password'
      },
      login: 'Sign in (demo)',
      signup: 'Sign up (demo)',
      hint: 'Demo: any email works. Email containing "admin" will be marked as admin.',
      errors: {
        emailRequired: 'Please enter an email'
      }
    },
    admin: {
      notAuthorized: {
        title: 'Not authorized',
        message: 'You must be signed in as an administrator to view this page.'
      },
      backHome: 'Back to home',
      panelTitle: 'Administration panel (demo)',
      users: {
        title: 'Registered users (demo)',
        headers: {
          name: 'Name',
          email: 'Email',
          role: 'Role',
          actions: 'Actions'
        },
        actions: {
          makeAdmin: 'Make admin',
          remove: 'Remove',
          revokeAdmin: 'Revoke admin'
        }
      },
      cars: {
        title: 'Vehicles',
        actions: {
          remove: 'Remove',
          edit: 'Edit',
          add: 'Add vehicle'
        },
        form: {
          nombre: 'Name',
          carpeta: 'Folder',
          cover: 'Cover image (path)',
          imagenes: 'Images (comma separated)',
          imagenesHint: 'E.g.: img1.jpg, img2.jpg',
          descripcion: 'Description',
          motor: 'Engine',
          transmision: 'Transmission',
          capacidad: 'Capacity',
          extras: 'Extras',
          destacado: 'Featured',
          save: 'Save',
          cancel: 'Cancel'
        },
        actions: {
          remove: 'Remove'
        },
        messages: {
          removed: 'Vehicle {name} removed.',
          saved: 'Vehicle {name} saved.'
        }
      },
      alertUserNowAdmin: '{email} is now admin (demo)',
      alertUserRevoked: '{email} is no longer admin (demo)',
      refresh: 'Refresh',
      exportUsers: 'Export users',
      exportSuccess: 'Users copied to clipboard',
      exportFail: 'Failed to export users',
      exportPrompt: 'Manually copy the users data:',
      refreshed: 'Data refreshed'
    },
    detalle: {
      labels: {
        motor: 'Engine',
        transmission: 'Transmission',
        capacity: 'Capacity',
        people: 'people',
        extras: 'Extras'
      },
      reserveBtn: 'Reserve this car',
      notFound: {
        title: 'Car not found',
        message: 'The car you are trying to view is not available.'
      },
      backToCatalog: 'Back to catalog'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages
})

export default i18n
