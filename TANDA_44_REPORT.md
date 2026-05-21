# Tanda 44 — Fix LCP: recursión CSS y preload selectivo
Fecha: 2026-05-21

## Resumen
- FIX 1.1 — Renombrar variable de googleSansFlex en layout.tsx: ✓
- FIX 1.2 — Actualizar referencia en globals.css línea 120: ✓
- FIX 1.3 — --font-serif línea 121 NO tocado (deuda pendiente): ✓ confirmado
- FIX 2.1 — preload: false en hostGrotesk y googleSansFlex: ✓
- FIX 2.2 — Estado de --font-body: SANO (no tenía bug)

## Archivos modificados
- `src/app/[locale]/layout.tsx` — variable renombrada a `--next-font-google-sans-flex`; `preload: false` en hostGrotesk y googleSansFlex
- `src/app/[locale]/globals.css` — línea 120: `--font-display: var(--next-font-google-sans-flex), system-ui, sans-serif;`

## Decisiones técnicas

**--font-body:** NO tenía el bug de recursión. globals.css define `--font-sans: var(--font-body)` — la variable del @theme es `--font-sans`, y next/font inyecta `--font-body`. Son variables distintas, no hay auto-referencia. No se tocó.

**--font-mono:** SÍ tiene el mismo bug (`--font-mono: var(--font-mono)` en @theme, mientras next/font inyecta `--font-mono`). Sin embargo, Source Code Pro solo se usa en el tagline/mono, que no es above-the-fold. No impacta LCP. Documentado como deuda, NO resuelto en esta tanda (fuera de alcance explícito).

**Preload masivo eliminado:** `preload: false` en los dos localFont (googleSansFlex × 8 archivos, hostGrotesk × 4 archivos = 12 preloads eliminados). Montserrat y Source Code Pro vienen de next/font/google — Next gestiona su preload automáticamente con subset latin, lo que es eficiente y no se tocó.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Network panel — # de .woff2 con Priority:High en dev: pendiente verificación visual (esperado: solo los de Montserrat latin del subset)
- Google Sans Flex se aplica en H2 de /nosotros: pendiente verificación visual en browser

## Deuda no resuelta (documentada)

- **--font-serif** (globals.css línea 121): `var(--font-display)` — referencia correcta hacia --font-display ya corregido, pero el nombre de la propiedad `--font-serif` en el @theme de Tailwind puede causar que Tailwind lo intente sobreescribir. Síntoma: subtitle del hero, comillas de /cuidare y títulos del Footer renderizan en fuente serif del sistema. Pospuesto por decisión explícita del usuario.
- **--font-mono**: misma recursión circular descrita arriba. Pospuesto.
- **Licencia Google Sans Flex**: fuente de uso interno de Google, no licenciada para terceros. Comunicar al cliente por escrito antes del go-live en onkimia.com.

## Notas
- Host Grotesk se mantiene declarada con `preload: false`. Disponible para uso futuro sin costo de preload.
- Source Code Pro no se tocó.
- Ningún componente, imagen ni ruta fuera de los 2 archivos fue modificado.
