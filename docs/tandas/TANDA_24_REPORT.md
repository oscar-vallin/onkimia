# Tanda 24 — Fix pop-up clínica + ajustes visuales heroes

Fecha: 2026-05-16

## Resumen

- Header usa `clinic` (context) como fuente de verdad: ✓
- Pop-up refleja clínica en el header: ✓
- Textos de heroes acortados: ✓ (venían de JSON)
- Botones WhatsApp compactos: ✓
- Overlay de heroes unificado (/endos, /cuidare): ✓
- Watermark: nota documentada: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/Header.tsx` | `isSelected = activeClinicSlug === c.slug` → `isSelected = clinic === c.slug` (×2); eliminado `activeClinicSlug` (ya no necesario) |
| `src/messages/es.json` | Textos cortos en `home.hero.description`, `endos.hero.description`, `cuidare.hero.description`; `common.scheduleAppointmentWhatsApp` → "Agendar por WhatsApp" |
| `src/messages/en.json` | Mismo tratamiento en EN |
| `src/app/[locale]/endos/page.tsx` | Overlay inline → `bg-gradient-to-r from-brand-900/80 via-brand-900/60 to-transparent` |
| `src/app/[locale]/cuidare/page.tsx` | Mismo overlay |

## Hallazgo del bug del pop-up

El header tenía dos fuentes de verdad para la clínica activa:
- `clinic` del ClinicContext (cookie `onkimia_clinic`) — actualizado por el pop-up
- `activeClinicSlug` derivado del pathname — NO actualizado por el pop-up

El selector visual (`isSelected`) usaba `activeClinicSlug`, por lo que nunca reflejaba la elección del modal. Solución: usar `clinic` del context como única fuente de verdad para el indicador de preferencia.

## Decisiones técnicas

**`activeClinicSlug` eliminado completamente** — no se usaba para ninguna otra cosa (los links de nav activos usan `isActive()` basado en pathname, independiente). La variable era huérfana al cambiar `isSelected`.

**ClinicProvider analizado** — no requiere cambios. `useState(initialClinic)` preserva el estado del cliente ante `router.refresh()`. `setClinic` escribe la cookie inmediatamente, así que el próximo layout server-render también leerá el valor correcto.

**`/onkimia-doctors` overlay NO unificado** — su overlay (`rgba(0,0,0,0.55/0.45/0.60)`) es más oscuro intencionalmente para su identidad B2B. No es inconsistencia, es decisión de diseño. Se deja como está.

**Textos de heroes** — venían de `messages/es.json` y `messages/en.json`. Acortados directamente. No involucran Sanity.

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓
- Diff JSON keys (es.json vs en.json): ✓ (cero diferencias)

## Notas para el cliente

- **Watermark "Onkimia"** de las imágenes de fondo: es parte de la foto, no un elemento del DOM — no se puede mover con CSS. Para controlarlo, proveer fotos sin watermark o con watermark en una zona que no compita con el texto del hero (ej: esquina inferior).
