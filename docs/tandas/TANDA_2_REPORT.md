# Tanda 2 — Reporte de schemas CMS

**Fecha:** 2026-05-12  
**Ejecutor:** Claude Code (claude-sonnet-4-6)

---

## Resumen

| Fix | Descripción | Estado |
|-----|-------------|--------|
| FIX 1 | Schema `service` | ✓ |
| FIX 2 | Schema `insurance` | ✓ |
| FIX 3 | Campos nuevos en `siteSettings` | ✓ |
| FIX 4 | Registro en `schemas/index.ts` | ✓ |
| FIX 5 | Structure en `sanity.config.ts` | ✓ |
| FIX 6 | Tipos en `types.ts` | ✓ |
| FIX 7 | Queries en `queries.ts` | ✓ |

---

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/sanity/schemas/service.ts` | Schema para 7 servicios principales + 6 complementarios |
| `src/sanity/schemas/insurance.ts` | Schema para las 16 aseguradoras |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/sanity/schemas/siteSettings.ts` | Agregados campos `aboutHeroImage` y `appDownloadUrl` |
| `src/sanity/schemas/index.ts` | Imports y exports de `service` e `insurance` |
| `sanity.config.ts` | Ítems "Servicios" y "Aseguradoras" en `structureTool` |
| `src/sanity/types.ts` | Import `LocalizedText`; `aboutHeroImage?` y `appDownloadUrl?` en `SiteSettings`; interfaces `Service`, `Insurance`, tipo `ServiceCategory` |
| `src/sanity/queries.ts` | Queries `MAIN_SERVICES_QUERY`, `WELLNESS_SERVICES_QUERY`, `INSURANCES_QUERY` |

---

## Detalle de cada fix

### FIX 1 — Schema `service`

```
Campos: name (LocalizedString), description (LocalizedText), icon (string),
        category ('main'|'wellness'), order (number), isActive (boolean),
        availableAt (array ref → clinic)
Preview: muestra nombre ES + categoría + icon name
Ordenamiento: por order asc
```

### FIX 2 — Schema `insurance`

```
Campos: name (string), logo (image, requerido), website (url, opcional),
        order (number), isActive (boolean)
Preview: muestra nombre + thumbnail del logo
Ordenamientos: por order asc | nombre A-Z
```

Nota técnica: El tipo del campo `media` en el preview de Sanity es polimórfico. Se resolvió con `prepare(selection)` sin anotación explícita y cast interno a `{ title?: string; media?: string; isActive?: boolean }` para mantener strict mode sin `any`.

### FIX 3 — Campos en `siteSettings`

| Campo | Tipo | Posición |
|-------|------|----------|
| `aboutHeroImage` | `image` (hotspot: true) | Junto a `logoDark` (grupo de imágenes) |
| `appDownloadUrl` | `url` (http/https) | Junto a `socialMedia` (grupo de URLs externas) |

### FIX 5 — Structure del Studio

El menú lateral del Studio queda:
```
Configuración del sitio
──────────────────────
Clínicas
Doctores
Servicios          ← nuevo
Aseguradoras       ← nuevo
```

### FIX 6 — Tipos TypeScript

Nuevos en `types.ts`:
- `SiteSettings`: +`aboutHeroImage?: Image`, +`appDownloadUrl?: string`
- `ServiceCategory = 'main' | 'wellness'`
- `Service { _id, name, description?, icon, category, order?, isActive, availableAt? }`
- `Insurance { _id, name, logo, website?, order?, isActive }`

### FIX 7 — Queries GROQ

| Query | Filtra | Ordena |
|-------|--------|--------|
| `MAIN_SERVICES_QUERY` | `category == "main" && isActive == true` | `order asc` |
| `WELLNESS_SERVICES_QUERY` | `category == "wellness" && isActive == true` | `order asc` |
| `INSURANCES_QUERY` | `isActive == true` | `order asc, name asc` |

---

## Validación final

| Check | Resultado |
|-------|-----------|
| `pnpm tsc --noEmit` | ✓ Sin errores |
| `pnpm build` | ✓ Build exitoso |
| Sin `any` en schemas nuevos | ✓ |
| Studio con nuevos schemas | ✓ (validación manual — Sanity Studio en `/studio`) |

---

## Notas para el cliente

El cliente debe crear en Sanity Studio (`/studio`) el siguiente contenido antes de que las secciones del Home funcionen con datos reales:

### 13 Servicios

**Categoría `main` (sección "Cuidarte es nuestra prioridad"):**

| Nombre ES | Nombre EN | Icon sugerido |
|-----------|-----------|---------------|
| Quimioterapia | Chemotherapy | `Syringe` |
| Cirugía oncológica | Oncological surgery | `Scissors` |
| Cuidados paliativos | Palliative care | `Heart` |
| Detección temprana | Early detection | `Search` |
| Atención médica especializada | Specialized medical care | `Stethoscope` |
| Servicios complementarios personalizados | Personalized complementary services | `Plus` |
| Acompañamiento humano y profesional | Human and professional support | `Users` |

**Categoría `wellness` (sección "Bienestar integral"):**

| Nombre ES | Nombre EN | Icon sugerido |
|-----------|-----------|---------------|
| Técnica de relajación | Relaxation technique | `Wind` |
| Fisioterapia | Physiotherapy | `Dumbbell` |
| Terapia Psicológica | Psychological Therapy | `Brain` |
| Boutique Oncológica | Oncology Boutique | `ShoppingBag` |
| Nutrición Clínica | Clinical Nutrition | `Apple` |
| Pruebas Genómicas | Genomic Testing | `Dna` |

> Los nombres de iconos son sugerencias. El cliente puede elegir cualquier icono de [lucide.dev/icons](https://lucide.dev/icons/).

### 16 Aseguradoras (requieren logos)

AXA, GNP, MAPFRE, VUMI, INBURSA, BANORTE, BESTDOCTORS, MD ABROAD, CIGNA, SURA, BX+, ZURICH, SCOTIABANK, ATLAS, AXA ASSISTANCE

> **Pendiente confirmar:** el código tenía "HEALTHCASE" — verificar si es "HEALTHCARE" u otro nombre oficial.

### Imágenes opcionales en Settings

- **Imagen Hero de Nosotros** (`aboutHeroImage`): si se deja vacío, la página /nosotros usará la misma imagen que el Home.
- **URL de descarga App Onkimia** (`appDownloadUrl`): puede dejarse vacío por ahora; la sección de la app se ocultará automáticamente cuando esté vacío.

---

## Próximos pasos

Listo para **Tanda 3 — i18n migration**: migrar los 34 strings `locale === 'es' ?` de `page.tsx`, strings de `nosotros/page.tsx` y `Footer.tsx` a `messages/es.json` y `messages/en.json`.
