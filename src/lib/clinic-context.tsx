'use client';

/**
 * Context global para la clínica seleccionada por el usuario.
 *
 * Persiste en cookie `onkimia_clinic` durante 1 año.
 * Usado por:
 *  - WhatsApp button (routing al número correcto)
 *  - Header (mostrar sede actual)
 *  - Pre-relleno de formularios
 *
 * Cookie se lee/escribe vía middleware + este provider en cliente.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type ClinicSlug = 'guadalajara' | 'colima';

interface ClinicContextValue {
  clinic: ClinicSlug | null;
  setClinic: (slug: ClinicSlug) => void;
  isInitialized: boolean;
}

const ClinicContext = createContext<ClinicContextValue | undefined>(undefined);

const COOKIE_NAME = 'onkimia_clinic';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

export function ClinicProvider({
  children,
  initialClinic,
}: {
  children: ReactNode;
  initialClinic: ClinicSlug | null;
}) {
  // Lazy initializer: read document.cookie synchronously on the client so
  // the correct clinic is available on the very first render — no useEffect
  // delay, no "Select your clinic" flash on locale-switch remounts.
  const [clinic, setClinicState] = useState<ClinicSlug | null>(() => {
    if (typeof window === 'undefined') return initialClinic;
    const match = document.cookie.match(/(?:^|;\s*)onkimia_clinic=([^;]+)/);
    const cookieValue = match?.[1];
    if (cookieValue === 'guadalajara' || cookieValue === 'colima') return cookieValue;
    return initialClinic;
  });
  const [isInitialized, setIsInitialized] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const setClinic = (slug: ClinicSlug) => {
    setClinicState(slug);
    // Escribir cookie (lee middleware en próximas requests)
    document.cookie = `${COOKIE_NAME}=${slug}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  };

  return (
    <ClinicContext.Provider value={{ clinic, setClinic, isInitialized }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) {
    throw new Error('useClinic must be used within ClinicProvider');
  }
  return ctx;
}

export const CLINIC_COOKIE_NAME = COOKIE_NAME;