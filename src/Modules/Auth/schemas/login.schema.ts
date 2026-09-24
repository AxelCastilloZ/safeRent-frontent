import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Password is required.'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const loginDefaultValues: LoginValues = {
  email: '',
  password: '',
}
