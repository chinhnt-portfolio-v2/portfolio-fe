import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { EyebrowChip } from './EyebrowChip'

describe('EyebrowChip', () => {
  it('renders children content', () => {
    render(<EyebrowChip>⚡ Backend · Fullstack</EyebrowChip>)
    expect(screen.getByText('⚡ Backend · Fullstack')).toBeInTheDocument()
  })

  it('applies role variant styles by default', () => {
    render(<EyebrowChip>Test</EyebrowChip>)
    const chip = screen.getByText('Test')
    expect(chip.className).toContain('border-purple-500/50')
    expect(chip.className).toContain('text-purple-300')
  })

  it('applies tag variant styles when specified', () => {
    render(<EyebrowChip variant="tag">Tag</EyebrowChip>)
    const chip = screen.getByText('Tag')
    expect(chip.className).toContain('text-muted-foreground')
  })
})
