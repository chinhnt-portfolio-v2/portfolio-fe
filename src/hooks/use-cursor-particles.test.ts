import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useCursorParticles } from './use-cursor-particles'

// Mock requestAnimationFrame and cancelAnimationFrame
let rafCounter = 0
const rafCallbacks: Map<number, () => void> = new Map()

const _originalRAF = window.requestAnimationFrame
const _originalCancelRAF = window.cancelAnimationFrame

vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
  const id = ++rafCounter
  rafCallbacks.set(id, cb)
  return id
})

vi.stubGlobal('cancelAnimationFrame', (id: number) => {
  rafCallbacks.delete(id)
})

// Helper to flush pending RAF callbacks
function flushRAF() {
  const callbacks = Array.from(rafCallbacks.values())
  rafCallbacks.clear()
  callbacks.forEach((cb) => cb())
}

describe('useCursorParticles', () => {
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    rafCallbacks.clear()
    rafCounter = 0

    // Create a mock canvas element with a 2d context
    mockCanvas = document.createElement('canvas')
    mockCanvas.width = 800
    mockCanvas.height = 600

    const mockCtx = {
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    }
    vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D)
  })

  afterEach(() => {
    rafCallbacks.clear()
    vi.restoreAllMocks()
  })

  it('returns a spawnParticles function', () => {
    const { result } = renderHook(() =>
      useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
    )
    expect(typeof result.current.spawnParticles).toBe('function')
  })

  describe('spawnParticles', () => {
    it('spawnParticles does not throw with valid coordinates', () => {
      const { result } = renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      expect(() => {
        act(() => {
          result.current.spawnParticles(400, 300)
        })
      }).not.toThrow()
    })

    it('spawnParticles can be called multiple times', () => {
      const { result } = renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      act(() => {
        result.current.spawnParticles(100, 100)
        result.current.spawnParticles(200, 200)
        result.current.spawnParticles(300, 300)
      })

      // Multiple calls should not throw
      expect(result.current.spawnParticles).toBeDefined()
    })

    it('spawnParticles uses canvas 2d context when RAF fires', () => {
      const { result } = renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      act(() => {
        result.current.spawnParticles(400, 300)
      })

      // draw() — which calls getContext('2d') — lives inside the RAF callback,
      // so we must flush RAF before asserting
      flushRAF()

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
    })
  })

  describe('RAF loop lifecycle', () => {
    it('starts RAF loop when canvas is available', () => {
      renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      // RAF should have been called at least once to start the loop
      expect(rafCounter).toBeGreaterThan(0)
    })

    it('cancels RAF on unmount', () => {
      const { unmount } = renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      const _rafCountBeforeUnmount = rafCounter
      unmount()

      // After unmount, no new RAFs should have been started beyond what was pending
      expect(rafCallbacks.size).toBe(0)
    })
  })

  describe('draw function (via RAF)', () => {
    it('calls clearRect on the canvas context during draw', () => {
      const { result } = renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      act(() => {
        result.current.spawnParticles(400, 300)
      })

      flushRAF()

      const ctx = mockCanvas.getContext('2d') as unknown as {
        clearRect: ReturnType<typeof vi.fn>
      }
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height)
    })
  })

  describe('null canvas guard', () => {
    it('does not throw when canvas ref is null', () => {
      const { result } = renderHook(() =>
        useCursorParticles({ current: null } as React.RefObject<HTMLCanvasElement>)
      )

      expect(() => {
        act(() => {
          result.current.spawnParticles(100, 100)
        })
      }).not.toThrow()
    })

    it('does not start RAF loop when canvas is null', () => {
      const countBefore = rafCounter
      renderHook(() =>
        useCursorParticles({ current: null } as React.RefObject<HTMLCanvasElement>)
      )

      // RAF should not have been called with a null canvas
      expect(rafCounter).toBe(countBefore)
    })
  })

  describe('visibility change', () => {
    it('cancels RAF when tab becomes hidden', () => {
      renderHook(() =>
        useCursorParticles({ current: mockCanvas } as React.RefObject<HTMLCanvasElement>)
      )

      const _rafsBeforeHidden = rafCounter

      act(() => {
        Object.defineProperty(document, 'hidden', { value: true, writable: true })
        document.dispatchEvent(new Event('visibilitychange'))
      })

      // After hiding, RAF should not have started new frames immediately
      // The visibility handler cancels the current RAF
      expect(rafCallbacks.size).toBe(0)
    })
  })
})
