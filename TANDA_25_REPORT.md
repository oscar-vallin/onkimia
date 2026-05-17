# Tanda 25 — Refactor HeroSection con CTA + layout responsive

Fecha: 2026-05-17

## Resumen

- Prop primaryCta opcional agregada: ✓
- Layout responsive (centrado mobile / izquierda desktop): ✓
- Wrapper max-w-xl restringe ancho en desktop: ✓
- Overlay diferenciado mobile/desktop: ✓
- Home pasa primaryCta + id="especialistas": ✓
- Traducciones home.hero.cta: ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/sanity/image-loader.ts` | Recreado (perdido en compactación de contexto) — loader Sanity CDN sin Vercel optimizer |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/ui/HeroSection.tsx` | Prop `primaryCta?`; overlay responsive mobile/desktop; layout `items-center md:items-start`; wrapper `max-w-xl`; removed `align` prop de la desestructuración (ya no necesario — responsiveness es automático); CTA con `<Link>` + `<ArrowRight>` |
| `src/app/[locale]/page.tsx` | `primaryCta={{ label: t('hero.cta'), href: '#especialistas' }}`; `id="especialistas" scroll-mt-20` en sección doctores; eliminado `align="center"` (ya no necesario) |
| `src/messages/es.json` | `home.hero.cta: "Conoce a nuestros especialistas"` |
| `src/messages/en.json` | `home.hero.cta: "Meet our specialists"` |

## Decisiones técnicas

**Overlay opacidades elegidas (medium):**
- Mobile: `bg-gradient-to-b from-brand-900/85 via-brand-900/55 to-brand-900/80` — contraste fuerte arriba y abajo donde va el texto centrado, centro ligeramente más claro
- Desktop: `md:bg-gradient-to-r md:from-brand-900/80 md:via-brand-900/55 md:to-transparent` — preserva el letrero físico de Onkimia visible en la zona derecha

**max-w internos:** eliminados de h1/subtitle/description individuales — el wrapper `max-w-xl` los contiene a todos uniformemente.

**Prop `align` eliminada de la desestructuración** — el comportamiento responsive (centrado mobile → izquierda desktop) es ahora automático. La prop se mantiene en la interface para no romper callers existentes, pero ya no se lee internamente.

**Sección doctores confirmada en línea 141** — `{doctors.length > 0 && <section ...>}`.

**`image-loader.ts` recreado** — el archivo se había perdido en la compactación del contexto de sesión anterior.

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓
- Diff JSON keys (es vs en): ✓ (cero diferencias)

## Notas

- Heroes hardcoded (/endos, /cuidare, /onkimia-doctors): NO modificados
- /nosotros, /servicios, /contacto: usan HeroSection sin CTA — layout responsive mejorado aplica automáticamente (centrado en mobile, izquierda en desktop)
- Scroll suave al CTA: funciona con `scroll-behavior: smooth` en `data-scroll-behavior="smooth"` del `<html>` en layout.tsx
