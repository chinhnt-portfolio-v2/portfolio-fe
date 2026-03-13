import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the hook
vi.mock('@/hooks/useGitHubContributions', () => ({
  useGitHubContributions: vi.fn(),
}))

import { GitHubGraph } from './GitHubGraph'
import { useGitHubContributions } from '@/hooks/useGitHubContributions'

const mockUseGitHubContributions = useGitHubContributions as ReturnType<typeof vi.fn>

describe('GitHubGraph', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders nothing when data is null and not loading (AC4: hide on empty)', () => {
    mockUseGitHubContributions.mockReturnValue({
      data: null,
      isLoading: false,
      error: true,
    })

    const { container } = render(<GitHubGraph username="testuser" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders loading state when loading (AC1: no spinner freeze)', () => {
    mockUseGitHubContributions.mockReturnValue({
      data: null,
      isLoading: true,
      error: false,
    })

    render(<GitHubGraph username="testuser" />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders contribution count when data is available (AC1: show data)', () => {
    mockUseGitHubContributions.mockReturnValue({
      data: { username: 'testuser', totalContributions: 150 },
      isLoading: false,
      error: false,
    })

    render(<GitHubGraph username="testuser" />)
    expect(screen.getByText(/150/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/testuser')
  })

  it('has correct accessibility attributes', () => {
    mockUseGitHubContributions.mockReturnValue({
      data: { username: 'testuser', totalContributions: 150 },
      isLoading: false,
      error: false,
    })

    render(<GitHubGraph username="testuser" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label')
  })
})
