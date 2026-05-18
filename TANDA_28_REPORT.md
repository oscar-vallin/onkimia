# Tanda 28 — Ajustes de Header

Fecha: 2026-05-17

## Resumen

- FIX 1 — Menú móvil: links pegados arriba: ✓
- FIX 2 — Botón "Agendar por WhatsApp" en menú móvil: ✓
- FIX 3 — Logo desktop altura fija 96px, sin shrink: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/Header.tsx` | FIX 1: ul `flex flex-col items-center space-y-1 pt-4` (sin flex-grow/justify-center); FIX 2: botón WhatsApp con SVG + `tCommon('scheduleAppointmentWhatsApp')`; FIX 3: logo `w-[180px] h-[96px]` fijo, `urlFor().height(96)`, `sizes="(max-width: 768px) 150px, 180px"`; header inner div padding fijo `py-2` |

## Decisiones técnicas

**FIX 2 — Section usada:** `'home'` — cubre el caso general "agendar cita", enruta al whatsapp principal de la sede seleccionada (o primary como fallback). No se inventó ningún valor; 'home' existe explícitamente en el tipo `Section`.

**FIX 2 — Traducción:** reutilizada `common.scheduleAppointmentWhatsApp` ("Agendar por WhatsApp" ES / "Book via WhatsApp" EN) — no se necesitó crear clave nueva.

**FIX 3 — Padding condicional eliminado:** `${scrolled ? 'lg:py-3' : ''}` reemplazado por `py-2` fijo. El header es ahora 100% estable en altura. El estado `scrolled` se mantiene para controlar el fondo (transparente → blur morado).

**Logo mobile NO tocado:** permanece `w-[150px] h-[80px]` como requirió el spec.

**Logo md:** ajustado de `md:w-[200px] md:h-[107px]` a `md:w-[180px] md:h-[96px]` para ser consistente con lg — un solo tamaño fijo en ambos breakpoints.

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓
- Diff JSON keys: N/A (no se tocaron traducciones — se reutilizó clave existente)

## Notas

- Estado `scrolled` y su useEffect: conservados — siguen controlando el fondo del header
- Cambio de fondo al scroll: conservado (transparente → `bg-brand-900/80 backdrop-blur-md`)
- Panel de config (clínica/idioma) sigue al fondo gracias a `mt-auto` en su contenedor
