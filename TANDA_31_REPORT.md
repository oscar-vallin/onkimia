# TANDA 31 — Fix de las 2 primeras secciones de /servicios

## Estado: ✅ COMPLETADA

## Cambios implementados

### 1. `src/sanity/queries.ts` — MODIFICADO
Añadidos `heroImage` y `clinicsSectionImage` a `MAIN_SERVICES_QUERY`.

### 2. `src/sanity/types.ts` — MODIFICADO
Añadido campo `clinicsSectionImage?: Image` a la interfaz `Service`.

### 3. `src/app/[locale]/servicios/page.tsx` — MODIFICADO

**FIX 1 — Capas grises eliminadas**
- Sección 1: eliminado `<div className="absolute inset-0 bg-neutral-300" />` que tapaba la imagen.
- Sección 2: ídem.
- Fallback sin imagen: `bg-brand-900` (S1) y `bg-gradient-to-br from-brand-900 to-brand-700` (S2) — fondo oscuro de marca, texto siempre legible.

**FIX 2 — clinicsSectionImage conectado en Sección 2**
- Se añade `<Image>` condicional con `services?.clinicsSectionImage`.
- Si el campo está vacío en Sanity, el gradiente de marca sirve de fondo.

**FIX 3 — Títulos con palabras completas subrayadas**
- Sección 1: "Atención Oncológica **Especializada**" / "Specialized **Oncology Care**"
- Sección 2: "Clínicas de Atención **Oncológica**" / "Oncology Care **Clinics**"
- Eliminada la partición arbitraria de palabras a la mitad.

**FIX 4 — Listado de clínicas legible en mobile**
- Contenedor Sección 2: `min-h-[420px] md:aspect-[16/9]` — crece con el contenido en mobile, mantiene proporción en desktop.
- Listado: `relative z-20 py-10 md:absolute md:inset-0 md:py-0` — flujo normal en mobile, posicionamiento absoluto en desktop.

## Validación

```
pnpm tsc --noEmit   → ✅ Sin errores
pnpm build          → ✅ Build exitoso (28/28 páginas)
```
