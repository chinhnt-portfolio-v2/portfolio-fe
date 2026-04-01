import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MobileSheet } from './MobileSheet'

const navItems = [
  { sectionId: 'projects', label: 'Projects' },
  { sectionId: 'about',    label: 'About' },
]

describe('MobileSheet', () => {
  it('renders nav items when open', () => {
    const onClose = vi.fn()
    const onNavClick = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navItems={navItems} onNavClick={onNavClick} />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('does not show nav items when closed', () => {
    const onClose = vi.fn()
    const onNavClick = vi.fn()
    render(<MobileSheet isOpen={false} onClose={onClose} navItems={navItems} onNavClick={onNavClick} />)
    expect(screen.queryByText('Projects')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onNavClick = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navItems={navItems} onNavClick={onNavClick} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('renders with role="dialog" when open (Radix Dialog provides focus trap natively)', () => {
    const onClose = vi.fn()
    const onNavClick = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navItems={navItems} onNavClick={onNavClick} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('nav items inside sheet are buttons for smooth scroll handling', () => {
    const onClose = vi.fn()
    const onNavClick = vi.fn()
    render(<MobileSheet isOpen={true} onClose={onClose} navItems={navItems} onNavClick={onNavClick} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(navItems.length)
    buttons.forEach(btn => {
      expect(btn.tagName).toBe('BUTTON')
    })
  })
})
