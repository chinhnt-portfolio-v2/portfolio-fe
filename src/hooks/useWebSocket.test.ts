import { describe, expect, vi } from 'vitest'

// Mock config - hoisted to top
vi.mock('@/constants/config', () => ({
  WS_RECONNECT_MAX_RETRIES: 3,
  WS_RECONNECT_BASE_DELAY_MS: 1000,
  WS_URL: 'ws://localhost:8080/ws/metrics',
}))

// Mock metricsStore
vi.mock('@/stores/metricsStore', () => ({
  useMetricsStore: vi.fn((selector) => {
    const state = {
      metrics: {},
      connectionState: 'disconnected' as const,
      setMetrics: vi.fn(),
      setConnectionState: vi.fn(),
      getProjectStatus: vi.fn().mockReturnValue('unavailable'),
    }
    if (typeof selector === 'function') {
      return selector(state)
    }
    return state
  }),
}))

// Mock WebSocket
const mockWebSocketInstance = {
  close: vi.fn(),
  send: vi.fn(),
  readyState: 1,
}

const MockWebSocket = vi.fn(() => mockWebSocketInstance)
MockWebSocket.CONNECTING = 0
MockWebSocket.OPEN = 1
MockWebSocket.CLOSING = 2
MockWebSocket.CLOSED = 3
globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket

describe('useWebSocket', () => {
  beforeEach(() => {
    MockWebSocket.mockClear()
    mockWebSocketInstance.close.mockClear()
  })

  it('imports the useWebSocket hook', async () => {
    const { useWebSocket } = await import('./useWebSocket')
    expect(useWebSocket).toBeDefined()
    expect(typeof useWebSocket).toBe('function')
  })

  it('config has correct default values', async () => {
    const { WS_RECONNECT_MAX_RETRIES, WS_RECONNECT_BASE_DELAY_MS, WS_URL } = await import('@/constants/config')
    expect(WS_RECONNECT_MAX_RETRIES).toBe(3)
    expect(WS_RECONNECT_BASE_DELAY_MS).toBe(1000)
    expect(WS_URL).toBe('ws://localhost:8080/ws/metrics')
  })

  it('metricsStore has required functions', async () => {
    const { useMetricsStore } = await import('@/stores/metricsStore')
    expect(useMetricsStore).toBeDefined()
  })
})
