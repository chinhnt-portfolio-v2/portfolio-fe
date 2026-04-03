'use client'

import { useEffect } from 'react'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

import { SPRING_GENTLE } from '@/constants/motion'
import { useCursorStore } from '@/stores/cursorStore'

/** Base ring / dot sizes in pixels */
const RING_SIZE = 32
const RING_HOVER_SIZE = 56
const DOT_SIZE = 8

export function CustomCursor() {
  const prefersReduced = useReducedMotion()

  // MotionValues — read from Zustand store, never trigger React re-renders
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Subscribe to Zustand x/y changes and push into MotionValues.
  // `.set()` on MotionValues is NOT React setState — Framer Motion handles interpolation.
  // x/y in deps: effect re-runs when motion values change identity, which is fine.
  useEffect(() => {
    const unsub = useCursorStore.subscribe((state) => {
      x.set(state.x)
      y.set(state.y)
    })
    return unsub
  }, [x, y])

  const cursorType = useCursorStore((s) => s.cursorType)
  const isHovering = useCursorStore((s) => s.isHovering)
  const isClicking = useCursorStore((s) => s.isClicking)

  // Springs — take raw MotionValues, produce interpolated ones
  const ringSpringX = useSpring(x, { stiffness: 120, damping: 20 })
  const ringSpringY = useSpring(y, { stiffness: 120, damping: 20 })
  const dotSpringX = useSpring(x, { stiffness: 400, damping: 25 })
  const dotSpringY = useSpring(y, { stiffness: 400, damping: 25 })

  // Trail springs: decreasing stiffness → more lag toward the tail
  const trailStiffness = [200, 180, 160, 140] as const
  // eslint-disable-next-line react-hooks/rules-of-hooks -- intentional: constant-length array from known values
  const trailSpringsX = trailStiffness.map((s) => useSpring(x, { stiffness: s, damping: 20 }))
  // eslint-disable-next-line react-hooks/rules-of-hooks -- intentional: constant-length array from known values
  const trailSpringsY = trailStiffness.map((s) => useSpring(y, { stiffness: s, damping: 20 }))

  const dotSize = DOT_SIZE
  const trailSize = DOT_SIZE * 0.75

  if (prefersReduced) return null

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

      {/* Inner dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[10000] flex items-center justify-center will-change-transform rounded-full bg-brand"
        style={{
          x: dotSpringX,
          y: dotSpringY,
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
