import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { HeroCardStack } from './HeroCardStack'

describe('HeroCardStack', () => {
  it('has role="region" and aria-label', () => {
    render(<HeroCardStack />)
    expect(screen.getByRole('region', { name: 'Portfolio overview' })).toBeInTheDocument()
  })

  it('shows "Live" status indicator', () => {
    render(<HeroCardStack />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('renders projects shipped metric', () => {
    render(<HeroCardStack />)
    expect(screen.getByText('projects shipped')).toBeInTheDocument()
  })

  it('renders uptime metric', () => {
    render(<HeroCardStack />)
    expect(screen.getByText('99%+')).toBeInTheDocument()
    expect(screen.getByText('uptime (30d)')).toBeInTheDocument()
  })

  it('renders avg days to ship when available', () => {
    render(<HeroCardStack />)
    // projects.ts has metrics.shipDays for all 3 projects
    expect(screen.getByText('avg. days to ship')).toBeInTheDocument()
  })
})
