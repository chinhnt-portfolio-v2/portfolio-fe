import { useSearchParams } from 'react-router-dom'

import { ContactForm } from '@/components/shared/ContactForm'

export function Contact() {
  const [searchParams] = useSearchParams()
  const referralSource = searchParams.get('from') ?? undefined

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
            Get in Touch
          </h2>
          <p className="text-muted-foreground">
            Interested in working together? Send me a message and I&apos;ll get back to you as soon as possible.
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
