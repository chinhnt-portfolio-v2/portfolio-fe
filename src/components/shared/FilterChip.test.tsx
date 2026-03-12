import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { FilterChip } from './FilterChip'

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="React" isActive={false} onClick={() => {}} />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('has aria-pressed=true when active', () => {
    render(<FilterChip label="React" isActive={true} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('has aria-pressed=false when inactive', () => {
    render(<FilterChip label="React" isActive={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<FilterChip label="React" isActive={false} onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'React' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies active styles when isActive is true', () => {
    render(<FilterChip label="React" isActive={true} onClick={() => {}} />)
    const btn = screen.getByRole('button', { name: 'React' })
    expect(btn.className).toContain('bg-brand')
    expect(btn.className).toContain('text-white')
  })

  it('meets WCAG 2.5.5 touch target: has min-h-[44px] class', () => {
    render(<FilterChip label="React" isActive={false} onClick={() => {}} />)
    const btn = screen.getByRole('button', { name: 'React' })
    expect(btn.className).toContain('min-h-[44px]')
  })
})
