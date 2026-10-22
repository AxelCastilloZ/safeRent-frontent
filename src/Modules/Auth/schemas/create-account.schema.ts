import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8
const requiredText = (message: string, max: number) => z.string().trim().min(1, message).max(max, 'validation:maxLength')

export const createAccountSchema = z.object({
  idCard: requiredText("validation:idCard", 30),
  name: requiredText("validation:name", 200),
  surname1: requiredText("validation:surname1", 100),
  surname2: z.string().trim().max(100, 'validation:maxLength'),
  phoneNumber: requiredText("validation:phone", 20)
    .regex(/^\+?[0-9]{8,20}$/, "validation:phoneFormat"),
  birthdate: z.iso.date("validation:birthdate"),
  email: requiredText("validation:email", 150).pipe(z.email("validation:emailFormat")),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, 'validation:passwordMin')
    .max(72, "validation:passwordMax")
    .regex(/[A-Z]/, "validation:uppercase")
    .regex(/[a-z]/, "validation:lowercase")
    .regex(/[0-9]/, "validation:number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "validation:symbol")
    .refine((value) => new TextEncoder().encode(value).length <= 72, "validation:passwordBytes"),
  acceptTerms: z.boolean().refine((accepted) => accepted, "validation:terms"),
})

export type CreateAccountValues = z.infer<typeof createAccountSchema>
export const createAccountDefaultValues: CreateAccountValues = {
  idCard: '', name: '', surname1: '', surname2: '', phoneNumber: '', birthdate: '',
  email: '', password: '', acceptTerms: false,
}
