import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { HeroStatsBar } from './HeroStatsBar'
import { HERO_STATS } from '@/config/about'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', { className, ...props }, children),
  },
}))

describe('HeroStatsBar', () => {
  it('renders the correct number of stats', () => {
    render(<HeroStatsBar />)
    // Scope to the stats bar list to avoid picking up unrelated listitems elsewhere on the page
    const list = screen.getByRole('list', { name: 'Professional proof points' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(HERO_STATS.length)
  })

  it('has role="list" on the container', () => {
    render(<HeroStatsBar />)
    expect(screen.getByRole('list', { name: 'Professional proof points' })).toBeInTheDocument()
  })

  it('renders icon for each stat', () => {
    render(<HeroStatsBar />)
    HERO_STATS.forEach((stat) => {
      const icons = screen.getAllByText(stat.icon, { selector: '[aria-hidden="true"]' })
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('each stat icon is explicitly aria-hidden', () => {
    render(<HeroStatsBar />)
    HERO_STATS.forEach((stat) => {
      const icon = screen.getByText(stat.icon, { selector: '[aria-hidden="true"]' })
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('renders label text for each stat', () => {
    render(<HeroStatsBar />)
    HERO_STATS.forEach((stat) => {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })

  it('renders sublabel text when present', () => {
    render(<HeroStatsBar />)
    HERO_STATS.filter(s => s.sublabel).forEach((stat) => {
      expect(screen.getByText(stat.sublabel as string)).toBeInTheDocument()
    })
  })

  it('each stat has aria-label equal to short label (tooltip shown on hover via title)', () => {
    render(<HeroStatsBar />)
    HERO_STATS.forEach((stat) => {
      // aria-label = short label so screen readers get scannable name
      const labelSpan = screen.getByText(stat.label)
      expect(labelSpan).toHaveAttribute('aria-label', stat.label)
    })
  })

  it('each stat has title attribute equal to full tooltip (shown on hover)', () => {
    render(<HeroStatsBar />)
    HERO_STATS.forEach((stat) => {
      if (stat.tooltip) {
        const labelSpan = screen.getByText(stat.label)
        expect(labelSpan).toHaveAttribute('title', stat.tooltip)
      }
    })
  })

  it('accepts className prop', () => {
    render(<HeroStatsBar className="my-custom-class" />)
    expect(screen.getByRole('list', { name: 'Professional proof points' })).toHaveClass('my-custom-class')
  })
})
