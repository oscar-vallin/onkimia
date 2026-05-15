# Tanda 10 — Migración de Identidad Visual

Fecha: 2026-05-14

## Resumen

- Fuentes: Orbitron + Montserrat + Source Code Pro: ✓
- Paleta oficial (brand-900 #1E1739, accent-500 #F39313): ✓
- Paleta secundaria (purple, teal, sky): ✓
- DecorativeBubbles component: ✓
- Burbujas aplicadas en 4 heroes/secciones oscuras: ✓
- BRAND_GUIDELINES.md: ✓
- Email templates actualizados: ✓
- Header/Footer revisados: ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/components/ui/DecorativeBubbles.tsx` | Componente SVG decorativo con variantes: corner-top-right, corner-bottom-left, sides, scattered |
| `src/types/turnstile.d.ts` | (Tanda 9 fix) Declaraciones globales de Turnstile centralizadas |
| `BRAND_GUIDELINES.md` | Extracto del manual de identidad para referencia futura |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/[locale]/layout.tsx` | Inter+Rubik → Orbitron+Montserrat+Source_Code_Pro; variables CSS actualizadas |
| `src/app/[locale]/globals.css` | Paleta brand (morado oscuro), accent (naranja), + purple/teal/sky oficiales; tokens tipográficos actualizados |
| `src/components/ui/HeroSection.tsx` | Importa y renderiza `<DecorativeBubbles variant="sides" />` |
| `src/app/[locale]/bolsa-de-trabajo/page.tsx` | Hero inline: `relative overflow-hidden` + DecorativeBubbles |
| `src/app/[locale]/onkimia-doctors/page.tsx` | Sección oscura: `relative overflow-hidden` + DecorativeBubbles scattered; `#E76F51` → `#F39313` |
| `src/components/layout/Header.tsx` | `font-rubik` → `font-sans` en menú móvil |
| `src/lib/email/contact-template.tsx` | `#1A3A5A` → `#1E1739`; `#E76F51` → `#F39313` |
| `src/lib/email/job-application-template.tsx` | Ídem + `#fef3f0` → `#fef7ec` |

## Cobertura de DecorativeBubbles

| Componente/Página | Variante | Opacity |
|---|---|---|
| `HeroSection` (nosotros, endos, cuidare, contacto) | `sides` | 0.6 |
| `/bolsa-de-trabajo` (hero inline) | `sides` | 0.6 |
| `/onkimia-doctors` (sección mejoras) | `scattered` | 0.5 |

*Nota:* Las páginas endos y cuidare usan `HeroSection` con imagen fotográfica — las burbujas se superponen sobre el overlay de gradiente, no sobre un fondo sólido.

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (todas las rutas compiladas)
- `grep "1A3A5A" src/`: 0 resultados
- `grep "E76F51" src/`: 0 resultados
- `grep "font-rubik" src/`: 0 resultados
- `grep "font-inter" src/`: 0 resultados

## Notas para el cliente

- **Tipografía display web:** Orbitron sustituye legalmente a Good Times (misma familia geométrica, sin cargo adicional)
- **Para usar Good Times exacto:** requiere licencia web de Typodermic (~$100 USD) o Adobe Fonts — decisión pendiente
- **Paleta 100% aplicada** según manual de identidad Onkimia 2024
- **Burbujas decorativas** presentes en heroes principales y secciones oscuras

## Posibles ajustes futuros

- Aprobar visualmente con cliente las burbujas y tipografía
- Si aprueban Good Times, migración tipográfica es cambiar una sola variable CSS
- Evaluar degradados oficiales del manual en secciones destacadas (pendiente diseño)
