import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { axe } from 'vitest-axe'

import HomePage from './HomePage'
import { useReturnVisitorStore } from '@/stores/returnVisitorStore'
import { useThemeStore } from '@/stores/themeStore'

vi.mock('@/stores/themeStore', () => ({
  useThemeStore: vi.fn(),
}))

vi.mock('@/stores/languageStore', () => ({
  useLanguageStore: vi.fn(() => ({ language: 'en' })),
}))

vi.mock('@/stores/returnVisitorStore', () => ({
  useReturnVisitorStore: vi.fn(),
}))

// Mock framer-motion for HomePage integration tests
type MotionProps = Record<string, unknown> & { children?: React.ReactNode; className?: string }
function stripMotionProps({ children, className, initial: _i, animate: _a, exit: _e, transition: _t, whileHover: _wh, ...rest }: MotionProps) {
  return { children, className, ...rest }
}

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: MotionProps) => <div {...stripMotionProps(props)} />,
    article: (props: MotionProps) => <article {...stripMotionProps(props)} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  useReducedMotion: () => false,
  MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
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

  it('renders main element with id="main-content"', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('renders Nav component', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('renders SkipLinks component as first focusable element', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('SkipLinks is first element reached by keyboard tab', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    await user.tab()
    expect(document.activeElement).toHaveAttribute('href', '#main-content')
  })

  it('renders Hero section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
    expect(screen.getByText('⚡ AI-Augmented Fullstack Engineer')).toBeInTheDocument()
  })

  it('renders Projects section with heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Projects', level: 2 })).toBeInTheDocument()
  })

  it('contact section has aria-label="Contact"', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    const contactSection = document.getElementById('contact')
    expect(contactSection).toHaveAttribute('aria-label', 'Contact')
  })

  it('has no accessibility violations (structural ARIA)', async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
