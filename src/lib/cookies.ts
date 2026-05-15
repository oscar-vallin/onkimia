import { cookies } from 'next/headers';
import { CLINIC_COOKIE_NAME, type ClinicSlug } from './clinic-context';

/**
 * Lee la cookie de clínica desde server components.
 */
export async function getClinicCookie(): Promise<ClinicSlug | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CLINIC_COOKIE_NAME)?.value;
  if (value === 'guadalajara' || value === 'colima') {
    return value;
  }
  return null;
}