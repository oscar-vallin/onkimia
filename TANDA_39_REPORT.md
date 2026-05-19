# Tanda 39 — Header independiente para Onkimia Doctors
Fecha: 2026-05-19

## Resumen
- Detección de ruta /onkimia-doctors: ✓
- Header bg-doctors-ink siempre en /onkimia-doctors: ✓
- Logo OD desktop/tablet (logo-OD.svg): ✓
- Símbolo OD móvil (simbolo-OD.svg): ✓
- Logo del menú móvil cambia a símbolo OD: ✓
- Otras rutas SIN CAMBIOS: ✓

## Archivos modificados
- `src/components/layout/Header.tsx`

## Decisiones técnicas
- `isDoctorsRoute = pathname.startsWith('/onkimia-doctors')` — usePathname() de '@/i18n/navigation' devuelve path sin prefijo de locale; funciona en ES y EN.
- Fondo del `<header>`: condicional ternario anidado — mobileOpen → transparente; isDoctorsRoute → bg-doctors-ink; scrolled → bg-brand-900/80; default → transparente. La lógica de otras rutas se conserva exacta.
- `bg-doctors-ink` estaba ya safelisteada en globals.css desde Tanda 37 — no fue necesario agregar nada.
- Logo OD desktop/tablet: `logo-OD.svg`, visible en md+ (`hidden md:block`), 150px tablet → 180px desktop. Sin `filter invert(1)`.
- Símbolo OD móvil: `simbolo-OD.svg`, visible en <md (`block md:hidden`), 48×48px.
- Logo menú móvil en Doctors: símbolo OD 64×64px.
- Logo Onkimia normal: rama `else` conservada exacta en ambos puntos del componente.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: ✓ (todas las páginas)
- Validado visualmente: pendiente del usuario

## Notas / Decisiones pendientes
- BookingButton se mantiene NARANJA — decisión consciente del usuario
- El Header negro cubre la parte superior del hero de /onkimia-doctors — efecto esperado, NO es bug
- El logo OD no usa `filter invert(1)` — los SVG ya son blancos
