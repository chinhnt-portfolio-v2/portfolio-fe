import { useEffect, useRef } from 'react'

import { WS_RECONNECT_MAX_RETRIES, WS_RECONNECT_BASE_DELAY_MS, WS_URL } from '@/constants/config'
import { useMetricsStore } from '@/stores/metricsStore'

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const setMetrics = useMetricsStore((state) => state.setMetrics)
  const setConnectionState = useMetricsStore((state) => state.setConnectionState)

  useEffect(() => {
    const connect = () => {
      setConnectionState('connecting')

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionState('connected')
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // Expected format from BE: { projectSlug, status, uptime, responseTime, lastDeploy }
          setMetrics(data.projectSlug, {
            uptime: data.uptime,
            responseTime: data.responseTime,
            // Add timestamp for staleness tracking
            lastUpdated: new Date().toISOString(),
            hasReceivedData: true,
          })
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      ws.onclose = () => {
        setConnectionState('disconnected')
        // Attempt reconnection with exponential backoff
        if (reconnectAttemptsRef.current < WS_RECONNECT_MAX_RETRIES) {
          const delay = WS_RECONNECT_BASE_DELAY_MS * Math.pow(2, reconnectAttemptsRef.current)
          reconnectAttemptsRef.current++
          reconnectTimeoutRef.current = setTimeout(connect, delay)
        } else {
          setConnectionState('error')
        }
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [setMetrics, setConnectionState])
}
