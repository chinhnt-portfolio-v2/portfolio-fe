'use client'

import { motion, useSpring } from 'framer-motion'

import { SPRING_GENTLE } from '@/constants/motion'
import { useCursorStore, cursorX, cursorY } from '@/stores/cursorStore'

/** Base ring / dot sizes in pixels */
const RING_SIZE = 32
const RING_HOVER_SIZE = 56
const DOT_SIZE = 8

export function CustomCursor() {
  // cursorX/Y are module-level MotionValues — updated by useCustomCursor on every mousemove.
  // useSpring wraps them for interpolation (ring lag). No Zustand subscription for x/y.
  const ringSpringX = useSpring(cursorX, { stiffness: 120, damping: 20 })
  const ringSpringY = useSpring(cursorY, { stiffness: 120, damping: 20 })

  // Zustand: only for UI state that needs React re-renders
  const cursorType = useCursorStore((s) => s.cursorType)
  const isHovering = useCursorStore((s) => s.isHovering)
  const isClicking = useCursorStore((s) => s.isClicking)

  // Trail springs: decreasing stiffness → more lag toward the tail
  const trailStiffness = [200, 180, 160, 140] as const
  // eslint-disable-next-line react-hooks/rules-of-hooks -- intentional: constant-length array from known values
  const trailSpringsX = trailStiffness.map((s) => useSpring(cursorX, { stiffness: s, damping: 20 }))
  // eslint-disable-next-line react-hooks/rules-of-hooks -- intentional: constant-length array from known values
  const trailSpringsY = trailStiffness.map((s) => useSpring(cursorY, { stiffness: s, damping: 20 }))

  const dotSize = DOT_SIZE
  const trailSize = DOT_SIZE * 0.75

  return (
    <>
      {/* Outer ring */}
      <motion.div
        data-testid="custom-cursor"
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] will-change-transform rounded-full"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? RING_HOVER_SIZE : RING_SIZE,
          height: isHovering ? RING_HOVER_SIZE : RING_SIZE,
          scale: isClicking ? 0.85 : 1,
          opacity: cursorType === 'default' ? 0.6 : 1,
        }}
        transition={SPRING_GENTLE}
      />

      {/* Inner dot — uses raw cursorX/Y for zero-lag tracking */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[10000] flex items-center justify-center will-change-transform rounded-full bg-brand"
        style={{
          x: cursorX,
          y: cursorY,
          width: dotSize,
          height: dotSize,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: isClicking ? 1.4 : 1 }}
        transition={{ stiffness: 400, damping: 25 }}
      />

      {/* Trail dots */}
      {trailSpringsX.map((sx, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed z-[9999] rounded-full bg-brand will-change-transform"
          style={{
            x: sx,
            y: trailSpringsY[i],
            width: trailSize,
            height: trailSize,
            translateX: '-50%',
            translateY: '-50%',
            opacity: 0.4 - i * 0.08,
          }}
          transition={{ stiffness: 400, damping: 25 }}
        />
      ))}
    </>
  )
}
