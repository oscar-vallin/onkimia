import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Los redirects 301 de migración (sitio viejo → nuevas rutas) viven en
// next.config.ts (`redirects()`), no aquí — Next.js los resuelve a nivel de
// edge/CDN sin pasar por este middleware, lo que es más rápido y más simple
// de mantener que una tabla en código. Ver next.config.ts para la lista.

export default function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
     '/((?!api|trpc|_next|_vercel|studio|sitemap\\.xml|robots\\.txt|opengraph-image|manifest\\.webmanifest|.*\\..*).*)',
  ],
};