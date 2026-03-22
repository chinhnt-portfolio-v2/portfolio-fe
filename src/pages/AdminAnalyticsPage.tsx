/**
 * AdminAnalyticsPage — Story 6-1: Real-time Analytics Dashboard
 *
 * Wrapper page for the analytics dashboard.
 * Protects the route client-side by checking for a valid auth token
 * before rendering the data-fetching component.
 */

import { useTranslation } from 'react-i18next'

import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { useAuthStore } from '@/stores/authStore'

export default function AdminAnalyticsPage() {
  const { t } = useTranslation()
  const { accessToken } = useAuthStore()

  if (!accessToken) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">{t('admin.accessRequired')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('admin.accessRequiredDesc')}
        </p>
      </div>
    )
  }

  return <AnalyticsDashboard />
}
