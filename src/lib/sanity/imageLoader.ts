import type { ImageLoaderProps } from 'next/image';

/**
 * next/image loader for Sanity CDN URLs built by urlFor(). Configured
 * globally via next.config.ts `images.loaderFile`, which applies to every
 * <Image> in the app (not just SanityImage) — hence the passthrough branch
 * below for local /public paths.
 *
 * Sanity CDN: bypasses the /_next/image proxy — images are served directly
 * from cdn.sanity.io. urlFor() already sets format/crop/hotspot; we only
 * override w and q so that next/image can generate a proper responsive srcset.
 */
function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('https://cdn.sanity.io')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 75));
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  // Local /public paths: a bare passthrough (returning `src` unchanged)
  // would serve every local image at its original file size to every
  // viewport, since a custom loader replaces Next's default resizing
  // entirely once set as `images.loaderFile`. Routing through Next's own
  // /_next/image endpoint instead keeps real resizing/format negotiation —
  // governed by the same deviceSizes/qualities/formats in next.config.ts.
  const params = new URLSearchParams({ url: src, w: String(width), q: String(quality ?? 75) });
  return `/_next/image?${params.toString()}`;
}

// `images.loaderFile` requires a default export — Next imports this file
// directly (not through the app's module graph), so a named export alone
// silently fails at build time with "file is missing default export".
export default sanityLoader;
