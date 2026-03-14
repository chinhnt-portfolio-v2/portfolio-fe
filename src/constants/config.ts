export const WS_RECONNECT_MAX_RETRIES = 3
export const WS_RECONNECT_BASE_DELAY_MS = 1000
// Use relative path for WebSocket - Vercel rewrites /ws/* to Cloud Run backend
export const WS_URL = import.meta.env.VITE_WS_URL || '/ws/metrics'

// GitHub username for contribution graph
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'chinh' // Default to portfolio owner's username
