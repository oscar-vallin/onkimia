'use client';

import type { ImageLoaderProps } from 'next/image';

/**
 * Loader personalizado para imágenes de Sanity CDN.
 * Evita el doble procesamiento (Sanity + Vercel optimizer) que causaba
 * el "render delay" de 2040ms en el LCP del hero.
 *
 * next/image llama este loader por cada breakpoint del srcset,
 * solicitando el width exacto que necesita cada dispositivo.
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', (quality ?? 75).toString());
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
