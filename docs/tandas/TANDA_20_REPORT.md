# Tanda 20 — JobApplicationForm validación inline

Fecha: 2026-05-15

## Resumen

- Validación inline onBlur en campos texto/email/tel/textarea/date: ✓
- Validación onChange en selects y checkbox: ✓
- Asterisco rojo en labels requeridos: ✓
- AlertCircle icon en mensajes de error: ✓
- Auto-scroll + focus al primer error al submit: ✓
- File input mantuvo lógica existente + borde rojo cuando hay error: ✓
- Nota de campos requeridos al inicio: ✓

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/forms/JobApplicationForm.tsx` | Validación inline completa: `inlineErrors` state, `validateField()`, `formRef`, pre-submit validation, `onBlur`/`onChange` en todos los campos, `fieldClass()` helper, `errorMsg()` helper |

## Decisiones técnicas

### Estrategia de validación por campo
`jobApplicationFormSchema.pick({[name]: true})` genera error de TypeScript en modo estricto porque el tipo dinámico de `Record<string, true>` es incompatible con el inferido por Zod. Solución: se usa `safeParse` con el schema completo pasando solo el campo en cuestión (`{ [name]: value }`) y se filtra el `ZodError.issues` por `path[0] === name`. Si el issue está presente → error; si no → campo válido.

### File input (CV)
Se mantiene toda la lógica existente (`handleFileChange`, tipo PDF, tamaño <5MB). El error ahora va al estado compartido `inlineErrors.cv` en lugar del estado separado `cvError`. El drop-zone muestra borde rojo cuando hay error en `cv`. El pre-submit también llama `validateCvFile(cvFile)` (función del schema) para validar el archivo antes de enviar.

### Eliminaciones
- Estado `cvError` (separado) eliminado e integrado en `inlineErrors`
- `getFieldError()` ahora lee primero `inlineErrors[field]` y luego `state?.errors` (mismo patrón que ContactForm)

### Consistencia con ContactForm (Tanda 19)
- Mismo helper `fieldClass(name)` para clases de borde rojo/normal
- Mismo helper `errorMsg(name, id)` para el párrafo de error con `AlertCircle`
- Mismo patrón de pre-submit + auto-scroll + focus

## Validación final

- `pnpm tsc --noEmit`: ✓ (0 errores)
- `pnpm build`: ✓ (build completa)

## Notas

- El campo `vacancyId` siempre tiene valor (empieza en `'spontaneous'`), por lo que su validación onChange es preventiva
- `customJobDescription` es opcional (sin asterisco, sin validación inline)
- El `city` y `area` se auto-rellenan al seleccionar una vacante específica (lógica useEffect intacta)
- Turnstile no modificado
