# Tanda 12 — Página /aviso-de-privacidad

Fecha: 2026-05-15

## Resumen

- Schema Sanity `privacyPolicy` (singleton): ✓
- Registro en `schemas/index.ts`: ✓
- Singleton en `sanity.config.ts` structureTool: ✓
- `PRIVACY_POLICY_QUERY` en queries.ts: ✓
- Tipos `PortableTextBlock`, `PrivacyPolicySection`, `PrivacyPolicy` en types.ts: ✓
- Paquete `@portabletext/react` instalado (v6.2.0): ✓
- Componente `PortableTextContent`: ✓
- Página `/aviso-de-privacidad` con `noIndex: true`: ✓
- Traducciones `privacy` es+en: ✓
- Link desde Footer (`footer.privacyPolicy`): ✓
- Ruta en `sitemap.ts` (priority 0.3): ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/sanity/schemas/privacyPolicy.ts` | Schema singleton con title/lastUpdated/introduction/content (PortableText por sección ES+EN) |
| `src/components/ui/PortableTextContent.tsx` | Renderizador de Portable Text con estilos (normal/h3/lists/marks/links) |
| `src/app/[locale]/aviso-de-privacidad/page.tsx` | Página con noIndex, datos de Sanity, layout limpio bilingüe |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/sanity/schemas/index.ts` | Import + registro de `privacyPolicy` |
| `sanity.config.ts` | Singleton listItem `documentId('privacyPolicy')` en structureTool |
| `src/sanity/queries.ts` | `PRIVACY_POLICY_QUERY` añadida |
| `src/sanity/types.ts` | `PortableTextBlock`, `PrivacyPolicySection`, `PrivacyPolicy` añadidas |
| `src/messages/es.json` | Namespace `privacy` + `footer.privacyPolicy` |
| `src/messages/en.json` | Ídem en inglés |
| `src/components/layout/Footer.tsx` | Link a `/aviso-de-privacidad` en columna Bolsa/Legal |
| `src/app/sitemap.ts` | Ruta `/aviso-de-privacidad` (priority 0.3, changeFrequency yearly) |

## Decisiones técnicas

- **noIndex**: La página existe para cumplimiento legal (LFPDPPP) pero no debe competir en SEO — `noIndex: true` en `buildMetadata()`.
- **Singleton pattern**: `documentId('privacyPolicy')` fijo en structureTool previene creación de múltiples documentos.
- **PortableText por idioma**: Campos separados `bodyEs` / `bodyEn` en lugar de un solo campo con anotación de idioma — más simple para el editor en Sanity Studio.
- **Sitemap incluido**: Aunque con noIndex, la URL en el sitemap es válida para herramientas de auditoría de privacidad.

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (build completa, `/aviso-de-privacidad` como ruta dinámica)
- Diff JSON keys: ✓ (0 diferencias entre es.json y en.json)

## Notas para el cliente — acciones en Sanity Studio

1. Abrir **Aviso de Privacidad** en el Studio (nuevo ítem en menú lateral)
2. Llenar las **9 secciones mínimas LFPDPPP**:
   - Identidad y domicilio del responsable
   - Datos personales recabados
   - Finalidades del tratamiento
   - Transferencias de datos
   - Derechos ARCO
   - Mecanismo para ejercer derechos ARCO
   - Consentimiento (tácito o expreso)
   - Cambios al aviso de privacidad
   - Contacto del responsable
3. Actualizar el campo **Última actualización** con la fecha de publicación real
4. El link aparece automáticamente en el Footer bajo "Bolsa de Trabajo"

## Próximos pasos sugeridos

- Tanda 11: Submarcas Endos + Cuidare (pendiente PDFs del cliente)
- Submit sitemap a Google Search Console después del go-live
