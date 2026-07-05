import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases Tailwind resolviendo conflictos: la última gana
 * (p. ej. cn('mb-5', 'mb-14') → 'mb-14'). Úsalo en componentes que
 * exponen props *ClassName para que los overrides sean deterministas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
