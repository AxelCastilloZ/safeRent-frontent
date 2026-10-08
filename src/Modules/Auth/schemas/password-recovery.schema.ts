import { z } from 'zod';
import { createAccountSchema } from './create-account.schema';

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(1, 'Indica tu cédula o correo electrónico.').max(150)
    .refine((value) => value.includes('@') ? z.email().safeParse(value).success : value.length <= 30,
      'Indica un correo válido o una cédula de hasta 30 caracteres.'),
});

export const resetPasswordSchema = z.object({
  password: createAccountSchema.shape.password,
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña.'),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Las contraseñas no coinciden.', path: ['confirmPassword'],
});

// El token es opaco: solo el backend puede comprobar su vigencia y si ya fue usado.
export const resetTokenSchema = z.string().min(1).max(512).regex(/^[A-Za-z0-9_-]+$/);
