import { useEffect, useRef } from 'react'

import { useCursorStore, cursorX, cursorY } from '@/stores/cursorStore'

/**
 * Attaches global mouse-move and mouse-down listeners.
 *
 * cursorX/Y are updated on every mousemove via rAF — no React re-renders,
 * no Zustand store writes for x/y. Zustand only holds isHovering/isClicking/cursorType.
 *
 * Guards:
 * - Touch devices: skips listener registration entirely
 */
export function useCustomCursor() {
  const { setClicking } = useCursorStore()
  const isTouchRef = useRef(false)

  useEffect(() => {
    isTouchRef.current =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    if (isTouchRef.current) return

    // rAF-synced mousemove — update MotionValues directly.
    // No React state, no Zustand → zero-overhead for the render thread.
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      })
    }

    const handleMouseDown = () => setClicking(true)
    const handleMouseUp = () => setClicking(false)
    const handleDocumentEnter = () => useCursorStore.getState().setHovering(true)
    const handleDocumentLeave = () => useCursorStore.getState().setHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleDocumentEnter)
    document.addEventListener('mouseleave', handleDocumentLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleDocumentEnter)
      document.removeEventListener('mouseleave', handleDocumentLeave)
    }
  }, [setClicking])
}
