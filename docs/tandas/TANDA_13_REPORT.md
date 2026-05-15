# Tanda 13 — SEO Infrastructure

Fecha: 2026-05-15

## Resumen

- Helper `buildMetadata`: ✓
- sitemap.ts dinámico (estáticas + Sanity): ✓
- robots.ts con bloqueo de /studio y bots LLM: ✓
- opengraph-image.tsx dinámica con branding: ✓
- manifest.ts: ✓
- generateMetadata migrado en 8 páginas: ✓
- /studio robots noindex: ✓
- NEXT_PUBLIC_SITE_URL validado en env.ts: ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/lib/seo/metadata.ts` | Helper `buildMetadata()` — OG, Twitter Cards, canonical, hreflang, robots |
| `src/app/sitemap.ts` | Sitemap dinámico: 8 páginas × 2 locales + fecha real de última vacante |
| `src/app/robots.ts` | robots.txt: bloquea /studio, /api, GPTBot, CCBot |
| `src/app/opengraph-image.tsx` | Imagen OG 1200×630 generada en edge con branding oficial |
| `src/app/manifest.ts` | Web App Manifest básico (PWA ready) |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/lib/env.ts` | `NEXT_PUBLIC_SITE_URL` añadido al schema y al parse |
| `src/app/[locale]/page.tsx` | `generateMetadata` añadido (no existía) usando `buildMetadata` |
| `src/app/[locale]/nosotros/page.tsx` | `generateMetadata` migrado a `buildMetadata` |
| `src/app/[locale]/endos/page.tsx` | Ídem |
| `src/app/[locale]/cuidare/page.tsx` | Ídem |
| `src/app/[locale]/onkimia-doctors/page.tsx` | Ídem |
| `src/app/[locale]/servicios/page.tsx` | Ídem |
| `src/app/[locale]/contacto/page.tsx` | Ídem (eliminado fetch de OG image en generateMetadata — ahora usa imagen dinámica global) |
| `src/app/[locale]/bolsa-de-trabajo/page.tsx` | Ídem |
| `src/app/studio/layout.tsx` | `robots: 'noindex, nofollow'` → `robots: { index: false, follow: false }` |

## Estructura de metadata generada

Cada página produce automáticamente:
- `<title>` y `<meta name="description">`
- `<link rel="canonical">` con URL correcta por locale (ES sin prefijo, EN con /en)
- `<link rel="alternate" hreflang="es-MX">`, `hreflang="en-US"`, `hreflang="x-default"`
- `<meta property="og:*">` completo (title, description, url, siteName, image, locale, type)
- `<meta name="twitter:*">` (card, title, description, image)
- `<meta name="robots">` con directivas googleBot

## Validación

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓
- `/sitemap.xml`: ✓ (static, prerenderizado)
- `/robots.txt`: ✓ (static, prerenderizado)
- `/opengraph-image`: ✓ (dynamic, edge)
- `/manifest.webmanifest`: ✓ (static, prerenderizado)

## Notas para deploy futuro

- Cambiar `NEXT_PUBLIC_SITE_URL=https://onkimia.com` en Vercel antes del go-live
- Submit `https://onkimia.com/sitemap.xml` a Google Search Console después del deploy
- Considerar Bing Webmaster Tools para México (mercado relevante)
- GPTBot y CCBot bloqueados por defecto — si el cliente quiere presencia en LLMs, eliminar esas reglas
- La imagen OG dinámica se puede personalizar por página en el futuro pasando `ogImage` al helper
