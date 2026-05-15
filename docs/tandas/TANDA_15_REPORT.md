# Tanda 15 — Páginas de Sede /guadalajara + /colima

Fecha: 2026-05-15

## Resumen

- Schema clinic: campo `description` añadido: ✓
- Schema clinic: campo `hours` ya existía (días/apertura/cierre): ✓ (sin cambios)
- Queries CLINIC_BY_SLUG_QUERY actualizada + SERVICES_BY_CLINIC_QUERY nueva: ✓
- DOCTORS_BY_CLINIC_QUERY ya existía (slug-based): ✓ (sin cambios)
- Helper `clinic-hours.ts`: ✓
- Componente `ClinicHours`: ✓
- Componente `ClinicPageContent`: ✓
- JSON-LD MedicalClinic: ✓
- Página `/guadalajara`: ✓
- Página `/colima`: ✓
- Traducciones `clinicPage` es+en: ✓
- Footer con links a sedes + traducciones: ✓
- `sitemap.ts` actualizado: ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/lib/clinic-hours.ts` | Helpers: `formatDayLabel`, `formatHourRange`, `toSchemaOrgOpeningHours` |
| `src/components/ui/ClinicHours.tsx` | Componente tabla de horarios con `useTranslations` |
| `src/components/clinic/ClinicPageContent.tsx` | Componente principal de página de sede (hero, info, mapa, horarios, servicios, doctores, CTA) |
| `src/components/seo/MedicalClinicJsonLd.tsx` | JSON-LD schema.org MedicalClinic |
| `src/app/[locale]/guadalajara/page.tsx` | Página Guadalajara (server component) |
| `src/app/[locale]/colima/page.tsx` | Página Colima (server component, notFound() si no existe en Sanity) |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/sanity/schemas/clinic.ts` | Campo `description` (object es/en) añadido antes de `heroImage` |
| `src/sanity/types.ts` | `description?: { es: string; en: string }` añadido a `Clinic` |
| `src/sanity/queries.ts` | `CLINIC_BY_SLUG_QUERY` incluye `description`; `SERVICES_BY_CLINIC_QUERY` nueva |
| `src/messages/es.json` | Namespace `clinicPage` + claves `footer.locations/locationGuadalajara/locationColima` |
| `src/messages/en.json` | Ídem en inglés |
| `src/components/layout/Footer.tsx` | Columna final con sección "Nuestras sedes" + links a /guadalajara y /colima |
| `src/app/sitemap.ts` | Rutas `/guadalajara` y `/colima` añadidas (priority 0.9) |

## Adaptaciones respecto a la especificación

- **Schema `hours`**: ya existía con campos `days`/`opens`/`closes` (no `day`/`open`/`close`). El helper y componente usan la estructura existente.
- **`DOCTORS_BY_CLINIC_QUERY`**: ya existía con filtro por `clinicSlug` (no `clinicId`). Las páginas pasan `clinic.slug` como parámetro.
- **`buildWhatsAppUrl`**: ya existía en `src/lib/whatsapp.ts`. Reutilizado directamente.

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (26/26 páginas estáticas)
- Diff JSON keys: ✓ (0 diferencias entre es.json y en.json)

## Notas para el cliente — acciones en Sanity Studio

- **Guadalajara**: llenar `description` en Sanity (texto para hero de página de sede)
- **Guadalajara**: llenar horarios (`hours`) en Sanity si no están completos
- **Colima**: crear documento de sede con slug exactamente `colima` (sin esto, `/colima` da 404 limpio)
- **Colima**: llenar `address`, `geo`, `phone`, `email`, `hours`, `description`
- **Colima**: establecer `isPrimary = false`
- **Doctores**: vincular cada doctor a la(s) sede(s) donde atiende (campo `clinics`)
- **Servicios**: si algún servicio es exclusivo de una sede, llenar `availableAt`; sin `availableAt` el servicio aparece en ambas sedes

## Próximos pasos sugeridos

- Tanda 12: `/aviso-de-privacidad`
- Tanda 11: Submarcas Endos + Cuidare (pendiente PDFs del cliente)
- Submit sitemap a Google Search Console después del go-live
