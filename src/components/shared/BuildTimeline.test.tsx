import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BuildTimeline } from './BuildTimeline'

// Mock t function — returns prefixed string to verify i18n is being called
const mockT = vi.fn((key: string) => {
  const label = key.split('.').pop() ?? key
  return `[i18n:${label}]`
})

const milestones = [
  { date: '2026-01-15', key: 'm1' },
  { date: '2026-02-10', key: 'm2' },
  { date: '2026-03-03', key: 'm3' },
]

describe('BuildTimeline', () => {
  it('renders the correct number of milestones', () => {
    render(<BuildTimeline milestones={milestones} slug="wallet-app" t={mockT} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('renders i18n milestone titles via t()', () => {
    render(<BuildTimeline milestones={milestones} slug="wallet-app" t={mockT} />)
    // All 3 milestones render their own title via t()
    const titles = screen.getAllByText('[i18n:title]')
    expect(titles).toHaveLength(3)
  })

  it('renders 1-indexed badge numbers', () => {
    render(<BuildTimeline milestones={milestones} slug="wallet-app" t={mockT} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders i18n milestone descriptions via t()', () => {
    render(<BuildTimeline milestones={milestones} slug="wallet-app" t={mockT} />)
    // All 3 milestones render their own description via t()
    const descriptions = screen.getAllByText('[i18n:description]')
    expect(descriptions).toHaveLength(3)
  })

  it('renders as an ordered list with accessible label', () => {
    render(<BuildTimeline milestones={milestones} slug="wallet-app" t={mockT} />)
    const list = screen.getByRole('list', { name: /build timeline/i })
    expect(list).toBeInTheDocument()
  })

  it('renders nothing when milestones array is empty', () => {
    const { container } = render(<BuildTimeline milestones={[]} slug="wallet-app" t={mockT} />)
    expect(container.firstChild).toBeNull()
  })
})
