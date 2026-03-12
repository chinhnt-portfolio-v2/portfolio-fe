import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { PageTransition } from './PageTransition'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <span>Page content</span>
      </PageTransition>,
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <PageTransition>
        <h1>Title</h1>
        <p>Paragraph</p>
      </PageTransition>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
  })

  it('wraps content in a div container', () => {
    const { container } = render(
      <PageTransition>
        <span>content</span>
      </PageTransition>,
    )
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
