import { useTranslation } from 'react-i18next'

const CV_URL = 'https://drive.google.com/file/d/1nrNZTZ0mnWmOM9LSwU11rcB6rT0ewbDF/view?usp=drive_link'

export function DownloadCVButton() {
  const { t } = useTranslation()

  return (
    <a
      href={CV_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('hero.cta.downloadCV')}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
    >
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0-3-3m3 3 3-3M3 17v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"
        />
      </svg>
      {t('hero.cta.downloadCV')}
    </a>
  )
}
