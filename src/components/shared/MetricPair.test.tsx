import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { MetricPair } from './MetricPair'

describe('MetricPair', () => {
  it('renders the numeric value', () => {
    render(<MetricPair value={47} label="days to ship" />)
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('renders the label', () => {
    render(<MetricPair value={47} label="days to ship" />)
    expect(screen.getByText('days to ship')).toBeInTheDocument()
  })

  it('renders string values', () => {
    render(<MetricPair value="99%+" label="uptime" />)
    expect(screen.getByText('99%+')).toBeInTheDocument()
  })

  it('applies tabular-nums to value', () => {
    render(<MetricPair value={42} label="test" />)
    const valueEl = screen.getByText('42')
    expect(valueEl.className).toContain('tabular-nums')
  })

  it('has aria-label combining value and label for screen readers', () => {
    render(<MetricPair value={47} label="days to ship" />)
    expect(screen.getByLabelText('47 days to ship')).toBeInTheDocument()
  })
})
