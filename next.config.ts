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
    // Global loader (src/lib/sanity/imageLoader.ts) — lets SanityImage
    // (PageHero, Wellness, DoctorCard, ConveniosEditorial, ...) drop its
    // 'use client' directive: it previously existed only to pass a loader
    // *function* as a prop, which crosses the server/client serialization
    // boundary and forces a client component. Configuring the loader here
    // instead applies it to every <Image> in the app, Sanity or local.
    loaderFile: './src/lib/sanity/imageLoader.ts',
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
    serverActions: {
      // El formulario de bolsa de trabajo acepta CVs de hasta 5 MB
      // (MAX_FILE_SIZE_BYTES en src/lib/schemas/jobApplication.ts), pero el
      // default de Next para Server Actions es 1 MB: sin esto, cualquier CV
      // más pesado se rechaza con un 413 ANTES de que corra el action, y el
      // usuario ve un error genérico que ninguna validación nuestra explica.
      // 6 MB deja margen para el overhead del multipart y el resto de campos.
      bodySizeLimit: '6mb',
    },
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
      {
        // Hero HLS fragments — content-addressed by nature of the build
        // (a rebuild produces a new file set under the same names only when
        // the source footage changes), so caching them as immutable is safe:
        // an updated build should ship under a new path if it ever needs to
        // bust this cache, not rely on revalidation.
        source: '/heros/hls/:file(init\\.mp4|segment_.*\\.m4s)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          // Next doesn't recognize the .m4s extension and defaults to
          // application/octet-stream. Functionally harmless — hls.js fetches
          // these as raw bytes and hands them to SourceBuffer.appendBuffer(),
          // which never inspects Content-Type — but they're valid ISO-BMFF
          // fragments (same family as init.mp4), so labeling them correctly
          // costs nothing and avoids surprises for any CDN/proxy in front of
          // this that DOES branch on MIME type.
          { key: 'Content-Type', value: 'video/mp4' },
        ],
      },
      {
        // The manifest gets a short, revalidating cache instead — it's the
        // one file a future build could legitimately want to change without
        // renaming the whole HLS directory (e.g. re-cutting segment
        // boundaries while keeping the same init/segment filenames).
        //
        // The explicit Content-Type matters, not just as tidiness: Next
        // doesn't know the MIME type for .m3u8 and would otherwise serve it
        // as application/octet-stream (or let the platform guess), and
        // Safari's *native* HLS engine silently refuses to play a manifest
        // that isn't served as application/vnd.apple.mpegurl — it fails
        // closed with no console error, which reads as "the video is just
        // broken" rather than "the header is wrong."
        source: '/heros/hls/:file*.m3u8',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300' },
          { key: 'Content-Type', value: 'application/vnd.apple.mpegurl' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);