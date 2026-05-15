cat > docs/README.md << 'EOF'
# Onkimia Platform — Documentation

Este directorio contiene la documentación interna del proyecto.

## Estructura

- **`tandas/`** — Reportes de cada iteración de desarrollo (Tandas 1-15)
- **`audits/`** — Auditorías técnicas
- **`BRAND_GUIDELINES.md`** — Lineamientos de identidad visual oficial

## Sobre las Tandas

El desarrollo se organizó en "tandas" — iteraciones acotadas con alcance definido. Cada tanda tiene su reporte documentando:

- Archivos creados/modificados
- Decisiones técnicas tomadas
- Validaciones realizadas
- TODOs para el cliente

Estos documentos son referencia histórica. Si necesitas entender por qué algo está implementado de cierta manera, busca aquí primero.

## Tandas completadas

| Tanda | Tema |
|---|---|
| 1 | Fixes críticos iniciales |
| 2 | Schemas CMS (servicios, aseguradoras) |
| 3 | i18n migration |
| 5 | Página /endos |
| 6 | Página /cuidare |
| 7 | Página /onkimia-doctors |
| 8A | Página /contacto foundation |
| 8B | Integraciones reales (Resend, Turnstile, Upstash) |
| 9 | Página /bolsa-de-trabajo |
| 10 | Migración de identidad visual oficial |
| 12 | Página /aviso-de-privacidad |
| 13 | SEO infrastructure |
| 15 | Páginas de sede /guadalajara + /colima |

## Tandas pendientes

| Tanda | Bloqueante |
|---|---|
| 4 | Contenido en Sanity (services + insurances) |
| 11 | Confirmación del cliente sobre identidad submarcas |
| 14 | Contenido oficial de /servicios |
| 8C | Credenciales Odoo |
| 16 | Deploy a producción con dominio custom |
EOF