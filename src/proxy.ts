import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Redirects 301 desde URLs viejas del sitio actual.
 * Cuando hagamos el lanzamiento, esto preserva SEO histórico.
 */
const REDIRECTS_MAP: Record<string, string> = {
  // Ejemplo: cuando confirmemos URLs viejas, agregar aquí
  // '/es/medicos': '/onkimia-doctors',
  // '/en/consult-colima': '/en/colima',
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── 1. REDIRECTS 301 ───
  if (REDIRECTS_MAP[pathname]) {
    return NextResponse.redirect(
      new URL(REDIRECTS_MAP[pathname], request.url),
      301
    );
  }

  // ─── 2. i18n middleware (next-intl) ───
  return intlMiddleware(request);
}

export const config = {
  matcher: [
     '/((?!api|trpc|_next|_vercel|studio|sitemap\\.xml|robots\\.txt|opengraph-image|manifest\\.webmanifest|.*\\..*).*)',
  ],
};