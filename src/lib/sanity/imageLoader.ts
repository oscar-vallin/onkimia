import type { ImageLoaderProps } from 'next/image';

/**
 * next/image loader for Sanity CDN URLs built by urlFor().
 * Bypasses the /_next/image proxy — images are served directly from cdn.sanity.io.
 * urlFor() already sets format/crop/hotspot; we only override w and q so that
 * next/image can generate a proper responsive srcset.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io')) {
    return src;
  }
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  return url.toString();
}
