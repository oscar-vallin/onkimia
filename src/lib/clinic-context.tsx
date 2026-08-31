'use client';

/**
 * Global context for the clinic selected by the user.
 *
 * Persisted in the `onkimia_clinic` cookie for 1 year.
 * Used by:
 *  - WhatsApp button (routing to the correct number)
 *  - Header (showing the current location)
 *  - Form pre-fill
 *
 * The cookie is read and written client-side ONLY. The server always
 * renders with clinic = null — reading it with cookies() in the layout
 * would force dynamic SSR across the whole site and break SSG/ISR.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

  // Stable identity: SetClinicOnMount depends on this in its effect array.
  // If this were redefined every render, that effect would re-fire on every
  // clinic change (including ones made elsewhere, like the Header selector)
  // and silently revert the user's choice back to whatever clinic-specific
  // page happens to be mounted.
  const setClinic = useCallback((slug: ClinicSlug) => {
    setClinicState(slug);
    // Write the cookie (middleware reads it on subsequent requests)
    document.cookie = `${COOKIE_NAME}=${slug}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

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