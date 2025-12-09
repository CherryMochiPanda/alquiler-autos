/**
 * src/data/locations.js
 * Provincias, municipios y oficinas con disponibilidad de conductores
 */

export const provinces = [
  { id: 'la_habana', name: 'La Habana' },
  { id: 'matanzas', name: 'Matanzas' },
  { id: 'villa_clara', name: 'Villa Clara' },
  { id: 'sancti_spiritus', name: 'Sancti Spíritus' },
  { id: 'ciego_de_avila', name: 'Ciego de Ávila' },
  { id: 'camagüey', name: 'Camagüey' },
  { id: 'las_tunas', name: 'Las Tunas' },
  { id: 'holguín', name: 'Holguín' },
  { id: 'granma', name: 'Granma' },
  { id: 'santiago_cuba', name: 'Santiago de Cuba' },
  { id: 'guantanamo', name: 'Guantánamo' },
  { id: 'isla_juventud', name: 'Isla de la Juventud' },
]

/**
 * Municipios por provincia
 */
export const municipalities = {
  la_habana: [
    { id: 'playa', name: 'Playa' },
    { id: 'habana_vieja', name: 'Habana Vieja' },
    { id: 'centro_habana', name: 'Centro Habana' },
    { id: 'cerro', name: 'Cerro' },
    { id: 'diez_octubre', name: 'Diez de Octubre' },
  ],
  matanzas: [
    { id: 'matanzas_city', name: 'Matanzas' },
    { id: 'cardenas', name: 'Cárdenas' },
    { id: 'varadero', name: 'Varadero' },
  ],
  villa_clara: [
    { id: 'santa_clara', name: 'Santa Clara' },
    { id: 'cienfuegos', name: 'Cienfuegos' },
  ],
  sancti_spiritus: [
    { id: 'sancti_spiritus_city', name: 'Sancti Spíritus' },
    { id: 'trinidad', name: 'Trinidad' },
  ],
  ciego_de_avila: [
    { id: 'ciego_de_avila_city', name: 'Ciego de Ávila' },
    { id: 'moron', name: 'Morón' },
  ],
  camagüey: [
    { id: 'camagüey_city', name: 'Camagüey' },
    { id: 'santa_lucia', name: 'Santa Lucía' },
  ],
  las_tunas: [
    { id: 'las_tunas_city', name: 'Las Tunas' },
  ],
  holguín: [
    { id: 'holguín_city', name: 'Holguín' },
    { id: 'guardalavaca', name: 'Guardalavaca' },
  ],
  granma: [
    { id: 'bayamo', name: 'Bayamo' },
    { id: 'manzanillo', name: 'Manzanillo' },
  ],
  santiago_cuba: [
    { id: 'santiago_city', name: 'Santiago de Cuba' },
  ],
  guantanamo: [
    { id: 'guantanamo_city', name: 'Guantánamo' },
  ],
  isla_juventud: [
    { id: 'nueva_gerona', name: 'Nueva Gerona' },
  ],
}

/**
 * Oficinas por municipio
 */
export const offices = {
  playa: [
    { id: 'playa_5ta_av', name: '5ta Avenida', address: 'Calle 5ta #1200, Playa', phone: '+53 7 204-3456' },
    { id: 'playa_mirmar', name: 'Miramar', address: 'Calle 70 #3500, Miramar', phone: '+53 7 204-8901' },
  ],
  habana_vieja: [
    { id: 'habana_vieja_obispo', name: 'Obispo', address: 'Calle Obispo #150', phone: '+53 7 861-2345' },
  ],
  centro_habana: [
    { id: 'centro_habana_prado', name: 'Prado', address: 'Paseo del Prado #400', phone: '+53 7 878-3456' },
  ],
  cerro: [
    { id: 'cerro_central', name: 'Central', address: 'Avenida 10 #2200', phone: '+53 7 645-1234' },
  ],
  diez_octubre: [
    { id: 'diez_octubre_vedado', name: 'Vedado', address: 'Calle L #600', phone: '+53 7 834-5678' },
  ],
  matanzas_city: [
    { id: 'matanzas_central', name: 'Central', address: 'Calle Contremaestre #400', phone: '+53 45 241-2345' },
  ],
  cardenas: [
    { id: 'cardenas_central', name: 'Central', address: 'Avenida 1ra #200', phone: '+53 45 521-3456' },
  ],
  varadero: [
    { id: 'varadero_airport', name: 'Aeropuerto', address: 'Terminal Aeropuerto Juan Gualberto Gómez', phone: '+53 45 662-4242' },
    { id: 'varadero_playa', name: 'Playa', address: 'Avenida 1ra #500', phone: '+53 45 661-2345' },
  ],
  santa_clara: [
    { id: 'santa_clara_central', name: 'Central', address: 'Calle Independencia #300', phone: '+53 42 201-2345' },
  ],
  cienfuegos: [
    { id: 'cienfuegos_central', name: 'Central', address: 'Paseo del Prado #100', phone: '+53 43 551-2345' },
  ],
  sancti_spiritus_city: [
    { id: 'sancti_spiritus_central', name: 'Central', address: 'Calle Céspedes #200', phone: '+53 41 322-1234' },
  ],
  trinidad: [
    { id: 'trinidad_central', name: 'Central', address: 'Calle Real #150', phone: '+53 41 999-3456' },
  ],
  ciego_de_avila_city: [
    { id: 'ciego_de_avila_central', name: 'Central', address: 'Avenida Máximo Gómez #300', phone: '+53 33 201-2345' },
  ],
  moron: [
    { id: 'moron_central', name: 'Central', address: 'Calle Taino #200', phone: '+53 33 501-3456' },
  ],
  camagüey_city: [
    { id: 'camagüey_central', name: 'Central', address: 'Calle República #400', phone: '+53 32 291-2345' },
  ],
  santa_lucia: [
    { id: 'santa_lucia_beach', name: 'Playa', address: 'Carretera Playa Santa Lucía km 0', phone: '+53 32 361-2345' },
  ],
  las_tunas_city: [
    { id: 'las_tunas_central', name: 'Central', address: 'Calle Francisco Varona #200', phone: '+53 31 342-1234' },
  ],
  holguín_city: [
    { id: 'holguín_central', name: 'Central', address: 'Calle Maceo #300', phone: '+53 24 481-2345' },
  ],
  guardalavaca: [
    { id: 'guardalavaca_beach', name: 'Playa', address: 'Calle 1ra #500', phone: '+53 24 431-2345' },
  ],
  bayamo: [
    { id: 'bayamo_central', name: 'Central', address: 'Calle General García #300', phone: '+53 23 542-1234' },
  ],
  manzanillo: [
    { id: 'manzanillo_central', name: 'Central', address: 'Avenida Máximo Gómez #200', phone: '+53 23 571-2345' },
  ],
  santiago_city: [
    { id: 'santiago_central', name: 'Central', address: 'Calle Heredia #400', phone: '+53 22 686-2345' },
  ],
  guantanamo_city: [
    { id: 'guantanamo_central', name: 'Central', address: 'Calle Calixto García #200', phone: '+53 21 351-2345' },
  ],
  nueva_gerona: [
    { id: 'nueva_gerona_central', name: 'Central', address: 'Calle 28 #300', phone: '+53 46 322-1234' },
  ],
}

/**
 * Conductores disponibles por oficina y rango de fechas (simulado)
 */
export const driverAvailability = {
  playa_5ta_av: { total: 5, booked: [] },
  playa_mirmar: { total: 3, booked: [] },
  habana_vieja_obispo: { total: 4, booked: [] },
  centro_habana_prado: { total: 2, booked: [] },
  cerro_central: { total: 3, booked: [] },
  diez_octubre_vedado: { total: 4, booked: [] },
  // ... más oficinas
}

/**
 * Obtener municipios para una provincia
 */
export function getMunicipalitiesByProvince(provinceId) {
  return municipalities[provinceId] || []
}

/**
 * Obtener oficinas para un municipio
 */
export function getOfficesByMunicipality(municipalityId) {
  return offices[municipalityId] || []
}

/**
 * Obtener nombre de provincia por ID
 */
export function getProvinceName(provinceId) {
  const province = provinces.find(p => p.id === provinceId)
  return province ? province.name : ''
}

/**
 * Obtener nombre de municipio por ID
 */
export function getMunicipalityName(municipalityId) {
  for (const munis of Object.values(municipalities)) {
    const muni = munis.find(m => m.id === municipalityId)
    if (muni) return muni.name
  }
  return ''
}

/**
 * Obtener nombre de oficina por ID
 */
export function getOfficeName(officeId) {
  for (const officeList of Object.values(offices)) {
    const office = officeList.find(o => o.id === officeId)
    if (office) return office.name
  }
  return ''
}

/**
 * Verificar disponibilidad de conductores para una oficina y rango de fechas
 * @param officeId - ID de la oficina
 * @param pickupDate - Fecha de recogida (ISO string)
 * @param deliveryDate - Fecha de entrega (ISO string)
 * @returns { available: boolean, driversAvailable: number, driversNeeded: number }
 */
export function checkDriverAvailability(officeId, pickupDate, deliveryDate) {
  // TODO: Integrar con API backend para verificar disponibilidad real
  // Por ahora, simulamos que siempre hay disponibilidad
  const availability = driverAvailability[officeId]
  if (!availability) {
    return { available: true, driversAvailable: 1, driversNeeded: 1 }
  }
  return { available: true, driversAvailable: availability.total, driversNeeded: 1 }
}
