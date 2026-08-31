# Configuración de Resend — Onkimia Platform

Guía para el equipo de IT de Onkimia. Al terminar, el sitio podrá enviar los dos
correos que produce:

| Correo | Cuándo se envía | A dónde llega |
|---|---|---|
| **Postulación de candidato** | Alguien envía el formulario de bolsa de trabajo (con CV en PDF adjunto) | `JOB_BOARD_EMAIL` |
| **Respaldo de prospecto** | Odoo rechaza un lead del formulario de contacto | `CONTACT_FALLBACK_EMAIL` |

> El formulario de **contacto** va directo a Odoo y normalmente no usa correo.
> El segundo correo es una red de seguridad: si el CRM está caído, el prospecto
> llega por correo en vez de perderse.

**Tiempo estimado:** 30 minutos, más la propagación de DNS (de minutos a 48 h).

---

## Antes de empezar

Se necesita:

- Acceso a la administración de **DNS del dominio `onkimia.com`** (donde estén los registros: el registrador, Cloudflare, o quien administre la zona).
- Un **correo de rol** para la cuenta, por ejemplo `it@onkimia.com`. **No usar el correo personal de nadie**: si esa persona sale de la empresa, se pierde el acceso al envío de correo del sitio.
- Acceso al servidor donde corre la aplicación, para editar sus variables de entorno.

---

## Paso 1 — Crear la cuenta

1. Entrar a **https://resend.com** y crear la cuenta con el correo de rol.
2. Confirmar el correo de verificación.

**El plan gratuito incluye 3,000 correos al mes** (con un tope diario). Para
dimensionar: son 3,000 postulaciones mensuales. Muy por encima de lo que recibe
una bolsa de trabajo de una clínica, así que no se prevé costo. Los límites
vigentes están en https://resend.com/pricing — conviene confirmarlos al momento
de contratar, porque cambian.

---

## Paso 2 — Verificar el dominio `onkimia.com`

Este es el paso importante. **Sin él, Resend solo entrega correos a la dirección
dueña de la cuenta** — el formulario parecerá funcionar en pruebas y fallará
para todos los demás.

1. En el panel de Resend: **Domains → Add Domain**.
2. Escribir `onkimia.com`.
3. Resend muestra una lista de registros DNS (normalmente 3: uno `MX` y dos
   `TXT`, para DKIM y SPF).
4. **Copiar cada registro tal cual** a la administración de DNS de `onkimia.com`.
   No modificar valores ni agregar espacios; un carácter de más invalida la firma.
5. Volver a Resend y pulsar **Verify**.

La propagación suele tardar minutos, pero puede llegar a 48 horas. El dominio
debe quedar en estado **Verified** (verde) antes de continuar.

> **Cuidado con el registro SPF.** Si `onkimia.com` ya envía correo por otro
> servicio (Google Workspace, Microsoft 365, el propio Odoo), **ya existe un
> registro SPF**. No se debe crear un segundo: hay que *combinarlos* en uno solo
> agregando el fragmento `include:` de Resend al que ya está. Dos registros SPF
> en la misma zona hacen que fallen ambos.

---

## Paso 3 — Crear la API Key

1. **API Keys → Create API Key**.
2. Nombre: algo identificable, p. ej. `onkimia-web-produccion`.
3. Permiso: **Sending access** únicamente. No hace falta acceso completo.
4. Dominio: restringir a `onkimia.com`.
5. **Copiar la clave en ese momento** — Resend no la vuelve a mostrar.
   Guardarla en el gestor de contraseñas de la empresa.

---

## Paso 4 — Configurar las variables de entorno

En el servidor donde corre la aplicación (archivo `.env.local` o las variables
de entorno del servicio), configurar:

```bash
# Clave del Paso 3
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Remitente. El dominio DEBE ser el verificado en el Paso 2.
# El buzón (noreply@) no necesita existir como cuenta real.
RESEND_FROM_EMAIL="Onkimia Bolsa de Trabajo <noreply@onkimia.com>"

# Destino de las postulaciones de candidatos → buzón de Recursos Humanos
JOB_BOARD_EMAIL=rh@onkimia.com

# Destino del respaldo de prospectos → buzón del equipo comercial
# Opcional: si se deja vacía, el respaldo llega a JOB_BOARD_EMAIL.
CONTACT_FALLBACK_EMAIL=contacto@onkimia.com
```

Reiniciar la aplicación para que tome los cambios.

### Qué significa cada variable

| Variable | Es | Nota |
|---|---|---|
| `RESEND_API_KEY` | La credencial | Secreta. Nunca en el repositorio ni en un correo. |
| `RESEND_FROM_EMAIL` | **De dónde sale** el correo | El dominio debe estar verificado |
| `JOB_BOARD_EMAIL` | **A dónde llega** la postulación | Buzón de RH |
| `CONTACT_FALLBACK_EMAIL` | **A dónde llega** el prospecto si Odoo falla | Buzón comercial |

`RESEND_FROM_EMAIL` y las dos direcciones de destino son cosas distintas y no
deben apuntar al mismo lugar sin querer.

---

## Paso 5 — Probar

Desde el proyecto, con las variables ya configuradas:

```bash
# Valida todo sin enviar nada
pnpm test:jobs --dry

# Envía un correo real de prueba a JOB_BOARD_EMAIL
pnpm test:jobs
```

La prueba real manda un correo con asunto
`Aplicación: Prueba automatizada QA-… — QA Bot Onkimia` y un PDF adjunto.
**Hay que confirmarlo abriendo la bandeja de `JOB_BOARD_EMAIL`**: que Resend
acepte el envío no garantiza la entrega.

Si no llega:

| Síntoma | Causa probable |
|---|---|
| El script falla con error de Resend | La API key es incorrecta o fue revocada |
| El script pasa pero no llega el correo | El dominio no está verificado, o el correo cayó en spam |
| Solo llega a una dirección y no a otras | Sigue configurado el remitente de pruebas `onboarding@resend.dev` |

El panel de Resend tiene **Logs**, con el estado de cada envío (entregado,
rebotado, marcado como spam). Es el primer lugar donde mirar.

---

## Paso 6 — Vigilar que siga funcionando

La aplicación expone `https://onkimia.com/api/health`, que responde:

- **200** — todo operativo
- **503** — alguna integración caída, y el cuerpo indica cuál

Conviene configurar un monitor de uptime (UptimeRobot y Better Stack tienen plan
gratuito, o un `curl` en cron desde el propio servidor) que lo consulte cada 5
minutos y avise por correo cuando responda 503.

Esto cubre tanto la configuración de correo como la conexión con Odoo. Sin ello,
una credencial vencida no produce ningún síntoma visible: el sitio sigue en pie
y los prospectos se pierden de uno en uno sin que nadie lo note.

---

## Mantenimiento

- **La API key no caduca**, pero conviene rotarla si alguien con acceso deja la empresa: crear una nueva, actualizar `RESEND_API_KEY`, reiniciar, y borrar la anterior.
- **No borrar los registros DNS** de Resend al hacer limpieza de la zona: el envío deja de funcionar de inmediato.
- **Revisar el consumo** en el panel si la bolsa de trabajo llegara a recibir mucho volumen, para no topar el límite mensual.
