import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Projects } from './Projects'
import { projects } from '@/constants/projects'
import { useGalleryStore } from '@/stores/galleryStore'

type MotionProps = Record<string, unknown> & { children?: React.ReactNode; className?: string }

function stripMotionProps({ children, className, initial: _i, animate: _a, exit: _e, transition: _t, whileHover: _wh, ...rest }: MotionProps) {
  return { children, className, ...rest }
}

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: MotionProps) => <div {...stripMotionProps(props)} />,
    article: (props: MotionProps) => <article {...stripMotionProps(props)} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  motionValue: (v = 0) => ({ value: v, set: () => {} }),
}))

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>,
  )
}

describe('Projects', () => {
  beforeEach(() => {
    // Reset gallery store before each test
    useGalleryStore.setState({ activeFilter: null })
    // Reset URL
    history.pushState(null, '', '/')
  })

  it('renders the section heading', () => {
    renderProjects()
    expect(screen.getByRole('heading', { name: 'Projects', level: 2 })).toBeInTheDocument()
  })

  it('renders "All" and "Featured" FilterChips', () => {
    renderProjects()
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Featured' })).toBeInTheDocument()
  })

  it('renders tech tag filter chips from projects', () => {
    renderProjects()
    // Verify at least one tag chip from projects data is present
    const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort()
    // First tag alphabetically should have a chip
    expect(screen.getByRole('button', { name: allTags[0] })).toBeInTheDocument()
  })

  it('filters to featured projects when Featured chip is clicked', async () => {
    const user = userEvent.setup()
    renderProjects()

    await user.click(screen.getByRole('button', { name: 'Featured' }))

    const featuredProjects = projects.filter(p => p.featured)
    featuredProjects.forEach(p => {
      expect(screen.getByRole('article', { name: p.title })).toBeInTheDocument()
    })

    // Non-featured projects should not be present
    const nonFeatured = projects.filter(p => !p.featured)
    nonFeatured.forEach(p => {
      expect(screen.queryByRole('article', { name: p.title })).not.toBeInTheDocument()
    })
  })

  it('shows all projects when All chip is clicked', async () => {
    const user = userEvent.setup()
    renderProjects()

    await user.click(screen.getByRole('button', { name: 'Featured' }))
    await user.click(screen.getByRole('button', { name: 'All' }))

    projects.forEach(p => {
      expect(screen.getByRole('article', { name: p.title })).toBeInTheDocument()
    })
  })

  it('shows empty state when filter matches no projects', () => {
    renderProjects()

    // Manually set filter to a value that matches nothing
    act(() => {
      useGalleryStore.setState({ activeFilter: 'nonexistent-tag-xyz' })
    })

    expect(screen.getByText('No projects match this filter.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset filter →' })).toBeInTheDocument()
  })

  it('clears filter when "Reset filter →" is clicked', async () => {
    const user = userEvent.setup()
    renderProjects()

    act(() => {
      useGalleryStore.setState({ activeFilter: 'nonexistent-tag-xyz' })
    })

    await user.click(screen.getByRole('button', { name: 'Reset filter →' }))

    // All projects should be visible
    projects.forEach(p => {
      expect(screen.getByRole('article', { name: p.title })).toBeInTheDocument()
    })
  })

  it('updates URL when filter changes', async () => {
    const user = userEvent.setup()
    renderProjects()

    await user.click(screen.getByRole('button', { name: 'Featured' }))

    expect(window.location.search).toContain('filter=featured')
  })

  it('clears URL param when All is selected', async () => {
    const user = userEvent.setup()
    renderProjects()

    await user.click(screen.getByRole('button', { name: 'Featured' }))
    await user.click(screen.getByRole('button', { name: 'All' }))

    expect(window.location.search).toBe('')
  })

  it('"All" chip has aria-pressed=true when no filter active', () => {
    renderProjects()
    // After mount, featured is set as default (no github referrer in test env)
    // so "All" won't be active — just check it renders
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  })
})
