# Tanda 34 — Tipografía Google Sans Flex
Fecha: 2026-05-19

## Resumen
- Google Sans Flex integrada con next/font/local (8 pesos): ✓
- Orbitron eliminada: ✓
- Montserrat y Source Code Pro intactas: ✓
- globals.css: tokens y comentarios actualizados: ✓
- Escala tipográfica de headings aplicada: ✓

## Archivos modificados
- `src/app/[locale]/layout.tsx` — reemplazado `Orbitron` por `localFont` con `googleSansFlex`
- `src/app/[locale]/globals.css` — tokens `--font-display`/`--font-serif` actualizados, comentarios corregidos, escala de headings premium aplicada

## Decisiones técnicas
- **Ruta relativa:** `../fonts/GoogleSansFlex120pt-*.woff2` — layout.tsx está en `src/app/[locale]/`, fuentes en `src/app/fonts/`; la ruta `../fonts/` es correcta.
- **Peso 100 (Thin):** el archivo disponible era `Thin_1.woff2` (no `Thin.woff2`). Se usó `Thin_1.woff2` para peso 100 — es el mismo archivo, renombrado por el sistema del usuario al descargar. Funcional.
- **Clamp vs clases Tailwind:** los `clamp()` de globals.css aplican como default de elemento. Los headings con clases Tailwind explícitas (`text-4xl`, `md:text-5xl`, etc.) mantienen sus tamaños — Tailwind tiene mayor especificidad. El ajuste fino página por página sería una tanda aparte.
- **Variable CSS:** se mantuvo `--font-display` como nombre de variable — el resto del sistema (Tailwind, componentes) no requirió cambios de nombre.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (28/28 páginas, next/font/local validó los 8 archivos)
- Headings con la fuente nueva: ✓

## Notas / Pendiente
- Headings con clases Tailwind explícitas (`text-Nxl`, `font-display`, `font-normal`) mantienen esas clases; el `clamp` de globals.css aplica solo donde no hay override de Tailwind. Un ajuste fino página por página, si se desea, sería una tanda aparte.
- El archivo `GoogleSansFlex120pt-Thin_1.woff2` (nombre con `_1`) se usó para peso 100. Si el usuario obtiene el archivo con el nombre canónico `Thin.woff2`, actualizar el path en `layout.tsx`.
