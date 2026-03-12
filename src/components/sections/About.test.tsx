import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { About } from '@/components/sections/About'
import { STATUS_LABEL, aboutContent } from '@/constants/about'
import { projects } from '@/constants/projects'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', { className, ...props }, children),
  },
  useInView: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

describe('About', () => {
  it('renders the "Why Hire Me" heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /why hire me/i })).toBeInTheDocument()
  })

  it('renders the whyHireMe paragraph text (partial match)', () => {
    render(<About />)
    expect(screen.getByText(/build systems/i)).toBeInTheDocument()
  })

  it('whyHireMe text meets minimum length requirement (recruiter-centric framing)', () => {
    expect(aboutContent.whyHireMe.length).toBeGreaterThan(100)
  })

  it('renders the Verified Skills heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /verified skills/i })).toBeInTheDocument()
  })

  it('renders correct number of skill badge links', () => {
    render(<About />)
    const skillLinks = screen.getAllByRole('link')
    expect(skillLinks).toHaveLength(aboutContent.skills.length)
  })

  it('each skill link has target="_blank" and rel="noopener noreferrer"', () => {
    render(<About />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('each skill link href resolves to a project URL (not fallback "#")', () => {
    render(<About />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      const href = link.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).not.toBe('#')
    })
  })

  it('renders the Availability heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /availability/i })).toBeInTheDocument()
  })

  it('renders the correct availability status label for "open"', () => {
    render(<About />)
    expect(screen.getByText(/open to work/i)).toBeInTheDocument()
  })

  it('renders the location string', () => {
    render(<About />)
    expect(screen.getByText(aboutContent.availability.location)).toBeInTheDocument()
  })

  it('section has id="about" for anchor navigation', () => {
    const { container } = render(<About />)
    expect(container.querySelector('#about')).not.toBeNull()
  })

  it('section has aria-labelledby pointing to the h2 heading id', () => {
    const { container } = render(<About />)
    const section = container.querySelector('#about')
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading')
    const heading = container.querySelector('#about-heading')
    expect(heading).toBeInTheDocument()
  })

  it('skills reference valid slugs from projects.ts', () => {
    const slugs = projects.map((p) => p.slug)
    aboutContent.skills.forEach((skill) => {
      expect(slugs).toContain(skill.projectSlug)
    })
  })

  it('STATUS_LABEL maps all availability statuses correctly', () => {
    expect(STATUS_LABEL.open).toBe('Open to Work')
    expect(STATUS_LABEL.selective).toBe('Selectively Looking')
    expect(STATUS_LABEL.unavailable).toBe('Not Available')
  })

  it('skill badge links have keyboard focus ring classes', () => {
    render(<About />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.className).toContain('focus-visible:ring-2')
    })
  })
})
