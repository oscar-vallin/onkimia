# Guía — Sistema de secciones modulares

Esta guía explica cómo están construidas las páginas del sitio (home y páginas de clínica como `/colima`), cómo cambiar qué secciones muestra cada una, cómo actualizar la información de una clínica y cómo crear secciones nuevas.

---

## 1. Cómo funciona

Cada página es una **lista ordenada de secciones**. Las secciones son componentes autocontenidos: cada una obtiene sus propios textos (traducciones) y datos, por lo que se pueden reutilizar en cualquier página sin duplicar código.

Hay tres piezas:

| Pieza | Archivo | Qué hace |
|---|---|---|
| **Registro de secciones** | `src/components/sections/registry.tsx` | Catálogo de todas las secciones disponibles (`SECTION_REGISTRY`) y el renderer `<PageSections>` |
| **Composición de páginas** | `src/config/pageSections.ts` | Define qué secciones lleva cada página y en qué orden |
| **Datos de clínicas** | `src/config/clinicConfig.ts` | Dirección, teléfonos, WhatsApp, email, mapa de cada clínica |

Los textos (español/inglés) viven en `src/messages/es.json` y `src/messages/en.json`.

---

## 2. Secciones disponibles

Estas son las llaves que se pueden usar en cualquier página (`src/config/pageSections.ts`):

| Llave | Contenido | Origen de datos |
|---|---|---|
| `hero` | Hero principal con imagen, título y CTAs | `messages → home.homeHero` |
| `howItWorks` | "Cómo funciona" — 3 pasos con imágenes | `messages → home.howItWorks` + Sanity |
| `pillars` | Pilares (cáncer, cardiovascular, etc.) | `messages → home.pillars` |
| `studies` | Estudios diagnósticos con galería | `messages → home.studies` + Sanity |
| `services` | Servicios por etapa (sticky) | `messages → home.services` |
| `doctors` | Grid de doctores (streaming + skeleton) | Sanity + `messages → home.doctors` |
| `wellness` | Bienestar integral | `messages → home.wellness` |
| `insurances` | Aseguradoras / convenios (streaming) | Sanity + `messages → home.insurances` |
| `appointment` | CTA de agendar cita con imagen de fondo | `messages → home.appointment` + Sanity |
| `clinicInfo` | **Dirección, teléfono, WhatsApp, email** de la clínica | `clinicConfig` + `messages → clinicSections.contact` |
| `clinicServices` | Mención breve de servicios con pills | `messages → clinicSections.services` |
| `clinicCta` | CTA final de contacto | `messages → clinicSections.cta` |

Las secciones `clinic*` reciben automáticamente los datos de la clínica de la página donde se rendericen.

---

## 3. Cambiar las secciones de una página

Edita **únicamente** `src/config/pageSections.ts`. Ejemplo actual:

```ts
export const CLINIC_PAGE_SECTIONS: Record<ClinicSlug, readonly SectionKey[]> = {
  guadalajara: [],   // Guadalajara se sirve desde el home
  colima: [
    'hero',        // mismo hero que el home
    'howItWorks',
    'pillars',
    'studies',
    'services',
    'doctors',
    'wellness',
    'insurances',
    'appointment',
    'clinicInfo',  // dirección / teléfono / WhatsApp / email de Colima
  ],
};
```

- **Agregar una sección**: añade su llave en la posición deseada. Por ejemplo, para que Colima muestre también las aseguradoras: `[..., 'insurances', 'clinicCta']`.
- **Quitar una sección**: elimina la llave del arreglo.
- **Reordenar**: cambia el orden del arreglo — el orden del arreglo es el orden en pantalla.
- La sección `clinicInfo` es **opcional**: si una clínica no debe mostrar su información de contacto, simplemente no incluyas esa llave.

No hay que tocar ningún otro archivo. TypeScript avisará si escribes una llave que no existe.

---

## 4. Actualizar la información de una clínica

Todo (dirección, teléfonos, WhatsApp, email, link de Google Maps) vive en `src/config/clinicConfig.ts`:

```ts
colima: {
  slug: 'colima',
  name: 'Onkimia Colima',
  phone: '(312) 159 9010',
  phoneHref: 'tel:+523121599010',
  whatsapp: '312 317 6676',          // null si la clínica no tiene WhatsApp
  whatsappHref: 'https://wa.me/5213123176676',
  email: 'contacto@onkimia.com',
  address: 'Av. La Paz #33, Santa Bárbara Residencial, C.P. 28079, Colima',
  mapsUrl: 'https://maps.google.com/?q=...',
  city: 'Colima',
  ...
},
```

Al editar aquí, la sección `clinicInfo` (y el Header, Footer y página de contacto) se actualizan automáticamente. Si `whatsapp` es `null`, la tarjeta de WhatsApp no se muestra.

---

## 5. Abrir una clínica nueva (ej. Morelia)

1. **Datos** — agrega la clínica en `src/config/clinicConfig.ts` (ambas estructuras: `clinicConfig` y `CLINICS`).
2. **Composición** — agrega su entrada en `src/config/pageSections.ts`:
   ```ts
   morelia: ['clinicInfo', 'doctors', 'clinicServices', 'clinicCta'],
   ```
3. **Ruta** — crea `src/app/[locale]/morelia/page.tsx` copiando `colima/page.tsx` y cambiando `colima` → `morelia` (3 lugares: `CLINIC_PAGE_SECTIONS.morelia`, `SetClinicOnMount clinic="morelia"` y `clinic="morelia"` en `PageSections`), más su namespace de metadata.

Los textos genéricos (`clinicSections.*`) usan la variable `{city}` — "Estamos en *Morelia*" sale solo, sin tocar traducciones.

---

## 6. Cambiar textos

Los textos están duplicados por idioma en:

- `src/messages/es.json`
- `src/messages/en.json`

Las secciones del home leen del namespace `home.*`; las de clínica leen de `clinicSections.*`. **Siempre edita ambos archivos** (es y en) para mantener los dos idiomas sincronizados. En los textos de `clinicSections`, `{city}` se sustituye por la ciudad de la clínica y `*texto*` se renderiza en cursiva.

---

## 7. Crear una sección nueva

1. Crea el componente en `src/components/sections/home/` (si es genérica) o `src/components/sections/clinic/` (si depende de la clínica). Debe aceptar `SectionProps`:

   ```tsx
   import { getTranslations } from 'next-intl/server';
   import type { SectionProps } from '@/components/sections/registry';

   export async function TestimoniosSection({ locale, clinic }: SectionProps) {
     const t = await getTranslations('home');
     return <section>…</section>;
   }
   ```

   Props disponibles: `locale` (idioma), `clinic` (slug de la clínica si es página de clínica), `first` (true si es la primera sección de la página — útil para compensar el header fijo cuando no hay hero).

2. Regístrala en `src/components/sections/registry.tsx` — **una línea**:

   ```ts
   export const SECTION_REGISTRY = {
     ...
     testimonios: TestimoniosSection,
   } as const;
   ```

3. Úsala en cualquier página agregando `'testimonios'` a su arreglo en `pageSections.ts`.

Las páginas existentes no se modifican — el sistema está diseñado para extenderse sin tocar lo que ya funciona (principio Open/Closed).

---

## 8. Notas técnicas

- **Streaming**: `doctors` e `insurances` cargan en diferido con esqueletos de carga propios; se pueden colocar en cualquier posición sin afectar la velocidad del resto de la página.
- **Header oscuro**: las páginas de clínica sin sección `hero` activan automáticamente el tema oscuro del header (`PageTheme`). Si agregas `hero` a una clínica, esto se desactiva solo.
- **Verificación**: después de cualquier cambio ejecuta `npx tsc --noEmit` — detecta llaves de sección inexistentes o datos faltantes antes de desplegar.
