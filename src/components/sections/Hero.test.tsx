import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Hero } from './Hero'
import { useReferralStore } from '@/stores/referralStore'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', { className, ...props }, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useReducedMotion: () => false,
  MotionConfig: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock HeroStatsBar and AIWorkflowStrip (Story 6.6 additions)
vi.mock('@/components/sections/HeroStatsBar', () => ({
  HeroStatsBar: ({ className }: { className?: string }) =>
    React.createElement('div', { 'data-testid': 'hero-stats-bar', className }),
}))

vi.mock('@/components/sections/AIWorkflowStrip', () => ({
  AIWorkflowStrip: ({ className }: { className?: string }) =>
    React.createElement('div', { 'data-testid': 'ai-workflow-strip', className }),
}))

vi.mock('@/stores/referralStore', () => ({
  useReferralStore: vi.fn(),
}))

vi.mock('@/stores/returnVisitorStore', () => ({
  useReturnVisitorStore: vi.fn(),
}))

describe('Hero', () => {
  beforeEach(() => {
    vi.mocked(useReferralStore).mockReturnValue({
      referralSource: null,
      setReferralSource: vi.fn(),
      initializeFromUrl: vi.fn(),
      _hasHydrated: true,
      setHasHydrated: vi.fn(),
    })

    vi.mocked(useReturnVisitorStore).mockReturnValue({
      lastViewedSlug: null,
      lastViewedTab: null,
      lastVisitTimestamp: null,
      bannerDismissed: false,
      _hasHydrated: true,
      setHasHydrated: vi.fn(),
      setLastViewedSlug: vi.fn(),
      setLastViewedTab: vi.fn(),
      dismissBanner: vi.fn(),
      updateTimestamp: vi.fn(),
      isReturningVisitor: vi.fn().mockReturnValue(false),
    })
  })

  it('renders the eyebrow chip', () => {
    render(<Hero />)
    expect(screen.getByText('⚡ AI-Augmented Fullstack Engineer')).toBeInTheDocument()
  })

  it('renders the headline with key phrase', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('that stay live.')).toBeInTheDocument()
  })

  it('renders "See the evidence" CTA linking to #projects', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: 'See the evidence' })
    expect(cta).toHaveAttribute('href', '#projects')
  })

  it('renders "Get in touch" CTA linking to #contact', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: 'Get in touch' })
    expect(cta).toHaveAttribute('href', '#contact')
  })

  it('renders the HeroCardStack (portfolio overview region)', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: 'Portfolio overview' })).toBeInTheDocument()
  })

  it('has section with aria-label="Hero"', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
  })

  it('CTA links have keyboard focus ring classes', () => {
    render(<Hero />)
    const evidenceLink = screen.getByRole('link', { name: 'See the evidence' })
    const contactLink = screen.getByRole('link', { name: 'Get in touch' })
    expect(evidenceLink.className).toContain('focus-visible:ring-2')
    expect(contactLink.className).toContain('focus-visible:ring-2')
  })

  describe('contextual messaging', () => {
    it('renders contextual content when referral source is linkedin', () => {
      const mockStore = {
        referralSource: 'linkedin',
        setReferralSource: vi.fn(),
        initializeFromUrl: vi.fn(),
        _hasHydrated: true,
        setHasHydrated: vi.fn(),
      }
      vi.mocked(useReferralStore).mockImplementation((selector) => {
        if (typeof selector === 'function') return selector(mockStore)
        return mockStore
      })

      render(<Hero />)
      // LinkedIn context eyebrow - must differ from default
      expect(screen.getByText('⚡ AI-Augmented Fullstack · Open to Work')).toBeInTheDocument()
    })

    it('renders contextual content when referral source is cv-vn', () => {
      const mockStore = {
        referralSource: 'cv-vn',
        setReferralSource: vi.fn(),
        initializeFromUrl: vi.fn(),
        _hasHydrated: true,
        setHasHydrated: vi.fn(),
      }
      vi.mocked(useReferralStore).mockImplementation((selector) => {
        if (typeof selector === 'function') return selector(mockStore)
        return mockStore
      })

      render(<Hero />)
      // CV-VN context eyebrow - must differ from default
      expect(screen.getByText('⚡ Kỹ Sư Fullstack Tăng Cường AI · Sẵn Sàng')).toBeInTheDocument()
    })

    it('renders default content when no referral source', () => {
      const mockStore = {
        referralSource: null,
        setReferralSource: vi.fn(),
        initializeFromUrl: vi.fn(),
        _hasHydrated: true,
        setHasHydrated: vi.fn(),
      }
      vi.mocked(useReferralStore).mockImplementation((selector) => {
        if (typeof selector === 'function') return selector(mockStore)
        return mockStore
      })

      render(<Hero />)
      // Default eyebrow (no contextual)
      expect(screen.getByText('⚡ AI-Augmented Fullstack Engineer')).toBeInTheDocument()
    })

    it('adds aria-live to tagline when referral source is present', () => {
      const mockStore = {
        referralSource: 'linkedin',
        setReferralSource: vi.fn(),
        initializeFromUrl: vi.fn(),
        _hasHydrated: true,
        setHasHydrated: vi.fn(),
      }
      vi.mocked(useReferralStore).mockImplementation((selector) => {
        if (typeof selector === 'function') return selector(mockStore)
        return mockStore
      })

      render(<Hero />)
      // The tagline element should have aria-live when referral source exists
      const paragraph = screen.getByText((content, element) => {
        return element?.tagName === 'P' && element.className.includes('text-muted-foreground')
      })
      expect(paragraph).toHaveAttribute('aria-live', 'polite')
    })

    it('does not add aria-live when no referral source', () => {
      const mockStore = {
        referralSource: null,
        setReferralSource: vi.fn(),
        initializeFromUrl: vi.fn(),
        _hasHydrated: true,
        setHasHydrated: vi.fn(),
      }
      vi.mocked(useReferralStore).mockImplementation((selector) => {
        if (typeof selector === 'function') return selector(mockStore)
        return mockStore
      })

      render(<Hero />)
      const paragraph = screen.getByText((content, element) => {
        return element?.tagName === 'P' && element.className.includes('text-muted-foreground')
      })
      expect(paragraph).not.toHaveAttribute('aria-live')
    })
  })
})
