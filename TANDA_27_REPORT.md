# Tanda 27 — Fix warning quality + limpieza + legibilidad

Fecha: 2026-05-17

## Resumen

- FIX 1 — quality 80 → 75 (warning resuelto): ✓
- FIX 2 — image-loader.ts eliminado: ✓ (ya no existía — fue eliminado antes de esta tanda)
- FIX 3 — descripción hero text-sm → text-base: ✓ (y md:text-base → md:text-lg)

## Archivos modificados / eliminados

| Archivo | Cambio |
|---|---|
| `src/components/ui/HeroSection.tsx` | `quality={80}` → `quality={75}`; descripción `text-sm md:text-base` → `text-base md:text-lg` |
| `src/sanity/image-loader.ts` | Ya no existía al iniciar la tanda (eliminado previamente) |

## Verificación

- grep image-loader antes de borrar: vacío (archivo no existía) ✓
- Warning "quality 80" en build: desaparecido ✓ (cero warnings en output del build)
- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓

## Notas

- next.config NO modificado — se usó `quality={75}` que ya está en `images.qualities`
- /endos, /cuidare, /onkimia-doctors: no tocados
- La descripción subió de 14px (text-sm) a 16px (text-base) en mobile y 18px (text-lg) en desktop
