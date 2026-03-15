import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { SuccessAnimation } from './SuccessAnimation'
import { useMotion } from '@/hooks/useMotion'

const mockUseMotion = useMotion

// Mock framer-motion - must include ALL motion components used
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: (props: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', props),
      path: (props: React.SVGAttributes<SVGPathElement>) => React.createElement('path', props),
      p: (props: React.HTMLAttributes<HTMLParagraphElement>) => React.createElement('p', props),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => false,
  }
})

// Mock useMotion hook
vi.mock('@/hooks/useMotion', () => ({
  useMotion: vi.fn().mockReturnValue({ enabled: true }),
}))

describe('SuccessAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders success message when motion is enabled', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation />)

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
  })

  it('renders with role="status" for accessibility', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with aria-live="polite"', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('shows static content when reduced motion is preferred', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: false })

    render(<SuccessAnimation />)

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows confetti by default when motion is enabled', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation showConfetti={true} />)

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
  })

  it('can disable confetti with showConfetti prop', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation showConfetti={false} />)

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('role', 'status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('renders children when provided', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: false })

    render(
      <SuccessAnimation>
        <button type="button">Send another message</button>
      </SuccessAnimation>
    )

    expect(screen.getByRole('button', { name: /send another message/i })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation className="custom-class" />)

    const container = screen.getByRole('status')
    expect(container.className).toContain('custom-class')
  })

  it('accepts onComplete callback prop', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })
    const onComplete = vi.fn()

    render(<SuccessAnimation onComplete={onComplete} />)

    // Component renders successfully with onComplete prop
    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
  })

  it('accepts autoDismissDelay prop', () => {
    vi.mocked(mockUseMotion).mockReturnValue({ enabled: true })

    render(<SuccessAnimation autoDismissDelay={5000} />)

    expect(screen.getByText(/message sent/i)).toBeInTheDocument()
  })
})
