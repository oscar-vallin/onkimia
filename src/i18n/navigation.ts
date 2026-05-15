import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Estos reemplazan a los imports de 'next/link' y 'next/navigation'
// en componentes que necesiten navegación localizada
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);