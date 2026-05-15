'use client';

export const VISITED_COOKIE = 'onkimia_visited';
const VISITED_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

/** Verifica si el usuario ya visitó el sitio. SOLO usar en useEffect (client). */
export function hasVisited(): boolean {
  if (typeof document === 'undefined') return true;
  return document.cookie.split('; ').some((c) => c.startsWith(`${VISITED_COOKIE}=`));
}

/** Marca al usuario como visitado. */
export function markAsVisited(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${VISITED_COOKIE}=true; path=/; max-age=${VISITED_MAX_AGE}; SameSite=Lax`;
}

/** Limpia la cookie de visited (útil en dev para reabrir el modal). */
export function clearVisited(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${VISITED_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
