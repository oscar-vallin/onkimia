# Tanda 32 — Sección App Onkimia en footer
Fecha: 2026-05-18

## Resumen
- Sección "Descarga la App" agregada al footer: ✓
- Badges Google Play + App Store enlazados: ✓
- Traducción downloadApp es/en: ✓

## Archivos modificados
- `src/components/layout/Footer.tsx` — sección App Onkimia insertada
- `src/messages/es.json` — `footer.downloadApp: "Descarga nuestra app"`
- `src/messages/en.json` — `footer.downloadApp: "Download our app"`

## Decisiones
- **Ubicación:** columna "Síguenos + Contacto", entre los íconos sociales y el bloque de Contacto. Agrupa todas las formas de conectar con Onkimia en la misma columna.
- **Badges:** apilados verticalmente (`flex-col gap-3`) — la columna del footer es estrecha y no da para fila horizontal sin que los badges se corten.
- **Altura badges:** `h-10` (40px) en lugar de `h-12` — más proporcional al resto del footer; los badges no dominan la columna.
- **Links hardcodeados** — no van a Sanity, son URLs estables de tienda.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (28/28 páginas)
- Diff JSON keys es/en: ✓ (sin diferencias)

## Pendiente para el usuario
Colocar los archivos de badge en:
- `public/badges/google-play.png`
- `public/badges/app-store.png`

El usuario ya tiene estos PNG — solo debe ubicarlos en esa carpeta. Si los archivos aún no están, el footer no crashea — next/image muestra imagen rota en runtime pero la página funciona con normalidad.
