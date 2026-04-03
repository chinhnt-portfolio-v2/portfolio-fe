import { useEffect, useRef } from 'react'

import { useMotionValue } from 'framer-motion'

import { useCursorStore } from '@/stores/cursorStore'

/**
 * Attaches global mouse-move and mouse-down listeners to update the cursor store.
 *
 * Guards:
 * - Touch devices: skips listener registration entirely
 * - Always registers listeners; the `data-cursor-active` guard only controls whether
 *   the CustomCursor component renders — not whether events are tracked
 *   (tracking can start before the UI renders without any downside).
 */
export function useCustomCursor() {
  const { setPosition, setClicking } = useCursorStore()

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const isTouchRef = useRef(false)

  useEffect(() => {
    isTouchRef.current =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    if (isTouchRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition(e.clientX, e.clientY)
    }

    const handleMouseDown = () => {
      setClicking(true)
    }

    const handleMouseUp = () => {
      setClicking(false)
    }

    // Track hovering globally via document enter/leave
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
  }, [setPosition, setClicking])

  return { x, y }
}

/** Raw event handler refs — exportable for manual attachment if needed */
export const rawMouseMoveHandler = (e: MouseEvent) => {
  useCursorStore.getState().setPosition(e.clientX, e.clientY)
}
export const rawMouseDownHandler = () => {
  useCursorStore.getState().setClicking(true)
}
export const rawMouseUpHandler = () => {
  useCursorStore.getState().setClicking(false)
}
