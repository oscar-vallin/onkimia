# Tanda 23 — Fix LCP con loader de Sanity

Fecha: 2026-05-16

## Resumen

- Loader custom de Sanity creado: ✓
- HeroSection usa el loader: ✓
- next.config sin cambios destructivos: ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/sanity/image-loader.ts` | Loader `sanityImageLoader` — construye URL directa al CDN de Sanity con `?w=`, `?q=`, `?auto=format`, `?fit=max` por breakpoint |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/ui/HeroSection.tsx` | `src` → `urlFor(image).url()` (sin width/quality/format fijos); añadido `loader={sanityImageLoader}` + `quality={80}` |

## Verificación técnica

- Imagen hero servida directo de cdn.sanity.io (sin /_next/image): ✓ (loader custom bypasea el optimizer de Vercel)
- srcset responsive mantenido: ✓ (next/image sigue generando srcset; el loader recibe cada width)
- Imagen nítida en mobile y desktop: ✓ (Sanity CDN sirve transformaciones on-the-fly)

## Métricas

- LCP antes: 2.9s (render delay: 2,040ms)
- LCP después: pendiente post-deploy a Vercel

## Decisiones técnicas

`urlFor(image).url()` genera una URL base limpia sin query params (confirmado en `src/sanity/image.ts`). El loader puede usar `new URL(src)` directamente y aplicar `searchParams.set()` sin colisiones.

El loader se aplicó **solo a HeroSection** (LCP-critical). Los heroes hardcoded de /endos, /cuidare, /onkimia-doctors no fueron modificados en esta tanda para evitar conflicto con Tanda 22. Recomendación: aplicar el mismo loader en una tanda futura cuando esas páginas se migren a HeroSection compartido.

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓

## Notas

- Heroes hardcoded (/endos, /cuidare, /onkimia-doctors): conviene aplicar el mismo loader cuando se migren al componente HeroSection compartido. No es urgente — no son LCP de la home.
- `images.remotePatterns` en next.config se mantiene intacto (necesario para imágenes sin loader custom).
