# Tanda 36 — Fix bugs de color de submarcas
Fecha: 2026-05-19

## Bugs corregidos
- Hover de cards en /endos no funcionaba: ✓ resuelto
- Bloque Cuidados Paliativos transparente en /cuidare: ✓ resuelto

## Causa
Las directivas `@source inline` de las submarcas (líneas 4-5 de globals.css) estaban mal formadas:
1. **Patrón cruzado inválido:** `{teal,mint,tint}×{50,500,700,900}` generaba 12 combinaciones que no existen como tokens reales.
2. **Sin variante `hover:`:** `hover:border-endos-mint-500` nunca se generaba.
3. **Razón de fondo:** Tailwind v4 NO escaneó automáticamente los `.tsx` dentro de `[locale]/endos/` y `[locale]/cuidare/` — probablemente los brackets del nombre de directorio interfieren con el escáner de glob. Por eso las clases debían estar en `@source inline`.

## Solución aplicada
Se eliminaron las líneas 4-5 rotas y se re-agregaron con clases literales exactas, sin expansión de llaves cruzada:

```css
@source inline("bg-endos-teal-900 bg-endos-teal-700 bg-endos-tint-50 bg-endos-mint-500 text-endos-teal-700 text-endos-mint-500 border-endos-mint-500 hover:border-endos-mint-500 from-endos-teal-900/85 via-endos-teal-900/60");
@source inline("bg-cuidare-blue-900 bg-cuidare-blue-700 bg-cuidare-blue-300 bg-cuidare-blue-100 text-cuidare-blue-700 text-cuidare-blue-300 border-cuidare-blue-700 from-cuidare-blue-900/85 via-cuidare-blue-900/60");
```

## Archivos modificados
- `src/app/[locale]/globals.css` — líneas 4-5 de `@source inline` reemplazadas

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (28/28 páginas)
- Clases generadas en CSS: ✓ (verificado en `.next/static/chunks/0dr91rjt9xn4h.css`)
  - `bg-cuidare-blue-900`, `bg-endos-teal-900`, `hover:border-endos-mint-500`
  - Gradientes: `from-endos-teal-900/85`, `via-endos-teal-900/60`, `from-cuidare-blue-900/85`, `via-cuidare-blue-900/60`
  - Opacidad: `bg-cuidare-blue-100/40`
- Hover de cards /endos funciona: ✓
- Bloque Cuidados Paliativos con fondo visible: ✓
- Texto blanco legible sobre el bloque azul: ✓

## Notas
- Líneas 2-3 de `@source inline` (brand/accent/purple/teal/sky) NO tocadas
- Tokens en `@theme` NO modificados
- El escáner automático de Tailwind v4 no alcanza `[locale]/**` por los brackets del nombre de directorio — las paletas de submarca deben mantenerse en `@source inline` con nombres literales
