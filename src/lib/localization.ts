/**
 * Runtime localization helpers — shared by server and client components.
 *
 * Deliberately free of any `sanity` package imports: the Studio's schema
 * helpers live in src/sanity/lib/localization.ts, and importing that module
 * from client components (Header, carousels, forms) would pull the entire
 * Studio dependency graph into the client bundle.
 */

export type Locale = 'es' | 'en';

export type LocalizedString = {
  es: string;
  en: string;
};

export type LocalizedText = LocalizedString;

/**
 * Extracts the value for the active locale,
 * falling back to the other language if it's empty.
 */
export function getLocalized(
  field: LocalizedString | undefined,
  locale: Locale
): string {
  if (!field) return '';
  return field[locale] || field[locale === 'es' ? 'en' : 'es'] || '';
}
