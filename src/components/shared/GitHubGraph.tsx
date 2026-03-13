import { useTranslation } from 'react-i18next'

import { useGitHubContributions } from '@/hooks/useGitHubContributions'

interface GitHubGraphProps {
  username: string
  apiUrl?: string
}

export function GitHubGraph({ username, apiUrl }: GitHubGraphProps) {
  const { t } = useTranslation()
  const { data, isLoading, error } = useGitHubContributions(username, apiUrl)

  // AC4: Hide section if no data available (empty response or error with no cache)
  // AC5: Hide section on timeout
  if (!isLoading && (data === null || error)) {
    return null
  }

  // AC1: Loading state - no spinner freeze (subtle skeleton)
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-2" aria-live="polite" aria-busy="true">
        <div className="h-5 w-5 rounded-sm bg-muted animate-pulse" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">{t('about.githubContributions.loading')}</span>
      </div>
    )
  }

  // AC1: Show contribution data
  return (
    <div className="flex items-center gap-3 py-2">
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:underline focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none rounded-sm"
        aria-label={`${t('about.githubContributions.label')}: ${data?.totalContributions} ${t('about.githubContributions.contributions')}`}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
        </svg>
        <span className="text-sm font-medium">
          {data?.totalContributions} {t('about.githubContributions.contributions')}
        </span>
      </a>
    </div>
  )
}
