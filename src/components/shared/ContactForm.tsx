import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { submitContactForm } from '@/api/contact'
import { SuccessAnimation } from '@/components/shared/SuccessAnimation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ContactFormData } from '@/lib/validators'
import { contactFormSchema } from '@/lib/validators'

interface ContactFormProps {
  className?: string
  referralSource?: string
}

export function ContactForm({ className, referralSource }: ContactFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
      message: '',
      website: '',
    },
    mode: 'onBlur',
  })

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (data: ContactFormData) => {
    setErrorMessage(null)

    try {
      await submitContactForm(data, referralSource)
      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
      // Handle rate limit error specifically
      if (error instanceof Error && error.message.includes('429')) {
        setErrorMessage(t('contact.validation.rateLimit'))
      } else {
        setErrorMessage(error instanceof Error ? error.message : t('contact.validation.rateLimit'))
      }
    }
  }

  if (submitStatus === 'success') {
    return (
      <SuccessAnimation
        className={className}
        onComplete={() => {
          // Auto-dismiss after animation completes (AC #3: auto-dismiss after 2 seconds)
          setSubmitStatus('idle')
        }}
      >
        <button
          type="button"
          onClick={() => setSubmitStatus('idle')}
          className="mt-4 text-sm text-green-700 underline dark:text-green-300 hover:text-green-600"
        >
          {t('contact.form.sendAnother')}
        </button>
      </SuccessAnimation>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
      role="form"
    >
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t('contact.form.email')} <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[44px]',
            errors.email && 'border-destructive aria-invalid:ring-destructive/20'
          )}
          placeholder={t('contact.form.emailPlaceholder')}
          autoComplete="email"
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.email.message === 'Email is required' && t('contact.validation.emailRequired')}
            {errors.email.message === 'Invalid email address' && t('contact.validation.emailInvalid')}
            {!errors.email.message?.includes('required') && !errors.email.message?.includes('Invalid') && errors.email.message}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t('contact.form.message')} <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(
            'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            'min-h-[44px]',
            errors.message && 'border-destructive aria-invalid:ring-destructive/20'
          )}
          placeholder={t('contact.form.messagePlaceholder')}
          rows={5}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.message.message === 'Message is required' && t('contact.validation.messageRequired')}
            {errors.message.message === 'Message must be at least 10 characters' && t('contact.validation.messageMinLength')}
            {!errors.message.message?.includes('required') && !errors.message.message?.includes('characters') && errors.message.message}
          </p>
        )}
      </div>

      {/* Error message from submission */}
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[44px]"
      >
        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
      </Button>
    </form>
  )
}
