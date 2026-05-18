# TANDA 30 — /nosotros editable desde CMS (Sanity)

## Estado: ✅ COMPLETADA

## Cambios implementados

### 1. `src/sanity/schemas/aboutPage.ts` — CREADO
Singleton schema con todos los campos editoriales de `/nosotros`:
- Hero: `heroTitle`, `heroDescription`
- "Más que medicina": `moreTitleLine1`, `moreTitleUnderlined`, `moreTitleSuffix`, `moreDescription`
- `differentialServices[]` — array de objetos con `title`, `link`, `linkText`
- "Cuerpo y mente": `bodyMindTitlePrefix`, `bodyMindTitleUnderlined`, `bodyMindTitleSuffix`, `bodyMindDescription`
- Grupo de apoyo: `supportGroupTitle`, `supportGroupDescription`
- Onkimia Aware: `awareTitle`, `awareDescription`
- Testimoniales: `testimonialsTitle`, `testimonialsSubtitle`
- ¿Tienes dudas?: `doubtsTitleUnderlined`, `doubtsTitleSuffix`, `doubtsDescription`
- FAQ: `faqTitleUnderlined`, `faqTitleSuffix`

### 2. `src/sanity/schemas/index.ts` — MODIFICADO
Añadido import y registro de `aboutPage` en `schemaTypes`.

### 3. `sanity.config.ts` — MODIFICADO
Añadido listItem singleton `Página Nosotros` en la estructura del Studio.

### 4. `src/sanity/queries.ts` — MODIFICADO
Añadido `ABOUT_PAGE_QUERY` — consulta GROQ para el singleton `aboutPage`.

### 5. `src/sanity/types.ts` — MODIFICADO
Añadidas interfaces `DifferentialService` y `AboutPage` con todos los campos opcionales.

### 6. `src/app/[locale]/nosotros/page.tsx` — MODIFICADO
- Añadido `ABOUT_PAGE_QUERY` y tipo `AboutPage` a los imports
- `sanityFetch<AboutPage | null>` añadido al `Promise.all`
- Todo el contenido editorial usa `getLocalized(aboutPage?.field, locale) || t('fallback')`
- `differentialServices` mapea desde `aboutPage?.differentialServices ?? []`
- Eliminado `console.log` de depuración

## Validación

```
pnpm tsc --noEmit   → ✅ Sin errores
pnpm build          → ✅ Build exitoso (28/28 páginas)
```
