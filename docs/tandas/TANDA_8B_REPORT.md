# Tanda 8B — Activación de integraciones en /contacto
Fecha: 2026-05-14

## Resumen
- Paquetes (resend + upstash): [✓] — ya estaban instalados desde package.json inicial
- Env validation (`src/lib/env.ts`): [✓]
- Upstash rate limiter (`src/lib/ratelimit.ts`): [✓]
- Turnstile verifier (`src/lib/turnstile.ts`): [✓]
- Email template (`src/lib/email/contact-template.tsx`): [✓]
- Resend client (`src/lib/email/resend.ts`): [✓]
- Server Action actualizada (`src/lib/actions/contact.ts`): [✓]
- Widget Turnstile en ContactForm: [✓]
- Traducciones de errores nuevos: [✓]

## Archivos creados
1. `src/lib/env.ts`
2. `src/lib/ratelimit.ts`
3. `src/lib/turnstile.ts`
4. `src/lib/email/contact-template.tsx`
5. `src/lib/email/resend.ts`

## Archivos modificados
1. `src/lib/actions/contact.ts` — mock reemplazado por flujo real (rate limit → Turnstile → Resend)
2. `src/components/forms/ContactForm.tsx` — widget Turnstile + Script lazyOnload + useEffect render
3. `src/messages/es.json` — claves `error.rateLimit`, `error.turnstile`, `error.email`
4. `src/messages/en.json` — equivalentes EN

## Flujo de envío completo

```
FormData → Zod validation → honeypot check
  → Upstash rate limit (5 req/IP/hora)
  → Cloudflare Turnstile verify (siteverify endpoint)
  → Resend email (HTML template, reply-to = email del usuario)
  → { ok: true }
```

Cada paso tiene su propio código de error i18n:
| Fallo | Mensaje devuelto | Clave traducida |
|---|---|---|
| Zod inválido | `validation.failed` + errors por campo | `contact.errors.*` |
| Rate limit | `error.rateLimit` | "demasiados mensajes..." |
| Turnstile | `error.turnstile` | "no pudimos verificar..." |
| Resend falla | `error.email` | "no pudimos enviar..." |
| Excepción inesperada | `error.unexpected` | "error inesperado..." |

## Decisiones técnicas

### env.ts — carga al startup
`envSchema.parse(...)` se ejecuta cuando el módulo es importado por primera vez. En Next.js esto ocurre en el primer request tras el arranque, no en build time. Si una variable falta, la acción falla antes de procesar datos del usuario con un `ZodError` claro en consola.

### Turnstile widget con useEffect
El script se carga con `strategy="lazyOnload"` para no bloquear LCP. El `onLoad` activa `turnstileReady`, y el `useEffect` renderiza el widget solo cuando el script está disponible. En `Managed mode` (por defecto), Cloudflare resuelve el challenge automáticamente en la mayoría de usuarios legítimos; el input `cf-turnstile-response` se inserta automáticamente en el form por el widget.

### replyTo en Resend
El email llega de `Onkimia Contacto <RESEND_FROM_EMAIL>` pero tiene `replyTo` con el email del usuario, lo que permite responder directamente desde el cliente de correo.

### Upstash slidingWindow
Se usa `slidingWindow(5, '1 h')` — 5 envíos por IP por hora con ventana deslizante (más justo que fixed window). El prefijo `ratelimit:contact` evita colisiones con futuros rate limiters para otras acciones.

### XSS prevention en email template
Todos los valores del usuario pasan por `escapeHtml()` antes de insertarse en el HTML del email. No se usa dangerouslySetInnerHTML ni interpolación sin escape.

## Validación final
- `pnpm tsc --noEmit`: ✓ exit 0
- `pnpm build`: ✓ exit 0
- Diff JSON keys es/en: ✓ sin diferencias

## Pruebas manuales recomendadas
- [ ] Widget Turnstile carga visualmente en /contacto (checkbox o cuadro azul)
- [ ] Submit válido → email llega a RESEND_TO_EMAIL con template formateado
- [ ] Email tiene reply-to con la dirección del usuario
- [ ] Submit 6 veces seguidas (misma IP) → 6° devuelve mensaje `rateLimit`
- [ ] Submit sin completar Turnstile (si se logra) → devuelve mensaje `turnstile`

## Lo que NO está activado todavía
- Odoo CRM → Tanda 8C (marcador `// TODO Tanda 8C` en Server Action)
- Página /aviso-de-privacidad → tanda futura
- Dominio personalizado Resend (`onkimia.com`) → cuando cliente configure DNS y valide dominio en Resend

## Notas para el cliente
- **Resend dominio**: actualmente el from usa `onboarding@resend.dev` (solo sirve para testing). Para producción, verificar el dominio `onkimia.com` en Resend y actualizar `RESEND_FROM_EMAIL` en las variables de entorno del servidor (Vercel/Railway).
- **Turnstile dominio**: la sitekey configurada debe coincidir con el dominio productivo. Si cambia de dominio, actualizar en Cloudflare Dashboard → Turnstile y generar nuevas keys.
- **Upstash**: el rate limit de 5/hora por IP es conservador. Ajustar en `src/lib/ratelimit.ts` si el volumen real de contactos lo requiere.

## Próximos pasos
- Tanda 8C: integración Odoo CRM (cuando cliente provea credenciales)
- O Tanda 9: /bolsa-de-trabajo (reutiliza misma infraestructura de Resend + Turnstile)
