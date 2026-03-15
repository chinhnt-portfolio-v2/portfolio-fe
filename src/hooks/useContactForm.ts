import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { submitContactForm } from '@/api/contact'
import type { ContactFormData } from '@/lib/validators'
import { contactFormSchema } from '@/lib/validators'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface UseContactFormReturn {
  form: ReturnType<typeof useForm<ContactFormData>>
  status: FormStatus
  errorMessage: string | null
  submitForm: (referralSource?: string) => Promise<void>
  resetForm: () => void
}

export function useContactForm(): UseContactFormReturn {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
      message: '',
      website: '',
    },
    mode: 'onBlur', // Validate on blur per AC
  })

  const submitForm = async (referralSource?: string) => {
    setStatus('submitting')
    setErrorMessage(null)

    try {
      await form.handleSubmit(async (data) => {
        await submitContactForm(data, referralSource)
        setStatus('success')
      })()
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit form')
    }
  }

  const resetForm = () => {
    form.reset()
    setStatus('idle')
    setErrorMessage(null)
  }

  return {
    form,
    status,
    errorMessage,
    submitForm,
    resetForm,
  }
}
