import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { AIWorkflowStrip } from './AIWorkflowStrip'
import { AI_WORKFLOW_STEPS } from '@/config/about'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', { className, ...props }, children),
  },
}))

describe('AIWorkflowStrip', () => {
  it('renders the correct number of workflow steps', () => {
    render(<AIWorkflowStrip />)
    // Each step has role="img" emoji + label + sublabel, we check for labels
    AI_WORKFLOW_STEPS.forEach((step) => {
      expect(screen.getByText(step.label)).toBeInTheDocument()
    })
  })

  it('has role="region" with correct aria-label', () => {
    render(<AIWorkflowStrip />)
    expect(screen.getByRole('region', { name: 'AI-augmented development workflow' })).toBeInTheDocument()
  })

  it('renders icon for each step (aria-hidden)', () => {
    render(<AIWorkflowStrip />)
    AI_WORKFLOW_STEPS.forEach((step) => {
      // Icon is aria-hidden decorative; step label is the accessible name
      const icons = screen.getAllByText(step.icon, { selector: '[aria-hidden="true"]' })
      expect(icons.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('each step label has aria-label with full workflow description', () => {
    render(<AIWorkflowStrip />)
    AI_WORKFLOW_STEPS.forEach((step) => {
      expect(screen.getByText(step.label)).toHaveAttribute(
        'aria-label',
        `${step.label}: ${step.ariaLabel}`
      )
    })
  })

  it('renders sublabel for each step', () => {
    render(<AIWorkflowStrip />)
    AI_WORKFLOW_STEPS.forEach((step) => {
      expect(screen.getByText(step.sublabel)).toBeInTheDocument()
    })
  })

  it('renders connector arrows between steps', () => {
    render(<AIWorkflowStrip />)
    // Should have (n-1) arrows between n steps
    const arrows = screen.getAllByText('→')
    expect(arrows).toHaveLength(AI_WORKFLOW_STEPS.length - 1)
  })

  it('connector arrows are aria-hidden', () => {
    render(<AIWorkflowStrip />)
    const arrows = screen.getAllByText('→')
    arrows.forEach((arrow) => {
      expect(arrow).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('accepts className prop', () => {
    render(<AIWorkflowStrip className="my-custom-class" />)
    expect(screen.getByRole('region', { name: 'AI-augmented development workflow' })).toHaveClass('my-custom-class')
  })
})
