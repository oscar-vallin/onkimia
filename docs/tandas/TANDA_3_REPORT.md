# Tanda 3 — Reporte de i18n Migration
Fecha: 2026-05-13

## Resumen
- Strings migrados a messages/: 33
- Strings dejados como TODO Tanda 4 (vendrán de Sanity): 26
- Archivos modificados: 5

## Inventario inicial
Total strings encontrados con `locale === 'es' ?`:

| Archivo | Total | Migrados a messages/ | TODO Tanda 4 |
|---------|-------|---------------------|--------------|
| `page.tsx` | 25 | 11 | 14 |
| `nosotros/page.tsx` | 28 | 19 | 8* |
| `Footer.tsx` | 3 | 3 | 0 |
| **TOTAL** | **56** | **33** | **22** |

*Los 8 ítems de la lista de servicios de nosotros (Consulta de oncología, Concierge de seguros, etc.) son deuda temporal documentada con comentario TODO.

## Claves nuevas agregadas

### Namespace `home` (es.json / en.json)
```
home.hero.welcome
home.hero.description
home.care.title
home.care.description
home.doctors.title
home.doctors.description
home.wellness.title
home.wellness.description
home.appointment.title
home.appointment.description
home.appointment.step1
home.appointment.step2
home.appointment.step3
home.insurances.title
```

### Namespace `about` (es.json / en.json)
```
about.hero.title
about.hero.description
about.moreThanMedicine.headingLine1
about.moreThanMedicine.headingUnderlined
about.moreThanMedicine.headingSuffix
about.moreThanMedicine.description
about.bodyMind.headingPrefix
about.bodyMind.headingUnderlined
about.bodyMind.headingSuffix
about.bodyMind.description
about.supportGroup.title
about.supportGroup.description
about.aware.description
about.testimonials.title
about.testimonials.subtitle
about.doubts.headingUnderlined
about.doubts.headingSuffix
about.doubts.description
about.faq.headingUnderlined
about.faq.headingSuffix
about.faq.empty
about.downloadHere
```

### Namespace `footer` (es.json / en.json)
```
footer.menu
footer.followUs
footer.viewPositions
```

### Fix de paridad preexistente
`metadata.servicesPageTitle` y `metadata.servicesPageDescription` existían en `es.json` pero no en `en.json`. Se agregaron a `en.json` para mantener estructura paralela.

## Archivos modificados
1. `src/messages/es.json` — 27 claves nuevas en 3 namespaces nuevos (`home`, `about`, `footer`)
2. `src/messages/en.json` — 27 claves nuevas + 2 de fix de paridad preexistente
3. `src/app/[locale]/page.tsx` — 11 strings migrados a `t('home.*')`, 14 bloques con TODO Tanda 4
4. `src/app/[locale]/nosotros/page.tsx` — 19 strings migrados a `t('about.*')` + `tCommon('contactUs')`, 8 bloques con TODO Tanda 4
5. `src/components/layout/Footer.tsx` — 3 strings migrados a `t('footer.*')`, imports de `locale` y `getLocalized` eliminados

## Decisiones técnicas

### Headings con decoración de subrayado parcial
Los headings de nosotros con subrayado en mitad de palabra (e.g. "Más que **medi**cina") se separaron en claves `headingUnderlined` + `headingSuffix` para preservar el efecto visual. El JSX mantiene la estructura exacta de las `<span>` decorativas.

### Fix de bug: "Preguntas frecuentes" en inglés
El código original mostraba `"Frequ"` + `"ntas frecuentes"` hardcodeado en EN (texto incorrecto). Al migrar se corrigió: `about.faq.headingSuffix` = `"ently asked questions"` en EN.

### Footer: `locale` eliminado del scope
Al migrar los 3 strings del footer a `tFooter()`, `locale` dejó de usarse. Se eliminó de la desestructuración (el prop sigue en la interfaz por compatibilidad con el layout que lo pasa).

### common.scheduleAppointment reutilizado
El botón CTA del home usa `t('appointment.title')` para el texto del botón (consistente con el heading de la sección), manteniendo la clave `common.scheduleAppointment` disponible para otros consumidores.

## TODO Tanda 4 (contenido que vendrá de Sanity)

### En `page.tsx`
- 7 servicios principales (Quimioterapia, Cirugía oncológica, etc.) → `MAIN_SERVICES_QUERY`
- 6 servicios wellness (Técnica de relajación, Fisioterapia, etc.) → `WELLNESS_SERVICES_QUERY`
- 16 aseguradoras (AXA, GNP, etc.) → `INSURANCES_QUERY`

### En `nosotros/page.tsx`
- 8 características de clínica (Consulta de oncología, Concierge de seguros, etc.) → `CLINIC_FEATURES_QUERY`

## Validación

```
✅ pnpm tsc --noEmit — sin errores en archivos del alcance
   (pre-existing error en servicios/page.tsx:156 fuera del alcance)
✅ diff keys es.json vs en.json — estructura 100% paralela
✅ grep locale === 'es' en archivos del alcance — solo bloques TODO Tanda 4
✅ Footer.tsx — sin locale === 'es', sin imports no usados
```
