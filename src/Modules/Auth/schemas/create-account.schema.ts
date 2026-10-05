import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 8
const requiredText = (message: string, max: number) => z.string().trim().min(1, message).max(max)

export const createAccountSchema = z.object({
  idCard: requiredText('Identification card is required.', 30),
  name: requiredText('Name is required.', 200),
  surname1: requiredText('First surname is required.', 100),
  surname2: z.string().trim().max(100),
  phoneNumber: requiredText('Phone number is required.', 20)
    .regex(/^\+?[0-9]{8,20}$/, 'Use 8 to 20 digits, optionally starting with +.'),
  birthdate: z.iso.date('Enter a valid birthdate.'),
  email: requiredText('Email address is required.', 150).pipe(z.email('Enter a valid email address.')),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .max(72, 'Password cannot exceed 72 characters.')
    .regex(/[A-Z]/, 'Include at least one uppercase letter.')
    .regex(/[a-z]/, 'Include at least one lowercase letter.')
    .regex(/[0-9]/, 'Include at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Include at least one special character: !@#$%^&*(),.?":{}|<>')
    .refine((value) => new TextEncoder().encode(value).length <= 72, 'Password cannot exceed 72 UTF-8 bytes.'),
  acceptTerms: z.boolean().refine((accepted) => accepted, 'You must accept the Terms of Service and Privacy Policy.'),
})

export type CreateAccountValues = z.infer<typeof createAccountSchema>
export const createAccountDefaultValues: CreateAccountValues = {
  idCard: '', name: '', surname1: '', surname2: '', phoneNumber: '', birthdate: '',
  email: '', password: '', acceptTerms: false,
}
