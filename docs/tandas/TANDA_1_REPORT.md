# Tanda 1 — Reporte de fixes críticos

**Fecha:** 2026-05-12  

---

## Resumen

| Fix | Descripción | Estado |
|-----|-------------|--------|
| C-01 | `middleware.ts` → `proxy.ts` | ✓ |
| C-02 | `sanityFetch` revalidate default `3600` → `false` | ✓ |
| C-03 | `not-found.tsx` onClick en Server Component | ✓ |
| C-04 | Security headers en `next.config.ts` | ✓ |
| A-08 | `revalidateTag` profile `'default'` → `'max'` | ✓ |

---

## Cambios realizados

### Archivos renombrados
- `src/middleware.ts` → **`src/proxy.ts`**

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/proxy.ts` | Función renombrada de `middleware` a `proxy` |
| `src/sanity/lib/fetch.ts` | `revalidate = 3600` → `revalidate = false`; tipo `revalidate?: number` → `number \| false` |
| `src/app/[locale]/not-found.tsx` | Import de `BackButton`; `<button onClick>` reemplazado por `<BackButton>` |
| `next.config.ts` | Agregada función `async headers()` con 5 headers de seguridad |
| `src/app/api/revalidate/route.ts` | `'default'` → `'max'` en ambas llamadas a `revalidateTag`; eliminado import no usado `revalidatePath` |

### Archivos creados
- **`src/components/ui/BackButton.tsx`** — Client Component que encapsula el `onClick` de `window.history.back()`

---

## Detalle de cada fix

### C-01 — middleware → proxy

`src/middleware.ts` renombrado a `src/proxy.ts` y función renombrada de `middleware` a `proxy`. No había referencias al archivo en `next.config.ts` ni imports desde otros módulos.

```ts
// antes
export default function middleware(request: NextRequest) { ... }

// después
export default function proxy(request: NextRequest) { ... }
```

### C-02 — sanityFetch revalidate

```ts
// antes
revalidate?: number
revalidate = 3600

// después
revalidate?: number | false
revalidate = false
```

Ninguna llamada existente a `sanityFetch` pasaba `revalidate` explícito, por lo que el cambio de default afecta a todas las páginas de manera uniforme. A partir de ahora el contenido solo se refresca vía `revalidateTag` desde el webhook de Sanity.

### C-03 — not-found.tsx

El `<button onClick={() => window.history.back()}>` existía en un Server Component. Solución: extraer solo el botón al Client Component `BackButton.tsx`. El resto de `not-found.tsx` permanece como Server Component (sin `'use client'`), conservando el SSR del 404.

### C-04 — Security headers

Headers agregados en `next.config.ts` para todas las rutas (`source: '/(.*)'`):

| Header | Valor |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |

**Content-Security-Policy pendiente** — se configurará en tanda posterior cuando estén definidas todas las fuentes de scripts (Turnstile, Google Maps, Sentry).

### A-08 — revalidateTag profile

```ts
// antes
revalidateTag(body._type, 'default');
revalidateTag('sanity', 'default');

// después
revalidateTag(body._type, 'max');
revalidateTag('sanity', 'max');
```

Adicionalmente eliminado el import no usado `revalidatePath` de `next/cache`.

---

## Validación final

| Check | Resultado |
|-------|-----------|
| `pnpm tsc --noEmit` | ✓ Sin errores |
| `pnpm build` | ✓ Build exitoso |
| Warning `middleware deprecated` | ✓ **Eliminado** — ahora muestra `ƒ Proxy (Middleware)` |
| `src/proxy.ts` existe | ✓ |
| `src/middleware.ts` eliminado | ✓ |
| `src/components/ui/BackButton.tsx` creado | ✓ |

---

## Issues encontrados

**Ningún bloqueo.** Una decisión menor tomada durante la ejecución:

- Durante A-08, se detectó que `revalidatePath` estaba importado pero nunca usado en `route.ts`. Se eliminó el import aprovechando el cambio en el mismo archivo. No altera el alcance del fix.

---

## Próximos pasos

Listo para **Tanda 2 — i18n migration**: migrar los 34 strings `locale === 'es' ?` de `page.tsx` y los strings de `nosotros/page.tsx` y `Footer.tsx` a `messages/es.json` y `messages/en.json`.
