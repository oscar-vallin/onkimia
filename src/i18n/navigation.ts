import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// These replace imports from 'next/link' and 'next/navigation'
// in components that need locale-aware navigation
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);