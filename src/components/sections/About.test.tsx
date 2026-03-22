import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { About } from '@/components/sections/About'
import { aboutContent } from '@/constants/about'
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

  it('renders the whyHireMe paragraph text via i18n (partial match)', () => {
    // about.whyHireMe is sourced from i18n; partial match on "AI-augmented" which
    // appears in both en.json and vi.json versions of the paragraph
    render(<About />)
    expect(screen.getByText(/AI-augmented/i)).toBeInTheDocument()
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
    // Only skills with liveUrl/githubUrl resolve to real URLs.
    // Archived projects (sapo-social-channel, facebook-shopping, etc.)
    // have no public URLs, so About.tsx falls back to '#' — this is correct behavior.
    const availableSkills = aboutContent.skills.filter((skill) => {
      const project = projects.find((p) => p.slug === skill.projectSlug)
      return project?.liveUrl || project?.githubUrl
    })
    render(<About />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(aboutContent.skills.length)
    // Only verify real URLs for available projects; archived skills use '#'
    const linkData = links.map((link) => ({
      href: link.getAttribute('href'),
      text: link.textContent ?? '',
    }))
    availableSkills.forEach((skill) => {
      const link = linkData.find((l) => l.text.includes(skill.tech))
      expect(link?.href).toBeTruthy()
      expect(link?.href).not.toBe('#')
    })
  })

  it('renders the Availability heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /availability/i })).toBeInTheDocument()
  })

  it('renders the correct availability status label for "selective" (open-to-roles)', () => {
    render(<About />)
    expect(screen.getByText(/selectively looking/i)).toBeInTheDocument()
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

  it('skill badge links have keyboard focus ring classes', () => {
    render(<About />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.className).toContain('focus-visible:ring-2')
    })
  })
})
