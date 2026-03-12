import { act } from '@testing-library/react'

import { useMetricsStore } from './metricsStore'

describe('useMetricsStore', () => {
  beforeEach(() => {
    act(() => {
      useMetricsStore.setState({ metrics: {}, connectionState: 'disconnected' })
    })
  })

  it('initializes with disconnected state and empty metrics', () => {
    const { metrics, connectionState } = useMetricsStore.getState()
    expect(connectionState).toBe('disconnected')
    expect(metrics).toEqual({})
  })

  it('setConnectionState updates connection state', () => {
    act(() => {
      useMetricsStore.getState().setConnectionState('connected')
    })
    expect(useMetricsStore.getState().connectionState).toBe('connected')
  })

  it('setMetrics stores metrics for a project slug', () => {
    act(() => {
      useMetricsStore.getState().setMetrics('my-app', { uptime: 99.9, responseTime: 120 })
    })
    expect(useMetricsStore.getState().metrics['my-app']).toEqual({
      uptime: 99.9,
      responseTime: 120,
    })
  })

  it('setMetrics merges metrics for multiple projects', () => {
    act(() => {
      useMetricsStore.getState().setMetrics('app-a', { uptime: 99 })
      useMetricsStore.getState().setMetrics('app-b', { responseTime: 50 })
    })
    const { metrics } = useMetricsStore.getState()
    expect(metrics['app-a']).toEqual({ uptime: 99 })
    expect(metrics['app-b']).toEqual({ responseTime: 50 })
  })
})
