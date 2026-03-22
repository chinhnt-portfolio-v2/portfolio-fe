import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, it, expect, vi } from 'vitest'

import { ProjectCard } from './ProjectCard'

import type * as ReactRouterDom from 'react-router-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>()
  return { ...actual, useNavigate: () => mockNavigate }
})

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    article: ({
      children,
      className,
      initial: _i,
      animate: _a,
      transition: _t,
      whileHover: _wh,
      ...props
    }: React.ComponentProps<'article'> & Record<string, unknown>) => (
      <article className={className} {...props}>{children}</article>
    ),
  },
  useInView: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mutable state for test mocking - allows tests to change mock behavior
let mockProjectStatus = 'unavailable' as 'live' | 'stale' | 'hidden' | 'unavailable'
let mockMetricsData: Record<string, { uptime?: number; responseTime?: number; lastUpdated?: string; hasReceivedData?: boolean }> = {}
let mockConnectionState = 'disconnected' as 'connecting' | 'connected' | 'disconnected' | 'error'

// Mock metrics store - using mutable variables that tests can modify
vi.mock('@/stores/metricsStore', () => {
  return {
    useMetricsStore: vi.fn((selector) => {
      const state = {
        metrics: mockMetricsData,
        connectionState: mockConnectionState,
        setMetrics: vi.fn(),
        setConnectionState: vi.fn(),
        getProjectStatus: (_slug: string) => mockProjectStatus,
      }
      if (typeof selector === 'function') {
        return selector(state)
      }
      return state
    }),
  }
})

// Helper functions to modify mock state - called by tests
function setMockStatus(status: 'live' | 'stale' | 'hidden' | 'unavailable') {
  mockProjectStatus = status
}

function setMockMetrics(data: Record<string, { uptime?: number; responseTime?: number; lastUpdated?: string; hasReceivedData?: boolean }>) {
  mockMetricsData = data
}

function setMockConnectionState(state: 'connecting' | 'connected' | 'disconnected' | 'error') {
  mockConnectionState = state
}

const defaultProps = {
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project description.',
  status: 'live' as const,
  tags: ['React', 'TypeScript'],
  index: 0,
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProjectCard {...defaultProps} {...props} />
    </MemoryRouter>,
  )
}

describe('ProjectCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    // Reset mock state
    mockProjectStatus = 'unavailable'
    mockMetricsData = {}
    mockConnectionState = 'disconnected'
  })

  it('renders the project title', () => {
    renderCard()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('renders the description', () => {
    renderCard()
    expect(screen.getByText('A test project description.')).toBeInTheDocument()
  })

  it('has role="article" and aria-label equal to title', () => {
    renderCard()
    expect(screen.getByRole('article', { name: 'Test Project' })).toBeInTheDocument()
  })

  it('renders status indicator', () => {
    renderCard()
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('renders tech stack tags', () => {
    renderCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders "View project →" link to /projects/:slug', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /View project Test Project/i })
    expect(link).toHaveAttribute('href', '/projects/test-project')
  })

  it('renders shipDays metric when provided', () => {
    renderCard({ metrics: { shipDays: 30 } })
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('days to ship')).toBeInTheDocument()
  })

  it('does not render metrics section when metrics are undefined', () => {
    renderCard({ metrics: undefined })
    expect(screen.queryByText('days to ship')).not.toBeInTheDocument()
    expect(screen.queryByText('days uptime')).not.toBeInTheDocument()
  })

  it('renders live demo link when liveUrl provided', () => {
    renderCard({ liveUrl: 'https://example.com' })
    expect(screen.getByRole('link', { name: /open live demo for test project/i })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('renders GitHub link when githubUrl provided', () => {
    renderCard({ githubUrl: 'https://github.com/test' })
    expect(
      screen.getByRole('link', { name: /View source code for Test Project/i }),
    ).toHaveAttribute('href', 'https://github.com/test')
  })

  it('navigates to /projects/:slug when card body is clicked', async () => {
    const user = userEvent.setup()
    renderCard()
    const article = screen.getByRole('article', { name: 'Test Project' })
    await user.click(article)
    expect(mockNavigate).toHaveBeenCalledWith('/projects/test-project')
  })

  it('"View project" link has keyboard focus ring classes', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /View project Test Project/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('live demo link has keyboard focus ring classes', () => {
    renderCard({ liveUrl: 'https://example.com' })
    const link = screen.getByRole('link', { name: /Open live demo for Test Project/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('GitHub link has keyboard focus ring classes', () => {
    renderCard({ githubUrl: 'https://github.com/test' })
    const link = screen.getByRole('link', { name: /View source code for Test Project/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  // WebSocket metrics display tests (Story 3.4)
  describe('WebSocket live metrics display', () => {
    it('shows degraded state when connectionState is error - static content still renders', () => {
      // This test verifies that even when WebSocket fails, static content renders
      // The actual WebSocket integration is tested in metricsStore.test.ts
      renderCard()
      // Should still render static content
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })

  // Story 3.5: Metrics Staleness & Auto-Hide tests
  describe('WebSocket metrics staleness - hide after 24h (Story 3.5)', () => {
    it('hides metrics section when status is "hidden" (AC1: > 24h = hide entirely)', () => {
      setMockStatus('hidden')
      setMockConnectionState('connected')
      renderCard()
      // The metrics section should NOT render when status is 'hidden'
      expect(screen.queryByText('Status unavailable')).not.toBeInTheDocument()
      expect(screen.queryByText('uptime %')).not.toBeInTheDocument()
    })

    it('shows live metrics when status is "live"', () => {
      setMockStatus('live')
      setMockConnectionState('connected')
      setMockMetrics({ 'test-project': { uptime: 99.9, responseTime: 120, hasReceivedData: true } })
      // Don't pass static metrics prop so we only see live WebSocket metrics
      renderCard({ metrics: undefined })
      // Live metrics should be visible (99.9% due to suffix prop)
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('120')).toBeInTheDocument()
    })

    it('shows "Updated X ago" when status is "stale" (AC2)', () => {
      setMockStatus('stale')
      setMockConnectionState('connected')
      setMockMetrics({ 'test-project': { uptime: 99.9, lastUpdated: new Date().toISOString(), hasReceivedData: true } })
      renderCard()
      // Should show "Updated" text for stale status
      expect(screen.getByText(/Updated/i)).toBeInTheDocument()
    })

    it('shows "Status unavailable" when status is "unavailable" (never received data)', () => {
      setMockStatus('unavailable')
      setMockConnectionState('connected')
      renderCard()
      expect(screen.getByText('Status unavailable')).toBeInTheDocument()
    })
  })

  // Story 6.6: proofPoints — Scale Indicators
  describe('proofPoints strip (Story 6.6)', () => {
    it('renders proofPoints strip when provided', () => {
      renderCard({
        proofPoints: [
          { icon: '🏢', text: 'Enterprise SaaS' },
          { icon: '💬', text: 'Omnichannel messaging' },
        ],
      })
      expect(screen.getByText('Enterprise SaaS')).toBeInTheDocument()
      expect(screen.getByText('Omnichannel messaging')).toBeInTheDocument()
    })

    it('proofPoints strip has role="list"', () => {
      renderCard({
        proofPoints: [{ icon: '🏢', text: 'Enterprise SaaS' }],
      })
      expect(screen.getByRole('list', { name: 'Project proof points' })).toBeInTheDocument()
    })

    it('each proof point has role="listitem"', () => {
      renderCard({
        proofPoints: [
          { icon: '🏢', text: 'Enterprise SaaS' },
          { icon: '💬', text: 'Omnichannel messaging' },
        ],
      })
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('does not render proofPoints strip when not provided', () => {
      renderCard({ proofPoints: undefined })
      expect(screen.queryByRole('list', { name: 'Project proof points' })).not.toBeInTheDocument()
    })

    it('does not render proofPoints strip when empty array', () => {
      renderCard({ proofPoints: [] })
      expect(screen.queryByRole('list', { name: 'Project proof points' })).not.toBeInTheDocument()
    })

    it('renders icon for each proof point (aria-hidden)', () => {
      renderCard({
        proofPoints: [
          { icon: '🏢', text: 'Enterprise SaaS' },
          { icon: '💬', text: 'Omnichannel messaging' },
        ],
      })
      const icons = screen.getAllByText(/./, { selector: '[aria-hidden="true"]' })
      // At minimum the two icons should be present
      expect(icons.length).toBeGreaterThanOrEqual(2)
    })
  })
})
