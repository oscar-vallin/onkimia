# Tanda 18 — Home refactor + bug fixes visuales

Fecha: 2026-05-15

## Resumen

- "Cuidarte es nuestra prioridad" híbrido 3 cards + texto adicional: ✓
- "Bienestar integral" con 6 iconos Lucide: ✓
- "Agenda tu cita" con 3 iconos visuales + número superpuesto: ✓
- Bug MAPFRE border naranja: ✓ (ver nota abajo)
- Traducciones es+en actualizadas: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/[locale]/page.tsx` | Reescritura de secciones "Cuidarte", "Bienestar", "Agenda tu cita", "Convenios" |
| `src/messages/es.json` | Namespaces `home.priorityCare`, `home.wellness` (nuevo); `home.appointment` actualizado |
| `src/messages/en.json` | Ídem en inglés |

## Cambios por sección

### "Cuidarte es nuestra prioridad"
- Eliminada lista de 7 bullets estáticos
- Nueva estructura: subtitle descriptivo + 3 cards con iconos Lucide (`Stethoscope`, `Microscope`, `HeartHandshake`) + párrafo de servicios adicionales
- Claves de traducción: `priorityCare.title/subtitle/card1/card2/card3/additionalServices`

### "Bienestar integral"
- Iconos añadidos a las 6 cards (`Heart`, `Activity`, `Brain`, `ShoppingBag`, `Apple`, `Dna`)
- Las cards ahora usan fondo blanco con `hover:shadow-md` (más limpio que `bg-neutral-50 hover:border-accent-500`)
- Claves de traducción: `wellness.{relaxation,physiotherapy,psychology,boutique,nutrition,genomics}.{title,description}`
- El texto hardcodeado fue reemplazado por traducciones del namespace `home.wellness`

### "Agenda tu cita"
- Círculos numéricos reemplazados por iconos visuales (`ClipboardCheck`, `UserSearch`, `CalendarCheck`)
- Número superpuesto en badge `bg-brand-900` en esquina superior derecha
- CTA usa la clave `appointment.cta` (antes usaba `appointment.title` incorrectamente)

### "Convenios" — Bug MAPFRE
- **No había lógica especial** que marcara MAPFRE: el código original usaba `hover:border-accent-500` idéntico para todas las cards, y el border naranja visto en preview era simplemente el estado hover persistente tras hacer click
- Fix: se cambió la key del `.map()` de `index` a `insurance` (string) para evitar problemas de reconciliación de React que podían "congelar" el estado hover en la card con índice 2
- Todas las cards usan exactamente el mismo estilo; ninguna tiene lógica de destacado

## Decisiones técnicas

- Los datos de las 6 secciones de Bienestar y las 3 cards de "Cuidarte" siguen siendo estáticos (hardcoded en traducciones), consistente con el TODO de "Tanda 4: reemplazar por query". No se tocaron queries ni schemas.
- El hook `t('wellness.${key}.title')` con `as const` array garantiza tipado estático sin errores de TypeScript.

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (build completa)
- Diff JSON keys: ✓ (ninguna diferencia entre es.json y en.json)

## Notas para el cliente

- **Sección doctores**: el bug de "solo aparece 1 doctor" es de contenido en Sanity — vincular más doctores a las clínicas o verificar que `isActive: true` esté marcado en los demás documentos
- **Convenios**: logos reales de aseguradoras pendientes (actualmente se muestra texto)
- **Fotos de doctores**: se recomienda subir fotos sin texto superpuesto para mejor presentación en las cards
