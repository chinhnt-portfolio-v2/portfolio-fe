import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import ProjectDetailPage from './ProjectDetailPage'

type MotionProps = Record<string, unknown> & { children?: React.ReactNode }

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function renderWithRouter(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetailPage', () => {
  it('renders project title for valid slug', () => {
    renderWithRouter('wallet-app')
    expect(screen.getByRole('heading', { level: 1, name: /wallet app/i })).toBeInTheDocument()
  })

  it('renders "Project not found." for invalid slug', () => {
    renderWithRouter('nonexistent-project')
    expect(screen.getByText('Project not found.')).toBeInTheDocument()
  })

  it('renders "Back to gallery" link in not-found state', () => {
    renderWithRouter('nonexistent-project')
    const link = screen.getByRole('link', { name: /back to gallery/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders "Back to gallery" link in found state', () => {
    renderWithRouter('wallet-app')
    const link = screen.getByRole('link', { name: /back to gallery/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders BuildTimeline when project has milestones >= 2', () => {
    renderWithRouter('wallet-app')
    expect(screen.getByRole('list', { name: /build timeline/i })).toBeInTheDocument()
  })

  it('collapsible section is hidden by default', () => {
    renderWithRouter('wallet-app')
    const button = screen.getByRole('button', { name: /what i'd do differently/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // Content should not be visible initially
    const content = screen.queryByTestId('lessons-content')
    expect(content).not.toBeInTheDocument()
  })

  it('collapsible section toggles on click', async () => {
    const user = userEvent.setup()
    renderWithRouter('wallet-app')
    const button = screen.getByRole('button', { name: /what i'd do differently/i })
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('lessons-content')).toBeInTheDocument()
  })

  it('renders external links with correct attributes for live project', () => {
    renderWithRouter('wallet-app')
    const liveLink = screen.getByRole('link', { name: /view live/i })
    expect(liveLink).toHaveAttribute('target', '_blank')
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders live link for portfolio-v2 (status: live, has liveUrl)', () => {
    renderWithRouter('portfolio-v2')
    const liveLink = screen.getByRole('link', { name: /view live/i })
    expect(liveLink).toBeInTheDocument()
    expect(liveLink).toHaveAttribute('href', 'https://portfolio.chinhnt.xyz')
  })

  it('renders GitHub link with correct attributes', () => {
    renderWithRouter('wallet-app')
    const ghLink = screen.getByRole('link', { name: /view on github/i })
    expect(ghLink).toHaveAttribute('target', '_blank')
    expect(ghLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders tech stack tags', () => {
    renderWithRouter('wallet-app')
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Spring Boot')).toBeInTheDocument()
  })

  it('does not render "Live soon" badge for live-product project without liveUrl', () => {
    renderWithRouter('portfolio-v1')
    expect(screen.queryByRole('link', { name: /view live/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/live soon/i)).not.toBeInTheDocument()
  })

  it('"Back to gallery" link has keyboard focus ring classes', () => {
    renderWithRouter('wallet-app')
    const link = screen.getByRole('link', { name: /back to gallery/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('"View Live" link has keyboard focus ring classes', () => {
    renderWithRouter('wallet-app')
    const link = screen.getByRole('link', { name: /view live/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('"View on GitHub" link has keyboard focus ring classes', () => {
    renderWithRouter('wallet-app')
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('lessons-learned toggle button has keyboard focus ring classes', () => {
    renderWithRouter('wallet-app')
    const button = screen.getByRole('button', { name: /what i.d do differently/i })
    expect(button.className).toContain('focus-visible:ring-2')
  })

  it('"Back to gallery" link has keyboard focus ring classes in not-found state', () => {
    renderWithRouter('nonexistent-project')
    const link = screen.getByRole('link', { name: /back to gallery/i })
    expect(link.className).toContain('focus-visible:ring-2')
  })

  it('has no accessibility violations for valid project (structural ARIA)', async () => {
    const { container } = renderWithRouter('wallet-app')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
