# Tanda 21 — Pop-up de Bienvenida

Fecha: 2026-05-15

## Resumen

- Componente WelcomeModal: ✓
- Provider WelcomeModalProvider con dynamic import (ssr: false): ✓
- Lazy loading sin afectar LCP (delay 800ms): ✓
- Helpers hasVisited + markAsVisited + clearVisited: ✓
- Cookie onkimia_visited 1 año: ✓
- Excluido en /studio: ✓
- Animación CSS sin Framer Motion (translate + opacity + scale): ✓
- Focus en botón cerrar al abrir + Escape para cerrar + backdrop click: ✓
- Redirección idioma EN/ES: ✓
- Traducciones es+en (namespace welcomeModal): ✓

## Archivos creados

| Archivo | Descripción |
|---|---|
| `src/lib/cookies-client.ts` | Helpers client-side: `hasVisited()`, `markAsVisited()`, `clearVisited()` + constante `VISITED_COOKIE` |
| `src/components/ui/WelcomeModal.tsx` | Modal con selección de clínica e idioma, animación CSS, accesibilidad (role=dialog, aria-modal, aria-labelledby) |
| `src/components/providers/WelcomeModalProvider.tsx` | Provider con `dynamic()` import (ssr:false) + delay 800ms + check pathname /studio |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/[locale]/layout.tsx` | Import `WelcomeModalProvider` + `Locale`; `<WelcomeModalProvider locale={locale as Locale} />` dentro de `<ClinicProvider>` |
| `src/messages/es.json` | Namespace `welcomeModal` añadido |
| `src/messages/en.json` | Ídem en inglés |

## Decisiones técnicas

### Separación server/client en cookies
`src/lib/cookies.ts` usa `import { cookies } from 'next/headers'` (server-only). No se puede agregar funciones de cliente al mismo archivo o Next.js falla en build con error de boundary. Solución: `src/lib/cookies-client.ts` con `'use client'` directive para las helpers de `onkimia_visited`.

### setClinic desde contexto
La spec menciona `setClinicCookie()` que no existe. Se usa `useClinic().setClinic()` del `ClinicContext` existente — actualiza tanto el estado React como la cookie `onkimia_clinic` de forma consistente.

### Redirección idioma
Se usa `useRouter()` de `next/navigation` y construye la URL manualmente: si el locale actual es `en`, stripea el prefijo; si el elegido es `en`, lo añade. Luego `router.push(newPath)` para navegar.

### Dynamic import
`WelcomeModal` se importa con `dynamic(..., { ssr: false })` en el Provider. Esto garantiza que el chunk del modal no entra en el bundle inicial ni se ejecuta en SSR, preservando el LCP.

## Reset manual en dev

```js
// Consola del navegador
document.cookie = 'onkimia_visited=; path=/; max-age=0';
location.reload();
```

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (chunk separado para WelcomeModal por dynamic import)
- Diff JSON keys: ✓ (ninguna diferencia entre es.json y en.json)
