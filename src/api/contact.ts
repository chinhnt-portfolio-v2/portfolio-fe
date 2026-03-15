import type { ContactFormData } from '@/lib/validators'

const API_BASE = '/api/v1'

export interface ContactSubmissionResponse {
  id: string
  email: string
  message: string
  referralSource: string | null
  submittedAt: string
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

export async function submitContactForm(
  data: ContactFormData,
  referralSource?: string
): Promise<ContactSubmissionResponse> {
  // Honeypot check - if website field is filled, silently discard
  if (data.website) {
    // Return a fake success to the client but don't actually submit
    return {
      id: 'honeypot-discarded',
      email: data.email,
      message: data.message,
      referralSource: referralSource ?? null,
      submittedAt: new Date().toISOString(),
    }
  }

  const response = await fetch(`${API_BASE}/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      message: data.message,
      referralSource: referralSource ?? null,
    }),
  })

  if (!response.ok) {
    // Handle rate limit specifically - show user-friendly message
    if (response.status === 429) {
      throw new Error('Too many submissions, please try again tomorrow')
    }
    const errorData: ApiError = await response.json()
    throw new Error(errorData.error.message || 'Failed to submit contact form')
  }

  return response.json()
}
