import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SkipLinks } from './SkipLinks'

describe('SkipLinks', () => {
  it('renders with correct href', () => {
    render(<SkipLinks />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('is visually hidden by default (sr-only class)', () => {
    render(<SkipLinks />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link.className).toContain('sr-only')
  })

  it('becomes visible on focus (focus-visible:not-sr-only class)', () => {
    render(<SkipLinks />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link.className).toContain('focus-visible:not-sr-only')
  })

  it('renders as a single anchor element', () => {
    const { container } = render(<SkipLinks />)
    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(1)
  })
})
