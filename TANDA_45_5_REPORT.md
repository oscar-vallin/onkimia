# Tanda 45.5 — Fix Turnstile reset + mensajes específicos en JobApplicationForm
Fecha: 2026-05-21

## Resumen
- FIX 1.1 — turnstileWidgetId ref creado: ✓
- FIX 1.2 — widgetId guardado en ref + cleanup con remove: ✓
- FIX 1.3 — turnstile.reset() tras cada envío (éxito o fallo): ✓
- FIX 2.1 — errorMessage prop pasado al JobResultModal: ✓
- FIX 2.2 — JobResultModal lee state.message y mapea a jobBoard.errors.*: ✓

## Archivos modificados
- `src/components/forms/JobApplicationForm.tsx` — todos los fixes

## Decisiones técnicas

**Tipo de turnstile.remove:** La firma ya estaba disponible desde Tanda 45 (añadida en `src/types/turnstile.d.ts`). No se requirió ajuste adicional.

**Mapeo de keys:** Mismo patrón que Tanda 45. El backend retorna `"error.turnstile"` etc. con prefijo `"error."`. Se hace `slice('error.'.length)` y se busca en lista blanca `['turnstile', 'rateLimit', 'email', 'unexpected']`. Fallback a `t('error.description')` para `"validation.failed"` y keys desconocidas.

**TypeScript estricto:** `as const` array + type alias `KnownJobErrorKey` para tipar el argumento de `tErrors()`. Pasó `tsc --noEmit` limpio.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: pendiente (ejecutar antes de deploy)
- Test 1 (dos envíos seguidos sin error Turnstile): pendiente verificación manual
- Test 2 (mensaje específico al fallar Turnstile): pendiente verificación manual
- Test 3 (mensaje de rate limit con limit forzado a 1): pendiente verificación manual

## Recomendación pendiente

**Ajuste de copy de rateLimit (FIX 3 opcional — pendiente de aprobación):**
- ES actual: "Has enviado demasiadas aplicaciones. Intenta mañana."
- EN actual: "You've sent too many applications. Please try again tomorrow."
- Sugerencia: "Intenta de nuevo en unas horas." / "Please try again in a few hours."
- Motivo: rate limit es slidingWindow(3, '1 d') — puede liberarse antes de mañana cuando la aplicación más antigua del candidato cumpla 24h.

## Notas
- `submitJobApplication` (Server Action) no se tocó.
- Rate limit 3/día se mantiene.
- `ContactForm.tsx` no se tocó (tanda 45 cerrada).
- Los mensajes de `jobBoard.errors.*` ya existían en ambos idiomas; solo se cableó el frontend para leerlos.
