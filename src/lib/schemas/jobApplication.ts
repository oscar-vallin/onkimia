import { z } from 'zod';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ['application/pdf'];

export const jobApplicationFormSchema = z.object({
  vacancyId: z.string().min(1, { message: 'vacancy.required' }),
  customJobDescription: z.string().max(2000).optional(),
  city: z.enum(['guadalajara', 'colima'], {
    error: 'city.required',
  }),
  area: z.string().min(1, { message: 'area.required' }),
  firstName: z
    .string()
    .min(2, { message: 'firstName.tooShort' })
    .max(50),
  lastName: z
    .string()
    .min(2, { message: 'lastName.tooShort' })
    .max(80),
  email: z
    .string()
    .email({ message: 'email.invalid' })
    .max(150),
  phone: z
    .string()
    .min(10, { message: 'phone.tooShort' })
    .max(20)
    .regex(/^[\d\s()+\-]+$/, { message: 'phone.invalid' }),
  birthDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 70;
    },
    { message: 'birthDate.invalid' }
  ),
  aboutYou: z
    .string()
    .min(20, { message: 'aboutYou.tooShort' })
    .max(3000),
  acceptPrivacy: z
    .boolean()
    .refine((v) => v === true, { message: 'privacy.required' }),
  _honeypot: z.string().max(0).optional(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationFormSchema>;

export type JobApplicationFormState = {
  ok: boolean;
  errors?: Partial<Record<keyof JobApplicationFormData | 'cv', string>>;
  message?: string;
};

/**
 * Validación barata por metadatos. Corre en el cliente (feedback inmediato) y
 * en el servidor como primer filtro.
 *
 * `file.type` lo declara el navegador a partir de la extensión: quien envíe el
 * formulario con un script pone ahí lo que quiera. Por eso el servidor vuelve
 * a validar el contenido real con isPdfContent() antes de adjuntar nada.
 */
export function validateCvFile(file: File | null): string | null {
  if (!file || file.size === 0) return 'cv.required';
  if (file.size > MAX_FILE_SIZE_BYTES) return 'cv.tooLarge';
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'cv.invalidType';
  return null;
}

/**
 * ¿Los bytes son realmente un PDF? Todo PDF empieza con la firma "%PDF-".
 *
 * Sin esto, cualquier archivo (un .exe, un .zip) pasa con solo declarar
 * `Content-Type: application/pdf`, y termina adjunto en el correo que abre
 * el equipo de RH.
 */
export function isPdfContent(bytes: Uint8Array): boolean {
  const SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
  if (bytes.length < SIGNATURE.length) return false;
  return SIGNATURE.every((byte, i) => bytes[i] === byte);
}
