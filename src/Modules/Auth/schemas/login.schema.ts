import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "validation:email")
    .pipe(z.email("validation:emailFormat")),
  password: z.string().min(1, "validation:password"),
})

export type LoginValues = z.infer<typeof loginSchema>

export const loginDefaultValues: LoginValues = {
  email: '',
  password: '',
}
