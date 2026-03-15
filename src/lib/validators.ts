import { z } from 'zod'

export const contactFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email.')
    .max(255, 'Email must be 255 characters or less'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be 2000 characters or less'),
  // Honeypot field - hidden from users, used to catch bots
  website: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
