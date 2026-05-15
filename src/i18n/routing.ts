import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Locales soportados
  locales: ['es', 'en'],

  // Locale por defecto (mercado mexicano)
  defaultLocale: 'es',

  // Prefijo solo cuando NO es el default
  // /nosotros → ES, /en/nosotros → EN
  localePrefix: 'as-needed',

  // Cookie de preferencia (1 año)
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },

  // Detección automática del navegador en primera visita
  localeDetection: true,
});

// Tipos derivados para usar en toda la app
export type Locale = (typeof routing.locales)[number];