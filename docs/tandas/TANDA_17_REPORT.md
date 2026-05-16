# Tanda 17 — Optimización LCP

Fecha: 2026-05-16

## Resumen

- Hero image `priority` en HeroSection: ✓ (ya existía)
- Framer Motion `LazyMotion` migration en Header: ✓
- Preconnect a Sanity CDN en `<head>`: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/Header.tsx` | `import { motion, AnimatePresence, Variants }` → `import { LazyMotion, domAnimation, m, AnimatePresence, type Variants }`; `<motion.nav>` → `<m.nav>`; añadido `<LazyMotion features={domAnimation}>` wrapper |
| `src/app/[locale]/layout.tsx` | `<link rel="preconnect" href="https://cdn.sanity.io" />` en `<head>` |

## Impacto estimado

| Mejora | Ahorro estimado |
|---|---|
| LazyMotion vs motion completo | ~27 KB JS inicial |
| Preconnect Sanity CDN | 100–300 ms TCP+TLS |

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (todas las rutas generadas correctamente)
