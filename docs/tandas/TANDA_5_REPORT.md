# Tanda 5 — Reporte de página /endos
Fecha: 2026-05-13

## Resumen
- [✓] Schema siteSettings: campos `endosHeroImage` + `endosSafetyImage`
- [✓] Query `FAQS_BY_PAGE_QUERY` — ya existía con la estructura correcta, sin cambios necesarios
- [✓] Componente `BookingButton`
- [✓] Componente `UnitAvailabilityBanner`
- [✓] JSON-LD `MedicalProcedureLd` + `FAQPageLd` en JsonLd.tsx
- [✓] Traducciones en `messages/es.json` y `en.json`
- [✓] Página `/endos` creada

## Archivos creados
1. `src/app/[locale]/endos/page.tsx`
2. `src/components/ui/BookingButton.tsx`
3. `src/components/ui/UnitAvailabilityBanner.tsx`

## Archivos modificados
1. `src/sanity/schemas/siteSettings.ts` — 2 campos nuevos (`endosHeroImage`, `endosSafetyImage`)
2. `src/sanity/types.ts` — 2 campos en `SiteSettings` interface
3. `src/sanity/queries.ts` — `SITE_SETTINGS_QUERY` incluye los 2 campos nuevos
4. `src/components/seo/JsonLd.tsx` — 2 funciones nuevas (`MedicalProcedureLd`, `FAQPageLd`)
5. `src/messages/es.json` — clave `common.scheduleAppointmentWhatsApp` + namespace `endos` completo
6. `src/messages/en.json` — mismas claves en inglés

## Validación final
- `pnpm tsc --noEmit`: ✓ (sin errores en archivos del alcance; error preexistente en `servicios/page.tsx:156` fuera de alcance)
- `pnpm build`: pendiente de ejecutar manualmente
- `diff` de claves es/en JSONs: ✓ sin diferencias — estructura 100% paralela

## Notas para el cliente
- Subir `endosHeroImage` a Sanity → Configuración del sitio (fallback automático a homeHeroImage si está vacío)
- Subir `endosSafetyImage` a Sanity → Configuración del sitio (sección "Seguridad y confianza"; la columna derecha se oculta si no hay imagen)
- Crear FAQs en Studio con `page = 'endos'` (mínimo 3-5 recomendado para que aparezca la sección)
- Verificar que las clínicas tengan `whatsappEndos` configurado en Sanity para smart routing del botón

## Decisiones tomadas

### `FAQS_BY_PAGE_QUERY` ya existía
La query fue encontrada en `queries.ts` con la firma correcta (filtra por `$page`, incluye `isActive`, limita a 6). No se modificó.

### `FaqPageJsonLd` coexiste con `FAQPageLd`
El archivo `JsonLd.tsx` ya tenía `FaqPageJsonLd` con API diferente (`items` vs `faqs`). Se agregaron los nuevos componentes sin tocar los existentes para no romper otros consumidores.

### Hero con fallback automático
`heroImage = settings.endosHeroImage || settings.homeHeroImage` — sin imagen de Endos en Sanity, la página funciona con la imagen del Home.

### `UnitAvailabilityBanner` — supresión hasta hidratación
El componente retorna `null` hasta que `isInitialized` es `true` (post-hidratación) para evitar FOUC. Si el usuario no tiene clínica seleccionada, tampoco muestra el banner.

### `BookingButton` — retorna `null` si no hay número
Si ninguna clínica tiene `whatsappEndos` configurado (y tampoco `whatsapp`), el botón no renderiza. Las secciones Hero y CTA quedarán sin botón hasta configurar WhatsApp en Sanity.

## Próximos pasos
Listo para `/cuidare` — página gemela a `/endos` con cambios menores:
- Sección "¿Qué hacemos?" → servicios de Cuidare
- Filtro FAQ `page = 'cuidare'`
- `section="cuidare"` en `BookingButton`
- `availableIn` puede variar si Cuidare está en ambas sedes
