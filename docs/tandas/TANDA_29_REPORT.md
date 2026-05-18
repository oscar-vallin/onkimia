# Tanda 29 — Fix cambio de idioma en WelcomeModal

Fecha: 2026-05-17

## Resumen

- Import cambiado a @/i18n/navigation: ✓
- handleConfirm simplificado con router.replace + locale: ✓

## Causa del bug

`useRouter` y `usePathname` se importaban de `next/navigation` (el router nativo de Next.js). El router nativo no conoce el sistema de locales de next-intl y `usePathname` devuelve la ruta con el prefijo de locale incluido (`/en/contacto`), lo que hacía que la manipulación manual de strings para construir la ruta fuera frágil e incorrecta. La llamada a `router.push(newPath)` no activaba el cambio de locale en next-intl.

La solución correcta: usar el router de `@/i18n/navigation` (creado con `createNavigation(routing)`) que envuelve al nativo con lógica de locale. `usePathname` de next-intl devuelve la ruta sin prefijo, y `router.replace(pathname, { locale })` hace el cambio de idioma correctamente — exactamente como lo hace el Header.

## Verificación de compatibilidad

- `router.replace(pathname, { locale })`: ✓ — misma firma que usa el Header; confirmada en `src/i18n/navigation.ts`
- `router.refresh()` disponible en router de next-intl: ✓ — `createNavigation` envuelve el router de Next.js y expone `refresh`
- Navegación dentro del callback diferido de `close()` (200ms): ✓ — el router está disponible después del unmount de la animación; no hubo problemas

## Validación

- `pnpm tsc --noEmit`: ✓
- `pnpm build`: ✓

## Notas

- Solo se modificó `src/components/ui/WelcomeModal.tsx`
- La manipulación manual de strings de rutas (`pathname.replace(/^\/en/, '')`) fue eliminada completamente — era el corazón del bug
- Diseño, animación y lógica de clínica: sin cambios
