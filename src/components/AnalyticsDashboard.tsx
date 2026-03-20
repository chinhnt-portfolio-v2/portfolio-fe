/**
 * AnalyticsDashboard — Story 6-1: Real-time Analytics Dashboard
 *
 * Admin-only React component that displays aggregated analytics data:
 *   - Unique visitors & total page views
 *   - Page views breakdown by route (table)
 *   - Traffic source distribution (bar chart using divs)
 *   - Daily visitor trend
 *
 * Auto-refreshes every 60 seconds and requires a valid access token.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboard, type AnalyticsDashboard } from '@/services/analytics'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

// ── Constants ────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL_MS = 60_000

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

interface BarChartProps {
  data: Array<{ label: string; value: number; percentage?: number }>
  maxValue?: number
  color?: string
}

function BarChart({ data, maxValue, color = 'bg-primary' }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1)

  return (
    <div className="space-y-2">
      {data.map(item => {
        const pct = Math.round((item.value / max) * 100)
        const labelPct = item.percentage != null ? `${item.percentage}%` : `${item.value}`

        return (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 truncate text-muted-foreground">{item.label}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-2 rounded-full ${color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-right tabular-nums text-muted-foreground">{labelPct}</span>
          </div>
        )
      })}
    </div>
  )
}

function TrendLine({ data }: { data: Array<{ period: string; count: number }> }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="flex h-24 items-end gap-1">
      {data.map((item, i) => {
        const heightPct = Math.round((item.count / max) * 100)
        return (
          <div
            key={item.period + i}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div
              className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors"
              style={{ height: `${heightPct}%` }}
              title={`${item.period}: ${item.count} visitors`}
            />
            <span className="mt-1 text-[10px] text-muted-foreground">
              {item.period.slice(5)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface AnalyticsDashboardProps {
  /** Set to true once the component has confirmed the user is an admin */
  onAdminVerified?: () => void
}

export default function AnalyticsDashboard({ onAdminVerified }: AnalyticsDashboardProps) {
  const { accessToken } = useAuthStore()
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDashboard = useCallback(async () => {
    if (!accessToken) {
      setError('Authentication required. Please log in.')
      setLoading(false)
      return
    }

    try {
      setError(null)
      const data = await fetchDashboard(accessToken)
      setDashboard(data)
      setLastRefresh(new Date())
      onAdminVerified?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics dashboard.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, onAdminVerified])

  // Initial load
  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      void loadDashboard()
    }, REFRESH_INTERVAL_MS)

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
      }
    }
  }, [loadDashboard])

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            setLoading(true)
            void loadDashboard()
          }}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No analytics data available yet.
      </div>
    )
  }

  const trafficSourceBars = dashboard.trafficSources.map(s => ({
    label: s.source,
    value: s.count,
    percentage: s.percentage,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Period:{' '}
            {new Date(dashboard.periodStart).toLocaleDateString()} –{' '}
            {new Date(dashboard.periodEnd).toLocaleDateString()}
          </p>
        </div>
        {lastRefresh && (
          <p className="text-xs text-muted-foreground">
            Auto-refreshes every 60s · Last updated{' '}
            {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Unique Visitors" value={dashboard.uniqueVisitors.toLocaleString()} />
        <StatCard
          label="Total Page Views"
          value={dashboard.pageViewsByRoute.reduce((sum, r) => sum + r.pageViews, 0).toLocaleString()}
        />
        <StatCard label="Routes Tracked" value={dashboard.pageViewsByRoute.length} />
        <StatCard
          label="Traffic Sources"
          value={dashboard.trafficSources.length}
        />
      </div>

      {/* Two-column section: page views table + traffic sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Page views by route */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-medium">Page Views by Route</h3>
          {dashboard.pageViewsByRoute.length === 0 ? (
            <p className="text-sm text-muted-foreground">No page views recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Route</th>
                    <th className="pb-2 text-right font-medium">Page Views</th>
                    <th className="pb-2 text-right font-medium">Unique Views</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.pageViewsByRoute.map(row => (
                    <tr key={row.route} className="border-b last:border-0">
                      <td className="py-2 font-mono text-xs">{row.route}</td>
                      <td className="py-2 text-right tabular-nums">{row.pageViews.toLocaleString()}</td>
                      <td className="py-2 text-right tabular-nums">{row.uniqueViews.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Traffic sources */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-medium">Traffic Sources</h3>
          {trafficSourceBars.length === 0 ? (
            <p className="text-sm text-muted-foreground">No traffic source data yet.</p>
          ) : (
            <BarChart data={trafficSourceBars} color="bg-blue-500" />
          )}
        </div>
      </div>

      {/* Daily visitor trend */}
      {dashboard.visitorsByPeriod.length > 0 && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-medium">Daily Unique Visitors</h3>
          <TrendLine data={dashboard.visitorsByPeriod} />
        </div>
      )}

      {/* Generated timestamp */}
      <p className="text-xs text-muted-foreground">
        Dashboard generated at {new Date(dashboard.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
