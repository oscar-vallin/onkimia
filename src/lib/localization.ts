/**
 * Helpers de localización de runtime — compartidos por server y client
 * components.
 *
 * Deliberadamente sin imports del paquete `sanity`: los helpers de schema
 * del Studio viven en src/sanity/lib/localization.ts, e importar ese módulo
 * desde componentes cliente (Header, carousels, forms) metería el grafo del
 * Studio completo en el bundle del cliente.
 */

export type Locale = 'es' | 'en';

export type LocalizedString = {
  es: string;
  en: string;
};

export type LocalizedText = LocalizedString;

/**
 * Extrae el valor en el locale activo,
 * con fallback al otro idioma si está vacío.
 */
export function getLocalized(
  field: LocalizedString | undefined,
  locale: Locale
): string {
  if (!field) return '';
  return field[locale] || field[locale === 'es' ? 'en' : 'es'] || '';
}
