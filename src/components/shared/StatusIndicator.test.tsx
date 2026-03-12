import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { StatusIndicator } from './StatusIndicator'

describe('StatusIndicator', () => {
  it('renders "Live" label for live status', () => {
    render(<StatusIndicator status="live" />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('renders "Building" label for building status', () => {
    render(<StatusIndicator status="building" />)
    expect(screen.getByText('Building')).toBeInTheDocument()
  })

  it('renders "Archived" label for archived status', () => {
    render(<StatusIndicator status="archived" />)
    expect(screen.getByText('Archived')).toBeInTheDocument()
  })

  it('has correct aria-label for live status', () => {
    render(<StatusIndicator status="live" />)
    expect(screen.getByLabelText('Project status: live')).toBeInTheDocument()
  })

  it('has correct aria-label for building status', () => {
    render(<StatusIndicator status="building" />)
    expect(screen.getByLabelText('Project status: building')).toBeInTheDocument()
  })

  it('applies status-pulse class only for live status', () => {
    const { container, rerender } = render(<StatusIndicator status="live" />)
    expect(container.querySelector('.status-pulse')).not.toBeNull()

    rerender(<StatusIndicator status="building" />)
    expect(container.querySelector('.status-pulse')).toBeNull()

    rerender(<StatusIndicator status="archived" />)
    expect(container.querySelector('.status-pulse')).toBeNull()
  })
})
