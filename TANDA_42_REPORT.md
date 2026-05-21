# Tanda 42 — Carrusel infinito de Convenios en el Home
Fecha: 2026-05-21

## Resumen
- InsuranceCarousel component creado: ✓
- Animación CSS (40s, derecha → izquierda): ✓
- Pausa al hover: ✓
- Respeto a prefers-reduced-motion: ✓
- Fade lateral: ✓
- Sección Home conectada al componente nuevo: ✓
- Lista vacía sigue ocultando la sección: ✓

## Archivos creados / modificados
- `src/components/ui/InsuranceCarousel.tsx` — NUEVO
- `src/app/[locale]/globals.css` — keyframe + clases del carrusel
- `src/app/[locale]/page.tsx` — import + reemplazo del grid por InsuranceCarousel

## Decisión técnica — Client vs Server
- El componente quedó como: **Server Component**
- Razón: toda la animación es CSS puro, no requiere hooks ni state. El componente solo renderiza HTML estático; el carrusel funciona sin JS del lado del cliente.

## Técnica del marquee
- Los items se renderizan DOS VECES (set A visible + set B aria-hidden duplicado).
- El track tiene `w-max` (ancho = suma de todos los items × 2).
- La animación va de `translateX(0)` a `translateX(-50%)` — exactamente el ancho de UN set.
- Cuando termina el ciclo, el set B está donde estaba el set A: loop perfecto sin corte visible.
- `mask-image` con prefijo `-webkit-` para compatibilidad con Safari.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Loop sin cortes visibles: ✓ (técnica translateX(-50%) estándar)
- Pausa al hover funciona: ✓ (CSS `animation-play-state: paused`)
- prefers-reduced-motion respetado: ✓ (`animation: none`)
- Logos clicables (los que tienen website): ✓

## Notas
- El "marquee" usa la técnica estándar de la industria (Stripe, Vercel, Linear).
- `mask-image` incluye prefijo `-webkit-` por Safari.
- Las clases CSS del carrusel son CSS puro, no clases Tailwind — no requieren @source inline.
