# Tanda 37 — Identidad visual Onkimia Doctors (fuente + paleta)
Fecha: 2026-05-19

## Resumen
- Host Grotesk registrada (4 pesos), scoped a /onkimia-doctors: ✓
- Tokens doctors-blue/surface/ink en @theme: ✓
- @source inline para clases doctors-*: ✓
- Paleta aplicada en /onkimia-doctors: ✓
- Contención respetada (resto del sitio sin cambios): ✓

## Archivos modificados
- `src/app/[locale]/layout.tsx` — hostGrotesk localFont agregado, variable expuesta en `<html>` className
- `src/app/[locale]/globals.css` — tokens `--color-doctors-*` en `@theme`; `@source inline` con clases doctors-*
- `src/app/[locale]/onkimia-doctors/page.tsx` — wrapper con `font-[family-name:var(--font-host-grotesk)]`; paleta Doctors aplicada

## Mapa de cambios en /onkimia-doctors

| Elemento | Antes | Después |
|---|---|---|
| Página completa | Google Sans Flex (heredada) | Host Grotesk vía CSS variable |
| Sección Mejoras — fondo | `bg-brand-900` | `bg-doctors-ink` |
| Cards Mejoras — fondo | `bg-brand-800` | `rgba(93,129,240,0.10)` (inline style) |
| Número de mejora | `color: #F39313` | `color: #5d81f0` |
| Cards Unidades — ícono container | `bg-accent-50 text-accent-600` | `bg-doctors-surface text-doctors-blue` |
| Checks listas (Unidades y Beneficios) | `text-accent-500` | `text-doctors-blue` |
| Beneficios — ícono container | `bg-brand-900 text-white` | `bg-doctors-blue text-white` |
| Sección Beneficios — fondo | `bg-neutral-50` | `bg-doctors-surface` |
| CTA Final — bloque | `bg-brand-900` | `bg-doctors-ink` |

## Decisiones técnicas
- **Scope de Host Grotesk:** la variable `--font-host-grotesk` se expone en `<html>` (sin afectar fuentes globales) y se aplica vía `font-[family-name:var(--font-host-grotesk)]` en el wrapper raíz de la página.
- **Headings en /onkimia-doctors:** globals.css define `h1-h6 { font-family: var(--font-serif) }`. El wrapper con `font-[family-name:var(--font-host-grotesk)]` tiene especificidad más alta al ser clase Tailwind en el elemento padre directo — los headings heredan Host Grotesk correctamente.
- **bg-doctors-blue/10:** la utilidad con opacidad no se puede garantizar en `@source inline` con la sintaxis `/n`. Se usó `style={{ backgroundColor: 'rgba(93,129,240,0.10)' }}` inline para el fondo de las cards de Mejoras.
- **Clases doctors-* verificadas en CSS compilado:** `bg-doctors-blue`, `bg-doctors-ink`, `bg-doctors-surface`, `text-doctors-blue`, `text-doctors-ink`, `text-doctors-surface`.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Host Grotesk solo en /onkimia-doctors: ✓
- Resto del sitio sin cambios de fuente ni color: ✓

## Notas / Deuda técnica
- `doctors-ink` (#0a0e12) es aproximación de CMYK 75/68/67/90 — confirmar hex oficial con el cliente
- El logo independiente y el Header de Onkimia Doctors son la Tanda 38 (pendiente)
- BookingButton no modificado (sigue naranja accent-500 en toda la página)
