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
 * La cookie se lee y escribe SOLO en el cliente. El servidor siempre
 * renderiza con clinic = null — leerla con cookies() en el layout
 * forzaría SSR dinámico en todo el sitio y rompería SSG/ISR.
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

function readClinicCookie(): ClinicSlug | null {
  const match = document.cookie.match(/(?:^|;\s*)onkimia_clinic=([^;]+)/);
  const value = match?.[1];
  return value === 'guadalajara' || value === 'colima' ? value : null;
}

// Survives component remounts (e.g. locale switches that re-key the layout).
// False only during SSR and the very first hydration, where the state must
// match the server HTML (clinic = null). After that, remounts read the
// cookie synchronously — no "Select your clinic" flash on locale switches.
let _clinicHydrated = false;

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinic, setClinicState] = useState<ClinicSlug | null>(() =>
    _clinicHydrated && typeof window !== 'undefined' ? readClinicCookie() : null
  );
  const [isInitialized, setIsInitialized] = useState(_clinicHydrated);

  useEffect(() => {
    if (!_clinicHydrated) {
      _clinicHydrated = true;
      const value = readClinicCookie();
      if (value) setClinicState(value);
    }
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