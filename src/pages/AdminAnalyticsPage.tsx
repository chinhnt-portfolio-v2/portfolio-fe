/**
 * AdminAnalyticsPage — Story 6-1: Real-time Analytics Dashboard
 *
 * Wrapper page for the analytics dashboard.
 * Protects the route client-side by checking for a valid auth token
 * before rendering the data-fetching component.
 */

import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { useAuthStore } from '@/stores/authStore'

export default function AdminAnalyticsPage() {
  const { accessToken } = useAuthStore()

  if (!accessToken) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Admin Access Required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in with an admin account to view analytics.
        </p>
      </div>
    )
  }

  return <AnalyticsDashboard />
}
