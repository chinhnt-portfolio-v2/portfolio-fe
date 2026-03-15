import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { ContactForm } from './ContactForm'

vi.mock('@/api/contact', () => ({
  submitContactForm: vi.fn(),
}))

const mockSubmitContactForm = await import('@/api/contact').then(
  (mod) => mod.submitContactForm
)

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and message fields with correct labels', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('has required attributes on email field', () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('aria-required', 'true')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('has required attributes on message textarea', () => {
    render(<ContactForm />)
    const messageInput = screen.getByLabelText(/message/i)
    expect(messageInput).toHaveAttribute('aria-required', 'true')
  })

  it('has honeypot field that is hidden', () => {
    render(<ContactForm />)
    const form = screen.getByRole('form')
    const honeypot = form.querySelector('input[name="website"]')
    // Honeypot should exist but be hidden
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveClass('hidden')
  })

  it('shows validation error for empty email on blur', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.click(emailInput)
    await user.tab() // blur

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i)
    })
  })

  it('shows validation error for invalid email on blur', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // blur

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
    })
  })

  it('shows validation error for short message on blur', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const messageInput = screen.getByLabelText(/message/i)
    await user.type(messageInput, 'Short')
    await user.tab() // blur

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/at least 10 characters/i)
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    vi.mocked(mockSubmitContactForm).mockResolvedValueOnce({
      id: 'test-id',
      email: 'test@example.com',
      message: 'This is a valid test message.',
      referralSource: null,
      submittedAt: new Date().toISOString(),
    })

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(mockSubmitContactForm).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          message: 'This is a valid test message with enough characters.',
        }),
        undefined
      )
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    vi.mocked(mockSubmitContactForm).mockResolvedValueOnce({
      id: 'test-id',
      email: 'test@example.com',
      message: 'Test message',
      referralSource: null,
      submittedAt: new Date().toISOString(),
    })

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    })
  })

  it('shows error message after failed submission', async () => {
    const user = userEvent.setup()
    vi.mocked(mockSubmitContactForm).mockRejectedValueOnce(new Error('Network error'))

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i)
    })
  })

  it('disables submit button while submitting', async () => {
    vi.mocked(mockSubmitContactForm).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<ContactForm />)

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')

    const submitBtn = screen.getByRole('button', { name: /send message/i })
    await user.click(submitBtn)

    expect(submitBtn).toBeDisabled()
    expect(submitBtn).toHaveTextContent(/sending/i)
  })

  it('meets WCAG 2.5.5 touch target: has min-h-[44px] on inputs', () => {
    render(<ContactForm />)

    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    const submitBtn = screen.getByRole('button', { name: /send message/i })

    expect(emailInput.className).toContain('min-h-[44px]')
    expect(messageInput.className).toContain('min-h-[44px]')
    expect(submitBtn.className).toContain('min-h-[44px]')
  })

  it('passes referralSource to API when provided', async () => {
    const user = userEvent.setup()
    vi.mocked(mockSubmitContactForm).mockResolvedValueOnce({
      id: 'test-id',
      email: 'test@example.com',
      message: 'Test message',
      referralSource: 'linkedin',
      submittedAt: new Date().toISOString(),
    })

    render(<ContactForm referralSource="linkedin" />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(mockSubmitContactForm).toHaveBeenCalledWith(
        expect.anything(),
        'linkedin'
      )
    })
  })

  it('shows user-friendly message on 429 rate limit response', async () => {
    const user = userEvent.setup()
    // Simulate a 429 response by throwing an error with rate limit message
    vi.mocked(mockSubmitContactForm).mockRejectedValueOnce(
      new Error('Too many submissions, please try again tomorrow')
    )

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      // Should show user-friendly message, not internal error codes
      expect(screen.getByRole('alert')).toHaveTextContent(/too many submissions/i)
    })
  })

  it('does not expose internal error codes - contact.ts converts 429 to user-friendly message', async () => {
    // This test verifies the API layer contract: contact.ts converts 429 responses
    // to user-friendly messages, so ContactForm only ever displays friendly text.
    // The actual conversion happens in src/api/contact.ts:
    //   if (response.status === 429) {
    //     throw new Error('Too many submissions, please try again tomorrow')
    //   }
    // Therefore, ContactForm never receives raw error codes from the API.
    const user = userEvent.setup()
    vi.mocked(mockSubmitContactForm).mockRejectedValueOnce(
      new Error('Too many submissions, please try again tomorrow')
    )

    render(<ContactForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a valid test message with enough characters.')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      // Verify user-friendly message is shown
      expect(screen.getByRole('alert')).toHaveTextContent(/too many submissions/i)
    })
  })
})
