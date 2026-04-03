'use client'

import { useEffect, useRef } from 'react'

import { useCursorParticles } from '@/hooks/use-cursor-particles'
import { useCursorStore } from '@/stores/cursorStore'

/**
 * Fixed canvas overlay that renders particle bursts on mouse-down.
 * Sits above everything except the cursor ring/dot.
 * Pauses rendering when the tab is hidden (handled inside the hook).
 */
export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { spawnParticles } = useCursorParticles(canvasRef)
  const isActive = true

  // Resize canvas to fill viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Trigger particle burst on mouse-down
  useEffect(() => {
    if (!isActive) return

    const unsub = useCursorStore.subscribe(
      (state, prev) => {
        if (state.isClicking && !prev.isClicking) {
          spawnParticles(state.x, state.y)
        }
      }
    )

    return unsub
  }, [spawnParticles])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{ display: 'block' }}
    />
  )
}
