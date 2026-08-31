# Guía de infraestructura — para el equipo de IT de Onkimia

Esta guía explica cómo desplegar y operar el sitio en su propio servidor: variables de entorno, webhook de Sanity, rate limiting de los formularios, redirects 301 de la migración, y qué cambia si en el futuro corren más de una instancia.

Está pensada para quien administra el servidor, no para quien edita contenido — para eso ver `GUIA-SECCIONES.md`.

---

## 1. Qué es este proyecto y cómo se despliega

Es una app **Next.js 16** (App Router). El build genera HTML estático para casi todas las páginas (SSG) — no es un servidor que arme cada página en cada visita, así que el consumo de CPU es bajo incluso en un servidor modesto.

### 1.1 Build

```bash
pnpm install
pnpm build
```

El build necesita las variables de entorno de la sección 2 **presentes en ese momento** — varias (como `NEXT_PUBLIC_SITE_URL`) quedan horneadas dentro del HTML/JS generado. Si se construye con el valor equivocado (p. ej. la URL de staging) y se despliega ese build a producción, hay que reconstruir — no basta con cambiar la variable después.

### 1.2 Deploy (self-hosted, sin Vercel)

El proyecto tiene `output: 'standalone'` en `next.config.ts`, pensado exactamente para este caso: el build genera una carpeta con solo lo necesario para correr en producción, sin `node_modules` completo.

Después de `pnpm build`, copiar a donde vaya a correr el servidor:

```
.next/standalone/          → contiene server.js y las deps de producción
.next/standalone/.next/static/   ← copiar aquí el contenido de .next/static/
.next/standalone/public/         ← copiar aquí el contenido de public/
```

**Un archivo no viaja con `git clone`:** `public/heros/hls/hero.mp4` (~157 MB) está excluido del repo vía `.gitignore` — supera el límite de 100 MB por archivo de GitHub. Es el respaldo de video progresivo para navegadores sin HLS nativo ni Media Source Extensions (prácticamente ninguno hoy en día) — el video del hero funciona sin él para la enorme mayoría de visitantes, ya que el resto de los archivos de `public/heros/hls/` (los fragmentos `.m4s`, `init.mp4`, el manifest `.m3u8`) sí están en git y cada uno pesa unos pocos MB. Cópienlo manualmente al servidor la primera vez que desplieguen (está en el repositorio de quien hizo el build, o puede regenerarse con `scripts/build-hero-hls.sh` a partir del material original del cliente) y no hace falta tocarlo de nuevo salvo que el video del hero cambie.

Arrancar con:

```bash
node .next/standalone/server.js
```

Por defecto escucha en el puerto 3000 (configurable con la variable `PORT`). Usar un gestor de procesos (PM2, systemd, Docker) para mantenerlo vivo y reiniciarlo si cae.

### 1.3 Requisitos del servidor

- **Node.js 20+**.
- **Paquete `sharp` instalado** (ya está en `package.json`) — es el binario que optimiza imágenes en `/_next/image`. Sin él, next/image no funciona en self-hosted. Al hacer `pnpm install` en el servidor (o al copiar `node_modules` desde el build) debe quedar incluido; si el servidor tiene una arquitectura de CPU distinta a donde se hizo el build (por ejemplo build en Mac ARM, servidor Linux x64), hay que correr `pnpm install` **en el propio servidor** para que instale el binario correcto de `sharp`, no copiar el `node_modules` de otra máquina.
- **Reverse proxy delante de Node** (nginx, Apache, Caddy) que:
  - Termine TLS/HTTPS.
  - Reenvíe `X-Forwarded-For` con la IP real del visitante (ver sección 4 — sin esto el rate limiting de los formularios no funciona).
  - Redirija `www.onkimia.com` → `https://onkimia.com` (ver sección 5).

Ejemplo mínimo de bloque nginx (ajustar a su configuración real):

```nginx
server {
    listen 443 ssl;
    server_name onkimia.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    server_name www.onkimia.com;
    return 301 https://onkimia.com$request_uri;
}
```

---

## 2. Variables de entorno

Todas deben existir en el servidor donde se ejecuta `node server.js` (no solo en la máquina donde se hace el build, salvo las que dice "solo build").

| Variable | Para qué | Notas |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio (`https://onkimia.com`) | **Se hornea en build.** Usada en metadata, hreflang, sitemap, JSON-LD, robots.txt |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto Sanity | Solo build (público) |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset de Sanity (`production`) | Solo build (público) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Versión del API de Sanity | Opcional, default `2025-01-01` |
| `SANITY_API_READ_TOKEN` | Token de lectura de Sanity | Secreto — servidor únicamente |
| `SANITY_REVALIDATE_SECRET` | Firma del webhook de revalidación | Secreto — ver sección 3 |
| `ODOO_URL`, `ODOO_DATABASE`, `ODOO_USERNAME`, `ODOO_API_KEY` | Credenciales del CRM Odoo (formulario de contacto) | Secretos — servidor únicamente |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Envío de correo (bolsa de trabajo) | Secretos — ver `docs/resend-setup.md` |
| `JOB_BOARD_EMAIL` | Correo destino de postulaciones | — |
| `CONTACT_FALLBACK_EMAIL` | Correo destino del respaldo de prospectos cuando Odoo falla | Opcional — sin ella el respaldo llega a `JOB_BOARD_EMAIL`. Recomendado: buzón comercial, no el de RH |

**Nota:** Cloudflare Turnstile se evaluó y luego se eliminó por completo del proyecto (código, variables de entorno, dependencias) — no forma parte del alcance actual. La protección anti-spam de ambos formularios es honeypot + rate limiting por IP (ver sección 4). Si en el futuro se decide reactivar un CAPTCHA, es una integración nueva desde cero, no queda nada "listo para descomentar".

Guardar los secretos en un `.env.production` fuera del control de versiones, o en el gestor de secretos que use su infraestructura (Vault, variables de entorno del sistema, etc.). Nunca deben aparecer en el repositorio.

---

## 3. Webhook de revalidación de Sanity

### 3.1 Qué hace

El contenido editorial (textos de Sanity, no las traducciones que están en `src/messages/`) se sirve como páginas estáticas cacheadas. Cuando alguien edita algo en el Studio de Sanity, el sitio **no se entera automáticamente** — hace falta que Sanity le avise al servidor "esto cambió, vuelve a generar esa página". Ese aviso es el webhook.

### 3.2 Cómo configurarlo (una sola vez)

En el panel de Sanity (`sanity.io/manage` → proyecto → API → Webhooks):

1. **URL**: `https://onkimia.com/api/revalidate`
2. **Dataset**: production
3. **Trigger on**: Create, Update, Delete
4. **Secret**: el mismo valor que la variable `SANITY_REVALIDATE_SECRET` del servidor
5. **HTTP method**: POST

El endpoint (`src/app/api/revalidate/route.ts`) valida la firma del webhook contra ese secreto — si no coincide, rechaza la petición con 401. Esto evita que cualquiera en internet pueda forzar revalidaciones falsas.

**Además solo acepta tipos de documento conocidos.** El endpoint tiene una lista blanca (`REVALIDATABLE_TYPES` en ese mismo archivo) con los 13 tipos que la aplicación consulta. Un tipo fuera de esa lista se rechaza con 400 y queda registrado en el log.

> Si en el futuro se agrega un schema nuevo a Sanity, **hay que agregarlo también a esa lista**. De lo contrario su webhook se rechaza y la página seguirá sirviendo contenido viejo indefinidamente. Es el primer lugar a revisar si un tipo de contenido nuevo no se actualiza nunca.

> Si otro sitio comparte el mismo proyecto de Sanity, **cada uno debe tener su propio webhook y su propio `SANITY_REVALIDATE_SECRET`**. Compartir el secreto significa que comprometer un sitio permite disparar revalidaciones en el otro.

### 3.3 Qué revisar si el contenido no se actualiza

1. ¿El webhook está configurado con la URL correcta y responde 200? (revisar el log de entregas en el propio panel de Sanity — muestra cada intento y su respuesta).
2. ¿`SANITY_REVALIDATE_SECRET` es idéntico en Sanity y en el servidor?
3. ¿El servidor es alcanzable públicamente en esa URL? (si está detrás de un firewall que bloquea IPs externas, el webhook de Sanity no puede llegar).
4. **Ver sección 6 si corren más de una instancia** — ahí es donde este mecanismo deja de ser tan simple.

---

## 4. Rate limiting de los formularios

### 4.1 Qué existe hoy

Hay dos formularios: contacto (5 envíos por hora por IP) y bolsa de trabajo (3 por día por IP). El límite vive en `src/lib/ratelimit.ts` — es un contador en memoria del propio proceso Node, sin base de datos ni servicio externo. Para el volumen de este sitio (2 formularios, tráfico bajo-medio) es una solución apropiada y no requiere nada de su parte **siempre que corran una sola instancia**.

### 4.2 Requisito indispensable: reenviar la IP real

El código identifica al visitante leyendo, en este orden, los headers `cf-connecting-ip`, `x-forwarded-for` o `x-real-ip`. Si su reverse proxy no reenvía ninguno de estos con la IP real del visitante, **todos los visitantes comparten el mismo límite** (ven la IP del proxy) — el formulario se bloquearía para todo el sitio después de 5 envíos de cualquier persona.

Verificar que su nginx/Apache tenga configurado (ejemplo nginx, ya incluido en el bloque de la sección 1.3):

```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

Si están detrás de Cloudflare, el header `cf-connecting-ip` ya lo añade Cloudflare automáticamente — no requiere configuración adicional en nginx.

### 4.3 Qué NO hace falta

No hace falta Redis, base de datos, ni servicio de rate limiting externo para el escenario de una instancia. No lo agreguen "por si acaso" — es complejidad operativa sin beneficio mientras el sitio corra en un solo proceso.

---

## 5. Redirects 301 (migración desde el sitio anterior)

El dominio `onkimia.com` ya existe con contenido indexado en Google bajo una estructura distinta (`/es/*`, `/en/*` con slugs en inglés como `/en/about-us`). Para no perder ese posicionamiento, el sitio nuevo debe responder con un **301 (redirect permanente)** en las URLs viejas, apuntando a su equivalente nuevo.

### 5.1 División de responsabilidades

- **Su reverse proxy (nginx) maneja únicamente el host**: `www.onkimia.com` → `onkimia.com`. Esto ya existe en el sitio actual y solo hay que replicarlo (ver bloque nginx en 1.3).
- **La aplicación (Next.js) maneja únicamente los paths**: `/es/equipo` → `/nosotros`, `/en/about-us` → `/en/nosotros`, etc. Esto vive en el propio código (`next.config.ts`, función `redirects()`) y **no requiere ninguna acción de IT** — se despliega junto con el resto del sitio.

Mantener esta división es importante: si nginx también reescribe paths, se pueden generar cadenas de más de un salto (`www/es/x` → `apex/es/x` → `/x-nuevo`), lo cual Google penaliza más que un solo redirect limpio.

### 5.2 Qué debe verificar IT

- Que el DNS de `onkimia.com` apunte al nuevo servidor **el mismo día** que se despliega el build con las reglas de redirect ya incluidas — no antes (URLs viejas quedarían sin redirect) ni con demasiada diferencia después.
- Después del cambio, probar manualmente 3-4 URLs viejas conocidas (`onkimia.com/es/servicios`, `onkimia.com/en/contact`) y confirmar que responden 301 hacia la URL nueva, no 404.
- Mantener las reglas de redirect **indefinidamente** — no tienen costo de mantenimiento y Google puede tardar semanas en re-rastrear todas las URLs viejas.

### 5.3 Search Console

Dar de alta la propiedad `onkimia.com` (tipo "Dominio", cubre automáticamente http/https y www/apex) en Google Search Console y enviar el sitemap: `https://onkimia.com/sitemap.xml`. No es tarea de IT del servidor, pero suele quedar en la lista de pendientes de lanzamiento — mencionado aquí para que no se pierda.

---

## 6. Si en el futuro corren más de una instancia

**Hoy no aplica** — el sitio corre en un solo proceso Node y todo lo descrito arriba funciona sin cambios. Esta sección es para cuando (si acaso) decidan escalar por alta disponibilidad (tolerancia a caídas, deploys sin downtime), no por necesidad de capacidad — el tráfico esperado no lo justifica.

Si llega ese momento, dos mecanismos dejan de funcionar como están:

### 6.1 Webhook de Sanity / caché

Cada instancia tiene su propia caché en disco. Cuando Sanity llama al webhook, solo la instancia que recibe esa petición específica invalida su caché — las demás siguen sirviendo la versión vieja indefinidamente.

**Antes de escalar, elegir una de estas dos opciones** (avisar al equipo de desarrollo, requiere un cambio de código menor):

- **Cache handler compartido (Redis)** — todas las instancias leen/escriben la misma caché; el webhook invalida para todas a la vez. Es la solución correcta si ya operan Redis para algo más.
- **Revalidación por tiempo en vez de por webhook** — cambiar la configuración de fetch para que cada página se refresque automáticamente cada cierto tiempo (por ejemplo cada 5 minutos) en vez de esperar el webhook. Más simple de operar, a cambio de que un cambio en Sanity tarde hasta ese intervalo en reflejarse — aceptable para un sitio cuyo contenido no cambia varias veces al día.

### 6.2 Rate limiting de formularios

El contador en memoria de cada instancia es independiente — con 3 instancias detrás de un balanceador, el límite real pasa a ser "5 por hora por instancia que te toque", no 5 por hora global. Un visitante insistente que refresque puede terminar hablando con instancias distintas y saltarse el límite.

**Antes de escalar, elegir una:**

- **`limit_req` de nginx** sobre las rutas de los formularios — corta el abuso a nivel de proxy, antes de que llegue a cualquier instancia de Node. Es la opción que recomendamos: no toca el código de la app y es responsabilidad pura de infraestructura.
- Rate limiting compartido en Redis — más trabajo, solo se justifica si además necesitan reglas más finas que un simple límite por IP.

### 6.3 Qué NO cambia al escalar

Los redirects 301 (sección 5) son completamente stateless — no dependen de memoria ni caché de ningún proceso, así que funcionan idénticos sin importar cuántas instancias corran.

---

## 7. Monitoreo de las integraciones

Los dos formularios dependen de servicios externos que pueden dejar de funcionar **sin ningún síntoma visible**: el sitio sigue en pie, las páginas cargan, y lo único que pasa es que los prospectos se pierden de uno en uno. Por eso hay dos mecanismos.

### 7.1 Endpoint de salud

`https://onkimia.com/api/health` responde:

- **200** — Odoo responde y la configuración de correo está completa
- **503** — algo está caído; el cuerpo JSON indica cuál integración y por qué

```json
{
  "status": "degraded",
  "timestamp": "2026-08-31T10:00:00.000Z",
  "checks": {
    "odoo":  { "status": "error", "detail": "authentication failed" },
    "email": { "status": "ok" }
  }
}
```

No expone credenciales; es seguro dejarlo público.

**Recomendación:** configurar un monitor de uptime que lo consulte cada 5 minutos y avise por correo cuando responda 503. UptimeRobot y Better Stack tienen plan gratuito suficiente; también sirve un `curl` en cron desde el propio servidor.

### 7.2 Respaldo del formulario de contacto

Si Odoo rechaza un lead, el prospecto **no se descarta**: se envía por correo a `CONTACT_FALLBACK_EMAIL` con los datos completos y el error técnico de Odoo. Ese correo cumple dos funciones: el prospecto se puede capturar a mano, y alguien se entera de que el CRM dejó de recibir.

Si llega uno de esos correos, revisar el endpoint de salud y las credenciales de Odoo (sección 2).

### 7.3 Logs

El servidor escribe a stdout con prefijos consistentes, filtrables con las herramientas del sistema (`journalctl`, `pm2 logs`, o lo que use su infraestructura):

| Prefijo | Significa |
|---|---|
| `[Odoo]` | Fallo creando el lead del formulario de contacto |
| `[Contact] Prospecto PERDIDO` | **Crítico** — falló Odoo *y* el correo de respaldo |
| `[Resend]` | Fallo enviando correo |
| `[JobApp]` | Problema en la bolsa de trabajo |
| `[Revalidate]` | Webhook con un tipo desconocido |

---

## 8. Checklist de lanzamiento

- [ ] Build hecho con `NEXT_PUBLIC_SITE_URL=https://onkimia.com` (no la URL de staging/Vercel)
- [ ] Todas las variables de la sección 2 presentes en el servidor de producción
- [ ] `sharp` instalado correctamente para la arquitectura del servidor (instalar `node_modules` en el propio servidor si difiere del entorno de build)
- [ ] `public/heros/hls/hero.mp4` copiado manualmente al servidor — **no viaja con `git clone`** (ver sección 1.2)
- [ ] Reverse proxy configurado: TLS, `X-Forwarded-For`, redirect `www` → apex
- [ ] Webhook de Sanity configurado y probado (crear/editar un documento de prueba y confirmar que la página correspondiente se actualiza)
- [ ] DNS apuntando al nuevo servidor coordinado con el deploy (mismo día)
- [ ] Redirects de migración probados en producción (lista completa en `next.config.ts` → `redirects()`; verificar en especial `/es/medicos`, `/es/pacientes` y `/es/blog/*`, que usan destinos por defecto sin URL vieja exacta — confirmar con el cliente si prefiere otros)
- [ ] Propiedad de dominio dada de alta en Google Search Console + sitemap enviado
- [ ] **Credenciales de Odoo verificadas con `pnpm test:contact`** — deben crear el lead y borrarlo sin errores
- [ ] Dominio verificado en Resend y correo de prueba recibido (`pnpm test:jobs`, ver `docs/resend-setup.md`)
- [ ] `https://onkimia.com/api/health` responde 200
- [ ] Monitor de uptime apuntando a `/api/health` (sección 7.1)
