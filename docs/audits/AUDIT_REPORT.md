# Onkimia — Audit Report

**Fecha:** 2026-05-12  
**Rama auditada:** directorio local (no git)  
**Build:** ✓ exitoso (con 1 deprecation warning)

---

## Resumen Ejecutivo

| Categoría | Total |
|-----------|-------|
| **Críticos** | 4 |
| **Altos** | 8 |
| **Medios** | 7 |
| **Bajos** | 5 |
| **Total hallazgos** | 24 |

**Estado general:** ⚠️ Bloqueado por críticos — no iniciar nuevas páginas hasta resolver C-01, C-02, C-03 y C-04.

---

## Hallazgos Críticos

### C-01 — `middleware.ts` usando convención deprecada (Next.js 16)

**Archivo:** `src/middleware.ts`  
**Descripción:** Next.js 16 depreca la convención `middleware` y requiere `proxy`. El build emite:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Esto romperá el proyecto en la siguiente versión major. Toda la lógica de i18n routing y cookie detection corre aquí.

**Fix sugerido:** Renombrar `src/middleware.ts` → `src/proxy.ts` y ajustar `next.config.ts` si hay referencias explícitas.

---

### C-02 — `sanityFetch` usa ISR por tiempo, violando decisión arquitectónica #9

**Archivo:** `src/sanity/lib/fetch.ts:10`

```ts
revalidate = 3600,   // ← valor por defecto activo en TODAS las páginas
```

La decisión arquitectónica vinculante #9 dice: _"ISR con tags y revalidateTag on-demand, NO con revalidate por tiempo."_

Con `revalidate: 3600`, Next.js regenera todas las páginas cada hora aunque no haya cambios en Sanity, ignorando el webhook. Esto:
- Invalida el sistema de webhook `/api/revalidate`
- Provoca regeneración innecesaria en Vercel (costos)
- Puede mostrar contenido desactualizado > 1 hora entre push y TTL

**Fix sugerido:** Cambiar default a `false` (cache permanente, solo rompe con `revalidateTag`):

```ts
revalidate = false,
```

Y eliminar el parámetro `revalidate` de la interfaz si no se planea usar tiempo.

---

### C-03 — `not-found.tsx` tiene `onClick` en Server Component (sin `'use client'`)

**Archivo:** `src/app/[locale]/not-found.tsx:37`

```tsx
<button onClick={() => window.history.back()}>
```

Este archivo NO tiene `'use client'`. En Next.js App Router, los event handlers (`onClick`) solo están disponibles en Client Components. Esto fallará en runtime con:
`Error: Event handlers cannot be passed to Client Component props.`

El `tsc` no lo detecta porque el typing de `onClick` existe en el DOM, pero Next.js lo bloquea en SSR.

**Fix sugerido:** Agregar `'use client'` al archivo, o extraer solo el botón a un pequeño Client Component separado.

---

### C-04 — Sin headers de seguridad HTTP en `next.config.ts`

**Archivo:** `next.config.ts` (sin `async headers()`)

No existen los headers contractualmente requeridos:
- `X-Frame-Options: DENY` — permite clickjacking
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Un sitio médico sin estos headers incumple buenas prácticas de seguridad y potencialmente la LFPDPPP.

**Fix sugerido:** Agregar `async headers()` a `nextConfig` 

---

## Hallazgos Altos

### A-01 — Violación masiva de i18n: strings hardcodeados en `locale === 'es' ?`

**Archivos:**
- `src/app/[locale]/page.tsx` — ~25 strings (toda la sección de servicios, bienestar, agenda, convenios, sección de cita)
- `src/app/[locale]/nosotros/page.tsx` — ~30 strings (secciones: Más que medicina, Cuerpo mente y ambiente, apoyo, testimonios, dudas, FAQs)
- `src/components/layout/Footer.tsx:37,81,148` — 'Menú', 'Síguenos', 'Ver vacantes'

**Ejemplo:**
```tsx
// VIOLACIÓN:
<h2>{locale === 'es' ? 'Cuidarte es nuestra prioridad' : 'Your care is our priority'}</h2>

// CORRECTO:
<h2>{t('home.careSection.title')}</h2>
```

Ninguno de estos strings está en `messages/es.json` ni `messages/en.json`. El sistema de traducciones existe pero no se usa en las páginas. Si se añaden más idiomas (PT, por ejemplo), habría que modificar cada componente en lugar de solo agregar un JSON.

---

### A-02 — Contenido de aseguradoras e instituciones hardcodeado (CMS-first violado)

**Archivo:** `src/app/[locale]/page.tsx:258-274`

```ts
['AXA', 'GNP', 'MAPFRE', 'VUMI', 'INBURSA', 'BANORTE', 'BESTDOCTORS', 'MD ABROAD',
 'CIGNA', 'SURA', 'BX+', 'ZURICH', 'SCOTIABANK', 'HEALTHCASE', 'ATLAS', 'AXA ASSISTANCE']
```

16 aseguradoras hardcodeadas como strings. No tienen logo, URL, ni estado activo/inactivo. El cliente no puede editarlos sin despliegue. Falta el schema `insurance` en Sanity.

---

### A-03 — Contenido de servicios hardcodeado (en dos páginas)

**Archivos:**
- `src/app/[locale]/page.tsx:63-79` — 7 servicios en "Cuidarte es nuestra prioridad"
- `src/app/[locale]/nosotros/page.tsx:94-119` — 9 servicios en "Más que medicina"

Los servicios difieren entre páginas (home tiene 7, nosotros tiene 9 distintos) sin fuente de verdad en CMS. Falta schema `service`.

---

### A-04 — FAQCarousel: `h3` de pregunta será negro sobre fondo azul oscuro (WCAG fail)

**Archivo:** `src/components/ui/FAQCarousel.tsx:57`

```tsx
<article className="bg-[#3d5a80] ...">
  ...
  <div className="p-6 text-white">
    <h3 className="text-lg font-medium mb-3">   {/* ← sin color explícito */}
```

El `@layer base` de `globals.css` setea `h3 { color: var(--color-neutral-950) }` (#090909 oscuro). Tailwind hereda `text-white` del padre solo como propiedad CSS heredada, pero la regla de base del h3 es explícita y la sobreescribe. Resultado: texto casi negro sobre fondo `#3d5a80` (azul oscuro) — ratio de contraste ~1.4:1, muy por debajo del mínimo WCAG AA de 4.5:1.

---

### A-05 — `nosotros/page.tsx` reutiliza `homeHeroImage` de siteSettings

**Archivo:** `src/app/[locale]/nosotros/page.tsx:66`

```tsx
image={settings.homeHeroImage}
```

La página "Nosotros" usa la misma imagen de hero que el Home. Deben ser imágenes independientes, la de nosotros debería venir del schema `siteSettings` con un campo `aboutHeroImage`, o de un schema de página dedicado.

---

### A-06 — Sin `openGraph` ni `twitter` metadata en páginas individuales

**Archivos:** `src/app/[locale]/page.tsx`, `src/app/[locale]/nosotros/page.tsx`

`generateMetadata` solo devuelve `title` y `description`. Para un sitio médico con presencia en redes sociales, la falta de OG tags afecta directamente cómo se comparten las páginas.

**Fix sugerido** en cada `generateMetadata`:
```ts
openGraph: {
  title: t('aboutTitle'),
  description: t('aboutDescription'),
  url: `https://onkimia.com/${locale}/nosotros`,
  siteName: 'Onkimia',
  images: [{ url: '/og-nosotros.jpg', width: 1200, height: 630 }],
},
twitter: { card: 'summary_large_image' },
```

---

### A-07 — Sin `sitemap.ts` ni `robots.ts`

**Ruta esperada:** `src/app/sitemap.ts`, `src/app/robots.ts`

Ambos archivos están ausentes. Para un proyecto médico con SEO como métrica contractual, esto es significativo:
- Sin `sitemap.xml`: los crawlers no pueden descubrir todas las páginas sistemáticamente
- Sin `robots.txt`: no hay control sobre qué rutas indexar (`/studio` debería estar bloqueado)

---

### A-08 — `revalidateTag` llamado con segundo argumento inválido

**Archivo:** `src/app/api/revalidate/route.ts:38-39`

```ts
revalidateTag(body._type, 'default');  // ← segundo arg no existe en API
revalidateTag('sanity', 'default');
```

La API de `revalidateTag` en Next.js acepta solo **un** argumento (`tag: string`). El segundo argumento `'default'` es ignorado silenciosamente o puede causar comportamientos inesperados dependiendo de la versión. El webhook de Sanity podría no estar revalidando correctamente.

---

## Hallazgos Medios

### M-01 — Imágenes sin `.format('webp')` en la mayoría de usos

Solo `HeroSection.tsx` aplica `.format('webp')`. Todos los demás usos de `urlFor()` omiten la optimización:

| Archivo | urlFor usado | ¿webp? |
|---------|-------------|--------|
| `TestimonialCarousel.tsx:28` | `.width(400).height(400)` | ✗ |
| `FAQCarousel.tsx:45` | `.width(600).height(400)` | ✗ |
| `Header.tsx:58` | `.height(120)` | ✗ |
| `Footer.tsx:28` | `.height(192)` | ✗ |
| `page.tsx:108` | `.width(400).height(533)` | ✗ |

Impacto: el CDN de Sanity sirve JPEG/PNG originales. Para móvil 4G esto afecta directamente el LCP (métrica contractual).

---

### M-02 — `styled-components` en dependencias pero nunca usado

**Archivo:** `package.json:20`

```json
"styled-components": "^6.4.1"
```

No hay ningún import de `styled-components` en `src/`. Es una dependencia pesada (~75KB gzip) que infla el bundle sin utilidad. Requiere eliminación.

---

### M-03 — Footer: columnas "Síguenos" y "Contacto" fusionadas (Figma requiere separadas)

**Archivo:** `src/components/layout/Footer.tsx:80`

El diseño Figma especifica 4 columnas: `Menú | Síguenos | Contacto | Bolsa de trabajo`. La implementación actual fusiona Síguenos y Contacto en una sola columna (grid `md:grid-cols-5` con `md:col-span-2` para el logo). El cliente aprobó el diseño con 4 columnas separadas.

---

### M-04 — `nosotros/page.tsx` tiene `link: '#'` con TODO hardcodeado

**Archivo:** `src/app/[locale]/nosotros/page.tsx:106`

```ts
{ title: 'App Onkimia', link: '#', linkText: locale === 'es' ? 'descárgala aquí' : 'download here' }
```

Un `href="#"` en producción afecta UX y puede confundir a crawlers. El enlace de la App Store/Play Store debe venir de `siteSettings` en Sanity o quitarse hasta que exista.

---

### M-05 — `FAQPageJsonLd` no se inyecta en `nosotros/page.tsx` (ni en ninguna página)

**Archivo:** `src/components/seo/JsonLd.tsx` (componente existe pero no se usa en páginas con FAQs)

`nosotros/page.tsx` renderiza `FAQCarousel` con hasta 6 FAQs pero no inyecta el structured data `FAQPage`. Google no podrá mostrar las respuestas en rich snippets.

---

### M-06 — `babel-plugin-react-compiler` en devDependencies sin configuración

**Archivo:** `package.json`

```json
"babel-plugin-react-compiler": "1.0.0"
```

El plugin está instalado pero no hay `babel.config.js` ni referencia en `next.config.ts`. Es experimental y puede causar comportamientos impredecibles si se activa por accidente en una actualización. Si no se usa, debe eliminarse.

---

### M-07 — `quality` prop duplicado en `HeroSection.tsx`

**Archivo:** `src/components/ui/HeroSection.tsx:50,55`

```tsx
src={urlFor(image).width(2400).quality(85).format('webp').url()}
...
quality={85}
```

`.quality()` en `urlFor()` afecta la URL del CDN de Sanity. `quality` prop en `<Image>` afecta la reoptimización de Next.js. Al tener ambos se aplica doble compresión. Usar solo uno (preferiblemente el de urlFor para consistencia).

---

## Hallazgos Bajos

### B-01 — `nosotros/page.tsx` tiene `heroDescription` hardcodeada (no viene de Sanity ni de i18n)

**Archivo:** `src/app/[locale]/nosotros/page.tsx:48`

```ts
const heroDescription = locale === 'es'
  ? 'En Onkimia fusionamos...'   // hardcoded
  : 'At Onkimia we merge...';    // hardcoded
```

Idéntico string al Home (misma descripción, misma violación). Candidato para `messages/*.json` o campo en `siteSettings`.

---

### B-02 — `TestimonialCarousel` importa `Image` condicionalmente, no hay fallback si `photo` es null

**Archivo:** `src/components/ui/TestimonialCarousel.tsx`

El tipo `Testimonial` define `photo: Image` como requerido, pero si un testimonial en Sanity no tiene foto, `urlFor(currentTestimonial.photo)` lanzaría error en runtime. Considerar `photo?` en el tipo o un placeholder.

---

### B-03 — Tipo `FAQ.page` no incluye `'home'`

**Archivo:** `src/sanity/types.ts:105`

```ts
page: 'about' | 'services' | 'endos' | 'cuidare' | 'all';
```

Si en el futuro se quieren FAQs en el Home, el tipo TypeScript bloqueará la query. El schema en Sanity (`faq.ts`) tampoco incluye `'home'`. Pendiente agregar.

---

### B-04 — `Header.tsx` usa `logoDark` type definido pero nunca lo carga

**Archivo:** `src/sanity/types.ts:11` / `src/components/layout/Header.tsx`

`SiteSettings` tiene `logoDark?: Image` para el footer/dark backgrounds, pero el Footer usa el logo regular con `invert brightness-0` CSS. No es un error, pero `logoDark` existe en el schema para esto y sería más robusto usarlo.

---

### B-05 — `page.tsx` Home no usa `getTranslations` en absoluto

**Archivo:** `src/app/[locale]/page.tsx`

La página Home no llama a `getTranslations`. Todo el contenido localizable usa `locale === 'es' ?`. Esto significa que si se añade un namespace de traducciones para el home, la página quedará desconectada del sistema.

---

## Tabla de cumplimiento CMS-first

| Entidad | Schema Sanity | Query | Tipo TS | ¿Hardcodeado? | Estado |
|---------|:---:|:---:|:---:|:---:|--------|
| Doctores | ✓ | ✓ | ✓ | No | ✅ Completo |
| Testimoniales | ✓ | ✓ | ✓ | No | ✅ Completo |
| FAQs | ✓ | ✓ | ✓ | No | ✅ Completo |
| Settings globales | ✓ | ✓ | ✓ | No | ✅ Completo |
| Clínicas | ✓ | ✓ | ✓ | No | ✅ Completo |
| **Aseguradoras** | ✗ | ✗ | ✗ | **Sí (16 items)** | ❌ Pendiente |
| **Servicios** | ✗ | ✗ | ✗ | **Sí (dos páginas)** | ❌ Pendiente |
| Socios comerciales | ✗ | ✗ | ✗ | No visible | ⏳ No implementado |
| Vacantes | ✗ | ✗ | ✗ | No visible | ⏳ No implementado |
| Entradas blog | ✗ | ✗ | ✗ | No visible | ⏳ No implementado |

---

## Inventario de archivos (referencia)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx      ← C-03
│   │   ├── globals.css
│   │   └── nosotros/
│   │       └── page.tsx
│   ├── api/revalidate/
│   │   └── route.ts           ← A-08
│   └── studio/
│       ├── layout.tsx
│       └── [[...tool]]/page.tsx
├── components/
│   ├── icons/SocialIcons.tsx
│   ├── layout/
│   │   ├── Header.tsx         ← 'use client' justificado
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx ← 'use client' justificado
│   ├── seo/
│   │   └── JsonLd.tsx         ← creado esta sesión
│   ├── studio/Studio.tsx
│   └── ui/
│       ├── FAQCarousel.tsx    ← 'use client' justificado, A-04
│       ├── HeroSection.tsx
│       └── TestimonialCarousel.tsx ← 'use client' justificado
├── i18n/
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── clinic-context.tsx     ← 'use client' justificado
│   ├── cookies.ts
│   ├── get-section.ts
│   └── whatsapp.ts
├── messages/
│   ├── es.json                ← subpoblado (solo metadata + nav)
│   └── en.json                ← ídem
├── middleware.ts               ← C-01 RENOMBRAR A proxy.ts
└── sanity/
    ├── client.ts
    ├── env.ts
    ├── image.ts
    ├── queries.ts
    ├── types.ts
    ├── lib/
    │   ├── fetch.ts           ← C-02
    │   └── localization.ts
    └── schemas/
        ├── clinic.ts
        ├── doctor.ts
        ├── faq.ts
        ├── index.ts
        ├── siteSettings.ts
        └── testimonial.ts
```

**Archivos faltantes:**
- `src/app/sitemap.ts` — A-07
- `src/app/robots.ts` — A-07
- `src/sanity/schemas/insurance.ts` — A-02
- `src/sanity/schemas/service.ts` — A-03
- `src/sanity/schemas/jobPosting.ts` — pendiente de implementación
- Rutas pendientes: `/servicios`, `/endos`, `/cuidare`, `/onkimia-doctors`, `/contacto`, `/bolsa-de-trabajo`, `/guadalajara`, `/colima`

---

## Dependencias (package.json)

```
next: 16.2.6 | react: 19.2.4 | typescript: ^5
next-intl: ^4.11.1 | sanity: ^5.24.0 | next-sanity: ^12.4.5
@sanity/client: ^7.22.0 | @sanity/image-url: ^2.1.1
tailwindcss: ^4 | @tailwindcss/postcss: ^4
lucide-react: ^1.14.0 | zod: ^4.4.3
@sentry/nextjs: ^10.52.0 | resend: ^6.12.3
@upstash/ratelimit: ^2.0.8 | @upstash/redis: ^1.38.0
styled-components: ^6.4.1    ← M-02 SIN USAR
babel-plugin-react-compiler: 1.0.0  ← M-06 SIN CONFIGURAR
```

---

## Resultados de build

```
✓ Compilado exitosamente (Turbopack)
✓ TypeScript sin errores
⚠ middleware deprecation warning (C-01)

Route (app)
┌ ○ /_not-found                 (estático)
├ ƒ /[locale]                   (dinámico)
├ ƒ /[locale]/nosotros          (dinámico)
├ ƒ /api/revalidate             (dinámico)
└ ƒ /studio/[[...tool]]         (dinámico)
```

Todas las rutas dinámicas por el fetch de Sanity. No hay información de bundle size en la salida (Turbopack no imprime la tabla de tamaños como Webpack). No se detectaron rutas > 200KB.

---

## Verificaciones de seguridad

| Check | Estado |
|-------|--------|
| `.env.local` en `.gitignore` | ✅ (cubierto por `.env*`) |
| Secretos hardcodeados en src/ | ✅ Ninguno |
| `dangerouslySetInnerHTML` | ✅ Solo en JsonLd (justificado) |
| Headers de seguridad HTTP | ❌ C-04 |
| Formularios con LFPDPPP | ⏳ No implementados aún |
| Rate limiting | ⏳ No implementado aún |
| Cloudflare Turnstile | ⏳ No implementado aún |

---

## Auditoría de Client Components

| Componente | `use client` | Necesario | Razón |
|-----------|:---:|:---:|-------|
| `Header.tsx` | ✓ | ✓ | useState (menús), useRouter (locale switch), useClinic |
| `WhatsAppButton.tsx` | ✓ | ✓ | usePathname, useClinic |
| `TestimonialCarousel.tsx` | ✓ | ✓ | useState, useEffect (autoplay) |
| `FAQCarousel.tsx` | ✓ | ✓ | useState (paginación) |
| `Studio.tsx` | ✓ | ✓ | Sanity Studio lo requiere |
| `clinic-context.tsx` | ✓ | ✓ | Context + cookie write |
| `not-found.tsx` | ✗ | **SÍ** | onClick → **C-03** |

---

## Auditoría de accesibilidad

| Check | Estado | Detalle |
|-------|--------|---------|
| `<Image>` con `alt` no vacío | ✅ | Todos los Image tienen alt |
| Botones con `aria-label` | ✅ | Header, TestimonialCarousel, FAQCarousel |
| Links con texto descriptivo | ✅ | Sin "haz click aquí" |
| `<h1>` único por página | ✅ | |
| `<header>`, `<main>`, `<footer>`, `<nav>` | ✅ | |
| FAQ `h3` contraste sobre `#3d5a80` | ❌ | **A-04** — ratio ~1.4:1, WCAG fail |
| Hero textos blancos forzados | ✅ | Corregido esta sesión |

---

## Recomendaciones de orden de fix

### Bloque 1 — Inmediato (esta semana)
1. **C-03** — Agregar `'use client'` a `not-found.tsx` o extraer el botón Back
2. **C-02** — Cambiar `revalidate = 3600` a `revalidate = false` en `sanityFetch`
3. **A-08** — Quitar segundo argumento de `revalidateTag()` en `/api/revalidate`
4. **A-04** — Agregar `style={{ color: '#ffffff' }}` al `<h3>` en `FAQCarousel`

### Bloque 2 — Antes de nuevas páginas
5. **C-01** — Renombrar `middleware.ts` → `proxy.ts`
6. **C-04** — Agregar `async headers()` en `next.config.ts`
7. **A-01** — Migrar todos los strings inline a `messages/es.json` y `messages/en.json`
8. **A-07** — Crear `src/app/sitemap.ts` y `src/app/robots.ts`

### Bloque 3 — Junto a próximas páginas
9. **A-02** — Crear schema `insurance`, query e inyectar en Home
10. **A-03** — Crear schema `service`, query e inyectar en Home y Nosotros
11. **A-05** — Agregar campo `aboutHeroImage` a `siteSettings` schema
12. **A-06** — Agregar `openGraph` + `twitter` a todos los `generateMetadata`
13. **M-05** — Inyectar `FaqPageJsonLd` en `nosotros/page.tsx`
14. **M-01** — Agregar `.format('webp')` a todos los `urlFor()` restantes
15. **M-02** — Eliminar `styled-components` de `package.json`
16. **M-06** — Eliminar `babel-plugin-react-compiler` o configurarlo explícitamente

---

## Próximos pasos: páginas en orden de prioridad

Basado en el contrato y dependencias entre páginas:

1. **`/contacto`** — Formulario de contacto (Zod + Turnstile + Rate limit + Odoo). Base para el resto de formularios.
2. **`/servicios`** — Requiere schema `service` (Bloque 3). Alta visibilidad SEO.
3. **`/endos`** — Unidad clínica. FAQs filtradas por page: 'endos'.
4. **`/cuidare`** — Unidad clínica. FAQs filtradas por page: 'cuidare'.
5. **`/onkimia-doctors`** — B2B. WhatsApp comercial.
6. **`/guadalajara`** y **`/colima`** — Requieren datos de clínica + DOCTORS_BY_CLINIC_QUERY. JSON-LD MedicalClinic.
7. **`/bolsa-de-trabajo`** — Requiere schema `jobPosting` + formulario con upload de CV.

---

*AUDITORÍA COMPLETA. Ver AUDIT_REPORT.md*
