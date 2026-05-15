# Tanda 6 — Reporte de página /cuidare
Fecha: 2026-05-13

## Resumen
- [✓] Schema siteSettings (`cuidareHeroImage`)
- [✓] Componente `TreatmentAccordion` (desktop grid + móvil accordion)
- [✓] Traducciones `cuidare` es + en
- [✓] Página `/cuidare` (7 secciones)
- [✓] JSON-LD `MedicalProcedureLd` — 11 procedimientos (6 tratamientos + 5 radiología)
- [✓] TODO documentado para Cuidados Paliativos

## Archivos creados
1. `src/app/[locale]/cuidare/page.tsx`
2. `src/components/ui/TreatmentAccordion.tsx`

## Archivos modificados
1. `src/sanity/schemas/siteSettings.ts` — campo `cuidareHeroImage`
2. `src/sanity/types.ts` — `cuidareHeroImage?` en `SiteSettings`
3. `src/sanity/queries.ts` — `SITE_SETTINGS_QUERY` incluye `cuidareHeroImage`
4. `src/messages/es.json` — namespace `cuidare` completo
5. `src/messages/en.json` — namespace `cuidare` completo + fix `clinics.currentLocation` (clave nueva detectada, añadida para mantener paridad)

## Inconsistencias detectadas para reportar al cliente

1. **6 tratamientos, no 7.** El brief menciona implícitamente 7 secciones de contenido pero solo describe 6 tratamientos ambulatorios. Se implementaron los 6 descritos. Confirmar si falta un 7º tratamiento.

2. **Texto de Cuidados Paliativos no es descripción técnica.** El texto provisto ("Nuestra unidad ha sido elegida por médicos y pacientes...") describe un diferenciador/testimonio, no el servicio de cuidados paliativos. Se implementó con comentario `// TODO Cliente` en el código. Confirmar contenido real.

## Validación final
- `pnpm tsc --noEmit`: ✓ sin errores en archivos del alcance (error preexistente en `servicios/page.tsx:154` fuera de alcance)
- `pnpm build`: pendiente de ejecutar manualmente
- Diff JSON keys es/en: ✓ sin diferencias — estructura 100% paralela

## Notas para el cliente
- Subir `cuidareHeroImage` en Sanity → Configuración del sitio (fallback automático a homeHeroImage)
- Crear FAQs con `page = 'cuidare'` en Studio
- Verificar que las clínicas tengan `whatsappCuidare` configurado para smart routing del botón
- Confirmar contenido real de la sección Cuidados Paliativos
- Confirmar si hay un 7º tratamiento ambulatorio

## Próximos pasos
Listo para Tanda 7: `/onkimia-doctors` (página B2B)
