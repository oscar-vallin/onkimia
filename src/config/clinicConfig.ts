/**
 * Static clinic data — single source of truth.
 * Previously sourced from Sanity; now hardcoded here.
 */

// ─── Display config (used by Footer, ContactInfo, Header phone/WhatsApp links) ───

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
    address: 'Beethoven #287, Juan Manuel, 44680 Guadalajara, Jal.',
    addressOneLine: 'Beethoven #287, Juan Manuel, Guadalajara',
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
    whatsappHref: 'https://wa.me/5213123176676',
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

// ─── Structured clinic data (replaces Sanity Clinic[] documents) ───

export interface StaticClinic {
  _id: string;
  slug: string;
  name: { es: string; en: string };
  address: {
    street: string;
    neighborhood?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  geo: { lat: number; lng: number };
  phone?: string;
  whatsapp?: string;
  whatsappEndos?: string;
  whatsappCuidare?: string;
  email?: string;
  isPrimary: boolean;
  description?: { es: string; en: string };
  hours?: Array<{ days: string; opens: string; closes: string }>;
}

export const CLINICS: StaticClinic[] = [
  {
    _id: 'guadalajara',
    slug: 'guadalajara',
    name: { es: 'Onkimia Guadalajara', en: 'Onkimia Guadalajara' },
    address: {
      street: 'Beethoven #287',
      neighborhood: 'Juan Manuel',
      city: 'Guadalajara',
      state: 'Jalisco',
      postalCode: '44680',
      country: 'MX',
    },
    geo: { lat: 20.68096446197789, lng: -103.39180420428036 },
    phone: '+52(33) 4349 0140',
    whatsapp: '5213320331257',
    whatsappEndos: '5213320331257',
    whatsappCuidare: '5213320331257',
    email: 'contacto@onkimia.com',
    isPrimary: true,
  },
  {
    _id: 'colima',
    slug: 'colima',
    name: { es: 'Onkimia Colima', en: 'Onkimia Colima' },
    address: {
      street: 'Av. La Paz #33',
      neighborhood: 'Santa Bárbara Residencial',
      city: 'Colima',
      state: 'Colima',
      postalCode: '28079',
      country: 'MX',
    },
    geo: { lat: 19.264364804663455, lng: -103.71226793130555 },
    phone: '(312) 159 9010',
    whatsapp: '5213123176676',
    email: 'contacto@onkimia.com',
    isPrimary: false,
  },
];
