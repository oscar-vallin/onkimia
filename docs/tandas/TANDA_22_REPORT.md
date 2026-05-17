# Tanda 22 — Refactor responsive heroes + menú móvil

Fecha: 2026-05-16

## Resumen

- HeroSection: bug mt-24 corregido + ajustes mobile: ✓
- Hero /endos: overlap + tipografía: ✓
- Hero /cuidare: overlap + tipografía: ✓
- Hero /onkimia-doctors: overlap + tipografía: ✓
- Menú móvil: compacto + scroll: ✓
- Título duplicado /servicios: ✓ (ver hallazgo abajo)

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/ui/HeroSection.tsx` | `mt-24` → `mt-4 md:mt-6`; `justify-start` → `justify-center`; `lg:pt-30` eliminado; h1 `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`; subtitle `text-lg md:text-2xl`; description `text-sm md:text-lg` |
| `src/app/[locale]/endos/page.tsx` | `h-[70vh] min-h-[500px]` → `min-h-[480px] md:min-h-[600px]`; `pt-16 md:pt-20` → `pt-24 md:pt-32`; h1 `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`; description `text-sm md:text-xl` |
| `src/app/[locale]/cuidare/page.tsx` | Mismos 4 cambios que /endos |
| `src/app/[locale]/onkimia-doctors/page.tsx` | Mismos 4 cambios que /endos |
| `src/components/layout/Header.tsx` | `overflow-y-auto` en contenedor móvil; `min-h-full` en inner div; links `text-lg py-2`; `space-y-0.5`; sección config `py-5 space-y-4` |
| `src/app/[locale]/servicios/page.tsx` | h2 duplicado → `{t('clinics.title')}`; eliminado import `useTranslations` no usado |

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓

## Hallazgo /servicios

El h2 de la primera sección de contenido tenía hardcodeado "Atención Oncológica Especializada" / "Specialized Oncology Care" — exactamente el mismo texto que el título del hero (`t('hero.title')`). No era un bug de doble render: era contenido redundante hardcodeado. Se reemplazó por `t('clinics.title')` que devuelve "Clínicas de Atención Oncológica" / "Oncology Care Clinics", que es una descripción más precisa de la sección que introduce.

## Notas

- Heroes hardcoded (/endos, /cuidare, /onkimia-doctors) siguen sin usar HeroSection compartido. Recomendación futura: migrar a componente común.
- `lg:pt-30` era una clase inválida de Tailwind (eliminada de HeroSection).
