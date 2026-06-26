import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'name.tooShort' })
    .max(100, { message: 'name.tooLong' }),
  email: z
    .string()
    .email({ message: 'email.invalid' })
    .max(150, { message: 'email.tooLong' }),
  phone: z
    .string()
    .min(8, { message: 'phone.tooShort' })
    .max(20, { message: 'phone.tooLong' })
    .regex(/^[\d\s()+\-]+$/, { message: 'phone.invalid' }),
  comment: z
    .string()
    .min(10, { message: 'comment.tooShort' })
    .max(2000, { message: 'comment.tooLong' }),
  acceptPrivacy: z
    .boolean()
    .refine((v) => v === true, { message: 'privacy.required' }),
  _honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState = {
  ok: boolean;
  errors?: Partial<Record<keyof ContactFormData, string>>;
  message?: string;
};
