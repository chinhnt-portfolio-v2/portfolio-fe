import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ContactForm } from '@/components/shared/ContactForm'

export function Contact() {
  const [searchParams] = useSearchParams()
  const referralSource = searchParams.get('from') ?? undefined
  const { t } = useTranslation()

  return (
    <section
      id="contact"
      className="py-16 md:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-12 text-center">
          <h2
            id="contact-heading"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('contact.heading')}
          </h2>
          <p className="text-muted-foreground">
            {t('contact.subheading')}
          </p>
        </div>

        <ContactForm
          referralSource={referralSource}
          className="mx-auto max-w-md"
        />
      </div>
    </section>
  )
}
