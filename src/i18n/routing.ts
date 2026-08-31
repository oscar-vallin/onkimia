import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales
  locales: ['es', 'en'],

  // Default locale (Mexican market)
  defaultLocale: 'es',

  // Prefix only when NOT the default
  // /nosotros → ES, /en/nosotros → EN
  localePrefix: 'as-needed',

  // Preference cookie (1 year)
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },

  // Off: with localePrefix 'as-needed', enabling this makes next-intl inspect
  // Accept-Language/the locale cookie on every request to '/' before it can
  // decide whether to redirect — which means '/' can never be served as a
  // plain cached static response at the edge/CDN, even though the page
  // itself has no dynamic data. For a ~95%-Mexican-market site that cost
  // isn't worth it; the header's language switcher already covers the
  // minority who want English.
  localeDetection: false,
});

// Types derived for use across the app
export type Locale = (typeof routing.locales)[number];