import { renderHook } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { describe, it, expect, vi } from 'vitest'

import { useMotion } from './useMotion'

vi.mock('framer-motion', () => ({
  useReducedMotion: vi.fn().mockReturnValue(false),
}))

describe('useMotion', () => {
  it('returns enabled: true when reduced motion is not preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { result } = renderHook(() => useMotion())
    expect(result.current.enabled).toBe(true)
  })

  it('returns enabled: false when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    const { result } = renderHook(() => useMotion())
    expect(result.current.enabled).toBe(false)
  })

  it('hook returns an object with enabled property', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    const { result } = renderHook(() => useMotion())
    expect(typeof result.current.enabled).toBe('boolean')
  })
})
