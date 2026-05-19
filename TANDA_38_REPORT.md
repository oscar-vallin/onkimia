# Tanda 38 — Fix títulos Host Grotesk en Onkimia Doctors
Fecha: 2026-05-19

## Bug corregido
- Títulos de /onkimia-doctors no usaban Host Grotesk: ✓ resuelto

## Causa
La regla de elemento `h1,h2,h3,h4,h5,h6 { font-family: var(--font-serif) }` en
globals.css ganaba sobre la herencia CSS del wrapper `.doctors-scope`. Una regla
directa de elemento supera a la propiedad heredada del padre. Por eso los headings
seguían en Google Sans Flex.

## Solución aplicada
1. Se agregó clase `doctors-scope` al wrapper raíz de la página en `page.tsx`.
2. Se agregó en `globals.css` (dentro de `@layer base`, después del bloque de
   headings global) una regla con mayor especificidad:
   ```css
   .doctors-scope h1,
   .doctors-scope h2,
   .doctors-scope h3,
   .doctors-scope h4,
   .doctors-scope h5,
   .doctors-scope h6 {
     font-family: var(--font-host-grotesk);
   }
   ```
   Esta regla (clase + elemento) supera a la regla de elemento solo, sin tocar
   la regla global.

## Verificación del color azul
- Clases `bg-doctors-blue`, `text-doctors-blue`, `bg-doctors-ink`, `bg-doctors-surface`
  presentes en el CSS compilado: ✓
- Valor `#5d81f0` correctamente asociado a `--color-doctors-blue`: ✓
- Regla `.doctors-scope h1-h6 { font-family: var(--font-host-grotesk) }` en CSS compilado: ✓
- Conclusión: el código de color estaba correcto desde la Tanda 37. No se modificó.

## Archivos modificados
- `src/app/[locale]/globals.css` — regla `.doctors-scope h1-h6` agregada en @layer base
- `src/app/[locale]/onkimia-doctors/page.tsx` — clase `doctors-scope` agregada al wrapper

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Títulos de Doctors en Host Grotesk: ✓
- Resto del sitio sin cambios de fuente ni color: ✓
