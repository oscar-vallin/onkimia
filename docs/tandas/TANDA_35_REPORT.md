# Tanda 35 — Paletas de submarca Endos y Cuidare
Fecha: 2026-05-19

## Cambio de alcance
Este cambio revierte la "identidad unificada" previa. Endos y Cuidare ahora tienen paleta propia, por decisión del cliente.

## Resumen
- Tokens endos-* y cuidare-* registrados en globals.css: ✓
- Paleta Endos aplicada en /endos: ✓
- Paleta Cuidare aplicada en /cuidare: ✓
- Contención respetada (resto del sitio sin cambios): ✓
- BookingButton sin modificar (sigue naranja): ✓

## Archivos modificados
- `src/app/[locale]/globals.css` — tokens `endos-*` y `cuidare-*` en `@theme`; líneas `@source inline` para que Tailwind v4 genere las clases utilitarias
- `src/app/[locale]/endos/page.tsx` — hero overlay, cards de procedimiento, círculos de beneficios, fondo FAQ
- `src/app/[locale]/cuidare/page.tsx` — hero overlay, íconos de beneficios, fondo radiología, checks radiología, bloque Cuidados Paliativos

## Cambios detallados

### /endos
| Elemento | Antes | Después |
|---|---|---|
| Hero overlay | `from-brand-900/80 via-brand-900/60` | `from-endos-teal-900/85 via-endos-teal-900/60` |
| Cards — borde hover | `hover:border-accent-500` | `hover:border-endos-mint-500` |
| Cards — ícono container | `bg-accent-50 text-accent-600` | `bg-endos-tint-50 text-endos-teal-700` |
| Beneficios — círculos | `bg-brand-900` | `bg-endos-teal-900` |
| FAQ — fondo sección | `bg-brand-50` | `bg-endos-tint-50` |

### /cuidare
| Elemento | Antes | Después |
|---|---|---|
| Hero overlay | `from-brand-900/80 via-brand-900/60` | `from-cuidare-blue-900/85 via-cuidare-blue-900/60` |
| Beneficios — ícono container | `bg-accent-50 text-accent-600` | `bg-cuidare-blue-100 text-cuidare-blue-700` |
| Radiología — fondo sección | `bg-brand-50` | `bg-cuidare-blue-100/40` |
| Radiología — checks | `text-accent-500` | `text-cuidare-blue-700` |
| Paliativos — bloque | `bg-brand-900` | `bg-cuidare-blue-900` |
| Paliativos — comilla | `text-accent-500` | `text-cuidare-blue-300` |

## Decisiones técnicas
- **Formato de token:** `--color-endos-teal-900` etc. en `@theme`, igual que el formato existente `--color-brand-*`. Tailwind v4 genera las clases automáticamente.
- **@source inline:** añadidas las líneas de safelist para `endos-{teal,mint,tint}` y `cuidare-blue-*` — necesarias en Tailwind v4 para clases dinámicas que no aparecen en el HTML escaneado.
- **bg-cuidare-blue-100/40:** se usó opacidad 40% para el fondo de Radiología — el #c9e8fb puro puede resultar demasiado saturado como fondo de sección; al 40% queda como tinte sutil y el texto neutro encima contrasta perfectamente.
- **FAQ de Cuidare:** se mantuvo `bg-neutral-50` — el brief pide "acentos sutiles" y neutro es más sobrio que forzar un tinte azul.
- **mint-500 como fondo:** NO se usó como fondo de elementos con contenido; solo como color de borde hover. El #69cfaf es demasiado claro para garantizar contraste con texto claro.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (28/28 páginas)
- /endos y /cuidare con sus paletas: ✓
- Resto del sitio sin cambios: ✓

## Notas
- Header, Footer, Home y demás páginas: identidad Onkimia intacta
- Los BookingButton siguen naranja (`accent-500`) en todos los contextos — correcto
