# Tanda 45 — Fix Turnstile reset + mensajes específicos en ContactForm
Fecha: 2026-05-21

## Resumen
- FIX 1.1 — turnstileWidgetId ref creado: ✓
- FIX 1.2 — widgetId guardado en ref + cleanup con remove: ✓
- FIX 1.3 — turnstile.reset() tras cada envío (éxito o fallo): ✓
- FIX 2.1 — errorMessage prop pasado al ResultModal: ✓
- FIX 2.2 — ResultModal lee state.message y mapea a contact.errors.*: ✓

## Archivos modificados
- `src/components/forms/ContactForm.tsx` — todos los fixes
- `src/types/turnstile.d.ts` — añadido `remove: (widgetId: string) => void` a la declaración del tipo Window.turnstile

## Decisiones técnicas

**remove() en el tipo de Turnstile:** La definición en `turnstile.d.ts` no incluía `remove`. Se añadió la firma. La API de Cloudflare Turnstile sí la expone en runtime — el tipo estaba incompleto.

**Mapeo de keys en ResultModal:** El backend retorna `"error.turnstile"`, `"error.rateLimit"`, etc. con prefijo `"error."`. Se hace un `slice('error.'.length)` antes de buscar en la lista blanca `['turnstile', 'rateLimit', 'email', 'unexpected']`. Si la key no está en la lista (ej. `"validation.failed"`, que ya muestra errores inline), cae al genérico `t('error.description')`.

**TypeScript estricto:** Se usó un `as const` array + type alias `KnownErrorKey` para tipar correctamente el argumento de `tErrors()` sin recurrir a `as any`. Pasó `tsc --noEmit` limpio.

## Validación
- pnpm tsc --noEmit: ✓
- pnpm build: pendiente (ejecutar antes de deploy)
- Test 1 (dos envíos seguidos sin error Turnstile): pendiente verificación manual
- Test 2 (mensaje específico al fallar Turnstile): pendiente verificación manual
- Test 3 (mensaje de rate limit con limit forzado a 1): pendiente verificación manual

## Recomendación pendiente

**Ajuste de copy de rateLimit (FIX 3 opcional — pendiente de aprobación):**
- ES actual: "Has enviado demasiados mensajes. Intenta de nuevo en una hora."
- EN actual: "You've sent too many messages. Please try again in an hour."
- Sugerencia: cambiar "en una hora" / "in an hour" → "más tarde" / "later"
- Motivo: el rate limit es sliding window de 5/hora, no fixed; el tiempo real de espera puede ser menor a una hora.

## Notas
- `submitContactForm` (Server Action) no se tocó.
- Rate limit 5/hora se mantiene.
- `JobApplicationForm.tsx` no se tocó.
- Las traducciones `contact.errors.*` ya existían en ambos idiomas; solo se cableo el frontend para leerlas.
