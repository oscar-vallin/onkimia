import { env } from './env';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verifica el token de Cloudflare Turnstile contra el servidor.
 * Retorna true si el token es válido.
 */
export async function verifyTurnstile(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  if (!token) return false;

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body }
    );

    if (!response.ok) {
      console.error('[Turnstile] HTTP error:', response.status);
      return false;
    }

    const data = (await response.json()) as TurnstileResponse;

    if (!data.success) {
      console.error('[Turnstile] Validation failed:', data['error-codes']);
    }

    return data.success;
  } catch (error) {
    console.error('[Turnstile] Network error:', error);
    return false;
  }
}
