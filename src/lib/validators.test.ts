import { contactFormSchema } from './validators'

describe('contactFormSchema', () => {
  it('accepts valid form data', () => {
    const result = contactFormSchema.safeParse({
      name: 'Nguyen Van A',
      email: 'test@example.com',
      message: 'This is a valid message with enough content.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = contactFormSchema.safeParse({
      name: '',
      email: 'test@example.com',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name')
    }
  })

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({
      name: 'Test User',
      email: 'not-an-email',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('rejects message shorter than 10 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'Test User',
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
      name: 'Test User',
      email: 'test@example.com',
      message: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('rejects name longer than 100 characters', () => {
    const result = contactFormSchema.safeParse({
      name: 'a'.repeat(101),
      email: 'test@example.com',
      message: 'Valid message content here.',
    })
    expect(result.success).toBe(false)
  })
})
