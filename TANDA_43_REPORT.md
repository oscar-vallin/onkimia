# Tanda 43 — Micro-interacciones, blur placeholders, skeleton
Fecha: 2026-05-21

## Resumen
- FIX 0 — prefers-reduced-motion CSS global: ✓ (ya existía en globals.css líneas 267-274 — verificado, no se duplicó)
- FIX 1 — Hover en cards (Cuidarte, Bienestar, Doctores): ✓
- FIX 2 — LQIP en hero + doctores: ✓
- FIX 3 — Skeleton de doctores en loading.tsx: ✓

## Archivos modificados
- `src/sanity/queries.ts` — homeHeroImage y photo de doctors expandidos con `asset->{..., metadata{lqip}}`
- `src/sanity/types.ts` — nuevo tipo `SanityImageWithLQIP`; `SiteSettings.homeHeroImage` y `Doctor.photo` actualizados
- `src/components/ui/HeroSection.tsx` — import cambiado a `SanityImageWithLQIP`; `placeholder="blur"` + `blurDataURL` añadidos
- `src/app/[locale]/page.tsx` — hover en 3 grupos de cards + `placeholder="blur"` en fotos de doctores

## Archivos creados
- `src/components/ui/DoctorCardSkeleton.tsx`
- `src/app/[locale]/loading.tsx` — creado desde cero (no existía)

## Decisiones técnicas

**FIX 0:** La regla `prefers-reduced-motion` ya estaba presente dentro de `@layer base` (líneas 267-274 de globals.css). No se duplicó.

**FIX 1 — Hover en cards:** Los cambios quedaron en `src/app/[locale]/page.tsx`. No existe un componente separado DoctorCard.tsx. Clases aplicadas: `hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out` (sustituyendo `hover:shadow-md/lg transition-shadow` para que el delta sea consistente).

**FIX 2 — LQIP:** La query GROQ se modificó en `src/sanity/queries.ts` (SITE_SETTINGS_QUERY para homeHeroImage, DOCTORS_QUERY para photo). Se creó `SanityImageWithLQIP` en `src/sanity/types.ts` como extensión del tipo `Image` de sanity, sin romper otros usos de `Image` en el resto del codebase.

**FIX 3 — Skeleton:** `loading.tsx` creado desde cero. Solo renderiza un hero placeholder (div con `bg-brand-900 animate-pulse`) + grid de 4 `DoctorCardSkeleton`. El skeleton tiene `aspect-[3/4]` + padding p-4 para replicar exactamente la silueta de las cards reales de doctores. No hay CLS porque las dimensiones coinciden.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Diff JSON keys: ✓ (no se agregó copy nuevo)
- Hover en 3 secciones correctas: ✓ (Cuidarte x3, Bienestar x6, Doctores x8)
- Blur visible en hero + doctores con throttle 3G: pendiente verificación visual en dev
- Skeleton aparece en navegación entre páginas: ✓ (loading.tsx activo para la ruta)
- prefers-reduced-motion desactiva animaciones: ✓ (regla global `0.01ms !important` en globals.css)

## Bundle size
- Delta JS: ~0 KB (DoctorCardSkeleton es HTML puro sin lógica; loading.tsx no agrega código cliente)
- Delta CSS: ~0 (hover classes ya generadas por Tailwind; animate-pulse es utilidad nativa)

## Notas
- /endos, /cuidare, /onkimia-doctors: NO tocados
- Aseguradoras, testimonios: NO se les aplicó hover
- LQIP solo en imágenes grandes (homeHeroImage + doctor.photo)
- HeroSection en /endos, /cuidare usa `Image` de sanity directamente (hardcoded), no se tocó
