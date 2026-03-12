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
    const link = screen.getByRole('link', { name: /view project test project/i })
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
      screen.getByRole('link', { name: /view source code for test project on github/i }),
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
    const link = screen.getByRole('link', { name: /view project test project/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('live demo link has keyboard focus ring classes', () => {
    renderCard({ liveUrl: 'https://example.com' })
    const link = screen.getByRole('link', { name: /open live demo for test project/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('GitHub link has keyboard focus ring classes', () => {
    renderCard({ githubUrl: 'https://github.com/test' })
    const link = screen.getByRole('link', { name: /view source code for test project on github/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })
})
