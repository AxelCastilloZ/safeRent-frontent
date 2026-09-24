import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8

const requiredText = (message: string) => z.string().trim().min(1, message)

export const createAccountSchema = z.object({
  fullName: requiredText('Full name is required.'),
  username: requiredText('Username is required.'),
  phoneNumber: requiredText('Phone number is required.'),
  email: requiredText('Email address is required.').pipe(
    z.email('Enter a valid email address.'),
  ),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
  acceptTerms: z
    .boolean()
    .refine((accepted) => accepted, 'You must accept the Terms of Service and Privacy Policy.'),
})

export type CreateAccountValues = z.infer<typeof createAccountSchema>

export const createAccountDefaultValues: CreateAccountValues = {
  fullName: '',
  username: '',
  phoneNumber: '',
  email: '',
  password: '',
  acceptTerms: false,
}
