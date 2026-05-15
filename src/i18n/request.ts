import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validar que el locale recibido sea uno de los soportados
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    // Zona horaria de México para fechas/horas consistentes
    timeZone: 'America/Mexico_City',
    // Formato de fechas y números por locale
    now: new Date(),
  };
});