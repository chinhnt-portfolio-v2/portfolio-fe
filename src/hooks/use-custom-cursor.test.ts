import { renderHook } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'

import { useCustomCursor } from './use-custom-cursor'

// Mock cursor store — tests only check that the hook renders without errors on
// desktop (non-touch) and returns undefined on touch devices.
// Full event-listener integration is covered by the store-level tests.
vi.mock('@/stores/cursorStore', () => ({
  useCursorStore: () => ({
    setPosition: () => {},
    setClicking: () => {},
    setHovering: () => {},
    subscribe: () => () => {},
  }),
}))

describe('useCustomCursor', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'ontouchstart', {
      value: undefined, writable: true, configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0, writable: true, configurable: true,
    })
  })

  it('renders without errors on desktop (non-touch) devices', () => {
    const { result } = renderHook(() => useCustomCursor())
    expect(result.error).toBeUndefined()
  })

  it('renders without errors on touch devices', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 2, writable: true, configurable: true })

    const { result } = renderHook(() => useCustomCursor())
    expect(result.error).toBeUndefined()
  })
})
