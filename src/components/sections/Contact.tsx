import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ContactForm } from '@/components/shared/ContactForm'

export function Contact() {
  const [searchParams] = useSearchParams()
  const referralSource = searchParams.get('from') ?? undefined
  const { t } = useTranslation()

  return (
    <section
      id="contact"
      className="py-20 md:py-24"
      aria-labelledby="contact-heading"
      aria-label="Contact"
    >
      <div className="section-container max-w-2xl">
        <div className="mx-auto mb-12 max-w-[68ch] text-center">
          <h2
            id="contact-heading"
            className="mb-4 text-[var(--text-h1)] font-[var(--font-weight-h1)] tracking-[var(--letter-spacing-h1)] leading-tight text-foreground"
          >
            {t('contact.heading')}
          </h2>
          <p className="text-[var(--text-body)] leading-[1.65] text-muted-foreground">
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
