# Tanda 33 — Convenios del Home → Sanity CMS
Fecha: 2026-05-18

## Resumen
- INSURANCES_QUERY creada: ✓ (ya existía en queries.ts)
- Tipo Insurance creado: ✓ (ya existía en types.ts)
- Home conectado a Sanity (array hardcodeado eliminado): ✓
- Logos renderizados, link si hay website: ✓
- schema insurance registrado en Studio: ✓ ya estaba

## Archivos modificados
- `src/app/[locale]/page.tsx`:
  - Añadidos imports `INSURANCES_QUERY` e `Insurance`
  - `insurances` agregado al `Promise.all`
  - Sección hardcodeada de 16 strings reemplazada por render desde Sanity
  - Eliminado `console.log` de depuración

## Decisiones técnicas
- **Imagen:** tipo `Image` (mismo que usan `Doctor`, `SiteSettings`, etc.)
- **Lista vacía:** si `insurances.length === 0` la sección se oculta completamente — evita grilla vacía y la sección de Convenios no aparece hasta que el cliente suba las aseguradoras
- **Tamaño logos:** `width={140} height={60} max-h-[60px] w-auto object-contain` — caben bien en celdas `min-h-[100px]` con `p-6`
- **Fallback sin logo:** muestra el nombre en texto (el campo es required en el schema, pero por seguridad)
- **Con website:** el logo entero se envuelve en `<a target="_blank" rel="noopener noreferrer">`

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (28/28 páginas)
- Sección no crashea sin datos: ✓ (oculta con `insurances.length > 0`)

## Pendiente para el usuario
Subir las 16 aseguradoras al Studio (sección "Aseguradoras") con su logo:
- AXA, GNP, MAPFRE, VUMI
- INBURSA, BANORTE, BESTDOCTORS, MD ABROAD
- CIGNA, SURA, BX+, ZURICH
- SCOTIABANK, **HEALTHCARE** (verificar si era HEALTHCASE o HEALTHCARE), ATLAS, AXA ASSISTANCE

Campos opcionales: `website` (convierte el logo en link) y `order` (controla el orden en la grilla).

## Notas
- La clave `t('insurances.title')` se mantiene intacta
- La grilla conserva `grid-cols-2 md:grid-cols-4 gap-8` exacta
