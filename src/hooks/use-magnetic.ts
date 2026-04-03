import { useRef, useCallback } from 'react'

import { useMotionValue, useSpring } from 'framer-motion'

interface UseMagneticOptions {
  /** Pull strength 0–1, default 0.35 */
  strength?: number
  /** Influence radius in px, default 120 */
  radius?: number
}

const DEFAULT_STRENGTH = 0.35
const DEFAULT_RADIUS = 120

/**
 * Magnetic pull toward the element's center.
 *
 * Returns MotionValues for x/y displacement (origin = element center),
 * plus raw event handlers to attach to the element.
 *
 * Usage:
 *   const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic({ strength: 0.4 })
 *   <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x, y }}>
 */
export function useMagnetic(options: UseMagneticOptions = {}) {
  const { strength = DEFAULT_STRENGTH, radius = DEFAULT_RADIUS } = options

  // Displacement values — origin at element center (0,0)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Smooth spring return to origin
  const springX = useSpring(rawX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rawY, { stiffness: 200, damping: 20 })

  // Cache element rect to avoid layout thrash
  const rectRef = useRef<DOMRect | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget
      rectRef.current = el.getBoundingClientRect()

      const cx = rectRef.current.left + rectRef.current.width / 2
      const cy = rectRef.current.top + rectRef.current.height / 2

      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < radius) {
        const factor = (1 - distance / radius) * strength
        rawX.set(dx * factor)
        rawY.set(dy * factor)
      } else {
        rawX.set(0)
        rawY.set(0)
      }
    },
    [radius, strength, rawX, rawY]
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { x: springX, y: springY, handleMouseMove, handleMouseLeave }
}
