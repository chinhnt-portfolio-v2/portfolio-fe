import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MobileSheet } from './MobileSheet'

const navLinks = [
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
]

describe('MobileSheet', () => {
  it('renders nav links when open', () => {
    const onClose = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navLinks={navLinks} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('does not show nav links when closed', () => {
    const onClose = vi.fn()
    render(<MobileSheet isOpen={false} onClose={onClose} navLinks={navLinks} />)
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navLinks={navLinks} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('renders with role="dialog" when open (Radix Dialog provides focus trap natively)', () => {
    const onClose = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navLinks={navLinks} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('nav links inside sheet are keyboard-reachable anchor elements', () => {
    const onClose = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navLinks={navLinks} />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(navLinks.length)
    links.forEach(link => {
      expect(link.tagName).toBe('A')
    })
  })
})
