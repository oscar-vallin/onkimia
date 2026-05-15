cat > README.md << 'EOF'
# Onkimia Platform

Sitio web institucional de Onkimia — Centro oncológico integral con sedes en Guadalajara y Colima.

## Stack

- **Framework:** [Next.js 16](https://nextjs.org/) con App Router + React 19
- **Lenguaje:** TypeScript strict
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS:** [Sanity](https://www.sanity.io/) embebido en `/studio`
- **i18n:** [next-intl](https://next-intl-docs.vercel.app/) — Español/Inglés
- **Forms:** Server Actions + Zod + Resend + Cloudflare Turnstile + Upstash rate limit
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Package manager:** pnpm

## Desarrollo local

### Requisitos

- Node.js 20.9+
- pnpm 11+

### Setup

```bash
# 1. Clonar repo
git clone https://github.com/[tu-usuario]/onkimia-platform.git
cd onkimia-platform

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con los valores reales

# 4. Levantar dev server
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Sanity Studio

Disponible en [http://localhost:3000/studio](http://localhost:3000/studio).

## Scripts

```bash
pnpm dev          # Dev server con Turbopack
pnpm build        # Build de producción
pnpm start        # Servir build de producción
pnpm tsc --noEmit # Verificación TypeScript
```

## Estructura