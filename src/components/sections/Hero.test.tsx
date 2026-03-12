import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { Hero } from './Hero'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', { className, ...props }, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useReducedMotion: () => false,
  MotionConfig: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Hero', () => {
  it('renders the eyebrow chip', () => {
    render(<Hero />)
    expect(screen.getByText('⚡ Backend · Fullstack')).toBeInTheDocument()
  })

  it('renders the headline with key phrase', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('that stay live.')).toBeInTheDocument()
  })

  it('renders "See the evidence" CTA linking to #projects', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: 'See the evidence' })
    expect(cta).toHaveAttribute('href', '#projects')
  })

  it('renders "Get in touch" CTA linking to #contact', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: 'Get in touch' })
    expect(cta).toHaveAttribute('href', '#contact')
  })

  it('renders the HeroCardStack (portfolio overview region)', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: 'Portfolio overview' })).toBeInTheDocument()
  })

  it('has section with aria-label="Hero"', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: 'Hero' })).toBeInTheDocument()
  })

  it('CTA links have keyboard focus ring classes', () => {
    render(<Hero />)
    const evidenceLink = screen.getByRole('link', { name: 'See the evidence' })
    const contactLink = screen.getByRole('link', { name: 'Get in touch' })
    expect(evidenceLink.className).toContain('focus-visible:ring-2')
    expect(contactLink.className).toContain('focus-visible:ring-2')
  })
})
