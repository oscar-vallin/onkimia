# Tanda 26 — Ajustes finos de HeroSection

Fecha: 2026-05-17

## Resumen

- FIX 1 — H1 lg:text-6xl → lg:text-5xl: ✓ (colapsado a md:text-5xl — más limpio)
- FIX 2 — Overlay mobile via /55 → /70: ✓
- FIX 3 — CTA full-width en mobile: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/ui/HeroSection.tsx` | H1: `md:text-5xl` (lg redundante eliminado); overlay medium via mobile `/55` → `/70`; CTA: `w-full max-w-sm sm:w-auto sm:max-w-none` |

## Decisiones técnicas

**FIX 1 — H1:** `md:text-5xl lg:text-5xl` colapsado a solo `md:text-5xl` — son equivalentes (lg hereda md) y la versión corta es más limpia.

**grep image-loader:** el archivo `src/sanity/image-loader.ts` existe en el repo (fue creado en Tanda 25 y no fue borrado), pero HeroSection.tsx ya no lo importa (el linter lo removió al detectarlo como import no utilizado). El archivo está huérfano pero no causa daño. No se eliminó por la restricción "NO tocar ningún archivo que no sea HeroSection.tsx".

## Validación

- grep image-loader: archivo existe en repo pero sin imports activos en HeroSection ✓
- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓

## Recomendación pendiente

**Subir descripción `text-sm md:text-base` → `text-base md:text-lg`:** incluso con el overlay /70 del FIX 2, el texto de 14px (text-sm) sobre foto de fondo es el factor de menor legibilidad restante en mobile. Subir a text-base (16px) en mobile y text-lg (18px) en desktop daría más peso visual y mejor contraste perceptivo. Pendiente de aprobación del usuario antes de aplicar.

## Notas

- Un solo archivo tocado (HeroSection.tsx)
- /endos, /cuidare, /onkimia-doctors: NO tocados
- /nosotros, /servicios, /contacto: heredan los ajustes automáticamente
