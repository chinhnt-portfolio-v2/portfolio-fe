import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BuildTimeline } from './BuildTimeline'

const milestones = [
  { label: 'First Commit', date: '2026-01-15' },
  { label: 'MVP Complete', date: '2026-02-10' },
  { label: 'Production Deploy', date: '2026-03-03' },
]

describe('BuildTimeline', () => {
  it('renders the correct number of milestones', () => {
    render(<BuildTimeline milestones={milestones} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('renders milestone labels', () => {
    render(<BuildTimeline milestones={milestones} />)
    expect(screen.getByText('First Commit')).toBeInTheDocument()
    expect(screen.getByText('MVP Complete')).toBeInTheDocument()
    expect(screen.getByText('Production Deploy')).toBeInTheDocument()
  })

  it('renders 1-indexed badge numbers', () => {
    render(<BuildTimeline milestones={milestones} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders formatted dates', () => {
    render(<BuildTimeline milestones={milestones} />)
    expect(screen.getByText('Jan 15, 2026')).toBeInTheDocument()
    expect(screen.getByText('Feb 10, 2026')).toBeInTheDocument()
    expect(screen.getByText('Mar 3, 2026')).toBeInTheDocument()
  })

  it('renders as an ordered list with accessible label', () => {
    render(<BuildTimeline milestones={milestones} />)
    const list = screen.getByRole('list', { name: /build timeline/i })
    expect(list).toBeInTheDocument()
  })

  it('renders nothing when milestones array is empty', () => {
    const { container } = render(<BuildTimeline milestones={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
