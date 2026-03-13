import { describe, it, expect } from 'vitest'

import { useMetricsStore } from './metricsStore'

describe('useMetricsStore', () => {
  beforeEach(() => {
    // Reset store state
    useMetricsStore.setState({ metrics: {}, connectionState: 'disconnected' })
  })

  it('initializes with disconnected state and empty metrics', () => {
    const { metrics, connectionState } = useMetricsStore.getState()
    expect(connectionState).toBe('disconnected')
    expect(metrics).toEqual({})
  })

  it('setConnectionState updates connection state', () => {
    useMetricsStore.getState().setConnectionState('connected')
    expect(useMetricsStore.getState().connectionState).toBe('connected')
  })

  it('setMetrics stores metrics for a project slug', () => {
    useMetricsStore.getState().setMetrics('my-app', { uptime: 99.9, responseTime: 120 })
    expect(useMetricsStore.getState().metrics['my-app']).toEqual({
      uptime: 99.9,
      responseTime: 120,
    })
  })

  it('setMetrics merges metrics for multiple projects', () => {
    useMetricsStore.getState().setMetrics('app-a', { uptime: 99 })
    useMetricsStore.getState().setMetrics('app-b', { responseTime: 50 })
    const { metrics } = useMetricsStore.getState()
    expect(metrics['app-a']).toEqual({ uptime: 99 })
    expect(metrics['app-b']).toEqual({ responseTime: 50 })
  })

  // New tests for Story 3.4
  describe('getProjectStatus', () => {
    it('returns "unavailable" when no metrics exist for project', () => {
      const status = useMetricsStore.getState().getProjectStatus('non-existent')
      expect(status).toBe('unavailable')
    })

    it('returns "unavailable" when hasReceivedData is false', () => {
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        hasReceivedData: false,
      })
      const status = useMetricsStore.getState().getProjectStatus('my-app')
      expect(status).toBe('unavailable')
    })

    it('returns "live" when data is fresh (within last hour)', () => {
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        responseTime: 120,
        lastUpdated: new Date().toISOString(),
        hasReceivedData: true,
      })
      const status = useMetricsStore.getState().getProjectStatus('my-app')
      expect(status).toBe('live')
    })

    it('returns "stale" when data is older than 1 hour but less than 24 hours', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        lastUpdated: twoHoursAgo,
        hasReceivedData: true,
      })
      const status = useMetricsStore.getState().getProjectStatus('my-app')
      expect(status).toBe('stale')
    })

    it('returns "hidden" when data is older than 24 hours (AC1: hide metrics entirely)', () => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        lastUpdated: twoDaysAgo,
        hasReceivedData: true,
      })
      const status = useMetricsStore.getState().getProjectStatus('my-app')
      expect(status).toBe('hidden')
    })

    it('returns "hidden" when data is exactly 24 hours old', () => {
      const exactly24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        lastUpdated: exactly24HoursAgo,
        hasReceivedData: true,
      })
      const status = useMetricsStore.getState().getProjectStatus('my-app')
      expect(status).toBe('hidden')
    })

    it('distinct "hidden" from "unavailable" - hidden means data was received but is now stale', () => {
      // Scenario: We received data before, but it's now > 24h old → 'hidden'
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        lastUpdated: twoDaysAgo,
        hasReceivedData: true, // We DID receive data before
      })
      const hiddenStatus = useMetricsStore.getState().getProjectStatus('my-app')
      expect(hiddenStatus).toBe('hidden')

      // Scenario: We never received any data → 'unavailable'
      useMetricsStore.getState().setMetrics('my-app', {
        uptime: 99.9,
        hasReceivedData: false, // Never received data
      })
      const unavailableStatus = useMetricsStore.getState().getProjectStatus('my-app')
      expect(unavailableStatus).toBe('unavailable')
    })
  })

  describe('lastUpdated and hasReceivedData fields', () => {
    it('setMetrics stores lastUpdated timestamp', () => {
      const timestamp = new Date().toISOString()
      useMetricsStore.getState().setMetrics('my-app', {
        lastUpdated: timestamp,
        hasReceivedData: true,
      })
      expect(useMetricsStore.getState().metrics['my-app']?.lastUpdated).toBe(timestamp)
      expect(useMetricsStore.getState().metrics['my-app']?.hasReceivedData).toBe(true)
    })
  })
})
