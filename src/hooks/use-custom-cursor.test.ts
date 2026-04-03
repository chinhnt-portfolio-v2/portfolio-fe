import { renderHook } from '@testing-library/react'
import { useMotionValue } from 'framer-motion'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { useCustomCursor } from './use-custom-cursor'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  useMotionValue: vi.fn((init: number) => ({ value: init, set: vi.fn() })),
  useReducedMotion: vi.fn().mockReturnValue(false),
}))

// Mock cursor store to prevent real Zustand access during module evaluation
vi.mock('@/stores/cursorStore', () => ({
  useCursorStore: vi.fn(() => ({
    setPosition: vi.fn(),
    setClicking: vi.fn(),
    setHovering: vi.fn(),
    subscribe: vi.fn(() => () => {}),
  })),
}))

describe('useCustomCursor', () => {
  beforeEach(() => {
    vi.mocked(useMotionValue).mockClear()

    // Desktop (non-touch) defaults — jsdom does not expose maxTouchPoints natively
    Object.defineProperty(window, 'ontouchstart', {
      value: undefined, writable: true, configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0, writable: true, configurable: true,
    })
  })

  describe('return shape', () => {
    it('returns x, y motion-value-like objects', () => {
      const { result } = renderHook(() => useCustomCursor())

      expect(result.current.x).toBeDefined()
      expect(result.current.y).toBeDefined()
      expect(typeof result.current.x.value).toBe('number')
      expect(typeof result.current.y.value).toBe('number')
    })

    it('x and y default to -100 (off-screen position)', () => {
      const { result } = renderHook(() => useCustomCursor())

      expect(result.current.x.value).toBe(-100)
      expect(result.current.y.value).toBe(-100)
    })
  })

  describe('framer-motion integration', () => {
    it('calls useMotionValue with -100 for x and y axes', () => {
      renderHook(() => useCustomCursor())

      expect(vi.mocked(useMotionValue)).toHaveBeenCalledWith(-100)
    })
  })
})
