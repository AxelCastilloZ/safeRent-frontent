import { z } from 'zod';
import { createAccountSchema } from './create-account.schema';
export const profileSchema = createAccountSchema.pick({ name: true, surname1: true, surname2: true, email: true, phoneNumber: true, birthdate: true }).extend({
  currentPassword: z.string().max(255),
  countryCode: z.string().regex(/^$|^[A-Z]{2}$/, 'Selecciona un país válido.'),
  preferredCurrency: z.string().regex(/^$|^[A-Z]{3}$/, 'Selecciona una moneda válida.'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Indica tu contraseña actual.').max(255),
  password: createAccountSchema.shape.password,
  confirmPassword: z.string().min(1, 'Confirma la nueva contraseña.'),
}).refine(value => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Las contraseñas no coinciden.' })
  .refine(value => value.password !== value.currentPassword, { path: ['password'], message: 'La nueva contraseña debe ser diferente de la actual.' });
