/**
 * Static clinic contact data — phone, WhatsApp, email, address per location.
 *
 * Source of truth for this data is THIS FILE, not Sanity. Sanity's `Clinic`
 * documents also carry phone/address fields (used elsewhere for booking
 * flows and the primary-clinic footer fallback), so if those ever drift
 * apart, this file wins for anything reading via `getClinicConfig`.
 */

export const clinicConfig = {
  guadalajara: {
    slug: 'guadalajara' as const,
    name: 'Onkimia Guadalajara',
    shortName: 'Guadalajara',
    phone: '(33) 4349 0140',
    phoneHref: 'tel:+523343490140',
    whatsapp: null,
    whatsappHref: null,
    email: 'contacto@onkimia.com',
    address: 'Beethoven 287, Juan Manuel, 44680 Guadalajara, Jal.',
    addressOneLine: 'Beethoven 287, Juan Manuel, Guadalajara',
    mapsUrl: 'https://maps.google.com/?q=Beethoven+287+Juan+Manuel+44680+Guadalajara+Jalisco',
    city: 'Guadalajara',
    state: 'Jalisco',
  },
  colima: {
    slug: 'colima' as const,
    name: 'Onkimia Colima',
    shortName: 'Colima',
    phone: '(312) 159 9010',
    phoneHref: 'tel:+523121599010',
    whatsapp: '312 317 6676',
    whatsappHref: 'https://wa.me/523123176676',
    email: 'contacto@onkimia.com',
    address: 'Av. La Paz #33, Santa Bárbara Residencial, C.P. 28079, Colima',
    addressOneLine: 'Av. La Paz #33, Santa Bárbara, Colima',
    mapsUrl: 'https://maps.google.com/?q=Av+La+Paz+33+Santa+Barbara+Residencial+28079+Colima',
    city: 'Colima',
    state: 'Colima',
  },
} as const;

export type ClinicSlug = keyof typeof clinicConfig;
export type ClinicConfig = (typeof clinicConfig)[ClinicSlug];

export function getClinicConfig(slug: ClinicSlug | string | null): ClinicConfig {
  if (slug === 'colima') return clinicConfig.colima;
  return clinicConfig.guadalajara; // default
}
