// Central route registry. Import ROUTES instead of hardcoding path strings.
// Update here when slugs change — all references update automatically.
export const ROUTES = {
  home:        '/',
  services:    '/servicios',
  contact:     '/contacto',
  contactForm: '/contacto#contact-form',
  nosotros:    '/nosotros',
  endos:       '/endos',
  cuidare:     '/cuidare',
  doctors:     '/onkimia-doctors',
  colima:      '/colima',
  privacy:     '/aviso-de-privacidad',
  jobBoard:    '/bolsa-de-trabajo',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
