import { z } from 'zod';
import { createAccountSchema } from './create-account.schema';
export const profileSchema = createAccountSchema.pick({ name: true, surname1: true, surname2: true, email: true, phoneNumber: true, birthdate: true }).extend({
  currentPassword: z.string().max(255, 'validation:maxLength'),
  countryCode: z.string().regex(/^$|^[A-Z]{2}$/, "validation:country"),
  preferredCurrency: z.string().regex(/^$|^[A-Z]{3}$/, "validation:currency"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "validation:currentPassword").max(255, 'validation:maxLength'),
  password: createAccountSchema.shape.password,
  confirmPassword: z.string().min(1, "validation:confirmPassword"),
}).refine(value => value.password === value.confirmPassword, { path: ['confirmPassword'], message: "validation:passwordMatch" })
  .refine(value => value.password !== value.currentPassword, { path: ['password'], message: "validation:passwordDifferent" });
