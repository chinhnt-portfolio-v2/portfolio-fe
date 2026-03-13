import { create } from 'zustand'

// Session-only — no persist middleware
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

interface MetricsData {
  uptime?: number
  responseTime?: number
  requestsPerMinute?: number
  lastUpdated?: string // ISO timestamp
  hasReceivedData?: boolean // Track if we've ever received data
}

type ProjectStatus = 'live' | 'stale' | 'hidden' | 'unavailable'

interface MetricsStore {
  metrics: Record<string, MetricsData>
  connectionState: ConnectionState
  setMetrics: (projectSlug: string, data: MetricsData) => void
  setConnectionState: (state: ConnectionState) => void
  getProjectStatus: (projectSlug: string) => ProjectStatus
}

export const useMetricsStore = create<MetricsStore>()((set, get) => ({
  metrics: {},
  connectionState: 'disconnected',
  setMetrics: (projectSlug, data) =>
    set((state) => ({ metrics: { ...state.metrics, [projectSlug]: data } })),
  setConnectionState: (connectionState) => set({ connectionState }),
  getProjectStatus: (projectSlug: string): ProjectStatus => {
    const data = get().metrics[projectSlug]
    if (!data) return 'unavailable'
    if (!data.hasReceivedData) return 'unavailable'

    if (data.lastUpdated) {
      const hoursSinceUpdate = (Date.now() - new Date(data.lastUpdated).getTime()) / (1000 * 60 * 60)
      if (hoursSinceUpdate >= 24) return 'hidden' // Story 3.5: hide after 24h
      if (hoursSinceUpdate >= 1) return 'stale' // >= 1 hour = stale, < 1 hour = live
    }
    return 'live'
  },
}))
