# Tanda 40 — Color del BookingButton por sección
Fecha: 2026-05-19

## Resumen
- BookingButton primary con color por sección: ✓
- Fix TODO Bienestar (section endos → onkimia-doctors): ✓
- Safelist hover classes en globals.css: ✓
- Build limpio: ✓

## Mapa de colores implementado

| section | bg | hover |
|---|---|---|
| endos | bg-endos-teal-700 (#457373) | hover:bg-endos-teal-900 (#334e4e) |
| cuidare | bg-cuidare-blue-700 (#00365f) | hover:bg-cuidare-blue-900 (#00263a) |
| onkimia-doctors | bg-doctors-blue (#5d81f0) | hover:bg-doctors-ink (#0a0e12) |
| home / contacto / otros | bg-accent-500 (#F39313) — naranja | hover:bg-accent-600 |

## Archivos modificados
- `src/components/ui/BookingButton.tsx` — `sectionColorMap` + `primaryColorClasses`
- `src/app/[locale]/onkimia-doctors/page.tsx` — UNITS.wellness.section endos → onkimia-doctors; eliminado TODO
- `src/app/[locale]/globals.css` — hover variants agregadas al @source inline de endos, cuidare y doctors

## Decisiones técnicas
- `sectionColorMap: Record<string, string>` tolerante a cualquier string — no requirió modificar el tipo `Section`
- `onkimia-doctors` ya estaba en el tipo `Section` de '@/lib/whatsapp' — no hubo error de TypeScript
- variant secondary no se modificó (sigue `border border-white text-white hover:bg-white/10`)
- Contraste verificado: texto blanco sobre teal-700, blue-700, y doctors-blue (#5d81f0) → todos cumplen contraste mínimo WCAG AA para texto grande

## Clases hover verificadas en CSS compilado
- `hover:bg-endos-teal-900`: ✓
- `hover:bg-cuidare-blue-900`: ✓
- `hover:bg-doctors-ink`: ✓

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)

## Notas
- El hover doctors (azul → casi negro) es una transición agresiva pero marca claramente la interactividad. Si visualmente queda muy fuerte, ajustar a `hover:bg-doctors-blue/80` en una tanda menor.
- BookingButton de /endos, /cuidare y /onkimia-doctors ahora tienen identidad de submarca coherente con la paleta de cada página.
