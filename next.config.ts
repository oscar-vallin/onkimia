import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Self-hosting (servidor del IT de Onkimia): empaqueta el server con solo
  // las deps de producción en .next/standalone — se despliega copiando esa
  // carpeta + .next/static + public y corriendo `node server.js`.
  // Vercel lo soporta sin cambios, así que no afecta los deploys actuales.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    // Limit srcset breakpoints to what our target browsers actually need.
    // Removing 2048 and 3840 prevents over-serving on retina displays beyond 1920px.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    qualities: [75, 80, 82, 85],
    // Cache optimized images for 30 days (default is 60 s).
    minimumCacheTTL: 2592000,
    formats: ['image/webp'],
  },
  experimental: {
    // Inline the CSS into the HTML instead of <link> stylesheets — removes the
    // render-blocking CSS requests from the LCP critical path (~560 ms on slow
    // 4G per Lighthouse). Our total CSS is ~18 KB, so the HTML-size tradeoff is
    // favorable. (optimizeCss/critters only applies to the Pages Router.)
    inlineCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@sanity/image-url',
    ],
  },
  // Migración SEO desde el sitio anterior (Laravel, estructura /es/* y /en/*
  // con slugs distintos) hacia las rutas de este sitio (ES sin prefijo, EN
  // bajo /en/*). Mapeo obtenido crawleando onkimia.com en vivo. www→apex y
  // http→https son responsabilidad del reverse proxy/DNS del servidor, no de
  // esta app — ver docs/GUIA-INFRAESTRUCTURA-IT.md, sección 5.
  //
  // Tres destinos son suposiciones razonables sin URL vieja equivalente
  // exacta en el sitio nuevo — confirmar/ajustar si el cliente da otra
  // instrucción:
  //  - /es/medicos, /en/doctors  → home (el grid de doctores vive ahí; NO
  //    usar /onkimia-doctors, que es la página B2B de reclutamiento, no el
  //    directorio de pacientes que era la intención de la URL vieja)
  //  - /es/pacientes, /en/patients → /servicios
  //  - /es/blog/*, /en/blog/* → home (interino; el sitio nuevo no tiene blog)
  async redirects() {
    return [
      // ── Español — renombres específicos (antes del catch-all) ──
      { source: '/es/equipo',      destination: '/nosotros',  permanent: true },
      { source: '/es/app-onkimia', destination: '/nosotros',  permanent: true },
      { source: '/es/medicos',     destination: '/',          permanent: true },
      { source: '/es/pacientes',   destination: '/servicios', permanent: true },
      { source: '/es/blog',        destination: '/',          permanent: true },
      { source: '/es/blog/:slug*', destination: '/',          permanent: true },

      // ── Español — catch-all: /es/* → /* (mismo slug, sin prefijo) ──
      { source: '/es',        destination: '/',        permanent: true },
      { source: '/es/:path*', destination: '/:path*',  permanent: true },

      // ── Inglés — renombres de slug (el sitio nuevo no tiene equivalente 1:1) ──
      { source: '/en/about-us',        destination: '/en/nosotros', permanent: true },
      { source: '/en/medical-services', destination: '/en/servicios', permanent: true },
      { source: '/en/contact',         destination: '/en/contacto', permanent: true },
      { source: '/en/consult-colima',  destination: '/en/colima',   permanent: true },
      { source: '/en/team',            destination: '/en/nosotros', permanent: true },
      { source: '/en/app-onkimia',     destination: '/en/nosotros', permanent: true },
      { source: '/en/doctors',         destination: '/en',          permanent: true },
      { source: '/en/patients',        destination: '/en/servicios', permanent: true },
      { source: '/en/blog',            destination: '/en',          permanent: true },
      { source: '/en/blog/:slug*',     destination: '/en',          permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);