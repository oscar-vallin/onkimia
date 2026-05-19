# Tanda 41 — Footer y menú móvil independientes para Onkimia Doctors
Fecha: 2026-05-19

## Decisión del cliente
Footer y menú móvil de /onkimia-doctors con identidad visual propia.

## Resumen
- Footer condicional por ruta: ✓
- Camino elegido: A — Footer Client Component
- Menú móvil oscuro en Doctors: ✓
- Botón WhatsApp móvil azul en Doctors: ✓
- Otras rutas SIN cambios: ✓

## Archivos modificados
- `src/components/layout/Footer.tsx` — convertido a Client Component; fondo y logo condicionales
- `src/components/layout/Header.tsx` — m.nav background y botón WhatsApp condicionales

## Decisiones técnicas

### Camino A — Footer Client Component
- `'use client'` al inicio del archivo
- `getTranslations` (server) → `useTranslations` (client, hook de next-intl)
- `async function Footer` → `function Footer` (sin async)
- `usePathname` de '@/i18n/navigation' para detectar `/onkimia-doctors`
- layout.tsx **no requirió cambios** — Footer mantiene la misma firma de props
- urlFor() sigue funcionando (llamada pura, no requiere Server Component)

### Cambios de Footer por ruta
| Elemento | /onkimia-doctors | otras rutas |
|---|---|---|
| Fondo `<footer>` | `bg-doctors-ink` | `bg-brand-900` |
| Logo | `/logo-OD.svg` sin filter | Sanity con `invert brightness-0` |

### Cambios de Header menú móvil
| Elemento | /onkimia-doctors | otras rutas |
|---|---|---|
| Fondo `m.nav` | `bg-doctors-ink` (sólido) | `bg-brand-900/40 backdrop-blur-2xl` |
| Botón WhatsApp | `bg-doctors-blue hover:bg-doctors-ink` | `bg-accent-500 hover:bg-accent-600` |

### Safelist verificada
- `bg-doctors-ink` → presente desde Tanda 37 ✓
- `bg-doctors-blue` → presente desde Tanda 37 ✓
- `hover:bg-doctors-ink` → presente desde Tanda 40 ✓

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Validado visualmente: pendiente del usuario

## Notas
- El color #1f1f1f pedido por el cliente se mapeó a `doctors-ink` (#0a0e12) — visualmente idéntico, mantiene consistencia con el resto de la identidad Doctors
- El Footer Client no introduce lógica compleja — el impacto de hidratación es mínimo
- Todo el contenido del Footer (grid, links, badges, contacto, sedes) se conservó exacto
