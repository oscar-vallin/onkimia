# Tanda 7 — Reporte de página /onkimia-doctors
Fecha: 2026-05-13

## Resumen
- [✓] `BookingButton` extendido con `customMessage`
- [✓] Schema `doctorsHeroImage` en siteSettings
- [✓] Traducciones `doctors` es + en
- [✓] JSON-LD `MedicalBusinessLd`
- [✓] Página `/onkimia-doctors` (5 secciones)

## Archivos creados
1. `src/app/[locale]/onkimia-doctors/page.tsx`

## Archivos modificados
1. `src/components/ui/BookingButton.tsx` — prop `customMessage?: string` + pasa al `buildWhatsAppUrl`
2. `src/sanity/schemas/siteSettings.ts` — campo `doctorsHeroImage`
3. `src/sanity/types.ts` — `doctorsHeroImage?` en `SiteSettings`
4. `src/sanity/queries.ts` — `SITE_SETTINGS_QUERY` incluye `doctorsHeroImage`
5. `src/components/seo/JsonLd.tsx` — `MedicalBusinessLd` añadido
6. `src/messages/es.json` — namespace `doctors` completo
7. `src/messages/en.json` — namespace `doctors` completo

## TODOs documentados
1. **Bienestar — destino del botón:** el botón "Agenda Recorrido" de la unidad Bienestar integral usa `section="endos"` como fallback (mismo WhatsApp que Endos). Confirmar con cliente si debe ir a un número distinto.


## Validación final
- `pnpm tsc --noEmit`: ✓ sin errores (error preexistente en `servicios/page.tsx` fuera de alcance)
- `pnpm build`: pendiente de ejecutar manualmente
- Diff JSON keys es/en: ✓ sin diferencias — estructura 100% paralela

## Notas para el cliente
- Confirmar destino real del botón "Agenda Recorrido" para la unidad Bienestar Integral
- Revisar y aprobar traducciones en inglés (generadas automáticamente)
- Subir `doctorsHeroImage` en Sanity → Configuración del sitio (fallback automático a homeHeroImage)
- Verificar que `whatsappCommercial` esté configurado en Sanity para el botón "Únete ahora"

## Comportamiento del smart routing
| Botón | `section` | Número usado |
|---|---|---|
| Hero "Únete ahora" | `onkimia-doctors` | `whatsappCommercial` (global) |
| Tarjeta Endos | `endos` | `whatsappEndos` de la sede |
| Tarjeta Cuidare | `cuidare` | `whatsappCuidare` de la sede |
| Tarjeta Bienestar | `endos` (TODO) | `whatsappEndos` de la sede |
| CTA "Únete ahora" | `onkimia-doctors` | `whatsappCommercial` (global) |

## Próximos pasos
Listo para Tanda 8 — `/contacto` (primer formulario complejo)
