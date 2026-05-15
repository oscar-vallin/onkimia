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

export function validateCvFile(file: File | null): string | null {
  if (!file || file.size === 0) return 'cv.required';
  if (file.size > MAX_FILE_SIZE_BYTES) return 'cv.tooLarge';
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'cv.invalidType';
  return null;
}
