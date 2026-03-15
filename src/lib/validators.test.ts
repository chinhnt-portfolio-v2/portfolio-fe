import { contactFormSchema } from './validators'

describe('contactFormSchema', () => {
  it('accepts valid form data', () => {
    const result = contactFormSchema.safeParse({
      email: 'test@example.com',
      message: 'This is a valid message with enough content.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty email', () => {
    const result = contactFormSchema.safeParse({
      email: '',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({
      email: 'not-an-email',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('rejects email longer than 255 characters', () => {
    const result = contactFormSchema.safeParse({
      email: 'a'.repeat(250) + '@example.com',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects message shorter than 10 characters', () => {
    const result = contactFormSchema.safeParse({
      email: 'test@example.com',
      message: 'Short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('message')
    }
  })

  it('rejects message longer than 2000 characters', () => {
    const result = contactFormSchema.safeParse({
      email: 'test@example.com',
      message: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional honeypot field', () => {
    const result = contactFormSchema.safeParse({
      email: 'test@example.com',
      message: 'Valid message content here.',
      website: '',
    })
    expect(result.success).toBe(true)
  })

  it('accepts filled honeypot field (for backend validation)', () => {
    const result = contactFormSchema.safeParse({
      email: 'test@example.com',
      message: 'Valid message content here.',
      website: 'http://spam.com',
    })
    expect(result.success).toBe(true)
  })
})
