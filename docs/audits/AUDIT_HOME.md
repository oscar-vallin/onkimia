# Auditoría — Página de Inicio (/)

**Fecha:** 2026-05-12  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Archivo auditado:** `src/app/[locale]/page.tsx`

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Secciones implementadas | 6 / 7 |
| Hallazgos críticos | 3 |
| Hallazgos altos | 5 |
| Hallazgos medios | 4 |
| Hallazgos bajos | 3 |
| **Estado** | ⚠️ Requiere trabajo — no está lista para producción |

---

## Cumplimiento por sección

### Sección 1 — Hero Principal
**Estado: ⚠️ Con problemas**

| Check | Estado | Detalle |
|-------|--------|---------|
| Imagen desde Sanity | ✅ | `settings.homeHeroImage` |
| `.format('webp')` | ✅ | Aplicado en `HeroSection.tsx:50` |
| `.quality()` | ⚠️ | Usa `.quality(85)` — spec pide 82 (diferencia menor) |
| `.width(2400)` | ✅ | Correcto |
| `priority` en `<Image>` | ✅ | Presente |
| `sizes="100vw"` | ✅ | Presente |
| Overlay ≥ 45% | ✅ | `bg-black/50` (50%) — corregido en sesión previa |
| `h1` blanco con `style` inline | ✅ | `style={{ color: '#ffffff' }}` — corregido |
| Subtítulo blanco con `style` inline | ✅ | `style={{ color: '#ffffff' }}` — corregido |
| Tagline desde Sanity | ✅ | `getLocalized(settings.tagline, locale)` |
| Título en i18n | ❌ | `locale === 'es' ? 'Bienvenidos a' : 'Welcome to'` — hardcodeado (línea 42) |
| Descripción en i18n | ❌ | Hardcodeada como fallback (líneas 33-35) — ver HI-01 |

**Hallazgos:**
- `HI-01` (Alto): El título del hero usa `locale === 'es' ?` en línea 42 en lugar de `t('hero.title')`. La descripción (`heroDescription`) está hardcodeada como fallback en líneas 33-35. Aunque tiene un valor primario desde `settings.homeHeroDescription`, el fallback duplica contenido fuera del sistema i18n.

---

### Sección 2 — Cuidarte es nuestra prioridad
**Estado: ❌ Bloqueada (CMS-first violado)**

| Check | Estado | Detalle |
|-------|--------|---------|
| Sección existe | ✅ | Líneas 50-82 |
| Headline traducido | ❌ | Hardcodeado línea 54 |
| Descripción traducida | ❌ | Hardcodeada líneas 57-59 |
| 7 servicios completos | ✅ | Los 7 del spec presentes |
| Servicios desde Sanity | ❌ | **CRÍTICO** — array literal hardcodeado |
| Iconos en servicios | ❌ | Solo punto decorativo (`w-2 h-2 rounded-full`) — spec pide icon |

**Hallazgos:**
- `HC-01` (**CRÍTICO**): Servicios hardcodeados como array literal en líneas 63-71. El spec exige que vengan del schema `service` de Sanity con `featured: true`. El cliente no puede editarlos sin redeploy.
- `HC-02` (Medio): Los 7 servicios no tienen icono (solo un punto accent). El spec especifica "icon + nombre" para cada servicio. El campo `icon` (nombre de Lucide) debería venir del schema `service`.
- `HC-03` (Alto): Headline y descripción de sección hardcodeados con `locale === 'es' ?` (líneas 54, 57-59).

---

### Sección 3 — Conoce a nuestros especialistas
**Estado: ⚠️ Con problemas menores**

| Check | Estado | Detalle |
|-------|--------|---------|
| Sección existe | ✅ | Líneas 84-129 |
| Headline traducido | ❌ | Hardcodeado línea 90 |
| Datos desde DOCTORS_QUERY | ✅ | Correcto |
| Filtra `isActive: true` | ✅ | Dentro de la query en `queries.ts` |
| Ordena por `order asc, fullName asc` | ✅ | Correcto en query |
| Foto con `next/image` | ✅ | Línea 107 |
| `.format('webp')` en urlFor | ❌ | `.width(400).height(533)` sin webp (línea 108) |
| `alt` con nombre | ✅ | `alt={doctor.fullName}` |
| Especialidad localizada | ✅ | `getLocalized(doctor.specialty, locale)` |
| `sizes` apropiado | ✅ | `(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw` |
| Grid responsive | ✅ | `grid-cols-1 md:grid-cols-3 lg:grid-cols-4` |
| `priority` ausente (below-fold) | ✅ | Sin priority — correcto |

**Hallazgos:**
- `HS-01` (Medio): Headline, subheadline y descripción hardcodeados con `locale === 'es' ?` (líneas 90, 93-96).
- `HS-02` (Medio): `.format('webp')` ausente en `urlFor(doctor.photo)`. El CDN de Sanity servirá JPEG/PNG original para las fotos de médicos, impactando LCP móvil.
- `HS-03` (Bajo): `doctors.slice(0, 8)` muestra máximo 8 doctores sin enlace a "ver todos" ni paginación. Si la clínica tiene más de 8 médicos activos, los restantes no se ven desde Home.

---

### Sección 4 — Bienestar integral, en un solo lugar
**Estado: ❌ Bloqueada (CMS-first violado)**

| Check | Estado | Detalle |
|-------|--------|---------|
| Sección existe | ✅ | Líneas 131-198 |
| Headline traducido | ❌ | Hardcodeado línea 136 |
| Descripción traducida | ❌ | Hardcodeada líneas 139-140 |
| 6 servicios completos | ✅ | Los 6 del spec presentes |
| Servicios desde Sanity | ❌ | **CRÍTICO** — array literal hardcodeado |
| Tienen hover state | ✅ | `hover:border-accent-500 transition-colors` |
| Son links | ❌ | Solo cards estáticas, no navegables |
| Icon + título + descripción | ❌ | Sin icono — spec pide icon |
| `priority` ausente (below-fold) | ✅ | Sin imágenes, N/A |

**Hallazgos:**
- `HB-01` (**CRÍTICO**): Los 6 servicios complementarios están hardcodeados como array literal en líneas 146-183. Deben venir de Sanity (mismo schema `service` con campo `category: 'wellness'` o schema propio `wellnessService`).
- `HB-02` (Medio): Ningún card tiene icono. El spec indica "cuadros interactivos" con icon + título + descripción.
- `HB-03` (Bajo): Los cards no son links/navegables. Si cada servicio tendrá página propia, deben incluir `href` al schema correspondiente.

---

### Sección 5 — Agenda tu cita
**Estado: ⚠️ Con problemas menores**

| Check | Estado | Detalle |
|-------|--------|---------|
| Sección existe | ✅ | Líneas 200-248 |
| 3 steps del flujo | ✅ | Presentes (líneas 213-237) |
| Botón → `/contacto` | ✅ | `<Link href="/contacto">` (línea 240) |
| Botón usa `accent-500` | ✅ | Correcto |
| Textos de steps traducidos | ❌ | Hardcodeados (líneas 219, 227, 235) |
| Numeración visual de steps | ✅ | Círculos numerados 1-2-3 |

**Hallazgos:**
- `HA-01` (Alto): Título de sección, descripción, los tres títulos de steps y el texto del botón están hardcodeados con `locale === 'es' ?` (líneas 205, 208-210, 219, 227, 235, 244). Deben migrarse a `messages/*.json`.

---

### Sección 6 — Convenios (Aseguradoras)
**Estado: ❌ CRÍTICO**

| Check | Estado | Detalle |
|-------|--------|---------|
| Sección existe | ✅ | Líneas 250-275 |
| Datos desde Sanity | ❌ | **CRÍTICO** — 16 strings hardcodeados |
| Schema `insurance` existe | ❌ | No existe en `src/sanity/schemas/` |
| Query `INSURANCES_QUERY` existe | ❌ | No existe en `queries.ts` |
| Tipo `Insurance` en types.ts | ❌ | No existe (solo referencia incidental en FAQ category) |
| `next/image` para logos | ❌ | Sin imágenes — solo texto plano |
| `alt` con nombre aseguradora | ❌ | N/A — no hay imágenes |
| 16 aseguradoras del spec | ✅ | Las 16 presentes |

**Aseguradoras presentes vs esperadas:**

| # | Esperada (spec) | Encontrada en código | Match |
|---|-----------------|---------------------|-------|
| 1 | AXA | AXA | ✅ |
| 2 | GNP | GNP | ✅ |
| 3 | MAPFRE | MAPFRE | ✅ |
| 4 | VUMI | VUMI | ✅ |
| 5 | INBURSA | INBURSA | ✅ |
| 6 | BANORTE | BANORTE | ✅ |
| 7 | BESTDOCTORS | BESTDOCTORS | ✅ |
| 8 | MD ABROAD | MD ABROAD | ✅ |
| 9 | CIGNA | CIGNA | ✅ |
| 10 | SURA | SURA | ✅ |
| 11 | BX+ | BX+ | ✅ |
| 12 | ZURICH | ZURICH | ✅ |
| 13 | SCOTIABANK | SCOTIABANK | ✅ |
| 14 | HEALTHCARE | **HEALTHCASE** | ⚠️ typo posible |
| 15 | ATLAS | ATLAS | ✅ |
| 16 | AXA ASSISTANCE | AXA ASSISTANCE | ✅ |

**Notas:** "HEALTHCASE" en el código probablemente es typo de "HEALTHCARE". Confirmar con el cliente.

**Hallazgos:**
- `HCV-01` (**CRÍTICO**): Las 16 aseguradoras están hardcodeadas como array de strings. No hay logos, no hay URLs, no hay estado activo/inactivo. El cliente no puede gestionarlas desde CMS. Requiere schema `insurance` completo.
- `HCV-02` (Alto): No hay imágenes de logos — la sección muestra solo texto sobre fondo neutro. La intención del spec es una grilla de logos visuales.
- `HCV-03` (Bajo): "HEALTHCASE" en el código — verificar si es "HEALTHCARE" o nombre real de la aseguradora.

---

### Sección 7 — Descarga App Onkimia
**Estado: ✗ FALTANTE**

La sección de descarga de la App Onkimia no existe en `page.tsx`. No hay ningún elemento relacionado con `appDownloadUrl`, App Store, Play Store ni descarga de aplicación.

El campo `appDownloadUrl` tampoco existe en `SiteSettings` (types.ts) ni en el schema `siteSettings.ts`.

**Hallazgos:**
- `HAP-01` (Alto): Sección de App Onkimia completamente ausente. Requiere:
  1. Agregar campo `appDownloadUrl?: string` a schema `siteSettings` y tipo `SiteSettings`
  2. Implementar la sección en `page.tsx` con condicional `{settings.appDownloadUrl && <section>...`

---

## Violaciones CMS-first

| Elemento | Hardcodeado en | Líneas | Schema requerido |
|----------|----------------|--------|-----------------|
| 7 servicios principales | `page.tsx` | 63-71 | `service` (con `category: 'main'`, `featured: boolean`) |
| 6 servicios complementarios | `page.tsx` | 146-183 | `service` (con `category: 'wellness'`) o schema propio |
| 16 aseguradoras | `page.tsx` | 258-263 | `insurance` (name, logo, website, isActive, order) |
| App download URL | Ausente | N/A | Campo `appDownloadUrl` en `siteSettings` |

---

## Strings hardcodeados (i18n)

34 ocurrencias de `locale === 'es' ?` en `page.tsx`. Tabla de las más significativas:

| Línea | String (ES) | Clave i18n sugerida |
|-------|-------------|---------------------|
| 33-34 | `'En Onkimia fusionamos...'` | `home.hero.description` |
| 42 | `'Bienvenidos a'` | `home.hero.title` |
| 54 | `'Cuidarte es nuestra prioridad'` | `home.care.title` |
| 57-59 | `'Cada persona es única...'` | `home.care.description` |
| 64 | `'Quimioterapia'` | — (datos de CMS, no de i18n) |
| 65 | `'Cirugía oncológica'` | — (datos de CMS) |
| 66 | `'Cuidados paliativos'` | — (datos de CMS) |
| 67 | `'Detección temprana'` | — (datos de CMS) |
| 68 | `'Atención médica especializada'` | — (datos de CMS) |
| 69 | `'Servicios complementarios...'` | — (datos de CMS) |
| 70 | `'Acompañamiento humano...'` | — (datos de CMS) |
| 90 | `'Conoce a nuestros especialistas'` | `home.doctors.title` |
| 93 | `'Forma parte de la familia Onkimia...'` | `home.doctors.subtitle` |
| 94-96 | `'Nuestro equipo multidisciplinario...'` | `home.doctors.description` |
| 136 | `'Bienestar integral, en un solo lugar'` | `home.wellness.title` |
| 139-140 | `'Más que un centro médico...'` | `home.wellness.description` |
| 148-182 | Títulos y descripciones de 6 servicios | — (datos de CMS) |
| 205 | `'Agenda tu cita'` | `home.appointment.title` |
| 208-210 | `'Tres simples pasos...'` | `home.appointment.description` |
| 219 | `'Elige lo que necesitas'` | `home.appointment.step1` |
| 227 | `'Selecciona a tu especialista'` | `home.appointment.step2` |
| 235 | `'Agenda tu cita en Onkimia'` | `home.appointment.step3` |
| 244 | `'Agendar Cita'` | `common.scheduleAppointment` (ya existe en messages!) |
| 254 | `'Convenios'` | `home.insurances.title` |

**Nota:** `common.scheduleAppointment` ya existe en `messages/es.json` ("Agendar cita") pero la línea 244 no lo usa. Inconsistencia directa.

---

## Schemas Sanity pendientes

### 1. `service.ts` (URGENTE — bloquea secciones 2 y 4)

```
Nombre: service
Campos:
  name: LocalizedString (requerido)
  description: LocalizedText (requerido)
  icon: string (nombre de icono Lucide, ej: 'HeartPulse')
  category: 'main' | 'wellness'  
  isActive: boolean (default true)
  order: number
  availableAt?: array de refs a clinic

Query GROQ:
  MAIN_SERVICES_QUERY = *[_type == "service" && category == "main" && isActive == true] 
    | order(order asc) { _id, name, description, icon }

  WELLNESS_SERVICES_QUERY = *[_type == "service" && category == "wellness" && isActive == true]
    | order(order asc) { _id, name, description, icon }
```

### 2. `insurance.ts` (URGENTE — bloquea sección 6)

```
Nombre: insurance
Campos:
  name: string (requerido)
  logo: image (requerido para grid visual)
  website: url (opcional)
  isActive: boolean (default true)
  order: number

Query GROQ:
  INSURANCES_QUERY = *[_type == "insurance" && isActive == true]
    | order(order asc) { _id, name, logo, website }
```

### 3. Campo en `siteSettings` (para sección 7)

```
Campo a agregar en siteSettings.ts y types.ts:
  appDownloadUrl?: string   (URL de App Store / Play Store o landing)
```

---

## Imágenes con problemas

| Componente | Uso | Problema |
|-----------|-----|---------|
| `HeroSection.tsx:50` | `.quality(85)` | Spec pide 82 (menor) |
| `HeroSection.tsx:55` | `quality={85}` en `<Image>` | Duplicado con urlFor — doble compresión |
| `page.tsx:108` | Doctor photo `.width(400).height(533)` | Sin `.format('webp')` |

---

## SEO de la página Home

| Check | Estado | Detalle |
|-------|--------|---------|
| `generateMetadata` propio | ❌ | Home NO tiene `generateMetadata` — usa solo el default del layout |
| `title` específico para Home | ❌ | Solo usa el default "Onkimia — Clínica Oncológica Especializada" |
| `description` específica | ❌ | Ídem |
| `openGraph` | ❌ | Ausente en layout y en página |
| `twitter` card | ❌ | Ausente |
| `canonical` URL | ❌ | No configurado |
| JSON-LD MedicalOrganization | ✅ | Inyectado en `<head>` del layout (sesión previa) |

---

## Accesibilidad

| Check | Estado | Detalle |
|-------|--------|---------|
| Un único `<h1>` | ✅ | En HeroSection |
| Jerarquía h1 → h2 → h3 | ✅ | Sin saltos |
| `<section>` con `aria-label` | ❌ | Todas las secciones sin `aria-label` ni `aria-labelledby` |
| `alt` en imágenes de contenido | ✅ | `doctor.fullName` en fotos de médicos |
| `alt` descriptivo en hero | ✅ | `alt={title}` |
| Botones con texto visible | ✅ | Todos tienen texto |
| Links descriptivos | ✅ | Sin "click aquí" |

---

## Componentes utilizados en Home

| Componente | Tipo | Justificación |
|-----------|------|--------------|
| `HeroSection` | Server ✅ | Solo renderiza JSX — correcto |
| `Link` (next-intl) | Server ✅ | |
| `Image` (next/image) | Server ✅ | |
| TestimonialCarousel | **No se usa en Home** | Solo en /nosotros |
| FAQCarousel | **No se usa en Home** | Solo en /nosotros |

Sin 'use client' innecesarios.

---

## Recomendaciones priorizadas

### Críticos (3)

1. **[C] HC-01 + HB-01** — Crear schema `service` en Sanity y reemplazar ambos arrays hardcodeados (secciones 2 y 4). Es una sola tarea que resuelve dos violaciones CMS-first.

2. **[C] HCV-01** — Crear schema `insurance` y reemplazar el array de 16 strings hardcodeados. Sin logos reales, la sección no cumple el spec visual.

3. **[C] HCV-02** — Los logos de aseguradoras no existen como imágenes. El cliente debe subir los 16 logos al nuevo schema antes de que la sección sea funcional.

### Altos (5)

4. **[A] HI-01 + HA-01 + HS-01** — Migrar los 34 strings de `locale === 'es' ?` a `messages/es.json` y `messages/en.json`. Crear namespace `home` en ambos archivos.

5. **[A] HAP-01** — Implementar sección App Onkimia: campo en siteSettings + sección en page.tsx con condicional.

6. **[A] SEO** — Agregar `generateMetadata` propio a `page.tsx` con `openGraph` e imagen del hero.

7. **[A] HC-02 + HB-02** — Agregar campo `icon` (nombre de Lucide) al schema `service`. Sin iconos, ambas secciones se ven incompletas.

8. **[A] HS-02** — Agregar `.format('webp')` a `urlFor(doctor.photo)` en las cards de médicos.

### Medios (4)

9. **[M] HCV-03** — Confirmar con cliente si "HEALTHCASE" es correcto o es "HEALTHCARE".

10. **[M] Accessibility** — Agregar `aria-label` a cada `<section>` con su título correspondiente.

11. **[M] HeroSection quality** — Unificar quality en 82 y remover la prop `quality={85}` redundante en `<Image>`.

12. **[M] HS-03** — Agregar enlace "Ver todos nuestros especialistas" al final de la grilla de médicos.

---

## Bloqueadores para continuar (no iniciar nuevas páginas sin resolver esto)

| Bloqueador | Motivo |
|-----------|--------|
| Crear schema `service` | Desbloquea secciones 2 y 4 — actualmente hardcodeadas |
| Crear schema `insurance` | Desbloquea sección 6 — actualmente hardcodeada |
| Cliente debe proveer logos de aseguradoras | Sin logos el schema no sirve de nada |
| Migrar strings a messages/ | La home está completamente fuera del sistema i18n |

---

*AUDITORÍA HOME COMPLETA. Ver AUDIT_HOME.md*
