/**
 * Analytics Service — Story 6-1: Real-time Analytics Dashboard
 *
 * Fires anonymised tracking events to the backend. No PII is collected or stored.
 * - visitorId: SHA-256 hash of the browser User-Agent (one-way, non-reversible)
 * - sessionId: opaque token stored in sessionStorage (not persisted across sessions)
 *
 * All methods fire-and-forget — failures are silently swallowed.
 */

const ANALYTICS_TRACK_URL = '/api/v1/analytics/track'

// ── Identity helpers ─────────────────────────────────────────────────────────

/**
 * Returns a SHA-256 hash of the navigator.userAgent string.
 * The hash (not the raw UA) is what gets sent to the server — no PII.
 */
async function hashVisitorId(): Promise<string> {
  try {
    const ua = navigator.userAgent
    const encoder = new TextEncoder()
    const data = encoder.encode(ua)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Fallback: deterministic hash-like string if crypto.subtle is unavailable
    return 'unknown'
  }
}

/**
 * Manages an opaque session token in sessionStorage.
 * A new token is generated on each fresh browser session.
 */
function getOrCreateSessionId(): string {
  const KEY = 'pf_session_id'
  let sessionId = sessionStorage.getItem(KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(KEY, sessionId)
  }
  return sessionId
}

// ── Traffic source detection ─────────────────────────────────────────────────

/**
 * Classifies the current visit as direct, referral, or organic.
 * - Referral: a non-empty document.referrer with a different host
 * - Organic: the URL contains a known search-engine query param (utm_source, q, etc.)
 * - Direct: otherwise
 */
function detectTrafficSource(): string {
  // Check URL params first (campaign tags take priority)
  const params = new URLSearchParams(window.location.search)
  if (params.get('utm_source')) return params.get('utm_source')!
  if (params.get('utm_medium')) return params.get('utm_medium')!
  if (params.get('q') || params.get('search') || params.get('query')) return 'organic'

  // Fall back to document.referrer
  try {
    const ref = document.referrer
    if (!ref) return 'direct'
    const refHost = new URL(ref).hostname
    if (refHost === window.location.hostname) return 'direct'
    return 'referral'
  } catch {
    return 'direct'
  }
}

// ── Event payload ────────────────────────────────────────────────────────────

interface AnalyticsEvent {
  eventType: string
  route: string
  visitorId: string
  sessionId: string
  trafficSource?: string
}

/**
 * Sends a single analytics event as a fire-and-forget beacon.
 * Uses navigator.sendBeacon for reliability during page unload.
 */
async function sendEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const payload = JSON.stringify(event)

    // Prefer sendBeacon for page-load events (survives navigation)
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(ANALYTICS_TRACK_URL, blob)
    } else {
      // Fallback for environments without sendBeacon
      await fetch(ANALYTICS_TRACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        // keepalive=true ensures the request survives page unload
        keepalive: true,
      }).catch(() => {/* swallow */})
    }
  } catch {
    // Intentionally silent — analytics must never break the UX
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

let _cachedVisitorId: string | null = null
let _cachedSessionId: string | null = null
let _initPromise: Promise<void> | null = null  // shared promise — prevents race condition

/** Must be called once on app initialisation to prime identity caches. */
export async function initAnalytics(): Promise<void> {
  if (_initPromise !== null) return _initPromise
  _initPromise = _doInit()
  return _initPromise
}

async function _doInit(): Promise<void> {
  if (_cachedVisitorId !== null && _cachedSessionId !== null) return
  _cachedVisitorId = await hashVisitorId()
  _cachedSessionId = getOrCreateSessionId()
  // Auto-track page view on init
  trackPageView(window.location.pathname)
}

/**
 * Records a page-view event for the given route.
 * Call this on route changes (e.g. inside a React Router useEffect).
 */
export function trackPageView(route: string): void {
  if (_cachedVisitorId === null || _cachedSessionId === null) {
    void initAnalytics().then(() => trackPageView(route))
    return
  }
  void sendEvent({
    eventType: 'page_view',
    route: route || '/',
    visitorId: _cachedVisitorId,
    sessionId: _cachedSessionId,
  })
}

/**
 * Records a traffic-source attribution event for the given route.
 * Automatically derives source from referrer and URL params.
 */
export function trackTrafficSource(route: string): void {
  if (_cachedVisitorId === null || _cachedSessionId === null) {
    void initAnalytics().then(() => trackTrafficSource(route))
    return
  }
  const source = detectTrafficSource()
  if (source === 'direct') return // Don't record direct visits as separate events
  void sendEvent({
    eventType: 'traffic_source',
    route: route || '/',
    visitorId: _cachedVisitorId,
    sessionId: _cachedSessionId,
    trafficSource: source,
  })
}

// ── Dashboard fetch (client-side only) ─────────────────────────────────────

export interface AnalyticsDashboard {
  generatedAt: string
  periodStart: string
  periodEnd: string
  uniqueVisitors: number
  pageViewsByRoute: Array<{
    route: string
    pageViews: number
    uniqueViews: number
  }>
  trafficSources: Array<{
    source: string
    count: number
    percentage: number
  }>
  visitorsByPeriod: Array<{
    period: string
    count: number
  }>
  deviceBreakdown: Array<{
    deviceType: string
    count: number
    percentage: number
  }>
}

/**
 * Fetches the admin analytics dashboard from the backend.
 * Requires a valid accessToken in the auth store.
 */
export async function fetchDashboard(
  accessToken: string,
  periodStartEpoch?: number,
  periodEndEpoch?: number,
): Promise<AnalyticsDashboard> {
  const params = new URLSearchParams()
  if (periodStartEpoch) params.set('periodStartEpoch', String(periodStartEpoch))
  if (periodEndEpoch)   params.set('periodEndEpoch',   String(periodEndEpoch))
  const query = params.toString() ? `?${params.toString()}` : ''

  const res = await fetch(`/api/v1/analytics/dashboard${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    if (res.status === 403) throw new Error('Access denied. Admin role required.')
    if (res.status === 401) {
      // Token expired — clear auth store to trigger re-login
      sessionStorage.removeItem('accessToken')
      throw new Error('Session expired. Please sign in again.')
    }
    throw new Error(`Failed to fetch analytics dashboard (${res.status})`)
  }

  return res.json() as Promise<AnalyticsDashboard>
}
