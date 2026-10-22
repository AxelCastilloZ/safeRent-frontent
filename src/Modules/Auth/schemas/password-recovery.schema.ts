import { z } from 'zod';
import { createAccountSchema } from './create-account.schema';

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(1, "validation:identifier").max(150, 'validation:maxLength')
    .refine((value) => value.includes('@') ? z.email().safeParse(value).success : value.length <= 30,
      "validation:identifierFormat"),
});

export const resetPasswordSchema = z.object({
  password: createAccountSchema.shape.password,
  confirmPassword: z.string().min(1, 'validation:confirmPassword'),
}).refine((value) => value.password === value.confirmPassword, {
  message: "validation:passwordMatch", path: ['confirmPassword'],
});

// El token es opaco: solo el backend puede comprobar su vigencia y si ya fue usado.
export const resetTokenSchema = z.string().min(1).max(512).regex(/^[A-Za-z0-9_-]+$/);
