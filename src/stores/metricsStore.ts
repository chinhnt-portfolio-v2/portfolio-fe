import { create } from 'zustand'

// Session-only — no persist middleware
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

interface MetricsData {
  uptime?: number
  responseTime?: number
  requestsPerMinute?: number
}

interface MetricsStore {
  metrics: Record<string, MetricsData>
  connectionState: ConnectionState
  setMetrics: (projectSlug: string, data: MetricsData) => void
  setConnectionState: (state: ConnectionState) => void
}

export const useMetricsStore = create<MetricsStore>()((set) => ({
  metrics: {},
  connectionState: 'disconnected',
  setMetrics: (projectSlug, data) =>
    set((state) => ({ metrics: { ...state.metrics, [projectSlug]: data } })),
  setConnectionState: (connectionState) => set({ connectionState }),
}))
