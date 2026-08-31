import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// The 301 migration redirects (old site → new routes) live in
// next.config.ts (`redirects()`), not here — Next.js resolves them at the
// edge/CDN without going through this middleware, which is faster and
// simpler to maintain than a lookup table in code. See next.config.ts for
// the full list.

export default function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
     '/((?!api|trpc|_next|_vercel|studio|sitemap\\.xml|robots\\.txt|llms\\.txt|opengraph-image|manifest\\.webmanifest|.*\\..*).*)',
  ],
};