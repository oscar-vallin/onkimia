# Tanda 8A — Página /contacto Foundation
Fecha: 2026-05-14

## Resumen
- Schema clinic (`geo` + `email`): [✓] — ya existían en el schema; **no se duplicaron** como `contactEmail`/`phones[]`
- Query `PRIMARY_CLINIC_QUERY`: [✓]
- Zod schema `contactFormSchema`: [✓]
- Server Action `submitContactForm`: [✓ — en modo MOCK]
- Componente `ContactForm`: [✓]
- Componente `GoogleMapsEmbed`: [✓]
- Traducciones `contact` es+en: [✓]
- Página `/contacto`: [✓]
- JSON-LD ContactPage: [✓]

## Archivos creados
1. `src/lib/schemas/contact.ts`
2. `src/lib/actions/contact.ts`
3. `src/components/forms/ContactForm.tsx`
4. `src/components/ui/GoogleMapsEmbed.tsx`
5. `src/app/[locale]/contacto/page.tsx`

## Archivos modificados
1. `src/sanity/queries.ts` — añadida `PRIMARY_CLINIC_QUERY`
2. `src/messages/es.json` — namespace `contact` completo
3. `src/messages/en.json` — namespace `contact` completo

## Decisiones de implementación

### Reutilización de campos existentes en `clinic`
El plan pedía agregar `geo` y `contactEmail` al schema. **`geo` ya existía** y **`email`** (no `contactEmail`) ya existía. No se duplicaron campos: la página, la query y el JSON-LD usan los nombres existentes:
- `clinic.email` (no `clinic.contactEmail`)
- `clinic.phone` singular (no `clinic.phones[]`)
- `clinic.address.postalCode` (no `clinic.address.zip`)
- `clinic.address.neighborhood` se incluye en `streetAddress` del JSON-LD

Esto evita romper consumidores existentes (`CLINICS_QUERY`, `CLINIC_BY_SLUG_QUERY`, `MedicalOrganizationJsonLd`, etc.) y respeta la consigna "Reutilizar tipo Clinic ya existente".

### Zod 4.x — `acceptPrivacy`
Se usó `z.boolean().refine((v) => v === true, { message: 'privacy.required' })` en lugar de `z.literal(true, { errorMap: ... })` para máxima compatibilidad con la versión instalada (`zod ^4.4.3`) y para que el mensaje siga siendo una clave i18n.

### Modal limpio
Se removió la prop `message` del `ResultModal` porque no se usa visualmente — el modal muestra `t('modal.success|error.title/description')` directamente y la prop quedaba muerta.

## Lo que NO está activado (esperado en 8A)
- Envío real de email (Resend) → Tanda 8B
- Rate limiting (Upstash) → Tanda 8B
- Cloudflare Turnstile → Tanda 8B
- Integración Odoo CRM → Tanda 8C

Marcadores `// TODO Tanda 8B/8C` documentados en `src/lib/actions/contact.ts`.

## Validación final
- `pnpm tsc --noEmit`: ✓ exit 0, sin errores
- `pnpm build`: ✓ exit 0, ruta `/[locale]/contacto` renderiza dinámicamente
- Diff JSON keys es/en: ✓ sin diferencias — estructura 100% paralela

## Notas para el cliente
- **Llenar `geo` (lat/lng)** en Sanity para la sede Guadalajara. Coordenadas sugeridas para Beethoven 287, GDL: `lat=20.7050`, `lng=-103.4093` (validar con dirección exacta). Sin `geo` el mapa no se renderiza.
- **Llenar `email`** en la sede principal (ej: `contacto@onkimia.com`). Sin `email` la tarjeta de email no aparece.
- **Llenar `phone`** en la sede principal en formato internacional `+52XXXXXXXXXX`.
- **Marcar `isPrimary = true`** en exactamente una sede (Guadalajara). Sin sede primaria la query devuelve `null` y la página muestra solo el hero+formulario sin info ni mapa.
- **Página `/aviso-de-privacidad` pendiente**: el link en el checkbox actualmente apunta a una ruta inexistente. Se creará en una tanda futura.
- **Traducciones EN**: generadas por Claude, no provistas por el cliente. Confirmar y aprobar antes de producción.
- **Anti-spam**: solo honeypot por ahora. Turnstile + rate limit se activan en Tanda 8B.

## Comportamiento del formulario (mock)
| Acción | Resultado |
|---|---|
| Submit con campos vacíos | Errores de Zod por campo, traducidos vía `contact.errors.*` |
| Email inválido | Error `email.invalid` |
| Sin checkbox privacidad | Error `privacy.required` |
| Honeypot lleno | Respuesta `{ ok: true }` silenciosa (no revelar al bot) |
| Submit válido | Log a consola del servidor + delay 800ms + modal de éxito + reset de form |

## Próximos pasos
- Tanda 8B: integraciones reales (Resend + Turnstile + Upstash)
- Tanda 8C: integración Odoo CRM
